import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { MainScreen } from "@/components/main-screen";
import { RecommendationLoading } from "@/components/recommendation-loading";
import { ResultScreen } from "@/components/result-screen";
import { SurveyFlow } from "@/components/survey-flow";
import { setConfettiCanvas } from "@/lib/confetti-effects";
import { HTML_LANG, LangProvider, type Lang } from "@/lib/i18n";
import { flushPendingParticipants } from "@/lib/participant-save";
import { QUESTIONS } from "@/lib/questions";
import { playSound } from "@/lib/sound";
import type { ChoiceLabel } from "@shared/types";

type Screen = "main" | "quiz" | "loading" | "result";

/*
 * 참여가 일정 건수 쌓이면 메인 화면 유휴 시점에 새로고침해 장시간 운영 중 누적된 메모리를 정리한다.
 * 미저장 기록과 음량 설정은 localStorage 에 있어 유지된다.
 */
const RELOAD_AFTER_SESSIONS = 50;
const RELOAD_IDLE_MS = 5000;
let sessionsSinceLoad = 0;

export function App() {
  const [screen, setScreen] = useState<Screen>("main");
  const [answers, setAnswers] = useState<ChoiceLabel[]>([]);
  const [lang, setLang] = useState<Lang>("ko");
  const langValue = useMemo(() => ({ lang, setLang }), [lang]);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  // 메인 복귀 시 언어를 한국어로 초기화
  const goMain = useCallback(() => {
    setScreen("main");
    setLang("ko");
  }, []);

  // 이전 실행에서 저장하지 못한 참여 기록 재저장
  useEffect(() => {
    void flushPendingParticipants();
  }, []);

  useEffect(() => {
    if (screen !== "main" || sessionsSinceLoad < RELOAD_AFTER_SESSIONS) return;
    const timer = setTimeout(() => window.location.reload(), RELOAD_IDLE_MS);
    // 대기 중 터치가 있으면 취소하고 다음 메인 복귀 때 다시 시도
    const cancel = () => clearTimeout(timer);
    window.addEventListener("pointerdown", cancel);
    return () => {
      cancel();
      window.removeEventListener("pointerdown", cancel);
    };
  }, [screen]);

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
          sessionsSinceLoad += 1;
          setScreen("result");
          playSound("result");
        }}
      />
    );
  } else if (screen === "result") {
    content = (
      <ResultScreen answers={answers} onReset={goMain} />
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

  return (
    <LangProvider value={langValue}>
      {content}
      {/* confetti 캔버스는 화면 전환과 관계없이 하나를 재사용한다 (confetti-effects.ts 참고) */}
      <canvas ref={setConfettiCanvas} className="pointer-events-none absolute inset-0 z-40 h-full w-full" />
    </LangProvider>
  );
}
