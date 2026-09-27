import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { KioskCanvas } from "./components/kiosk-canvas";
import "./globals.css";
import { preloadSounds } from "./lib/sound";

preloadSounds();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <KioskCanvas>
      <App />
    </KioskCanvas>
  </StrictMode>,
);
