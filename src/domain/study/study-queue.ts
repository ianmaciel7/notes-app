import { DomainError } from "@/domain/shared/domain-error";

// ── Public types ───────────────────────────────────────────────────────────

export interface DueMemory {
  questionId: string;
  dueAt: string;
  stateVersion: number;
}

export interface NewQuestion {
  questionId: string;
  createdAt: string;
}

export interface StudyQueueItem {
  questionId: string;
  isDue: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function parseDate(value: string, fieldName: string): Date {
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) {
    throw new DomainError("validation-failed", {
      message: `Invalid date string for ${fieldName}: "${value}"`,
    });
  }
  return new Date(ms);
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Builds a prioritized study queue:
 *  1. Due memories (dueAt <= now), sorted by dueAt asc then questionId asc.
 *  2. New questions (no memory yet), sorted by createdAt asc then questionId asc.
 *
 * @throws {DomainError} code "validation-failed" if limit <= 0 or any date is invalid.
 */
export function buildStudyQueue(opts: {
  dueMemories: DueMemory[];
  newQuestions: NewQuestion[];
  now: Date;
  limit: number;
}): StudyQueueItem[] {
  const { dueMemories, newQuestions, now, limit } = opts;

  if (limit <= 0) {
    throw new DomainError("validation-failed", {
      message: "limit must be a positive integer",
    });
  }

  // Validate all dates eagerly so callers get an immediate, clear error.
  const parsedDue = dueMemories.map((m) => ({
    ...m,
    parsedDueAt: parseDate(m.dueAt, "dueAt"),
  }));

  const parsedNew = newQuestions.map((q) => ({
    ...q,
    parsedCreatedAt: parseDate(q.createdAt, "createdAt"),
  }));

  // Filter: only memories that are actually due
  const overdue = parsedDue.filter((m) => m.parsedDueAt <= now);

  // Sort due memories: dueAt asc, then questionId asc
  overdue.sort((a, b) => {
    const diff = a.parsedDueAt.getTime() - b.parsedDueAt.getTime();
    if (diff !== 0) return diff;
    return a.questionId < b.questionId
      ? -1
      : a.questionId > b.questionId
        ? 1
        : 0;
  });

  // Sort new questions: createdAt asc, then questionId asc
  parsedNew.sort((a, b) => {
    const diff = a.parsedCreatedAt.getTime() - b.parsedCreatedAt.getTime();
    if (diff !== 0) return diff;
    return a.questionId < b.questionId
      ? -1
      : a.questionId > b.questionId
        ? 1
        : 0;
  });

  const combined: StudyQueueItem[] = [
    ...overdue.map((m) => ({ questionId: m.questionId, isDue: true })),
    ...parsedNew.map((q) => ({ questionId: q.questionId, isDue: false })),
  ];

  return combined.slice(0, limit);
}
