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

export interface VariantStyle {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  divider: string;
}

export const variantStyles: Record<ObjectIconTone, VariantStyle> = {
  amber: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800", hoverBg: "hover:bg-amber-100 dark:hover:bg-amber-900/50", divider: "border-amber-300/80 dark:border-amber-700/80" },
  blue: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800", hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-900/50", divider: "border-blue-300/80 dark:border-blue-700/80" },
  cyan: { bg: "bg-cyan-50 dark:bg-cyan-950/40", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-800", hoverBg: "hover:bg-cyan-100 dark:hover:bg-cyan-900/50", divider: "border-cyan-300/80 dark:border-cyan-700/80" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", hoverBg: "hover:bg-emerald-100 dark:hover:bg-emerald-900/50", divider: "border-emerald-300/80 dark:border-emerald-700/80" },
  fuchsia: { bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40", text: "text-fuchsia-600 dark:text-fuchsia-400", border: "border-fuchsia-200 dark:border-fuchsia-800", hoverBg: "hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/50", divider: "border-fuchsia-300/80 dark:border-fuchsia-700/80" },
  gray: { bg: "bg-slate-50 dark:bg-slate-950/40", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-800", hoverBg: "hover:bg-slate-100 dark:hover:bg-slate-900/50", divider: "border-slate-300/80 dark:border-slate-700/80" },
  green: { bg: "bg-green-50 dark:bg-green-950/40", text: "text-green-600 dark:text-green-400", border: "border-green-200 dark:border-green-800", hoverBg: "hover:bg-green-100 dark:hover:bg-green-900/50", divider: "border-green-300/80 dark:border-green-700/80" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800", hoverBg: "hover:bg-indigo-100 dark:hover:bg-indigo-900/50", divider: "border-indigo-300/80 dark:border-indigo-700/80" },
  lime: { bg: "bg-lime-50 dark:bg-lime-950/40", text: "text-lime-600 dark:text-lime-400", border: "border-lime-200 dark:border-lime-800", hoverBg: "hover:bg-lime-100 dark:hover:bg-lime-900/50", divider: "border-lime-300/80 dark:border-lime-700/80" },
  neutral: { bg: "bg-muted/80", text: "text-foreground", border: "border-border", hoverBg: "hover:bg-muted", divider: "border-border" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", hoverBg: "hover:bg-orange-100 dark:hover:bg-orange-900/50", divider: "border-orange-300/80 dark:border-orange-700/80" },
  pink: { bg: "bg-pink-50 dark:bg-pink-950/40", text: "text-pink-600 dark:text-pink-400", border: "border-pink-200 dark:border-pink-800", hoverBg: "hover:bg-pink-100 dark:hover:bg-pink-900/50", divider: "border-pink-300/80 dark:border-pink-700/80" },
  purple: { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", hoverBg: "hover:bg-purple-100 dark:hover:bg-purple-900/50", divider: "border-purple-300/80 dark:border-purple-700/80" },
  red: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800", hoverBg: "hover:bg-red-100 dark:hover:bg-red-900/50", divider: "border-red-300/80 dark:border-red-700/80" },
  rose: { bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800", hoverBg: "hover:bg-rose-100 dark:hover:bg-rose-900/50", divider: "border-rose-300/80 dark:border-rose-700/80" },
  sky: { bg: "bg-sky-50 dark:bg-sky-950/40", text: "text-sky-600 dark:text-sky-400", border: "border-sky-200 dark:border-sky-800", hoverBg: "hover:bg-sky-100 dark:hover:bg-sky-900/50", divider: "border-sky-300/80 dark:border-sky-700/80" },
  teal: { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800", hoverBg: "hover:bg-teal-100 dark:hover:bg-teal-900/50", divider: "border-teal-300/80 dark:border-teal-700/80" },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/40", text: "text-violet-600 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800", hoverBg: "hover:bg-violet-100 dark:hover:bg-violet-900/50", divider: "border-violet-300/80 dark:border-violet-700/80" },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-950/40", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800", hoverBg: "hover:bg-yellow-100 dark:hover:bg-yellow-900/50", divider: "border-yellow-300/80 dark:border-yellow-700/80" },
};

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
