import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type CollectionSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function CollectionSplitButton({
  type = "collection",
  label = "Coleção",
  tone = "sky",
  ...props
}: CollectionSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectCollectionSplitButton = CollectionSplitButton;
