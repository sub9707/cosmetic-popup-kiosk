import type { ChoiceEmphasis } from "@/lib/constants";
import { pressHandlers } from "@/lib/press";
import { cn } from "@/lib/utils";
import type { ChoiceLabel } from "@shared/types";

interface ChoiceOptionProps {
  label: ChoiceLabel;
  text: string;
  emphasis?: ChoiceEmphasis;
  selected: boolean;
  onSelect: () => void;
}

/**
 * 설문 선택지 버튼. 텍스트를 \n 기준으로 줄을 나누고 한 줄만 굵게 강조한다.
 * 문항이 바뀌어도 버튼 위치가 유지되도록 최소 높이를 고정하고, 터치 화면이라 hover 없이 active 상태만 둔다.
 */
export function ChoiceOption({ label, text, emphasis = "first", selected, onSelect }: ChoiceOptionProps) {
  const lines = text.split("\n");
  const boldIndex = emphasis === "last" ? lines.length - 1 : 0;

  return (
    <button
      type="button"
      {...pressHandlers(onSelect)}
      aria-pressed={selected}
      className={cn(
        "relative flex min-h-[176px] w-full items-center justify-center rounded-lg border-2 py-5 pr-11 pl-[108px] text-center",
        "transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.985]",
        selected
          ? "border-event-primary bg-event-primary text-event-primary-foreground"
          : "border-event-primary/70 bg-background text-foreground active:bg-event-primary-soft",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 left-7 flex size-16 -translate-y-1/2 items-center justify-center rounded-full",
          "text-[34px] leading-none font-bold transition-colors duration-150",
          selected ? "bg-white text-event-primary" : "bg-event-primary text-event-primary-foreground",
        )}
      >
        {label}
      </span>

      <span className="flex flex-col gap-1.5">
        {lines.map((line, i) => (
          <span
            key={i}
            className={cn(
              "block text-balance",
              i === boldIndex
                ? "text-[29px] leading-[1.4] font-bold"
                : cn("text-[24px] leading-[1.45] font-normal", selected ? "text-white/85" : "text-foreground/65"),
            )}
          >
            {line}
          </span>
        ))}
      </span>
    </button>
  );
}
