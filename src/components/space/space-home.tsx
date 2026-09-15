import { ArrowRight, BookOpen, Layers3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { studyCards, studyDecks } from '@/lib/study'
import { DeckBadge } from './deck-badge'

export function SpaceHome() {
  const dueCount = studyCards.filter((card) => card.due).length
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 py-4">
      <section className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Espaço pessoal de estudo
        </p>
        <h1 className="font-serif text-3xl">Lembre o que importa.</h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Um lugar calmo para revisar ideias, uma carta por vez.
        </p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/70">
          <CardContent className="flex items-center gap-4 p-5">
            <BookOpen className="size-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-medium">{dueCount}</p>
              <p className="text-sm text-muted-foreground">cartões para hoje</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="flex items-center gap-4 p-5">
            <Layers3 className="size-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-medium">{studyDecks.length}</p>
              <p className="text-sm text-muted-foreground">baralhos ativos</p>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Baralhos</h2>
          <Button
            variant="link"
            render={
              <Link href="/cards">
                Ver todos <ArrowRight />
              </Link>
            }
          />
        </div>
        <div className="grid gap-4">
          {studyDecks.map((deck) => (
            <Card key={deck.id} className="border-border/70">
              <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="font-serif text-xl">
                    {deck.name}
                  </CardTitle>
                  <DeckBadge>{deck.cards.length} cartões</DeckBadge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {deck.description}
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  className="rounded-full"
                  render={
                    <Link href={`/study/${deck.cards[0].id}`}>
                      Começar estudo <ArrowRight />
                    </Link>
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
