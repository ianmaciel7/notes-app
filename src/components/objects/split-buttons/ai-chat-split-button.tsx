import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type AiChatSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function AiChatSplitButton({
  type = "ai-chat",
  label = "AI Chat",
  tone = "purple",
  ...props
}: AiChatSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectAiChatSplitButton = AiChatSplitButton;
