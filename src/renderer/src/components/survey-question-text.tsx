import type { EventSurveyQuestion } from "@shared/types";

/** "Q1." 머리와 질문 본문을 함께 표시 */
export function SurveyQuestionText({ question }: { question: EventSurveyQuestion }) {
  return (
    <p className="text-center text-[38px] leading-[1.55] font-bold tracking-tight text-balance whitespace-pre-line text-foreground">
      {`Q${question.order}.\n${question.question}`}
    </p>
  );
}
