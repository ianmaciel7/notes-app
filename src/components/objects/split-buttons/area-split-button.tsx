import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type AreaSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function AreaSplitButton({
  type = "area",
  label = "Área",
  tone = "emerald",
  ...props
}: AreaSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectAreaSplitButton = AreaSplitButton;
