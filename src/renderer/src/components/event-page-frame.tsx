import { Power, Settings } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ExitConfirmModal } from "@/components/exit-confirm-modal";
import { PinLockModal } from "@/components/pin-lock-modal";
import { SettingsModal } from "@/components/settings-modal";
import { useUiText } from "@/lib/i18n";

interface EventPageFrameProps {
  children: ReactNode;
  /** 설정/종료 버튼 표시 (메인 화면 전용) */
  showAdminControls?: boolean;
}

type SettingsPhase = "closed" | "pin" | "modal";

const ADMIN_BUTTON_CLASS =
  "flex size-14 items-center justify-center rounded-full bg-background/70 text-event-primary/60 ring-1 ring-event-primary/15 backdrop-blur-sm transition-colors active:bg-event-primary-soft active:text-event-primary";

// 캔버스를 소수 배율로 확대하면 띠 양끝 경계 픽셀이 반투명하게 그려지므로, 흰 선이 비치지 않도록 바탕에도 띠 색을 깐다.
const FRAME_BACKGROUND =
  "linear-gradient(to bottom, var(--event-primary) 36px, var(--background) 36px, var(--background) calc(100% - 36px), var(--event-primary) calc(100% - 36px))";

/** 메인/설문 화면 공통 레이아웃 (흰 바탕 + 상하단 핑크 띠) */
export function EventPageFrame({ children, showAdminControls = false }: EventPageFrameProps) {
  const text = useUiText();
  const [settingsPhase, setSettingsPhase] = useState<SettingsPhase>("closed");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  return (
    <div
      className="event-screen relative flex h-full w-full flex-col overflow-hidden"
      style={{ background: FRAME_BACKGROUND }}
    >
      <div className="h-9 shrink-0 bg-event-primary" />
      <main className="relative flex min-h-0 flex-1 flex-col">{children}</main>
      <div className="h-9 shrink-0 bg-event-primary" />

      {/* 운영자용 버튼. 관람객 눈에 띄지 않게 작고 흐리게, 세로 모니터에서 손이 닿도록 하단에 둔다. */}
      {showAdminControls && (
        <div className="absolute right-5 bottom-14 z-20 flex gap-3">
          <button
            type="button"
            onClick={() => setSettingsPhase("pin")}
            aria-label={text.settings}
            className={ADMIN_BUTTON_CLASS}
          >
            <Settings className="size-7" />
          </button>
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            aria-label={text.exit}
            className={ADMIN_BUTTON_CLASS}
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
