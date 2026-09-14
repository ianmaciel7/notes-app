import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type CollectionSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function CollectionSplitButton({
  iconType = "collection",
  label = "Coleção",
  tone = "sky",
  ...props
}: CollectionSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectCollectionSplitButton = CollectionSplitButton;
