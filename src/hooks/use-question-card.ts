"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createEmptyAnswer, isAnswerComplete } from "@/lib/exam/answer-draft";
import { evaluateAnswer } from "@/lib/exam/evaluate-answer";
import { submitAttempt } from "@/lib/firebase/attempts";
import type { Card } from "@/types/card";
import type { QuestionObject } from "@/types/object";
import type { SubmittedAnswer } from "@/types/question";

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
  /** The draft while answering and the submitted answer once graded. */
  answer: SubmittedAnswer | null;
  isSubmitting: boolean;
  hasSaveError: boolean;
  /** True once the correct answer is shown (answered or revealed). */
  isResolved: boolean;
  /** `single-choice` and `true-false` are graded on the click that selects. */
  needsConfirmation: boolean;
  canSubmit: boolean;
  /** The general explanation is only surfaced after resolution and when present. */
  showExplanation: boolean;
  setAnswer: (answer: SubmittedAnswer) => void;
  submit: () => void;
  showAnswer: () => void;
  /** Starts a fresh attempt; earlier attempts stay in the immutable log. */
  retry: () => void;
  /** For choice-based questions: currently selected option IDs. */
  selectedOptionIds: string[];
  /** For choice-based questions: set the selected option. */
  selectOption: (optionId: string) => void;
}

export function useQuestionCard({
  spaceId,
  question,
  card,
}: UseQuestionCardOptions): UseQuestionCardResult {
  const { user } = useAuth();
  const { properties } = question;
  const [status, setStatus] = useState<QuestionCardStatus>("unanswered");
  const [answer, setAnswerState] = useState<SubmittedAnswer | null>(() =>
    createEmptyAnswer(properties),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSaveError, setHasSaveError] = useState(false);
  const startedAt = useRef(Date.now());

  const isResolved = status !== "unanswered";
  const needsConfirmation =
    properties.type !== "single-choice" && properties.type !== "true-false";
  const canSubmit =
    !isResolved && !isSubmitting && isAnswerComplete(properties, answer);

  const submitAnswer = async (submission: SubmittedAnswer) => {
    const evaluation = evaluateAnswer(properties, submission);
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
          questionType: properties.type,
          submittedAnswer: submission,
          isCorrect: evaluation.correct,
        },
      });
    } catch {
      // The attempt was not persisted: keep the answer so the learner can resend it.
      setStatus("unanswered");
      setHasSaveError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const setAnswer = (next: SubmittedAnswer) => {
    if (isResolved || isSubmitting) return;
    setAnswerState(next);
    if (!needsConfirmation) void submitAnswer(next);
  };

  const submit = () => {
    if (!canSubmit || answer === null) return;
    void submitAnswer(answer);
  };

  /** Secondary action: reveal the key without logging an active recall score. */
  const showAnswer = () => {
    if (isResolved) return;
    setStatus("revealed");
  };

  const retry = () => {
    if (!isResolved || isSubmitting) return;
    setStatus("unanswered");
    setAnswerState(createEmptyAnswer(properties));
    setHasSaveError(false);
    startedAt.current = Date.now();
  };

  const selectedOptionIds =
    answer &&
    "value" in answer &&
    typeof answer.value === "object" &&
    "includes" in answer.value
      ? (answer.value as string[])
      : answer && "value" in answer && typeof answer.value === "string"
        ? [answer.value as string]
        : [];

  const selectOption = (optionId: string) => {
    if (
      properties.type === "single-choice" ||
      properties.type === "true-false"
    ) {
      setAnswer({ type: properties.type, value: optionId } as SubmittedAnswer);
    } else if (properties.type === "multiple-choice") {
      const currentValue = Array.isArray(selectedOptionIds)
        ? selectedOptionIds
        : [];
      const newValue = currentValue.includes(optionId)
        ? currentValue.filter((id) => id !== optionId)
        : [...currentValue, optionId];
      setAnswer({
        type: "multiple-choice",
        value: newValue,
      } as SubmittedAnswer);
    }
  };

  return {
    status,
    answer,
    isSubmitting,
    hasSaveError,
    isResolved,
    needsConfirmation,
    canSubmit,
    showExplanation: isResolved && Boolean(properties.explanation),
    setAnswer,
    submit,
    showAnswer,
    retry,
    selectedOptionIds,
    selectOption,
  };
}
