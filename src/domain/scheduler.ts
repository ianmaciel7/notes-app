import { createEmptyCard, fsrs, Rating, type Card, type Grade } from "ts-fsrs";

import type { CardSchedule, ReviewLogRecord, StudyRating } from "@/data/types";

const scheduler = fsrs({ request_retention: 0.9, enable_fuzz: false });

const ratings: Array<{ rating: StudyRating; grade: Grade }> = [
  { rating: "again", grade: Rating.Again },
  { rating: "hard", grade: Rating.Hard },
  { rating: "good", grade: Rating.Good },
  { rating: "easy", grade: Rating.Easy },
];

function toFsrsCard(schedule: CardSchedule | undefined, now: Date): Card {
  if (!schedule) return createEmptyCard(now);

  return {
    due: new Date(schedule.due),
    stability: schedule.stability,
    difficulty: schedule.difficulty,
    elapsed_days: schedule.elapsedDays,
    scheduled_days: schedule.scheduledDays,
    learning_steps: schedule.learningSteps,
    reps: schedule.reps,
    lapses: schedule.lapses,
    state: schedule.state,
    last_review: schedule.lastReview ? new Date(schedule.lastReview) : undefined,
  } as Card;
}

function toSchedule(cardId: string, card: Card): CardSchedule {
  return {
    cardId,
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReview: card.last_review?.toISOString(),
  };
}

function gradeFor(rating: StudyRating) {
  return ratings.find((item) => item.rating === rating)!.grade;
}

export function formatInterval(due: Date, now: Date): string {
  const minutes = Math.max(1, Math.round((due.getTime() - now.getTime()) / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d`;
  const months = Math.round(days / 30);
  return `${months} ${months === 1 ? "mês" : "meses"}`;
}

export function previewRatings(schedule: CardSchedule | undefined, now = new Date()) {
  const card = toFsrsCard(schedule, now);
  return ratings.map(({ rating, grade }) => {
    const result = scheduler.next(card, now, grade);
    return {
      rating,
      due: result.card.due,
      intervalLabel: formatInterval(result.card.due, now),
    };
  });
}

export function scheduleReview(
  cardId: string,
  previousSchedule: CardSchedule | undefined,
  rating: StudyRating,
  now = new Date(),
) {
  const result = scheduler.next(toFsrsCard(previousSchedule, now), now, gradeFor(rating));
  const schedule = toSchedule(cardId, result.card);
  const log: ReviewLogRecord = {
    id: crypto.randomUUID(),
    cardId,
    rating,
    reviewedAt: now.toISOString(),
    scheduledDays: result.log.scheduled_days,
    state: result.log.state,
    previousSchedule: previousSchedule ?? null,
  };

  return { schedule, log };
}
