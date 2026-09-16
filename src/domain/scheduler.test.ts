import { describe, expect, it } from "vitest";

import { previewRatings, scheduleReview } from "@/domain/scheduler";

describe("FSRS scheduler", () => {
  const now = new Date("2026-09-15T12:00:00.000Z");

  it("previews all four ratings for a new card", () => {
    const previews = previewRatings(undefined, now);

    expect(previews.map((preview) => preview.rating)).toEqual([
      "again",
      "hard",
      "good",
      "easy",
    ]);
    expect(previews.every((preview) => preview.due.getTime() > now.getTime())).toBe(true);
    expect(previews.every((preview) => preview.intervalLabel.length > 0)).toBe(true);
  });

  it("creates a persisted schedule and log after a review", () => {
    const result = scheduleReview("card-1", undefined, "good", now);

    expect(result.schedule.cardId).toBe("card-1");
    expect(new Date(result.schedule.due).getTime()).toBeGreaterThan(now.getTime());
    expect(result.schedule.reps).toBe(1);
    expect(result.log.rating).toBe("good");
    expect(result.log.previousSchedule).toBeNull();
  });
});
