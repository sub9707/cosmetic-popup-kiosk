import { dialog, type BrowserWindow } from "electron";
import ExcelJS from "exceljs";
import type { ExportExcelResult } from "@shared/types";
import { getStatistics, readAllParticipants } from "../store/participants";
import { formatLocalDate } from "../store/date";
import { logError } from "../store/log";

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

/** 현장에서 스태프가 바로 알아들을 수 있는 말로 바꾼다. */
function describeExportError(err: unknown): string {
  const code = (err as NodeJS.ErrnoException)?.code;
  if (code === "EBUSY" || code === "EPERM" || code === "EACCES") {
    return "같은 이름의 파일이 열려 있거나 저장 권한이 없습니다. 파일을 닫거나 다른 위치를 선택하세요.";
  }
  if (code === "ENOSPC") return "저장 공간이 부족합니다.";
  if (code === "ENOENT") return "저장 위치를 찾을 수 없습니다. USB 연결 등을 확인하세요.";
  return err instanceof Error ? err.message : String(err);
}

async function writeWorkbook(filePath: string): Promise<void> {
  const [participants, statistics] = await Promise.all([readAllParticipants(), getStatistics()]);

  const workbook = new ExcelJS.Workbook();

  const participantsSheet = workbook.addWorksheet("참여 데이터");
  participantsSheet.columns = [
    { header: "참여번호", key: "no", width: 10 },
    { header: "참여날짜", key: "date", width: 14 },
    { header: "참여시간", key: "time", width: 12 },
    { header: "Q1", key: "q1", width: 6 },
    { header: "Q2", key: "q2", width: 6 },
    { header: "Q3", key: "q3", width: 6 },
    { header: "Q4", key: "q4", width: 6 },
    { header: "Q5", key: "q5", width: 6 },
    { header: "추천제품", key: "result", width: 16 },
  ];
  for (const p of participants) {
    const [date, time] = p.createdAt.split("T");
    participantsSheet.addRow({
      no: p.no,
      date,
      time,
      q1: p.answers[0] ?? "",
      q2: p.answers[1] ?? "",
      q3: p.answers[2] ?? "",
      q4: p.answers[3] ?? "",
      q5: p.answers[4] ?? "",
      result: p.result,
    });
  }
  participantsSheet.getRow(1).font = { bold: true };

  const products = [...new Set(participants.map((p) => p.result))].sort();

  const byDateProducts = new Map<string, Map<string, number>>();
  for (const p of participants) {
    const date = p.createdAt.split("T")[0];
    if (!byDateProducts.has(date)) byDateProducts.set(date, new Map());
    const counts = byDateProducts.get(date)!;
    counts.set(p.result, (counts.get(p.result) ?? 0) + 1);
  }

  const dailySheet = workbook.addWorksheet("일자별 통계");
  dailySheet.columns = [
    { header: "날짜", key: "date", width: 14 },
    { header: "참여자 수", key: "count", width: 12 },
    ...products.map((name) => ({ header: name, key: name, width: 16 })),
  ];
  for (const d of statistics.byDate) {
    const counts = byDateProducts.get(d.date) ?? new Map<string, number>();
    const row: Record<string, string | number> = { date: d.date, count: d.count };
    for (const name of products) row[name] = counts.get(name) ?? 0;
    dailySheet.addRow(row);
  }
  dailySheet.getRow(1).font = { bold: true };

  const totalProductCounts = new Map<string, number>();
  for (const p of participants) {
    totalProductCounts.set(p.result, (totalProductCounts.get(p.result) ?? 0) + 1);
  }

  const totalSheet = workbook.addWorksheet("전체 통계");
  totalSheet.columns = [
    { header: "항목", key: "label", width: 20 },
    { header: "값", key: "value", width: 14 },
  ];
  totalSheet.addRow({ label: "전체 참여자 수", value: participants.length });
  for (const name of products) {
    totalSheet.addRow({ label: `${name} 추천 수`, value: totalProductCounts.get(name) ?? 0 });
  }
  totalSheet.getRow(1).font = { bold: true };

  await workbook.xlsx.writeFile(filePath);
}
