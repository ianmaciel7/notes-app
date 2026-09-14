import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type QuoteSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function QuoteSplitButton({
  type = "quote",
  label = "Citação",
  tone = "amber",
  ...props
}: QuoteSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectQuoteSplitButton = QuoteSplitButton;
