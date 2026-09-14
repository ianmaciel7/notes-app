import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type StudyGoalSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function StudyGoalSplitButton({
  type = "study-goal",
  label = "Meta de Estudo",
  tone = "purple",
  ...props
}: StudyGoalSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectStudyGoalSplitButton = StudyGoalSplitButton;
