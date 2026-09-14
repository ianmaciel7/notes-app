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
import { variantStyles } from "./split-button-base";

const objectSplitButtonSizes = {
  sm: { action: "sm", trigger: "icon-sm" },
  md: { action: "default", trigger: "icon" },
  lg: { action: "lg", trigger: "icon-lg" },
} as const;

type ObjectSplitButtonSize = keyof typeof objectSplitButtonSizes;

type ObjectSplitButtonContextValue = {
  size: ObjectSplitButtonSize;
  variant: ObjectIconTone;
};

const ObjectSplitButtonContext =
  React.createContext<ObjectSplitButtonContextValue>({
    size: "md",
    variant: "blue",
  });

type ObjectSplitButtonProps = React.ComponentProps<typeof SplitButton> & {
  size?: ObjectSplitButtonSize;
  variant?: ObjectIconTone;
};

function ObjectSplitButton({
  size = "md",
  variant = "blue",
  ...props
}: ObjectSplitButtonProps) {
  return (
    <ObjectSplitButtonContext.Provider value={{ size, variant }}>
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
  return (
    <SplitButtonGroup
      className={cn(
        "font-medium transition-colors select-none",
        className,
      )}
      {...props}
    />
  );
}

type ObjectSplitButtonActionProps = Omit<
  React.ComponentProps<typeof SplitButtonAction>,
  "size" | "type" | "variant"
> & {
  type?: ObjectIconName | (string & {});
};

function ObjectSplitButtonAction({
  type = "page",
  className,
  children,
  ...props
}: ObjectSplitButtonActionProps) {
  const { size, variant } = React.useContext(ObjectSplitButtonContext);
  const variantStyle = variantStyles[variant] ?? variantStyles.blue;

  return (
    <SplitButtonAction
      className={cn(
        variantStyle.bg,
        variantStyle.hoverBg,
        variantStyle.text,
        variantStyle.border,
        className,
      )}
      size={objectSplitButtonSizes[size].action}
      variant="outline"
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
  const { variant } = React.useContext(ObjectSplitButtonContext);
  const variantStyle = variantStyles[variant] ?? variantStyles.blue;

  return (
    <SplitButtonSeparator
      className={cn("bg-current/20", variantStyle.divider, className)}
      {...props}
    />
  );
}

type ObjectSplitButtonTriggerProps = Omit<
  React.ComponentProps<typeof SplitButtonTrigger>,
  "size" | "variant"
>;

function ObjectSplitButtonTrigger({
  className,
  ...props
}: ObjectSplitButtonTriggerProps) {
  const { size, variant } = React.useContext(ObjectSplitButtonContext);
  const variantStyle = variantStyles[variant] ?? variantStyles.blue;

  return (
    <SplitButtonTrigger
      className={cn(
        variantStyle.bg,
        variantStyle.hoverBg,
        variantStyle.text,
        variantStyle.border,
        className,
      )}
      size={objectSplitButtonSizes[size].trigger}
      variant="outline"
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
  variant?: ObjectIconTone;
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
