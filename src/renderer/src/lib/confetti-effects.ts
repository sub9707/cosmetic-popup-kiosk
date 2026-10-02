import confetti, { type CreateTypes, type Options } from "canvas-confetti";

// 흰색 + 밝은 테마 핑크(--event-primary 근사 hex)만 사용한다.
const CONFETTI_COLORS = ["#ffffff", "#ec3e72"];

/*
 * confetti 캔버스와 인스턴스는 앱 전체에서 하나만 만들어 계속 다시 쓴다.
 * 결과 화면이 뜰 때마다 새 캔버스를 만들면, 워커로 넘어간 화면 크기 캔버스가 해제되지 않고 쌓여
 * 수십 건 뒤에는 GPU 메모리가 GB 단위로 불어나 앱 전체가 느려진다.
 */
let stageCanvas: HTMLCanvasElement | null = null;
let stageInstance: CreateTypes | null = null;

/** App 이 항상 띄워 두는 캔버스를 등록한다 (ref 콜백). */
export function setConfettiCanvas(canvas: HTMLCanvasElement | null) {
  if (canvas) stageCanvas = canvas;
}

export function getConfetti(): CreateTypes | null {
  if (!stageCanvas) return null;
  if (!stageInstance) {
    // 해상도는 창 크기가 아니라 디자인 기준 캔버스 크기(810x1440 안팎)로 고정한다 — 화면이 커도 메모리가
    // 늘지 않고, 조각 크기·퍼지는 범위가 디자인을 확인한 화면과 같은 비율로 보인다.
    stageCanvas.width = stageCanvas.offsetWidth;
    stageCanvas.height = stageCanvas.offsetHeight;
    stageInstance = confetti.create(stageCanvas, { resize: false, useWorker: true });
  }
  return stageInstance;
}

/** canvas-confetti 데모의 "Realistic Look" 프리셋. 결과 등장 시 한 번 터뜨린다. */
export function fireRealisticConfetti(instance: CreateTypes) {
  const count = 200;
  const defaults: Options = { origin: { y: 0.7 }, colors: CONFETTI_COLORS };

  function fire(particleRatio: number, opts: Options) {
    instance({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

/** canvas-confetti 데모의 "Snow" 프리셋. isCancelled가 true를 반환하면 다음 프레임에서 멈춘다. */
export function fireSnowConfetti(instance: CreateTypes, durationMs: number, isCancelled: () => boolean) {
  const animationEnd = Date.now() + durationMs;
  let skew = 1;

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  (function frame() {
    if (isCancelled()) return;

    const timeLeft = animationEnd - Date.now();
    const ticks = Math.max(200, 500 * (timeLeft / durationMs));
    skew = Math.max(0.8, skew - 0.001);

    instance({
      particleCount: 1,
      startVelocity: 0,
      ticks,
      origin: { x: Math.random(), y: Math.random() * skew - 0.2 },
      colors: CONFETTI_COLORS,
      shapes: ["circle"],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  })();
}
