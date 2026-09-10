export type SRSState = "new" | "learning" | "review" | "relearning";

export type FSRSRating = 1 | 2 | 3 | 4;

export interface SRSItemState {
  state: SRSState;
  dueDate: string;
  lastReviewedAt?: string;
  interval: number;
  easeFactor: number;
  repetitionCount: number;
  lapses: number;
  stability?: number;
  difficulty?: number;
}

export interface ReviewContext {
  card: SRSItemState;
  now?: Date;
}

export interface ReviewResult {
  nextState: SRSItemState;
  daysUntilDue: number;
}

export interface GoalPacingInputs {
  unlearnedCardCount: number;
  daysRemaining: number;
  totalCards: number;
  daysElapsed: number;
  actualCompletedCards: number;
}

export type PacingStatus = "ahead" | "onTrack" | "behind";

export interface PacingResult {
  status: PacingStatus;
  expectedCompleted: number;
  dailyNewCardQuota: number;
  daysRemaining: number;
  bufferDays: number;
}

const FACTOR = 19 / 81;
const DECAY = -0.5;
const DEFAULT_RETRIEVABILITY_TARGET = 0.9;
const AGAIN_LAPSE_MULTIPLIER = 0.2;
const HARD_STABILITY_MULTIPLIER = 1.2;
const GOOD_STABILITY_MULTIPLIER = 1;
const EASY_STABILITY_MULTIPLIER = 1.8;
const MIN_STABILITY = 0.1;
const MIN_DIFFICULTY = 1300;
const MAX_DIFFICULTY = 3500;

function safeNumber(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

export function parseIsoOrNow(value?: string) {
  const parsed = value ? new Date(value).getTime() : NaN;
  return Number.isFinite(parsed) ? new Date(parsed) : new Date();
}

function toDaysBetween(reference: Date, target: Date) {
  return Math.max(0, (target.getTime() - reference.getTime()) / (24 * 60 * 60 * 1000));
}

function clamp01(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function retrievability(timeInDays: number, stability: number) {
  const t = Math.max(0, timeInDays);
  const s = Math.max(MIN_STABILITY, stability);
  return (1 + FACTOR * (t / s)) ** DECAY;
}

function calcInterval(stability: number, target = DEFAULT_RETRIEVABILITY_TARGET) {
  const s = Math.max(MIN_STABILITY, stability);
  const capped = clamp01(target);
  return (s / FACTOR) * (capped ** (1 / DECAY) - 1);
}

function floorInterval(value: number) {
  return Math.max(1, Math.floor(Math.max(1, value)));
}

function defaultRelearnState(base: SRSItemState, now: Date) {
  const stability = Math.max(MIN_STABILITY, base.stability ?? 1) * AGAIN_LAPSE_MULTIPLIER;
  const interval = Math.max(1, floorInterval(calcInterval(stability)));
  const dueDate = new Date(now);
  dueDate.setDate(now.getDate() + interval);

  return {
    state: "relearning" as const,
    dueDate: dueDate.toISOString(),
    lastReviewedAt: now.toISOString(),
    interval,
    easeFactor: safeNumber(base.easeFactor, 2500),
    repetitionCount: base.repetitionCount,
    lapses: base.lapses + 1,
    stability,
    difficulty: safeNumber(base.difficulty ?? MIN_DIFFICULTY, MIN_DIFFICULTY),
  } as SRSItemState;
}

function promoteState(card: SRSItemState, rating: FSRSRating, now: Date) {
  const baseMultiplier =
    rating === 1
      ? AGAIN_LAPSE_MULTIPLIER
      : rating === 2
        ? HARD_STABILITY_MULTIPLIER
        : rating === 4
          ? EASY_STABILITY_MULTIPLIER
          : GOOD_STABILITY_MULTIPLIER;

  const currentStability = Math.max(MIN_STABILITY, card.stability ?? 1);
  const updatedStability = Math.max(MIN_STABILITY, currentStability * baseMultiplier);
  const interval = floorInterval(calcInterval(updatedStability));
  const dueDate = new Date(now);
  dueDate.setDate(now.getDate() + interval);
  const nextState = rating === 1 ? "learning" : card.state === "learning" ? "review" : "review";

  return {
    state: nextState,
    dueDate: dueDate.toISOString(),
    lastReviewedAt: now.toISOString(),
    interval,
    easeFactor: safeNumber(card.easeFactor, 2500) * (rating === 2 ? 0.98 : 1),
    repetitionCount: rating === 1 ? card.repetitionCount : card.repetitionCount + 1,
    lapses: rating === 1 ? card.lapses + 1 : card.lapses,
    stability: updatedStability,
    difficulty: safeNumber(
      (card.difficulty ?? MIN_DIFFICULTY) + (rating === 2 ? 70 : rating === 1 ? 120 : -20),
      card.difficulty ?? MIN_DIFFICULTY,
    ),
  } as SRSItemState;
}

export function applyFSRSReview(review: ReviewContext, rating: FSRSRating): ReviewResult {
  const now = review.now ?? new Date();
  const card = review.card;

  if (rating === 1) {
    const nextState = defaultRelearnState(card, now);
    return {
      nextState,
      daysUntilDue: nextState.interval,
    };
  }

  const nextState = promoteState(card, rating, now);
  const nowDate = now.toISOString();

  return {
    nextState: {
      ...nextState,
      dueDate: nextState.dueDate,
      lastReviewedAt: nowDate,
      difficulty:
        clamp01((nextState.difficulty ?? MIN_DIFFICULTY) / MAX_DIFFICULTY) * MAX_DIFFICULTY,
    },
    daysUntilDue: nextState.interval,
  };
}

export function createInitialSRSState(referenceDate?: Date) {
  const now = referenceDate ?? new Date();
  return {
    state: "new" as const,
    dueDate: now.toISOString(),
    lastReviewedAt: now.toISOString(),
    interval: 0,
    easeFactor: 2500,
    repetitionCount: 0,
    lapses: 0,
    stability: 1,
    difficulty: MIN_DIFFICULTY,
  } satisfies SRSItemState;
}

export function estimatePacingStatus(inputs: GoalPacingInputs): PacingResult {
  const totalDays = Math.max(1, Math.floor(inputs.daysRemaining));
  const bufferDays =
    totalDays < 30 ? Math.max(1, Math.floor(totalDays * 0.2)) : Math.min(7, Math.max(1, totalDays));
  const availableDays = Math.max(1, totalDays - bufferDays);
  const dailyNewCardQuota = Math.max(
    0,
    Math.ceil(inputs.unlearnedCardCount / Math.max(1, availableDays)),
  );

  const elapsedRatio = Math.max(
    0,
    Math.min(1, inputs.daysElapsed / Math.max(1, totalDays + inputs.daysElapsed)),
  );
  const expectedCompleted = inputs.totalCards * elapsedRatio;
  const normalizedActual = Math.max(0, inputs.actualCompletedCards);
  const status: PacingStatus =
    expectedCompleted === 0 && normalizedActual === 0
      ? "onTrack"
      : normalizedActual >= expectedCompleted * 1.05
        ? "ahead"
        : normalizedActual >= expectedCompleted * 0.95
          ? "onTrack"
          : "behind";

  return {
    status,
    expectedCompleted,
    dailyNewCardQuota,
    daysRemaining: totalDays,
    bufferDays,
  };
}

export function currentRetrievability(card: SRSItemState, now = new Date()) {
  const lastReview = parseIsoOrNow(card.lastReviewedAt);
  const elapsedDays = toDaysBetween(lastReview, now);
  return retrievability(elapsedDays, card.stability ?? MIN_STABILITY);
}

export function dueInDays(card: SRSItemState, now = new Date()) {
  const dueAt = parseIsoOrNow(card.dueDate);
  return Math.floor(Math.max(0, toDaysBetween(now, dueAt)));
}
