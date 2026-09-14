import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type ImageSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function ImageSplitButton({
  type = "image",
  label = "Imagem",
  tone = "fuchsia",
  ...props
}: ImageSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectImageSplitButton = ImageSplitButton;
