"use client";

import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  BookOpen,
  ChevronRight,
  Library,
  Plus,
} from "lucide-react";
import Link from "next/link";

import { DeckDialog } from "@/components/deck-dialog";
import { GoalsCard } from "@/components/goals-card";
import { SpaceLayout } from "@/components/space-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { createDeck, db } from "@/data/db";
import { calculateGoalsProgress } from "@/domain/goals";
import type { StudyGoalsProgress } from "@/data/types";
import { useRevisaWebMcp } from "@/integrations/webmcp";

export interface DeckSummary {
  id: string;
  name: string;
  description?: string;
  cardCount: number;
  dueCount: number;
  newCount: number;
}

export interface LibraryShellProps extends React.ComponentProps<typeof SpaceLayout> {
  decks?: DeckSummary[];
  dueCount?: number;
  newCount?: number;
  goalsProgress?: StudyGoalsProgress;
  onCreateDeck?: () => void;
}

export function LibraryShell({
  decks: propDecks,
  dueCount: propDueCount,
  newCount: propNewCount,
  goalsProgress: propGoalsProgress,
  onCreateDeck,
  className,
  active = "decks",
  ...props
}: LibraryShellProps = {}) {
  useRevisaWebMcp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [now] = useState(() => Date.now());

  const isControlled = propDecks !== undefined;

  const dbDecks = useLiveQuery(() => db.decks.orderBy("updatedAt").reverse().toArray(), [], isControlled ? [] : undefined);
  const dbCards = useLiveQuery(() => db.cards.toArray(), [], isControlled ? [] : undefined);
  const dbSchedules = useLiveQuery(() => db.schedules.toArray(), [], isControlled ? [] : undefined);
  const dbReviewLogs = useLiveQuery(() => db.reviewLogs.toArray(), [], isControlled ? [] : undefined);
  const dbSettings = useLiveQuery(() => db.settings.get("global"), [], isControlled ? undefined : undefined);

  const querySummaries = useMemo(() => {
    if (isControlled) return propDecks ?? [];
    if (!dbDecks || !dbCards || !dbSchedules) return [];
    const scheduleByCard = new Map(dbSchedules.map((schedule) => [schedule.cardId, schedule]));
    return dbDecks.map<DeckSummary>((deck) => {
      const deckCards = dbCards.filter((card) => card.deckId === deck.id);
      return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        cardCount: deckCards.length,
        newCount: deckCards.filter((card) => !scheduleByCard.has(card.id)).length,
        dueCount: deckCards.filter((card) => {
          const schedule = scheduleByCard.get(card.id);
          return schedule && new Date(schedule.due).getTime() <= now;
        }).length,
      };
    });
  }, [isControlled, propDecks, dbDecks, dbCards, dbSchedules, now]);

  const queryGoalsProgress = useMemo(() => {
    if (isControlled) return propGoalsProgress;
    return calculateGoalsProgress(dbReviewLogs || [], dbSettings, new Date(now));
  }, [isControlled, propGoalsProgress, dbReviewLogs, dbSettings, now]);

  const decks = propDecks ?? querySummaries;
  const dueCount = propDueCount ?? decks.reduce((total, deck) => total + deck.dueCount, 0);
  const newCount = propNewCount ?? decks.reduce((total, deck) => total + deck.newCount, 0);
  const goalsProgress = propGoalsProgress ?? queryGoalsProgress;
  const handleCreateDeck = onCreateDeck ?? (() => setDialogOpen(true));

  return (
    <SpaceLayout active={active} className={className} {...props}>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-8">
        {/* Page Heading */}
        <section className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Biblioteca</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Seus baralhos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Escolha um assunto e continue de onde parou.
            </p>
          </div>
          <Button type="button" onClick={handleCreateDeck} className="gap-2 shrink-0">
            <Plus size={16} />
            <span>Criar baralho</span>
          </Button>
        </section>

        {/* Goals Progress Widget */}
        {goalsProgress ? (
          <section>
            <GoalsCard goalsProgress={goalsProgress} />
          </section>
        ) : null}

        {/* Study Overview Row */}
        <section
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-border"
          aria-label="Resumo de estudos"
        >
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
              <BookOpen size={20} />
            </span>
            <div className="grid gap-0.5">
              <strong className="text-sm font-semibold text-foreground">Pronto para hoje</strong>
              <span className="text-xs text-muted-foreground">
                {dueCount + newCount === 0 ? "Tudo em dia" : "Cartões aguardando revisão"}
              </span>
            </div>
          </div>
          <dl className="flex items-center gap-6 sm:gap-8 m-0">
            <div className="text-left sm:text-right border-l border-border pl-6">
              <dt className="text-xs text-muted-foreground">Pendentes</dt>
              <dd className="text-2xl font-bold text-foreground m-0 mt-0.5">{dueCount}</dd>
            </div>
            <div className="text-left sm:text-right border-l border-border pl-6">
              <dt className="text-xs text-muted-foreground">Novos</dt>
              <dd className="text-2xl font-bold text-foreground m-0 mt-0.5">{newCount}</dd>
            </div>
          </dl>
        </section>

        {/* Deck Grid or Empty State */}
        {decks.length === 0 ? (
          <Empty className="min-h-[280px] border border-dashed border-border rounded-xl">
            <EmptyMedia className="w-12 h-12 bg-secondary text-primary">
              <Library size={26} />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Sua biblioteca está vazia</EmptyTitle>
              <EmptyDescription>
                Crie um baralho para começar a transformar conteúdo em memória.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="secondary" type="button" onClick={handleCreateDeck} className="gap-2">
                <Plus size={16} />
                <span>Criar baralho</span>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-label="Baralhos">
            {decks.map((deck) => (
              <Card
                className="hover:shadow-md hover:border-foreground/20 transition-all rounded-xl border border-border bg-card p-5 group flex flex-col justify-between"
                key={deck.id}
              >
                <Link
                  className="flex flex-col h-full justify-between gap-4 no-underline text-inherit"
                  href={`/decks/${deck.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-lg bg-secondary text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <BookOpen size={19} />
                    </span>
                    <ChevronRight
                      size={18}
                      className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-foreground line-clamp-1 m-0">
                      {deck.name}
                    </h2>
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px] m-0 leading-relaxed">
                      {deck.description || `${deck.cardCount} ${deck.cardCount === 1 ? "cartão" : "cartões"}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-border text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <strong className="text-foreground font-semibold">{deck.dueCount}</strong> pendentes
                    </span>
                    <span className="flex items-center gap-1">
                      <strong className="text-foreground font-semibold">{deck.newCount}</strong> novos
                    </span>
                  </div>
                </Link>
              </Card>
            ))}
          </section>
        )}
      </div>

      <DeckDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(value) => createDeck(db, value).then(() => undefined)}
      />
    </SpaceLayout>
  );
}
