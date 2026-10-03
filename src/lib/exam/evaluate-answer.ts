import type { AttemptRating } from "@/types/attempt";
import type { QuestionProperties } from "@/types/object";

type Gradable = { correctOptionIds: readonly string[] };

export interface AnswerEvaluation {
  correct: boolean;
  rating: AttemptRating;
}

/** True once a multiple-choice selection has as many picks as there are correct options. */
export function isSelectionComplete(
  question: Gradable & Pick<QuestionProperties, "format">,
  selectedOptionIds: readonly string[],
): boolean {
  if (question.format === "single_choice") return selectedOptionIds.length >= 1;
  return selectedOptionIds.length >= question.correctOptionIds.length;
}

/**
 * Grades a selection: an exact match with `correctOptionIds` is Good (3),
 * anything else is Forgot (1) (ADR 0017 section 3).
 */
export function evaluateAnswer(
  question: Gradable,
  selectedOptionIds: readonly string[],
): AnswerEvaluation {
  const correctIds = new Set(question.correctOptionIds);
  const selected = new Set(selectedOptionIds);
  const correct =
    selected.size === correctIds.size &&
    [...selected].every((id) => correctIds.has(id));
  return { correct, rating: correct ? 3 : 1 };
}
