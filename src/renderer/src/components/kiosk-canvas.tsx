import { useEffect, useState, type ReactNode } from "react";

/** 2560x1440 모니터에서 확인한 9:16 레이아웃 실측 크기. 디자인 기준 해상도를 고정하는 값이라 바꾸면 안 된다. */
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
 * 실제 창 크기와 무관하게 항상 DESIGN_WIDTH x DESIGN_HEIGHT 기준 배율로 그린 화면을 그대로 확대/축소해서
 * 보여준다. 해상도가 달라져도 폰트 크기, 이미지 크기가 달라지지 않는다.
 *
 * 창 비율이 9:16과 딱 맞지 않으면 남는 방향으로만 캔버스를 조금 늘려 창을 꽉 채운다 — 바깥 여백을
 * 따로 칠하면 화면마다 배경(흰 바탕+핑크 띠, 결과 화면 핑크 등)이 달라 경계가 드러나기 때문이다.
 * 각 화면은 가운데 정렬이라 늘어난 폭/높이는 자기 배경으로 자연스럽게 채워진다.
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
