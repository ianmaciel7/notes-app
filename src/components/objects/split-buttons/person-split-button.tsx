import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type PersonSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function PersonSplitButton({
  type = "person",
  label = "Pessoa",
  tone = "lime",
  ...props
}: PersonSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectPersonSplitButton = PersonSplitButton;
