import { ChevronLeft, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EventLogo } from "@/components/event-logo";
import { EventPageFrame } from "@/components/event-page-frame";
import { SurveyChoiceList } from "@/components/survey-choice-list";
import { SurveyProgressBar } from "@/components/survey-progress-bar";
import { SurveyQuestionText } from "@/components/survey-question-text";
import { EVENT_LOGO, EVENT_NAME } from "@/lib/constants";
import { useUiText } from "@/lib/i18n";
import { pressHandlers } from "@/lib/press";
import { playSound } from "@/lib/sound";
import type { ChoiceLabel, EventSurveyQuestion } from "@shared/types";

const AUTO_ADVANCE_DELAY_MS = 300;

const NAV_BUTTON_CLASS =
  "flex h-14 items-center gap-2 rounded-full border border-event-primary/25 bg-white px-7 text-[22px] font-semibold tracking-tight text-event-primary/80 shadow-[0_4px_14px_-6px_color-mix(in_oklch,var(--event-primary)_35%,transparent)] transition-all active:scale-95 active:bg-event-primary-soft active:text-event-primary disabled:invisible";

interface SurveyFlowProps {
  questions: EventSurveyQuestion[];
  onComplete: (answers: ChoiceLabel[]) => void;
  onExit: () => void;
}

export function SurveyFlow({ questions, onComplete, onExit }: SurveyFlowProps) {
  const text = useUiText();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ChoiceLabel>>({});
  // 자동 넘김 대기(300ms) 중 연타가 들어오면 문항이 두 칸씩 넘어가므로, 넘어갈 때까지 입력을 막는다.
  const advancingRef = useRef(false);
  // 자동 넘김 타이머 — 대기 중에 "처음으로"로 화면을 떠나면 반드시 취소해야 한다.
  // 안 그러면 마지막 문항 선택 직후 처음으로를 눌렀을 때 메인에서 로딩으로 넘어가고 결과까지 저장된다.
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
  }, []);

  const question = questions[step];
  const isLastStep = step === questions.length - 1;

  function handleSelect(choice: ChoiceLabel) {
    if (advancingRef.current) return;
    advancingRef.current = true;
    playSound("click");

    const nextAnswers = { ...answers, [question.id]: choice };
    setAnswers(nextAnswers);

    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      advancingRef.current = false;
      if (!isLastStep) {
        setStep((s) => s + 1);
        return;
      }
      onComplete(questions.map((q) => nextAnswers[q.id]));
    }, AUTO_ADVANCE_DELAY_MS);
  }

  function handleBack() {
    if (advancingRef.current) return;
    playSound("click");
    setStep((s) => s - 1);
  }

  return (
    <EventPageFrame>
      <div className="flex min-h-0 flex-1 flex-col justify-center px-12 pt-4">
        {/* 로고 + 진행률: 문항이 바뀌어도 그대로인 머리 부분. */}
        <div className="flex flex-col items-center gap-7">
          <EventLogo name={EVENT_NAME} logo={EVENT_LOGO} size="sm" />
          <SurveyProgressBar total={questions.length} current={step} />
        </div>

        {/* 문항이 바뀔 때마다 key 로 다시 마운트해 등장 애니메이션을 준다. */}
        <div key={question.id} className="question-enter mt-8 flex flex-col gap-9">
          {/* 문항 텍스트 자리를 3줄 높이로 예약해서, 아래 선택지 위치가 흔들리지 않게 한다. */}
          <div className="flex min-h-[180px] items-center justify-center">
            <SurveyQuestionText question={question} />
          </div>

          <SurveyChoiceList question={question} selected={answers[question.id]} onSelect={handleSelect} />
        </div>
      </div>

      {/* 대형 세로 모니터는 상단이 손에 닿지 않을 수 있어, 이동 버튼은 모두 하단에 모은다.
          이전 버튼은 첫 문항에서도 자리를 차지해(invisible) 레이아웃이 흔들리지 않는다. */}
      <nav className="flex h-28 shrink-0 items-center justify-between px-8">
        <button
          type="button"
          {...pressHandlers(handleBack)}
          disabled={step === 0}
          aria-hidden={step === 0}
          className={NAV_BUTTON_CLASS}
        >
          <ChevronLeft className="-ml-1 size-6" strokeWidth={2.25} />
          {text.back}
        </button>
        <button
          type="button"
          {...pressHandlers(() => {
            playSound("click");
            onExit();
          })}
          className={NAV_BUTTON_CLASS}
        >
          <RotateCcw className="size-5" strokeWidth={2.25} />
          {text.startOver}
        </button>
      </nav>
    </EventPageFrame>
  );
}
