import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type TagSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function TagSplitButton({
  type = "tag",
  label = "Etiqueta",
  tone = "teal",
  ...props
}: TagSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectTagSplitButton = TagSplitButton;
