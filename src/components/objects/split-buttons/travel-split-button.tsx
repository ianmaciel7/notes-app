import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type TravelSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function TravelSplitButton({
  type = "travel",
  label = "Viagem",
  tone = "sky",
  ...props
}: TravelSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectTravelSplitButton = TravelSplitButton;
