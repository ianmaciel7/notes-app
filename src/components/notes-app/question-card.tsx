"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { QuestionAnswerFieldSet } from "@/components/notes-app/question-answer-field-set";
import { QuestionAnswerFooter } from "@/components/notes-app/question-answer-footer";
import { QuestionCardContent } from "@/components/notes-app/question-card-content";
import { QuestionCardHeader } from "@/components/notes-app/question-card-header";
import { QuestionCardTitle } from "@/components/notes-app/question-card-title";
import { QuestionExplanationFieldContent } from "@/components/notes-app/question-explanation-field-content";
import { QuestionImageFigure } from "@/components/notes-app/question-image-figure";
import { QuestionResultBadge } from "@/components/notes-app/question-result-badge";
import { Card as CardRoot } from "@/components/ui/card";
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
  const state = useQuestionCard({ spaceId, question, card });
  const { status, isResolved } = state;
  const { properties } = question;

  return (
    <CardRoot
      data-slot="question-card"
      data-status={status}
      data-type={properties.type}
      {...props}
      className={cn("w-full pt-0", className)}
    >
      <QuestionCardHeader>
        <QuestionCardTitle>
          <span>{t("questionIndex", { current: index + 1, total })}</span>
          <span aria-live="polite">
            {status === "answeredCorrect" ? (
              <QuestionResultBadge state="correct" />
            ) : null}
            {status === "answeredIncorrect" ? (
              <QuestionResultBadge state="incorrect" />
            ) : null}
          </span>
        </QuestionCardTitle>
      </QuestionCardHeader>
      <QuestionCardContent>
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
        {state.isGradable ? null : (
          <p className="text-xs text-muted-foreground">{t("revealOnly")}</p>
        )}
        <QuestionAnswerFieldSet
          question={properties}
          answer={state.answer}
          resolved={isResolved}
          onAnswerChange={state.setAnswer}
        />
        {state.hasSaveError ? (
          <p role="alert" className="text-xs text-destructive">
            {t("saveFailed")}
          </p>
        ) : null}
        {state.showExplanation && properties.explanation ? (
          <QuestionExplanationFieldContent
            explanation={properties.explanation}
          />
        ) : null}
      </QuestionCardContent>
      <QuestionAnswerFooter
        canSubmit={state.canSubmit}
        isResolved={isResolved}
        isSubmitting={state.isSubmitting}
        needsConfirmation={state.needsConfirmation}
        onRetry={state.retry}
        onShowAnswer={state.showAnswer}
        onSubmit={state.submit}
      />
    </CardRoot>
  );
}

export { QuestionCard, type QuestionCardProps };
