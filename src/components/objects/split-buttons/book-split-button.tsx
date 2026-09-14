import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type BookSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function BookSplitButton({
  type = "book",
  label = "Livro",
  tone = "amber",
  ...props
}: BookSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectBookSplitButton = BookSplitButton;
