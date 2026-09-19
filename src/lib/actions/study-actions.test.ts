import { beforeEach, describe, expect, it, vi } from "vitest";
import { DomainError } from "@/domain/shared/domain-error";
import {
  enrollQuestionAction,
  getDueStudyQueueAction,
  previewReviewRatingsAction,
  rateQuestionMemoryAction,
} from "./study-actions";

vi.mock("@/data/action-auth", () => ({
  requireActionUser: vi.fn(),
}));

vi.mock("@/data/study", () => ({
  ensureQuestionMemory: vi.fn(),
  rateQuestionMemory: vi.fn(),
  previewReviewRatings: vi.fn(),
  getDueStudyQueue: vi.fn(),
}));

import { requireActionUser } from "@/data/action-auth";
import {
  ensureQuestionMemory,
  getDueStudyQueue,
  previewReviewRatings,
  rateQuestionMemory,
} from "@/data/study";

describe("study actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated when user is not logged in", async () => {
    vi.mocked(requireActionUser).mockRejectedValue(
      new DomainError("unauthenticated"),
    );

    const result = await enrollQuestionAction({
      spaceId: "space-1",
      questionId: "q-1",
    });

    expect(result).toEqual({
      ok: false,
      error: { code: "unauthenticated" },
    });
  });

  it("enrolls question successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(ensureQuestionMemory).mockResolvedValue(undefined);

    const result = await enrollQuestionAction({
      spaceId: "space-1",
      questionId: "q-1",
    });

    expect(result.ok).toBe(true);
  });

  it("previews ratings successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(previewReviewRatings).mockResolvedValue({
      again: { due: "2026-09-19T00:00:00.000Z", stateVersion: 1 },
      hard: { due: "2026-09-20T00:00:00.000Z", stateVersion: 1 },
      good: { due: "2026-09-22T00:00:00.000Z", stateVersion: 1 },
      easy: { due: "2026-09-25T00:00:00.000Z", stateVersion: 1 },
    });

    const result = await previewReviewRatingsAction({
      spaceId: "space-1",
      questionId: "q-1",
    });

    expect(result.ok).toBe(true);
  });

  it("rates question memory successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(rateQuestionMemory).mockResolvedValue({
      questionId: "q-1",
      dueAt: "2026-09-22T00:00:00.000Z",
      stateVersion: 1,
      reviewCount: 1,
    });

    const result = await rateQuestionMemoryAction({
      spaceId: "space-1",
      questionId: "q-1",
      rating: "good",
      stateVersion: 0,
    });

    expect(result.ok).toBe(true);
  });

  it("gets due study queue successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(getDueStudyQueue).mockResolvedValue([
      {
        questionId: "q-1",
        isDue: true,
        prompt: "Prompt",
        stateVersion: 0,
      },
    ]);

    const result = await getDueStudyQueueAction({
      spaceId: "space-1",
    });

    expect(result.ok).toBe(true);
  });
});
