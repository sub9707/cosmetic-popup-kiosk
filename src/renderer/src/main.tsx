import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { KioskCanvas } from "./components/kiosk-canvas";
import "./globals.css";
import { preloadSounds } from "./lib/sound";

preloadSounds();

// Windows 터치는 꾹 누르면 우클릭(contextmenu)으로 처리한다 — 키오스크에는 우클릭 메뉴가 필요 없으니 막는다.
window.addEventListener("contextmenu", (e) => e.preventDefault());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KioskCanvas>
      <App />
    </KioskCanvas>
  </StrictMode>,
);
