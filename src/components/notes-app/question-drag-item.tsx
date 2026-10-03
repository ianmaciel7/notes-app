"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVerticalIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { QuestionImageItem } from "@/components/notes-app/question-image-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuestionItem } from "@/types/question";

type QuestionDragItemProps = Omit<
  ComponentProps<typeof Button>,
  "children" | "id" | "onClick"
> & {
  item: QuestionItem;
};

/** A chip the learner can drag with a pointer or move with the keyboard. */
function QuestionDragItem({
  item,
  disabled,
  className,
  ...props
}: QuestionDragItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id, disabled });

  return (
    <Button
      data-slot="question-drag-item"
      data-dragging={isDragging || undefined}
      type="button"
      variant="outline"
      disabled={disabled}
      {...props}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      aria-disabled={disabled || undefined}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      className={cn(
        "relative h-auto min-h-8 touch-none justify-start gap-2 whitespace-normal py-1.5 text-left font-normal data-[dragging]:z-10 data-[dragging]:shadow-md",
        className,
      )}
    >
      {disabled ? null : <GripVerticalIcon aria-hidden="true" />}
      <span>{item.text}</span>
      {item.imageUrl ? (
        <QuestionImageItem
          url={item.imageUrl}
          alt={item.imageAlt ?? item.text}
          className="w-24"
        />
      ) : null}
    </Button>
  );
}

export { QuestionDragItem, type QuestionDragItemProps };
