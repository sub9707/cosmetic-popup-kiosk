import { app } from "electron";
import path from "node:path";

const userDataDir = () => app.getPath("userData");

export const configDir = () => path.join(userDataDir(), "config");
export const dataDir = () => path.join(userDataDir(), "data");
export const counterFile = () => path.join(configDir(), "counter.json");
export const dayFile = (date: string) => path.join(dataDir(), `${date}.jsonl`);
export const logDir = () => path.join(userDataDir(), "logs");
export const logFile = (date: string) => path.join(logDir(), `${date}.log`);
