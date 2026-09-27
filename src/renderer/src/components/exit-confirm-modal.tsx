interface ExitConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

/** 앱 종료 전 확인용 커스텀 프롬프트 (키오스크 모드라 OS 기본 confirm 대신 직접 구현). */
export function ExitConfirmModal({ onConfirm, onCancel }: ExitConfirmModalProps) {
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
        <p className="text-lg font-medium text-foreground">앱을 종료하시겠습니까?</p>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full bg-event-primary-soft py-3.5 text-base font-semibold text-event-primary transition-colors active:scale-95"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-event-primary py-3.5 text-base font-semibold text-event-primary-foreground transition-colors active:scale-95"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
