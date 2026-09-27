import { app } from "electron";
import path from "node:path";

const userDataDir = () => app.getPath("userData");

export const configDir = () => path.join(userDataDir(), "config");
export const dataDir = () => path.join(userDataDir(), "data");
export const questionsFile = () => path.join(configDir(), "questions.json");
export const counterFile = () => path.join(configDir(), "counter.json");
export const dayFile = (date: string) => path.join(dataDir(), `${date}.jsonl`);
/** 마지막으로 시드한 기본 문항의 해시 — 운영자가 손대지 않은 문항 파일만 새 기본값으로 갱신하는 데 쓴다. */
export const questionsSeedFile = () => path.join(configDir(), "questions.seed.json");
export const logDir = () => path.join(userDataDir(), "logs");
export const logFile = (date: string) => path.join(logDir(), `${date}.log`);
