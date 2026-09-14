import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type ImageSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function ImageSplitButton({
  type = "image",
  label = "Imagem",
  tone = "fuchsia",
  ...props
}: ImageSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectImageSplitButton = ImageSplitButton;
