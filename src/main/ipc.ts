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

  // userData 폴더 (data, config, logs)
  ipcMain.handle("kiosk:openDataFolder", () => shell.openPath(app.getPath("userData")));
}
