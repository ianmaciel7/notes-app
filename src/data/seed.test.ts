import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { parseBackup } from "@/data/backup";
import { createRevisaDatabase, type RevisaDatabase } from "@/data/db";
import { generateRealisticSeedData, resetAndSeedDatabase } from "@/data/seed";
import { calculateErrorStats, identifyProblematicCards } from "@/domain/error-analysis";
import { calculateGoalsProgress } from "@/domain/goals";

describe("Seed database module", () => {
  let db: RevisaDatabase;

  beforeEach(() => {
    db = createRevisaDatabase(`revisa-seed-test-${crypto.randomUUID()}`);
  });

  afterEach(async () => {
    await db.delete();
  });

  it("generates realistic seed data that conforms strictly to backup schema", () => {
    const seed = generateRealisticSeedData();
    const jsonString = JSON.stringify(seed);
    const parsed = parseBackup(jsonString);

    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.decks.length).toBe(4);
    expect(parsed.cards.length).toBe(24);
    expect(parsed.schedules.length).toBeGreaterThan(0);
    expect(parsed.reviewLogs.length).toBeGreaterThan(50);
    expect(parsed.settings?.dailyCardGoal).toBe(20);
    expect(parsed.settings?.monthlyCardGoal).toBe(500);
  });

  it("resets and seeds database atomically", async () => {
    // Add existing dummy data
    await db.decks.add({
      id: "old-deck",
      name: "Old Deck",
      description: "Should be removed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const result = await resetAndSeedDatabase(db);

    expect(result.decks).toHaveLength(4);
    expect(await db.decks.count()).toBe(4);
    expect(await db.cards.count()).toBe(24);
    expect(await db.schedules.count()).toBe(result.schedules.length);
    expect(await db.reviewLogs.count()).toBe(result.reviewLogs.length);

    const old = await db.decks.get("old-deck");
    expect(old).toBeUndefined();

    // Verify analytics domain integration
    const decks = await db.decks.toArray();
    const cards = await db.cards.toArray();
    const schedules = await db.schedules.toArray();
    const reviewLogs = await db.reviewLogs.toArray();
    const settings = await db.settings.get("global");

    const errorStats = calculateErrorStats(reviewLogs, schedules);
    expect(errorStats.totalReviews).toBeGreaterThan(50);
    expect(errorStats.retentionRate).toBeGreaterThanOrEqual(70);
    expect(errorStats.retentionRate).toBeLessThanOrEqual(95);
    expect(errorStats.problematicCardsCount).toBeGreaterThan(0);

    const problematic = identifyProblematicCards(cards, schedules, reviewLogs, decks);
    expect(problematic.length).toBeGreaterThan(0);

    const goalsProgress = calculateGoalsProgress(reviewLogs, settings, new Date());
    expect(goalsProgress.streak.current).toBeGreaterThanOrEqual(1);
    expect(goalsProgress.daily.count).toBeGreaterThan(0);
  });
});
