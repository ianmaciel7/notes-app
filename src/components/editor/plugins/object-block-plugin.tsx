"use client";

import { ExternalLink, FileText, Lock, WifiOff } from "lucide-react";
import { createPlatePlugin } from "platejs/react";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const KEY_OBJECT_BLOCK = "objectBlock";

export interface ObjectBlockElementProps extends React.ComponentPropsWithoutRef<"div"> {
  attributes?: Record<string, unknown>;
  element: {
    id?: string;
    targetId: string;
    viewKind?: "inline" | "small-card" | "wide-card" | "embed" | "transclusion";
    mediaDisplay?: "preview" | "thumbnail" | "audio" | "attachment" | null;
    state?: "available" | "missing" | "permission-denied" | "offline" | "recursive" | "read-only";
    title?: string;
  };
}

export function ObjectBlockElement({
  className,
  element,
  attributes,
  children,
  ...props
}: ObjectBlockElementProps) {
  const {
    targetId,
    viewKind = "small-card",
    state = "available",
    title = "Untitled Object",
  } = element;

  if (state === "missing" || state === "permission-denied" || state === "offline") {
    return (
      <div
        data-slot="editor-object-block"
        {...attributes}
        {...props}
        className={cn(
          "my-2 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive",
          className,
        )}
      >
        {state === "offline" ? <WifiOff aria-hidden="true" className="size-4" /> : <Lock aria-hidden="true" className="size-4" />}
        <span>
          {title} ({state})
        </span>
        {children}
      </div>
    );
  }

  if (viewKind === "inline") {
    return (
      <span
        data-slot="editor-object-reference"
        {...attributes}
        {...props}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium text-foreground hover:bg-accent cursor-pointer",
          className,
        )}
      >
        <FileText aria-hidden="true" className="size-3 text-muted-foreground" />
        <span>{title}</span>
        {children}
      </span>
    );
  }

  return (
    <div
      data-slot="editor-object-block"
      {...attributes}
      {...props}
      className={cn(
        "my-3 rounded-xl border border-border bg-card p-4 shadow-xs transition-colors hover:border-brand/50",
        viewKind === "wide-card" && "w-full",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <FileText aria-hidden="true" className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-card-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground">Object ID: {targetId}</p>
          </div>
        </div>
        <ExternalLink aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

export const ObjectBlockPlugin = createPlatePlugin({
  key: KEY_OBJECT_BLOCK,
  node: {
    component: ObjectBlockElement,
    isElement: true,
    isVoid: true,
  },
});
