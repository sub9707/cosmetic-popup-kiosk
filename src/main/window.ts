import { app, BrowserWindow, shell } from "electron";
import path from "node:path";
import { logError, logInfo } from "./store/log";

const isDev = !app.isPackaged;

const RELOAD_WINDOW_MS = 60_000;
const MAX_RELOADS_PER_WINDOW = 3;

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

  // 렌더러가 죽으면 다시 불러온다. 크래시 루프를 막기 위해 1분에 3회까지만 시도
  const recentReloads: number[] = [];
  win.webContents.on("render-process-gone", (_event, details) => {
    void logError("render-process-gone", `${details.reason} (exitCode ${details.exitCode})`);
    if (details.reason === "clean-exit" || win.isDestroyed()) return;

    const now = Date.now();
    while (recentReloads.length && now - recentReloads[0] > RELOAD_WINDOW_MS) recentReloads.shift();
    if (recentReloads.length >= MAX_RELOADS_PER_WINDOW) return;
    recentReloads.push(now);
    win.webContents.reload();
  });
  win.webContents.on("unresponsive", () => {
    void logError("renderer unresponsive", "window became unresponsive");
  });
  win.webContents.on("responsive", () => {
    void logInfo("renderer responsive", "window became responsive again");
  });
  // 렌더러 콘솔 에러를 메인 로그 파일에 함께 기록
  win.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    if (level >= 3) void logError("renderer console", `${message} (${sourceId}:${line})`);
  });
  win.webContents.on("did-finish-load", () => {
    void logInfo("renderer loaded", win.webContents.getURL());
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

export function focusMainWindow(): void {
  const win = mainWindow;
  if (!win || win.isDestroyed()) return;
  if (win.isMinimized()) win.restore();
  win.focus();
}

export function getTitleBarVisible(): boolean {
  return titleBarVisible;
}

/** frame 옵션은 생성 시에만 지정할 수 있어 창을 새로 만들고 기존 창을 닫는다. */
export function setTitleBarVisible(visible: boolean): void {
  if (visible === titleBarVisible) return;
  titleBarVisible = visible;

  const old = mainWindow;
  createWindow();
  old?.close();
}
