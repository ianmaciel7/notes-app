import { ObjectSplitButtonControl, type ObjectSplitButtonControlProps } from "./object-split-button";

export type TweetSplitButtonProps = Omit<ObjectSplitButtonControlProps, "type"> & {
  type?: ObjectSplitButtonControlProps["type"];
};

export function TweetSplitButton({
  type = "tweet",
  label = "Tweet",
  tone = "sky",
  ...props
}: TweetSplitButtonProps) {
  return <ObjectSplitButtonControl type={type} label={label} tone={tone} {...props} />;
}

export const ObjectTweetSplitButton = TweetSplitButton;
