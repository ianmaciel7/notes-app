import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type TableSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function TableSplitButton({
  type = "table",
  label = "Tabela",
  tone = "indigo",
  ...props
}: TableSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectTableSplitButton = TableSplitButton;
