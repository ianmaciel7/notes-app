import { describe, expect, it } from "vitest";
import {
  createMemoryCard,
  type MemoryRating,
  previewMemoryRatings,
  scheduleMemoryReview,
} from "./fsrs-scheduler";

const NOW = new Date("2026-09-18T12:00:00.000Z");

describe("createMemoryCard", () => {
  it("returns a StoredFsrsCard with correct version stamps", () => {
    const card = createMemoryCard(NOW);
    expect(card.schedulerVersion).toBe("ts-fsrs-5.4");
    expect(card.parametersVersion).toBe("default-0.90-v1");
  });

  it("has finite numeric stability and difficulty", () => {
    const card = createMemoryCard(NOW);
    expect(Number.isFinite(card.stability)).toBe(true);
    expect(Number.isFinite(card.difficulty)).toBe(true);
  });
});

describe("scheduleMemoryReview", () => {
  const ratings: MemoryRating[] = ["again", "hard", "good", "easy"];

  it.each(
    ratings,
  )("rating %s on a new card produces a due date > now", (rating) => {
    const result = scheduleMemoryReview({
      previous: null,
      rating,
      now: NOW,
      stateVersion: 0,
    });
    const due = new Date(result.resultingCard.due);
    expect(due.getTime()).toBeGreaterThan(NOW.getTime());
  });

  it("with previous: null returns stateVersion 1", () => {
    const result = scheduleMemoryReview({
      previous: null,
      rating: "good",
      now: NOW,
      stateVersion: 0,
    });
    expect(result.stateVersion).toBe(1);
  });

  it("increments stateVersion from N to N+1", () => {
    const first = scheduleMemoryReview({
      previous: null,
      rating: "good",
      now: NOW,
      stateVersion: 0,
    });
    const second = scheduleMemoryReview({
      previous: first.resultingCard,
      rating: "good",
      now: new Date(NOW.getTime() + 86400_000),
      stateVersion: first.stateVersion,
    });
    expect(second.stateVersion).toBe(first.stateVersion + 1);
  });

  it("stamps schedulerVersion on resulting card", () => {
    const result = scheduleMemoryReview({
      previous: null,
      rating: "good",
      now: NOW,
      stateVersion: 0,
    });
    expect(result.resultingCard.schedulerVersion).toBe("ts-fsrs-5.4");
  });

  it("stamps parametersVersion on resulting card", () => {
    const result = scheduleMemoryReview({
      previous: null,
      rating: "good",
      now: NOW,
      stateVersion: 0,
    });
    expect(result.resultingCard.parametersVersion).toBe("default-0.90-v1");
  });

  it("resulting card has finite numeric stability and difficulty", () => {
    const result = scheduleMemoryReview({
      previous: null,
      rating: "again",
      now: NOW,
      stateVersion: 0,
    });
    expect(Number.isFinite(result.resultingCard.stability)).toBe(true);
    expect(Number.isFinite(result.resultingCard.difficulty)).toBe(true);
  });
});

describe("previewMemoryRatings", () => {
  it("returns all 4 ratings", () => {
    const preview = previewMemoryRatings(null, NOW);
    expect(Object.keys(preview).sort()).toEqual([
      "again",
      "easy",
      "good",
      "hard",
    ]);
  });

  it("is pure — calling twice gives the same result", () => {
    const first = previewMemoryRatings(null, NOW);
    const second = previewMemoryRatings(null, NOW);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });

  it("each preview card has correct version stamps", () => {
    const preview = previewMemoryRatings(null, NOW);
    for (const key of Object.keys(preview) as MemoryRating[]) {
      expect(preview[key].resultingCard.schedulerVersion).toBe("ts-fsrs-5.4");
      expect(preview[key].resultingCard.parametersVersion).toBe(
        "default-0.90-v1",
      );
    }
  });

  it("works with an existing previous card", () => {
    const previous = scheduleMemoryReview({
      previous: null,
      rating: "good",
      now: NOW,
      stateVersion: 0,
    }).resultingCard;

    const preview = previewMemoryRatings(
      previous,
      new Date(NOW.getTime() + 86400_000),
    );
    expect(Object.keys(preview)).toHaveLength(4);
  });
});
