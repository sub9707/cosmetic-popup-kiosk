import type { EventSurveyQuestion } from "@shared/types";

/**
 * 문항 머리("Q1.")와 질문 본문을 한 덩어리로 가운데 정렬하고,
 * 같은 크기·굵기로 이어 붙인다.
 */
export function SurveyQuestionText({ question }: { question: EventSurveyQuestion }) {
  return (
    <p className="text-center text-[38px] leading-[1.55] font-bold tracking-tight text-balance whitespace-pre-line text-foreground">
      {`Q${question.order}.\n${question.question}`}
    </p>
  );
}
