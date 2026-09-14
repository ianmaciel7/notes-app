import { ObjectTypeSplitChip, type ObjectTypeSplitChipProps } from "./object-type-split-chip";

export type AiChatSplitButtonProps = Omit<ObjectTypeSplitChipProps, "iconType"> & {
  iconType?: ObjectTypeSplitChipProps["iconType"];
};

export function AiChatSplitButton({
  iconType = "ai-chat",
  label = "AI Chat",
  tone = "purple",
  ...props
}: AiChatSplitButtonProps) {
  return <ObjectTypeSplitChip iconType={iconType} label={label} tone={tone} {...props} />;
}

export const ObjectAiChatSplitButton = AiChatSplitButton;
