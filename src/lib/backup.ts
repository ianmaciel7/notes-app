import { z } from "zod";

import type { BackupEnvelope } from "@/lib/types";

const date = z.string().datetime();
const deckSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  createdAt: date,
  updatedAt: date,
});
const cardSchema = z.object({
  id: z.string().min(1),
  deckId: z.string().min(1),
  front: z.string().min(1),
  back: z.string().min(1),
  createdAt: date,
  updatedAt: date,
});
const scheduleSchema: z.ZodType<BackupEnvelope["schedules"][number]> = z.object({
  cardId: z.string().min(1),
  due: date,
  stability: z.number(),
  difficulty: z.number(),
  elapsedDays: z.number(),
  scheduledDays: z.number(),
  learningSteps: z.number(),
  reps: z.number().int().nonnegative(),
  lapses: z.number().int().nonnegative(),
  state: z.number().int(),
  lastReview: date.optional(),
});
const reviewLogSchema: z.ZodType<BackupEnvelope["reviewLogs"][number]> = z.object({
  id: z.string().min(1),
  cardId: z.string().min(1),
  deckId: z.string().optional(),
  rating: z.enum(["again", "hard", "good", "easy"]),
  reviewedAt: date,
  scheduledDays: z.number(),
  state: z.number().int(),
  previousSchedule: scheduleSchema.nullable(),
});
const backupSchema: z.ZodType<BackupEnvelope> = z.object({
  schemaVersion: z.literal(1),
  exportedAt: date,
  decks: z.array(deckSchema),
  cards: z.array(cardSchema),
  schedules: z.array(scheduleSchema),
  reviewLogs: z.array(reviewLogSchema),
});

export function parseBackup(value: string): BackupEnvelope {
  try {
    return backupSchema.parse(JSON.parse(value));
  } catch {
    throw new Error("Backup inválido. Verifique o arquivo e tente novamente.");
  }
}
