import { contextBridge, ipcRenderer } from "electron";
import type { KioskAPI, ParticipantInput } from "@shared/types";

const kioskAPI: KioskAPI = {
  saveParticipant: (input: ParticipantInput) => ipcRenderer.invoke("kiosk:saveParticipant", input),
  getStatistics: () => ipcRenderer.invoke("kiosk:getStatistics"),
  exportExcel: () => ipcRenderer.invoke("kiosk:exportExcel"),
  quitApp: () => ipcRenderer.send("kiosk:quitApp"),
  getTitleBarVisible: () => ipcRenderer.invoke("kiosk:getTitleBarVisible"),
  setTitleBarVisible: (visible: boolean) => ipcRenderer.send("kiosk:setTitleBarVisible", visible),
  openDataFolder: () => ipcRenderer.invoke("kiosk:openDataFolder"),
};

contextBridge.exposeInMainWorld("kiosk", kioskAPI);
