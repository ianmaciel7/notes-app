"use client";

import { useEffect } from "react";
import {
  QuestionCard,
  type QuestionCardProps,
} from "@/components/object/question/question-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function FocusQuestion({
  questionIds,
  activeQuestionId,
  getCardProps,
  onActiveQuestionChange,
  answeredCount,
  labels,
}: {
  questionIds: string[];
  activeQuestionId: string;
  getCardProps: (questionId: string) => QuestionCardProps;
  onActiveQuestionChange: (questionId: string) => void;
  answeredCount: number;
  labels: {
    question: string;
    of: string;
    answered: string;
    previousQuestion: string;
    nextQuestion: string;
  };
}) {
  const index = questionIds.indexOf(activeQuestionId);
  const currentIndex = index >= 0 ? index : 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.matches(
          "input, textarea, select, button, a, [contenteditable='true'], [role='button'], [role='checkbox'], [role='radio'], [role='combobox']",
        )
      ) {
        return;
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "j") {
        event.preventDefault();
        const next =
          questionIds[Math.min(currentIndex + 1, questionIds.length - 1)];
        if (next) onActiveQuestionChange(next);
      }
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "k") {
        event.preventDefault();
        const previous = questionIds[Math.max(currentIndex - 1, 0)];
        if (previous) onActiveQuestionChange(previous);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, onActiveQuestionChange, questionIds]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium">
          {labels.question} {currentIndex + 1} {labels.of} {questionIds.length}
        </span>
        <span className="text-muted-foreground">
          {answeredCount} {labels.answered}
        </span>
      </div>
      <Progress
        value={(answeredCount / questionIds.length) * 100}
        aria-label="Assessment progress"
      />
      <QuestionCard {...getCardProps(questionIds[currentIndex])} />
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => onActiveQuestionChange(questionIds[currentIndex - 1])}
        >
          {labels.previousQuestion}
        </Button>
        <Button
          type="button"
          disabled={currentIndex === questionIds.length - 1}
          onClick={() => onActiveQuestionChange(questionIds[currentIndex + 1])}
        >
          {labels.nextQuestion}
        </Button>
      </div>
    </div>
  );
}
