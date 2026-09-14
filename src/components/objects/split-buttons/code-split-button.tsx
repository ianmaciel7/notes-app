import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type CodeSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function CodeSplitButton({
  type = "code",
  label = "Código",
  tone = "indigo",
  ...props
}: CodeSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectCodeSplitButton = CodeSplitButton;
