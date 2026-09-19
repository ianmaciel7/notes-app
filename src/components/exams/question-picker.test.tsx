import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { QuestionSummaryDto } from "@/data/questions-v2";
import { QuestionPicker } from "./question-picker";

describe("QuestionPicker", () => {
  afterEach(() => {
    cleanup();
  });

  const mockQuestions: QuestionSummaryDto[] = [
    {
      id: "q-1",
      spaceId: "space-1",
      title: "What is CIDR?",
      format: "single-choice",
      lifecycle: "published",
      latestRevisionId: "q-1_rev_2",
      publishedRevisionId: "q-1_rev_2",
      tags: ["networking"],
      updatedAt: "2026-09-19T00:00:00.000Z",
    },
    {
      id: "q-2",
      spaceId: "space-1",
      title: "Select all valid IPv6 addresses",
      format: "multiple-choice",
      lifecycle: "published",
      latestRevisionId: "q-2_rev_1",
      publishedRevisionId: "q-2_rev_1",
      tags: ["networking", "ipv6"],
      updatedAt: "2026-09-19T00:00:00.000Z",
    },
    {
      id: "q-3",
      spaceId: "space-1",
      title: "Unpublished Draft Question",
      format: "true-false",
      lifecycle: "draft",
      latestRevisionId: "q-3_rev_1",
      tags: [],
      updatedAt: "2026-09-19T00:00:00.000Z",
    },
  ];

  it("renders published questions displaying title, format, and published revision ID", () => {
    render(
      <QuestionPicker questions={mockQuestions} onSelectQuestion={vi.fn()} />,
    );

    expect(screen.getByText("What is CIDR?")).toBeDefined();
    expect(screen.getByText("q-1_rev_2")).toBeDefined();
    expect(screen.getByText("single-choice")).toBeDefined();

    expect(screen.getByText("Select all valid IPv6 addresses")).toBeDefined();
    expect(screen.getByText("q-2_rev_1")).toBeDefined();
    expect(screen.getByText("multiple-choice")).toBeDefined();

    // Draft questions without publishedRevisionId should not be shown
    expect(screen.queryByText("Unpublished Draft Question")).toBeNull();
  });

  it("filters published questions by search query", () => {
    render(
      <QuestionPicker questions={mockQuestions} onSelectQuestion={vi.fn()} />,
    );

    const searchInput = screen.getByPlaceholderText(
      /search published questions/i,
    );
    fireEvent.change(searchInput, { target: { value: "IPv6" } });

    expect(screen.getByText("Select all valid IPv6 addresses")).toBeDefined();
    expect(screen.queryByText("What is CIDR?")).toBeNull();
  });

  it("calls onSelectQuestion when clicking the Add button", () => {
    const handleSelect = vi.fn();
    render(
      <QuestionPicker
        questions={mockQuestions}
        onSelectQuestion={handleSelect}
      />,
    );

    const addButtons = screen.getAllByRole("button", { name: /add|select/i });
    fireEvent.click(addButtons[0]);

    expect(handleSelect).toHaveBeenCalledWith(mockQuestions[0]);
  });

  it("disables the add button when the question is already selected", () => {
    render(
      <QuestionPicker
        questions={mockQuestions}
        onSelectQuestion={vi.fn()}
        selectedQuestionIds={["q-1"]}
      />,
    );

    const addedButton = screen.getByRole("button", {
      name: /added|already added/i,
    });
    expect(addedButton).toBeDefined();
    expect(addedButton.hasAttribute("disabled")).toBe(true);
  });

  it("displays empty state message when no questions match", () => {
    render(
      <QuestionPicker questions={mockQuestions} onSelectQuestion={vi.fn()} />,
    );

    const searchInput = screen.getByPlaceholderText(
      /search published questions/i,
    );
    fireEvent.change(searchInput, { target: { value: "non-existent query" } });

    expect(screen.getByText(/no published questions found/i)).toBeDefined();
  });
});
