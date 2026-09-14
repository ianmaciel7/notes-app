import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type DailyNoteSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function DailyNoteSplitButton({
  type = "daily-note",
  label = "Nota Diária",
  tone = "green",
  ...props
}: DailyNoteSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectDailyNoteSplitButton = DailyNoteSplitButton;
