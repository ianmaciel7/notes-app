import { describe, expect, it } from "vitest";

import { buildStudyQueue } from "@/domain/study-queue";
import type { CardRecord, CardSchedule } from "@/data/types";

const cards: CardRecord[] = [
  { id: "new-1", deckId: "deck", front: "N1", back: "B1", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "due-later", deckId: "deck", front: "D2", back: "B2", createdAt: "2026-01-02T00:00:00.000Z", updatedAt: "2026-01-02T00:00:00.000Z" },
  { id: "due-first", deckId: "deck", front: "D1", back: "B3", createdAt: "2026-01-03T00:00:00.000Z", updatedAt: "2026-01-03T00:00:00.000Z" },
  { id: "future", deckId: "deck", front: "F", back: "B4", createdAt: "2026-01-04T00:00:00.000Z", updatedAt: "2026-01-04T00:00:00.000Z" },
];

function schedule(cardId: string, due: string): CardSchedule {
  return { cardId, due, stability: 1, difficulty: 5, elapsedDays: 1, scheduledDays: 1, learningSteps: 0, reps: 1, lapses: 0, state: 2, lastReview: "2026-09-01T00:00:00.000Z" };
}

describe("study queue", () => {
  it("puts overdue cards first and excludes future reviews", () => {
    const queue = buildStudyQueue(
      cards,
      [
        schedule("due-later", "2026-09-14T10:00:00.000Z"),
        schedule("due-first", "2026-09-13T10:00:00.000Z"),
        schedule("future", "2026-09-20T10:00:00.000Z"),
      ],
      new Date("2026-09-15T12:00:00.000Z"),
      "all",
    );

    expect(queue.map((card) => card.id)).toEqual(["due-first", "due-later", "new-1"]);
  });

  it("respects the selected session goal", () => {
    const manyCards = Array.from({ length: 30 }, (_, index) => ({
      ...cards[0],
      id: `new-${index}`,
      createdAt: new Date(2026, 0, index + 1).toISOString(),
    }));

    expect(buildStudyQueue(manyCards, [], new Date(), 10)).toHaveLength(10);
    expect(buildStudyQueue(manyCards, [], new Date(), 20)).toHaveLength(20);
    expect(buildStudyQueue(manyCards, [], new Date(), "all")).toHaveLength(30);
  });
});
