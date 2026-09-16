import { describe, expect, it } from "vitest";

import type { ReviewLogRecord, UserSettingsRecord } from "@/data/types";
import {
  calculateDailyProgress,
  calculateGoalsProgress,
  calculateMonthlyProgress,
  calculateStreak,
} from "./goals";

function makeLog(reviewedAt: string, rating: ReviewLogRecord["rating"] = "good"): ReviewLogRecord {
  return {
    id: crypto.randomUUID(),
    cardId: "card-1",
    rating,
    reviewedAt,
    scheduledDays: 1,
    state: 1,
    previousSchedule: null,
  };
}

describe("goals domain logic", () => {
  const now = new Date("2026-09-16T12:00:00.000Z");

  it("calculates daily progress correctly", () => {
    const logs: ReviewLogRecord[] = [
      makeLog("2026-09-16T08:30:00.000Z"),
      makeLog("2026-09-16T09:15:00.000Z"),
      makeLog("2026-09-15T22:00:00.000Z"), // yesterday (or previous day depending on tz, but different date key)
    ];

    const progress = calculateDailyProgress(logs, 10, now);
    expect(progress.count).toBe(2);
    expect(progress.goal).toBe(10);
    expect(progress.percentage).toBe(20);
    expect(progress.isCompleted).toBe(false);
  });

  it("marks daily progress completed when reaching or exceeding goal", () => {
    const logs = Array.from({ length: 15 }, () => makeLog("2026-09-16T10:00:00.000Z"));
    const progress = calculateDailyProgress(logs, 10, now);
    expect(progress.count).toBe(15);
    expect(progress.percentage).toBe(100);
    expect(progress.isCompleted).toBe(true);
  });

  it("calculates monthly progress correctly", () => {
    const logs: ReviewLogRecord[] = [
      makeLog("2026-09-01T10:00:00.000Z"),
      makeLog("2026-09-15T10:00:00.000Z"),
      makeLog("2026-09-16T10:00:00.000Z"),
      makeLog("2026-08-30T10:00:00.000Z"), // previous month
    ];

    const progress = calculateMonthlyProgress(logs, 100, now);
    expect(progress.count).toBe(3);
    expect(progress.goal).toBe(100);
    expect(progress.percentage).toBe(3);
    expect(progress.isCompleted).toBe(false);
  });

  it("calculates active streaks correctly across consecutive days", () => {
    const logs: ReviewLogRecord[] = [
      makeLog("2026-09-14T10:00:00.000Z"),
      makeLog("2026-09-15T10:00:00.000Z"),
      makeLog("2026-09-16T10:00:00.000Z"),
    ];

    const streak = calculateStreak(logs, now);
    expect(streak.current).toBe(3);
    expect(streak.longest).toBe(3);
    expect(streak.lastActiveDate).toBe("2026-09-16");
  });

  it("maintains streak if user studied yesterday but hasn't studied today yet", () => {
    const logs: ReviewLogRecord[] = [
      makeLog("2026-09-14T10:00:00.000Z"),
      makeLog("2026-09-15T10:00:00.000Z"),
    ];

    const streak = calculateStreak(logs, now);
    expect(streak.current).toBe(2);
    expect(streak.longest).toBe(2);
    expect(streak.lastActiveDate).toBe("2026-09-15");
  });

  it("resets current streak to 0 if missed yesterday", () => {
    const logs: ReviewLogRecord[] = [
      makeLog("2026-09-10T10:00:00.000Z"),
      makeLog("2026-09-11T10:00:00.000Z"),
    ];

    const streak = calculateStreak(logs, now);
    expect(streak.current).toBe(0);
    expect(streak.longest).toBe(2);
  });

  it("aggregates all goals progress using custom user settings", () => {
    const settings: UserSettingsRecord = {
      id: "global",
      dailyCardGoal: 25,
      monthlyCardGoal: 600,
      updatedAt: "2026-09-16T00:00:00.000Z",
    };

    const logs: ReviewLogRecord[] = [
      makeLog("2026-09-16T09:00:00.000Z"),
      makeLog("2026-09-16T10:00:00.000Z"),
    ];

    const result = calculateGoalsProgress(logs, settings, now);
    expect(result.daily.goal).toBe(25);
    expect(result.daily.count).toBe(2);
    expect(result.monthly.goal).toBe(600);
    expect(result.streak.current).toBe(1);
  });
});
