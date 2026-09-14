import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type BookSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function BookSplitButton({
  type = "book",
  label = "Livro",
  tone = "amber",
  ...props
}: BookSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectBookSplitButton = BookSplitButton;
