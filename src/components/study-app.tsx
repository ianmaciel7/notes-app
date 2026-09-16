"use client";

import { useCallback, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { StudyCard } from "@/components/study-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { db, saveReview } from "@/lib/db";
import { scheduleReview } from "@/lib/scheduler";
import { buildStudyQueue } from "@/lib/study-queue";
import type { CardRecord, CardSchedule, DeckRecord, SessionGoal, StudyRating } from "@/lib/types";

interface StudyAppProps { deckId: string; }

function parseGoal(value: string | null): SessionGoal {
  if (value === "all") return "all";
  const numeric = Number(value);
  return numeric === 10 || numeric === 20 || numeric === 50 ? numeric : 20;
}

export function StudyApp({ deckId }: StudyAppProps) {
  const goal = parseGoal(useSearchParams().get("meta"));
  const deck = useLiveQuery(() => db.decks.get(deckId), [deckId]);
  const cards = useLiveQuery(() => db.cards.where("deckId").equals(deckId).toArray(), [deckId]);
  const schedules = useLiveQuery(async () => {
    const ids = await db.cards.where("deckId").equals(deckId).primaryKeys();
    return ids.length ? db.schedules.where("cardId").anyOf(ids).toArray() : [];
  }, [deckId]);

  if (deck === undefined || cards === undefined || schedules === undefined) {
    return <div className="study-layout"><div className="loading-line">Preparando sua sessão...</div></div>;
  }

  if (!deck) {
    return <div className="study-layout"><Link className="back-link" href="/"><ArrowLeft size={17} />Voltar</Link><div className="session-summary"><h1>Baralho não encontrado</h1></div></div>;
  }

  return <StudySession key={`${deckId}:${goal}`} deck={deck} cards={cards} schedules={schedules} goal={goal} />;
}

function StudySession({ deck, cards, schedules, goal }: { deck: DeckRecord; cards: CardRecord[]; schedules: CardSchedule[]; goal: SessionGoal }) {
  const [startedAt] = useState(() => new Date());
  const [queue] = useState(() => buildStudyQueue(cards, schedules, startedAt, goal));
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<StudyRating, number>>({ again: 0, hard: 0, good: 0, easy: 0 });
  const scheduleByCard = useMemo(() => new Map(schedules.map((item) => [item.cardId, item])), [schedules]);
  const current = queue[index];

  const handleRate = useCallback(async (rating: StudyRating) => {
    if (!current) return;
    const result = scheduleReview(current.id, scheduleByCard.get(current.id), rating, new Date());
    await saveReview(db, result.schedule, result.log);
    setRatings((value) => ({ ...value, [rating]: value[rating] + 1 }));
    setIndex((value) => value + 1);
  }, [current, scheduleByCard]);

  if (!current) {
    const studied = Object.values(ratings).reduce((sum, value) => sum + value, 0);
    return (
      <div className="study-layout">
        <div className="session-summary">
          <span className="summary-icon"><CheckCircle2 size={30} /></span>
          <p className="eyebrow">Sessão concluída</p>
          <h1>{studied ? `${studied} ${studied === 1 ? "cartão revisado" : "cartões revisados"}` : "Tudo em dia"}</h1>
          <p>{studied ? "Seu progresso foi salvo neste dispositivo." : "Não há cartões disponíveis para esta sessão."}</p>
          {studied ? <dl className="summary-stats"><div><dt>Novamente</dt><dd>{ratings.again}</dd></div><div><dt>Difícil</dt><dd>{ratings.hard}</dd></div><div><dt>Bom</dt><dd>{ratings.good}</dd></div><div><dt>Fácil</dt><dd>{ratings.easy}</dd></div></dl> : null}
          <div className="summary-actions"><Button render={<Link href={`/baralhos/${deck.id}`} />} variant="secondary"><ArrowLeft />Voltar ao baralho</Button><Button render={<Link href={`/estudar/${deck.id}?meta=${goal}`} />}><RotateCcw />Nova sessão</Button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="study-layout">
      <header className="study-header">
        <Button render={<Link href={`/baralhos/${deck.id}`} />} variant="outline" size="icon-lg" aria-label="Sair da sessão"><ArrowLeft /></Button>
        <div><strong>{deck.name}</strong><span>{index + 1} de {queue.length}</span></div>
        <Progress className="session-progress" value={queue.length ? (index / queue.length) * 100 : 0} aria-label={`${index} de ${queue.length} concluídos`} />
      </header>
      <StudyCard key={current.id} card={current} schedule={scheduleByCard.get(current.id)} onRate={handleRate} />
    </div>
  );
}
