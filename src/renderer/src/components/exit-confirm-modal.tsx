import { useUiText } from "@/lib/i18n";

interface ExitConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

/** 앱 종료 확인 모달. 키오스크 모드에서는 OS 기본 confirm 대화상자를 쓰지 않는다. */
export function ExitConfirmModal({ onConfirm, onCancel }: ExitConfirmModalProps) {
  const text = useUiText();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="flex w-full max-w-xs flex-col items-center gap-7 rounded-2xl border-2 border-event-primary bg-background p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-lg font-medium text-foreground">{text.exitConfirm}</p>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full bg-event-primary-soft py-3.5 text-base font-semibold text-event-primary transition-colors active:scale-95"
          >
            {text.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-event-primary py-3.5 text-base font-semibold text-event-primary-foreground transition-colors active:scale-95"
          >
            {text.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
