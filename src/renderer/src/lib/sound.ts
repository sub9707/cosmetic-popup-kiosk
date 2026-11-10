import { useSyncExternalStore } from "react";

/*
 * 효과음 재생. Web Audio 로 미리 디코딩한 버퍼를 재생해 <audio> 와 달리 지연 없이 겹쳐 재생된다.
 * 파일이 여러 개인 효과음은 같은 시각에 동시에 재생한다.
 */
const SOUND_FILES = {
  /** 메인 화면 시작 버튼 */
  start: ["sounds/main-button.wav"],
  /** 일반 버튼 */
  click: ["sounds/button-click.wav"],
  /** 추천 로딩 */
  loading: ["sounds/loading-1.wav", "sounds/loading-2.wav"],
  /** 결과 화면 등장 */
  result: ["sounds/result-1.wav", "sounds/result-2.wav"],
} as const;

export type SoundName = keyof typeof SOUND_FILES;

export interface SoundSettings {
  muted: boolean;
  /** 0 ~ 1 */
  volume: number;
}

const STORAGE_KEY = "kiosk-sound-settings";
const DEFAULT_SETTINGS: SoundSettings = { muted: false, volume: 0.8 };

function loadSettings(): SoundSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<SoundSettings>;
    return {
      muted: typeof parsed.muted === "boolean" ? parsed.muted : DEFAULT_SETTINGS.muted,
      volume: typeof parsed.volume === "number" ? Math.min(1, Math.max(0, parsed.volume)) : DEFAULT_SETTINGS.volume,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

let settings = loadSettings();
const listeners = new Set<() => void>();

const context = new AudioContext();
const master = context.createGain();
master.connect(context.destination);

function applyGain() {
  master.gain.value = settings.muted ? 0 : settings.volume;
}
applyGain();

const buffers = new Map<string, Promise<AudioBuffer | null>>();

function loadBuffer(src: string) {
  let pending = buffers.get(src);
  if (!pending) {
    pending = fetch(src)
      .then((res) => res.arrayBuffer())
      .then((data) => context.decodeAudioData(data))
      .catch((err) => {
        console.warn(`[sound] ${src} 로드 실패`, err);
        return null;
      });
    buffers.set(src, pending);
  }
  return pending;
}

/** 첫 재생 지연이 없도록 앱 시작 시 모든 효과음을 미리 디코딩한다. */
export function preloadSounds() {
  Object.values(SOUND_FILES)
    .flat()
    .forEach((src) => void loadBuffer(src));
}

export async function playSound(name: SoundName) {
  if (settings.muted || settings.volume === 0) return;
  if (context.state === "suspended") void context.resume();

  const loaded = await Promise.all(SOUND_FILES[name].map(loadBuffer));
  // 같은 시각으로 예약해 동시에 시작
  const startAt = context.currentTime + 0.01;
  for (const buffer of loaded) {
    if (!buffer) continue;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(master);
    source.start(startAt);
  }
}

export function getSoundSettings() {
  return settings;
}

export function setSoundSettings(next: Partial<SoundSettings>) {
  settings = { ...settings, ...next };
  applyGain();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // 저장에 실패해도 현재 실행 중에는 설정이 유지된다.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSoundSettings() {
  return useSyncExternalStore(subscribe, getSoundSettings);
}
