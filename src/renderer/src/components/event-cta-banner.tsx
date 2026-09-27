import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 메인 화면 CTA 띠 배너. 메인 화면에서는 화면 전체가 하나의 버튼이라
 * 이 배너 자체는 시각 요소(span)이고, 눌림 피드백은 부모 버튼의 group-active 로 받는다.
 */
export function EventCtaBanner({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "cta-shine relative block w-full overflow-hidden rounded-lg bg-event-primary px-6 py-7 text-center",
        "text-[40px] leading-none font-bold tracking-tight text-event-primary-foreground",
        "shadow-[0_14px_30px_-14px_var(--event-primary)] transition-transform duration-150 group-active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </span>
  );
}
