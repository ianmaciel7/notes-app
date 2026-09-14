"use client";

import { GripVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlockGutterHandleProps {
  onInsertBelow?: () => void;
  onInsertAbove?: () => void;
  onOpenContextMenu?: () => void;
  className?: string;
}

export function BlockGutterHandle({
  onInsertBelow,
  onInsertAbove,
  onOpenContextMenu,
  className,
}: BlockGutterHandleProps) {
  return (
    <div
      data-slot="editor-block-gutter"
      className={cn(
        "group absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 hover:opacity-100 transition-opacity",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Add block"
        onClick={(e) => {
          if (e.shiftKey) {
            onInsertAbove?.();
          } else {
            onInsertBelow?.();
          }
        }}
        title="Add block (Shift-click to insert above)"
        className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
      >
        <Plus className="size-3.5" />
      </button>

      <button
        type="button"
        aria-label="Open block menu"
        onClick={onOpenContextMenu}
        title="Drag to reorder (Click for block menu)"
        className="flex size-5 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="size-3.5" />
      </button>
    </div>
  );
}
