"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionChoiceFieldSet } from "@/components/notes-app/question-choice-field-set";
import { QuestionDropdownFieldGroup } from "@/components/notes-app/question-dropdown-field-group";
import { QuestionFillBlankField } from "@/components/notes-app/question-fill-blank-field";
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { CaseStudyPart, CaseStudyPartAnswer } from "@/types/question";

type QuestionCaseStudyFieldSetProps = Omit<
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
  if (typeof value === "string") return [value];
  return [];
}

function asMapping(value: unknown): Record<string, string> {
  return typeof value === "object" && !Array.isArray(value) && value !== null
    ? (value as Record<string, string>)
    : {};
}

function renderPartControl({
  item,
  value,
  correctAnswer,
  resolved,
  onValueChange,
}: Omit<QuestionCaseStudyFieldSetProps, "position" | "className">) {
  if (item.type === "fill-blank") {
    return (
      <QuestionFillBlankField
        value={typeof value === "string" ? value : ""}
        acceptedAnswers={asList(correctAnswer)}
        resolved={resolved}
        onValueChange={onValueChange}
      />
    );
  }

  if (item.type === "dropdown") {
    return (
      <QuestionDropdownFieldGroup
        legend={item.prompt}
        dropdowns={item.dropdowns}
        value={asMapping(value)}
        correctAnswer={asMapping(correctAnswer)}
        resolved={resolved}
        onValueChange={onValueChange}
      />
    );
  }

  return (
    <QuestionChoiceFieldSet
      legend={item.prompt}
      mode={item.type === "multiple-choice" ? "multiple" : "single"}
      options={item.options}
      value={asList(value)}
      correctIds={asList(correctAnswer)}
      resolved={resolved}
      onValueChange={(ids: string[]) =>
        onValueChange(item.type === "multiple-choice" ? ids : (ids[0] ?? ""))
      }
    />
  );
}

/** One answerable sub-question of a case study. */
function QuestionCaseStudyFieldSet({
  item,
  position,
  value,
  correctAnswer,
  resolved,
  onValueChange,
  className,
  ...props
}: QuestionCaseStudyFieldSetProps) {
  const t = useTranslations("exam");

  return (
    <FieldSet
      data-slot="question-case-study-field-set"
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
      {renderPartControl({
        item,
        value,
        correctAnswer,
        resolved,
        onValueChange,
      })}
      {resolved && item.explanation ? (
        <FieldDescription>{item.explanation}</FieldDescription>
      ) : null}
    </FieldSet>
  );
}

export { QuestionCaseStudyFieldSet, type QuestionCaseStudyFieldSetProps };
