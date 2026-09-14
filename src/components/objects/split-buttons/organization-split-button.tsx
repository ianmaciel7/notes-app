import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type OrganizationSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function OrganizationSplitButton({
  type = "organization",
  label = "Organização",
  tone = "neutral",
  ...props
}: OrganizationSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectOrganizationSplitButton = OrganizationSplitButton;
