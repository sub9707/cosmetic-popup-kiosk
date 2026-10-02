import { LANG_LABELS, LANGS, useLang, useUiText } from "@/lib/i18n";
import { pressHandlers } from "@/lib/press";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

/** 메인 화면 우상단 언어 선택 (한/중/일/영). */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const text = useUiText();

  return (
    <div
      role="group"
      aria-label={text.language}
      className={cn(
        "flex gap-1 rounded-full bg-white/85 p-1 ring-1 ring-event-primary/20 shadow-[0_4px_14px_-6px_color-mix(in_oklch,var(--event-primary)_35%,transparent)] backdrop-blur-sm",
        className,
      )}
    >
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          {...pressHandlers(() => {
            if (code === lang) return;
            playSound("click");
            setLang(code);
          })}
          className={cn(
            "flex h-12 items-center rounded-full px-4 text-[18px] font-semibold transition-colors active:scale-95",
            lang === code
              ? "bg-event-primary text-event-primary-foreground"
              : "text-event-primary/70 active:bg-event-primary-soft",
          )}
        >
          {LANG_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
