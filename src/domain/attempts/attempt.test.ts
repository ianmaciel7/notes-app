import { describe, expect, it } from "vitest";
import { DomainError } from "@/domain/shared/domain-error";
import {
  type AttemptItemRecord,
  scoreAttempt,
  validateAttemptCompletion,
} from "./attempt";

describe("attempt scoring", () => {
  it("calculates deterministic score with weighted points", () => {
    const items: AttemptItemRecord[] = [
      {
        questionId: "q1",
        questionRevisionId: "r1",
        position: 0,
        points: 3,
        isCorrect: true,
      },
      {
        questionId: "q2",
        questionRevisionId: "r2",
        position: 1,
        points: 7,
        isCorrect: false,
      },
    ];

    const result = scoreAttempt(items, 70);
    expect(result).toEqual({
      score: 3,
      maximumScore: 10,
      percentage: 30,
      passed: false,
    });
  });

  it("handles pass threshold boundaries accurately", () => {
    const items: AttemptItemRecord[] = [
      {
        questionId: "q1",
        questionRevisionId: "r1",
        position: 0,
        points: 7,
        isCorrect: true,
      },
      {
        questionId: "q2",
        questionRevisionId: "r2",
        position: 1,
        points: 3,
        isCorrect: false,
      },
    ];

    expect(scoreAttempt(items, 70).passed).toBe(true);
    expect(scoreAttempt(items, 71).passed).toBe(false);
  });

  it("rejects attempt completion if any question is unanswered", () => {
    const items: AttemptItemRecord[] = [
      {
        questionId: "q1",
        questionRevisionId: "r1",
        position: 0,
        points: 1,
        submittedAnswer: { optionIds: ["a"] },
        isCorrect: true,
      },
      {
        questionId: "q2",
        questionRevisionId: "r2",
        position: 1,
        points: 1,
      },
    ];

    expect(() => validateAttemptCompletion(items)).toThrow(DomainError);
  });
});
