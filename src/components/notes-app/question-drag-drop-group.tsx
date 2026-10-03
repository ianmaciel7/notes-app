"use client";

import { DndContext } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionDragPoolList } from "@/components/notes-app/question-drag-pool-list";
import { QuestionDropField } from "@/components/notes-app/question-drop-field";
import { FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { useQuestionDragDropGroup } from "@/hooks/use-question-drag-drop-group";
import { cn } from "@/lib/utils";
import type {
  QuestionDropField as QuestionDropFieldType,
  QuestionItem,
} from "@/types/question";

type QuestionDragDropGroupProps = Omit<
  ComponentProps<typeof FieldSet>,
  "children" | "onChange"
> & {
  legend: string;
  items: QuestionItem[];
  slots: QuestionDropFieldType[];
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
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FieldTitle>{t("dragPool")}</FieldTitle>
            <QuestionDragPoolList items={poolItems} disabled={resolved} />
          </div>
          <div className="flex flex-col gap-2">
            <FieldTitle>{t("dragAnswerArea")}</FieldTitle>
            <div
              data-slot="question-answer-area"
              className="flex min-h-40 flex-col gap-3 rounded-lg border border-border bg-muted/20 p-3"
            >
              {slots.map((slot) => (
                <QuestionDropField
                  key={slot.id}
                  field={slot}
                  items={items}
                  placedId={value[slot.id] ?? ""}
                  correctId={correctAnswer[slot.id] ?? ""}
                  resolved={resolved}
                  onPlace={(itemId) => placeItem(itemId, slot.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </DndContext>
    </FieldSet>
  );
}

export { QuestionDragDropGroup, type QuestionDragDropGroupProps };
