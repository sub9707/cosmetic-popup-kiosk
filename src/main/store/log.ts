import fs from "node:fs/promises";
import { formatLocalDate, formatLocalDateTime } from "./date";
import { logDir, logFile } from "./paths";

/** 로그 기록 자체가 실패해도 앱 동작에는 영향을 주지 않는다. */
async function appendLog(now: Date, line: string): Promise<void> {
  try {
    await fs.mkdir(logDir(), { recursive: true });
    await fs.appendFile(logFile(formatLocalDate(now)), line, "utf-8");
  } catch {
    // 로그를 못 남기는 상황(디스크 가득 등)은 무시한다.
  }
}

/**
 * 현장에서 원인을 추적할 수 있도록 오류를 userData/logs/YYYY-MM-DD.log 에 남긴다.
 */
export async function logError(context: string, err: unknown): Promise<void> {
  const now = new Date();
  const detail = err instanceof Error ? (err.stack ?? err.message) : String(err);
  const line = `[${formatLocalDateTime(now)}] ${context}: ${detail}\n`;
  console.error(line);
  await appendLog(now, line);
}

/** 오류가 아닌 운영 기록(앱 시작, 화면 다시 불러오기, 메모리 사용량 등)을 같은 파일에 남긴다. */
export async function logInfo(context: string, detail: string): Promise<void> {
  const now = new Date();
  await appendLog(now, `[${formatLocalDateTime(now)}] ${context}: ${detail}\n`);
}
