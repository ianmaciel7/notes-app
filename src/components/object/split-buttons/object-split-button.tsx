"use client";

import * as React from "react";
import { ObjectIcon } from "@/components/object/icons/icon-registry";
import {
  SplitButton,
  SplitButtonAction,
  SplitButtonContent,
  SplitButtonGroup,
  SplitButtonItem,
  SplitButtonSeparator,
  SplitButtonTrigger,
} from "@/components/ui/split-button";
import type { ObjectIconName, ObjectIconTone } from "@/lib/space-object-types";
import { cn } from "@/lib/utils";

export interface VariantStyle {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  divider: string;
}

export const variantStyles: Record<ObjectIconTone, VariantStyle> = {
  amber: {
    bg: "var(--tone-amber-bg)",
    text: "var(--tone-amber-text)",
    border: "var(--tone-amber-border)",
    hoverBg: "color-mix(in oklch, var(--tone-amber-bg), var(--foreground) 5%)",
    divider: "var(--tone-amber-border)",
  },
  blue: {
    bg: "var(--tone-blue-bg)",
    text: "var(--tone-blue-text)",
    border: "var(--tone-blue-border)",
    hoverBg: "color-mix(in oklch, var(--tone-blue-bg), var(--foreground) 5%)",
    divider: "var(--tone-blue-border)",
  },
  cyan: {
    bg: "var(--tone-cyan-bg)",
    text: "var(--tone-cyan-text)",
    border: "var(--tone-cyan-border)",
    hoverBg: "color-mix(in oklch, var(--tone-cyan-bg), var(--foreground) 5%)",
    divider: "var(--tone-cyan-border)",
  },
  emerald: {
    bg: "var(--tone-emerald-bg)",
    text: "var(--tone-emerald-text)",
    border: "var(--tone-emerald-border)",
    hoverBg: "color-mix(in oklch, var(--tone-emerald-bg), var(--foreground) 5%)",
    divider: "var(--tone-emerald-border)",
  },
  fuchsia: {
    bg: "var(--tone-fuchsia-bg)",
    text: "var(--tone-fuchsia-text)",
    border: "var(--tone-fuchsia-border)",
    hoverBg: "color-mix(in oklch, var(--tone-fuchsia-bg), var(--foreground) 5%)",
    divider: "var(--tone-fuchsia-border)",
  },
  gray: {
    bg: "var(--tone-gray-bg)",
    text: "var(--tone-gray-text)",
    border: "var(--tone-gray-border)",
    hoverBg: "color-mix(in oklch, var(--tone-gray-bg), var(--foreground) 5%)",
    divider: "var(--tone-gray-border)",
  },
  green: {
    bg: "var(--tone-green-bg)",
    text: "var(--tone-green-text)",
    border: "var(--tone-green-border)",
    hoverBg: "color-mix(in oklch, var(--tone-green-bg), var(--foreground) 5%)",
    divider: "var(--tone-green-border)",
  },
  indigo: {
    bg: "var(--tone-indigo-bg)",
    text: "var(--tone-indigo-text)",
    border: "var(--tone-indigo-border)",
    hoverBg: "color-mix(in oklch, var(--tone-indigo-bg), var(--foreground) 5%)",
    divider: "var(--tone-indigo-border)",
  },
  lime: {
    bg: "var(--tone-lime-bg)",
    text: "var(--tone-lime-text)",
    border: "var(--tone-lime-border)",
    hoverBg: "color-mix(in oklch, var(--tone-lime-bg), var(--foreground) 5%)",
    divider: "var(--tone-lime-border)",
  },
  neutral: {
    bg: "var(--muted)",
    text: "var(--foreground)",
    border: "var(--border)",
    hoverBg: "color-mix(in oklch, var(--muted), var(--foreground) 5%)",
    divider: "var(--border)",
  },
  orange: {
    bg: "var(--tone-orange-bg)",
    text: "var(--tone-orange-text)",
    border: "var(--tone-orange-border)",
    hoverBg: "color-mix(in oklch, var(--tone-orange-bg), var(--foreground) 5%)",
    divider: "var(--tone-orange-border)",
  },
  pink: {
    bg: "var(--tone-pink-bg)",
    text: "var(--tone-pink-text)",
    border: "var(--tone-pink-border)",
    hoverBg: "color-mix(in oklch, var(--tone-pink-bg), var(--foreground) 5%)",
    divider: "var(--tone-pink-border)",
  },
  purple: {
    bg: "var(--tone-purple-bg)",
    text: "var(--tone-purple-text)",
    border: "var(--tone-purple-border)",
    hoverBg: "color-mix(in oklch, var(--tone-purple-bg), var(--foreground) 5%)",
    divider: "var(--tone-purple-border)",
  },
  red: {
    bg: "var(--tone-red-bg)",
    text: "var(--tone-red-text)",
    border: "var(--tone-red-border)",
    hoverBg: "color-mix(in oklch, var(--tone-red-bg), var(--foreground) 5%)",
    divider: "var(--tone-red-border)",
  },
  rose: {
    bg: "var(--tone-rose-bg)",
    text: "var(--tone-rose-text)",
    border: "var(--tone-rose-border)",
    hoverBg: "color-mix(in oklch, var(--tone-rose-bg), var(--foreground) 5%)",
    divider: "var(--tone-rose-border)",
  },
  sky: {
    bg: "var(--tone-sky-bg)",
    text: "var(--tone-sky-text)",
    border: "var(--tone-sky-border)",
    hoverBg: "color-mix(in oklch, var(--tone-sky-bg), var(--foreground) 5%)",
    divider: "var(--tone-sky-border)",
  },
  teal: {
    bg: "var(--tone-teal-bg)",
    text: "var(--tone-teal-text)",
    border: "var(--tone-teal-border)",
    hoverBg: "color-mix(in oklch, var(--tone-teal-bg), var(--foreground) 5%)",
    divider: "var(--tone-teal-border)",
  },
  violet: {
    bg: "var(--tone-violet-bg)",
    text: "var(--tone-violet-text)",
    border: "var(--tone-violet-border)",
    hoverBg: "color-mix(in oklch, var(--tone-violet-bg), var(--foreground) 5%)",
    divider: "var(--tone-violet-border)",
  },
  yellow: {
    bg: "var(--tone-yellow-bg)",
    text: "var(--tone-yellow-text)",
    border: "var(--tone-yellow-border)",
    hoverBg: "color-mix(in oklch, var(--tone-yellow-bg), var(--foreground) 5%)",
    divider: "var(--tone-yellow-border)",
  },
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

const ObjectSplitButtonContext = React.createContext<ObjectSplitButtonContextValue>({
  size: "md",
  variant: "blue",
});

function semanticStyle(values: Record<string, string>): React.CSSProperties {
  const style: React.CSSProperties = {};
  Object.assign(style, values);
  return style;
}

type ObjectSplitButtonProps = React.ComponentProps<typeof SplitButton> & {
  size?: ObjectSplitButtonSize;
  variant?: ObjectIconTone;
};

function ObjectSplitButton({ size = "md", variant = "blue", ...props }: ObjectSplitButtonProps) {
  return (
    <ObjectSplitButtonContext.Provider value={{ size, variant }}>
      <SplitButton {...props} />
    </ObjectSplitButtonContext.Provider>
  );
}

type ObjectSplitButtonGroupProps = React.ComponentProps<typeof SplitButtonGroup>;

function ObjectSplitButtonGroup({ className, ...props }: ObjectSplitButtonGroupProps) {
  return (
    <SplitButtonGroup
      className={cn("group/split-button font-medium transition-colors select-none", className)}
      {...props}
    />
  );
}

type ObjectSplitButtonActionProps = Omit<
  React.ComponentProps<typeof SplitButtonAction>,
  "size" | "type" | "variant"
> & {
  type?: ObjectIconName;
};

function ObjectSplitButtonAction({
  type = "page",
  className,
  children,
  ...props
}: ObjectSplitButtonActionProps) {
  const { size, variant } = React.useContext(ObjectSplitButtonContext);
  const variantStyle = variantStyles[variant];

  return (
    <SplitButtonAction
      className={cn(
        "bg-[var(--object-split-button-bg)] text-[var(--object-split-button-text)]",
        "border-[var(--object-split-button-border)] hover:bg-[var(--object-split-button-hover-bg)]",
        "group-hover/split-button:bg-[var(--object-split-button-hover-bg)]",
        className,
      )}
      size={objectSplitButtonSizes[size].action}
      style={semanticStyle({
        "--object-split-button-bg": variantStyle.bg,
        "--object-split-button-hover-bg": variantStyle.hoverBg,
        "--object-split-button-border": variantStyle.border,
        "--object-split-button-text": variantStyle.text,
      })}
      variant="outline"
      {...props}
    >
      <ObjectIcon type={type} />
      {children}
    </SplitButtonAction>
  );
}

type ObjectSplitButtonSeparatorProps = React.ComponentProps<typeof SplitButtonSeparator>;

function ObjectSplitButtonSeparator({ className, ...props }: ObjectSplitButtonSeparatorProps) {
  const { variant } = React.useContext(ObjectSplitButtonContext);
  const variantStyle = variantStyles[variant];

  return (
    <SplitButtonSeparator
      className={cn("bg-[var(--object-split-button-divider)]", className)}
      style={semanticStyle({
        "--object-split-button-divider": variantStyle.divider,
      })}
      {...props}
    />
  );
}

type ObjectSplitButtonTriggerProps = Omit<
  React.ComponentProps<typeof SplitButtonTrigger>,
  "size" | "variant"
>;

function ObjectSplitButtonTrigger({ className, ...props }: ObjectSplitButtonTriggerProps) {
  const { size, variant } = React.useContext(ObjectSplitButtonContext);
  const variantStyle = variantStyles[variant];

  return (
    <SplitButtonTrigger
      className={cn(
        "bg-[var(--object-split-button-bg)] text-[var(--object-split-button-text)]",
        "border-[var(--object-split-button-border)] hover:bg-[var(--object-split-button-hover-bg)]",
        "group-hover/split-button:bg-[var(--object-split-button-hover-bg)]",
        className,
      )}
      size={objectSplitButtonSizes[size].trigger}
      style={semanticStyle({
        "--object-split-button-bg": variantStyle.bg,
        "--object-split-button-hover-bg": variantStyle.hoverBg,
        "--object-split-button-border": variantStyle.border,
        "--object-split-button-text": variantStyle.text,
      })}
      variant="outline"
      {...props}
    />
  );
}

type ObjectSplitButtonContentProps = React.ComponentProps<typeof SplitButtonContent>;

function ObjectSplitButtonContent(props: ObjectSplitButtonContentProps) {
  return <SplitButtonContent {...props} />;
}

type ObjectSplitButtonItemProps = React.ComponentProps<typeof SplitButtonItem>;

function ObjectSplitButtonItem(props: ObjectSplitButtonItemProps) {
  return <SplitButtonItem {...props} />;
}

export type ObjectSplitButtonOption = Omit<
  React.ComponentProps<typeof SplitButtonItem>,
  "children" | "id" | "onClick"
> & {
  id: string;
  label: string;
  leadingIcon?: React.ReactNode;
  onClick?: React.ComponentProps<typeof SplitButtonItem>["onClick"];
};

export type ObjectSplitButtonVariantProps = Omit<
  React.ComponentProps<typeof SplitButtonGroup>,
  "children" | "className"
> & {
  type?: ObjectIconName;
  label?: string;
  variant?: ObjectIconTone;
  onLabelClick?: React.ComponentProps<typeof SplitButtonAction>["onClick"];
  options?: ObjectSplitButtonOption[];
  onChevronClick?: React.ComponentProps<typeof SplitButtonTrigger>["onClick"];
  size?: ObjectSplitButtonSize;
  className?: React.ComponentProps<typeof SplitButtonGroup>["className"];
  dropdownAriaLabel?: string;
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
export {
  ObjectSplitButton,
  ObjectSplitButtonAction,
  ObjectSplitButtonContent,
  ObjectSplitButtonGroup,
  ObjectSplitButtonItem,
  ObjectSplitButtonSeparator,
  ObjectSplitButtonTrigger,
};
