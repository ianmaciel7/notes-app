'use client'

import {
  BookOpen,
  Brain,
  ChevronRight,
  LockKeyhole,
  LogOut,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useFirebaseUser } from '@/hooks/use-firebase-user'
import { signOutFromFirebase } from '@/lib/auth/firebase-client'
import { studyDecks } from '@/lib/study/fixtures'
import { StudyReview } from './study-review'

type SpaceShellProps = { pathname: string }

function accentClass(accent: string) {
  if (accent === 'violet') return 'bg-secondary text-secondary-foreground'
  if (accent === 'amber') return 'bg-accent text-accent-foreground'
  return 'bg-primary/10 text-primary'
}

export function SpaceShell({ pathname }: SpaceShellProps) {
  const t = useTranslations('space')
  const { user } = useFirebaseUser()
  const [selectedDeckId, setSelectedDeckId] = useState(studyDecks[0]?.id ?? '')
  const selectedDeck = useMemo(
    () =>
      studyDecks.find((deck) => deck.id === selectedDeckId) ?? studyDecks[0],
    [selectedDeckId],
  )
  const reviewCard = studyDecks
    .flatMap((deck) => deck.cards)
    .find((card) => pathname === `/study/${card.id}`)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex h-14 items-center justify-between border-b border-border/70 px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-lg bg-foreground text-background">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">{t('brand')}</p>
            <p className="text-[11px] text-muted-foreground">
              Notes · {pathname === '/' ? t('today') : pathname.slice(1)}
            </p>
          </div>
        </div>
        {user ? (
          <Button variant="outline" size="sm" onClick={signOutFromFirebase}>
            <LogOut data-icon="inline-start" aria-hidden="true" />
            {t('signOut')}
          </Button>
        ) : (
          <Button render={<Link href="/login" />} variant="outline" size="sm">
            <LockKeyhole data-icon="inline-start" aria-hidden="true" />
            {t('signIn')}
          </Button>
        )}
      </header>

      <div className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="hidden border-r border-border/70 px-4 py-6 lg:block">
          <p className="mb-3 px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t('study')}
          </p>
          <nav className="flex flex-col gap-1" aria-label={t('study')}>
            <Button variant="secondary" className="justify-start">
              <Brain data-icon="inline-start" aria-hidden="true" />
              {t('today')}
            </Button>
            <Button variant="ghost" className="justify-start">
              <BookOpen data-icon="inline-start" aria-hidden="true" />
              {t('decks')}
            </Button>
          </nav>
          <Separator className="my-6" />
          <p className="mb-3 px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t('decks')}
          </p>
          <div className="flex flex-col gap-1">
            {studyDecks.map((deck) => (
              <button
                key={deck.id}
                type="button"
                aria-pressed={selectedDeck.id === deck.id}
                onClick={() => setSelectedDeckId(deck.id)}
                className={`flex items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-muted/70 ${selectedDeck.id === deck.id ? 'bg-muted font-medium' : 'text-muted-foreground'}`}
              >
                <span className="truncate">{deck.title}</span>
                <span className="ml-2 text-xs tabular-nums">
                  {deck.cards.length}
                </span>
              </button>
            ))}
          </div>
          <Separator className="my-6" />
          <p className="px-2 text-xs leading-5 text-muted-foreground">
            {t('previewOnly')}
          </p>
        </aside>

        <main className="min-w-0 px-5 py-8 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-4xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t('eyebrow')}
            </p>
            <h1 className="max-w-xl font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              {t('description')}
            </p>

            <section
              className="mt-10 grid gap-3 sm:grid-cols-2 lg:hidden"
              aria-label={t('decks')}
            >
              {studyDecks.map((deck) => (
                <button
                  key={deck.id}
                  type="button"
                  onClick={() => setSelectedDeckId(deck.id)}
                  className={`rounded-xl border p-4 text-left transition-colors hover:bg-muted/70 ${selectedDeck.id === deck.id ? 'border-foreground/30 bg-muted/60' : 'border-border/70 bg-card'}`}
                >
                  <div
                    className={`mb-5 grid size-9 place-items-center rounded-lg ${accentClass(deck.accent)}`}
                  >
                    <BookOpen className="size-4" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold">{deck.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {deck.cards.length} {t('cards')}
                  </p>
                </button>
              ))}
            </section>

            {reviewCard ? <StudyReview card={reviewCard} /> : null}

            <Card className="mt-8 border-border/70 shadow-none">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="font-serif text-2xl">
                      {selectedDeck.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {selectedDeck.description}
                    </CardDescription>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {selectedDeck.cards.length} {t('cards')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {selectedDeck.cards.map((card) => (
                  <Link
                    key={card.id}
                    href={`/study/${card.id}`}
                    className="group flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 transition-colors hover:bg-muted/60"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {card.front}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {card.topic}
                      </span>
                    </span>
                    <ChevronRight
                      className="ml-4 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>

        <aside className="hidden border-l border-border/70 bg-muted/20 px-6 py-8 xl:block">
          <Card className="border-border/70 bg-background shadow-none">
            <CardHeader>
              <CardDescription>{t('today')}</CardDescription>
              <CardTitle className="font-serif text-4xl">0</CardTitle>
              <CardDescription>{t('due')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-0 rounded-full bg-primary" />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {t('previewOnly')}
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
