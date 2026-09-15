'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getCurrentIdToken } from '@/lib/auth/firebase-client'
import { scheduleReview } from '@/lib/study/scheduler'
import type { CardRating, StudyCard } from '@/lib/study/types'

type StudyReviewProps = { card: StudyCard }

const ratings: CardRating[] = ['again', 'hard', 'good', 'easy']

export function StudyReview({ card }: StudyReviewProps) {
  const t = useTranslations('space')
  const [revealed, setRevealed] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleRating(rating: CardRating) {
    setMessage(null)
    const token = await getCurrentIdToken()
    if (!token) {
      setMessage(t('authRequired'))
      return
    }

    setPending(true)
    try {
      const reviewState = scheduleReview(rating, undefined, new Date())
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: card.id,
          deckId: card.deckId,
          rating,
          reviewState: { ...reviewState, cardId: card.id },
        }),
      })

      if (!response.ok) throw new Error('Unable to save review')
      setMessage(t('saved'))
      setRevealed(false)
    } catch {
      setMessage(t('saveError'))
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="mt-8 border-border/70 shadow-none">
      <CardHeader>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {card.topic}
        </p>
        <CardTitle className="font-serif text-3xl leading-tight">
          {card.front}
        </CardTitle>
        <CardDescription>{t('reviewDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {revealed ? (
          <p className="rounded-lg bg-muted/60 p-4 text-sm leading-7">
            {card.back}
          </p>
        ) : (
          <Button onClick={() => setRevealed(true)}>{t('showAnswer')}</Button>
        )}

        {revealed ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ratings.map((rating) => (
              <Button
                key={rating}
                variant="outline"
                onClick={() => handleRating(rating)}
                disabled={pending}
              >
                {t(`rating.${rating}`)}
              </Button>
            ))}
          </div>
        ) : null}

        {message ? (
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{message}</span>
            {message === t('authRequired') ? (
              <Button
                render={<Link href="/login" />}
                variant="link"
                className="h-auto p-0"
              >
                {t('signIn')}
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
