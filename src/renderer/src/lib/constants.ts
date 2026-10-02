import { CHOICE_LABELS, type ChoiceLabel } from "@shared/types";

export { CHOICE_LABELS };
export type { ChoiceLabel };

export const EVENT_NAME = "My First Collagen";
export const EVENT_LOGO = { src: "MFC-logo.png", width: 1080, height: 524 };
/** 메인 화면 하단 모델 컷 */
export const EVENT_HERO = { src: "main-model.png", width: 1019, height: 954 };

/**
 * 선택지 여러 줄 중 굵게 강조할 줄. 기본은 첫 줄이고, 여기 적힌 문항만 마지막 줄을 강조한다.
 * q5 는 아래 줄이 제품명이라 그 줄을 굵게 한다.
 */
export type ChoiceEmphasis = "first" | "last";
export const CHOICE_EMPHASIS: Record<string, ChoiceEmphasis> = { q5: "last" };

/** 결과 화면 자동 초기화까지 남은 시간(초) */
export const RESULT_AUTO_RESET_SECONDS = 60;

/**
 * true 면 RESULT_AUTO_RESET_SECONDS 후 결과 화면이 자동으로 메인으로 돌아간다.
 * 현장 스태프가 직접 "처음으로"를 누르는 운영이라 기본은 꺼 둔다.
 */
export const RESULT_AUTO_RESET_ENABLED = false;
