import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type MeetingSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function MeetingSplitButton({
  iconType = "meeting",
  label = "Reunião",
  tone = "blue",
  ...props
}: MeetingSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectMeetingSplitButton = MeetingSplitButton;
