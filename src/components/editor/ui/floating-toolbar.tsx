"use client";

import { Bold, Code, Highlighter, Italic, Link as LinkIcon, Sigma } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FloatingToolbarProps {
  isVisible?: boolean;
  onToggleMark?: (mark: "bold" | "italic" | "code" | "link" | "math" | "highlight") => void;
  className?: string;
}

export function FloatingToolbar({
  isVisible = false,
  onToggleMark,
  className,
}: FloatingToolbarProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "z-50 flex items-center gap-0.5 rounded-xl border border-border bg-popover/95 backdrop-blur-xs p-1 shadow-md animate-in fade-in-50 zoom-in-95",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onToggleMark?.("bold")}
        title="Bold"
        className="flex size-7 items-center justify-center rounded-lg text-popover-foreground hover:bg-accent cursor-pointer"
      >
        <Bold className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onToggleMark?.("italic")}
        title="Italic"
        className="flex size-7 items-center justify-center rounded-lg text-popover-foreground hover:bg-accent cursor-pointer"
      >
        <Italic className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onToggleMark?.("code")}
        title="Inline Code"
        className="flex size-7 items-center justify-center rounded-lg text-popover-foreground hover:bg-accent cursor-pointer"
      >
        <Code className="size-3.5" />
      </button>

      <div className="mx-1 h-4 w-px bg-border" />

      <button
        type="button"
        onClick={() => onToggleMark?.("link")}
        title="Insert Link"
        className="flex size-7 items-center justify-center rounded-lg text-popover-foreground hover:bg-accent cursor-pointer"
      >
        <LinkIcon className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onToggleMark?.("math")}
        title="Inline Math TeX"
        className="flex size-7 items-center justify-center rounded-lg text-popover-foreground hover:bg-accent cursor-pointer"
      >
        <Sigma className="size-3.5 text-brand" />
      </button>

      <button
        type="button"
        onClick={() => onToggleMark?.("highlight")}
        title="Highlight / Callout"
        className="flex size-7 items-center justify-center rounded-lg text-popover-foreground hover:bg-accent cursor-pointer"
      >
        <Highlighter className="size-3.5 text-amber-500" />
      </button>
    </div>
  );
}
