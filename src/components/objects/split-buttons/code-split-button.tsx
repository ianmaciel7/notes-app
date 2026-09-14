import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type CodeSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function CodeSplitButton({
  iconType = "code",
  label = "Código",
  tone = "indigo",
  ...props
}: CodeSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectCodeSplitButton = CodeSplitButton;
