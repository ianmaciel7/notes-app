import { describe, expect, it } from "vitest";

import {
  gradeQuestion,
  type QuestionWithIdentity,
  toPublicQuestion,
} from "@/domain/questions/grade-question";
import {
  parseQuestionRevision,
  type QuestionRevisionPayload,
} from "@/domain/questions/question";

const multipleChoiceQuestion: QuestionRevisionPayload = {
  schemaVersion: 1,
  format: "multiple-choice",
  prompt: "Which statements apply?",
  options: [
    { id: "a", text: "First statement" },
    { id: "b", text: "Second statement" },
    { id: "c", text: "Third statement" },
  ],
  correctOptionIds: ["a", "b"],
  explanation: "Because both statements apply.",
  source: {
    title: "Reference source",
    url: "https://example.com/reference",
  },
  authorNotes: "Keep this explanation concise.",
};

describe("gradeQuestion", () => {
  it.each([
    {
      name: "grades a correct single-choice answer",
      question: {
        ...multipleChoiceQuestion,
        format: "single-choice" as const,
        correctOptionIds: ["a"],
      },
      answer: { optionIds: ["a"] },
      expected: {
        isCorrect: true,
        correctOptionIds: ["a"],
        explanation: "Because both statements apply.",
      },
    },
    {
      name: "grades an incorrect single-choice answer",
      question: {
        ...multipleChoiceQuestion,
        format: "single-choice" as const,
        correctOptionIds: ["a"],
      },
      answer: { optionIds: ["b"] },
      expected: {
        isCorrect: false,
        correctOptionIds: ["a"],
        explanation: "Because both statements apply.",
      },
    },
    {
      name: "grades multiple-choice answers independently of selection order",
      question: multipleChoiceQuestion,
      answer: { optionIds: ["b", "a"] },
      expected: {
        isCorrect: true,
        correctOptionIds: ["a", "b"],
        explanation: "Because both statements apply.",
      },
    },
    {
      name: "grades true-false answers using stable option IDs",
      question: {
        ...multipleChoiceQuestion,
        format: "true-false" as const,
        options: [
          { id: "true", text: "True" },
          { id: "false", text: "False" },
        ],
        correctOptionIds: ["false"],
      },
      answer: { optionIds: ["false"] },
      expected: {
        isCorrect: true,
        correctOptionIds: ["false"],
        explanation: "Because both statements apply.",
      },
    },
  ])("$name", ({ question, answer, expected }) => {
    expect(gradeQuestion(question, answer)).toEqual(expected);
  });

  it.each([
    {
      name: "duplicate option IDs",
      answer: { optionIds: ["a", "a"] },
    },
    {
      name: "unknown option IDs",
      answer: { optionIds: ["unknown"] },
    },
    {
      name: "empty answers",
      answer: { optionIds: [] },
    },
  ])("rejects $name", ({ answer }) => {
    expect(() => gradeQuestion(multipleChoiceQuestion, answer)).toThrowError(
      expect.objectContaining({ code: "validation-failed" }),
    );
  });

  it("rejects selections that do not match the question format", () => {
    const singleChoiceQuestion: QuestionRevisionPayload = {
      ...multipleChoiceQuestion,
      format: "single-choice",
      correctOptionIds: ["a"],
    };

    expect(() =>
      gradeQuestion(singleChoiceQuestion, { optionIds: ["a", "b"] }),
    ).toThrowError(expect.objectContaining({ code: "validation-failed" }));
  });
});

describe("parseQuestionRevision", () => {
  it("trims content and rejects malformed format-specific question payloads", () => {
    expect(
      parseQuestionRevision({
        ...multipleChoiceQuestion,
        prompt: "  Which statements apply?  ",
        options: [
          { id: "a", text: " First statement " },
          { id: "b", text: " Second statement " },
          { id: "c", text: " Third statement " },
        ],
      }),
    ).toEqual(
      expect.objectContaining({
        prompt: "Which statements apply?",
        options: expect.arrayContaining([{ id: "a", text: "First statement" }]),
      }),
    );

    expect(() =>
      parseQuestionRevision({
        ...multipleChoiceQuestion,
        options: [
          { id: "true", text: "True" },
          { id: "false", text: "False" },
        ],
        format: "true-false",
        correctOptionIds: ["true", "false"],
      }),
    ).toThrowError(expect.objectContaining({ code: "validation-failed" }));
  });
});

describe("toPublicQuestion", () => {
  it("omits unexpected sensitive runtime fields from browser DTOs", () => {
    const publicQuestion = toPublicQuestion({
      ...multipleChoiceQuestion,
      questionId: "question-1",
      questionRevisionId: "question-revision-1",
      sessionToken: "private-session-token",
      rawSchedulerState: { stability: 3.5 },
    } as unknown as QuestionWithIdentity);

    expect(publicQuestion).not.toHaveProperty("sessionToken");
    expect(publicQuestion).not.toHaveProperty("rawSchedulerState");
  });

  it("omits answer keys and author notes from browser DTOs", () => {
    const publicQuestion = toPublicQuestion({
      ...multipleChoiceQuestion,
      questionId: "question-1",
      questionRevisionId: "question-revision-1",
    });

    expect(publicQuestion).toEqual({
      schemaVersion: 1,
      format: "multiple-choice",
      prompt: "Which statements apply?",
      options: [
        { id: "a", text: "First statement" },
        { id: "b", text: "Second statement" },
        { id: "c", text: "Third statement" },
      ],
      source: {
        title: "Reference source",
        url: "https://example.com/reference",
      },
      questionId: "question-1",
      questionRevisionId: "question-revision-1",
    });
    expect(publicQuestion).not.toHaveProperty("correctOptionIds");
    expect(publicQuestion).not.toHaveProperty("explanation");
    expect(publicQuestion).not.toHaveProperty("authorNotes");
  });
});
