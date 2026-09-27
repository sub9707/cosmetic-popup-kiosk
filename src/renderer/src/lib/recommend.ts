import { CHOICE_LABELS, type ChoiceLabel } from "./constants";

/** 최다 선택된 라벨을 반환한다. 동률이면 CHOICE_LABELS 순서상 먼저 나온 라벨을 우선한다. */
export function recommendChoice(answers: ChoiceLabel[]): ChoiceLabel {
  const counts: Record<ChoiceLabel, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const choice of answers) {
    counts[choice]++;
  }

  return CHOICE_LABELS.reduce((best, label) => (counts[label] > counts[best] ? label : best), CHOICE_LABELS[0]);
}

