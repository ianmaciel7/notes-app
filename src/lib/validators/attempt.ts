import type { CreateAttemptInput } from "@/types/attempt";

export type AttemptValidationErrorCode =
  | "invalidInput"
  | "validationFailed"
  | "questionIdRequired"
  | "cardIdRequired"
  | "invalidRating"
  | "invalidReviewMode"
  | "invalidElapsed"
  | "invalidConfidence";

export type AttemptValidationField =
  | "questionId"
  | "cardId"
  | "rating"
  | "reviewMode"
  | "elapsedMilliseconds"
  | "userConfidence";

export interface AttemptValidationResult {
  success: boolean;
  data?: CreateAttemptInput;
  error?: AttemptValidationErrorCode;
  fieldErrors?: Partial<
    Record<AttemptValidationField, AttemptValidationErrorCode>
  >;
}

const RATINGS = [1, 2, 3, 4] as const;
const MODES = ["review", "mockExam"] as const;
const CONFIDENCES = ["guessed", "uncertain", "confident"] as const;

export function validateCreateAttemptInput(
  input: unknown,
): AttemptValidationResult {
  if (!input || typeof input !== "object") {
    return { success: false, error: "invalidInput" };
  }

  const raw = input as Record<string, unknown>;
  const questionId =
    typeof raw.questionId === "string" ? raw.questionId.trim() : "";
  const cardId = typeof raw.cardId === "string" ? raw.cardId.trim() : "";
  const fieldErrors: NonNullable<AttemptValidationResult["fieldErrors"]> = {};

  if (!questionId) fieldErrors.questionId = "questionIdRequired";
  if (!cardId) fieldErrors.cardId = "cardIdRequired";
  if (!RATINGS.includes(raw.rating as (typeof RATINGS)[number])) {
    fieldErrors.rating = "invalidRating";
  }
  if (!MODES.includes(raw.reviewMode as (typeof MODES)[number])) {
    fieldErrors.reviewMode = "invalidReviewMode";
  }
  const elapsed = raw.elapsedMilliseconds;
  if (
    typeof elapsed !== "number" ||
    !Number.isInteger(elapsed) ||
    elapsed < 0
  ) {
    fieldErrors.elapsedMilliseconds = "invalidElapsed";
  }
  if (
    raw.userConfidence !== undefined &&
    !CONFIDENCES.includes(raw.userConfidence as (typeof CONFIDENCES)[number])
  ) {
    fieldErrors.userConfidence = "invalidConfidence";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "validationFailed", fieldErrors };
  }

  return {
    success: true,
    data: {
      questionId,
      cardId,
      rating: raw.rating as CreateAttemptInput["rating"],
      reviewMode: raw.reviewMode as CreateAttemptInput["reviewMode"],
      elapsedMilliseconds: elapsed as number,
      ...(raw.userConfidence !== undefined
        ? {
            userConfidence:
              raw.userConfidence as CreateAttemptInput["userConfidence"],
          }
        : {}),
    },
  };
}
