import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type WeblinkSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function WeblinkSplitButton({
  iconType = "weblink",
  label = "Weblink",
  tone = "cyan",
  ...props
}: WeblinkSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectWeblinkSplitButton = WeblinkSplitButton;
