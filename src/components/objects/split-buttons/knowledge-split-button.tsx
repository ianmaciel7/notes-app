import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type KnowledgeSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function KnowledgeSplitButton({
  type = "knowledge",
  label = "Conhecimento",
  tone = "teal",
  ...props
}: KnowledgeSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectKnowledgeSplitButton = KnowledgeSplitButton;
