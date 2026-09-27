import { useSyncExternalStore } from "react";
import type { ParticipantInput } from "@shared/types";

/**
 * 참여 결과 저장 — 실패해도 조용히 사라지지 않게 한다.
 *  1) 즉시 저장을 시도하고, 실패하면 잠깐 뒤 두 번 더 시도한다.
 *  2) 그래도 실패하면 기기(localStorage)에 보관해 두고, 앱 시작 시·다음 저장 성공 시 다시 저장한다.
 *  3) 보관 중인 건수는 설정 창에 표시돼 스태프가 알 수 있다.
 */
const PENDING_KEY = "kiosk-pending-participants";
const RETRY_DELAYS_MS = [1000, 3000];

type PendingRecord = Required<Pick<ParticipantInput, "createdAt">> & ParticipantInput;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function nowLocalDateTime() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function readPending(): PendingRecord[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as PendingRecord[]) : [];
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
let pendingCount = readPending().length;

function writePending(records: PendingRecord[]) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(records));
  } catch {
    // 보관조차 실패하면 더 할 수 있는 게 없다 — 메인 프로세스 로그에는 이미 남아 있다.
  }
  pendingCount = records.length;
  listeners.forEach((listener) => listener());
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function saveWithRetry(record: PendingRecord): Promise<boolean> {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      await window.kiosk.saveParticipant(record);
      return true;
    } catch (err) {
      console.error("[participant-save] 저장 실패", err);
      if (attempt < RETRY_DELAYS_MS.length) await wait(RETRY_DELAYS_MS[attempt]);
    }
  }
  return false;
}

let flushing: Promise<void> | null = null;

/** 보관 중인 미저장 건을 차례로 다시 저장한다. 실패한 건은 그대로 남긴다. */
export function flushPendingParticipants(): Promise<void> {
  if (flushing) return flushing;
  flushing = (async () => {
    const pending = readPending();
    if (!pending.length) return;
    const saved = new Set<string>();
    for (const record of pending) {
      try {
        await window.kiosk.saveParticipant(record);
        saved.add(JSON.stringify(record));
      } catch {
        // 남겨 두고 다음 기회에 다시 시도한다.
      }
    }
    // 도는 동안 새로 보관된 건이 있을 수 있으니, 목록을 다시 읽어 저장된 것만 뺀다.
    writePending(readPending().filter((record) => !saved.has(JSON.stringify(record))));
  })().finally(() => {
    flushing = null;
  });
  return flushing;
}

export async function saveParticipant(input: ParticipantInput): Promise<void> {
  const record: PendingRecord = { ...input, createdAt: input.createdAt ?? nowLocalDateTime() };
  if (await saveWithRetry(record)) {
    void flushPendingParticipants();
    return;
  }
  writePending([...readPending(), record]);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePendingParticipantCount() {
  return useSyncExternalStore(subscribe, () => pendingCount);
}
