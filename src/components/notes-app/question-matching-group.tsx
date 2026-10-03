"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionMatchingItem } from "@/components/notes-app/question-matching-item";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { QuestionItem } from "@/types/question";

type QuestionMatchingGroupProps = Omit<
  ComponentProps<typeof FieldSet>,
  "children" | "onChange"
> & {
  legend: string;
  leftItems: QuestionItem[];
  rightItems: QuestionItem[];
  /** leftId -> rightId chosen so far. */
  value: Readonly<Record<string, string>>;
  /** leftId -> rightId key, used to mark pairs once `resolved`. */
  correctAnswer: Readonly<Record<string, string>>;
  resolved: boolean;
  onValueChange: (next: Record<string, string>) => void;
};

function QuestionMatchingGroup({
  legend,
  leftItems,
  rightItems,
  value,
  correctAnswer,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionMatchingGroupProps) {
  const t = useTranslations("exam");

  return (
    <FieldSet
      data-slot="question-matching-group"
      {...props}
      className={cn("min-w-0 gap-3", className)}
    >
      <FieldLegend className="sr-only">{legend}</FieldLegend>
      <p className="text-xs text-muted-foreground">{t("matchingHint")}</p>
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {leftItems.map((item) => (
          <div key={item.id} className="p-3">
            <QuestionMatchingItem
              item={item}
              rightItems={rightItems}
              chosenId={value[item.id] ?? ""}
              correctId={correctAnswer[item.id] ?? ""}
              resolved={resolved}
              onChosenChange={(rightId) =>
                onValueChange({ ...value, [item.id]: rightId })
              }
            />
          </div>
        ))}
      </div>
    </FieldSet>
  );
}

export { QuestionMatchingGroup, type QuestionMatchingGroupProps };
