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
  // 자동 넘김 대기 중 연속 입력으로 문항을 건너뛰지 않도록 막는다.
  const advancingRef = useRef(false);
  // 대기 중 화면을 벗어나면 타이머를 취소해야 메인 화면에서 결과로 넘어가는 일이 없다.
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
        <div className="flex flex-col items-center gap-7">
          <EventLogo name={EVENT_NAME} logo={EVENT_LOGO} size="sm" />
          <SurveyProgressBar total={questions.length} current={step} />
        </div>

        {/* 문항마다 key 로 다시 마운트해 등장 애니메이션 적용 */}
        <div key={question.id} className="question-enter mt-8 flex flex-col gap-9">
          {/* 질문 영역 높이를 3줄로 고정해 선택지 위치를 유지 */}
          <div className="flex min-h-[180px] items-center justify-center">
            <SurveyQuestionText question={question} />
          </div>

          <SurveyChoiceList question={question} selected={answers[question.id]} onSelect={handleSelect} />
        </div>
      </div>

      {/* 세로 모니터에서 손이 닿도록 하단에 배치. 첫 문항에서 이전 버튼은 숨기되 자리는 유지한다. */}
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
