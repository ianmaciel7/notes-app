import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type MediaSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function MediaSplitButton({
  type = "media",
  label = "Mídia",
  tone = "pink",
  ...props
}: MediaSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectMediaSplitButton = MediaSplitButton;
