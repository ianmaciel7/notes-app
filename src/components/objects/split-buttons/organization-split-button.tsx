import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type OrganizationSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function OrganizationSplitButton({
  iconType = "organization",
  label = "Organização",
  tone = "neutral",
  ...props
}: OrganizationSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectOrganizationSplitButton = OrganizationSplitButton;
