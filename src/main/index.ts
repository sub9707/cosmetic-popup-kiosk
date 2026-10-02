import { app, BrowserWindow, powerSaveBlocker } from "electron";
import { registerIpcHandlers } from "./ipc";
import { startMetricsLog } from "./metrics";
import { logError, logInfo } from "./store/log";
import { createWindow, focusMainWindow } from "./window";

// userData 경로를 dev/prod 모두 %APPDATA%\EventKiosk로 고정
app.setName("EventKiosk");

// 터치로 아이콘을 두 번 눌러 앱이 두 개 뜨면 참여번호 파일을 동시에 써서 번호가 겹칠 수 있다 — 한 개만 허용.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => focusMainWindow());

  process.on("uncaughtException", (err) => void logError("main uncaughtException", err));
  process.on("unhandledRejection", (reason) => void logError("main unhandledRejection", reason));

  // GPU 프로세스 등 렌더러 외 프로세스가 죽은 경우 — 화면이 느려지거나 깜빡인 원인을 로그로 추적한다.
  app.on("child-process-gone", (_event, details) => {
    void logError(
      "child-process-gone",
      `${details.type}${details.name ? ` (${details.name})` : ""} ${details.reason} (exitCode ${details.exitCode})`,
    );
  });

  app.whenReady().then(() => {
    // 행사 중 화면이 꺼지거나 잠금 화면으로 넘어가지 않게 한다.
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
