"use client";

import {
  BookmarkCheckIcon,
  BookmarkIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SendIcon,
  TrophyIcon,
  XCircleIcon,
} from "lucide-react";
import { useId, useState, useTransition } from "react";

import { MarkdownPrompt } from "@/components/object/question/markdown-prompt";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useI18n } from "@/hooks/use-i18n";
import {
  type AttemptItemViewDto,
  type AttemptScoreResult,
  type AttemptViewDto,
  bookmarkAttemptQuestionAction,
  completeAttemptAction,
  type QuestionFeedbackDto,
  submitAttemptAnswerAction,
} from "@/lib/actions/attempt-actions";
import { cn } from "@/lib/utils";

export interface AttemptSessionProps {
  attempt: AttemptViewDto;
  className?: string;
}

interface ItemSessionState extends AttemptItemViewDto {
  selectedOptionIds: string[];
}

export function AttemptSession({ attempt, className }: AttemptSessionProps) {
  const { t } = useI18n();
  const baseId = useId();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<ItemSessionState[]>(() =>
    attempt.items.map((item) => ({
      ...item,
      selectedOptionIds: item.submittedAnswer?.optionIds ?? [],
    })),
  );

  const [attemptStatus, setAttemptStatus] = useState(attempt.status);
  const [scoreResult, setScoreResult] = useState<AttemptScoreResult | null>(
    () => {
      if (
        attempt.score !== undefined &&
        attempt.maximumScore !== undefined &&
        attempt.percentage !== undefined &&
        attempt.passed !== undefined
      ) {
        return {
          score: attempt.score,
          maximumScore: attempt.maximumScore,
          percentage: attempt.percentage,
          passed: attempt.passed,
        };
      }
      return null;
    },
  );

  const [isSubmitting, startSubmittingTransition] = useTransition();
  const [isCompleting, startCompletingTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentItem = items[currentIndex];
  const isCompleted = attemptStatus === "completed";
  const unansweredCount = items.filter(
    (it) => it.submittedAnswer === undefined,
  ).length;

  if (!currentItem || items.length === 0) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <CardHeader>
          <CardTitle>
            {t("questionnaire.emptyTitle") || "No questions available"}
          </CardTitle>
          <CardDescription>
            {t("questionnaire.emptyDescription") ||
              "This exam attempt contains no questions."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isCurrentSubmitted = currentItem.submittedAnswer !== undefined;

  const handleSingleSelect = (optionId: string) => {
    if (isCompleted || isCurrentSubmitted) return;
    setErrorMessage(null);
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === currentIndex ? { ...it, selectedOptionIds: [optionId] } : it,
      ),
    );
  };

  const handleMultiSelect = (optionId: string, checked: boolean) => {
    if (isCompleted || isCurrentSubmitted) return;
    setErrorMessage(null);
    setItems((prev) =>
      prev.map((it, idx) => {
        if (idx !== currentIndex) return it;
        const currentSelected = it.selectedOptionIds;
        const next = checked
          ? [...currentSelected, optionId]
          : currentSelected.filter((id) => id !== optionId);
        return { ...it, selectedOptionIds: next };
      }),
    );
  };

  const handleSubmitAnswer = () => {
    if (isCompleted || isCurrentSubmitted) return;
    if (currentItem.selectedOptionIds.length === 0) {
      setErrorMessage("Please select an answer before submitting.");
      return;
    }

    setErrorMessage(null);
    startSubmittingTransition(async () => {
      const result = await submitAttemptAnswerAction({
        spaceId: attempt.spaceId,
        attemptId: attempt.id,
        questionId: currentItem.questionId,
        answer: { optionIds: currentItem.selectedOptionIds },
      });

      if (result.ok) {
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === currentIndex
              ? {
                  ...it,
                  submittedAnswer: { optionIds: it.selectedOptionIds },
                  feedback: result.data as QuestionFeedbackDto,
                }
              : it,
          ),
        );
      } else {
        setErrorMessage(
          result.error.code === "validation-failed"
            ? "Invalid answer format."
            : "Failed to submit answer. Please try again.",
        );
      }
    });
  };

  const handleToggleBookmark = async () => {
    const questionId = currentItem.questionId;
    const nextBookmarked = !currentItem.isBookmarked;

    // Optimistically update
    setItems((prev) =>
      prev.map((it, idx) =>
        idx === currentIndex ? { ...it, isBookmarked: nextBookmarked } : it,
      ),
    );

    const result = await bookmarkAttemptQuestionAction({
      spaceId: attempt.spaceId,
      attemptId: attempt.id,
      questionId,
    });

    if (!result.ok) {
      // Revert if error
      setItems((prev) =>
        prev.map((it, idx) =>
          idx === currentIndex ? { ...it, isBookmarked: !nextBookmarked } : it,
        ),
      );
    }
  };

  const handleFinishExam = () => {
    if (unansweredCount > 0) {
      setErrorMessage(
        `Cannot complete exam: ${unansweredCount} question(s) are unanswered.`,
      );
      return;
    }

    setErrorMessage(null);
    startCompletingTransition(async () => {
      const result = await completeAttemptAction({
        spaceId: attempt.spaceId,
        attemptId: attempt.id,
      });

      if (result.ok) {
        setAttemptStatus("completed");
        setScoreResult(result.data);
      } else {
        setErrorMessage("Failed to complete exam. Please try again.");
      }
    });
  };

  const formatLabel =
    currentItem.question.format === "multiple-choice"
      ? "Multiple Choice"
      : currentItem.question.format === "true-false"
        ? "True / False"
        : "Single Choice";

  return (
    <div
      data-slot="attempt-session"
      className={cn("mx-auto flex max-w-4xl flex-col gap-6", className)}
    >
      {/* Score Breakdown Card on completion */}
      {isCompleted && scoreResult && (
        <Card
          data-slot="score-breakdown-card"
          className="border-border/80 bg-card shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <TrophyIcon className="size-5 text-primary" aria-hidden="true" />
              <CardTitle className="text-xl font-bold tracking-tight">
                Exam Summary
              </CardTitle>
            </div>
            <Badge
              variant={scoreResult.passed ? "default" : "destructive"}
              className={cn(
                "px-3 py-1 text-sm font-semibold",
                scoreResult.passed && "bg-primary text-primary-foreground",
              )}
            >
              {scoreResult.passed
                ? t("attempts.passed") || "Passed"
                : t("attempts.failed") || "Failed"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                <span className="text-xs font-medium text-muted-foreground">
                  Score
                </span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {scoreResult.score}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {scoreResult.maximumScore} pts
                  </span>
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                <span className="text-xs font-medium text-muted-foreground">
                  Percentage
                </span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {scoreResult.percentage}%
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                <span className="text-xs font-medium text-muted-foreground">
                  Passing Requirement
                </span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {attempt.passingPercentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stepper Navigation Header */}
      <div
        data-slot="stepper-navigation"
        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-xs"
      >
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {items.map((item, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = item.submittedAnswer !== undefined;
            const isBookmarked = item.isBookmarked;

            return (
              <button
                key={item.questionId}
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setCurrentIndex(idx);
                }}
                aria-label={`Question ${idx + 1}${isAnswered ? ", answered" : ""}${isBookmarked ? ", bookmarked" : ""}`}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "relative flex size-9 shrink-0 items-center justify-center rounded-md border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground shadow-xs"
                    : isAnswered
                      ? "border-border bg-muted/60 text-foreground hover:bg-muted"
                      : "border-border/60 bg-background text-muted-foreground hover:bg-muted/40",
                )}
              >
                <span>{idx + 1}</span>
                {isBookmarked && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-0.5 right-0.5 size-1.5 rounded-full",
                      isCurrent ? "bg-accent" : "bg-primary",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {!isCompleted && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleFinishExam}
              disabled={isCompleting}
              className="gap-1.5"
            >
              <span>{t("attempts.completeAttempt") || "Finish Exam"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Question Card */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{formatLabel}</Badge>
              <Badge variant="outline">{currentItem.points} pts</Badge>
              {isCurrentSubmitted && currentItem.feedback && (
                <Badge
                  variant={
                    currentItem.feedback.isCorrect ? "default" : "destructive"
                  }
                  className={cn(
                    "gap-1",
                    currentItem.feedback.isCorrect &&
                      "bg-primary text-primary-foreground",
                  )}
                >
                  {currentItem.feedback.isCorrect ? (
                    <>
                      <CheckCircle2Icon className="size-3.5" />
                      Correct
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="size-3.5" />
                      Incorrect
                    </>
                  )}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleToggleBookmark}
                aria-label={
                  currentItem.isBookmarked
                    ? "Remove bookmark"
                    : "Bookmark question"
                }
                className={cn(
                  "cursor-pointer",
                  currentItem.isBookmarked &&
                    "text-accent-foreground hover:text-foreground",
                )}
              >
                {currentItem.isBookmarked ? (
                  <BookmarkCheckIcon className="size-4 fill-current text-accent-foreground" />
                ) : (
                  <BookmarkIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <CardTitle className="pt-2 text-base font-medium leading-relaxed text-foreground">
            <span className="mr-2 text-xs font-semibold text-muted-foreground uppercase">
              Question {currentIndex + 1} of {items.length}
            </span>
            <MarkdownPrompt prompt={currentItem.question.prompt} />
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-5">
          {/* Options: Single Choice / True False via RadioGroup */}
          {currentItem.question.format !== "multiple-choice" ? (
            <RadioGroup
              value={currentItem.selectedOptionIds[0] ?? ""}
              onValueChange={(val) => handleSingleSelect(val as string)}
              className="space-y-2.5"
            >
              {currentItem.question.options.map((opt) => {
                const optElementId = `${baseId}-opt-${opt.id}`;
                const isSelected = currentItem.selectedOptionIds.includes(
                  opt.id,
                );
                const isRevealedOption =
                  isCurrentSubmitted && currentItem.feedback;
                const isCorrectOption =
                  isRevealedOption &&
                  currentItem.feedback?.correctOptionIds.includes(opt.id);
                const isWrongSelection =
                  isRevealedOption && isSelected && !isCorrectOption;

                return (
                  <label
                    key={opt.id}
                    htmlFor={optElementId}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3.5 text-sm transition-colors",
                      !isCurrentSubmitted &&
                        !isCompleted &&
                        "cursor-pointer hover:bg-muted/40",
                      isSelected && "border-primary/50 bg-primary/5",
                      isCorrectOption &&
                        "border-green-500/60 bg-green-500/10 text-foreground dark:border-green-500/40 dark:bg-green-950/20",
                      isWrongSelection &&
                        "border-destructive/60 bg-destructive/10 text-foreground dark:border-destructive/40 dark:bg-destructive/20",
                    )}
                  >
                    <RadioGroupItem
                      id={optElementId}
                      value={opt.id}
                      disabled={isCompleted || isCurrentSubmitted}
                    />
                    <span className="leading-normal">{opt.text}</span>
                  </label>
                );
              })}
            </RadioGroup>
          ) : (
            /* Options: Multiple Choice via Checkbox */
            <div className="space-y-2.5">
              {currentItem.question.options.map((opt) => {
                const optElementId = `${baseId}-chk-${opt.id}`;
                const isSelected = currentItem.selectedOptionIds.includes(
                  opt.id,
                );
                const isRevealedOption =
                  isCurrentSubmitted && currentItem.feedback;
                const isCorrectOption =
                  isRevealedOption &&
                  currentItem.feedback?.correctOptionIds.includes(opt.id);
                const isWrongSelection =
                  isRevealedOption && isSelected && !isCorrectOption;

                return (
                  <label
                    key={opt.id}
                    htmlFor={optElementId}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3.5 text-sm transition-colors",
                      !isCurrentSubmitted &&
                        !isCompleted &&
                        "cursor-pointer hover:bg-muted/40",
                      isSelected && "border-primary/50 bg-primary/5",
                      isCorrectOption &&
                        "border-green-500/60 bg-green-500/10 text-foreground dark:border-green-500/40 dark:bg-green-950/20",
                      isWrongSelection &&
                        "border-destructive/60 bg-destructive/10 text-foreground dark:border-destructive/40 dark:bg-destructive/20",
                    )}
                  >
                    <Checkbox
                      id={optElementId}
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleMultiSelect(opt.id, Boolean(checked))
                      }
                      disabled={isCompleted || isCurrentSubmitted}
                    />
                    <span className="leading-normal">{opt.text}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Explanation panel after submission */}
          {isCurrentSubmitted && currentItem.feedback && (
            <div
              data-slot="question-explanation"
              className="rounded-lg border border-border/80 bg-muted/30 p-4 space-y-2"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Explanation
              </div>
              <div className="text-sm leading-relaxed text-foreground">
                <MarkdownPrompt prompt={currentItem.feedback.explanation} />
              </div>
              {currentItem.question.source && (
                <div className="pt-2 text-xs text-muted-foreground border-t border-border/40">
                  <span>Source: </span>
                  <a
                    href={currentItem.question.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {currentItem.question.source.title}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Error Message alert */}
          {errorMessage && (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {errorMessage}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setCurrentIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentIndex === 0}
              className="gap-1"
            >
              <ChevronLeftIcon className="size-4" />
              <span>{t("questionnaire.previous") || "Previous"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1));
              }}
              disabled={currentIndex === items.length - 1}
              className="gap-1"
            >
              <span>{t("questionnaire.next") || "Next"}</span>
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {!isCurrentSubmitted && !isCompleted && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSubmitAnswer}
                disabled={
                  isSubmitting || currentItem.selectedOptionIds.length === 0
                }
                className="gap-1.5"
              >
                <SendIcon className="size-3.5" />
                <span>Submit Answer</span>
              </Button>
            )}

            {isCurrentSubmitted && (
              <Badge variant="outline" className="text-muted-foreground">
                Answer recorded
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
