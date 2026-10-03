"use client";

import { DndContext } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionDragPoolList } from "@/components/notes-app/question-drag-pool-list";
import { QuestionSlotItem } from "@/components/notes-app/question-slot-item";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { useQuestionDragDropGroup } from "@/hooks/use-question-drag-drop-group";
import { cn } from "@/lib/utils";
import type { QuestionItem, QuestionSlot } from "@/types/question";

type QuestionDragDropGroupProps = Omit<
  ComponentProps<typeof FieldSet>,
  "children" | "onChange"
> & {
  legend: string;
  items: QuestionItem[];
  slots: QuestionSlot[];
  /** slotId -> itemId placed so far. */
  value: Readonly<Record<string, string>>;
  /** slotId -> itemId key, used to mark slots once `resolved`. */
  correctAnswer: Readonly<Record<string, string>>;
  resolved: boolean;
  onValueChange: (next: Record<string, string>) => void;
};

function QuestionDragDropGroup({
  legend,
  items,
  slots,
  value,
  correctAnswer,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionDragDropGroupProps) {
  const t = useTranslations("exam");
  const { sensors, accessibility, poolItems, placeItem, handleDragEnd } =
    useQuestionDragDropGroup({ items, slots, value, onValueChange });

  return (
    <FieldSet
      data-slot="question-drag-drop-group"
      {...props}
      className={cn("min-w-0 gap-3", className)}
    >
      <FieldLegend className="sr-only">{legend}</FieldLegend>
      <p className="text-xs text-muted-foreground">{t("dragHint")}</p>
      <DndContext
        sensors={sensors}
        accessibility={accessibility}
        onDragEnd={handleDragEnd}
      >
        <QuestionDragPoolList items={poolItems} disabled={resolved} />
        {slots.map((slot) => (
          <QuestionSlotItem
            key={slot.id}
            slot={slot}
            items={items}
            placedId={value[slot.id] ?? ""}
            correctId={correctAnswer[slot.id] ?? ""}
            resolved={resolved}
            onPlace={(itemId) => placeItem(itemId, slot.id)}
          />
        ))}
      </DndContext>
    </FieldSet>
  );
}

export { QuestionDragDropGroup, type QuestionDragDropGroupProps };
