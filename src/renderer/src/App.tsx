import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { MainScreen } from "@/components/main-screen";
import { RecommendationLoading } from "@/components/recommendation-loading";
import { ResultScreen } from "@/components/result-screen";
import { SurveyFlow } from "@/components/survey-flow";
import { HTML_LANG, LangProvider, type Lang } from "@/lib/i18n";
import { flushPendingParticipants } from "@/lib/participant-save";
import { QUESTIONS } from "@/lib/questions";
import { playSound } from "@/lib/sound";
import type { ChoiceLabel } from "@shared/types";

type Screen = "main" | "quiz" | "loading" | "result";

/** 메인 → 설문 → 로딩 → 결과 → N초 후 메인 상태 머신. */
export function App() {
  const [screen, setScreen] = useState<Screen>("main");
  const [answers, setAnswers] = useState<ChoiceLabel[]>([]);
  const [lang, setLang] = useState<Lang>("ko");
  const langValue = useMemo(() => ({ lang, setLang }), [lang]);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  // 메인으로 돌아오면 다음 관람객을 위해 한국어로 되돌린다.
  const goMain = useCallback(() => {
    setScreen("main");
    setLang("ko");
  }, []);

  // 지난 실행에서 저장에 실패해 기기에 보관해 둔 참여 기록이 있으면 다시 저장한다.
  useEffect(() => {
    void flushPendingParticipants();
  }, []);

  let content: ReactNode;
  if (screen === "quiz") {
    content = (
      <SurveyFlow
        questions={QUESTIONS[lang]}
        onComplete={(finalAnswers) => {
          setAnswers(finalAnswers);
          setScreen("loading");
          playSound("loading");
        }}
        onExit={goMain}
      />
    );
  } else if (screen === "loading") {
    content = (
      <RecommendationLoading
        onDone={() => {
          setScreen("result");
          playSound("result");
        }}
      />
    );
  } else if (screen === "result") {
    content = (
      <ResultScreen
        answers={answers}
        onReset={goMain}
      />
    );
  } else {
    content = (
      <MainScreen
        onStart={() => {
          playSound("start");
          setScreen("quiz");
        }}
      />
    );
  }

  return <LangProvider value={langValue}>{content}</LangProvider>;
}
