import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type TaskSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function TaskSplitButton({
  type = "task",
  label = "Tarefa",
  tone = "red",
  ...props
}: TaskSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectTaskSplitButton = TaskSplitButton;
