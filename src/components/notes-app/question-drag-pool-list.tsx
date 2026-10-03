"use client";

import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionDragItem } from "@/components/notes-app/question-drag-item";
import { Card } from "@/components/ui/card";
import { DRAG_POOL_ID } from "@/hooks/use-question-drag-drop-group";
import { cn } from "@/lib/utils";
import type { QuestionItem } from "@/types/question";

type QuestionDragPoolListProps = Omit<
  ComponentProps<typeof Card>,
  "children"
> & {
  /** Items that are not in a slot yet. */
  items: QuestionItem[];
  disabled: boolean;
};

function QuestionDragPoolList({
  items,
  disabled,
  className,
  ...props
}: QuestionDragPoolListProps) {
  const t = useTranslations("exam");
  const { setNodeRef, isOver } = useDroppable({ id: DRAG_POOL_ID });

  return (
    <Card
      data-slot="question-drag-pool-list"
      data-over={isOver || undefined}
      ref={setNodeRef}
      {...props}
      className={cn(
        "flex min-h-40 flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3 data-[over]:border-primary data-[over]:bg-primary/5",
        className,
      )}
    >
      {items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-xs text-muted-foreground">{t("dragPoolEmpty")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <QuestionDragItem
              key={item.id}
              item={item}
              disabled={disabled}
              className="w-full justify-start shadow-xs hover:border-primary/50"
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export { QuestionDragPoolList, type QuestionDragPoolListProps };
