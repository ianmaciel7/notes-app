import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type AreaSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function AreaSplitButton({
  type = "area",
  label = "Área",
  tone = "emerald",
  ...props
}: AreaSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectAreaSplitButton = AreaSplitButton;
