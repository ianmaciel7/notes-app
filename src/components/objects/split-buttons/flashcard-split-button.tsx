import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type FlashcardSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function FlashcardSplitButton({
  type = "flashcard",
  label = "Flashcard",
  tone = "violet",
  ...props
}: FlashcardSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectFlashcardSplitButton = FlashcardSplitButton;
