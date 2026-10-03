"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  evaluateAnswer,
  isSelectionComplete,
} from "@/lib/exam/evaluate-answer";
import { submitAttempt } from "@/lib/firebase/attempts";
import type { Card } from "@/types/card";
import type { QuestionObject } from "@/types/object";

export type QuestionCardStatus =
  | "unanswered"
  | "answeredCorrect"
  | "answeredIncorrect"
  | "revealed";

export interface UseQuestionCardOptions {
  spaceId: string;
  question: QuestionObject;
  /** Companion Card; when absent the answer is graded locally and not logged. */
  card: Card | null;
}

export interface UseQuestionCardResult {
  status: QuestionCardStatus;
  selectedOptionIds: string[];
  isSubmitting: boolean;
  hasSaveError: boolean;
  /** True once the correct answer is shown (answered or revealed). */
  isResolved: boolean;
  /** Grounded explanation is only surfaced after resolution and when present. */
  showExplanation: boolean;
  selectOption: (optionId: string) => void;
  showAnswer: () => void;
}

export function useQuestionCard({
  spaceId,
  question,
  card,
}: UseQuestionCardOptions): UseQuestionCardResult {
  const { user } = useAuth();
  const [status, setStatus] = useState<QuestionCardStatus>("unanswered");
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSaveError, setHasSaveError] = useState(false);
  const startedAt = useRef(Date.now());

  const { properties } = question;
  const isResolved = status !== "unanswered";

  const submit = async (selection: string[]) => {
    const evaluation = evaluateAnswer(properties, selection);
    setStatus(evaluation.correct ? "answeredCorrect" : "answeredIncorrect");
    setHasSaveError(false);

    if (!user || !card) return;

    setIsSubmitting(true);
    try {
      await submitAttempt({
        userId: user.uid,
        spaceId,
        card,
        input: {
          questionId: question.id,
          cardId: card.id,
          rating: evaluation.rating,
          reviewMode: "review",
          elapsedMilliseconds: Math.max(0, Date.now() - startedAt.current),
        },
      });
    } catch {
      // The attempt was not persisted, so let the learner answer again.
      setStatus("unanswered");
      setSelectedOptionIds([]);
      setHasSaveError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectOption = (optionId: string) => {
    if (isResolved || isSubmitting) return;

    const selection =
      properties.format === "single_choice"
        ? [optionId]
        : selectedOptionIds.includes(optionId)
          ? selectedOptionIds.filter((id) => id !== optionId)
          : [...selectedOptionIds, optionId];

    setSelectedOptionIds(selection);
    if (isSelectionComplete(properties, selection)) {
      void submit(selection);
    }
  };

  /** Secondary action: reveal the key without logging an active recall score. */
  const showAnswer = () => {
    if (isResolved) return;
    setStatus("revealed");
  };

  return {
    status,
    selectedOptionIds,
    isSubmitting,
    hasSaveError,
    isResolved,
    showExplanation: isResolved && Boolean(properties.groundedExplanation),
    selectOption,
    showAnswer,
  };
}
