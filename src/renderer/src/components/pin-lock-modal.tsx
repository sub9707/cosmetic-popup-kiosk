import { Delete } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PIN_CODE = "202609";
const DIGIT_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface PinLockModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

/** 설정 모달을 열기 전 매번 요구하는 숫자 비밀번호 게이트. 실제 보안 목적이 아니라 단순 접근 확인용. */
export function PinLockModal({ onSuccess, onCancel }: PinLockModalProps) {
  const [entered, setEntered] = useState("");
  const [shake, setShake] = useState(false);

  function handleDigit(digit: string) {
    if (shake || entered.length >= PIN_CODE.length) return;

    const next = entered + digit;
    setEntered(next);

    if (next.length === PIN_CODE.length) {
      if (next === PIN_CODE) {
        onSuccess();
      } else {
        setShake(true);
        setTimeout(() => {
          setEntered("");
          setShake(false);
        }, 500);
      }
    }
  }

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
        <p className="text-lg font-medium text-event-primary">비밀번호 입력</p>

        <div className={cn("flex gap-3", shake && "pin-shake")}>
          {Array.from({ length: PIN_CODE.length }, (_, i) => (
            <span
              key={i}
              className={cn(
                "size-3.5 rounded-full border-2 border-event-primary transition-colors",
                i < entered.length ? "bg-event-primary" : "bg-transparent",
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {DIGIT_KEYS.map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="flex size-16 items-center justify-center rounded-full bg-event-primary-soft text-2xl font-semibold text-event-primary transition-colors active:scale-95 active:bg-event-primary/30"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleDigit("0")}
            className="flex size-16 items-center justify-center rounded-full bg-event-primary-soft text-2xl font-semibold text-event-primary transition-colors active:scale-95 active:bg-event-primary/30"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => setEntered((prev) => prev.slice(0, -1))}
            aria-label="지우기"
            className="flex size-16 items-center justify-center rounded-full text-event-primary transition-colors active:scale-95 active:bg-event-primary-soft"
          >
            <Delete className="size-6" />
          </button>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-muted-foreground active:text-foreground"
        >
          취소
        </button>
      </div>
    </div>
  );
}
