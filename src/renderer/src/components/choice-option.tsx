import type { ChoiceEmphasis } from "@/lib/constants";
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
 * 설문 4지선다 옵션 하나 — 라벨(A~D)은 왼쪽 원형 배지로, 본문은 가운데 정렬하며,
 * 선택 시 이벤트 핑크로 가득 채워진다.
 *
 * 줄바꿈(\n)은 줄마다 block 으로 렌더링해서 데이터가 의도한 위치에서 끊기고, 그중 한 줄만
 * 굵게 강조한다. 버튼 높이를 min-h 로 고정해
 * 문항이 바뀌어도 4개 버튼 위치가 흔들리지 않게 한다.
 *
 * 터치 모니터라 hover 스타일은 두지 않는다 — 누르는 동안(active)만 옅은 핑크로 반응한다.
 */
export function ChoiceOption({ label, text, emphasis = "first", selected, onSelect }: ChoiceOptionProps) {
  const lines = text.split("\n");
  const boldIndex = emphasis === "last" ? lines.length - 1 : 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative flex min-h-[176px] w-full items-center justify-center rounded-lg border-2 py-5 pr-11 pl-[108px]",
        "text-center",
        "transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.985]",
        selected
          ? "border-event-primary bg-event-primary text-event-primary-foreground"
          : "border-event-primary/70 bg-background text-foreground active:bg-event-primary-soft",
      )}
    >
      {/* A~D 배지 — 선택 시 색을 뒤집는다. */}
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

      {/* 강조 줄은 크고 굵게, 나머지는 한 단계 작고 옅게 — 같은 크기로 두 줄이 붙으면 위계 없이
          한 덩어리로 읽힌다. text-wrap: balance 로 자동 줄바꿈 시 한 단어만 떨어지는 줄을 막는다. */}
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
