import { app, BrowserWindow, powerSaveBlocker } from "electron";
import { registerIpcHandlers } from "./ipc";
import { logError } from "./store/log";
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

  app.whenReady().then(() => {
    // 행사 중 화면이 꺼지거나 잠금 화면으로 넘어가지 않게 한다.
    powerSaveBlocker.start("prevent-display-sleep");

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
