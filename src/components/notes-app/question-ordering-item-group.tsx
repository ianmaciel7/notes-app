"use client";

import type { ComponentProps } from "react";
import { useEffect } from "react";
import { QuestionOrderingItem } from "@/components/notes-app/question-ordering-item";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { QuestionItem } from "@/types/question";

type QuestionOrderingItemGroupProps = Omit<
  ComponentProps<typeof FieldSet>,
  "children" | "onChange"
> & {
  legend: string;
  items: QuestionItem[];
  value: string[];
  correctAnswer: string[];
  resolved: boolean;
  onValueChange: (value: string[]) => void;
};

function QuestionOrderingItemGroup({
  legend,
  items,
  value,
  correctAnswer,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionOrderingItemGroupProps) {
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
      data-slot="question-ordering-item-group"
      {...props}
      className={cn("min-w-0 gap-3", className)}
    >
      <FieldLegend className="sr-only">{legend}</FieldLegend>
      <div className="flex flex-col gap-2">
        {orderedIds.map((id, index) => {
          const item = itemMap.get(id);
          if (!item) return null;

          const isCorrect = resolved && id === correctAnswer[index];

          return (
            <QuestionOrderingItem
              key={id}
              item={item}
              index={index}
              total={orderedIds.length}
              resolved={resolved}
              isCorrect={isCorrect}
              onMoveUp={() => move(index, index - 1)}
              onMoveDown={() => move(index, index + 1)}
            />
          );
        })}
      </div>
    </FieldSet>
  );
}

export { QuestionOrderingItemGroup, type QuestionOrderingItemGroupProps };
