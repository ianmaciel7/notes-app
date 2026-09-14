import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type DefinitionSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function DefinitionSplitButton({
  type = "definition",
  label = "Definição",
  tone = "orange",
  ...props
}: DefinitionSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectDefinitionSplitButton = DefinitionSplitButton;
