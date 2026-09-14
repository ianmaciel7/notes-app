import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type QuerySplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function QuerySplitButton({
  type = "query",
  label = "Consulta",
  tone = "cyan",
  ...props
}: QuerySplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectQuerySplitButton = QuerySplitButton;
