"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
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
    selectedOptionIds,
    isResolved,
    showExplanation,
    hasSaveError,
    selectOption,
    showAnswer,
  } = useQuestionCard({ spaceId, question, card });
  const { statement, options, correctOptionIds, groundedExplanation, format } =
    question.properties;

  return (
    <CardRoot
      data-slot="question-card"
      data-status={status}
      {...props}
      className={cn("w-full pt-0", className)}
    >
      <CardHeader className="border-b border-border bg-muted/50 pt-(--card-spacing)">
        <CardTitle className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground">
          <span>{t("questionIndex", { current: index + 1, total })}</span>
          {status === "answeredCorrect" ? (
            <Badge>
              <CheckIcon aria-hidden="true" data-icon="inline-start" />
              {t("correct")}
            </Badge>
          ) : null}
          {status === "answeredIncorrect" ? (
            <Badge variant="destructive">
              <XIcon aria-hidden="true" data-icon="inline-start" />
              {t("incorrect")}
            </Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="whitespace-pre-wrap font-sans text-foreground">
          {statement}
        </p>
        {format === "multiple_choice" ? (
          <p className="text-xs text-muted-foreground">{t("multipleHint")}</p>
        ) : null}
        <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
          <legend className="sr-only">{statement}</legend>
          {options.map((option, optionIndex) => {
            const key = String.fromCharCode(65 + optionIndex);
            const selected = selectedOptionIds.includes(option.id);
            const isCorrectOption = correctOptionIds.includes(option.id);
            const wrongPick = isResolved && selected && !isCorrectOption;
            const rightKey = isResolved && isCorrectOption;

            return (
              <Button
                key={option.id}
                type="button"
                variant="outline"
                data-slot="question-option"
                aria-pressed={selected}
                aria-disabled={isResolved}
                onClick={() => selectOption(option.id)}
                className={cn(
                  "h-auto min-h-9 justify-start gap-2 whitespace-normal py-2 text-left font-normal hover:bg-muted/50",
                  // The outline variant sets `dark:border-input dark:bg-input/30`,
                  // so each state repeats its colors under `dark:` to win there.
                  rightKey &&
                    "border-primary bg-primary/10 font-medium text-foreground hover:bg-primary/10 dark:border-primary dark:bg-primary/15 dark:hover:bg-primary/15",
                  wrongPick &&
                    "border-destructive bg-destructive/10 text-destructive hover:bg-destructive/10 hover:text-destructive dark:border-destructive dark:bg-destructive/15 dark:hover:bg-destructive/15",
                  !isResolved &&
                    selected &&
                    "border-primary dark:border-primary",
                )}
              >
                <span className="font-semibold">{key}.</span>
                <span className="flex-1">{option.text}</span>
                {rightKey ? (
                  <>
                    <CheckIcon aria-hidden="true" />
                    <span className="sr-only">
                      {t("correctOptionAria", { key })}
                    </span>
                  </>
                ) : null}
                {wrongPick ? (
                  <>
                    <XIcon aria-hidden="true" />
                    <span className="sr-only">
                      {t("incorrectOptionAria", { key })}
                    </span>
                  </>
                ) : null}
              </Button>
            );
          })}
        </fieldset>
        {hasSaveError ? (
          <p role="alert" className="text-xs text-destructive">
            {t("saveFailed")}
          </p>
        ) : null}
        {showExplanation && groundedExplanation ? (
          <section
            data-slot="question-explanation"
            aria-label={t("explanation")}
            className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">
              {t("explanation")}
            </h3>
            <p className="whitespace-pre-wrap text-sm text-foreground">
              {groundedExplanation.text}
            </p>
            {groundedExplanation.referenceUrls.length > 0 ? (
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-semibold text-muted-foreground">
                  {t("references")}
                </h4>
                <ul className="flex flex-col gap-1 text-xs">
                  {groundedExplanation.referenceUrls.map((url) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-primary underline-offset-4 hover:underline"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}
      </CardContent>
      {isResolved ? null : (
        <CardFooter>
          <Button type="button" variant="ghost" size="sm" onClick={showAnswer}>
            {t("showAnswer")}
          </Button>
        </CardFooter>
      )}
    </CardRoot>
  );
}

export { QuestionCard, type QuestionCardProps };
