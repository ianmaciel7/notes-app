import { normalizeText } from "@/lib/exam/evaluate-answer";
import type {
  CaseStudyPart,
  CaseStudyPartAnswer,
  QuestionProperties,
  SubmittedAnswer,
} from "@/types/question";

/**
 * The blank answer a learner starts from, or null for the instant types
 * (`single-choice`, `true-false`) where nothing is chosen until the click that
 * also submits.
 */
export function createEmptyAnswer(
  question: QuestionProperties,
): SubmittedAnswer | null {
  switch (question.type) {
    case "single-choice":
    case "true-false":
      return null;
    case "fill-blank":
      return { type: question.type, value: "" };
    case "multiple-choice":
    case "hotspot":
      return { type: question.type, value: [] };
    case "matching":
    case "drag-and-drop":
    case "case-study":
      return { type: question.type, value: {} };
  }
}

function isPartAnswered(
  part: CaseStudyPart,
  value: CaseStudyPartAnswer | undefined,
): boolean {
  if (value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  return part.type === "fill-blank"
    ? normalizeText(value) !== ""
    : value !== "";
}

/**
 * True once every part of the answer is filled in, which is when it may be
 * submitted. Completeness is separate from correctness and never reveals the key.
 */
export function isAnswerComplete(
  question: QuestionProperties,
  answer: SubmittedAnswer | null,
): boolean {
  if (answer === null || answer.type !== question.type) return false;

  switch (question.type) {
    case "single-choice":
    case "true-false":
      return true;
    case "fill-blank":
      return (
        answer.type === question.type && normalizeText(answer.value) !== ""
      );
    case "multiple-choice":
    case "hotspot":
      return answer.type === question.type && answer.value.length > 0;
    case "matching":
      return (
        answer.type === question.type &&
        question.leftItems.every((item) => Boolean(answer.value[item.id]))
      );
    case "drag-and-drop":
      return (
        answer.type === question.type &&
        question.slots.every((slot) => Boolean(answer.value[slot.id]))
      );
    case "case-study":
      return (
        answer.type === question.type &&
        question.parts.length > 0 &&
        question.parts.every((part) =>
          isPartAnswered(part, answer.value[part.id]),
        )
      );
  }
}
