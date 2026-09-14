import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type ArchiveSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function ArchiveSplitButton({
  iconType = "archive",
  label = "Arquivo",
  tone = "gray",
  ...props
}: ArchiveSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectArchiveSplitButton = ArchiveSplitButton;
