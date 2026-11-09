// 키오스크 반복 참여 메모리 벤치마크.
// 실제 빌드된 앱(out/main/index.js)을 그대로 띄우고, 마우스 입력으로 메인 → 설문 5문항 → 로딩 → 결과 → 처음으로 를 반복한다.
// 매 회 메인으로 돌아온 뒤 app.getAppMetrics() 로 프로세스별 private 메모리를 기록한다 (앱의 metrics.ts 와 같은 기준).
// env: BENCH_DIR (빌드된 프로젝트 루트), BENCH_ITERS, BENCH_OUT (jsonl 경로), BENCH_LABEL, BENCH_RESULT_MS
const { app } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const DIR = process.env.BENCH_DIR;
const ITERS = Number(process.env.BENCH_ITERS || 60);
const OUT = process.env.BENCH_OUT;
const LABEL = process.env.BENCH_LABEL;
const RESULT_MS = Number(process.env.BENCH_RESULT_MS || 5000);
const SETTLE_MS = 2000; // 메인 복귀 후 측정까지 대기 (현재 버전의 5초 무입력 자동 새로고침보다 짧게)

app.setPath("userData", path.join(path.dirname(OUT), `userdata-${LABEL}`));
require(path.join(DIR, "out/main/index.js"));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.writeFileSync(OUT, "");
const write = (o) => fs.appendFileSync(OUT, JSON.stringify(o) + "\n");

function metrics() {
  const procs = {};
  let total = 0;
  for (const p of app.getAppMetrics()) {
    const label = p.type === "Utility" && p.name ? p.name : p.type;
    const mb = (p.memory.privateBytes ?? p.memory.workingSetSize) / 1024;
    procs[label] = Math.round(((procs[label] ?? 0) + mb) * 10) / 10;
    total += mb;
  }
  return { total: Math.round(total * 10) / 10, procs };
}

async function run(win) {
  const wc = win.webContents;
  wc.setAudioMuted(true);
  const js = (code) => wc.executeJavaScript(code, true);

  async function waitFor(expr, timeout = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await js(`!!(${expr})`)) return;
      await sleep(100);
    }
    throw new Error(`timeout waiting for ${expr}`);
  }

  async function click(expr) {
    const r = await js(`(() => { const el = ${expr}; if (!el) return null;
      const b = el.getBoundingClientRect(); return { x: Math.round(b.left + b.width / 2), y: Math.round(b.top + b.height / 2) }; })()`);
    if (!r) throw new Error(`not found: ${expr}`);
    wc.sendInputEvent({ type: "mouseMove", x: r.x, y: r.y });
    wc.sendInputEvent({ type: "mouseDown", x: r.x, y: r.y, button: "left", clickCount: 1 });
    await sleep(60);
    wc.sendInputEvent({ type: "mouseUp", x: r.x, y: r.y, button: "left", clickCount: 1 });
  }

  const MAIN_BTN = `document.querySelector('img[src*="main-model"]')?.closest('button')`;
  const CHOICE = `document.querySelector('button[aria-pressed]')`;
  const RESULT_RESET = `(!document.querySelector('button[aria-pressed]') && [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '처음으로'))`;

  // 결과 화면에서 confetti 가 도는 동안 실제 프레임 수 (가중 지연 확인용)
  const FPS = `new Promise(res => { let n = 0; const t0 = performance.now();
    (function f(t) { n++; if (t - t0 < 2000) requestAnimationFrame(f); else res(Math.round(n * 1000 / (t - t0))); })(t0); })`;

  // BENCH_FULLSCREEN=1: 세로 모니터에 전체화면으로 띄워 실제 키오스크 조건(1080x1920)에 맞춘다.
  if (process.env.BENCH_FULLSCREEN) {
    const { screen } = require("electron");
    const d = screen.getAllDisplays().find((x) => x.bounds.height > x.bounds.width) ?? screen.getPrimaryDisplay();
    win.setBounds(d.bounds);
    win.setFullScreen(true);
    await sleep(2000);
  }
  const size = await js(`[innerWidth, innerHeight, devicePixelRatio]`);
  await waitFor(MAIN_BTN);
  await sleep(5000);
  write({ iter: 0, t: Date.now(), size, ...metrics(), heap: await js(`Math.round(performance.memory.usedJSHeapSize / 1048576)`) });

  for (let i = 1; i <= ITERS; i++) {
    const t0 = Date.now();
    await click(MAIN_BTN);
    await waitFor(CHOICE);
    await sleep(500);
    let q = 0;
    while (await js(`!!${CHOICE}`)) {
      await click(CHOICE);
      q++;
      await sleep(800);
    }
    await waitFor(RESULT_RESET);
    const fps = await js(FPS); // 결과 등장 직후 confetti 가장 바쁠 때
    await sleep(Math.max(0, RESULT_MS - 2000));
    const resultMetrics = metrics();
    await click(RESULT_RESET);
    await waitFor(MAIN_BTN);
    await sleep(SETTLE_MS);
    const m = metrics();
    const heap = await js(`Math.round(performance.memory.usedJSHeapSize / 1048576)`);
    write({ iter: i, t: Date.now(), cycleMs: Date.now() - t0, questions: q, fps, resultTotal: resultMetrics.total, ...m, heap });
    console.log(`[${LABEL}] ${i}/${ITERS} total=${m.total}MB gpu=${m.procs.GPU}MB tab=${m.procs.Tab}MB fps=${fps}`);
  }
  app.exit(0);
}

app.on("browser-window-created", (_e, win) => {
  win.webContents.once("did-finish-load", () =>
    run(win).catch((err) => {
      write({ error: String(err && err.stack || err) });
      app.exit(1);
    }),
  );
});
