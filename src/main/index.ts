import { app, BrowserWindow, powerSaveBlocker } from "electron";
import { registerIpcHandlers } from "./ipc";
import { startMetricsLog } from "./metrics";
import { logError, logInfo } from "./store/log";
import { createWindow, focusMainWindow } from "./window";

// dev/prod 모두 userData 경로를 %APPDATA%\EventKiosk 로 고정
app.setName("EventKiosk");

// 중복 실행 시 참여번호 카운터 파일을 동시에 쓰게 되므로 단일 인스턴스만 허용
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => focusMainWindow());

  process.on("uncaughtException", (err) => void logError("main uncaughtException", err));
  process.on("unhandledRejection", (reason) => void logError("main unhandledRejection", reason));

  app.on("child-process-gone", (_event, details) => {
    void logError(
      "child-process-gone",
      `${details.type}${details.name ? ` (${details.name})` : ""} ${details.reason} (exitCode ${details.exitCode})`,
    );
  });

  app.whenReady().then(() => {
    powerSaveBlocker.start("prevent-display-sleep");

    void logInfo("app start", `v${app.getVersion()} electron ${process.versions.electron}`);
    startMetricsLog();

    registerIpcHandlers();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}
