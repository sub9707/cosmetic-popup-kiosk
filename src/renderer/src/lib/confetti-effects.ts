import type { CreateTypes, Options } from "canvas-confetti";

// 흰색 + 밝은 테마 핑크(--event-primary 근사 hex)만 사용한다.
const CONFETTI_COLORS = ["#ffffff", "#ec3e72"];

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
