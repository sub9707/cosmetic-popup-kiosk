import fs from "node:fs/promises";
import path from "node:path";
import { formatLocalDate, formatLocalDateTime } from "@shared/date";
import type { DailyCount, KioskStatistics, ParticipantInput, ParticipantRecord } from "@shared/types";
import { logError } from "./log";
import { configDir, counterFile, dataDir, dayFile } from "./paths";

/** 임시 파일에 쓰고 fsync 후 rename 해서 쓰기 도중 전원이 꺼져도 원본이 깨지지 않게 한다. */
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

/** JSONL 파싱. 비정상 종료로 잘린 줄 등 깨진 줄은 로그만 남기고 건너뛴다. */
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

/** 카운터 파일이 없거나 깨졌을 때 기존 기록의 최대 번호부터 이어서 발급하기 위해 사용한다. */
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

  // 카운터를 읽지 못한 경우에만 전체 기록을 조회해 복구
  const recorded = lastNo === null ? await maxRecordedNo() : 0;
  const no = Math.max(lastNo ?? 0, recorded) + 1;

  await fs.mkdir(configDir(), { recursive: true });
  await writeFileAtomic(counterFile(), JSON.stringify({ lastNo: no }));
  return no;
}

// 동시 저장 요청을 직렬화해 참여번호 중복을 막는다.
let saveQueue: Promise<unknown> = Promise.resolve();

/** 참여 기록을 일자별 파일에 즉시 append + fsync 한다. */
export function appendParticipant(input: ParticipantInput): Promise<{ no: number }> {
  const task = saveQueue.then(() => appendParticipantNow(input));
  saveQueue = task.catch(() => undefined);
  return task;
}

async function appendParticipantNow(input: ParticipantInput): Promise<{ no: number }> {
  try {
    await fs.mkdir(dataDir(), { recursive: true });

    // 재시도 건은 최초 완료 시각을 유지
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
