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
  yellow: "tone-badge-amber",
  blue: "tone-badge-blue",
  green: "tone-badge-emerald",
  pink: "tone-badge-pink",
  purple: "tone-badge-purple",
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
      data-slot="editor-highlight-block"
      {...attributes}
      {...props}
      className={cn(
        "my-4 rounded-r-xl border-l-4 p-4 text-base italic shadow-xs transition-colors",
        colorMap[color],
        className,
      )}
    >
      <div className="flex items-start gap-3">
         <Quote aria-hidden="true" className="size-5 shrink-0 opacity-60 mt-0.5" />
        <div className="flex-1 space-y-1">
          <div>{children}</div>
          {(sourceLabel || sourceUrl) && (
            <div className="not-italic mt-2 flex items-center gap-1.5 text-xs opacity-75">
               <Link2 aria-hidden="true" className="size-3" />
               {sourceUrl && /^https?:\/\//i.test(sourceUrl) ? (
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
