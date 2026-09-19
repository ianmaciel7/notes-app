import { beforeEach, describe, expect, it, vi } from "vitest";
import { DomainError } from "@/domain/shared/domain-error";
import {
  completeAttemptAction,
  startAttemptAction,
  submitAttemptAnswerAction,
  toggleAttemptBookmarkAction,
} from "./attempt-actions";

vi.mock("@/data/action-auth", () => ({
  requireActionUser: vi.fn(),
}));

vi.mock("@/data/attempts", () => ({
  startAttempt: vi.fn(),
  submitAttemptAnswer: vi.fn(),
  toggleAttemptBookmark: vi.fn(),
  completeAttempt: vi.fn(),
}));

import { requireActionUser } from "@/data/action-auth";
import {
  completeAttempt,
  startAttempt,
  submitAttemptAnswer,
  toggleAttemptBookmark,
} from "@/data/attempts";

describe("attempt actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated when user is not logged in", async () => {
    vi.mocked(requireActionUser).mockRejectedValue(
      new DomainError("unauthenticated"),
    );

    const result = await startAttemptAction({
      spaceId: "space-1",
      examId: "exam-1",
    });

    expect(result).toEqual({
      ok: false,
      error: { code: "unauthenticated" },
    });
  });

  it("starts an attempt successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(startAttempt).mockResolvedValue({
      id: "att-1",
      userId: "user-1",
      spaceId: "space-1",
      examId: "exam-1",
      examRevisionId: "erev-1",
      status: "in-progress",
      passingPercentage: 70,
      createdAt: "2026-09-18T00:00:00.000Z",
      updatedAt: "2026-09-18T00:00:00.000Z",
    });

    const result = await startAttemptAction({
      spaceId: "space-1",
      examId: "exam-1",
    });

    expect(result.ok).toBe(true);
  });

  it("submits an answer successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(submitAttemptAnswer).mockResolvedValue({
      isCorrect: true,
      correctOptionIds: ["opt-1"],
      explanation: "Good job",
    });

    const result = await submitAttemptAnswerAction({
      spaceId: "space-1",
      attemptId: "att-1",
      questionId: "q-1",
      answer: { optionIds: ["opt-1"] },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.isCorrect).toBe(true);
    }
  });

  it("toggles bookmark successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(toggleAttemptBookmark).mockResolvedValue({
      isBookmarked: true,
    });

    const result = await toggleAttemptBookmarkAction({
      spaceId: "space-1",
      attemptId: "att-1",
      questionId: "q-1",
    });

    expect(result.ok).toBe(true);
  });

  it("completes attempt successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(completeAttempt).mockResolvedValue({
      score: 10,
      maximumScore: 10,
      percentage: 100,
      passed: true,
    });

    const result = await completeAttemptAction({
      spaceId: "space-1",
      attemptId: "att-1",
    });

    expect(result.ok).toBe(true);
  });
});
