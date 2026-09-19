import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { DueStudyQueueItemDto } from "@/data/study";
import { formatDueInterval, StudyDeck } from "./study-deck";

vi.mock("@/lib/actions/study-actions", () => ({
  getDueStudyQueueAction: vi.fn(),
  gradeStudyAnswerAction: vi.fn(),
  previewReviewRatingsAction: vi.fn(),
  rateQuestionMemoryAction: vi.fn(),
}));

import {
  getDueStudyQueueAction,
  gradeStudyAnswerAction,
  previewReviewRatingsAction,
  rateQuestionMemoryAction,
} from "@/lib/actions/study-actions";

const mockQueueItem1: DueStudyQueueItemDto = {
  questionId: "q-1",
  revisionId: "rev-1",
  prompt: "What is the capital of France?",
  isDue: true,
  stateVersion: 0,
  options: [
    { id: "opt-paris", text: "Paris" },
    { id: "opt-london", text: "London" },
    { id: "opt-berlin", text: "Berlin" },
  ],
};

const mockQueueItem2: DueStudyQueueItemDto = {
  questionId: "q-2",
  revisionId: "rev-2",
  prompt: "Which planet is known as the Red Planet?",
  isDue: false,
  stateVersion: 1,
  options: [
    { id: "opt-mars", text: "Mars" },
    { id: "opt-venus", text: "Venus" },
  ],
};

describe("StudyDeck", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("formatDueInterval", () => {
    const baseNow = new Date("2026-09-19T10:00:00.000Z");

    it("formats intervals correctly", () => {
      expect(formatDueInterval(undefined, baseNow)).toBe("");
      expect(formatDueInterval("2026-09-19T10:00:30.000Z", baseNow)).toBe(
        "< 1m",
      );
      expect(formatDueInterval("2026-09-19T10:10:00.000Z", baseNow)).toBe(
        "10m",
      );
      expect(formatDueInterval("2026-09-19T14:00:00.000Z", baseNow)).toBe("4h");
      expect(formatDueInterval("2026-09-22T10:00:00.000Z", baseNow)).toBe("3d");
      expect(formatDueInterval("2026-11-19T10:00:00.000Z", baseNow)).toBe(
        "2mo",
      );
    });
  });

  it("displays celebratory empty state when queue is empty", () => {
    render(<StudyDeck spaceId="space-1" initialQueue={[]} />);

    expect(screen.getByTestId("study-empty-state")).toBeDefined();
    expect(screen.getByText("All caught up!")).toBeDefined();
    expect(
      screen.getByText(
        "You have reviewed all cards in your due queue for now. Great work!",
      ),
    ).toBeDefined();
  });

  it("fetches due study queue when initialQueue is not provided", async () => {
    vi.mocked(getDueStudyQueueAction).mockResolvedValue({
      ok: true,
      data: [mockQueueItem1],
    });

    render(<StudyDeck spaceId="space-1" />);

    expect(screen.getByTestId("study-loading")).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("What is the capital of France?")).toBeDefined();
    });

    expect(getDueStudyQueueAction).toHaveBeenCalledWith({
      spaceId: "space-1",
      limit: 20,
    });
  });

  it("displays current card prompt, badge, and options", () => {
    render(<StudyDeck spaceId="space-1" initialQueue={[mockQueueItem1]} />);

    expect(screen.getByText("Card 1 of 1")).toBeDefined();
    expect(screen.getByText("Due")).toBeDefined();
    expect(screen.getByText("What is the capital of France?")).toBeDefined();
    expect(screen.getByText("Paris")).toBeDefined();
    expect(screen.getByText("London")).toBeDefined();
    expect(screen.getByText("Berlin")).toBeDefined();
  });

  it("selects an option and enables Check Answer button", () => {
    render(<StudyDeck spaceId="space-1" initialQueue={[mockQueueItem1]} />);

    const checkBtn = screen.getByTestId("check-answer-btn");
    expect(checkBtn.hasAttribute("disabled")).toBe(true);

    const parisOption = screen.getByTestId("option-opt-paris");
    fireEvent.click(parisOption);

    expect(parisOption.getAttribute("aria-checked")).toBe("true");
    expect(checkBtn.hasAttribute("disabled")).toBe(false);
  });

  it("grades answer, shows feedback and preview ratings, rates and advances to next card", async () => {
    vi.mocked(gradeStudyAnswerAction).mockResolvedValue({
      ok: true,
      data: {
        isCorrect: true,
        correctOptionIds: ["opt-paris"],
        explanation: "Paris is indeed the capital of France.",
      },
    });

    vi.mocked(previewReviewRatingsAction).mockResolvedValue({
      ok: true,
      data: {
        again: { due: "2026-09-19T10:10:00.000Z", stateVersion: 1 },
        hard: { due: "2026-09-20T10:00:00.000Z", stateVersion: 1 },
        good: { due: "2026-09-22T10:00:00.000Z", stateVersion: 1 },
        easy: { due: "2026-09-26T10:00:00.000Z", stateVersion: 1 },
      },
    });

    vi.mocked(rateQuestionMemoryAction).mockResolvedValue({
      ok: true,
      data: {
        questionId: "q-1",
        dueAt: "2026-09-22T10:00:00.000Z",
        stateVersion: 1,
        reviewCount: 1,
      },
    });

    render(
      <StudyDeck
        spaceId="space-1"
        initialQueue={[mockQueueItem1, mockQueueItem2]}
      />,
    );

    // Step 1: Select option
    fireEvent.click(screen.getByTestId("option-opt-paris"));

    // Step 2: Click Check Answer
    const checkBtn = screen.getByTestId("check-answer-btn");
    fireEvent.click(checkBtn);

    // Step 3: Verify gradeStudyAnswerAction call
    await waitFor(() => {
      expect(gradeStudyAnswerAction).toHaveBeenCalledWith({
        spaceId: "space-1",
        questionId: "q-1",
        revisionId: "rev-1",
        submittedAnswer: { optionIds: ["opt-paris"] },
      });
    });

    // Step 4: Verify feedback is shown
    expect(screen.getByText("Correct!")).toBeDefined();
    expect(
      screen.getByText("Paris is indeed the capital of France."),
    ).toBeDefined();

    // Step 5: Verify previewReviewRatingsAction call
    await waitFor(() => {
      expect(previewReviewRatingsAction).toHaveBeenCalledWith({
        spaceId: "space-1",
        questionId: "q-1",
      });
    });

    // Step 6: Verify 4 rating buttons are shown
    expect(screen.getByTestId("rating-again")).toBeDefined();
    expect(screen.getByTestId("rating-hard")).toBeDefined();
    expect(screen.getByTestId("rating-good")).toBeDefined();
    expect(screen.getByTestId("rating-easy")).toBeDefined();

    // Step 7: Click a rating button ("Good")
    fireEvent.click(screen.getByTestId("rating-good"));

    // Step 8: Verify rateQuestionMemoryAction call
    await waitFor(() => {
      expect(rateQuestionMemoryAction).toHaveBeenCalledWith({
        spaceId: "space-1",
        questionId: "q-1",
        rating: "good",
        stateVersion: 0,
      });
    });

    // Step 9: Advances to card 2
    await waitFor(() => {
      expect(
        screen.getByText("Which planet is known as the Red Planet?"),
      ).toBeDefined();
      expect(screen.getByText("Card 2 of 2")).toBeDefined();
    });
  });

  it("advances to celebratory empty state after rating the last card in queue", async () => {
    vi.mocked(gradeStudyAnswerAction).mockResolvedValue({
      ok: true,
      data: {
        isCorrect: false,
        correctOptionIds: ["opt-paris"],
        explanation: "Capital of France is Paris, not Berlin.",
      },
    });

    vi.mocked(previewReviewRatingsAction).mockResolvedValue({
      ok: true,
      data: {
        again: { due: "2026-09-19T10:05:00.000Z", stateVersion: 1 },
        hard: { due: "2026-09-19T10:15:00.000Z", stateVersion: 1 },
        good: { due: "2026-09-20T10:00:00.000Z", stateVersion: 1 },
        easy: { due: "2026-09-23T10:00:00.000Z", stateVersion: 1 },
      },
    });

    vi.mocked(rateQuestionMemoryAction).mockResolvedValue({
      ok: true,
      data: {
        questionId: "q-1",
        dueAt: "2026-09-19T10:05:00.000Z",
        stateVersion: 1,
        reviewCount: 1,
      },
    });

    render(<StudyDeck spaceId="space-1" initialQueue={[mockQueueItem1]} />);

    // Select Berlin (incorrect)
    fireEvent.click(screen.getByTestId("option-opt-berlin"));
    fireEvent.click(screen.getByTestId("check-answer-btn"));

    await waitFor(() => {
      expect(screen.getByText("Incorrect")).toBeDefined();
    });

    // Rate "again"
    fireEvent.click(screen.getByTestId("rating-again"));

    // After rating last card, celebratory empty state appears
    await waitFor(() => {
      expect(screen.getByTestId("study-empty-state")).toBeDefined();
      expect(screen.getByText("All caught up!")).toBeDefined();
    });
  });
});
