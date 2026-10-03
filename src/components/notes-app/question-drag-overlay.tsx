"use client";

import { DragOverlay } from "@dnd-kit/core";
import { GripVerticalIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { QuestionImageFigure } from "@/components/notes-app/question-image-figure";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuestionItem } from "@/types/question";

type QuestionDragOverlayProps = Omit<
  ComponentProps<typeof Button>,
  "children"
> & {
  item: QuestionItem | null;
};

/** A floating drag overlay representation of the currently dragged item. */
function QuestionDragOverlay({
  item,
  className,
  ...props
}: QuestionDragOverlayProps) {
  if (!item) return null;

  return (
    <DragOverlay>
      <Button
        data-slot="question-drag-overlay"
        type="button"
        variant="outline"
        {...props}
        className={cn(
          "relative h-auto min-h-8 touch-none justify-start gap-2 whitespace-normal bg-background py-1.5 text-left font-normal shadow-lg ring-2 ring-primary/20",
          className,
        )}
      >
        <GripVerticalIcon aria-hidden="true" />
        <span>{item.text}</span>
        {item.imageUrl ? (
          <QuestionImageFigure
            url={item.imageUrl}
            alt={item.imageAlt ?? item.text}
            className="w-24"
          />
        ) : null}
      </Button>
    </DragOverlay>
  );
}

export { QuestionDragOverlay, type QuestionDragOverlayProps };
