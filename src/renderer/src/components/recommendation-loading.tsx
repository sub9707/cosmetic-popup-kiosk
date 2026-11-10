import { useEffect, type CSSProperties } from "react";
import { useUiText } from "@/lib/i18n";

// 연출 타이밍(ms)
const TOTAL_DURATION_MS = 2200;
const ORBIT_START_MS = 300;
const ORBIT_DURATION_MS = 1400;
const BUBBLE_FLASH_START_MS = 1900;
const BUBBLE_FLASH_DURATION_MS = 150;

// result-background.png 안 버블의 위치와 크기(%). 배경 이미지를 바꾸면 함께 수정해야 한다.
const BUBBLE_LEFT = 12;
const BUBBLE_TOP = 24;
const BUBBLE_WIDTH = 76;

const LOGO_TOP = 52;
const LOGO_WIDTH = 46;

const CIRCLE_WIDTH = 84;
const CIRCLE_OPACITY = 0.55;
const CIRCLE_TOP = 43;
const CIRCLE_LEFT = 50;

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const HEAD_DASH = 6;

export function RecommendationLoading({ onDone }: { onDone: () => void }) {
  const text = useUiText();

  useEffect(() => {
    const timer = setTimeout(onDone, TOTAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  const orbitTiming = {
    animationDelay: `${ORBIT_START_MS}ms`,
    animationDuration: `${ORBIT_DURATION_MS}ms`,
    "--circumference": CIRCUMFERENCE,
  } as CSSProperties;

  return (
    <div className="loading-enter relative h-full w-full overflow-hidden bg-background">
      <img
        src="result-background.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      <img
        src="result-circle.png"
        alt=""
        aria-hidden="true"
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          top: `${CIRCLE_TOP}%`,
          left: `${CIRCLE_LEFT}%`,
          width: `${CIRCLE_WIDTH}%`,
          opacity: CIRCLE_OPACITY,
        }}
        draggable={false}
      />

      <div
        className="absolute"
        style={{ left: `${BUBBLE_LEFT}%`, top: `${BUBBLE_TOP}%`, width: `${BUBBLE_WIDTH}%`, aspectRatio: "1 / 1" }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="orbit-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="var(--event-primary)" />
            </linearGradient>
          </defs>

          {/* 한 바퀴 채워진 뒤 그대로 멈추는 링 */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeLinecap="round"
            className="orbit-fill"
            strokeDasharray={CIRCUMFERENCE}
            style={orbitTiming}
          />

          {/* 링 끝단을 따라 이동하는 하이라이트 */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeLinecap="round"
            className="orbit-head"
            strokeDasharray={`${HEAD_DASH} ${CIRCUMFERENCE - HEAD_DASH}`}
            style={orbitTiming}
          />
        </svg>

        <span
          className="bubble-flash"
          aria-hidden="true"
          style={{ animationDelay: `${BUBBLE_FLASH_START_MS}ms`, animationDuration: `${BUBBLE_FLASH_DURATION_MS}ms` }}
        />

        <img
          src="biodance-logo.webp"
          alt="Biodance"
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${LOGO_TOP}%`, width: `${LOGO_WIDTH}%` }}
          draggable={false}
        />
      </div>

      <p className="loading-text absolute inset-x-0 bottom-[22%] text-center text-2xl font-light text-event-primary">
        {text.loading}
      </p>
    </div>
  );
}
