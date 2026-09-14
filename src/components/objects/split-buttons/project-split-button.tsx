import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type ProjectSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function ProjectSplitButton({
  type = "project",
  label = "Projeto",
  tone = "violet",
  ...props
}: ProjectSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectProjectSplitButton = ProjectSplitButton;
