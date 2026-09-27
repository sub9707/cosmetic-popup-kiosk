function pad(n: number, width = 2) {
  return String(n).padStart(width, "0");
}

/** 로컬 타임존 기준 YYYY-MM-DD (UTC 변환으로 인한 날짜 밀림 방지) */
export function formatLocalDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 로컬 타임존 기준 YYYY-MM-DDTHH:mm:ss */
export function formatLocalDateTime(d: Date): string {
  return `${formatLocalDate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
