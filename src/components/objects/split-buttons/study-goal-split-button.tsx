import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type StudyGoalSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function StudyGoalSplitButton({
  type = "study-goal",
  label = "Meta de Estudo",
  tone = "purple",
  ...props
}: StudyGoalSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectStudyGoalSplitButton = StudyGoalSplitButton;
