import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type AudioSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function AudioSplitButton({
  type = "audio",
  label = "Áudio",
  tone = "rose",
  ...props
}: AudioSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectAudioSplitButton = AudioSplitButton;
