import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type FlashcardSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function FlashcardSplitButton({
  iconType = "flashcard",
  label = "Flashcard",
  tone = "violet",
  ...props
}: FlashcardSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectFlashcardSplitButton = FlashcardSplitButton;
