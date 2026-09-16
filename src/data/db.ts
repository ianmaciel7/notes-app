import Dexie, { type EntityTable } from "dexie";

import type {
  BackupEnvelope,
  CardRecord,
  CardSchedule,
  DeckRecord,
  ReviewLogRecord,
} from "@/data/types";

export class RevisaDatabase extends Dexie {
  decks!: EntityTable<DeckRecord, "id">;
  cards!: EntityTable<CardRecord, "id">;
  schedules!: EntityTable<CardSchedule, "cardId">;
  reviewLogs!: EntityTable<ReviewLogRecord, "id">;

  constructor(name = "revisa") {
    super(name);
    this.version(1).stores({
      decks: "id, name, updatedAt",
      cards: "id, deckId, createdAt, updatedAt",
      schedules: "cardId, due, state",
      reviewLogs: "id, cardId, deckId, reviewedAt",
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
  input: Pick<CardRecord, "deckId" | "front" | "back">,
) {
  const front = input.front.trim();
  const back = input.back.trim();
  if (!front || !back) throw new Error("Preencha a frente e o verso do cartão.");
  const now = new Date().toISOString();
  const card: CardRecord = {
    id: crypto.randomUUID(),
    deckId: input.deckId,
    front,
    back,
    createdAt: now,
    updatedAt: now,
  };
  await database.cards.add(card);
  return card;
}

export async function updateCard(
  database: RevisaDatabase,
  id: string,
  input: Pick<CardRecord, "front" | "back">,
) {
  const front = input.front.trim();
  const back = input.back.trim();
  if (!front || !back) throw new Error("Preencha a frente e o verso do cartão.");
  await database.cards.update(id, { front, back, updatedAt: new Date().toISOString() });
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

export async function createBackup(database: RevisaDatabase, now = new Date()): Promise<BackupEnvelope> {
  const [decks, cards, schedules, reviewLogs] = await Promise.all([
    database.decks.toArray(),
    database.cards.toArray(),
    database.schedules.toArray(),
    database.reviewLogs.toArray(),
  ]);
  return { schemaVersion: 1, exportedAt: now.toISOString(), decks, cards, schedules, reviewLogs };
}

export async function replaceDatabase(database: RevisaDatabase, backup: BackupEnvelope) {
  await database.transaction("rw", database.decks, database.cards, database.schedules, database.reviewLogs, async () => {
    await Promise.all([
      database.decks.clear(),
      database.cards.clear(),
      database.schedules.clear(),
      database.reviewLogs.clear(),
    ]);
    await database.decks.bulkAdd(backup.decks);
    await database.cards.bulkAdd(backup.cards);
    await database.schedules.bulkAdd(backup.schedules);
    await database.reviewLogs.bulkAdd(backup.reviewLogs);
  });
}
