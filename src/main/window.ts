import { app, BrowserWindow, shell } from "electron";
import path from "node:path";
import { logError } from "./store/log";

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let titleBarVisible = false;

export function createWindow(): void {
  const showFrame = isDev || titleBarVisible;

  const win = new BrowserWindow({
    width: 720,
    height: 1280,
    minWidth: 480,
    minHeight: 800,
    resizable: showFrame,
    frame: showFrame,
    autoHideMenuBar: true,
    fullscreen: !showFrame,
    kiosk: !showFrame,
    backgroundColor: "#ffffff",
    ...(isDev ? { icon: path.join(app.getAppPath(), "build/icon.png") } : {}),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // 렌더러가 죽으면 흰 화면으로 멈추므로, 기록을 남기고 바로 다시 불러온다.
  // 시작하자마자 계속 죽는 경우 무한 재시작에 빠지지 않게 1분에 3번까지만 시도한다.
  const recentReloads: number[] = [];
  win.webContents.on("render-process-gone", (_event, details) => {
    void logError("render-process-gone", `${details.reason} (exitCode ${details.exitCode})`);
    if (details.reason === "clean-exit" || win.isDestroyed()) return;

    const now = Date.now();
    while (recentReloads.length && now - recentReloads[0] > 60_000) recentReloads.shift();
    if (recentReloads.length >= 3) return;
    recentReloads.push(now);
    win.webContents.reload();
  });
  win.webContents.on("unresponsive", () => {
    void logError("renderer unresponsive", "window became unresponsive");
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (event, url) => {
    if (url !== win.webContents.getURL()) {
      event.preventDefault();
    }
  });

  if (isDev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  mainWindow = win;
}

/** 두 번째 실행 시도가 들어오면 새 창 대신 기존 창을 앞으로 가져온다. */
export function focusMainWindow(): void {
  const win = mainWindow;
  if (!win || win.isDestroyed()) return;
  if (win.isMinimized()) win.restore();
  win.focus();
}

export function getTitleBarVisible(): boolean {
  return titleBarVisible;
}

/** frame은 BrowserWindow 생성 시점에만 정할 수 있어, 토글 시 창을 새로 만들고 이전 창을 닫는다. */
export function setTitleBarVisible(visible: boolean): void {
  if (visible === titleBarVisible) return;
  titleBarVisible = visible;

  const old = mainWindow;
  createWindow();
  old?.close();
}
