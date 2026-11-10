import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 메인 화면 CTA 배너. 화면 전체가 버튼이므로 span 으로 두고 눌림 효과는 부모의 group-active 로 처리한다. */
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
