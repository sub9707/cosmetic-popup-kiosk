import { app } from "electron";
import { logInfo } from "./store/log";

const FIRST_SNAPSHOT_MS = 30_000;
const INTERVAL_MS = 5 * 60_000;

let sessions = 0;

/** 저장된 참여 건수. 메모리 로그에 함께 남겨 증가 시점을 추적한다. */
export function countSession(): void {
  sessions += 1;
}

/** 프로세스별 메모리(MB)와 GPU 합성 상태 */
function snapshot(): string {
  const memory = app
    .getAppMetrics()
    .map((p) => {
      const label = p.type === "Utility" && p.name ? p.name : p.type;
      const kb = p.memory.privateBytes ?? p.memory.workingSetSize;
      return `${label}=${Math.round(kb / 1024)}MB`;
    })
    .join(" ");
  // GPU 프로세스가 반복해서 죽으면 소프트웨어 렌더링으로 전환되므로 함께 기록
  const compositing = app.getGPUFeatureStatus().gpu_compositing;
  return `uptime=${Math.round(process.uptime() / 60)}m sessions=${sessions} gpu_compositing=${compositing} ${memory}`;
}

/** 메모리 사용량을 주기적으로 로그에 기록 */
export function startMetricsLog(): void {
  const write = () => void logInfo("metrics", snapshot());
  setTimeout(write, FIRST_SNAPSHOT_MS);
  setInterval(write, INTERVAL_MS);
}
