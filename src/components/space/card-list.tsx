import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { studyCards } from '@/lib/study'
import { DeckBadge } from './deck-badge'

export function CardList() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Biblioteca
        </p>
        <h1 className="mt-3 font-serif text-3xl">Todos os cartões</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Escolha uma ideia para revisar com calma.
        </p>
      </div>
      <div className="grid gap-3">
        {studyCards.map((card) => (
          <Card key={card.id} className="border-border/70">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <DeckBadge>{card.deckName}</DeckBadge>
                <p className="mt-3 truncate font-serif text-lg">
                  {card.question}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                render={
                  <Link
                    href={`/study/${card.id}`}
                    aria-label={`Estudar: ${card.question}`}
                  >
                    <ArrowRight />
                  </Link>
                }
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
