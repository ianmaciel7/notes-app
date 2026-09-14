import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type ProjectSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function ProjectSplitButton({
  type = "project",
  label = "Projeto",
  tone = "violet",
  ...props
}: ProjectSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectProjectSplitButton = ProjectSplitButton;
