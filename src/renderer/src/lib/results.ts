import type { ChoiceLabel } from "@shared/types";
import type { Lang } from "./i18n";

/** 제품 이미지와 표시 높이(px). 원본 높이에 같은 배율(약 0.82)을 적용해 제품 간 크기 비율을 맞췄다. */
export const PRODUCT_ASSETS = {
  bubbleBooster: { src: "assets/bubble-booster.png", height: 124 },
  tonerPad: { src: "assets/toner-pad.png", height: 110 },
  serum: { src: "assets/collagen-serum.png", height: 163 },
  cream: { src: "assets/collagen-cream.png", height: 149 },
  jellyMist: { src: "assets/collagen-mist.png", height: 175 },
  eyePatch: { src: "assets/collagen-eye-patch.png", height: 89 },
  maskPack: { src: "assets/collagen-mask-pack.png", height: 166 },
} satisfies Record<string, { src: string; height: number }>;

export type ProductId = keyof typeof PRODUCT_ASSETS;

const EN_PRODUCT_NAMES: Record<ProductId, string> = {
  bubbleBooster: "Bubble Booster",
  tonerPad: "Collagen Toner Pad",
  serum: "Collagen Serum",
  cream: "Collagen Cream",
  jellyMist: "Collagen Jelly Mist",
  eyePatch: "Collagen Eye Patch",
  maskPack: "Collagen Mask",
};

export const PRODUCT_NAMES: Record<Lang, Record<ProductId, string>> = {
  ko: {
    bubbleBooster: "버블부스터",
    tonerPad: "콜라겐 토너패드",
    serum: "콜라겐 세럼",
    cream: "콜라겐 크림",
    jellyMist: "콜라겐 젤리 미스트",
    eyePatch: "콜라겐 아이패치",
    maskPack: "콜라겐 마스크팩",
  },
  // 중국어, 일본어 화면에서도 제품명은 영문 표기를 사용
  zh: EN_PRODUCT_NAMES,
  ja: EN_PRODUCT_NAMES,
  en: EN_PRODUCT_NAMES,
};

export interface ResultRoutine {
  /** 사용 순서대로 나열한 추천 제품 3종 */
  products: [ProductId, ProductId, ProductId];
}

/** 최다 선택 라벨별 추천 루틴. A: 쌩얼, B: 데일리 메이크업, C: 풀메이크업, D: 중요한 날 전날 */
export const RESULT_ROUTINES: Record<ChoiceLabel, ResultRoutine> = {
  A: { products: ["bubbleBooster", "serum", "cream"] },
  B: { products: ["tonerPad", "serum", "jellyMist"] },
  C: { products: ["eyePatch", "serum", "jellyMist"] },
  D: { products: ["tonerPad", "serum", "maskPack"] },
};

/** 설명 문구 조각. bold 인 조각만 굵게 표시한다. */
export interface ResultTextRun {
  text: string;
  bold?: boolean;
}

export interface ResultCopy {
  /** 헤드라인 위 소제목 */
  eyebrow: string;
  /** 헤드라인. 한국어 값이 참여 기록의 result 로 저장된다. */
  headline: string;
  /** 설명 문구. 줄 단위 배열이며 각 줄은 줄바꿈 없이 한 줄로 표시된다. */
  description: ResultTextRun[][];
  /** KEY POINT 키워드 */
  keyPoints: string[];
}

export const RESULT_COPY: Record<Lang, Record<ChoiceLabel, ResultCopy>> = {
  ko: {
    A: {
      eyebrow: "오늘은 쌩얼 DAY!",
      headline: "쌩얼도 빛나는 촉촉 콜라겐 루틴!",
      description: [
        [{ text: "메이크업 없는 날엔 피부 자체 컨디션에 집중!" }],
        [{ text: "바르는 마스크팩 버블 부스터로 간편하게 케어", bold: true }, { text: "하고," }],
        [
          { text: "세럼과 크림으로 수분·보습을 채워", bold: true },
          { text: " 쫀쫀하고 촉촉한 피부로 마무리해보세요." },
        ],
      ],
      keyPoints: ["수분·보습", "데일리 케어", "쫀쫀한 피부"],
    },
    B: {
      eyebrow: "가볍게 꾸미는 데일리 DAY!",
      headline: "매일 챙기는 화잘먹 콜라겐 루틴!",
      description: [
        [{ text: "가벼운 메이크업이어도 화잘먹 피부 준비는 필수!" }],
        [
          { text: "토너패드로 피부결을 정돈", bold: true },
          { text: "하고, " },
          { text: "세럼으로 쫀쫀하게 준비", bold: true },
          { text: "한 뒤" },
        ],
        [{ text: "미스트로 촉촉한 피부 컨디션을", bold: true }, { text: " 틈틈이 유지해 보세요" }],
      ],
      keyPoints: ["피부결 정돈", "데일리 화잘먹", "수분 충전"],
    },
    C: {
      eyebrow: "오늘은 제대로 FULL MAKE-UP DAY!",
      headline: "풀메를 위한 쫀쫀 콜라겐 루틴",
      description: [
        [{ text: "풀메하는 날엔 디테일까지 빈틈없이 준비!" }],
        [
          { text: "아이패치로 눈가를 집중 케어", bold: true },
          { text: "하고 " },
          { text: "세럼으로 피부를 쫀쫀하게 준비", bold: true },
          { text: "한 뒤" },
        ],
        [
          { text: "외출 중에는 젤리 미스트로 언제 어디서나 촉촉하게 리프레시", bold: true },
          { text: "해 보세요" },
        ],
      ],
      keyPoints: ["눈가 집중 케어", "풀메 전 피부 준비", "수시 리프레시"],
    },
    D: {
      eyebrow: "내일은 정말 중요한 D-DAY!",
      headline: "집중 화잘먹 콜라겐 루틴!",
      description: [
        [{ text: "내일 화잘먹은 오늘 밤부터!" }],
        [
          { text: "토너패드로 피부결을 정돈", bold: true },
          { text: "하고 " },
          { text: "세럼으로 쫀쫀하게 채운", bold: true },
          { text: " 뒤," },
        ],
        [{ text: "마스크팩으로 집중 케어해", bold: true }, { text: " 내일의 화잘먹 피부를 준비해보세요." }],
      ],
      keyPoints: ["전날 집중 관리", "피부결 정돈", "내일의 화잘먹"],
    },
  },
  zh: {
    A: {
      eyebrow: "今天素颜DAY！",
      headline: "素颜也发光的水润胶原蛋白护肤法！",
      description: [
        [{ text: "不化妆的日子，专注肌肤本身的状态！" }],
        [{ text: "用涂抹式面膜Bubble Booster轻松护理", bold: true }, { text: "，" }],
        [{ text: "再用Serum和Cream补水保湿", bold: true }, { text: "，打造Q弹水润的肌肤吧。" }],
      ],
      keyPoints: ["补水保湿", "日常护理", "Q弹肌肤"],
    },
    B: {
      eyebrow: "轻妆日常DAY！",
      headline: "每天都服帖的胶原蛋白护肤法！",
      description: [
        [{ text: "即使是淡妆，上妆前的肌肤准备也必不可少！" }],
        [
          { text: "用Toner Pad整理肌理", bold: true },
          { text: "，" },
          { text: "用Serum打造Q弹肌肤", bold: true },
          { text: "，" },
        ],
        [{ text: "再用Mist随时保持水润", bold: true }, { text: "的肌肤状态吧。" }],
      ],
      keyPoints: ["整理肌理", "日常服帖", "补水充电"],
    },
    C: {
      eyebrow: "今天是全妆DAY！",
      headline: "为全妆打造的Q弹胶原蛋白护肤法",
      description: [
        [{ text: "全妆的日子，细节也要准备到位！" }],
        [
          { text: "用Eye Patch集中护理眼周", bold: true },
          { text: "，" },
          { text: "用Serum让肌肤Q弹", bold: true },
          { text: "，" },
        ],
        [{ text: "外出时用Jelly Mist随时随地水润焕新", bold: true }, { text: "吧。" }],
      ],
      keyPoints: ["眼周集中护理", "妆前肌肤准备", "随时焕新"],
    },
    D: {
      eyebrow: "明天是超重要的D-DAY！",
      headline: "集中打造服帖妆容的胶原蛋白护肤法！",
      description: [
        [{ text: "明天的服帖妆容从今晚开始！" }],
        [
          { text: "用Toner Pad整理肌理", bold: true },
          { text: "，" },
          { text: "用Serum补充弹润", bold: true },
          { text: "，" },
        ],
        [{ text: "再用Mask集中护理", bold: true }, { text: "，为明天的服帖肌肤做好准备。" }],
      ],
      keyPoints: ["前一天集中护理", "整理肌理", "明天的服帖妆容"],
    },
  },
  ja: {
    A: {
      eyebrow: "今日はすっぴんDAY！",
      headline: "すっぴんも輝く、うるおいコラーゲンルーティン！",
      description: [
        [{ text: "メイクしない日は肌そのもののコンディションに集中！" }],
        [{ text: "塗るマスク・Bubble Boosterで手軽にケア", bold: true }, { text: "して、" }],
        [{ text: "SerumとCreamでうるおいを満たし", bold: true }, { text: "、もちもち肌に仕上げましょう。" }],
      ],
      keyPoints: ["うるおい・保湿", "デイリーケア", "もちもち肌"],
    },
    B: {
      eyebrow: "ナチュラルメイクのデイリーDAY！",
      headline: "毎日の化粧ノリを高めるコラーゲンルーティン！",
      description: [
        [{ text: "薄めのメイクでも化粧ノリの良い肌づくりは必須！" }],
        [
          { text: "Toner Padでキメを整え", bold: true },
          { text: "、" },
          { text: "Serumでもっちり準備", bold: true },
          { text: "したら" },
        ],
        [{ text: "Mistでうるおった肌コンディションを", bold: true }, { text: "こまめにキープしましょう。" }],
      ],
      keyPoints: ["キメを整える", "デイリー化粧ノリ", "うるおいチャージ"],
    },
    C: {
      eyebrow: "今日はしっかりフルメイクDAY！",
      headline: "フルメイクのためのもちもちコラーゲンルーティン",
      description: [
        [{ text: "フルメイクの日は細部まで抜かりなく準備！" }],
        [
          { text: "Eye Patchで目元を集中ケア", bold: true },
          { text: "し、" },
          { text: "Serumで肌をもっちり整え", bold: true },
          { text: "たら" },
        ],
        [{ text: "外出中はJelly Mistでいつでもリフレッシュ", bold: true }, { text: "しましょう。" }],
      ],
      keyPoints: ["目元集中ケア", "メイク前の肌準備", "こまめにリフレッシュ"],
    },
    D: {
      eyebrow: "明日はとても大事なD-DAY！",
      headline: "化粧ノリを高める集中コラーゲンルーティン！",
      description: [
        [{ text: "明日の化粧ノリは今夜から！" }],
        [
          { text: "Toner Padでキメを整え", bold: true },
          { text: "、" },
          { text: "Serumでもっちり満たした", bold: true },
          { text: "後、" },
        ],
        [{ text: "Maskで集中ケアして", bold: true }, { text: "、明日の化粧ノリの良い肌を準備しましょう。" }],
      ],
      keyPoints: ["前日の集中ケア", "キメを整える", "明日の化粧ノリ"],
    },
  },
  en: {
    A: {
      eyebrow: "Bare-Face Day!",
      headline: "A Dewy Collagen Routine for Glowing Bare Skin!",
      description: [
        [{ text: "No makeup today? Focus on your skin's own condition!" }],
        [{ text: "Start with Bubble Booster, an easy apply-on mask", bold: true }, { text: "," }],
        [{ text: "then hydrate with serum and cream", bold: true }, { text: " for bouncy, dewy skin." }],
      ],
      keyPoints: ["Hydration", "Daily Care", "Bouncy Skin"],
    },
    B: {
      eyebrow: "Light Daily Makeup Day!",
      headline: "A Daily Collagen Routine for Makeup-Ready Skin!",
      description: [
        [{ text: "Even with light makeup, prepping your skin is a must!" }],
        [
          { text: "Smooth your texture with the toner pad", bold: true },
          { text: ", " },
          { text: "prep with serum", bold: true },
          { text: "," },
        ],
        [{ text: "and keep your skin dewy with the mist", bold: true }, { text: " all day long." }],
      ],
      keyPoints: ["Smooth Texture", "Makeup-Ready", "Hydration Boost"],
    },
    C: {
      eyebrow: "Full Makeup Day!",
      headline: "A Bouncy Collagen Routine for Full Glam",
      description: [
        [{ text: "On full makeup days, prep every detail!" }],
        [
          { text: "Focus on your eyes with the eye patch", bold: true },
          { text: ", " },
          { text: "prep with serum", bold: true },
          { text: "," },
        ],
        [{ text: "and refresh anytime with the jelly mist", bold: true }, { text: " when you're out." }],
      ],
      keyPoints: ["Eye Care", "Pre-Makeup Prep", "Anytime Refresh"],
    },
    D: {
      eyebrow: "Big D-Day Tomorrow!",
      headline: "An Intensive Collagen Routine for Makeup-Ready Skin!",
      description: [
        [{ text: "Tomorrow's flawless makeup starts tonight!" }],
        [
          { text: "Smooth your texture with the toner pad", bold: true },
          { text: ", " },
          { text: "fill up with serum", bold: true },
          { text: "," },
        ],
        [{ text: "then treat your skin with a mask", bold: true }, { text: " to get ready for tomorrow." }],
      ],
      keyPoints: ["Night-Before Care", "Smooth Texture", "Makeup-Ready"],
    },
  },
};
