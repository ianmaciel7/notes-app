"use client";

import { AlertCircle, Sigma } from "lucide-react";
import { createPlatePlugin } from "platejs/react";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const KEY_MATH_BLOCK = "mathBlock";

export interface MathBlockElementProps extends React.ComponentPropsWithoutRef<"div"> {
  attributes?: Record<string, unknown>;
  element: {
    id?: string;
    displayMode?: "inline" | "block";
    source?: string;
    sourceStatus?: "valid" | "invalid";
  };
}

export function MathBlockElement({
  className,
  element,
  attributes,
  children,
  ...props
}: MathBlockElementProps) {
  const { displayMode = "block", source = "", sourceStatus = "valid" } = element;
  const isInline = displayMode === "inline";

  if (sourceStatus === "invalid") {
    return (
      <span
        data-slot="editor-math-block"
        {...attributes}
        {...props}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-2.5 py-1 text-xs text-destructive",
          className,
        )}
      >
        <AlertCircle aria-hidden="true" className="size-3.5" />
        <span>TeX Syntax Error: {source}</span>
        {children}
      </span>
    );
  }

  if (isInline) {
    return (
      <span
        data-slot="editor-math-inline"
        {...attributes}
        {...props}
        className={cn(
          "inline-flex items-center gap-1 rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-foreground",
          className,
        )}
      >
        <Sigma aria-hidden="true" className="size-3 text-brand" />
        <span>{source}</span>
        {children}
      </span>
    );
  }

  return (
    <div
      data-slot="editor-math-block"
      {...attributes}
      {...props}
      className={cn(
        "my-3 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 shadow-xs font-mono text-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Sigma aria-hidden="true" className="size-4 text-brand" />
        <span className="text-xs uppercase font-medium tracking-wider">LaTeX Equation</span>
      </div>
      <div className="text-base text-foreground font-semibold">
        {source || "\\text{Empty Equation}"}
      </div>
      {children}
    </div>
  );
}

export const MathBlockPlugin = createPlatePlugin({
  key: KEY_MATH_BLOCK,
  node: {
    component: MathBlockElement,
    isElement: true,
    isVoid: true,
  },
});
