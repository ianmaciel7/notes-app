"use client";

import type {
  QuestionnaireChoiceDefinition,
  QuestionnaireItemDefinition,
  Questionnaire as QuestionnairePrimitive,
} from "@shadcn/react/questionnaire";
import { CircleHelpIcon } from "lucide-react";
import type * as React from "react";
import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n";

export type ExamQuestionType = "single-choice" | "multiple-choice";

export interface ExamQuestionOption extends QuestionnaireChoiceDefinition {
  label: string;
  text: string;
}

export interface ExamQuestion
  extends Omit<QuestionnaireItemDefinition, "choices"> {
  number: number;
  type: ExamQuestionType;
  statement: string;
  instructions?: string;
  options: readonly ExamQuestionOption[];
  correctAnswers: string[];
  explanation?: string;
  discussion?: string;
  images?: string[];
}

export interface ExamQuestionnaireProps
  extends Omit<
    ComponentProps<typeof QuestionnairePrimitive.Root>,
    "children" | "items" | "onSubmit"
  > {
  questions: readonly ExamQuestion[];
  onSubmitAction?: (answers: Record<string, string[]>) => void;
}

export function ExamQuestionnaire({
  questions,
  onSubmitAction,
  ...questionnaireProps
}: ExamQuestionnaireProps) {
  const { t } = useI18n();
  const items: QuestionnaireItemDefinition[] = questions.map((question) => ({
    name: question.name,
    disabled: question.disabled,
    required: question.required ?? true,
    choices: question.options,
  }));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const answers = Object.fromEntries(
      questions.map((question) => [
        question.name,
        formData.getAll(question.name).map(String),
      ]),
    );

    onSubmitAction?.(answers);
  }

  if (questions.length === 0) {
    return (
      <Empty className="min-h-64 rounded-lg border">
        <EmptyMedia variant="icon" aria-hidden="true">
          <CircleHelpIcon />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>{t("questionnaire.emptyTitle")}</EmptyTitle>
          <EmptyDescription>
            {t("questionnaire.emptyDescription")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Questionnaire
      {...questionnaireProps}
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress className="w-fit rounded-md bg-muted px-2 py-1" />

      {questions.map((question, index) => {
        const item = items[index];

        return (
          <QuestionnaireItem
            key={item.name}
            name={item.name}
            disabled={item.disabled}
            required={item.required}
            multiple={question.type === "multiple-choice"}
          >
            <QuestionnaireTitle>
              <span className="flex flex-wrap items-center gap-2">
                <span>
                  {question.number}. {question.statement}
                </span>
                <Badge variant="secondary">
                  {question.type === "multiple-choice"
                    ? "Multiple choice"
                    : "Single choice"}
                </Badge>
              </span>
            </QuestionnaireTitle>

            {question.instructions ? (
              <QuestionnaireDescription>
                {question.instructions}
              </QuestionnaireDescription>
            ) : null}

            <QuestionnaireChoices>
              {question.options.map((option) => (
                <QuestionnaireChoice
                  key={option.value}
                  value={option.value}
                  aria-label={`${option.label}. ${option.text}`}
                >
                  <span className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0">
                      {option.label}.
                    </Badge>
                    <span className="pt-0.5">{option.text}</span>
                  </span>
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>

            <QuestionnaireError />
          </QuestionnaireItem>
        );
      })}

      <Separator />
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit>{t("questionnaire.submit")}</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
