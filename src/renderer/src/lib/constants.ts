export const EVENT_NAME = "My First Collagen";
export const EVENT_LOGO = { src: "MFC-logo.png", width: 1080, height: 524 };
export const EVENT_HERO = { src: "main-model.png", width: 1019, height: 954 };

/** 선택지에서 굵게 표시할 줄. 기본은 첫 줄이고, q5 는 제품명이 있는 마지막 줄을 강조한다. */
export type ChoiceEmphasis = "first" | "last";
export const CHOICE_EMPHASIS: Record<string, ChoiceEmphasis> = { q5: "last" };

/** 결과 화면에서 메인으로 자동 복귀하기까지의 시간(초). null 이면 자동 복귀하지 않는다. */
export const RESULT_AUTO_RESET_SECONDS: number | null = null;
