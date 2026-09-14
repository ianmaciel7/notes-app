import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type AtomicNoteSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function AtomicNoteSplitButton({
  type = "atomic-note",
  label = "Nota Atômica",
  tone = "yellow",
  ...props
}: AtomicNoteSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectAtomicNoteSplitButton = AtomicNoteSplitButton;
