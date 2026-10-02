import { app } from "electron";
import { logInfo } from "./store/log";

const FIRST_SNAPSHOT_MS = 30_000;
const INTERVAL_MS = 5 * 60_000;

let sessions = 0;

/** 참여 한 건이 저장될 때마다 센다 — 로그에서 "몇 건째부터 메모리가 늘었는지"를 볼 수 있게. */
export function countSession(): void {
  sessions += 1;
}

/** 프로세스별 메모리(MB)와 GPU 가속 상태를 한 줄로 만든다. */
function snapshot(): string {
  const memory = app
    .getAppMetrics()
    .map((p) => {
      const label = p.type === "Utility" && p.name ? p.name : p.type;
      const kb = p.memory.privateBytes ?? p.memory.workingSetSize;
      return `${label}=${Math.round(kb / 1024)}MB`;
    })
    .join(" ");
  // GPU 프로세스가 여러 번 죽으면 소프트웨어 렌더링으로 내려가 화면 전체가 느려진다 — 그 여부를 같이 남긴다.
  const compositing = app.getGPUFeatureStatus().gpu_compositing;
  return `uptime=${Math.round(process.uptime() / 60)}m sessions=${sessions} gpu_compositing=${compositing} ${memory}`;
}

/**
 * 메모리 사용량을 주기적으로 로그에 남긴다. 현장에서 앱이 느려졌을 때 메모리가 쌓여서인지를
 * 나중에 로그만 보고 가릴 수 있다.
 */
export function startMetricsLog(): void {
  const write = () => void logInfo("metrics", snapshot());
  setTimeout(write, FIRST_SNAPSHOT_MS);
  setInterval(write, INTERVAL_MS);
}
