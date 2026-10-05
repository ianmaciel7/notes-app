"use client";

import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useId } from "react";
import { QuestionDraggableItem } from "@/components/notes-app/question-draggable-item";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import type {
  QuestionDropField as QuestionDropFieldType,
  QuestionItem,
} from "@/types/question";

type QuestionDroppableFieldProps = Omit<
  ComponentProps<typeof Field>,
  "children" | "onChange"
> & {
  field?: QuestionDropFieldType;
  isPool?: boolean;
  items: QuestionItem[];
  placedId?: string;
  correctId?: string;
  resolved?: boolean;
  onPlace?: (itemId: string) => void;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: dual rendering paths
function QuestionDroppableField({
  field,
  isPool = false,
  items,
  placedId = "",
  correctId = "",
  resolved = false,
  onPlace,
  className,
  ...props
}: QuestionDroppableFieldProps) {
  const t = useTranslations("exam");
  const droppableId = isPool ? "pool" : (field?.id ?? "pool");
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });
  const selectId = useId();
  const descId = `${selectId}-desc`;

  if (isPool) {
    return (
      <Field
        data-slot="question-droppable-field"
        data-over={isOver || undefined}
        ref={setNodeRef}
        {...props}
        className={cn(
          "flex min-h-40 flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3 transition-colors data-[over]:border-primary data-[over]:bg-primary/5 data-[over]:ring-2 data-[over]:ring-primary/20",
          className,
        )}
      >
        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-xs text-muted-foreground">
              {t("dragPoolEmpty")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <QuestionDraggableItem
                key={item.id}
                item={item}
                disabled={Boolean(resolved)}
                className="w-full justify-start shadow-xs hover:border-primary/50"
              />
            ))}
          </div>
        )}
      </Field>
    );
  }

  const placed = items.find((item) => item.id === placedId);
  const isCorrect = placedId === correctId;
  const correctText = items.find((item) => item.id === correctId)?.text;

  return (
    <Field
      data-slot="question-droppable-field"
      {...props}
      className={cn("flex flex-col gap-1.5", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <FieldLabel
          htmlFor={selectId}
          className="text-xs font-semibold tracking-wide text-muted-foreground"
        >
          {field?.label}
        </FieldLabel>
        <div className="flex items-center gap-2">
          {resolved ? (
            <QuestionResultBadge state={isCorrect ? "correct" : "incorrect"} />
          ) : null}
          {placed && !resolved ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onPlace?.("")}
              className="h-auto p-0 text-xs text-muted-foreground transition-colors hover:bg-transparent hover:text-destructive"
            >
              {t("dragSlotClear")}
            </Button>
          ) : null}
          <NativeSelect
            id={selectId}
            value={placedId}
            disabled={resolved}
            aria-label={t("dragSlotSelectLabel", { slot: field?.label ?? "" })}
            aria-invalid={resolved && !isCorrect}
            aria-describedby={resolved && !isCorrect ? descId : undefined}
            className="sr-only focus:not-sr-only focus:h-7 focus:w-auto focus:px-2 focus:py-0 focus:text-xs"
            onChange={(event) => onPlace?.(event.target.value)}
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
            ? "border-transparent bg-background shadow-xs data-[over]:border-primary data-[over]:ring-2 data-[over]:ring-primary/30"
            : "border-border/80 bg-background/40 px-3 py-2 text-xs text-muted-foreground data-[over]:border-primary data-[over]:bg-primary/10 data-[over]:ring-2 data-[over]:ring-primary/20",
        )}
      >
        {placed ? (
          <QuestionDraggableItem
            item={placed}
            disabled={Boolean(resolved)}
            className="w-full justify-start shadow-xs hover:border-primary/50"
          />
        ) : (
          <span
            className={cn(
              "select-none text-xs text-muted-foreground/70 transition-opacity",
              isOver && "opacity-0",
            )}
          >
            {t("dragSlotEmpty")}
          </span>
        )}
      </div>

      {resolved && !isCorrect ? (
        <FieldDescription id={descId} className="text-xs text-destructive">
          {t("correctSlotItem", { item: correctText ?? correctId })}
        </FieldDescription>
      ) : null}
    </Field>
  );
}

export { QuestionDroppableField, type QuestionDroppableFieldProps };
