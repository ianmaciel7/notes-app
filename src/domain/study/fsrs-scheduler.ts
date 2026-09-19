import {
  type Card,
  type CardInput,
  createEmptyCard,
  fsrs,
  type Grade,
  Rating,
} from "ts-fsrs";

// ── Constants ──────────────────────────────────────────────────────────────

const SCHEDULER_VERSION = "ts-fsrs-5.4" as const;
const PARAMETERS_VERSION = "default-0.90-v1" as const;

/** Singleton scheduler — deterministic, no fuzz */
const f = fsrs({ request_retention: 0.9, enable_fuzz: false });

// ── Public types ───────────────────────────────────────────────────────────

export type MemoryRating = "again" | "hard" | "good" | "easy";

export interface StoredFsrsCard {
  due: string; // ISO string
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: number; // ts-fsrs State enum value
  lastReview: string; // ISO string
  schedulerVersion: "ts-fsrs-5.4";
  parametersVersion: "default-0.90-v1";
}

export interface MemoryTransition {
  resultingCard: StoredFsrsCard;
  stateVersion: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const ratingMap: Record<MemoryRating, Grade> = {
  again: Rating.Again as Grade,
  hard: Rating.Hard as Grade,
  good: Rating.Good as Grade,
  easy: Rating.Easy as Grade,
};

function toStoredCard(card: Card): StoredFsrsCard {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReview: (card.last_review ?? card.due).toISOString(),
    schedulerVersion: SCHEDULER_VERSION,
    parametersVersion: PARAMETERS_VERSION,
  };
}

/** Reconstruct a ts-fsrs Card from our StoredFsrsCard */
function fromStoredCard(stored: StoredFsrsCard): CardInput {
  return {
    due: stored.due,
    stability: stored.stability,
    difficulty: stored.difficulty,
    elapsed_days: stored.elapsedDays,
    scheduled_days: stored.scheduledDays,
    learning_steps: 0,
    reps: stored.reps,
    lapses: stored.lapses,
    state: stored.state,
    last_review: stored.lastReview,
  };
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Create a brand-new StoredFsrsCard (state = New, due = now).
 */
export function createMemoryCard(now: Date): StoredFsrsCard {
  const card = createEmptyCard(now);
  return toStoredCard(card);
}

/**
 * Preview all 4 possible outcomes without mutating state.
 * stateVersion in each transition uses 0 as the base (preview only).
 */
export function previewMemoryRatings(
  previous: StoredFsrsCard | null,
  now: Date,
): Record<MemoryRating, MemoryTransition> {
  const card: CardInput | Card = previous
    ? fromStoredCard(previous)
    : createEmptyCard(now);

  const preview = f.repeat(card, now);

  return {
    again: {
      resultingCard: toStoredCard(preview[Rating.Again].card),
      stateVersion: 1,
    },
    hard: {
      resultingCard: toStoredCard(preview[Rating.Hard].card),
      stateVersion: 1,
    },
    good: {
      resultingCard: toStoredCard(preview[Rating.Good].card),
      stateVersion: 1,
    },
    easy: {
      resultingCard: toStoredCard(preview[Rating.Easy].card),
      stateVersion: 1,
    },
  };
}

/**
 * Apply a single review and return the resulting card + incremented stateVersion.
 */
export function scheduleMemoryReview(opts: {
  previous: StoredFsrsCard | null;
  rating: MemoryRating;
  now: Date;
  stateVersion: number;
}): MemoryTransition {
  const { previous, rating, now, stateVersion } = opts;

  const card: CardInput | Card = previous
    ? fromStoredCard(previous)
    : createEmptyCard(now);

  const grade = ratingMap[rating];
  const { card: nextCard } = f.next(card, now, grade);

  return {
    resultingCard: toStoredCard(nextCard),
    stateVersion: stateVersion + 1,
  };
}
