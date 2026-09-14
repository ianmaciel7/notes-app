import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type AtomicNoteSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function AtomicNoteSplitButton({
  iconType = "atomic-note",
  label = "Nota Atômica",
  tone = "yellow",
  ...props
}: AtomicNoteSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectAtomicNoteSplitButton = AtomicNoteSplitButton;
