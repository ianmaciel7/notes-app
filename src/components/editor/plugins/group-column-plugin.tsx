"use client";

import { createPlatePlugin } from "platejs/react";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const KEY_GROUP_BLOCK = "groupBlock";
export const KEY_COLUMN_LAYOUT = "columnLayout";
export const KEY_COLUMN = "column";

export interface GroupBlockElementProps extends React.ComponentPropsWithoutRef<"div"> {
  attributes?: Record<string, unknown>;
  element: {
    id?: string;
    appearance?: "plain" | "card" | "callout";
    width?: "content" | "wide" | "full";
  };
}

export function GroupBlockElement({
  className,
  element,
  attributes,
  children,
  ...props
}: GroupBlockElementProps) {
  const { appearance = "card", width = "content" } = element;

  return (
    <div
      data-slot="editor-group-block"
      {...attributes}
      {...props}
      className={cn(
        "my-4 space-y-2",
        appearance === "card" && "rounded-2xl border border-border bg-card p-5 shadow-xs",
        appearance === "callout" && "rounded-xl border border-brand/30 bg-brand/5 p-4",
        width === "wide" && "max-w-4xl",
        width === "full" && "w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface ColumnLayoutElementProps extends React.ComponentPropsWithoutRef<"div"> {
  attributes?: Record<string, unknown>;
  element: {
    id?: string;
    columnCount?: number;
    layoutMode?: "columns" | "grid";
  };
}

export function ColumnLayoutElement({
  className,
  element,
  attributes,
  children,
  ...props
}: ColumnLayoutElementProps) {
  return (
    <div
      data-slot="editor-column-layout"
      {...attributes}
      {...props}
      className={cn("my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}
    >
      {children}
    </div>
  );
}

export function ColumnElement({
  className,
  attributes,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { attributes?: Record<string, unknown> }) {
  return (
    <div
      data-slot="editor-column"
      {...attributes}
      {...props}
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-dashed border-border/60 p-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export const GroupBlockPlugin = createPlatePlugin({
  key: KEY_GROUP_BLOCK,
  node: {
    component: GroupBlockElement,
    isElement: true,
  },
});

export const ColumnLayoutPlugin = createPlatePlugin({
  key: KEY_COLUMN_LAYOUT,
  node: {
    component: ColumnLayoutElement,
    isElement: true,
  },
});

export const ColumnPlugin = createPlatePlugin({
  key: KEY_COLUMN,
  node: {
    component: ColumnElement,
    isElement: true,
  },
});
