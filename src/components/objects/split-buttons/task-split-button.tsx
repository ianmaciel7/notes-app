import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type TaskSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function TaskSplitButton({
  type = "task",
  label = "Tarefa",
  tone = "red",
  ...props
}: TaskSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectTaskSplitButton = TaskSplitButton;
