import { cn } from "@/lib/utils";

interface EventLogoProps {
  name: string;
  logo?: { src: string; width: number; height: number };
  size?: "lg" | "sm";
}

/** 행사 로고. lg는 메인 화면, sm은 설문 화면 상단용 (810px 폭 캔버스 기준). */
export function EventLogo({ name, logo, size = "lg" }: EventLogoProps) {
  if (logo) {
    return (
      <img
        src={logo.src}
        alt={name}
        width={logo.width}
        height={logo.height}
        className={cn("mx-auto h-auto w-full", size === "lg" ? "max-w-[660px]" : "max-w-[360px]")}
        draggable={false}
      />
    );
  }

  return (
    <h1
      className={cn(
        "text-center leading-tight font-extrabold tracking-tight text-event-primary",
        size === "lg" ? "text-7xl" : "text-5xl",
      )}
    >
      {name}
    </h1>
  );
}
