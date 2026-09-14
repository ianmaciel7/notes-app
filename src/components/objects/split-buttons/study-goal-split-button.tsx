import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type StudyGoalSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function StudyGoalSplitButton({
  iconType = "study-goal",
  label = "Meta de Estudo",
  tone = "purple",
  ...props
}: StudyGoalSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectStudyGoalSplitButton = StudyGoalSplitButton;
