function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** 로컬 시간 기준 YYYY-MM-DD. toISOString()은 UTC 기준이라 자정 전후로 날짜가 달라진다. */
export function formatLocalDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 로컬 시간 기준 YYYY-MM-DDTHH:mm:ss */
export function formatLocalDateTime(d: Date): string {
  return `${formatLocalDate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
