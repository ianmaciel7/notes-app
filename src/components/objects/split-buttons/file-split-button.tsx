import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type FileSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function FileSplitButton({
  type = "file",
  label = "Arquivo",
  tone = "neutral",
  ...props
}: FileSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectFileSplitButton = FileSplitButton;
