import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { KioskCanvas } from "./components/kiosk-canvas";
import "./globals.css";
import { preloadSounds } from "./lib/sound";

preloadSounds();

// 터치를 길게 누르면 우클릭으로 처리되므로 컨텍스트 메뉴를 막는다.
window.addEventListener("contextmenu", (e) => e.preventDefault());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KioskCanvas>
      <App />
    </KioskCanvas>
  </StrictMode>,
);
