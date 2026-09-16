import Dexie, { type EntityTable } from "dexie";

import type {
  BackupEnvelope,
  CardRecord,
  CardSchedule,
  DeckRecord,
  ReviewLogRecord,
  UserSettingsRecord,
} from "@/data/types";
import { DEFAULT_DAILY_GOAL, DEFAULT_MONTHLY_GOAL } from "@/domain/goals";

export class RevisaDatabase extends Dexie {
  decks!: EntityTable<DeckRecord, "id">;
  cards!: EntityTable<CardRecord, "id">;
  schedules!: EntityTable<CardSchedule, "cardId">;
  reviewLogs!: EntityTable<ReviewLogRecord, "id">;
  settings!: EntityTable<UserSettingsRecord, "id">;

  constructor(name = "revisa") {
    super(name);
    this.version(1).stores({
      decks: "id, name, updatedAt",
      cards: "id, deckId, createdAt, updatedAt",
      schedules: "cardId, due, state",
      reviewLogs: "id, cardId, deckId, reviewedAt",
    });
    this.version(2).stores({
      decks: "id, name, updatedAt",
      cards: "id, deckId, createdAt, updatedAt",
      schedules: "cardId, due, state",
      reviewLogs: "id, cardId, deckId, reviewedAt",
      settings: "id",
    });
  }
}

export function createRevisaDatabase(name?: string) {
  return new RevisaDatabase(name);
}

export const db = createRevisaDatabase();

export async function createDeck(
  database: RevisaDatabase,
  input: Pick<DeckRecord, "name" | "description">,
) {
  const now = new Date().toISOString();
  const deck: DeckRecord = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    description: input.description.trim(),
    createdAt: now,
    updatedAt: now,
  };
  if (!deck.name) throw new Error("Informe o nome do baralho.");
  await database.decks.add(deck);
  return deck;
}

export async function updateDeck(
  database: RevisaDatabase,
  id: string,
  input: Pick<DeckRecord, "name" | "description">,
) {
  const name = input.name.trim();
  if (!name) throw new Error("Informe o nome do baralho.");
  await database.decks.update(id, {
    name,
    description: input.description.trim(),
    updatedAt: new Date().toISOString(),
  });
}

export async function createCard(
  database: RevisaDatabase,
  input: Pick<CardRecord, "deckId" | "front" | "back"> &
    Partial<Pick<CardRecord, "type" | "sourceTitle" | "sourceAuthor" | "sourceUrl" | "options" | "explanation">>,
) {
  const front = input.front.trim();
  const back = input.back.trim();
  if (!front || !back) throw new Error("Preencha a frente e o verso do cartão.");
  const now = new Date().toISOString();
  const card: CardRecord = {
    id: crypto.randomUUID(),
    deckId: input.deckId,
    type: input.type ?? "anki",
    front,
    back,
    ...(input.sourceTitle?.trim() ? { sourceTitle: input.sourceTitle.trim() } : {}),
    ...(input.sourceAuthor?.trim() ? { sourceAuthor: input.sourceAuthor.trim() } : {}),
    ...(input.sourceUrl?.trim() ? { sourceUrl: input.sourceUrl.trim() } : {}),
    ...(input.options?.length ? { options: input.options } : {}),
    ...(input.explanation?.trim() ? { explanation: input.explanation.trim() } : {}),
    createdAt: now,
    updatedAt: now,
  };
  await database.cards.add(card);
  return card;
}

export async function updateCard(
  database: RevisaDatabase,
  id: string,
  input: Partial<Pick<CardRecord, "front" | "back" | "type" | "sourceTitle" | "sourceAuthor" | "sourceUrl" | "options" | "explanation">>,
) {
  const updates: Partial<CardRecord> = {
    updatedAt: new Date().toISOString(),
  };
  if (input.front !== undefined) {
    const front = input.front.trim();
    if (!front) throw new Error("Preencha a frente e o verso do cartão.");
    updates.front = front;
  }
  if (input.back !== undefined) {
    const back = input.back.trim();
    if (!back) throw new Error("Preencha a frente e o verso do cartão.");
    updates.back = back;
  }
  if (input.type !== undefined) updates.type = input.type;
  if (input.sourceTitle !== undefined) updates.sourceTitle = input.sourceTitle.trim();
  if (input.sourceAuthor !== undefined) updates.sourceAuthor = input.sourceAuthor.trim();
  if (input.sourceUrl !== undefined) updates.sourceUrl = input.sourceUrl.trim();
  if (input.options !== undefined) updates.options = input.options;
  if (input.explanation !== undefined) updates.explanation = input.explanation.trim();

  await database.cards.update(id, updates);
}

export async function deleteCard(database: RevisaDatabase, cardId: string) {
  await database.transaction("rw", database.cards, database.schedules, database.reviewLogs, async () => {
    await database.cards.delete(cardId);
    await database.schedules.delete(cardId);
    await database.reviewLogs.where("cardId").equals(cardId).delete();
  });
}

export async function deleteDeck(database: RevisaDatabase, deckId: string) {
  await database.transaction("rw", database.decks, database.cards, database.schedules, database.reviewLogs, async () => {
    const cardIds = await database.cards.where("deckId").equals(deckId).primaryKeys();
    await database.decks.delete(deckId);
    await database.cards.where("deckId").equals(deckId).delete();
    if (cardIds.length) {
      await database.schedules.where("cardId").anyOf(cardIds).delete();
      await database.reviewLogs.where("cardId").anyOf(cardIds).delete();
    }
  });
}

export async function saveReview(
  database: RevisaDatabase,
  schedule: CardSchedule,
  log: ReviewLogRecord,
) {
  const card = await database.cards.get(schedule.cardId);
  const persistedLog = { ...log, deckId: card?.deckId };
  await database.transaction("rw", database.schedules, database.reviewLogs, async () => {
    await database.schedules.put(schedule);
    await database.reviewLogs.add(persistedLog);
  });
}

export async function getUserSettings(database: RevisaDatabase): Promise<UserSettingsRecord> {
  const existing = await database.settings.get("global");
  if (existing) return existing;
  return {
    id: "global",
    dailyCardGoal: DEFAULT_DAILY_GOAL,
    monthlyCardGoal: DEFAULT_MONTHLY_GOAL,
    updatedAt: new Date().toISOString(),
  };
}

export async function saveUserSettings(
  database: RevisaDatabase,
  input: { dailyCardGoal?: number; monthlyCardGoal?: number },
): Promise<UserSettingsRecord> {
  const current = await getUserSettings(database);
  const updated: UserSettingsRecord = {
    id: "global",
    dailyCardGoal: input.dailyCardGoal !== undefined ? Math.max(1, input.dailyCardGoal) : current.dailyCardGoal,
    monthlyCardGoal: input.monthlyCardGoal !== undefined ? Math.max(1, input.monthlyCardGoal) : current.monthlyCardGoal,
    updatedAt: new Date().toISOString(),
  };
  await database.settings.put(updated);
  return updated;
}

export async function createBackup(database: RevisaDatabase, now = new Date()): Promise<BackupEnvelope> {
  const [decks, cards, schedules, reviewLogs, settings] = await Promise.all([
    database.decks.toArray(),
    database.cards.toArray(),
    database.schedules.toArray(),
    database.reviewLogs.toArray(),
    database.settings.get("global"),
  ]);
  return {
    schemaVersion: 1,
    exportedAt: now.toISOString(),
    decks,
    cards,
    schedules,
    reviewLogs,
    settings: settings || undefined,
  };
}

export async function replaceDatabase(database: RevisaDatabase, backup: BackupEnvelope) {
  await database.transaction("rw", database.decks, database.cards, database.schedules, database.reviewLogs, database.settings, async () => {
    await Promise.all([
      database.decks.clear(),
      database.cards.clear(),
      database.schedules.clear(),
      database.reviewLogs.clear(),
      database.settings.clear(),
    ]);
    await database.decks.bulkAdd(backup.decks);
    await database.cards.bulkAdd(backup.cards);
    await database.schedules.bulkAdd(backup.schedules);
    await database.reviewLogs.bulkAdd(backup.reviewLogs);
    if (backup.settings) {
      await database.settings.put(backup.settings);
    }
  });
}
