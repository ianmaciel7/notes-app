import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type TravelSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function TravelSplitButton({
  type = "travel",
  label = "Viagem",
  tone = "sky",
  ...props
}: TravelSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectTravelSplitButton = TravelSplitButton;
