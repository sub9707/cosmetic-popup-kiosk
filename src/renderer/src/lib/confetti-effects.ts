import confetti, { type CreateTypes, type Options } from "canvas-confetti";

const CONFETTI_COLORS = ["#ffffff", "#ec3e72"];

// 캔버스와 인스턴스는 앱 전체에서 하나만 만들어 재사용한다.
// 결과 화면마다 새로 만들면 워커로 넘긴 캔버스가 해제되지 않아 GPU 메모리가 계속 늘어난다.
let stageCanvas: HTMLCanvasElement | null = null;
let stageInstance: CreateTypes | null = null;

export function setConfettiCanvas(canvas: HTMLCanvasElement | null) {
  if (canvas) stageCanvas = canvas;
}

export function getConfetti(): CreateTypes | null {
  if (!stageCanvas) return null;
  if (!stageInstance) {
    // 해상도를 창 크기가 아닌 디자인 기준 크기로 고정해 메모리 사용량과 연출 비율을 일정하게 유지
    stageCanvas.width = stageCanvas.offsetWidth;
    stageCanvas.height = stageCanvas.offsetHeight;
    stageInstance = confetti.create(stageCanvas, { resize: false, useWorker: true });
  }
  return stageInstance;
}

/** canvas-confetti "Realistic Look" 프리셋 */
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

/** canvas-confetti "Snow" 프리셋. isCancelled()가 true 면 다음 프레임에서 중단한다. */
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
