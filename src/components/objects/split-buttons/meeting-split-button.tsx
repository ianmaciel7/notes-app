import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type MeetingSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function MeetingSplitButton({
  type = "meeting",
  label = "Reunião",
  tone = "blue",
  ...props
}: MeetingSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectMeetingSplitButton = MeetingSplitButton;
