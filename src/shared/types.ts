export const CHOICE_LABELS = ["A", "B", "C", "D"] as const;
export type ChoiceLabel = (typeof CHOICE_LABELS)[number];

export interface EventSurveyQuestion {
  id: string;
  order: number;
  question: string;
  choices: Record<ChoiceLabel, string>;
}

export interface ParticipantInput {
  answers: ChoiceLabel[];
  result: string;
  /** 재시도 시 최초 완료 시각을 유지하기 위해 렌더러에서 전달 (YYYY-MM-DDTHH:mm:ss) */
  createdAt?: string;
}

export interface ParticipantRecord extends ParticipantInput {
  no: number;
  createdAt: string;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface KioskStatistics {
  today: DailyCount;
  byDate: DailyCount[];
}

export interface ExportExcelResult {
  ok: boolean;
  canceled?: boolean;
  path?: string;
  /** 실패 사유 (설정 창에 표시) */
  error?: string;
}

export interface KioskAPI {
  saveParticipant(input: ParticipantInput): Promise<{ no: number }>;
  getStatistics(): Promise<KioskStatistics>;
  exportExcel(): Promise<ExportExcelResult>;
  quitApp(): void;
  getTitleBarVisible(): Promise<boolean>;
  setTitleBarVisible(visible: boolean): void;
  /** userData 폴더를 탐색기로 연다. 성공 시 빈 문자열, 실패 시 오류 메시지를 반환한다. */
  openDataFolder(): Promise<string>;
}
