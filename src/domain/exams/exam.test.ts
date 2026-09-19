import { describe, expect, it } from "vitest";
import {
  type ExamQuestionReference,
  type ExamRevisionPayload,
  validateExamForPublication,
} from "@/domain/exams/exam";
import type { ObjectRevision } from "@/domain/objects/object";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import type { DomainError } from "@/domain/shared/domain-error";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeQuestionRevision(
  overrides: Partial<ObjectRevision<QuestionRevisionPayload>> = {},
): ObjectRevision<QuestionRevisionPayload> {
  return {
    id: "qrev-1",
    objectId: "q-1",
    objectType: "question",
    version: 1,
    publicationState: "published",
    schemaVersion: 1,
    createdBy: "user-1",
    createdAt: new Date().toISOString(),
    payload: {
      schemaVersion: 1,
      format: "single-choice",
      prompt: "What is 1 + 1?",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "2" },
      ],
      correctOptionIds: ["b"],
      explanation: "Basic arithmetic.",
    },
    ...overrides,
  };
}

function makeExamRevisionPayload(
  questions: ExamQuestionReference[] = [],
  overrides: Partial<ExamRevisionPayload> = {},
): ExamRevisionPayload {
  return {
    schemaVersion: 1,
    instructions: "Answer every question.",
    passingPercentage: 70,
    questions,
    ...overrides,
  };
}

const SPACE_ID = "space-1";

// ---------------------------------------------------------------------------
// validateExamForPublication — happy path
// ---------------------------------------------------------------------------

describe("validateExamForPublication — valid exam", () => {
  it("returns a normalized snapshot with questionCount and maximumScore", () => {
    const qrev1 = makeQuestionRevision({
      id: "qrev-1",
      objectId: "q-1",
    });
    const qrev2 = makeQuestionRevision({
      id: "qrev-2",
      objectId: "q-2",
    });

    const payload = makeExamRevisionPayload([
      { questionId: "q-1", questionRevisionId: "qrev-1", points: 1 },
      { questionId: "q-2", questionRevisionId: "qrev-2", points: 1 },
    ]);

    const resolvedQuestions: Array<
      ObjectRevision<QuestionRevisionPayload> & { spaceId: string }
    > = [
      { ...qrev1, spaceId: SPACE_ID },
      { ...qrev2, spaceId: SPACE_ID },
    ];

    const result = validateExamForPublication(
      payload,
      SPACE_ID,
      resolvedQuestions,
    );

    expect(result).toEqual(
      expect.objectContaining({ questionCount: 2, maximumScore: 2 }),
    );
  });

  it("sums points correctly for heterogeneous weights", () => {
    const qrev1 = makeQuestionRevision({ id: "qrev-1", objectId: "q-1" });
    const qrev2 = makeQuestionRevision({ id: "qrev-2", objectId: "q-2" });

    const payload = makeExamRevisionPayload([
      { questionId: "q-1", questionRevisionId: "qrev-1", points: 3 },
      { questionId: "q-2", questionRevisionId: "qrev-2", points: 2 },
    ]);

    const resolvedQuestions = [
      { ...qrev1, spaceId: SPACE_ID },
      { ...qrev2, spaceId: SPACE_ID },
    ];

    const result = validateExamForPublication(
      payload,
      SPACE_ID,
      resolvedQuestions,
    );

    expect(result.maximumScore).toBe(5);
    expect(result.questionCount).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// validateExamForPublication — rejections
// ---------------------------------------------------------------------------

describe("validateExamForPublication — invalid exams", () => {
  it("rejects an exam with no questions", () => {
    const payload = makeExamRevisionPayload([]);

    expect(() =>
      validateExamForPublication(payload, SPACE_ID, []),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({
        code: "validation-failed",
      }),
    );
  });

  it("rejects duplicate question IDs", () => {
    const qrev = makeQuestionRevision({ id: "qrev-1", objectId: "q-1" });
    const payload = makeExamRevisionPayload([
      { questionId: "q-1", questionRevisionId: "qrev-1", points: 1 },
      { questionId: "q-1", questionRevisionId: "qrev-1", points: 1 },
    ]);

    expect(() =>
      validateExamForPublication(payload, SPACE_ID, [
        { ...qrev, spaceId: SPACE_ID },
      ]),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({
        code: "validation-failed",
      }),
    );
  });

  it("rejects a cross-space question reference", () => {
    const qrev = makeQuestionRevision({ id: "qrev-1", objectId: "q-1" });
    const payload = makeExamRevisionPayload([
      { questionId: "q-1", questionRevisionId: "qrev-1", points: 1 },
    ]);

    expect(() =>
      validateExamForPublication(payload, SPACE_ID, [
        { ...qrev, spaceId: "other-space" },
      ]),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({
        code: "validation-failed",
      }),
    );
  });

  it("rejects a draft (non-published) question revision", () => {
    const qrev = makeQuestionRevision({
      id: "qrev-1",
      objectId: "q-1",
      publicationState: "draft",
    });
    const payload = makeExamRevisionPayload([
      { questionId: "q-1", questionRevisionId: "qrev-1", points: 1 },
    ]);

    expect(() =>
      validateExamForPublication(payload, SPACE_ID, [
        { ...qrev, spaceId: SPACE_ID },
      ]),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({
        code: "validation-failed",
      }),
    );
  });

  it("rejects non-positive points", () => {
    const qrev = makeQuestionRevision({ id: "qrev-1", objectId: "q-1" });
    const payload = makeExamRevisionPayload([
      { questionId: "q-1", questionRevisionId: "qrev-1", points: 0 },
    ]);

    expect(() =>
      validateExamForPublication(payload, SPACE_ID, [
        { ...qrev, spaceId: SPACE_ID },
      ]),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({
        code: "validation-failed",
      }),
    );
  });

  it("rejects negative points", () => {
    const qrev = makeQuestionRevision({ id: "qrev-1", objectId: "q-1" });
    const payload = makeExamRevisionPayload([
      { questionId: "q-1", questionRevisionId: "qrev-1", points: -1 },
    ]);

    expect(() =>
      validateExamForPublication(payload, SPACE_ID, [
        { ...qrev, spaceId: SPACE_ID },
      ]),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({
        code: "validation-failed",
      }),
    );
  });

  it("rejects passingPercentage below 0", () => {
    const qrev = makeQuestionRevision({ id: "qrev-1", objectId: "q-1" });
    const payload = makeExamRevisionPayload(
      [{ questionId: "q-1", questionRevisionId: "qrev-1", points: 1 }],
      { passingPercentage: -1 },
    );

    expect(() =>
      validateExamForPublication(payload, SPACE_ID, [
        { ...qrev, spaceId: SPACE_ID },
      ]),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({
        code: "validation-failed",
      }),
    );
  });

  it("rejects passingPercentage above 100", () => {
    const qrev = makeQuestionRevision({ id: "qrev-1", objectId: "q-1" });
    const payload = makeExamRevisionPayload(
      [{ questionId: "q-1", questionRevisionId: "qrev-1", points: 1 }],
      { passingPercentage: 101 },
    );

    expect(() =>
      validateExamForPublication(payload, SPACE_ID, [
        { ...qrev, spaceId: SPACE_ID },
      ]),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({
        code: "validation-failed",
      }),
    );
  });
});
