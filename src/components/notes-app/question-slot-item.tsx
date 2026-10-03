"use client";

import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useId } from "react";
import { QuestionDragItem } from "@/components/notes-app/question-drag-item";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import type { QuestionItem, QuestionSlot } from "@/types/question";

type QuestionSlotItemProps = Omit<
  ComponentProps<"div">,
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

  const descId = `${selectId}-desc`;

  return (
    <div
      data-slot="question-slot-item"
      {...props}
      className={cn("flex flex-col gap-1.5", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <Label
          htmlFor={selectId}
          className="text-xs font-semibold text-muted-foreground tracking-wide"
        >
          {slot.label}
        </Label>
        <div className="flex items-center gap-2">
          {resolved ? (
            <QuestionResultBadge state={isCorrect ? "correct" : "incorrect"} />
          ) : null}
          {placed && !resolved ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onPlace("")}
              className="h-auto p-0 text-xs text-muted-foreground transition-colors hover:bg-transparent hover:text-destructive"
            >
              {t("dragSlotClear")}
            </Button>
          ) : null}
          <NativeSelect
            id={selectId}
            value={placedId}
            disabled={resolved}
            aria-label={t("dragSlotSelectLabel", { slot: slot.label })}
            aria-invalid={resolved && !isCorrect}
            aria-describedby={resolved && !isCorrect ? descId : undefined}
            className="sr-only focus:not-sr-only focus:h-7 focus:w-auto focus:py-0 focus:px-2 focus:text-xs"
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
        </div>
      </div>

      <div
        ref={setNodeRef}
        data-over={isOver || undefined}
        className={cn(
          "flex min-h-11 items-center justify-center rounded-md border border-dashed transition-all",
          placed
            ? "border-transparent bg-background shadow-xs"
            : "border-border/80 bg-background/40 px-3 py-2 text-xs text-muted-foreground data-[over]:border-primary data-[over]:bg-primary/10",
        )}
      >
        {placed ? (
          <QuestionDragItem
            item={placed}
            disabled={resolved}
            className="w-full justify-start shadow-xs hover:border-primary/50"
          />
        ) : (
          <span className="text-xs text-muted-foreground/70">
            {t("dragSlotEmpty")}
          </span>
        )}
      </div>

      {resolved && !isCorrect ? (
        <p id={descId} className="text-xs text-destructive">
          {t("correctSlotItem", { item: correctText ?? correctId })}
        </p>
      ) : null}
    </div>
  );
}

export { QuestionSlotItem, type QuestionSlotItemProps };
