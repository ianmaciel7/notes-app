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
  children,
  ...props
}: ObjectSplitButtonActionProps) {
  const { size } = React.useContext(ObjectSplitButtonContext);

  return (
    <SplitButtonAction
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

function ObjectSplitButtonSeparator(
  props: ObjectSplitButtonSeparatorProps,
) {
  return <SplitButtonSeparator {...props} />;
}

type ObjectSplitButtonTriggerProps = Omit<
  React.ComponentProps<typeof SplitButtonTrigger>,
  "size"
>;

function ObjectSplitButtonTrigger(
  props: ObjectSplitButtonTriggerProps,
) {
  const { size } = React.useContext(ObjectSplitButtonContext);

  return (
    <SplitButtonTrigger
      size={objectSplitButtonSizes[size].trigger}
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

interface ObjectSplitButtonControlOption {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  onClick?: () => void;
}

type ObjectSplitButtonControlProps = {
  type?: ObjectIconName | (string & {});
  label?: string;
  tone?: ObjectIconTone;
  onLabelClick?: () => void;
  options?: ObjectSplitButtonControlOption[];
  onChevronClick?: () => void;
  size?: ObjectSplitButtonSize;
  className?: string;
  dropdownAriaLabel?: string;
};

function ObjectSplitButtonControl({
  type = "page",
  label = "",
  tone = "blue",
  onLabelClick,
  options = [],
  onChevronClick,
  size = "md",
  className,
  dropdownAriaLabel = "Object type options",
}: ObjectSplitButtonControlProps) {
  const triggerDisabled = options.length === 0 && !onChevronClick;

  return (
    <ObjectSplitButton size={size} tone={tone}>
      <ObjectSplitButtonGroup
        aria-label={label || dropdownAriaLabel}
        className={className}
      >
        <ObjectSplitButtonAction
          aria-label={label || undefined}
          onClick={onLabelClick}
          type={type}
        >
          {label && <span>{label}</span>}
        </ObjectSplitButtonAction>
        <ObjectSplitButtonSeparator orientation="vertical" />
        <ObjectSplitButtonTrigger
          aria-label={dropdownAriaLabel}
          disabled={triggerDisabled}
          onClick={onChevronClick}
        />
        <ObjectSplitButtonContent>
          {options.map((option) => (
            <ObjectSplitButtonItem key={option.id} onClick={option.onClick}>
              {option.leadingIcon}
              <span>{option.label}</span>
            </ObjectSplitButtonItem>
          ))}
        </ObjectSplitButtonContent>
      </ObjectSplitButtonGroup>
    </ObjectSplitButton>
  );
}

export {
  ObjectSplitButton,
  ObjectSplitButtonAction,
  ObjectSplitButtonContent,
  ObjectSplitButtonGroup,
  ObjectSplitButtonItem,
  ObjectSplitButtonControl,
  ObjectSplitButtonSeparator,
  ObjectSplitButtonTrigger,
};

export type {
  ObjectSplitButtonActionProps,
  ObjectSplitButtonContentProps,
  ObjectSplitButtonGroupProps,
  ObjectSplitButtonItemProps,
  ObjectSplitButtonControlProps,
  ObjectSplitButtonProps,
  ObjectSplitButtonSeparatorProps,
  ObjectSplitButtonSize,
  ObjectSplitButtonTriggerProps,
};
