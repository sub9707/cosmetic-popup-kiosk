import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { app } from "electron";
import { CHOICE_LABELS, type EventSurveyQuestion } from "@shared/types";
import defaultQuestions from "../../../build/questions.default.json";
import { logError } from "./log";
import { configDir, questionsFile, questionsSeedFile } from "./paths";

const DEFAULTS = defaultQuestions as EventSurveyQuestion[];

const hashOf = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

/** 운영자가 고친 파일이 화면을 깨뜨리지 않도록 최소한의 형태를 확인한다. */
function isValidQuestions(value: unknown): value is EventSurveyQuestion[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (q) =>
        q &&
        typeof q.id === "string" &&
        typeof q.order === "number" &&
        typeof q.question === "string" &&
        q.choices &&
        CHOICE_LABELS.every((label) => typeof q.choices[label] === "string"),
    )
  );
}

async function seedDefaults(): Promise<EventSurveyQuestion[]> {
  await fs.writeFile(questionsFile(), JSON.stringify(DEFAULTS, null, 2), "utf-8");
  await fs.writeFile(questionsSeedFile(), JSON.stringify({ hash: hashOf(DEFAULTS) }), "utf-8");
  return DEFAULTS;
}

async function readSeedHash(): Promise<string | null> {
  try {
    return (JSON.parse(await fs.readFile(questionsSeedFile(), "utf-8")) as { hash?: string }).hash ?? null;
  } catch {
    return null;
  }
}

/**
 * 첫 실행 시 기본 문항을 userData/config/questions.json으로 시드하고, 이후엔 그 파일을 읽어 반환한다.
 * 단, 개발 모드에서는 questions.default.json 수정이 바로 반영되도록 항상 기본 문항을 재시드한다.
 *
 * - 운영자가 손대지 않은 파일(마지막 시드와 같음)은 새 버전의 기본 문항으로 자동 갱신한다.
 * - 운영자가 고친 파일은 그대로 쓴다.
 * - 파일이 깨졌거나 형식이 틀리면 덮어쓰지 않고(고친 내용 보존) 이번 실행만 기본 문항으로 동작한다.
 */
export async function getQuestions(): Promise<EventSurveyQuestion[]> {
  await fs.mkdir(configDir(), { recursive: true });

  if (!app.isPackaged) return seedDefaults();

  let raw: string;
  try {
    raw = await fs.readFile(questionsFile(), "utf-8");
  } catch {
    return seedDefaults();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    await logError("questions.json 파싱 실패 — 기본 문항으로 동작 (파일은 그대로 둠)", err);
    return DEFAULTS;
  }
  if (!isValidQuestions(parsed)) {
    await logError("questions.json 형식 오류", "기본 문항으로 동작 (파일은 그대로 둠)");
    return DEFAULTS;
  }

  const fileHash = hashOf(parsed);
  const defaultsHash = hashOf(DEFAULTS);
  if (fileHash !== defaultsHash) {
    const seedHash = await readSeedHash();
    if (seedHash === fileHash) return seedDefaults();
  } else if ((await readSeedHash()) !== defaultsHash) {
    await fs.writeFile(questionsSeedFile(), JSON.stringify({ hash: defaultsHash }), "utf-8");
  }
  return parsed;
}
