import { ChoiceOption } from "@/components/choice-option";
import { CHOICE_EMPHASIS } from "@/lib/constants";
import { CHOICE_LABELS, type ChoiceLabel, type EventSurveyQuestion } from "@shared/types";

interface SurveyChoiceListProps {
  question: EventSurveyQuestion;
  selected: ChoiceLabel | undefined;
  onSelect: (choice: ChoiceLabel) => void;
}

export function SurveyChoiceList({ question, selected, onSelect }: SurveyChoiceListProps) {
  return (
    <div className="flex w-full flex-col gap-[18px]">
      {CHOICE_LABELS.map((label) => (
        <ChoiceOption
          key={label}
          label={label}
          text={question.choices[label]}
          emphasis={CHOICE_EMPHASIS[question.id]}
          selected={selected === label}
          onSelect={() => onSelect(label)}
        />
      ))}
    </div>
  );
}
