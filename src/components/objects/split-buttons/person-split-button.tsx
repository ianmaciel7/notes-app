import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type PersonSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function PersonSplitButton({
  type = "person",
  label = "Pessoa",
  tone = "lime",
  ...props
}: PersonSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectPersonSplitButton = PersonSplitButton;
