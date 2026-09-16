import { describe, expect, it } from "vitest";

import type { CardRecord, CardSchedule, DeckRecord, ReviewLogRecord } from "@/data/types";
import {
  buildMistakeStudyQueue,
  calculateErrorStats,
  identifyProblematicCards,
} from "./error-analysis";

describe("error analysis domain logic", () => {
  const cards: CardRecord[] = [
    { id: "c1", deckId: "d1", front: "Q1", back: "A1", createdAt: "2026-09-01", updatedAt: "2026-09-01" },
    { id: "c2", deckId: "d1", front: "Q2", back: "A2", createdAt: "2026-09-02", updatedAt: "2026-09-02" },
    { id: "c3", deckId: "d2", front: "Q3", back: "A3", createdAt: "2026-09-03", updatedAt: "2026-09-03" },
  ];

  const decks: DeckRecord[] = [
    { id: "d1", name: "JavaScript", description: "", createdAt: "2026-09-01", updatedAt: "2026-09-01" },
    { id: "d2", name: "Python", description: "", createdAt: "2026-09-01", updatedAt: "2026-09-01" },
  ];

  const schedules: CardSchedule[] = [
    { cardId: "c1", due: "2026-09-16", stability: 2, difficulty: 7, elapsedDays: 1, scheduledDays: 1, learningSteps: 0, reps: 5, lapses: 3, state: 2 },
    { cardId: "c2", due: "2026-09-16", stability: 10, difficulty: 3, elapsedDays: 5, scheduledDays: 10, learningSteps: 0, reps: 4, lapses: 0, state: 2 },
    { cardId: "c3", due: "2026-09-16", stability: 1, difficulty: 8, elapsedDays: 1, scheduledDays: 1, learningSteps: 0, reps: 2, lapses: 1, state: 2 },
  ];

  const logs: ReviewLogRecord[] = [
    { id: "l1", cardId: "c1", rating: "again", reviewedAt: "2026-09-14T10:00:00Z", scheduledDays: 1, state: 2, previousSchedule: null },
    { id: "l2", cardId: "c1", rating: "again", reviewedAt: "2026-09-15T10:00:00Z", scheduledDays: 1, state: 2, previousSchedule: null },
    { id: "l3", cardId: "c1", rating: "good", reviewedAt: "2026-09-16T10:00:00Z", scheduledDays: 2, state: 2, previousSchedule: null },
    { id: "l4", cardId: "c2", rating: "good", reviewedAt: "2026-09-15T10:00:00Z", scheduledDays: 5, state: 2, previousSchedule: null },
    { id: "l5", cardId: "c2", rating: "easy", reviewedAt: "2026-09-16T10:00:00Z", scheduledDays: 10, state: 2, previousSchedule: null },
    { id: "l6", cardId: "c3", rating: "again", reviewedAt: "2026-09-16T11:00:00Z", scheduledDays: 1, state: 2, previousSchedule: null },
  ];

  it("calculates overall error stats correctly", () => {
    const stats = calculateErrorStats(logs, schedules);
    expect(stats.totalReviews).toBe(6);
    expect(stats.againCount).toBe(3);
    expect(stats.goodCount).toBe(2);
    expect(stats.easyCount).toBe(1);
    expect(stats.retentionRate).toBe(50); // 3 good/easy out of 6 = 50%
    expect(stats.errorRate).toBe(50); // 3 again out of 6 = 50%
    expect(stats.totalLapses).toBe(4); // c1(3) + c3(1)
    expect(stats.problematicCardsCount).toBe(2); // c1 and c3
  });

  it("identifies and sorts problematic cards with highest severity first", () => {
    const problematic = identifyProblematicCards(cards, schedules, logs, decks);

    expect(problematic.length).toBe(2);
    // c1 has 2 again logs + 3 lapses -> severity = 2*2 + 3 = 7
    expect(problematic[0].cardId).toBe("c1");
    expect(problematic[0].deckName).toBe("JavaScript");
    expect(problematic[0].errorCount).toBe(2);
    expect(problematic[0].lapses).toBe(3);
    expect(problematic[0].errorRate).toBe(67); // 2/3 * 100

    // c3 has 1 again log + 1 lapse -> severity = 1*2 + 1 = 3
    expect(problematic[1].cardId).toBe("c3");
    expect(problematic[1].deckName).toBe("Python");
    expect(problematic[1].errorCount).toBe(1);
  });

  it("builds mistake study queue prioritizing problematic cards", () => {
    const queue = buildMistakeStudyQueue(cards, schedules, logs, "all");
    expect(queue.length).toBe(2);
    expect(queue[0].id).toBe("c1");
    expect(queue[1].id).toBe("c3");
  });

  it("slices mistake study queue according to numeric goal", () => {
    const queue = buildMistakeStudyQueue(cards, schedules, logs, 10);
    expect(queue.length).toBe(2);
  });
});
