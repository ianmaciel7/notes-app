import { describe, expect, it } from "vitest";
import { validateCreateAttemptInput } from "./attempt";

const valid = {
  questionId: " q1 ",
  cardId: "c1",
  rating: 3,
  reviewMode: "review",
  elapsedMilliseconds: 1200,
};

describe("validateCreateAttemptInput", () => {
  it("accepts valid input and trims ids", () => {
    const result = validateCreateAttemptInput(valid);
    expect(result.success).toBe(true);
    expect(result.data?.questionId).toBe("q1");
    expect(result.data).not.toHaveProperty("userConfidence");
  });

  it("keeps a valid confidence", () => {
    const result = validateCreateAttemptInput({
      ...valid,
      userConfidence: "guessed",
    });
    expect(result.data?.userConfidence).toBe("guessed");
  });

  it("rejects non-object input", () => {
    expect(validateCreateAttemptInput(null).error).toBe("invalidInput");
  });

  it("reports all invalid fields", () => {
    const result = validateCreateAttemptInput({
      questionId: "",
      cardId: "",
      rating: 5,
      reviewMode: "other",
      elapsedMilliseconds: -1,
      userConfidence: "sure",
    });
    expect(result.error).toBe("validationFailed");
    expect(result.fieldErrors).toEqual({
      questionId: "questionIdRequired",
      cardId: "cardIdRequired",
      rating: "invalidRating",
      reviewMode: "invalidReviewMode",
      elapsedMilliseconds: "invalidElapsed",
      userConfidence: "invalidConfidence",
    });
  });
});
