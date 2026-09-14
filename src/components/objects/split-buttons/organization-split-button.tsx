import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type OrganizationSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function OrganizationSplitButton({
  type = "organization",
  label = "Organização",
  tone = "neutral",
  ...props
}: OrganizationSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectOrganizationSplitButton = OrganizationSplitButton;
