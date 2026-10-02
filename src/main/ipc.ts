import { app, ipcMain, BrowserWindow, shell } from "electron";
import type { ParticipantInput } from "@shared/types";
import { appendParticipant, getStatistics } from "./store/participants";
import { exportExcel } from "./excel/export";
import { countSession } from "./metrics";
import { getTitleBarVisible, setTitleBarVisible } from "./window";

export function registerIpcHandlers(): void {
  ipcMain.handle("kiosk:saveParticipant", async (_event, input: ParticipantInput) => {
    const saved = await appendParticipant(input);
    countSession();
    return saved;
  });

  ipcMain.handle("kiosk:getStatistics", () => getStatistics());

  ipcMain.handle("kiosk:exportExcel", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return exportExcel(win);
  });

  ipcMain.on("kiosk:quitApp", () => app.quit());

  ipcMain.handle("kiosk:getTitleBarVisible", () => getTitleBarVisible());

  ipcMain.on("kiosk:setTitleBarVisible", (_event, visible: boolean) => setTitleBarVisible(visible));

  // data(참여 기록)·config(참여번호)·logs 가 모두 들어 있는 userData 폴더를 연다.
  ipcMain.handle("kiosk:openDataFolder", () => shell.openPath(app.getPath("userData")));
}
