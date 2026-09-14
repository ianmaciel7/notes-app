import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type CollectionSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function CollectionSplitButton({
  type = "collection",
  label = "Coleção",
  tone = "sky",
  ...props
}: CollectionSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectCollectionSplitButton = CollectionSplitButton;
