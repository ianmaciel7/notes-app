import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type IdeaSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function IdeaSplitButton({
  type = "idea",
  label = "Ideia",
  tone = "yellow",
  ...props
}: IdeaSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectIdeaSplitButton = IdeaSplitButton;
