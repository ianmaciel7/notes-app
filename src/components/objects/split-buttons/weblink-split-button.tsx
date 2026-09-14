import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type WeblinkSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function WeblinkSplitButton({
  type = "weblink",
  label = "Weblink",
  tone = "cyan",
  ...props
}: WeblinkSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectWeblinkSplitButton = WeblinkSplitButton;
