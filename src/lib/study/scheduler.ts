import type { Grade } from 'ts-fsrs'
import { createEmptyCard, fsrs, State } from 'ts-fsrs'
import type { CardRating, ReviewState } from './types'

const scheduler = fsrs({ request_retention: 0.9 })

const ratingMap: Record<CardRating, Grade> = {
  again: 1,
  hard: 2,
  good: 3,
  easy: 4,
}

export function scheduleReview(
  rating: CardRating,
  previous?: ReviewState,
  now = new Date(),
): ReviewState {
  const card = previous
    ? {
        due: new Date(previous.dueAt),
        stability: previous.stability,
        difficulty: previous.difficulty,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: previous.reps,
        lapses: previous.lapses,
        learning_steps: 0,
        state: State.Review,
        last_review: new Date(previous.updatedAt),
      }
    : createEmptyCard(now)
  const result = scheduler.next(card, now, ratingMap[rating])
  const next = result.card

  return {
    cardId: previous?.cardId ?? '',
    dueAt: next.due.toISOString(),
    stability: next.stability,
    difficulty: next.difficulty,
    reps: next.reps,
    lapses: next.lapses,
    lastRating: rating,
    updatedAt: now.toISOString(),
  }
}
