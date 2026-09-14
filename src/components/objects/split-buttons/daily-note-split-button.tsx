import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type DailyNoteSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function DailyNoteSplitButton({
  type = "daily-note",
  label = "Nota Diária",
  tone = "green",
  ...props
}: DailyNoteSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectDailyNoteSplitButton = DailyNoteSplitButton;
