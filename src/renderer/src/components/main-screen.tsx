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
 * 키오스크 초기 화면: 로고 → 띠 배너 → 모델 컷.
 *
 * 행사장 대형 터치 모니터에서는 배너만 정확히 누르는 사람보다 화면 아무 곳(특히 모델 컷)을
 * 누르는 사람이 많으므로, 화면 전체를 하나의 시작 버튼으로 만든다. 설정/종료 버튼은
 * EventPageFrame 이 이 버튼 바깥(형제)에 두므로 서로 간섭하지 않는다. 언어 토글도 같은 이유로 버튼 바깥에 둔다.
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
        {/* 배너 위아래를 같은 높이(basis-0 flex-1)로 나눠 배너가 항상 화면 세로 정중앙에 오게 한다. */}
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

          {/* 남는 높이에 맞춰 비율 그대로 줄어든다 — 잘리지 않고 하단 띠에 붙는다. */}
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
