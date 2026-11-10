import fs from "node:fs/promises";
import { formatLocalDate, formatLocalDateTime } from "@shared/date";
import { logDir, logFile } from "./paths";

async function appendLog(now: Date, line: string): Promise<void> {
  try {
    await fs.mkdir(logDir(), { recursive: true });
    await fs.appendFile(logFile(formatLocalDate(now)), line, "utf-8");
  } catch {
    // 로그 기록 실패(디스크 부족 등)는 앱 동작에 영향을 주지 않도록 무시
  }
}

/** userData/logs/YYYY-MM-DD.log 에 오류를 기록한다. */
export async function logError(context: string, err: unknown): Promise<void> {
  const now = new Date();
  const detail = err instanceof Error ? (err.stack ?? err.message) : String(err);
  const line = `[${formatLocalDateTime(now)}] ${context}: ${detail}\n`;
  console.error(line);
  await appendLog(now, line);
}

/** 앱 시작, 렌더러 재로드, 메모리 사용량 등 운영 기록을 같은 파일에 남긴다. */
export async function logInfo(context: string, detail: string): Promise<void> {
  const now = new Date();
  await appendLog(now, `[${formatLocalDateTime(now)}] ${context}: ${detail}\n`);
}
