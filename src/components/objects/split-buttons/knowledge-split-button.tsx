import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type KnowledgeSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function KnowledgeSplitButton({
  type = "knowledge",
  label = "Conhecimento",
  tone = "teal",
  ...props
}: KnowledgeSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectKnowledgeSplitButton = KnowledgeSplitButton;
