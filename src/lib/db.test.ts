import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  createBackup,
  createCard,
  createDeck,
  createRevisaDatabase,
  deleteDeck,
  replaceDatabase,
  type RevisaDatabase,
} from "@/lib/db";

describe("Revisa database", () => {
  let db: RevisaDatabase;

  beforeEach(() => {
    db = createRevisaDatabase(`revisa-test-${crypto.randomUUID()}`);
  });

  afterEach(async () => {
    await db.delete();
  });

  it("creates decks and cards, then cascades deck deletion", async () => {
    const deck = await createDeck(db, { name: "Biologia", description: "Células" });
    const card = await createCard(db, { deckId: deck.id, front: "Unidade da vida", back: "Célula" });
    await db.schedules.add({ cardId: card.id, due: new Date().toISOString(), stability: 1, difficulty: 5, elapsedDays: 0, scheduledDays: 1, learningSteps: 0, reps: 1, lapses: 0, state: 1 });
    await db.reviewLogs.add({ id: crypto.randomUUID(), cardId: card.id, deckId: deck.id, rating: "good", reviewedAt: new Date().toISOString(), scheduledDays: 1, state: 1, previousSchedule: null });

    await deleteDeck(db, deck.id);

    expect(await db.decks.count()).toBe(0);
    expect(await db.cards.count()).toBe(0);
    expect(await db.schedules.count()).toBe(0);
    expect(await db.reviewLogs.count()).toBe(0);
  });

  it("exports and atomically replaces every collection", async () => {
    await createDeck(db, { name: "Antigo", description: "" });
    const backup = {
      schemaVersion: 1 as const,
      exportedAt: "2026-09-15T12:00:00.000Z",
      decks: [{ id: "deck-new", name: "Novo", description: "Importado", createdAt: "2026-09-15T12:00:00.000Z", updatedAt: "2026-09-15T12:00:00.000Z" }],
      cards: [],
      schedules: [],
      reviewLogs: [],
    };

    await replaceDatabase(db, backup);
    const exported = await createBackup(db, new Date("2026-09-16T12:00:00.000Z"));

    expect(exported.decks).toHaveLength(1);
    expect(exported.decks[0].name).toBe("Novo");
    expect(exported.exportedAt).toBe("2026-09-16T12:00:00.000Z");
  });
});
