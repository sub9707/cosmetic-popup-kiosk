import fs from "node:fs/promises";
import { formatLocalDate, formatLocalDateTime } from "./date";
import { logDir, logFile } from "./paths";

/**
 * 현장에서 원인을 추적할 수 있도록 오류를 userData/logs/YYYY-MM-DD.log 에 남긴다.
 * 로그 기록 자체가 실패해도 앱 동작에는 영향을 주지 않는다.
 */
export async function logError(context: string, err: unknown): Promise<void> {
  const now = new Date();
  const detail = err instanceof Error ? (err.stack ?? err.message) : String(err);
  const line = `[${formatLocalDateTime(now)}] ${context}: ${detail}\n`;
  console.error(line);
  try {
    await fs.mkdir(logDir(), { recursive: true });
    await fs.appendFile(logFile(formatLocalDate(now)), line, "utf-8");
  } catch {
    // 로그를 못 남기는 상황(디스크 가득 등)은 무시한다.
  }
}
