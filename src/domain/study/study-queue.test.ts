import { describe, expect, it } from "vitest";
import { DomainError } from "@/domain/shared/domain-error";
import {
  buildStudyQueue,
  type DueMemory,
  type NewQuestion,
} from "./study-queue";

const NOW = new Date("2026-09-18T12:00:00.000Z");

const dueMemory = (
  questionId: string,
  dueAt: string,
  stateVersion = 1,
): DueMemory => ({ questionId, dueAt, stateVersion });

const newQuestion = (questionId: string, createdAt: string): NewQuestion => ({
  questionId,
  createdAt,
});

describe("buildStudyQueue", () => {
  it("returns [] for empty inputs", () => {
    const result = buildStudyQueue({
      dueMemories: [],
      newQuestions: [],
      now: NOW,
      limit: 10,
    });
    expect(result).toEqual([]);
  });

  it("due memories (dueAt <= now) appear before new questions", () => {
    const result = buildStudyQueue({
      dueMemories: [dueMemory("q1", "2026-09-18T11:00:00.000Z")],
      newQuestions: [newQuestion("q2", "2026-09-01T00:00:00.000Z")],
      now: NOW,
      limit: 10,
    });
    expect(result[0].questionId).toBe("q1");
    expect(result[0].isDue).toBe(true);
    expect(result[1].questionId).toBe("q2");
    expect(result[1].isDue).toBe(false);
  });

  it("future due memories are excluded from results", () => {
    const result = buildStudyQueue({
      dueMemories: [dueMemory("q-future", "2026-09-19T00:00:00.000Z")],
      newQuestions: [],
      now: NOW,
      limit: 10,
    });
    expect(result).toEqual([]);
  });

  it("due memories ordered by dueAt asc, then questionId asc", () => {
    const result = buildStudyQueue({
      dueMemories: [
        dueMemory("q-b", "2026-09-18T10:00:00.000Z"),
        dueMemory("q-a", "2026-09-18T10:00:00.000Z"),
        dueMemory("q-c", "2026-09-18T09:00:00.000Z"),
      ],
      newQuestions: [],
      now: NOW,
      limit: 10,
    });
    expect(result.map((r) => r.questionId)).toEqual(["q-c", "q-a", "q-b"]);
  });

  it("new questions ordered by createdAt asc, then questionId asc", () => {
    const result = buildStudyQueue({
      dueMemories: [],
      newQuestions: [
        newQuestion("q-b", "2026-09-01T10:00:00.000Z"),
        newQuestion("q-a", "2026-09-01T10:00:00.000Z"),
        newQuestion("q-c", "2026-09-01T09:00:00.000Z"),
      ],
      now: NOW,
      limit: 10,
    });
    expect(result.map((r) => r.questionId)).toEqual(["q-c", "q-a", "q-b"]);
  });

  it("limit is respected", () => {
    const result = buildStudyQueue({
      dueMemories: [
        dueMemory("q1", "2026-09-18T10:00:00.000Z"),
        dueMemory("q2", "2026-09-18T10:01:00.000Z"),
        dueMemory("q3", "2026-09-18T10:02:00.000Z"),
      ],
      newQuestions: [newQuestion("q4", "2026-09-01T00:00:00.000Z")],
      now: NOW,
      limit: 2,
    });
    expect(result).toHaveLength(2);
  });

  it("throws DomainError(validation-failed) when limit <= 0", () => {
    expect(() =>
      buildStudyQueue({
        dueMemories: [],
        newQuestions: [],
        now: NOW,
        limit: 0,
      }),
    ).toThrowError(DomainError);
    expect(() =>
      buildStudyQueue({
        dueMemories: [],
        newQuestions: [],
        now: NOW,
        limit: -5,
      }),
    ).toThrow(expect.objectContaining({ code: "validation-failed" }));
  });

  it("throws DomainError(validation-failed) for invalid dueAt date string", () => {
    expect(() =>
      buildStudyQueue({
        dueMemories: [dueMemory("q1", "not-a-date")],
        newQuestions: [],
        now: NOW,
        limit: 10,
      }),
    ).toThrow(expect.objectContaining({ code: "validation-failed" }));
  });

  it("throws DomainError(validation-failed) for invalid createdAt date string", () => {
    expect(() =>
      buildStudyQueue({
        dueMemories: [],
        newQuestions: [newQuestion("q1", "bad-date")],
        now: NOW,
        limit: 10,
      }),
    ).toThrow(expect.objectContaining({ code: "validation-failed" }));
  });
});
