import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type MediaSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function MediaSplitButton({
  type = "media",
  label = "Mídia",
  tone = "pink",
  ...props
}: MediaSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectMediaSplitButton = MediaSplitButton;
