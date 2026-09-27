import type { CSSProperties } from "react";

interface BubbleConfig {
  top: string;
  left: string;
  size: string;
  opacity: number;
  rotateDeg: number;
  durationSec: number;
  delaySec: number;
  driftX: number;
  driftY: number;
}

// 화면 가장자리(좌우 끝 + 상하 끝)에만 배치해 중앙 콘텐츠를 가리지 않는다.
// 각도와 크기를 크게 벌려서 같은 이미지를 복제한 티가 덜 나고 화면에 입체감이 생기게 한다.
const BUBBLES: BubbleConfig[] = [
  {
    top: "5%",
    left: "5%",
    size: "19%",
    opacity: 0.85,
    rotateDeg: 15,
    durationSec: 7,
    delaySec: 0,
    driftX: 30,
    driftY: -55,
  },
  {
    top: "7%",
    left: "90%",
    size: "14%",
    opacity: 0.7,
    rotateDeg: -35,
    durationSec: 5.5,
    delaySec: 1.2,
    driftX: -22,
    driftY: -38,
  },
  {
    top: "15%",
    left: "95%",
    size: "11%",
    opacity: 0.6,
    rotateDeg: 5,
    durationSec: 6.5,
    delaySec: 2.6,
    driftX: -16,
    driftY: -26,
  },
  {
    top: "24%",
    left: "3%",
    size: "16%",
    opacity: 0.75,
    rotateDeg: 50,
    durationSec: 8,
    delaySec: 0.6,
    driftX: -26,
    driftY: -48,
  },
  {
    top: "28%",
    left: "93%",
    size: "24%",
    opacity: 0.8,
    rotateDeg: -45,
    durationSec: 7,
    delaySec: 2,
    driftX: 26,
    driftY: 40,
  },
  {
    top: "38%",
    left: "96%",
    size: "10%",
    opacity: 0.55,
    rotateDeg: 60,
    durationSec: 6,
    delaySec: 3.4,
    driftX: -18,
    driftY: 24,
  },
  {
    top: "48%",
    left: "2%",
    size: "12%",
    opacity: 0.7,
    rotateDeg: -20,
    durationSec: 7.5,
    delaySec: 2.4,
    driftX: 22,
    driftY: 42,
  },
  {
    top: "50%",
    left: "95%",
    size: "30%",
    opacity: 0.8,
    rotateDeg: 70,
    durationSec: 9,
    delaySec: 1.8,
    driftX: -28,
    driftY: 52,
  },
  {
    top: "58%",
    left: "3%",
    size: "11%",
    opacity: 0.6,
    rotateDeg: -30,
    durationSec: 6.2,
    delaySec: 0.4,
    driftX: 18,
    driftY: -28,
  },
  {
    top: "66%",
    left: "4%",
    size: "18%",
    opacity: 0.72,
    rotateDeg: 10,
    durationSec: 6,
    delaySec: 2.7,
    driftX: -24,
    driftY: -36,
  },
  {
    top: "70%",
    left: "91%",
    size: "14%",
    opacity: 0.7,
    rotateDeg: -55,
    durationSec: 7,
    delaySec: 3.5,
    driftX: 24,
    driftY: -40,
  },
  {
    top: "80%",
    left: "3%",
    size: "10%",
    opacity: 0.55,
    rotateDeg: 25,
    durationSec: 6.8,
    delaySec: 1.8,
    driftX: 16,
    driftY: 30,
  },
  {
    top: "88%",
    left: "8%",
    size: "22%",
    opacity: 0.75,
    rotateDeg: -60,
    durationSec: 6.5,
    delaySec: 3.2,
    driftX: 26,
    driftY: -46,
  },
  {
    top: "90%",
    left: "84%",
    size: "17%",
    opacity: 0.72,
    rotateDeg: 30,
    durationSec: 8.5,
    delaySec: 0.9,
    driftX: -30,
    driftY: -40,
  },
  {
    top: "97%",
    left: "48%",
    size: "11%",
    opacity: 0.6,
    rotateDeg: 40,
    durationSec: 8,
    delaySec: 1.5,
    driftX: 26,
    driftY: -36,
  },
  {
    top: "95%",
    left: "18%",
    size: "12%",
    opacity: 0.55,
    rotateDeg: -15,
    durationSec: 7.2,
    delaySec: 2.9,
    driftX: -20,
    driftY: -32,
  },
];

/**
 * 결과 화면 가장자리에 은은하게 떠다니는 장식용 방울들.
 * 항상 뒤(z-0)에 그려지고 DOM 순서상으로도 먼저 나오므로 다른 요소 위로 올라오지 않는다.
 */
export function FloatingBubbles() {
  return (
    <>
      {BUBBLES.map((bubble, i) => (
        <img
          key={i}
          src="bubble-pink.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="floating-bubble absolute z-0"
          style={
            {
              top: bubble.top,
              left: bubble.left,
              width: bubble.size,
              opacity: bubble.opacity,
              animationDuration: `${bubble.durationSec}s`,
              animationDelay: `${bubble.delaySec}s`,
              "--rotate": `${bubble.rotateDeg}deg`,
              "--drift-x": `${bubble.driftX}px`,
              "--drift-y": `${bubble.driftY}px`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}
