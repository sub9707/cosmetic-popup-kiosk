import confetti from "canvas-confetti";
import { ChevronRight, RotateCcw, Sparkle } from "lucide-react";
import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
} from "react";
import { FloatingBubbles } from "@/components/floating-bubbles";
import {
  PRODUCT_ASSETS,
  RESULT_AUTO_RESET_ENABLED,
  RESULT_AUTO_RESET_SECONDS,
  RESULT_ROUTINES,
} from "@/lib/constants";
import {
  fireRealisticConfetti,
  fireSnowConfetti,
} from "@/lib/confetti-effects";
import { recommendChoice } from "@/lib/recommend";
import { saveParticipant } from "@/lib/participant-save";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import type { ChoiceLabel } from "@shared/types";

interface ResultScreenProps {
  answers: ChoiceLabel[];
  onReset: () => void;
}

// snow는 오래 지속되도록 realistic보다 훨씬 길게 잡는다.
const SNOW_DURATION_MS = 10000;

/**
 * PRODUCT_ASSETS 에 없는 제품용 자리표시자.
 */
function AssetBox({
  label,
  className,
  rounded = "rounded-2xl",
  style,
}: {
  label: string;
  className?: string;
  rounded?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center border-2 border-dashed border-event-primary/35 bg-event-primary/5 px-1 text-center text-[10px] leading-tight font-medium whitespace-pre-line text-event-primary/45",
        rounded,
        className,
      )}
      style={style}
    >
      {label}
    </div>
  );
}

/**
 * 결과 요소 등장 순서(ms). 흰 화면이 걷히는 동안(~700ms) 위에서부터 차례로 올라온다.
 * 한 번에 다 보이지 않게 하되, 전체가 2초 안에 끝나 기다리는 느낌은 없게 한다.
 */
const ENTER_DELAY = {
  logo: 150,
  card: 350,
  eyebrow: 550,
  headline: 650,
  product: 850,
  productStep: 160,
  desc: 1400,
  keyPoint: 1600,
  footer: 1800,
} as const;

const enterDelay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

const DESC_FONT_MAX = 20;
const DESC_FONT_MIN = 15;

/**
 * 설명 박스 문구는 데이터의 줄 구성(보통 3줄) 그대로 보여야 한다 — 줄마다 nowrap 으로 두고,
 * 가장 긴 줄이 박스 폭을 넘으면 넘지 않을 때까지 글자 크기를 0.5px 씩 줄인다.
 */
function useFitDescFont(deps: unknown) {
  const boxRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const overflows = () =>
      Array.from(box.children).some((line) => line.scrollWidth > line.clientWidth);

    function fit() {
      if (!box) return;
      let size = DESC_FONT_MAX;
      box.style.fontSize = `${size}px`;
      while (size > DESC_FONT_MIN && overflows()) {
        size -= 0.5;
        box.style.fontSize = `${size}px`;
      }
    }

    fit();
    // 결과 화면 폰트(S-Core Dream 굵기별 파일)는 처음 쓰일 때 내려받는다. 대체 폰트로 잰 크기로는
    // 실제 폰트에서 줄이 넘쳐 잘릴 수 있으니, 폰트가 다 들어오면 한 번 더 맞춘다.
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) fit();
    });
    return () => {
      cancelled = true;
    };
  }, [deps]);

  return boxRef;
}

/** 설문 완료 후 보여주는 추천 루틴 결과 화면. */
export function ResultScreen({ answers, onReset }: ResultScreenProps) {
  const choice = useMemo(() => recommendChoice(answers), [answers]);
  const routine = RESULT_ROUTINES[choice];
  const savedOnce = useRef(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const descBoxRef = useFitDescFont(routine);

  // 결과 등장 시 confetti + 눈발 연출.
  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const instance = confetti.create(canvas, { resize: true, useWorker: true });
    let cancelled = false;

    fireRealisticConfetti(instance);
    fireSnowConfetti(instance, SNOW_DURATION_MS, () => cancelled);

    return () => {
      cancelled = true;
      instance.reset();
    };
  }, []);

  useEffect(() => {
    if (!RESULT_AUTO_RESET_ENABLED) return;
    const timer = setTimeout(onReset, RESULT_AUTO_RESET_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [onReset]);

  useEffect(() => {
    if (savedOnce.current) return;
    savedOnce.current = true;
    void saveParticipant({ answers, result: routine.name });
  }, [answers, routine.name]);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden break-keep"
      style={{ background: "#fbecef" }}
    >
      <FloatingBubbles />

      {/* 상단 풍선 로고 + 좌우 하트 */}
      <div
        className="result-enter-drop relative z-10 flex w-full shrink-0 items-center justify-center"
        style={enterDelay(ENTER_DELAY.logo)}
      >
        <div className="result-logo-float relative w-[616px]">
          <img
            src="MFC-logo.png"
            alt="My First Collagen"
            className="block w-full"
            draggable={false}
          />
        </div>
        <img
          src="assets/heart.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute top-[48px] left-[46px] size-[56px] -rotate-[15deg]"
        />
        <img
          src="assets/heart.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute top-[42px] right-[10px] size-[92px] rotate-[18deg]"
        />
      </div>

      {/* 결과 카드 (+ 흰 박스 뒤에 깔리는 별 장식) */}
      <div
        className="result-enter relative z-10 mt-8 w-[738px] shrink-0"
        style={enterDelay(ENTER_DELAY.card)}
      >
        {/* 별 에셋들 — 흰 박스보다 아래 z-index라 박스 뒤로 비쳐 보인다. */}
        <img
          src="assets/star-top-right.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute -top-12 -right-10 z-0 size-[136px] rotate-[12deg]"
        />
        <img
          src="assets/star-bottom-left.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute -bottom-7 -left-7 z-0 size-[108px] -rotate-[12deg]"
        />
        <img
          src="assets/star-bottom-right.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute -right-6 -bottom-5 z-0 size-[84px] rotate-[15deg]"
        />

        <div className="relative z-10 rounded-[40px] bg-white/40 px-12 pt-14 pb-12 shadow-[0_24px_60px_-30px_rgba(220,120,150,0.4)] ring-1 ring-white/50">
          {/* 카드 좌상단 모서리에 걸치는 스마일 스티커 (박스 위) */}
          <img
            src="assets/smile.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute -top-7 -left-5 z-20 size-[58px]"
          />

          {/* 소제목 + 하이라이트 헤드라인 */}
          <div className="flex flex-col items-center gap-2 text-center">
            <p
              className="result-enter text-[24px] font-medium text-foreground"
              style={enterDelay(ENTER_DELAY.eyebrow)}
            >
              {routine.eyebrow}
            </p>
            <h2
              className="result-enter text-[34px] leading-tight font-black text-balance text-foreground"
              style={enterDelay(ENTER_DELAY.headline)}
            >
              <span className="box-decoration-clone bg-black/[0.07] px-2 py-1">
                {routine.headline}
              </span>
            </h2>
          </div>

          {/* 3단계 제품 (사이 > 화살표) */}
          <div className="relative mt-9 flex items-start justify-center gap-1">
            <img
              src="assets/glowy-girl.png"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute -top-3 right-0 -z-10 w-[94px] opacity-80"
            />
            {routine.products.map((product, i) => {
              const asset = PRODUCT_ASSETS[product.label];
              const productDelay = ENTER_DELAY.product + i * ENTER_DELAY.productStep;
              return (
                <Fragment key={`${product.label}-${i}`}>
                  {i > 0 && (
                    <div
                      className="result-enter-fade mt-[40px] flex h-[180px] items-center"
                      style={enterDelay(productDelay - ENTER_DELAY.productStep / 2)}
                    >
                      <span className="flex size-10 items-center justify-center rounded-full bg-event-primary/15 text-event-primary">
                        <ChevronRight className="size-6" />
                      </span>
                    </div>
                  )}
                  <div
                    className="result-enter-pop flex w-[180px] flex-col items-center gap-3"
                    style={enterDelay(productDelay)}
                  >
                    {/* 제품명은 한 줄 — 칸보다 조금 길면 양옆 여백으로 넘친다. */}
                    <p className="h-7 text-center text-[20px] leading-7 font-bold whitespace-nowrap text-event-primary">
                      {product.label}
                    </p>
                    <div className="flex h-[180px] items-end justify-center">
                      {asset ? (
                        <img
                          src={asset.src}
                          alt={product.label}
                          draggable={false}
                          className="w-auto object-contain"
                          style={{ height: asset.height }}
                        />
                      ) : (
                        <AssetBox
                          label={`${product.label}\n제품컷`}
                          className="h-[180px] w-[140px]"
                        />
                      )}
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>

          {/* 핑크 설명 박스 */}
          <div
            ref={descBoxRef}
            className="result-desc-box result-enter mt-8 rounded-[26px] px-6 py-6 text-center leading-relaxed text-white"
            style={enterDelay(ENTER_DELAY.desc)}
          >
            {routine.description.map((line, li) => (
              <p key={li} className="overflow-hidden whitespace-nowrap">
                {line.map((run, ri) => (
                  <span
                    key={ri}
                    className={run.bold ? "font-bold" : "font-normal"}
                  >
                    {run.text}
                  </span>
                ))}
              </p>
            ))}
          </div>

          {/* KEY POINT */}
          <div
            className="result-enter mt-7 flex flex-col items-center gap-2"
            style={enterDelay(ENTER_DELAY.keyPoint)}
          >
            <div className="flex items-center gap-2.5">
              <Sparkle
                aria-hidden="true"
                className="result-twinkle size-5 fill-[#f6a0bd] text-[#f6a0bd]"
              />
              <p className="result-keypoint-title text-[26px] font-black tracking-wide">
                KEY POINT
              </p>
              <Sparkle
                aria-hidden="true"
                className="result-twinkle size-5 fill-[#f6a0bd] text-[#f6a0bd]"
                style={{ animationDelay: "1.1s" }}
              />
            </div>
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[23px] font-bold text-event-primary">
              {routine.keyPoints.map((keyPoint, i) => (
                <Fragment key={keyPoint}>
                  {i > 0 && <span className="text-event-primary/40">|</span>}
                  <span>{keyPoint}</span>
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 브랜드 워드마크 — 로고 이미지를 핑크로 마스크 컬러링 */}
      <div
        aria-hidden="true"
        className="result-enter-fade relative z-10 mt-9 h-[72px] w-[236px] shrink-0"
        style={{
          ...enterDelay(ENTER_DELAY.footer),
          backgroundColor: "#e15d86",
          WebkitMaskImage: "url(biodance-logo.webp)",
          maskImage: "url(biodance-logo.webp)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />

      {/* 처음으로 — 눈에 띄지 않게 로고 아래 고스트 버튼 */}
      <button
        type="button"
        onClick={() => {
          playSound("click");
          onReset();
        }}
        style={enterDelay(ENTER_DELAY.footer)}
        className="result-enter-fade relative z-10 mt-4 flex shrink-0 items-center gap-2 rounded-full border border-event-primary/20 bg-white/40 px-6 py-2.5 text-[18px] font-medium text-event-primary/65 transition-colors active:bg-white/70 active:text-event-primary"
      >
        <RotateCcw className="size-4.5" />
        처음으로
      </button>

      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none absolute inset-0 z-40 h-full w-full"
      />

      <div
        className="result-whiteout pointer-events-none absolute inset-0 z-50 bg-white"
        aria-hidden="true"
      />
    </div>
  );
}
