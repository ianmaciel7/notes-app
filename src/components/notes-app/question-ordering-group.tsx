"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useEffect } from "react";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import { Button } from "@/components/ui/button";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { QuestionItem } from "@/types/question";

interface QuestionOrderingGroupProps
  extends Omit<ComponentProps<typeof FieldSet>, "children" | "onChange"> {
  legend: string;
  items: QuestionItem[];
  value: string[];
  correctAnswer: string[];
  resolved: boolean;
  onValueChange: (value: string[]) => void;
}

function QuestionOrderingGroup({
  legend,
  items,
  value,
  correctAnswer,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionOrderingGroupProps) {
  // Initialize with initial sequence if value is empty
  useEffect(() => {
    if (value.length === 0 && items.length > 0) {
      onValueChange(items.map((i) => i.id));
    }
  }, [value, items, onValueChange]);

  const orderedIds =
    value.length === items.length ? value : items.map((i) => i.id);
  const itemMap = new Map(items.map((i) => [i.id, i]));

  const move = (fromIndex: number, toIndex: number) => {
    if (resolved || toIndex < 0 || toIndex >= orderedIds.length) return;
    const next = [...orderedIds];
    const [removed] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, removed);
    onValueChange(next);
  };

  return (
    <FieldSet
      data-slot="question-ordering-group"
      {...props}
      className={cn("min-w-0 gap-3", className)}
    >
      <FieldLegend className="sr-only">{legend}</FieldLegend>
      <div className="flex flex-col gap-2">
        {orderedIds.map((id, index) => {
          const item = itemMap.get(id);
          if (!item) return null;

          const isCorrect = resolved && id === correctAnswer[index];
          const isIncorrect = resolved && !isCorrect;
          const status = isCorrect
            ? "correct"
            : isIncorrect
              ? "incorrect"
              : undefined;

          return (
            <div
              key={id}
              data-slot="question-ordering-item"
              data-status={status}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-xs transition-colors",
                status === "correct" && "border-primary bg-primary/10",
                status === "incorrect" &&
                  "border-destructive bg-destructive/10",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.text}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {status ? <QuestionResultBadge state={status} /> : null}

                {!resolved ? (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                      aria-label={`Move ${item.text} up`}
                    >
                      <ArrowUpIcon className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={index === orderedIds.length - 1}
                      onClick={() => move(index, index + 1)}
                      aria-label={`Move ${item.text} down`}
                    >
                      <ArrowDownIcon className="size-4" />
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </FieldSet>
  );
}

export { QuestionOrderingGroup, type QuestionOrderingGroupProps };
