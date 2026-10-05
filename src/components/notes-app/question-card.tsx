"use client";

import { RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionAnswerFieldSet } from "@/components/notes-app/question-answer-field-set";
import { QuestionExplanationFieldContent } from "@/components/notes-app/question-explanation-field-content";
import { QuestionImageFigure } from "@/components/notes-app/question-image-figure";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  Card as CardRoot,
  CardTitle,
} from "@/components/ui/card";
import { useQuestionCard } from "@/hooks/use-question-card";
import { cn } from "@/lib/utils";
import type { Card } from "@/types/card";
import type { QuestionObject } from "@/types/object";

type QuestionCardProps = Omit<ComponentProps<typeof CardRoot>, "children"> & {
  spaceId: string;
  question: QuestionObject;
  card: Card | null;
  index: number;
  total: number;
};

function QuestionCard({
  spaceId,
  question,
  card,
  index,
  total,
  className,
  ...props
}: QuestionCardProps) {
  const t = useTranslations("exam");
  const {
    status,
    answer,
    isSubmitting,
    isResolved,
    isGradable,
    needsConfirmation,
    canSubmit,
    showExplanation,
    hasSaveError,
    setAnswer,
    submit,
    showAnswer,
    retry,
  } = useQuestionCard({ spaceId, question, card });
  const { properties } = question;

  return (
    <CardRoot
      data-slot="question-card"
      data-status={status}
      data-type={properties.type}
      {...props}
      className={cn("w-full pt-0", className)}
    >
      <CardHeader className="border-b border-border bg-muted/50 pt-(--card-spacing)">
        <CardTitle className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground">
          <span>{t("questionIndex", { current: index + 1, total })}</span>
          <span aria-live="polite">
            {status === "answeredCorrect" ? (
              <QuestionResultBadge state="correct" />
            ) : null}
            {status === "answeredIncorrect" ? (
              <QuestionResultBadge state="incorrect" />
            ) : null}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="whitespace-pre-wrap font-sans text-foreground">
          {properties.prompt}
        </p>
        {properties.promptImage ? (
          <QuestionImageFigure
            url={properties.promptImage.url}
            alt={properties.promptImage.alt}
            className="max-w-xl"
          />
        ) : null}
        {properties.type === "multiple-choice" ? (
          <p className="text-xs text-muted-foreground">{t("multipleHint")}</p>
        ) : null}
        {isGradable ? null : (
          <p className="text-xs text-muted-foreground">{t("revealOnly")}</p>
        )}
        <QuestionAnswerFieldSet
          question={properties}
          answer={answer}
          resolved={isResolved}
          onAnswerChange={setAnswer}
        />
        {hasSaveError ? (
          <p role="alert" className="text-xs text-destructive">
            {t("saveFailed")}
          </p>
        ) : null}
        {showExplanation && properties.explanation ? (
          <QuestionExplanationFieldContent
            explanation={properties.explanation}
          />
        ) : null}
      </CardContent>
      <CardFooter className="gap-2">
        {isResolved ? (
          <Button type="button" variant="outline" size="sm" onClick={retry}>
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
                onClick={submit}
              >
                {t("checkAnswer")}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={showAnswer}
            >
              {t("showAnswer")}
            </Button>
          </>
        )}
      </CardFooter>
    </CardRoot>
  );
}

export { QuestionCard, type QuestionCardProps };
