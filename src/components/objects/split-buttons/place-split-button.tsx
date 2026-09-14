import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type PlaceSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function PlaceSplitButton({
  type = "place",
  label = "Lugar",
  tone = "emerald",
  ...props
}: PlaceSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectPlaceSplitButton = PlaceSplitButton;
