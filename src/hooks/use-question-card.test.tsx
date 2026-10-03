import { act, renderHook, waitFor } from "@testing-library/react";
import type { User } from "firebase/auth";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "@/lib/auth-context";
import type { Card } from "@/types/card";
import type { QuestionObject } from "@/types/object";
import { useQuestionCard } from "./use-question-card";

const mockSubmitAttempt = vi.fn();

vi.mock("@/lib/firebase/attempts", () => ({
  submitAttempt: (...args: unknown[]) => mockSubmitAttempt(...args),
}));

const now = new Date("2026-10-03T12:00:00Z");

const card: Card = {
  id: "c1",
  spaceId: "s1",
  schemaVersion: 4,
  questionId: "q1",
  cardIndex: 0,
  state: 0,
  due: now,
  stability: 0,
  difficulty: 0,
  elapsedDays: 0,
  scheduledDays: 0,
  reps: 0,
  lapses: 0,
  lastReview: null,
  stateVersion: 1,
  updatedAt: now,
};

function buildQuestion(
  overrides: Partial<QuestionObject["properties"]> = {},
): QuestionObject {
  return {
    id: "q1",
    spaceId: "s1",
    schemaVersion: 4,
    objectTypeId: "question",
    title: "Q1",
    lifecycleState: "active",
    stateVersion: 1,
    createdAt: now,
    updatedAt: now,
    properties: {
      statement: "Which?",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
      ],
      correctOptionIds: ["a"],
      examId: "e1",
      orderIndex: 0,
      format: "single_choice",
      ...overrides,
    },
  };
}

function wrapperFor(user: Pick<User, "uid"> | null) {
  return ({ children }: { children: ReactNode }) => (
    <AuthContext
      value={{
        user: user as User | null,
        isLoading: false,
        signOutUser: async () => {},
      }}
    >
      {children}
    </AuthContext>
  );
}

describe("useQuestionCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmitAttempt.mockResolvedValue("attempt-1");
  });

  it("starts unanswered with nothing selected", () => {
    const { result } = renderHook(
      () => useQuestionCard({ spaceId: "s1", question: buildQuestion(), card }),
      { wrapper: wrapperFor({ uid: "u1" }) },
    );
    expect(result.current.status).toBe("unanswered");
    expect(result.current.selectedOptionIds).toEqual([]);
    expect(result.current.isResolved).toBe(false);
  });

  it("grades a correct single-choice click instantly with rating Good", async () => {
    const { result } = renderHook(
      () => useQuestionCard({ spaceId: "s1", question: buildQuestion(), card }),
      { wrapper: wrapperFor({ uid: "u1" }) },
    );

    await act(async () => {
      result.current.selectOption("a");
    });

    expect(result.current.status).toBe("answeredCorrect");
    expect(mockSubmitAttempt).toHaveBeenCalledTimes(1);
    const args = mockSubmitAttempt.mock.calls[0][0];
    expect(args).toMatchObject({
      userId: "u1",
      spaceId: "s1",
      card,
      input: {
        questionId: "q1",
        cardId: "c1",
        rating: 3,
        reviewMode: "review",
      },
    });
  });

  it("grades an incorrect click with rating Forgot", async () => {
    const { result } = renderHook(
      () => useQuestionCard({ spaceId: "s1", question: buildQuestion(), card }),
      { wrapper: wrapperFor({ uid: "u1" }) },
    );

    await act(async () => {
      result.current.selectOption("b");
    });

    expect(result.current.status).toBe("answeredIncorrect");
    expect(mockSubmitAttempt.mock.calls[0][0].input.rating).toBe(1);
  });

  it("ignores further clicks once resolved", async () => {
    const { result } = renderHook(
      () => useQuestionCard({ spaceId: "s1", question: buildQuestion(), card }),
      { wrapper: wrapperFor({ uid: "u1" }) },
    );

    await act(async () => {
      result.current.selectOption("b");
    });
    await act(async () => {
      result.current.selectOption("a");
    });

    expect(result.current.selectedOptionIds).toEqual(["b"]);
    expect(mockSubmitAttempt).toHaveBeenCalledTimes(1);
  });

  it("toggles multiple-choice options and submits at the required count", async () => {
    const question = buildQuestion({
      format: "multiple_choice",
      correctOptionIds: ["a", "b"],
    });
    const { result } = renderHook(
      () => useQuestionCard({ spaceId: "s1", question, card }),
      { wrapper: wrapperFor({ uid: "u1" }) },
    );

    await act(async () => {
      result.current.selectOption("a");
    });
    expect(result.current.status).toBe("unanswered");

    await act(async () => {
      result.current.selectOption("a");
    });
    expect(result.current.selectedOptionIds).toEqual([]);

    await act(async () => {
      result.current.selectOption("a");
    });
    await act(async () => {
      result.current.selectOption("b");
    });

    expect(result.current.status).toBe("answeredCorrect");
    expect(mockSubmitAttempt).toHaveBeenCalledTimes(1);
  });

  it("shows the explanation only after resolution and only when present", async () => {
    const question = buildQuestion({
      groundedExplanation: {
        text: "Because",
        referenceUrls: [],
        answerProvenance: "official",
      },
    });
    const { result } = renderHook(
      () => useQuestionCard({ spaceId: "s1", question, card }),
      { wrapper: wrapperFor({ uid: "u1" }) },
    );
    expect(result.current.showExplanation).toBe(false);

    await act(async () => {
      result.current.selectOption("a");
    });
    expect(result.current.showExplanation).toBe(true);

    const bare = renderHook(
      () => useQuestionCard({ spaceId: "s1", question: buildQuestion(), card }),
      { wrapper: wrapperFor({ uid: "u1" }) },
    );
    await act(async () => {
      bare.result.current.selectOption("a");
    });
    expect(bare.result.current.showExplanation).toBe(false);
  });

  it("reveals the answer without logging an attempt", () => {
    const { result } = renderHook(
      () => useQuestionCard({ spaceId: "s1", question: buildQuestion(), card }),
      { wrapper: wrapperFor({ uid: "u1" }) },
    );

    act(() => {
      result.current.showAnswer();
    });
    expect(result.current.status).toBe("revealed");
    expect(result.current.isResolved).toBe(true);

    act(() => {
      result.current.showAnswer();
    });
    expect(mockSubmitAttempt).not.toHaveBeenCalled();
  });

  it("grades locally without writing when there is no companion card or user", async () => {
    const noCard = renderHook(
      () =>
        useQuestionCard({
          spaceId: "s1",
          question: buildQuestion(),
          card: null,
        }),
      { wrapper: wrapperFor({ uid: "u1" }) },
    );
    await act(async () => {
      noCard.result.current.selectOption("a");
    });
    expect(noCard.result.current.status).toBe("answeredCorrect");

    const noUser = renderHook(
      () => useQuestionCard({ spaceId: "s1", question: buildQuestion(), card }),
      { wrapper: wrapperFor(null) },
    );
    await act(async () => {
      noUser.result.current.selectOption("b");
    });
    expect(noUser.result.current.status).toBe("answeredIncorrect");
    expect(mockSubmitAttempt).not.toHaveBeenCalled();
  });

  it("resets and flags an error when the write fails", async () => {
    mockSubmitAttempt.mockRejectedValue(new Error("offline"));
    const { result } = renderHook(
      () => useQuestionCard({ spaceId: "s1", question: buildQuestion(), card }),
      { wrapper: wrapperFor({ uid: "u1" }) },
    );

    await act(async () => {
      result.current.selectOption("a");
    });

    await waitFor(() => expect(result.current.hasSaveError).toBe(true));
    expect(result.current.status).toBe("unanswered");
    expect(result.current.selectedOptionIds).toEqual([]);
    expect(result.current.isSubmitting).toBe(false);
  });
});
