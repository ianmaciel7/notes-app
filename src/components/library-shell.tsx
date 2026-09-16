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

export interface LibraryShellProps {
  decks?: DeckSummary[];
  dueCount?: number;
  newCount?: number;
  goalsProgress?: StudyGoalsProgress;
  onCreateDeck?: () => void;
}

export function LibraryShell(props: LibraryShellProps = {}) {
  useRevisaWebMcp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [now] = useState(() => Date.now());

  const isControlled = props.decks !== undefined;

  const dbDecks = useLiveQuery(() => db.decks.orderBy("updatedAt").reverse().toArray(), [], isControlled ? [] : undefined);
  const dbCards = useLiveQuery(() => db.cards.toArray(), [], isControlled ? [] : undefined);
  const dbSchedules = useLiveQuery(() => db.schedules.toArray(), [], isControlled ? [] : undefined);
  const dbReviewLogs = useLiveQuery(() => db.reviewLogs.toArray(), [], isControlled ? [] : undefined);
  const dbSettings = useLiveQuery(() => db.settings.get("global"), [], isControlled ? undefined : undefined);

  const querySummaries = useMemo(() => {
    if (isControlled) return props.decks ?? [];
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
  }, [isControlled, props.decks, dbDecks, dbCards, dbSchedules, now]);

  const queryGoalsProgress = useMemo(() => {
    if (isControlled) return props.goalsProgress;
    return calculateGoalsProgress(dbReviewLogs || [], dbSettings, new Date(now));
  }, [isControlled, props.goalsProgress, dbReviewLogs, dbSettings, now]);

  const decks = props.decks ?? querySummaries;
  const dueCount = props.dueCount ?? decks.reduce((total, deck) => total + deck.dueCount, 0);
  const newCount = props.newCount ?? decks.reduce((total, deck) => total + deck.newCount, 0);
  const goalsProgress = props.goalsProgress ?? queryGoalsProgress;
  const handleCreateDeck = props.onCreateDeck ?? (() => setDialogOpen(true));

  return (
    <SpaceLayout active="decks">
      <div className="content-wrap space-y-6">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Biblioteca</p>
            <h1>Seus baralhos</h1>
            <p className="page-subtitle">Escolha um assunto e continue de onde parou.</p>
          </div>
          <Button type="button" onClick={handleCreateDeck}>
            <Plus size={18} />Criar baralho
          </Button>
        </section>

        {goalsProgress ? (
          <section>
            <GoalsCard goalsProgress={goalsProgress} />
          </section>
        ) : null}

        <section className="study-overview" aria-label="Resumo de estudos">
          <div className="overview-intro">
            <span className="overview-icon"><BookOpen size={20} /></span>
            <div>
              <strong>Pronto para hoje</strong>
              <span>{dueCount + newCount === 0 ? "Tudo em dia" : "Cartões aguardando revisão"}</span>
            </div>
          </div>
          <dl className="overview-stats">
            <div><dt>Pendentes</dt><dd>{dueCount}</dd></div>
            <div><dt>Novos</dt><dd>{newCount}</dd></div>
          </dl>
        </section>

        {decks.length === 0 ? (
          <Empty className="empty-state">
            <EmptyMedia className="empty-icon" variant="default">
              <Library size={28} />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Sua biblioteca está vazia</EmptyTitle>
              <EmptyDescription>Crie um baralho para começar a transformar conteúdo em memória.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="secondary" type="button" onClick={handleCreateDeck}><Plus />Criar baralho</Button>
            </EmptyContent>
          </Empty>
        ) : (
          <section className="deck-grid" aria-label="Baralhos">
            {decks.map((deck) => (
              <Card className="deck-card" key={deck.id}>
                <Link className="deck-card-link" href={`/decks/${deck.id}`}>
                  <div className="deck-card-top">
                    <span className="deck-icon"><BookOpen size={19} /></span>
                    <ChevronRight size={18} className="deck-arrow" />
                  </div>
                  <div>
                    <h2>{deck.name}</h2>
                    <p>{deck.description || `${deck.cardCount} cartões`}</p>
                  </div>
                  <div className="deck-meta">
                    <span><strong>{deck.dueCount}</strong> pendentes</span>
                    <span><strong>{deck.newCount}</strong> novos</span>
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
