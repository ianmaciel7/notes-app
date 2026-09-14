import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type FileSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function FileSplitButton({
  type = "file",
  label = "Arquivo",
  tone = "neutral",
  ...props
}: FileSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectFileSplitButton = FileSplitButton;
