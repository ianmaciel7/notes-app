import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerAuth, getServerFirestore } from '@/lib/auth/firebase-admin'

const reviewSchema = z.object({
  cardId: z.string().uuid(),
  deckId: z.string().uuid(),
  rating: z.enum(['again', 'hard', 'good', 'easy']),
  reviewState: z.object({
    dueAt: z.string().datetime(),
    stability: z.number().finite().nonnegative(),
    difficulty: z.number().finite().nonnegative(),
    reps: z.number().int().nonnegative(),
    lapses: z.number().int().nonnegative(),
    updatedAt: z.string().datetime(),
  }),
})

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization')
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null
  const auth = getServerAuth()

  if (!auth || !token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    )
  }

  try {
    const user = await auth.verifyIdToken(token)
    const payload = reviewSchema.safeParse(await request.json())
    if (!payload.success) {
      return NextResponse.json(
        { error: 'Invalid review payload' },
        { status: 400 },
      )
    }

    const firestore = getServerFirestore()
    if (!firestore) {
      return NextResponse.json(
        { error: 'Database is not configured' },
        { status: 503 },
      )
    }
    await firestore
      .doc(`users/${user.uid}/spaces/notes/reviewStates/${payload.data.cardId}`)
      .set(
        {
          ...payload.data.reviewState,
          cardId: payload.data.cardId,
          deckId: payload.data.deckId,
          lastRating: payload.data.rating,
          updatedBy: user.uid,
        },
        { merge: true },
      )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Unable to save review' },
      { status: 500 },
    )
  }
}
