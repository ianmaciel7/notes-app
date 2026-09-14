import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type PageSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function PageSplitButton({
  type = "page",
  label = "Página",
  tone = "blue",
  ...props
}: PageSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectPageSplitButton = PageSplitButton;
