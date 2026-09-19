"use client";

import { CheckCircle2Icon, PartyPopperIcon, XCircleIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { DueStudyQueueItemDto } from "@/data/study";
import type { QuestionFeedbackDto } from "@/domain/questions/question";
import type { MemoryRating } from "@/domain/study/fsrs-scheduler";
import {
  getDueStudyQueueAction,
  gradeStudyAnswerAction,
  previewReviewRatingsAction,
  rateQuestionMemoryAction,
} from "@/lib/actions/study-actions";
import { cn } from "@/lib/utils";

export interface StudyDeckProps {
  spaceId: string;
  initialQueue?: DueStudyQueueItemDto[];
}

export function formatDueInterval(dueIso?: string, now = new Date()): string {
  if (!dueIso) return "";
  const dueDate = new Date(dueIso);
  const diffMs = dueDate.getTime() - now.getTime();

  if (diffMs < 60000) {
    return "< 1m";
  }
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}d`;
  }
  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}mo`;
  }
  const diffYears = Math.round(diffDays / 365);
  return `${diffYears}y`;
}

const RATING_CONFIG: {
  rating: MemoryRating;
  label: string;
  variant: "destructive" | "outline" | "default" | "secondary";
}[] = [
  { rating: "again", label: "Again", variant: "destructive" },
  { rating: "hard", label: "Hard", variant: "outline" },
  { rating: "good", label: "Good", variant: "default" },
  { rating: "easy", label: "Easy", variant: "secondary" },
];

export function StudyDeck({ spaceId, initialQueue }: StudyDeckProps) {
  const [queue, setQueue] = useState<DueStudyQueueItemDto[]>(
    initialQueue ?? [],
  );
  const [isLoadingQueue, setIsLoadingQueue] = useState(
    initialQueue === undefined,
  );
  const [queueError, setQueueError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isGrading, setIsGrading] = useState(false);
  const [feedback, setFeedback] = useState<QuestionFeedbackDto | null>(null);

  const [ratingPreviews, setRatingPreviews] = useState<Record<
    MemoryRating,
    { due: string; stateVersion: number }
  > | null>(null);
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    setIsLoadingQueue(true);
    setQueueError(null);
    try {
      const res = await getDueStudyQueueAction({ spaceId, limit: 20 });
      if (res.ok) {
        setQueue(res.data);
        setCurrentIndex(0);
      } else {
        setQueueError("Failed to load study queue.");
      }
    } catch {
      setQueueError("Failed to load study queue.");
    } finally {
      setIsLoadingQueue(false);
    }
  }, [spaceId]);

  useEffect(() => {
    if (initialQueue === undefined) {
      void fetchQueue();
    }
  }, [initialQueue, fetchQueue]);

  const currentCard = queue[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (feedback !== null || isGrading) return;
    if (currentCard?.format === "multiple-choice") {
      setSelectedOptionIds((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId],
      );
    } else {
      setSelectedOptionIds([optionId]);
    }
  };

  const handleCheckAnswer = async () => {
    if (!currentCard || selectedOptionIds.length === 0 || isGrading) return;
    setIsGrading(true);
    setActionError(null);

    try {
      const gradeRes = await gradeStudyAnswerAction({
        spaceId,
        questionId: currentCard.questionId,
        revisionId: currentCard.revisionId,
        submittedAnswer: { optionIds: selectedOptionIds },
      });

      if (!gradeRes.ok) {
        setActionError("Unable to grade answer. Please try again.");
        setIsGrading(false);
        return;
      }

      setFeedback(gradeRes.data);

      setIsLoadingPreviews(true);
      const previewRes = await previewReviewRatingsAction({
        spaceId,
        questionId: currentCard.questionId,
      });

      if (previewRes.ok) {
        setRatingPreviews(previewRes.data);
      }
      setIsLoadingPreviews(false);
    } catch {
      setActionError(
        "An unexpected error occurred while checking your answer.",
      );
    } finally {
      setIsGrading(false);
    }
  };

  const handleRate = async (rating: MemoryRating) => {
    if (!currentCard || isRating) return;
    setIsRating(true);
    setActionError(null);

    try {
      const rateRes = await rateQuestionMemoryAction({
        spaceId,
        questionId: currentCard.questionId,
        rating,
        stateVersion: currentCard.stateVersion,
      });

      if (!rateRes.ok) {
        setActionError("Failed to record rating. Please try again.");
        setIsRating(false);
        return;
      }

      // Advance to next card in queue
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIds([]);
      setFeedback(null);
      setRatingPreviews(null);
    } catch {
      setActionError("Failed to record rating. Please try again.");
    } finally {
      setIsRating(false);
    }
  };

  if (isLoadingQueue) {
    return (
      <Card
        className="w-full max-w-xl mx-auto p-6 text-center"
        data-testid="study-loading"
      >
        <div className="py-8 text-sm text-muted-foreground">
          Loading study queue…
        </div>
      </Card>
    );
  }

  if (queueError) {
    return (
      <Card
        className="w-full max-w-xl mx-auto p-6 text-center"
        data-testid="study-error"
      >
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Error</EmptyTitle>
            <EmptyDescription>{queueError}</EmptyDescription>
          </EmptyHeader>
          <Button type="button" variant="outline" onClick={fetchQueue}>
            Try again
          </Button>
        </Empty>
      </Card>
    );
  }

  if (queue.length === 0 || currentIndex >= queue.length || !currentCard) {
    return (
      <Card
        className="w-full max-w-xl mx-auto p-6"
        data-testid="study-empty-state"
      >
        <Empty>
          <EmptyMedia variant="icon">
            <PartyPopperIcon
              className="size-5 text-primary"
              aria-hidden="true"
            />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>All caught up!</EmptyTitle>
            <EmptyDescription>
              You have reviewed all cards in your due queue for now. Great work!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4" data-testid="study-deck">
      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <span>
          Card {currentIndex + 1} of {queue.length}
        </span>
        {currentCard.isDue && (
          <Badge variant="outline" className="text-xs">
            Due
          </Badge>
        )}
      </div>

      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium leading-relaxed text-foreground">
            {currentCard.prompt}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {actionError && (
            <div
              className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive"
              role="alert"
            >
              {actionError}
            </div>
          )}

          {currentCard.options && currentCard.options.length > 0 && (
            <div
              className="space-y-2"
              role="radiogroup"
              aria-label="Answer options"
            >
              {currentCard.options.map((option) => {
                const isSelected = selectedOptionIds.includes(option.id);
                const isGraded = feedback !== null;
                const isCorrect = feedback?.correctOptionIds.includes(
                  option.id,
                );
                const isWrongSelection = isGraded && isSelected && !isCorrect;

                let optionStyles =
                  "border-border/70 hover:bg-muted/50 text-foreground";
                if (isSelected && !isGraded) {
                  optionStyles =
                    "border-primary bg-primary/10 text-primary font-medium ring-1 ring-primary";
                } else if (isGraded) {
                  if (isCorrect) {
                    optionStyles =
                      "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium ring-1 ring-emerald-500";
                  } else if (isWrongSelection) {
                    optionStyles =
                      "border-destructive bg-destructive/10 text-destructive font-medium ring-1 ring-destructive";
                  } else {
                    optionStyles =
                      "opacity-50 border-border text-muted-foreground";
                  }
                }

                return (
                  // biome-ignore lint/a11y/useSemanticElements: custom option button role
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isGraded}
                    onClick={() => handleSelectOption(option.id)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default",
                      optionStyles,
                    )}
                    data-testid={`option-${option.id}`}
                  >
                    <span>{option.text}</span>
                    {isGraded && isCorrect && (
                      <CheckCircle2Icon
                        className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                    )}
                    {isGraded && isWrongSelection && (
                      <XCircleIcon
                        className="size-4 shrink-0 text-destructive"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {feedback && (
            <div
              className={cn(
                "rounded-lg border p-4 space-y-2",
                feedback.isCorrect
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                  : "border-destructive/30 bg-destructive/10 text-destructive",
              )}
              data-testid="feedback-panel"
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                {feedback.isCorrect ? (
                  <>
                    <CheckCircle2Icon className="size-4" aria-hidden="true" />
                    <span>Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="size-4" aria-hidden="true" />
                    <span>Incorrect</span>
                  </>
                )}
              </div>
              {feedback.explanation && (
                <p className="text-sm text-foreground/90 mt-1">
                  {feedback.explanation}
                </p>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          {!feedback ? (
            <div className="flex w-full justify-end">
              <Button
                type="button"
                onClick={handleCheckAnswer}
                disabled={selectedOptionIds.length === 0 || isGrading}
                data-testid="check-answer-btn"
              >
                {isGrading ? "Checking…" : "Check Answer"}
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-muted-foreground text-center">
                Rate your recall:
              </p>
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                data-testid="rating-buttons"
              >
                {RATING_CONFIG.map((r) => (
                  <Button
                    key={r.rating}
                    type="button"
                    variant={r.variant}
                    disabled={isRating}
                    onClick={() => handleRate(r.rating)}
                    className="flex flex-col items-center justify-center py-2 h-auto gap-0.5"
                    data-testid={`rating-${r.rating}`}
                  >
                    <span className="font-semibold text-sm">{r.label}</span>
                    <span className="text-xs opacity-75">
                      {ratingPreviews?.[r.rating]?.due
                        ? formatDueInterval(ratingPreviews[r.rating].due)
                        : isLoadingPreviews
                          ? "…"
                          : ""}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
