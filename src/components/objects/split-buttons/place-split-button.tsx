import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type PlaceSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function PlaceSplitButton({
  type = "place",
  label = "Lugar",
  tone = "emerald",
  ...props
}: PlaceSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectPlaceSplitButton = PlaceSplitButton;
