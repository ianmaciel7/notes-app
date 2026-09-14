import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type DefinitionSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function DefinitionSplitButton({
  type = "definition",
  label = "Definição",
  tone = "orange",
  ...props
}: DefinitionSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectDefinitionSplitButton = DefinitionSplitButton;
