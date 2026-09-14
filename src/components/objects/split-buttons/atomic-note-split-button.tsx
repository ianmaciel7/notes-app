import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type AtomicNoteSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function AtomicNoteSplitButton({
  type = "atomic-note",
  label = "Nota Atômica",
  tone = "yellow",
  ...props
}: AtomicNoteSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectAtomicNoteSplitButton = AtomicNoteSplitButton;
