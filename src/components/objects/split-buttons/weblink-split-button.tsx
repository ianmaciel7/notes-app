import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type WeblinkSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function WeblinkSplitButton({
  type = "weblink",
  label = "Weblink",
  tone = "cyan",
  ...props
}: WeblinkSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectWeblinkSplitButton = WeblinkSplitButton;
