import { Power, Settings } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ExitConfirmModal } from "@/components/exit-confirm-modal";
import { PinLockModal } from "@/components/pin-lock-modal";
import { SettingsModal } from "@/components/settings-modal";

interface EventPageFrameProps {
  children: ReactNode;
  /** 설정/종료 버튼 노출 여부 (메인 화면에서만 켠다) */
  showAdminControls?: boolean;
}

type SettingsPhase = "closed" | "pin" | "modal";

/**
 * 메인/설문 화면 공통 레이아웃: 흰 바탕 + 상·하단 이벤트 핑크 띠.
 * 810x1440 캔버스 전체를 채운다.
 */
export function EventPageFrame({ children, showAdminControls = false }: EventPageFrameProps) {
  const [settingsPhase, setSettingsPhase] = useState<SettingsPhase>("closed");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  return (
    // 띠 밑 바탕도 핑크로 깐다 — 캔버스를 소수 배율로 확대하면 좌우 경계 픽셀이 반투명으로 그려져서,
    // 띠 아래가 흰색이면 그 흰색이 비쳐 띠 양끝에 얇은 흰 선이 생긴다.
    <div
      className="event-screen relative flex h-full w-full flex-col overflow-hidden bg-background"
      style={{
        background:
          "linear-gradient(to bottom, var(--event-primary) 36px, var(--background) 36px, var(--background) calc(100% - 36px), var(--event-primary) calc(100% - 36px))",
      }}
    >
      <div className="h-9 shrink-0 bg-event-primary" />
      <main className="relative flex min-h-0 flex-1 flex-col">{children}</main>
      <div className="h-9 shrink-0 bg-event-primary" />

      {showAdminControls && (
        // 운영자 전용 버튼이라 관람객 눈에 띄지 않게 작고 흐리게 둔다. 대형 세로 모니터는 상단이
        // 손에 닿지 않을 만큼 높으므로, 운영자도 편히 누를 수 있게 하단 띠 바로 위에 둔다.
        <div className="absolute right-5 bottom-14 z-20 flex gap-3">
          <button
            type="button"
            onClick={() => setSettingsPhase("pin")}
            aria-label="설정"
            className="flex size-14 items-center justify-center rounded-full bg-background/70 text-event-primary/60 ring-1 ring-event-primary/15 backdrop-blur-sm transition-colors active:bg-event-primary-soft active:text-event-primary"
          >
            <Settings className="size-7" />
          </button>
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            aria-label="종료"
            className="flex size-14 items-center justify-center rounded-full bg-background/70 text-event-primary/60 ring-1 ring-event-primary/15 backdrop-blur-sm transition-colors active:bg-event-primary-soft active:text-event-primary"
          >
            <Power className="size-7" />
          </button>
        </div>
      )}

      {settingsPhase === "pin" && (
        <PinLockModal onSuccess={() => setSettingsPhase("modal")} onCancel={() => setSettingsPhase("closed")} />
      )}

      {settingsPhase === "modal" && <SettingsModal onClose={() => setSettingsPhase("closed")} />}

      {showExitConfirm && (
        <ExitConfirmModal onConfirm={() => window.kiosk.quitApp()} onCancel={() => setShowExitConfirm(false)} />
      )}
    </div>
  );
}
