import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import type { User } from "firebase/auth";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "@/lib/auth-context";
import type { Card } from "@/types/card";
import type { QuestionObject } from "@/types/object";
import { QuestionCard } from "./question-card";

const mockSubmitAttempt = vi.fn();

vi.mock("@/lib/firebase/attempts", () => ({
  submitAttempt: (...args: unknown[]) => mockSubmitAttempt(...args),
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
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
      type: "single-choice",
      prompt: "Which service?",
      options: [
        { id: "a", text: "Cloud Run" },
        { id: "b", text: "Compute Engine" },
      ],
      correctAnswer: "a",
      examId: "e1",
      orderIndex: 0,
      ...overrides,
    } as any,
  };
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <AuthContext
      value={{
        user: { uid: "u1" } as User,
        isLoading: false,
        signOutUser: async () => {},
      }}
    >
      {children}
    </AuthContext>
  );
}

function renderCard(question = buildQuestion()) {
  return render(
    <QuestionCard
      spaceId="s1"
      question={question}
      card={card}
      index={0}
      total={5}
    />,
    { wrapper: Wrapper },
  );
}

describe("QuestionCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmitAttempt.mockResolvedValue("attempt-1");
  });
  afterEach(cleanup);

  it("renders the index, statement, lettered options and the show-answer action", () => {
    renderCard();
    expect(screen.getByText(/questionIndex/)).toBeTruthy();
    expect(screen.getAllByText("Which service?").length).toBeGreaterThan(0);
    expect(screen.getByText("A.")).toBeTruthy();
    expect(screen.getByText("Compute Engine")).toBeTruthy();
    expect(screen.getByText("showAnswer")).toBeTruthy();
  });

  it("marks a correct click with a non-color indicator and logs the attempt", async () => {
    const { container } = renderCard();

    await act(async () => {
      fireEvent.click(screen.getByText("Cloud Run"));
    });

    expect(
      container
        .querySelector('[data-slot="question-card"]')
        ?.getAttribute("data-status"),
    ).toBe("answeredCorrect");
    expect(screen.getByText("correct")).toBeTruthy();
    expect(screen.getByText(/^correctOptionAria/)).toBeTruthy();
    expect(screen.queryByText("showAnswer")).toBeNull();
    expect(mockSubmitAttempt).toHaveBeenCalledTimes(1);
  });

  it("flags the wrong pick and surfaces the correct key", async () => {
    renderCard();

    await act(async () => {
      fireEvent.click(screen.getByText("Compute Engine"));
    });

    expect(screen.getByText("incorrect")).toBeTruthy();
    expect(screen.getByText(/incorrectOptionAria/)).toBeTruthy();
    expect(screen.getByText(/^correctOptionAria/)).toBeTruthy();
  });

  it("keeps the state colors in dark mode, where the outline variant overrides them", async () => {
    renderCard();

    await act(async () => {
      fireEvent.click(screen.getByText("Compute Engine"));
    });

    const wrong = screen
      .getAllByText("Compute Engine")[0]
      .closest('[data-slot="question-option"]');
    const right = screen
      .getAllByText("Cloud Run")[0]
      .closest('[data-slot="question-option"]');

    expect(wrong?.className).toContain("dark:border-destructive");
    expect(wrong?.className).toContain("dark:bg-destructive/15");
    expect(right?.className).toContain("dark:border-primary");
    expect(right?.className).toContain("dark:bg-primary/15");
  });

  it("expands the grounded explanation with reference links after answering", async () => {
    renderCard(
      buildQuestion({
        explanation: {
          text: "Serverless containers.",
          referenceUrls: ["https://cloud.google.com/run/docs"],
          answerProvenance: "official",
        },
      }),
    );
    expect(screen.queryByText("Serverless containers.")).toBeNull();

    await act(async () => {
      fireEvent.click(screen.getByText("Cloud Run"));
    });

    expect(screen.getByText("Serverless containers.")).toBeTruthy();
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("https://cloud.google.com/run/docs");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("omits the references list when the explanation has no URLs", async () => {
    renderCard(
      buildQuestion({
        explanation: {
          text: "Because.",
          referenceUrls: [],
          answerProvenance: "ai",
        },
      }),
    );
    await act(async () => {
      fireEvent.click(screen.getByText("Cloud Run"));
    });
    expect(screen.getByText("Because.")).toBeTruthy();
    expect(screen.queryByText("references")).toBeNull();
  });

  it("reveals the key without logging when show answer is used", () => {
    renderCard();
    fireEvent.click(screen.getByText("showAnswer"));
    expect(screen.getByText(/^correctOptionAria/)).toBeTruthy();
    expect(mockSubmitAttempt).not.toHaveBeenCalled();
  });

  it("shows the multiple-choice hint and shows a save error when persisting fails", async () => {
    mockSubmitAttempt.mockRejectedValue(new Error("offline"));
    renderCard(
      buildQuestion({
        type: "multiple-choice",
        correctAnswer: ["a"],
      }),
    );
    expect(screen.getByText("multipleHint")).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByText("Cloud Run"));
    });

    expect((await screen.findByRole("alert")).textContent).toBe("saveFailed");
  });
});
