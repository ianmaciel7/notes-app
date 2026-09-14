import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type DailyNoteSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function DailyNoteSplitButton({
  iconType = "daily-note",
  label = "Nota Diária",
  tone = "green",
  ...props
}: DailyNoteSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectDailyNoteSplitButton = DailyNoteSplitButton;
