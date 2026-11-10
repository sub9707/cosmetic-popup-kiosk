import { useSyncExternalStore } from "react";
import { formatLocalDateTime } from "@shared/date";
import type { ParticipantInput } from "@shared/types";

/*
 * 참여 기록 저장.
 * 실패하면 재시도하고, 그래도 실패하면 localStorage 에 보관했다가 앱 시작 시 또는 다음 저장 성공 시 다시 저장한다.
 * 보관 중인 건수는 설정 창에 표시된다.
 */
const PENDING_KEY = "kiosk-pending-participants";
const RETRY_DELAYS_MS = [1000, 3000];

type PendingRecord = Required<Pick<ParticipantInput, "createdAt">> & ParticipantInput;

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
    // 보관도 실패하면 더 처리할 방법이 없다. 오류는 메인 프로세스 로그에 남아 있다.
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

/** 보관 중인 기록을 순서대로 다시 저장한다. 실패한 기록은 남겨 둔다. */
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
        // 다음 시도로 넘긴다.
      }
    }
    // 처리 중 새로 보관된 기록이 있을 수 있어 목록을 다시 읽고 저장된 것만 제외
    writePending(readPending().filter((record) => !saved.has(JSON.stringify(record))));
  })().finally(() => {
    flushing = null;
  });
  return flushing;
}

export async function saveParticipant(input: ParticipantInput): Promise<void> {
  const record: PendingRecord = { ...input, createdAt: input.createdAt ?? formatLocalDateTime(new Date()) };
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
