import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  questionGet: vi.fn(),
  recordQuestionAttempt: vi.fn(),
  requireActionUser: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("@/data/action-auth", () => ({
  requireActionUser: mocks.requireActionUser,
}));

vi.mock("@/data/notes", () => ({ saveQuestionNote: vi.fn() }));

vi.mock("@/data/progress", () => ({
  recordQuestionAttempt: mocks.recordQuestionAttempt,
  toggleQuestionBookmark: vi.fn(),
  updateStudyGoals: vi.fn(),
}));

vi.mock("@/lib/firebase/admin", () => ({
  adminDb: {
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        collection: vi.fn(() => ({
          doc: vi.fn(() => ({ get: mocks.questionGet })),
        })),
      })),
    })),
  },
}));

import { recordAttemptAction } from "@/lib/actions/exam-actions";

describe("recordAttemptAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireActionUser.mockResolvedValue({
      uid: "user-1",
      email: "user@example.test",
    });
    mocks.recordQuestionAttempt.mockResolvedValue({
      examProgress: {},
      questionProgress: {},
    });
  });

  it("rejects client-asserted correctness when the server answer key is missing", async () => {
    mocks.questionGet.mockResolvedValue({ exists: false });
    const maliciousInput = {
      examId: "exam-1",
      questionId: "question-1",
      submittedAnswer: "answer-1",
      isCorrect: true,
    };

    const result = await recordAttemptAction(maliciousInput);

    expect(result.success).toBe(false);
    expect(mocks.recordQuestionAttempt).not.toHaveBeenCalled();
  });
});
