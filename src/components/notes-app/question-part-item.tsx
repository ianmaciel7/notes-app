"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionChoiceGroup } from "@/components/notes-app/question-choice-group";
import { QuestionFillBlankInput } from "@/components/notes-app/question-fill-blank-input";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { CaseStudyPart, CaseStudyPartAnswer } from "@/types/question";

type QuestionPartItemProps = Omit<
  ComponentProps<typeof FieldSet>,
  "children" | "onChange"
> & {
  item: CaseStudyPart;
  /** 1-based position among the parts. */
  position: number;
  value: CaseStudyPartAnswer | undefined;
  correctAnswer: CaseStudyPartAnswer | undefined;
  resolved: boolean;
  onValueChange: (value: CaseStudyPartAnswer) => void;
};

function asList(value: CaseStudyPartAnswer | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

/** One answerable sub-question of a case study. */
function QuestionPartItem({
  item,
  position,
  value,
  correctAnswer,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionPartItemProps) {
  const t = useTranslations("exam");

  return (
    <FieldSet
      data-slot="question-part-item"
      {...props}
      className={cn(
        "min-w-0 gap-2 rounded-lg border border-border p-3",
        className,
      )}
    >
      <FieldLegend variant="label">
        {t("caseStudyQuestionIndex", { current: position })}
      </FieldLegend>
      <p className="whitespace-pre-wrap text-sm text-foreground">
        {item.prompt}
      </p>
      {item.type === "fill-blank" ? (
        <QuestionFillBlankInput
          value={typeof value === "string" ? value : ""}
          acceptedAnswers={asList(correctAnswer)}
          resolved={resolved}
          onValueChange={onValueChange}
        />
      ) : (
        <QuestionChoiceGroup
          legend={item.prompt}
          mode={item.type === "multiple-choice" ? "multiple" : "single"}
          options={item.options}
          value={asList(value)}
          correctIds={asList(correctAnswer)}
          resolved={resolved}
          onValueChange={(ids) =>
            onValueChange(
              item.type === "multiple-choice" ? ids : (ids[0] ?? ""),
            )
          }
        />
      )}
      {resolved && item.explanation ? (
        <FieldDescription>{item.explanation}</FieldDescription>
      ) : null}
    </FieldSet>
  );
}

export { QuestionPartItem, type QuestionPartItemProps };
