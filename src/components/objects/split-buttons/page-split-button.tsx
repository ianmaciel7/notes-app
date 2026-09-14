import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type PageSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function PageSplitButton({
  type = "page",
  label = "Página",
  tone = "blue",
  ...props
}: PageSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectPageSplitButton = PageSplitButton;
