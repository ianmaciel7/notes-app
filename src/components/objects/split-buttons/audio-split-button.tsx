import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type AudioSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function AudioSplitButton({
  type = "audio",
  label = "Áudio",
  tone = "rose",
  ...props
}: AudioSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectAudioSplitButton = AudioSplitButton;
