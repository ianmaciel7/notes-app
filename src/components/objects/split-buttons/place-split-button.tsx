import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type PlaceSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function PlaceSplitButton({
  iconType = "place",
  label = "Lugar",
  tone = "emerald",
  ...props
}: PlaceSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectPlaceSplitButton = PlaceSplitButton;
