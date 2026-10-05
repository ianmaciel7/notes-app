"use client";

import { RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionCardFooter } from "@/components/notes-app/question-card-footer";
import { Button } from "@/components/ui/button";

type QuestionAnswerFooterProps = ComponentProps<typeof QuestionCardFooter> & {
  canSubmit?: boolean;
  isResolved?: boolean;
  isSubmitting?: boolean;
  needsConfirmation?: boolean;
  onRetry?: () => void;
  onShowAnswer?: () => void;
  onSubmit?: () => void;
};

/**
 * Footer actions of a question card. Children replace the default actions,
 * so a caller can compose its own buttons inside the same footer.
 */
function QuestionAnswerFooter({
  canSubmit = true,
  children,
  isResolved = false,
  isSubmitting = false,
  needsConfirmation = false,
  onRetry,
  onShowAnswer,
  onSubmit,
  ...props
}: QuestionAnswerFooterProps) {
  const t = useTranslations("exam");

  if (children) {
    return (
      <QuestionCardFooter data-slot="question-answer-footer" {...props}>
        {children}
      </QuestionCardFooter>
    );
  }

  if (isResolved) {
    return (
      <QuestionCardFooter data-slot="question-answer-footer" {...props}>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RotateCcwIcon aria-hidden="true" data-icon="inline-start" />
          {t("tryAgain")}
        </Button>
      </QuestionCardFooter>
    );
  }

  return (
    <QuestionCardFooter data-slot="question-answer-footer" {...props}>
      {needsConfirmation ? (
        <Button
          type="button"
          size="sm"
          disabled={!canSubmit || isSubmitting}
          onClick={onSubmit}
        >
          {t("checkAnswer")}
        </Button>
      ) : null}
      <Button type="button" variant="ghost" size="sm" onClick={onShowAnswer}>
        {t("showAnswer")}
      </Button>
    </QuestionCardFooter>
  );
}

export { QuestionAnswerFooter, type QuestionAnswerFooterProps };
