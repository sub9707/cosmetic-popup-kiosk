/// <reference types="vite/client" />

import type { KioskAPI } from "@shared/types";

declare global {
  interface Window {
    kiosk: KioskAPI;
  }
}
