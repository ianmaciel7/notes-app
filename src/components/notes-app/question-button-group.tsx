"use client";

import { RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

type QuestionButtonGroupProps = Omit<
  ComponentProps<typeof ButtonGroup>,
  "children"
> & {
  children?: ReactNode;
  resolved?: boolean;
  isResolved?: boolean;
  needsConfirmation?: boolean;
  canSubmit?: boolean;
  isSubmitting?: boolean;
  onRetry?: () => void;
  retry?: () => void;
  onSubmit?: () => void;
  submit?: () => void;
  onShowAnswer?: () => void;
  showAnswer?: () => void;
};

function QuestionButtonGroup({
  children,
  resolved: resolvedProp,
  isResolved: isResolvedProp,
  needsConfirmation = false,
  canSubmit = true,
  isSubmitting = false,
  onRetry,
  retry: retryProp,
  onSubmit,
  submit: submitProp,
  onShowAnswer,
  showAnswer: showAnswerProp,
  className,
  ...props
}: QuestionButtonGroupProps) {
  const t = useTranslations("exam");
  const isResolved = isResolvedProp ?? resolvedProp ?? false;
  const handleRetry = onRetry ?? retryProp;
  const handleSubmit = onSubmit ?? submitProp;
  const handleShowAnswer = onShowAnswer ?? showAnswerProp;

  return (
    <ButtonGroup
      data-slot="question-button-group"
      {...props}
      className={cn("gap-2", className)}
    >
      {children ??
        (isResolved ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRetry}
          >
            <RotateCcwIcon aria-hidden="true" data-icon="inline-start" />
            {t("tryAgain")}
          </Button>
        ) : (
          <>
            {needsConfirmation ? (
              <Button
                type="button"
                size="sm"
                disabled={!canSubmit || isSubmitting}
                onClick={handleSubmit}
              >
                {t("checkAnswer")}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleShowAnswer}
            >
              {t("showAnswer")}
            </Button>
          </>
        ))}
    </ButtonGroup>
  );
}

export { QuestionButtonGroup, type QuestionButtonGroupProps };
