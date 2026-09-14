import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type QuerySplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function QuerySplitButton({
  type = "query",
  label = "Consulta",
  tone = "cyan",
  ...props
}: QuerySplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectQuerySplitButton = QuerySplitButton;
