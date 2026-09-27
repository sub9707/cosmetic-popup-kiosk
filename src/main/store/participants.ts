import fs from "node:fs/promises";
import path from "node:path";
import type { DailyCount, KioskStatistics, ParticipantInput, ParticipantRecord } from "@shared/types";
import { formatLocalDate, formatLocalDateTime } from "./date";
import { logError } from "./log";
import { configDir, counterFile, dataDir, dayFile } from "./paths";

/** 임시 파일에 쓰고 fsync 후 rename — 쓰는 도중 전원이 꺼져도 원본이 반쯤 쓰인 채로 남지 않는다. */
async function writeFileAtomic(filePath: string, content: string): Promise<void> {
  const tmp = `${filePath}.tmp`;
  const handle = await fs.open(tmp, "w");
  try {
    await handle.writeFile(content, "utf-8");
    await handle.sync();
  } finally {
    await handle.close();
  }
  await fs.rename(tmp, filePath);
}

/** 한 줄씩 파싱하되, 비정상 종료로 끝에 반쪽만 쓰인 줄 등 깨진 줄은 건너뛴다. */
function parseLines(raw: string, file: string): ParticipantRecord[] {
  const records: ParticipantRecord[] = [];
  raw.split("\n").forEach((line, i) => {
    if (!line.trim()) return;
    try {
      records.push(JSON.parse(line) as ParticipantRecord);
    } catch {
      void logError("participants parse", `${file} ${i + 1}번째 줄이 깨져 건너뜀: ${line.slice(0, 200)}`);
    }
  });
  return records;
}

async function readDayFile(file: string): Promise<ParticipantRecord[]> {
  const raw = await fs.readFile(path.join(dataDir(), file), "utf-8");
  return parseLines(raw, file);
}

async function listDayFiles(): Promise<string[]> {
  try {
    const files = await fs.readdir(dataDir());
    return files.filter((f) => f.endsWith(".jsonl")).sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
  }
}

/** 카운터 파일이 없거나 깨졌을 때, 저장된 기록 중 가장 큰 번호에서 이어간다 — 번호가 1로 되돌아가 겹치지 않게. */
async function maxRecordedNo(): Promise<number> {
  let max = 0;
  for (const file of await listDayFiles()) {
    for (const record of await readDayFile(file)) {
      if (typeof record.no === "number" && record.no > max) max = record.no;
    }
  }
  return max;
}

async function nextParticipantNo(): Promise<number> {
  let lastNo: number | null = null;
  try {
    const raw = await fs.readFile(counterFile(), "utf-8");
    const parsed = (JSON.parse(raw) as { lastNo?: unknown }).lastNo;
    if (typeof parsed === "number" && Number.isFinite(parsed)) lastNo = parsed;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") void logError("counter read", err);
  }

  // 카운터가 없거나 깨졌을 때만 기록 전체를 훑어 복구한다 (평소엔 매 저장마다 파일을 다 읽지 않게).
  const recorded = lastNo === null ? await maxRecordedNo() : 0;
  const no = Math.max(lastNo ?? 0, recorded) + 1;

  await fs.mkdir(configDir(), { recursive: true });
  await writeFileAtomic(counterFile(), JSON.stringify({ lastNo: no }));
  return no;
}

// 저장 요청이 겹쳐 들어와도 번호 발급 → 기록을 한 건씩 차례로 처리해 번호가 겹치지 않게 한다.
let saveQueue: Promise<unknown> = Promise.resolve();

/** 참여 완료 직후 즉시 append + fsync해서 비정상 종료에도 데이터가 남도록 한다. */
export function appendParticipant(input: ParticipantInput): Promise<{ no: number }> {
  const task = saveQueue.then(() => appendParticipantNow(input));
  saveQueue = task.catch(() => undefined);
  return task;
}

async function appendParticipantNow(input: ParticipantInput): Promise<{ no: number }> {
  try {
    await fs.mkdir(dataDir(), { recursive: true });

    // 재시도로 다시 들어온 건은 처음 완료 시각(createdAt)을 그대로 쓴다.
    const createdAt = input.createdAt ?? formatLocalDateTime(new Date());
    const no = await nextParticipantNo();
    const record: ParticipantRecord = {
      no,
      answers: input.answers,
      result: input.result,
      createdAt,
    };

    const line = `${JSON.stringify(record)}\n`;
    const handle = await fs.open(dayFile(createdAt.split("T")[0]), "a");
    try {
      await handle.appendFile(line, "utf-8");
      await handle.sync();
    } finally {
      await handle.close();
    }

    return { no };
  } catch (err) {
    await logError("appendParticipant", err);
    throw err;
  }
}

export async function getStatistics(): Promise<KioskStatistics> {
  const files = await listDayFiles();
  const byDate: DailyCount[] = [];

  for (const file of files) {
    const date = file.replace(/\.jsonl$/, "");
    const count = (await readDayFile(file)).length;
    byDate.push({ date, count });
  }

  const todayDate = formatLocalDate(new Date());
  const today = byDate.find((d) => d.date === todayDate) ?? { date: todayDate, count: 0 };

  return { today, byDate };
}

export async function readAllParticipants(): Promise<ParticipantRecord[]> {
  const records: ParticipantRecord[] = [];
  for (const file of await listDayFiles()) {
    records.push(...(await readDayFile(file)));
  }
  return records.sort((a, b) => a.no - b.no);
}
