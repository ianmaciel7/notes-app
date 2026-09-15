import { describe, expect, it } from 'vitest'
import { scheduleReview } from './scheduler'

describe('scheduleReview', () => {
  it('creates a future review state for a new card', () => {
    const now = new Date('2026-09-15T12:00:00.000Z')
    const state = scheduleReview('good', undefined, now)

    expect(state.lastRating).toBe('good')
    expect(state.updatedAt).toBe(now.toISOString())
    expect(new Date(state.dueAt).getTime()).toBeGreaterThan(now.getTime())
    expect(state.reps).toBeGreaterThan(0)
  })
})
