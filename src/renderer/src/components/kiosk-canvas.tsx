import { useEffect, useState, type ReactNode } from "react";

/** 디자인 기준 해상도 (9:16). 모든 화면의 px 값이 이 크기 기준이다. */
const DESIGN_WIDTH = 810;
const DESIGN_HEIGHT = 1440;

interface CanvasSize {
  scale: number;
  width: number;
  height: number;
}

function measure(): CanvasSize {
  const scale = Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT);
  return { scale, width: window.innerWidth / scale, height: window.innerHeight / scale };
}

/**
 * 창 크기와 관계없이 기준 해상도로 그린 화면을 비율에 맞춰 확대/축소한다.
 * 창 비율이 9:16 과 다르면 레터박스 대신 남는 방향으로 캔버스를 늘려 각 화면의 배경으로 채운다.
 */
export function KioskCanvas({ children }: { children: ReactNode }) {
  const [size, setSize] = useState<CanvasSize>(measure);

  useEffect(() => {
    function update() {
      setSize(measure());
    }
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-event-primary">
      <div
        className="shrink-0"
        style={{ width: size.width, height: size.height, transform: `scale(${size.scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
