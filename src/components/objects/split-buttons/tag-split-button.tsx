import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type TagSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function TagSplitButton({
  type = "tag",
  label = "Etiqueta",
  tone = "teal",
  ...props
}: TagSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectTagSplitButton = TagSplitButton;
