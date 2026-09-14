import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type IdeaSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function IdeaSplitButton({
  type = "idea",
  label = "Ideia",
  tone = "yellow",
  ...props
}: IdeaSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectIdeaSplitButton = IdeaSplitButton;
