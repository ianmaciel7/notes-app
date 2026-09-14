"use client";

import * as React from "react";
import type { ObjectIconName, ObjectIconTone } from "@/lib/space-object-types";
import { cn } from "@/lib/utils";
import {
  SplitButton,
  SplitButtonAction,
  SplitButtonContent,
  SplitButtonGroup,
  SplitButtonItem,
  SplitButtonSeparator,
  SplitButtonTrigger,
} from "@/components/ui/split-button";
import { ObjectIcon } from "@/components/objects/icons/icon-registry";
import { toneStyles } from "./split-button-base";

const objectSplitButtonSizes = {
  sm: { action: "xs", trigger: "icon-xs" },
  md: { action: "sm", trigger: "icon-sm" },
  lg: { action: "default", trigger: "icon" },
} as const;

type ObjectSplitButtonSize = keyof typeof objectSplitButtonSizes;

type ObjectSplitButtonContextValue = {
  size: ObjectSplitButtonSize;
  tone: ObjectIconTone;
};

const ObjectSplitButtonContext =
  React.createContext<ObjectSplitButtonContextValue>({
    size: "md",
    tone: "blue",
  });

type ObjectSplitButtonProps = React.ComponentProps<typeof SplitButton> & {
  size?: ObjectSplitButtonSize;
  tone?: ObjectIconTone;
};

function ObjectSplitButton({
  size = "md",
  tone = "blue",
  ...props
}: ObjectSplitButtonProps) {
  return (
    <ObjectSplitButtonContext.Provider value={{ size, tone }}>
      <SplitButton {...props} />
    </ObjectSplitButtonContext.Provider>
  );
}

type ObjectSplitButtonGroupProps = React.ComponentProps<
  typeof SplitButtonGroup
>;

function ObjectSplitButtonGroup({
  className,
  ...props
}: ObjectSplitButtonGroupProps) {
  const { tone } = React.useContext(ObjectSplitButtonContext);
  const toneStyle = toneStyles[tone] ?? toneStyles.blue;

  return (
    <SplitButtonGroup
      className={cn(
        "border font-medium transition-colors select-none",
        toneStyle.bg,
        toneStyle.text,
        toneStyle.border,
        className,
      )}
      {...props}
    />
  );
}

type ObjectSplitButtonActionProps = Omit<
  React.ComponentProps<typeof SplitButtonAction>,
  "size" | "type"
> & {
  type?: ObjectIconName | (string & {});
};

function ObjectSplitButtonAction({
  type = "page",
  className,
  children,
  ...props
}: ObjectSplitButtonActionProps) {
  const { size, tone } = React.useContext(ObjectSplitButtonContext);
  const toneStyle = toneStyles[tone] ?? toneStyles.blue;

  return (
    <SplitButtonAction
      className={cn(toneStyle.hoverBg, toneStyle.text, className)}
      size={objectSplitButtonSizes[size].action}
      variant="ghost"
      {...props}
    >
      <ObjectIcon type={type} />
      {children}
    </SplitButtonAction>
  );
}

type ObjectSplitButtonSeparatorProps = React.ComponentProps<
  typeof SplitButtonSeparator
>;

function ObjectSplitButtonSeparator({
  className,
  ...props
}: ObjectSplitButtonSeparatorProps) {
  const { tone } = React.useContext(ObjectSplitButtonContext);
  const toneStyle = toneStyles[tone] ?? toneStyles.blue;

  return (
    <SplitButtonSeparator
      className={cn(toneStyle.divider, className)}
      {...props}
    />
  );
}

type ObjectSplitButtonTriggerProps = Omit<
  React.ComponentProps<typeof SplitButtonTrigger>,
  "size"
>;

function ObjectSplitButtonTrigger({
  className,
  ...props
}: ObjectSplitButtonTriggerProps) {
  const { size, tone } = React.useContext(ObjectSplitButtonContext);
  const toneStyle = toneStyles[tone] ?? toneStyles.blue;

  return (
    <SplitButtonTrigger
      className={cn(toneStyle.hoverBg, toneStyle.text, className)}
      size={objectSplitButtonSizes[size].trigger}
      variant="ghost"
      {...props}
    />
  );
}

type ObjectSplitButtonContentProps = React.ComponentProps<
  typeof SplitButtonContent
>;

function ObjectSplitButtonContent(
  props: ObjectSplitButtonContentProps,
) {
  return <SplitButtonContent {...props} />;
}

type ObjectSplitButtonItemProps = React.ComponentProps<
  typeof SplitButtonItem
>;

function ObjectSplitButtonItem(props: ObjectSplitButtonItemProps) {
  return <SplitButtonItem {...props} />;
}

export interface ObjectSplitButtonOption {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  onClick?: () => void;
}

export type ObjectSplitButtonVariantProps = {
  type?: ObjectIconName | (string & {});
  label?: string;
  tone?: ObjectIconTone;
  onLabelClick?: () => void;
  options?: ObjectSplitButtonOption[];
  onChevronClick?: () => void;
  size?: ObjectSplitButtonSize;
  className?: string;
  dropdownAriaLabel?: string;
};

export {
  ObjectSplitButton,
  ObjectSplitButtonAction,
  ObjectSplitButtonContent,
  ObjectSplitButtonGroup,
  ObjectSplitButtonItem,
  ObjectSplitButtonSeparator,
  ObjectSplitButtonTrigger,
};

export type {
  ObjectSplitButtonActionProps,
  ObjectSplitButtonContentProps,
  ObjectSplitButtonGroupProps,
  ObjectSplitButtonItemProps,
  ObjectSplitButtonProps,
  ObjectSplitButtonSeparatorProps,
  ObjectSplitButtonSize,
  ObjectSplitButtonTriggerProps,
};
