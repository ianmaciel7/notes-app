import { ObjectSplitButton, type ObjectSplitButtonProps } from "./object-split-button";

export type TweetSplitButtonProps = Omit<ObjectSplitButtonProps, "type"> & {
  type?: ObjectSplitButtonProps["type"];
};

export function TweetSplitButton({
  type = "tweet",
  label = "Tweet",
  tone = "sky",
  ...props
}: TweetSplitButtonProps) {
  return <ObjectSplitButton type={type} label={label} tone={tone} {...props} />;
}

export const ObjectTweetSplitButton = TweetSplitButton;
