'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useFirebaseUser } from '@/hooks/use-firebase-user'
import type { StudyCard as StudyCardData } from '@/lib/study'
import { DeckBadge } from './deck-badge'

type Rating = 'again' | 'hard' | 'good' | 'easy'

export function StudyCard({ card }: { card: StudyCardData }) {
  const { user } = useFirebaseUser()
  const [revealed, setRevealed] = useState(false)
  const [savedRating, setSavedRating] = useState<Rating | null>(null)
  const [saving, setSaving] = useState(false)

  async function rate(rating: Rating) {
    setSaving(true)
    setSavedRating(rating)
    try {
      const token = await user?.getIdToken()
      if (token) {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            cardId: card.id,
            deckId: card.deckId,
            rating,
            reviewState: {
              dueAt: new Date(Date.now() + 86_400_000).toISOString(),
              stability: 1,
              difficulty: 5,
              reps: 1,
              lapses: rating === 'again' ? 1 : 0,
              updatedAt: new Date().toISOString(),
            },
          }),
        })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-border/70 bg-card p-0">
      <CardContent className="p-6 sm:p-8">
        <DeckBadge>{card.deckName}</DeckBadge>
        <p className="mt-6 font-serif text-3xl leading-snug text-card-foreground">
          {card.question}
        </p>
        {!revealed ? (
          <Button
            className="mt-8 h-11 w-full rounded-full"
            onClick={() => setRevealed(true)}
          >
            Mostrar resposta
          </Button>
        ) : (
          <div className="mt-8 border-t border-border pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Resposta
            </p>
            <p className="mt-3 text-base leading-7 text-foreground">
              {card.answer}
            </p>
            <fieldset className="mt-8 flex flex-wrap gap-2">
              <legend className="sr-only">Avaliar cartão</legend>
              {(['again', 'hard', 'good', 'easy'] as const).map((rating) => (
                <Button
                  key={rating}
                  variant={
                    rating === 'again'
                      ? 'destructive'
                      : rating === 'good'
                        ? 'default'
                        : 'secondary'
                  }
                  className="rounded-full"
                  disabled={saving}
                  onClick={() => rate(rating)}
                >
                  {rating === 'again'
                    ? 'De novo'
                    : rating === 'hard'
                      ? 'Difícil'
                      : rating === 'good'
                        ? 'Bom'
                        : 'Fácil'}
                </Button>
              ))}
            </fieldset>
            {savedRating ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Revisão salva localmente · {savedRating}
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
