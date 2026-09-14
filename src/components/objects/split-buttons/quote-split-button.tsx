import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type QuoteSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function QuoteSplitButton({
  type = "quote",
  label = "Citação",
  tone = "amber",
  ...props
}: QuoteSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectQuoteSplitButton = QuoteSplitButton;
