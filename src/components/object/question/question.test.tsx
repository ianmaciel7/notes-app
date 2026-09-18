import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ptBR from "@/app/[lang]/dictionaries/pt-BR.json";
import { I18nProvider } from "@/components/i18n-provider";

import { type ExamQuestion, ExamQuestionnaire } from "./question";

const questions: ExamQuestion[] = [
  {
    name: "single",
    number: 1,
    type: "single-choice",
    statement: "Pick one",
    options: [
      { value: "one", label: "A", text: "One" },
      { value: "two", label: "B", text: "Two" },
    ],
    correctAnswers: ["one"],
  },
  {
    name: "multiple",
    number: 2,
    type: "multiple-choice",
    statement: "Pick many",
    options: [
      { value: "red", label: "A", text: "Red" },
      { value: "blue", label: "B", text: "Blue" },
    ],
    correctAnswers: ["red", "blue"],
  },
];

describe("ExamQuestionnaire", () => {
  function renderQuestionnaire(children: ReactNode) {
    return render(
      <I18nProvider dictionary={ptBR} locale="pt-BR">
        {children}
      </I18nProvider>,
    );
  }

  afterEach(() => {
    cleanup();
  });

  it("supports one answer for single-choice and multiple answers for multiple-choice", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderQuestionnaire(
      <ExamQuestionnaire
        aria-label="Exam questionnaire"
        questions={questions}
        onSubmitAction={onSubmit}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "A. One" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("checkbox", { name: "A. Red" }));
    await user.click(screen.getByRole("checkbox", { name: "B. Blue" }));
    await user.click(screen.getByRole("button", { name: "Finalizar" }));

    expect(onSubmit).toHaveBeenCalledWith({
      single: ["one"],
      multiple: ["red", "blue"],
    });
    expect(
      screen.getByRole("form", { name: "Exam questionnaire" }),
    ).toBeInTheDocument();
  });

  it("renders an accessible empty state when there are no questions", () => {
    renderQuestionnaire(<ExamQuestionnaire questions={[]} />);

    expect(screen.getByText("Nenhuma questão disponível")).toBeInTheDocument();
  });

  it("shows the question type and readable option labels", () => {
    renderQuestionnaire(<ExamQuestionnaire questions={questions} />);

    expect(screen.getByText("Single choice")).toBeInTheDocument();
    expect(screen.getAllByText("A.", { exact: true })).toHaveLength(2);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("does not advance past an unanswered required question", async () => {
    const user = userEvent.setup();

    renderQuestionnaire(<ExamQuestionnaire questions={questions} />);

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose an answer to continue.",
    );
    expect(screen.getByText("Question 1 of 2")).toBeInTheDocument();
  });
});
