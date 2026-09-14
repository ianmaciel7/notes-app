import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type ArchiveSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function ArchiveSplitButton({
  type = "archive",
  label = "Arquivo",
  tone = "gray",
  ...props
}: ArchiveSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectArchiveSplitButton = ArchiveSplitButton;
