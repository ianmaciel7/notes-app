import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type AiChatSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function AiChatSplitButton({
  type = "ai-chat",
  label = "AI Chat",
  tone = "purple",
  ...props
}: AiChatSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectAiChatSplitButton = AiChatSplitButton;
