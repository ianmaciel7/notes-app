"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useId } from "react";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { matchesAcceptedAnswer } from "@/lib/exam/evaluate-answer";

type QuestionFillBlankInputProps = Omit<
  ComponentProps<typeof Field>,
  "children" | "onChange"
> & {
  value: string;
  /** The key, shown once graded when the typed text did not match. */
  acceptedAnswers: readonly string[];
  resolved: boolean;
  onValueChange: (value: string) => void;
};

function QuestionFillBlankInput({
  value,
  acceptedAnswers,
  resolved,
  onValueChange,
  ...props
}: QuestionFillBlankInputProps) {
  const t = useTranslations("exam");
  const inputId = useId();
  const matches = matchesAcceptedAnswer(value, acceptedAnswers);

  const descId = `${inputId}-desc`;

  return (
    <Field data-slot="question-fill-blank-input" {...props}>
      <FieldLabel htmlFor={inputId}>{t("fillBlankLabel")}</FieldLabel>
      <FieldContent className="gap-2">
        <div className="flex items-center gap-2">
          <Input
            id={inputId}
            value={value}
            disabled={resolved}
            readOnly={resolved}
            autoComplete="off"
            placeholder={t("fillBlankPlaceholder")}
            aria-invalid={resolved && !matches}
            aria-describedby={resolved && !matches ? descId : undefined}
            onChange={(event) => onValueChange(event.target.value)}
          />
          {resolved ? (
            <QuestionResultBadge state={matches ? "correct" : "incorrect"} />
          ) : null}
        </div>
        {resolved && !matches ? (
          <FieldDescription id={descId}>
            {t("acceptedAnswers", { answers: acceptedAnswers.join(", ") })}
          </FieldDescription>
        ) : null}
      </FieldContent>
    </Field>
  );
}

export { QuestionFillBlankInput, type QuestionFillBlankInputProps };
