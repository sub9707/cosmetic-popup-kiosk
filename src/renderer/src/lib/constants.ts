import { CHOICE_LABELS, type ChoiceLabel } from "@shared/types";

export { CHOICE_LABELS };
export type { ChoiceLabel };

export const EVENT_NAME = "My First Collagen";
export const EVENT_LOGO = { src: "MFC-logo.png", width: 1080, height: 524 };
/** 메인 화면 하단 모델 컷 */
export const EVENT_HERO = { src: "main-model.png", width: 1019, height: 954 };
export const LANDING_CTA = "나에게 맞는 콜라겐 루틴 찾기";

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

/** 결과 설명 문구 조각. bold=true 인 조각만 강조 처리한다. */
export interface ResultTextRun {
  text: string;
  bold?: boolean;
}

/** 결과 화면에 노출되는 추천 루틴 3종 제품 하나. */
export interface ResultRoutineProduct {
  label: string;
}

/**
 * 제품 라벨 → 컷 이미지 + 표시 높이(px, 810x1440 기준).
 * 높이는 각 에셋 원본 픽셀 높이에 동일 배율(≈0.82)을 곱해 산출 → 제품끼리 실제 크기 비율이 유지된다.
 */
export const PRODUCT_ASSETS: Record<string, { src: string; height: number }> = {
  버블부스터: { src: "assets/bubble-booster.png", height: 124 },
  "콜라겐 토너패드": { src: "assets/toner-pad.png", height: 110 },
  "콜라겐 세럼": { src: "assets/collagen-serum.png", height: 163 },
  "콜라겐 크림": { src: "assets/collagen-cream.png", height: 149 },
  "콜라겐 젤리 미스트": { src: "assets/collagen-mist.png", height: 175 },
  "콜라겐 아이패치": { src: "assets/collagen-eye-patch.png", height: 89 },
  "콜라겐 마스크팩": { src: "assets/collagen-mask-pack.png", height: 166 },
};

/** 설문 최다 선택 라벨(A~D)에 대응하는 결과 루틴. */
export interface ResultRoutine {
  /** 참가자 기록/엑셀에 저장되는 짧은 결과명 */
  name: string;
  /** 헤드라인 위 작은 소제목 (예: "오늘은 쌩얼 DAY!") */
  eyebrow: string;
  /** 회색 하이라이트가 깔린 큰 헤드라인 */
  headline: string;
  /** 좌 → 우 3단계 제품 (사이에 > 화살표) */
  products: ResultRoutineProduct[];
  /** 핑크 박스 안 설명 문구 (줄 = 문구 조각 배열) */
  description: ResultTextRun[][];
  /** KEY POINT 아래 키워드 3개 */
  keyPoints: string[];
}

/**
 * 선택 비율(최다 선택 라벨)에 따른 결과 매핑.
 *  A → 오늘은 쌩얼 DAY  / B → 가볍게 꾸미는 데일리 DAY
 *  C → FULL MAKE-UP DAY / D → 내일은 정말 중요한 D-DAY
 * 제품 컷/크기는 라벨로 PRODUCT_ASSETS 에서 찾는다.
 */
export const RESULT_ROUTINES: Record<ChoiceLabel, ResultRoutine> = {
  A: {
    name: "오늘은 쌩얼 DAY",
    eyebrow: "오늘은 쌩얼 DAY!",
    headline: "쌩얼도 빛나는 촉촉 콜라겐 루틴!",
    products: [
      { label: "버블부스터" },
      { label: "콜라겐 세럼" },
      { label: "콜라겐 크림" },
    ],
    description: [
      [{ text: "메이크업 없는 날엔 피부 자체 컨디션에 집중!" }],
      [
        { text: "바르는 마스크팩 버블 부스터로 간편하게 케어", bold: true },
        { text: "하고," },
      ],
      [
        { text: "세럼과 크림으로 수분·보습을 채워", bold: true },
        { text: " 쫀쫀하고 촉촉한 피부로 마무리해보세요." },
      ],
    ],
    keyPoints: ["수분·보습", "데일리 케어", "쫀쫀한 피부"],
  },
  B: {
    name: "가볍게 꾸미는 데일리 DAY",
    eyebrow: "가볍게 꾸미는 데일리 DAY!",
    headline: "매일 챙기는 화잘먹 콜라겐 루틴!",
    products: [
      { label: "콜라겐 토너패드" },
      { label: "콜라겐 세럼" },
      { label: "콜라겐 젤리 미스트" },
    ],
    description: [
      [{ text: "가벼운 메이크업이어도 화잘먹 피부 준비는 필수!" }],
      [
        { text: "토너패드로 피부결을 정돈", bold: true },
        { text: "하고, " },
        { text: "세럼으로 쫀쫀하게 준비", bold: true },
        { text: "한 뒤" },
      ],
      [
        { text: "미스트로 촉촉한 피부 컨디션을", bold: true },
        { text: " 틈틈이 유지해 보세요" },
      ],
    ],
    keyPoints: ["피부결 정돈", "데일리 화잘먹", "수분 충전"],
  },
  C: {
    name: "오늘은 제대로 FULL MAKE-UP DAY",
    eyebrow: "오늘은 제대로 FULL MAKE-UP DAY!",
    headline: "풀메를 위한 쫀쫀 콜라겐 루틴",
    products: [
      { label: "콜라겐 아이패치" },
      { label: "콜라겐 세럼" },
      { label: "콜라겐 젤리 미스트" },
    ],
    description: [
      [{ text: "풀메하는 날엔 디테일까지 빈틈없이 준비!" }],
      [
        { text: "아이패치로 눈가를 집중 케어", bold: true },
        { text: "하고 " },
        { text: "세럼으로 피부를 쫀쫀하게 준비", bold: true },
        { text: "한 뒤" },
      ],
      [
        {
          text: "외출 중에는 젤리 미스트로 언제 어디서나 촉촉하게 리프레시",
          bold: true,
        },
        { text: "해 보세요" },
      ],
    ],
    keyPoints: ["눈가 집중 케어", "풀메 전 피부 준비", "수시 리프레시"],
  },
  D: {
    name: "내일은 정말 중요한 D-DAY",
    eyebrow: "내일은 정말 중요한 D-DAY!",
    headline: "집중 화잘먹 콜라겐 루틴!",
    products: [
      { label: "콜라겐 토너패드" },
      { label: "콜라겐 세럼" },
      { label: "콜라겐 마스크팩" },
    ],
    description: [
      [{ text: "내일 화잘먹은 오늘 밤부터!" }],
      [
        { text: "토너패드로 피부결을 정돈", bold: true },
        { text: "하고 " },
        { text: "세럼으로 쫀쫀하게 채운", bold: true },
        { text: " 뒤," },
      ],
      [
        { text: "마스크팩으로 집중 케어해", bold: true },
        { text: " 내일의 화잘먹 피부를 준비해보세요." },
      ],
    ],
    keyPoints: ["전날 집중 관리", "피부결 정돈", "내일의 화잘먹"],
  },
};
