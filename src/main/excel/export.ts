import { dialog, type BrowserWindow } from "electron";
import ExcelJS from "exceljs";
import { formatLocalDate } from "@shared/date";
import type { ExportExcelResult } from "@shared/types";
import { getStatistics, readAllParticipants } from "../store/participants";
import { logError } from "../store/log";

const QUESTION_COUNT = 5;
const QUESTION_KEYS = Array.from({ length: QUESTION_COUNT }, (_, i) => `q${i + 1}`);

export async function exportExcel(parent: BrowserWindow | null): Promise<ExportExcelResult> {
  const options = {
    title: "참여 데이터 Excel 다운로드",
    defaultPath: `EventKiosk-참여데이터-${formatLocalDate(new Date())}.xlsx`,
    filters: [{ name: "Excel", extensions: ["xlsx"] }],
  };
  const { canceled, filePath } = parent
    ? await dialog.showSaveDialog(parent, options)
    : await dialog.showSaveDialog(options);

  if (canceled || !filePath) {
    return { ok: false, canceled: true };
  }

  try {
    await writeWorkbook(filePath);
    return { ok: true, path: filePath };
  } catch (err) {
    await logError("exportExcel", err);
    return { ok: false, error: describeExportError(err) };
  }
}

/** 파일 시스템 오류 코드를 운영자용 안내 문구로 변환 */
function describeExportError(err: unknown): string {
  const code = (err as NodeJS.ErrnoException)?.code;
  if (code === "EBUSY" || code === "EPERM" || code === "EACCES") {
    return "같은 이름의 파일이 열려 있거나 저장 권한이 없습니다. 파일을 닫거나 다른 위치를 선택하세요.";
  }
  if (code === "ENOSPC") return "저장 공간이 부족합니다.";
  if (code === "ENOENT") return "저장 위치를 찾을 수 없습니다. USB 연결 등을 확인하세요.";
  return err instanceof Error ? err.message : String(err);
}

function increment(counts: Map<string, number>, key: string): void {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

async function writeWorkbook(filePath: string): Promise<void> {
  const [participants, statistics] = await Promise.all([readAllParticipants(), getStatistics()]);

  const workbook = new ExcelJS.Workbook();

  const participantsSheet = workbook.addWorksheet("참여 데이터");
  participantsSheet.columns = [
    { header: "참여번호", key: "no", width: 10 },
    { header: "참여날짜", key: "date", width: 14 },
    { header: "참여시간", key: "time", width: 12 },
    ...QUESTION_KEYS.map((key) => ({ header: key.toUpperCase(), key, width: 6 })),
    { header: "추천제품", key: "result", width: 16 },
  ];
  for (const p of participants) {
    const [date, time] = p.createdAt.split("T");
    const answers = Object.fromEntries(QUESTION_KEYS.map((key, i) => [key, p.answers[i] ?? ""]));
    participantsSheet.addRow({ no: p.no, date, time, ...answers, result: p.result });
  }
  participantsSheet.getRow(1).font = { bold: true };

  const products = [...new Set(participants.map((p) => p.result))].sort();
  const totalCounts = new Map<string, number>();
  const dailyCounts = new Map<string, Map<string, number>>();
  for (const p of participants) {
    const date = p.createdAt.split("T")[0];
    if (!dailyCounts.has(date)) dailyCounts.set(date, new Map());
    increment(dailyCounts.get(date)!, p.result);
    increment(totalCounts, p.result);
  }

  const dailySheet = workbook.addWorksheet("일자별 통계");
  dailySheet.columns = [
    { header: "날짜", key: "date", width: 14 },
    { header: "참여자 수", key: "count", width: 12 },
    ...products.map((name) => ({ header: name, key: name, width: 16 })),
  ];
  for (const d of statistics.byDate) {
    const counts = dailyCounts.get(d.date);
    const row: Record<string, string | number> = { date: d.date, count: d.count };
    for (const name of products) row[name] = counts?.get(name) ?? 0;
    dailySheet.addRow(row);
  }
  dailySheet.getRow(1).font = { bold: true };

  const totalSheet = workbook.addWorksheet("전체 통계");
  totalSheet.columns = [
    { header: "항목", key: "label", width: 20 },
    { header: "값", key: "value", width: 14 },
  ];
  totalSheet.addRow({ label: "전체 참여자 수", value: participants.length });
  for (const name of products) {
    totalSheet.addRow({ label: `${name} 추천 수`, value: totalCounts.get(name) ?? 0 });
  }
  totalSheet.getRow(1).font = { bold: true };

  await workbook.xlsx.writeFile(filePath);
}
