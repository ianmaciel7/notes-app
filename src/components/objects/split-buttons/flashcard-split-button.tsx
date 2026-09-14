import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type FlashcardSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function FlashcardSplitButton({
  type = "flashcard",
  label = "Flashcard",
  tone = "violet",
  ...props
}: FlashcardSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectFlashcardSplitButton = FlashcardSplitButton;
