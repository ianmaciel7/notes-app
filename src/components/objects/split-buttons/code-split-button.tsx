import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type CodeSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function CodeSplitButton({
  type = "code",
  label = "Código",
  tone = "indigo",
  ...props
}: CodeSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectCodeSplitButton = CodeSplitButton;
