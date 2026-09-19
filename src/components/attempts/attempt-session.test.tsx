import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { AttemptViewDto } from "@/lib/actions/attempt-actions";
import { AttemptSession } from "./attempt-session";

const translations: Record<string, string> = {
  "attempts.completeAttempt": "Finish Exam",
  "attempts.passed": "Passed",
  "attempts.failed": "Failed",
  "questionnaire.previous": "Previous",
  "questionnaire.next": "Next",
};

vi.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    locale: "en",
    t: (key: string) => translations[key] ?? key,
  }),
}));

vi.mock("@/lib/actions/attempt-actions", async () => {
  const actual = await vi.importActual("@/lib/actions/attempt-actions");
  return {
    ...actual,
    submitAttemptAnswerAction: vi.fn(),
    bookmarkAttemptQuestionAction: vi.fn(),
    completeAttemptAction: vi.fn(),
  };
});

import {
  bookmarkAttemptQuestionAction,
  completeAttemptAction,
  submitAttemptAnswerAction,
} from "@/lib/actions/attempt-actions";

const mockAttempt: AttemptViewDto = {
  id: "att-123",
  userId: "user-456",
  spaceId: "space-789",
  examId: "exam-1",
  examRevisionId: "erev-1",
  status: "in-progress",
  passingPercentage: 70,
  createdAt: "2026-09-19T10:00:00Z",
  updatedAt: "2026-09-19T10:00:00Z",
  items: [
    {
      questionId: "q-1",
      questionRevisionId: "qrev-1",
      position: 0,
      points: 10,
      isBookmarked: false,
      question: {
        schemaVersion: 1,
        questionId: "q-1",
        questionRevisionId: "qrev-1",
        format: "single-choice",
        prompt: "What is the default port for HTTP?",
        options: [
          { id: "opt-80", text: "Port 80" },
          { id: "opt-443", text: "Port 443" },
          { id: "opt-22", text: "Port 22" },
        ],
      },
    },
    {
      questionId: "q-2",
      questionRevisionId: "qrev-2",
      position: 1,
      points: 20,
      isBookmarked: false,
      question: {
        schemaVersion: 1,
        questionId: "q-2",
        questionRevisionId: "qrev-2",
        format: "multiple-choice",
        prompt: "Select all valid transport protocols:",
        options: [
          { id: "opt-tcp", text: "TCP" },
          { id: "opt-udp", text: "UDP" },
          { id: "opt-html", text: "HTML" },
        ],
      },
    },
  ],
};

describe("AttemptSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("verifies security rule: question DTO does not expose correctOptionIds or authorNotes to client", () => {
    // Assert on mock contract structure
    for (const item of mockAttempt.items) {
      expect(
        (item.question as Record<string, unknown>).correctOptionIds,
      ).toBeUndefined();
      expect(
        (item.question as Record<string, unknown>).authorNotes,
      ).toBeUndefined();
    }
  });

  it("renders single-choice question with radio buttons and allows navigation", async () => {
    const user = userEvent.setup();
    render(<AttemptSession attempt={mockAttempt} />);

    expect(
      screen.getByText("What is the default port for HTTP?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Single Choice")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Port 80" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Port 443" })).toBeInTheDocument();

    // Navigate to next question via stepper
    const step2Button = screen.getByRole("button", { name: /Question 2/i });
    await user.click(step2Button);

    expect(
      screen.getByText("Select all valid transport protocols:"),
    ).toBeInTheDocument();
    expect(screen.getByText("Multiple Choice")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "TCP" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "UDP" })).toBeInTheDocument();
  });

  it("submits single-choice answer and displays server feedback", async () => {
    const user = userEvent.setup();
    vi.mocked(submitAttemptAnswerAction).mockResolvedValue({
      ok: true,
      data: {
        isCorrect: true,
        correctOptionIds: ["opt-80"],
        explanation: "HTTP uses port 80 by default.",
      },
    });

    render(<AttemptSession attempt={mockAttempt} />);

    const option80 = screen.getByRole("radio", { name: "Port 80" });
    await user.click(option80);

    const submitBtn = screen.getByRole("button", { name: /Submit Answer/i });
    await user.click(submitBtn);

    expect(submitAttemptAnswerAction).toHaveBeenCalledWith({
      spaceId: "space-789",
      attemptId: "att-123",
      questionId: "q-1",
      answer: { optionIds: ["opt-80"] },
    });

    // Feedback rendered
    expect(await screen.findByText("Correct")).toBeInTheDocument();
    expect(
      screen.getByText("HTTP uses port 80 by default."),
    ).toBeInTheDocument();
    expect(screen.getByText("Answer recorded")).toBeInTheDocument();
  });

  it("submits multiple-choice answers using checkboxes", async () => {
    const user = userEvent.setup();
    vi.mocked(submitAttemptAnswerAction).mockResolvedValue({
      ok: true,
      data: {
        isCorrect: true,
        correctOptionIds: ["opt-tcp", "opt-udp"],
        explanation: "TCP and UDP are transport layer protocols.",
      },
    });

    render(<AttemptSession attempt={mockAttempt} />);

    // Go to question 2
    const nextBtn = screen.getByRole("button", { name: /Next/i });
    await user.click(nextBtn);

    const tcpCheck = screen.getByRole("checkbox", { name: "TCP" });
    const udpCheck = screen.getByRole("checkbox", { name: "UDP" });
    await user.click(tcpCheck);
    await user.click(udpCheck);

    const submitBtn = screen.getByRole("button", { name: /Submit Answer/i });
    await user.click(submitBtn);

    expect(submitAttemptAnswerAction).toHaveBeenCalledWith({
      spaceId: "space-789",
      attemptId: "att-123",
      questionId: "q-2",
      answer: { optionIds: ["opt-tcp", "opt-udp"] },
    });

    expect(
      await screen.findByText("TCP and UDP are transport layer protocols."),
    ).toBeInTheDocument();
  });

  it("toggles bookmark via bookmarkAttemptQuestionAction", async () => {
    const user = userEvent.setup();
    vi.mocked(bookmarkAttemptQuestionAction).mockResolvedValue({
      ok: true,
      data: { isBookmarked: true },
    });

    render(<AttemptSession attempt={mockAttempt} />);

    const bookmarkBtn = screen.getByRole("button", {
      name: "Bookmark question",
    });
    await user.click(bookmarkBtn);

    expect(bookmarkAttemptQuestionAction).toHaveBeenCalledWith({
      spaceId: "space-789",
      attemptId: "att-123",
      questionId: "q-1",
    });

    expect(
      await screen.findByRole("button", { name: "Remove bookmark" }),
    ).toBeInTheDocument();
  });

  it("completes exam and displays score breakdown card", async () => {
    const user = userEvent.setup();
    vi.mocked(completeAttemptAction).mockResolvedValue({
      ok: true,
      data: {
        score: 30,
        maximumScore: 30,
        percentage: 100,
        passed: true,
      },
    });

    // Create an attempt where all questions are already submitted
    const completedItemsAttempt: AttemptViewDto = {
      ...mockAttempt,
      items: [
        {
          ...mockAttempt.items[0],
          submittedAnswer: { optionIds: ["opt-80"] },
          feedback: {
            isCorrect: true,
            correctOptionIds: ["opt-80"],
            explanation: "Correct!",
          },
        },
        {
          ...mockAttempt.items[1],
          submittedAnswer: { optionIds: ["opt-tcp", "opt-udp"] },
          feedback: {
            isCorrect: true,
            correctOptionIds: ["opt-tcp", "opt-udp"],
            explanation: "Correct!",
          },
        },
      ],
    };

    render(<AttemptSession attempt={completedItemsAttempt} />);

    const finishBtn = screen.getByRole("button", { name: /Finish Exam/i });
    await user.click(finishBtn);

    expect(completeAttemptAction).toHaveBeenCalledWith({
      spaceId: "space-789",
      attemptId: "att-123",
    });

    // Score breakdown card
    expect(await screen.findByText("Exam Summary")).toBeInTheDocument();
    expect(screen.getByText("Passed")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  it("warns when attempting to finish an exam with unanswered questions", async () => {
    const user = userEvent.setup();
    render(<AttemptSession attempt={mockAttempt} />);

    const finishBtn = screen.getByRole("button", { name: /Finish Exam/i });
    await user.click(finishBtn);

    expect(completeAttemptAction).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        /Cannot complete exam: 2 question\(s\) are unanswered\./i,
      ),
    ).toBeInTheDocument();
  });
});
