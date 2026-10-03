"use client";

import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useId } from "react";
import { QuestionDragItem } from "@/components/notes-app/question-drag-item";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import type { QuestionItem, QuestionSlot } from "@/types/question";

type QuestionSlotItemProps = Omit<
  ComponentProps<typeof Field>,
  "children" | "onChange" | "slot"
> & {
  slot: QuestionSlot;
  items: QuestionItem[];
  /** Item currently in this slot, or "" when empty. */
  placedId: string;
  correctId: string;
  resolved: boolean;
  /** Called with an item id, or "" to empty the slot. */
  onPlace: (itemId: string) => void;
};

/**
 * A drop target. The select inside it is the keyboard and screen reader path:
 * the same placement is possible without dragging.
 */
function QuestionSlotItem({
  slot,
  items,
  placedId,
  correctId,
  resolved,
  onPlace,
  className,
  ...props
}: QuestionSlotItemProps) {
  const t = useTranslations("exam");
  const selectId = useId();
  const { setNodeRef, isOver } = useDroppable({ id: slot.id });
  const placed = items.find((item) => item.id === placedId);
  const isCorrect = placedId === correctId;
  const correctText = items.find((item) => item.id === correctId)?.text;

  return (
    <Field
      data-slot="question-slot-item"
      data-over={isOver || undefined}
      ref={setNodeRef}
      {...props}
      className={cn(
        "rounded-lg border border-dashed border-border p-3 data-[over]:border-primary data-[over]:bg-primary/5",
        className,
      )}
    >
      <FieldContent className="gap-2">
        <FieldLabel htmlFor={selectId}>{slot.label}</FieldLabel>
        {placed ? (
          <QuestionDragItem
            item={placed}
            disabled={resolved}
            className="w-fit"
          />
        ) : (
          <p className="text-xs text-muted-foreground">{t("dragSlotEmpty")}</p>
        )}
        {resolved && !isCorrect ? (
          <FieldDescription>
            {t("correctSlotItem", { item: correctText ?? correctId })}
          </FieldDescription>
        ) : null}
      </FieldContent>
      <div className="flex items-center gap-2">
        <NativeSelect
          id={selectId}
          value={placedId}
          disabled={resolved}
          aria-label={t("dragSlotSelectLabel", { slot: slot.label })}
          onChange={(event) => onPlace(event.target.value)}
        >
          <NativeSelectOption value="">
            {t("dragSlotSelectPlaceholder")}
          </NativeSelectOption>
          {items.map((item) => (
            <NativeSelectOption key={item.id} value={item.id}>
              {item.text}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {resolved && placed ? (
          <QuestionResultBadge state={isCorrect ? "correct" : "incorrect"} />
        ) : null}
      </div>
    </Field>
  );
}

export { QuestionSlotItem, type QuestionSlotItemProps };
