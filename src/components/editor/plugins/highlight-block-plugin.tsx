"use client";

import { Link2, Quote } from "lucide-react";
import { createPlatePlugin } from "platejs/react";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const KEY_HIGHLIGHT_BLOCK = "highlightBlock";

export interface HighlightBlockElementProps extends React.ComponentPropsWithoutRef<"blockquote"> {
  attributes?: Record<string, unknown>;
  element: {
    id?: string;
    color?: "yellow" | "blue" | "green" | "pink" | "purple";
    sourceLabel?: string;
    sourceObjectId?: string;
    sourceUrl?: string;
  };
}

const colorMap = {
  yellow: "border-amber-400 bg-amber-500/10 text-amber-950 dark:text-amber-100",
  blue: "border-blue-400 bg-blue-500/10 text-blue-950 dark:text-blue-100",
  green: "border-emerald-400 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100",
  pink: "border-pink-400 bg-pink-500/10 text-pink-950 dark:text-pink-100",
  purple: "border-purple-400 bg-purple-500/10 text-purple-950 dark:text-purple-100",
};

export function HighlightBlockElement({
  className,
  element,
  attributes,
  children,
  ...props
}: HighlightBlockElementProps) {
  const { color = "yellow", sourceLabel, sourceUrl } = element;

  return (
    <blockquote
      {...attributes}
      {...props}
      className={cn(
        "my-4 rounded-r-xl border-l-4 p-4 text-base italic shadow-xs transition-colors",
        colorMap[color],
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Quote className="size-5 shrink-0 opacity-60 mt-0.5" />
        <div className="flex-1 space-y-1">
          <div>{children}</div>
          {(sourceLabel || sourceUrl) && (
            <div className="not-italic mt-2 flex items-center gap-1.5 text-xs opacity-75">
              <Link2 className="size-3" />
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:opacity-100"
                >
                  {sourceLabel || sourceUrl}
                </a>
              ) : (
                <span>{sourceLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </blockquote>
  );
}

export const HighlightBlockPlugin = createPlatePlugin({
  key: KEY_HIGHLIGHT_BLOCK,
  node: {
    component: HighlightBlockElement,
    isElement: true,
  },
});
