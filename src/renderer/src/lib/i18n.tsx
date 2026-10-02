import { createContext, useContext, type ReactNode } from "react";

/** 관람객 화면 언어. 설정 창(운영자용)은 번역하지 않는다. */
export const LANGS = ["ko", "zh", "ja", "en"] as const;
export type Lang = (typeof LANGS)[number];

/** 언어 토글에 보이는 이름 — 각 언어 사용자가 자기 언어를 바로 알아보도록 그 언어로 적는다. */
export const LANG_LABELS: Record<Lang, string> = {
  ko: "한국어",
  zh: "中文",
  ja: "日本語",
  en: "English",
};

/** <html lang> 값 — 한자 글꼴·줄바꿈 규칙이 언어에 맞게 적용된다 (globals.css 의 :lang 규칙). */
export const HTML_LANG: Record<Lang, string> = {
  ko: "ko",
  zh: "zh-CN",
  ja: "ja",
  en: "en",
};

interface UiText {
  landingCta: string;
  touchToStart: string;
  back: string;
  startOver: string;
  loading: string;
  settings: string;
  exit: string;
  exitConfirm: string;
  cancel: string;
  confirm: string;
  enterPin: string;
  deleteDigit: string;
  language: string;
}

const UI_TEXT: Record<Lang, UiText> = {
  ko: {
    landingCta: "나에게 맞는 콜라겐 루틴 찾기",
    touchToStart: "화면을 터치하면 시작합니다",
    back: "이전",
    startOver: "처음으로",
    loading: "제품을 추천하고 있어요",
    settings: "설정",
    exit: "종료",
    exitConfirm: "앱을 종료하시겠습니까?",
    cancel: "취소",
    confirm: "확인",
    enterPin: "비밀번호 입력",
    deleteDigit: "지우기",
    language: "언어 선택",
  },
  zh: {
    landingCta: "找到我的专属胶原蛋白护肤法",
    touchToStart: "触摸屏幕即可开始",
    back: "上一步",
    startOver: "返回首页",
    loading: "正在为您推荐产品",
    settings: "设置",
    exit: "退出",
    exitConfirm: "确定要退出应用吗？",
    cancel: "取消",
    confirm: "确定",
    enterPin: "输入密码",
    deleteDigit: "删除",
    language: "选择语言",
  },
  ja: {
    landingCta: "私に合うコラーゲンルーティン診断",
    touchToStart: "画面をタッチしてスタート",
    back: "戻る",
    startOver: "最初に戻る",
    loading: "おすすめ製品を選んでいます",
    settings: "設定",
    exit: "終了",
    exitConfirm: "アプリを終了しますか？",
    cancel: "キャンセル",
    confirm: "OK",
    enterPin: "パスワード入力",
    deleteDigit: "削除",
    language: "言語選択",
  },
  en: {
    landingCta: "Find My Collagen Routine",
    touchToStart: "Touch the screen to start",
    back: "Back",
    startOver: "Start Over",
    loading: "Finding your products",
    settings: "Settings",
    exit: "Exit",
    exitConfirm: "Exit the app?",
    cancel: "Cancel",
    confirm: "OK",
    enterPin: "Enter password",
    deleteDigit: "Delete",
    language: "Language",
  },
};

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({ lang: "ko", setLang: () => {} });

export function LangProvider({ value, children }: { value: LangContextValue; children: ReactNode }) {
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** 현재 언어의 화면 문구. */
export function useUiText(): UiText {
  return UI_TEXT[useLang().lang];
}
