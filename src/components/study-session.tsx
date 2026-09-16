"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertCircle, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { StudyCard } from "@/components/study-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { db, saveReview } from "@/data/db";
import { buildMistakeStudyQueue } from "@/domain/error-analysis";
import { scheduleReview } from "@/domain/scheduler";
import { buildStudyQueue } from "@/domain/study-queue";
import type { CardRecord, CardSchedule, DeckRecord, ReviewLogRecord, SessionGoal, StudyRating } from "@/data/types";
import { cn } from "@/lib/utils";

export interface StudySessionProps extends React.ComponentProps<"div"> {
  deckId: string;
}

function parseGoal(value: string | null): SessionGoal {
  if (value === "all") return "all";
  const numeric = Number(value);
  return numeric === 10 || numeric === 20 || numeric === 50 ? numeric : 20;
}

export function StudySession({ deckId, className, ...props }: StudySessionProps) {
  const searchParams = useSearchParams();
  const goal = parseGoal(searchParams.get("meta"));
  const isMistakesMode = searchParams.get("mode") === "mistakes" || deckId === "mistakes";
  const isGlobalMistakes = deckId === "mistakes";

  const deck = useLiveQuery(async () => {
    if (isGlobalMistakes) {
      return {
        id: "mistakes",
        name: "Praticar Questões Erradas",
        description: "Revisão focada em cartões com falhas e alta dificuldade.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } satisfies DeckRecord;
    }
    return db.decks.get(deckId);
  }, [deckId, isGlobalMistakes]);

  const cards = useLiveQuery(async () => {
    if (isGlobalMistakes) {
      return db.cards.toArray();
    }
    return db.cards.where("deckId").equals(deckId).toArray();
  }, [deckId, isGlobalMistakes]);

  const schedules = useLiveQuery(async () => {
    if (isGlobalMistakes) {
      return db.schedules.toArray();
    }
    const ids = await db.cards.where("deckId").equals(deckId).primaryKeys();
    return ids.length ? db.schedules.where("cardId").anyOf(ids).toArray() : [];
  }, [deckId, isGlobalMistakes]);

  const reviewLogs = useLiveQuery(async () => {
    if (isGlobalMistakes) {
      return db.reviewLogs.toArray();
    }
    const ids = await db.cards.where("deckId").equals(deckId).primaryKeys();
    return ids.length ? db.reviewLogs.where("cardId").anyOf(ids).toArray() : [];
  }, [deckId, isGlobalMistakes]);

  if (deck === undefined || cards === undefined || schedules === undefined || reviewLogs === undefined) {
    return (
      <div className={cn("min-h-screen p-6 bg-background flex flex-col items-center justify-center text-muted-foreground text-sm", className)} {...props}>
        Preparando sua sessão...
      </div>
    );
  }

  if (!deck) {
    return (
      <div className={cn("min-h-screen p-6 bg-background flex flex-col items-center justify-center space-y-4", className)} {...props}>
        <Link
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground no-underline"
          href="/"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Baralho não encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <StudySessionRunner
      key={`${deckId}:${goal}:${isMistakesMode}`}
      deck={deck}
      cards={cards}
      schedules={schedules}
      reviewLogs={reviewLogs}
      goal={goal}
      isMistakesMode={isMistakesMode}
      isGlobalMistakes={isGlobalMistakes}
      className={className}
      {...props}
    />
  );
}

function StudySessionRunner({
  deck,
  cards,
  schedules,
  reviewLogs,
  goal,
  isMistakesMode,
  isGlobalMistakes,
  className,
  ...props
}: {
  deck: DeckRecord;
  cards: CardRecord[];
  schedules: CardSchedule[];
  reviewLogs: ReviewLogRecord[];
  goal: SessionGoal;
  isMistakesMode: boolean;
  isGlobalMistakes: boolean;
} & React.ComponentProps<"div">) {
  const [startedAt] = useState(() => new Date());
  const [queue] = useState(() => {
    if (isMistakesMode) {
      return buildMistakeStudyQueue(cards, schedules, reviewLogs, goal);
    }
    return buildStudyQueue(cards, schedules, startedAt, goal);
  });

  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [ratings, setRatings] = useState<Record<StudyRating, number>>({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });

  const scheduleByCard = useMemo(
    () => new Map(schedules.map((item) => [item.cardId, item])),
    [schedules],
  );

  const current = queue[index];

  const handleRate = useCallback(
    async (rating: StudyRating) => {
      if (!current || savingRef.current) return;
      savingRef.current = true;
      setSaving(true);
      try {
        const result = scheduleReview(
          current.id,
          scheduleByCard.get(current.id),
          rating,
          new Date(),
        );
        await saveReview(db, result.schedule, result.log);
        setRatings((value) => ({ ...value, [rating]: value[rating] + 1 }));
        setIndex((value) => value + 1);
      } finally {
        savingRef.current = false;
        setSaving(false);
      }
    },
    [current, scheduleByCard],
  );

  const backUrl = isGlobalMistakes ? "/analytics" : `/decks/${deck.id}`;

  if (!current) {
    const studied = Object.values(ratings).reduce((sum, value) => sum + value, 0);
    return (
      <div className={cn("min-h-screen p-6 bg-background flex flex-col justify-center items-center", className)} {...props}>
        <div className="w-full max-w-xl mx-auto text-center space-y-6">
          <span className="w-16 h-16 mx-auto rounded-2xl bg-secondary text-primary flex items-center justify-center">
            {isMistakesMode && studied === 0 ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
          </span>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              {isMistakesMode ? "Prática de erros" : "Sessão concluída"}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {studied
                ? `${studied} ${studied === 1 ? "cartão revisado" : "cartões revisados"}`
                : isMistakesMode
                ? "Nenhuma questão com erro encontrada"
                : "Tudo em dia"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {studied
                ? "Seu progresso e revisões foram salvos com sucesso."
                : isMistakesMode
                ? "Você não possui cartões pendentes de correção no momento."
                : "Não há cartões disponíveis para esta sessão."}
            </p>
          </div>

          {studied ? (
            <dl className="my-6 py-4 border-y border-border grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <dt className="text-xs text-muted-foreground font-medium">Novamente</dt>
                <dd className="text-2xl font-bold text-destructive mt-1">{ratings.again}</dd>
              </div>
              <div className="text-center border-l border-border">
                <dt className="text-xs text-muted-foreground font-medium">Difícil</dt>
                <dd className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-1">{ratings.hard}</dd>
              </div>
              <div className="text-center border-l border-border">
                <dt className="text-xs text-muted-foreground font-medium">Bom</dt>
                <dd className="text-2xl font-bold text-primary mt-1">{ratings.good}</dd>
              </div>
              <div className="text-center border-l border-border">
                <dt className="text-xs text-muted-foreground font-medium">Fácil</dt>
                <dd className="text-2xl font-bold text-secondary-foreground mt-1">{ratings.easy}</dd>
              </div>
            </dl>
          ) : null}

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button render={<Link href={backUrl} />} nativeButton={false} variant="secondary" className="gap-2">
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </Button>
            {isMistakesMode ? (
              <Button
                render={<Link href={isGlobalMistakes ? "/study/mistakes" : `/study/${deck.id}?mode=mistakes`} />}
                nativeButton={false}
                className="gap-2"
              >
                <RotateCcw size={16} />
                <span>Revisar novamente</span>
              </Button>
            ) : (
              <Button render={<Link href={`/study/${deck.id}?meta=${goal}`} />} nativeButton={false} className="gap-2">
                <RotateCcw size={16} />
                <span>Nova sessão</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen p-4 sm:p-6 lg:p-8 bg-background flex flex-col justify-center", className)} {...props}>
      {/* Session Progress Header */}
      <header className="w-full max-w-3xl mx-auto mb-6 grid grid-cols-[40px_1fr] sm:grid-cols-[40px_1fr_180px] gap-4 items-center">
        <Button
          render={<Link href={backUrl} />}
          nativeButton={false}
          variant="outline"
          size="icon"
          aria-label="Sair da sessão"
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="grid gap-0.5">
          <strong className="text-sm font-semibold text-foreground">
            {deck.name} {isMistakesMode && !isGlobalMistakes ? "(Erros)" : ""}
          </strong>
          <span className="text-xs text-muted-foreground">
            {index + 1} de {queue.length}
          </span>
        </div>
        <Progress
          className="col-span-2 sm:col-span-1 h-2 bg-muted rounded-full"
          value={queue.length ? (index / queue.length) * 100 : 0}
          aria-label={`${index} de ${queue.length} concluídos`}
        />
      </header>

      {/* Flashcard Area */}
      <StudyCard
        key={current.id}
        card={current}
        schedule={scheduleByCard.get(current.id)}
        disabled={saving}
        onRate={handleRate}
      />
    </div>
  );
}
