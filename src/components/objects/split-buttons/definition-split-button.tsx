import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type DefinitionSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function DefinitionSplitButton({
  iconType = "definition",
  label = "Definição",
  tone = "orange",
  ...props
}: DefinitionSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectDefinitionSplitButton = DefinitionSplitButton;
