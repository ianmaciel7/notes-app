export type StudyRating = "again" | "hard" | "good" | "easy";
export type SessionGoal = 10 | 20 | 50 | "all";

export type CardType = "anki" | "readwise" | "exam_topic";

export interface ExamOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

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
  type?: CardType;
  front: string;
  back: string;
  sourceTitle?: string;
  sourceAuthor?: string;
  sourceUrl?: string;
  options?: ExamOption[];
  explanation?: string;
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

export interface UserSettingsRecord {
  id: "global";
  dailyCardGoal: number;
  monthlyCardGoal: number;
  updatedAt: string;
}

export interface CardErrorSummary {
  cardId: string;
  deckId: string;
  deckName?: string;
  front: string;
  back: string;
  lapses: number;
  errorCount: number;
  totalReviews: number;
  errorRate: number;
  lastRating?: StudyRating;
  lastReviewedAt?: string;
}

export interface StudyGoalsProgress {
  daily: {
    goal: number;
    count: number;
    percentage: number;
    isCompleted: boolean;
  };
  monthly: {
    goal: number;
    count: number;
    percentage: number;
    isCompleted: boolean;
  };
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
  };
}

export interface OverallErrorStats {
  totalReviews: number;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
  retentionRate: number;
  errorRate: number;
  totalLapses: number;
  problematicCardsCount: number;
}

export interface BackupEnvelope {
  schemaVersion: 1;
  exportedAt: string;
  decks: DeckRecord[];
  cards: CardRecord[];
  schedules: CardSchedule[];
  reviewLogs: ReviewLogRecord[];
  settings?: UserSettingsRecord;
}
