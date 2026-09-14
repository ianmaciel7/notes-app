import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type QuoteSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function QuoteSplitButton({
  iconType = "quote",
  label = "Citação",
  tone = "amber",
  ...props
}: QuoteSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectQuoteSplitButton = QuoteSplitButton;
