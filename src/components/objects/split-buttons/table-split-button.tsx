import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type TableSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function TableSplitButton({
  type = "table",
  label = "Tabela",
  tone = "indigo",
  ...props
}: TableSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectTableSplitButton = TableSplitButton;
