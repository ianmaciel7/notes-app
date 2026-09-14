import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type KnowledgeSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function KnowledgeSplitButton({
  iconType = "knowledge",
  label = "Conhecimento",
  tone = "teal",
  ...props
}: KnowledgeSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectKnowledgeSplitButton = KnowledgeSplitButton;
