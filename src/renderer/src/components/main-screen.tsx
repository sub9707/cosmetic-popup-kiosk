import { EventCtaBanner } from "@/components/event-cta-banner";
import { EventLogo } from "@/components/event-logo";
import { EventPageFrame } from "@/components/event-page-frame";
import { EVENT_HERO, EVENT_LOGO, EVENT_NAME, LANDING_CTA } from "@/lib/constants";

interface MainScreenProps {
  onStart: () => void;
  startDisabled?: boolean;
}

/**
 * 키오스크 초기 화면: 로고 → 띠 배너 → 모델 컷.
 *
 * 행사장 대형 터치 모니터에서는 배너만 정확히 누르는 사람보다 화면 아무 곳(특히 모델 컷)을
 * 누르는 사람이 많으므로, 화면 전체를 하나의 시작 버튼으로 만든다. 설정/종료 버튼은
 * EventPageFrame 이 이 버튼 바깥(형제)에 두므로 서로 간섭하지 않는다.
 */
export function MainScreen({ onStart, startDisabled }: MainScreenProps) {
  return (
    <EventPageFrame showAdminControls>
      <button
        type="button"
        onClick={onStart}
        disabled={startDisabled}
        aria-label={LANDING_CTA}
        className="group flex min-h-0 flex-1 flex-col disabled:opacity-60"
      >
        {/* 배너 위아래를 같은 높이(basis-0 flex-1)로 나눠 배너가 항상 화면 세로 정중앙에 오게 한다. */}
        <div className="flex min-h-0 w-full flex-1 basis-0 items-center justify-center px-16 py-10">
          <EventLogo name={EVENT_NAME} logo={EVENT_LOGO} size="lg" />
        </div>

        <div className="w-full shrink-0 px-12">
          <EventCtaBanner>{LANDING_CTA}</EventCtaBanner>
        </div>

        <div className="flex min-h-0 w-full flex-1 basis-0 flex-col">
          <p className="touch-hint mt-6 w-full shrink-0 text-center text-[24px] font-semibold text-event-primary">
            화면을 터치하면 시작합니다
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
    </EventPageFrame>
  );
}
