import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type ArchiveSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function ArchiveSplitButton({
  type = "archive",
  label = "Arquivo",
  tone = "gray",
  ...props
}: ArchiveSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectArchiveSplitButton = ArchiveSplitButton;
