import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type MeetingSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function MeetingSplitButton({
  type = "meeting",
  label = "Reunião",
  tone = "blue",
  ...props
}: MeetingSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectMeetingSplitButton = MeetingSplitButton;
