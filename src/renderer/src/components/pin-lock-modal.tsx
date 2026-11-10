import { Delete } from "lucide-react";
import { useState } from "react";
import { useUiText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PIN_CODE = "202609";
const DIGIT_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const SHAKE_DURATION_MS = 500;

const DIGIT_BUTTON_CLASS =
  "flex size-16 items-center justify-center rounded-full bg-event-primary-soft text-2xl font-semibold text-event-primary transition-colors active:scale-95 active:bg-event-primary/30";

interface PinLockModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

/** 설정 진입 전 PIN 확인. 보안 목적이 아니라 관람객의 오조작을 막기 위한 용도다. */
export function PinLockModal({ onSuccess, onCancel }: PinLockModalProps) {
  const text = useUiText();
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
        }, SHAKE_DURATION_MS);
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
        <p className="text-lg font-medium text-event-primary">{text.enterPin}</p>

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
            <button key={digit} type="button" onClick={() => handleDigit(digit)} className={DIGIT_BUTTON_CLASS}>
              {digit}
            </button>
          ))}
          <div />
          <button type="button" onClick={() => handleDigit("0")} className={DIGIT_BUTTON_CLASS}>
            0
          </button>
          <button
            type="button"
            onClick={() => setEntered((prev) => prev.slice(0, -1))}
            aria-label={text.deleteDigit}
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
          {text.cancel}
        </button>
      </div>
    </div>
  );
}
