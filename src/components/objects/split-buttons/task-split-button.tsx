import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type TaskSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function TaskSplitButton({
  iconType = "task",
  label = "Tarefa",
  tone = "red",
  ...props
}: TaskSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectTaskSplitButton = TaskSplitButton;
