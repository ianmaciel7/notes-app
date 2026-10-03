import { describe, expect, it } from "vitest";
import { evaluateAnswer, isSelectionComplete } from "./evaluate-answer";

describe("evaluateAnswer", () => {
  it("rates an exact match Good", () => {
    expect(evaluateAnswer({ correctOptionIds: ["a"] }, ["a"])).toEqual({
      correct: true,
      rating: 3,
    });
    expect(
      evaluateAnswer({ correctOptionIds: ["a", "b"] }, ["b", "a"]),
    ).toEqual({ correct: true, rating: 3 });
  });

  it("rates wrong, partial, and excessive selections Forgot", () => {
    const question = { correctOptionIds: ["a", "b"] };
    expect(evaluateAnswer(question, ["c", "d"]).rating).toBe(1);
    expect(evaluateAnswer(question, ["a"]).correct).toBe(false);
    expect(evaluateAnswer(question, ["a", "b", "c"]).correct).toBe(false);
  });
});

describe("isSelectionComplete", () => {
  it("completes single choice on the first pick", () => {
    const q = { format: "single_choice", correctOptionIds: ["a"] } as const;
    expect(isSelectionComplete(q, [])).toBe(false);
    expect(isSelectionComplete(q, ["b"])).toBe(true);
  });

  it("completes multiple choice at the required count", () => {
    const q = {
      format: "multiple_choice",
      correctOptionIds: ["a", "b"],
    } as const;
    expect(isSelectionComplete(q, ["a"])).toBe(false);
    expect(isSelectionComplete(q, ["a", "c"])).toBe(true);
  });
});
