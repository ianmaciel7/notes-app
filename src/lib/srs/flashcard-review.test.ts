import { describe, expect, it } from "vitest";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";
import { getFlashcardReviewShortcutRating, selectDueFlashcards } from "@/lib/srs/flashcard-review";

function flashcardFixture(
  input: Partial<SpaceEntityRecord> & {
    id: string;
    dueDate: string;
    type?: SpaceEntityRecord["type"];
  },
): SpaceEntityRecord {
  return {
    id: input.id,
    spaceId: input.spaceId ?? "personal",
    objectTypeId: input.objectTypeId ?? "flashcard",
    type: input.type ?? "flashcard",
    title: input.title ?? input.id,
    createdAt: input.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-01T00:00:00.000Z",
    blocks: input.blocks ?? [],
    tags: input.tags ?? [],
    relations: input.relations ?? [],
    properties: input.properties ?? {},
    srs: {
      state: "review",
      dueDate: input.dueDate,
      lastReviewedAt: "2026-01-01T00:00:00.000Z",
      interval: 1,
      easeFactor: 2500,
      repetitionCount: 1,
      lapses: 0,
    },
    _syncStatus: "pending",
  };
}

describe("selectDueFlashcards", () => {
  it("returns only real flashcard entities due at or before the review date", () => {
    const now = new Date("2026-01-03T12:00:00.000Z");
    const due = flashcardFixture({
      id: "due-card",
      dueDate: "2026-01-03T00:00:00.000Z",
      title: "Due card",
    });
    const future = flashcardFixture({
      id: "future-card",
      dueDate: "2026-01-04T00:00:00.000Z",
    });
    const page = flashcardFixture({
      id: "page",
      dueDate: "2026-01-01T00:00:00.000Z",
      type: "page",
    });

    expect(selectDueFlashcards([future, page, due], now).map((entity) => entity.id)).toEqual([
      "due-card",
    ]);
  });
});

describe("getFlashcardReviewShortcutRating", () => {
  it("maps number shortcuts to FSRS ratings", () => {
    expect(getFlashcardReviewShortcutRating("1")).toBe(1);
    expect(getFlashcardReviewShortcutRating("2")).toBe(2);
    expect(getFlashcardReviewShortcutRating("3")).toBe(3);
    expect(getFlashcardReviewShortcutRating("4")).toBe(4);
    expect(getFlashcardReviewShortcutRating("5")).toBeNull();
  });
});
