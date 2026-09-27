import { useEffect, useState } from "react";
import { MainScreen } from "@/components/main-screen";
import { RecommendationLoading } from "@/components/recommendation-loading";
import { ResultScreen } from "@/components/result-screen";
import { SurveyFlow } from "@/components/survey-flow";
import { flushPendingParticipants } from "@/lib/participant-save";
import { playSound } from "@/lib/sound";
import type { ChoiceLabel, EventSurveyQuestion } from "@shared/types";

type Screen = "main" | "quiz" | "loading" | "result";

/** 메인 → 설문 → 로딩 → 결과 → N초 후 메인 상태 머신. */
export function App() {
  const [screen, setScreen] = useState<Screen>("main");
  const [questions, setQuestions] = useState<EventSurveyQuestion[] | null>(null);
  const [answers, setAnswers] = useState<ChoiceLabel[]>([]);

  // 문항을 못 불러오면 시작 버튼이 영영 비활성으로 남으므로, 성공할 때까지 3초마다 다시 시도한다.
  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    function load() {
      window.kiosk
        .getQuestions()
        .then((loaded) => {
          if (!cancelled) setQuestions(loaded);
        })
        .catch((err) => {
          console.error("[App] 문항 불러오기 실패, 3초 뒤 재시도", err);
          if (!cancelled) retryTimer = setTimeout(load, 3000);
        });
    }

    load();
    // 지난 실행에서 저장에 실패해 기기에 보관해 둔 참여 기록이 있으면 다시 저장한다.
    void flushPendingParticipants();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, []);

  if (screen === "quiz" && questions) {
    return (
      <SurveyFlow
        questions={questions}
        onComplete={(finalAnswers) => {
          setAnswers(finalAnswers);
          setScreen("loading");
          playSound("loading");
        }}
        onExit={() => setScreen("main")}
      />
    );
  }

  if (screen === "loading") {
    return (
      <RecommendationLoading
        onDone={() => {
          setScreen("result");
          playSound("result");
        }}
      />
    );
  }

  if (screen === "result") {
    return (
      <ResultScreen
        answers={answers}
        onReset={() => setScreen("main")}
      />
    );
  }

  return (
    <MainScreen
      onStart={() => {
        playSound("start");
        setScreen("quiz");
      }}
      startDisabled={!questions}
    />
  );
}
