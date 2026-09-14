import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type IdeaSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function IdeaSplitButton({
  iconType = "idea",
  label = "Ideia",
  tone = "yellow",
  ...props
}: IdeaSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectIdeaSplitButton = IdeaSplitButton;
