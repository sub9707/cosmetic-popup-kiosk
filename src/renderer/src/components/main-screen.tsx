import { EventCtaBanner } from "@/components/event-cta-banner";
import { EventLogo } from "@/components/event-logo";
import { EventPageFrame } from "@/components/event-page-frame";
import { LanguageToggle } from "@/components/language-toggle";
import { EVENT_HERO, EVENT_LOGO, EVENT_NAME } from "@/lib/constants";
import { useUiText } from "@/lib/i18n";
import { pressHandlers } from "@/lib/press";

interface MainScreenProps {
  onStart: () => void;
}

/**
 * 시작 화면. 배너 대신 모델 이미지 등 다른 영역을 누르는 경우가 많아 화면 전체를 시작 버튼으로 만든다.
 * 설정/종료 버튼과 언어 토글은 이 버튼 바깥에 둔다.
 */
export function MainScreen({ onStart }: MainScreenProps) {
  const text = useUiText();

  return (
    <EventPageFrame showAdminControls>
      <button
        type="button"
        {...pressHandlers(onStart)}
        aria-label={text.landingCta}
        className="group flex min-h-0 flex-1 flex-col"
      >
        {/* 배너 위아래 영역을 같은 비율로 나눠 배너를 세로 중앙에 둔다. */}
        <div className="flex min-h-0 w-full flex-1 basis-0 items-center justify-center px-16 py-10">
          <EventLogo name={EVENT_NAME} logo={EVENT_LOGO} size="lg" />
        </div>

        <div className="w-full shrink-0 px-12">
          <EventCtaBanner>{text.landingCta}</EventCtaBanner>
        </div>

        <div className="flex min-h-0 w-full flex-1 basis-0 flex-col">
          <p className="touch-hint mt-6 w-full shrink-0 text-center text-[24px] font-semibold text-event-primary">
            {text.touchToStart}
          </p>

          <img
            src={EVENT_HERO.src}
            alt=""
            width={EVENT_HERO.width}
            height={EVENT_HERO.height}
            className="mt-4 min-h-0 w-full flex-1 object-contain object-bottom"
            draggable={false}
          />
        </div>
      </button>

      <LanguageToggle className="absolute top-6 right-6 z-20" />
    </EventPageFrame>
  );
}
