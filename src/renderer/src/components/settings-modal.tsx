import { FolderOpen, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { flushPendingParticipants, usePendingParticipantCount } from "@/lib/participant-save";
import { playSound, setSoundSettings, useSoundSettings } from "@/lib/sound";
import type { KioskStatistics } from "@shared/types";

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [stats, setStats] = useState<KioskStatistics | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [titleBarVisible, setTitleBarVisibleState] = useState(false);
  const sound = useSoundSettings();
  const pendingCount = usePendingParticipantCount();
  const [retrying, setRetrying] = useState(false);

  async function handleRetryPending() {
    setRetrying(true);
    try {
      await flushPendingParticipants();
      setStats(await window.kiosk.getStatistics());
    } finally {
      setRetrying(false);
    }
  }
  const volumePercent = Math.round(sound.volume * 100);

  useEffect(() => {
    window.kiosk.getStatistics().then(setStats);
    window.kiosk.getTitleBarVisible().then(setTitleBarVisibleState);
  }, []);

  function handleToggleTitleBar(checked: boolean) {
    setTitleBarVisibleState(checked);
    window.kiosk.setTitleBarVisible(checked);
  }

  async function handleOpenDataFolder() {
    const error = await window.kiosk.openDataFolder();
    setExportMessage(error ? `폴더 열기 실패 — ${error}` : null);
  }

  async function handleExport() {
    setExporting(true);
    setExportMessage(null);
    try {
      const result = await window.kiosk.exportExcel();
      if (result.canceled) {
        setExportMessage(null);
      } else if (result.ok) {
        setExportMessage("다운로드 완료");
      } else {
        setExportMessage(`다운로드 실패${result.error ? ` — ${result.error}` : ""}`);
      }
    } catch (err) {
      setExportMessage(`다운로드 실패 — ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col gap-6 rounded-2xl border-2 border-event-primary bg-background p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-event-primary">설정</h2>

        <section className="flex flex-col items-center gap-2 rounded-xl bg-event-primary-soft py-6">
          <p className="text-lg text-muted-foreground">오늘 참여자</p>
          <p className="text-4xl font-extrabold text-event-primary">{stats ? `${stats.today.count}명` : "-"}</p>
        </section>

        {pendingCount > 0 && (
          <section className="flex items-center justify-between gap-3 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3">
            <p className="text-base font-medium text-amber-900">
              저장 대기 중인 참여 기록 {pendingCount}건
            </p>
            <button
              type="button"
              onClick={handleRetryPending}
              disabled={retrying}
              className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white active:bg-amber-600 disabled:opacity-50"
            >
              {retrying ? "저장 중..." : "다시 저장"}
            </button>
          </section>
        )}

        <section className="flex min-h-0 flex-1 flex-col gap-3">
          <p className="text-lg font-medium text-foreground">일자별 참여자</p>
          <div className="flex-1 touch-pan-y space-y-2 overflow-y-auto overscroll-contain pr-1">
            {stats?.byDate.length ? (
              stats.byDate.map((d) => (
                <div key={d.date} className="flex items-center justify-between text-lg">
                  <span className="text-muted-foreground">{d.date}</span>
                  <span className="font-medium text-foreground">{d.count}명</span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">참여 데이터가 없습니다.</p>
            )}
          </div>
        </section>

        <label className="flex items-center justify-between gap-3 rounded-xl bg-event-primary-soft px-4 py-3.5">
          <span className="text-base font-medium text-foreground">창 상단바 보이기</span>
          <input
            type="checkbox"
            checked={titleBarVisible}
            onChange={(e) => handleToggleTitleBar(e.target.checked)}
            className="size-6 accent-event-primary"
          />
        </label>

        {/* 효과음: 음소거 + 볼륨. 슬라이더를 놓으면 확인용으로 버튼음을 한 번 들려준다. */}
        <section className="flex flex-col gap-3 rounded-xl bg-event-primary-soft px-4 py-3.5">
          <label className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-base font-medium text-foreground">
              {sound.muted ? (
                <VolumeX className="size-5 text-muted-foreground" />
              ) : (
                <Volume2 className="size-5 text-event-primary" />
              )}
              효과음 음소거
            </span>
            <input
              type="checkbox"
              checked={sound.muted}
              onChange={(e) => setSoundSettings({ muted: e.target.checked })}
              className="size-6 accent-event-primary"
            />
          </label>

          <div className={sound.muted ? "pointer-events-none opacity-40" : undefined}>
            <div className="mb-1.5 flex items-center justify-between text-base">
              <span className="font-medium text-foreground">효과음 볼륨</span>
              <span className="font-semibold text-event-primary tabular-nums">{volumePercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={volumePercent}
              disabled={sound.muted}
              onChange={(e) => setSoundSettings({ volume: Number(e.target.value) / 100 })}
              onPointerUp={() => playSound("click")}
              aria-label="효과음 볼륨"
              className="h-2 w-full cursor-pointer accent-event-primary"
            />
          </div>
        </section>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="rounded-xl border-2 border-event-primary px-4 py-3 text-lg font-medium text-event-primary transition-opacity active:opacity-80 disabled:opacity-50"
          >
            {exporting ? "다운로드 중..." : "Excel 다운로드"}
          </button>
          <button
            type="button"
            onClick={handleOpenDataFolder}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-event-primary/40 px-4 py-3 text-lg font-medium text-event-primary transition-opacity active:opacity-80"
          >
            <FolderOpen className="size-5" />
            데이터 폴더 열기
          </button>
          {exportMessage && <p className="text-center text-sm break-all text-muted-foreground">{exportMessage}</p>}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-event-primary px-4 py-3 text-lg font-medium text-event-primary-foreground transition-opacity active:opacity-90"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
