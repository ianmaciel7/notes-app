"use client";

import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionDragItem } from "@/components/notes-app/question-drag-item";
import { FieldTitle } from "@/components/ui/field";
import { DRAG_POOL_ID } from "@/hooks/use-question-drag-drop-group";
import { cn } from "@/lib/utils";
import type { QuestionItem } from "@/types/question";

type QuestionDragPoolListProps = Omit<ComponentProps<"div">, "children"> & {
  /** Items that are not in a slot yet. */
  items: QuestionItem[];
  disabled: boolean;
};

/** The unplaced items; it is also a drop target so an item can be taken back. */
function QuestionDragPoolList({
  items,
  disabled,
  className,
  ...props
}: QuestionDragPoolListProps) {
  const t = useTranslations("exam");
  const { setNodeRef, isOver } = useDroppable({ id: DRAG_POOL_ID });

  return (
    <div
      data-slot="question-drag-pool-list"
      data-over={isOver || undefined}
      ref={setNodeRef}
      {...props}
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-dashed border-border p-3 data-[over]:border-primary data-[over]:bg-primary/5",
        className,
      )}
    >
      <FieldTitle>{t("dragPool")}</FieldTitle>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t("dragPoolEmpty")}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <QuestionDragItem key={item.id} item={item} disabled={disabled} />
          ))}
        </div>
      )}
    </div>
  );
}

export { QuestionDragPoolList, type QuestionDragPoolListProps };
