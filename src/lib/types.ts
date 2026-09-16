export type StudyRating = "again" | "hard" | "good" | "easy";
export type SessionGoal = 10 | 20 | 50 | "all";

export interface DeckRecord {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardRecord {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardSchedule {
  cardId: string;
  due: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview?: string;
}

export interface ReviewLogRecord {
  id: string;
  cardId: string;
  deckId?: string;
  rating: StudyRating;
  reviewedAt: string;
  scheduledDays: number;
  state: number;
  previousSchedule: CardSchedule | null;
}

export interface BackupEnvelope {
  schemaVersion: 1;
  exportedAt: string;
  decks: DeckRecord[];
  cards: CardRecord[];
  schedules: CardSchedule[];
  reviewLogs: ReviewLogRecord[];
}
