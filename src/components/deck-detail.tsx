"use client";

import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowLeft,
  BookOpenCheck,
  Edit3,
  Plus,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { CardDialog } from "@/components/card-dialog";
import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";
import { DeckDialog } from "@/components/deck-dialog";
import { SpaceLayout } from "@/components/space-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { createCard, db, deleteCard, deleteDeck, updateCard, updateDeck } from "@/data/db";
import type { CardRecord, SessionGoal } from "@/data/types";

interface DeckDetailProps {
  deckId: string;
}

export function DeckDetail({ deckId }: DeckDetailProps) {
  const router = useRouter();
  const [deckDialogOpen, setDeckDialogOpen] = useState(false);
  const [cardDialog, setCardDialog] = useState<CardRecord | "new" | null>(null);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [deleteDeckOpen, setDeleteDeckOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<CardRecord | null>(null);
  const [now] = useState(() => Date.now());
  const deck = useLiveQuery(() => db.decks.get(deckId), [deckId]);
  const cards = useLiveQuery(() => db.cards.where("deckId").equals(deckId).sortBy("createdAt"), [deckId]);
  const schedules = useLiveQuery(async () => {
    const deckCards = await db.cards.where("deckId").equals(deckId).primaryKeys();
    return deckCards.length ? db.schedules.where("cardId").anyOf(deckCards).toArray() : [];
  }, [deckId]);

  const scheduleByCard = useMemo(() => new Map((schedules ?? []).map((item) => [item.cardId, item])), [schedules]);
  const availableCount = (cards ?? []).filter((card) => {
    const schedule = scheduleByCard.get(card.id);
    return !schedule || new Date(schedule.due).getTime() <= now;
  }).length;

  const mistakesCount = (cards ?? []).filter((card) => {
    const schedule = scheduleByCard.get(card.id);
    return (schedule?.lapses ?? 0) > 0;
  }).length;

  if (deck === undefined || cards === undefined) {
    return (
      <SpaceLayout active="decks">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 text-center text-muted-foreground text-sm">
          Carregando baralho...
        </div>
      </SpaceLayout>
    );
  }

  if (!deck) {
    return (
      <SpaceLayout active="decks">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          <Link
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground no-underline"
            href="/"
          >
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </Link>
          <Empty className="min-h-[300px] border border-dashed border-border rounded-xl">
            <EmptyHeader>
              <EmptyTitle>Baralho não encontrado</EmptyTitle>
              <EmptyDescription>Ele pode ter sido removido deste dispositivo.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </SpaceLayout>
    );
  }

  async function handleDeleteDeck() {
    await deleteDeck(db, deckId);
    router.push("/");
  }

  function startSession(goal: SessionGoal) {
    router.push(`/study/${deckId}?meta=${goal}`);
  }

  return (
    <SpaceLayout active="decks">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-8">
        <Link
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground no-underline"
          href="/"
        >
          <ArrowLeft size={16} />
          <span>Todos os baralhos</span>
        </Link>

        {/* Deck Header */}
        <section className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-2">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Baralho</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{deck.name}</h1>
            <p className="text-sm text-muted-foreground">
              {deck.description || `${cards.length} ${cards.length === 1 ? "cartão" : "cartões"}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    aria-label="Editar baralho"
                    onClick={() => setDeckDialogOpen(true)}
                  />
                }
              >
                <Edit3 size={16} />
              </TooltipTrigger>
              <TooltipContent>Editar baralho</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="destructive"
                    size="icon"
                    type="button"
                    aria-label="Excluir baralho"
                    onClick={() => setDeleteDeckOpen(true)}
                  />
                }
              >
                <Trash2 size={16} />
              </TooltipTrigger>
              <TooltipContent>Excluir baralho</TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* Study Callout */}
        <section className="p-4 sm:p-5 border border-border rounded-xl bg-secondary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0">
              <BookOpenCheck size={20} />
            </span>
            <div className="grid gap-0.5">
              <strong className="text-sm font-semibold text-foreground">
                {availableCount} para estudar
              </strong>
              <span className="text-xs text-muted-foreground">
                {availableCount ? "Escolha uma meta e comece sua sessão." : "Você está em dia neste baralho."}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {mistakesCount > 0 ? (
              <Button
                variant="outline"
                type="button"
                render={<Link href={`/study/${deckId}?mode=mistakes`} />}
                nativeButton={false}
                className="gap-1.5 text-xs text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
              >
                <RotateCcw size={14} />
                <span>Praticar erros ({mistakesCount})</span>
              </Button>
            ) : null}
            <Button
              type="button"
              disabled={availableCount === 0}
              onClick={() => setGoalDialogOpen(true)}
              className="gap-2"
            >
              <Play size={16} fill="currentColor" />
              <span>Estudar agora</span>
            </Button>
          </div>
        </section>

        {/* Cards Section Header */}
        <section className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Cartões</h2>
            <span className="text-xs text-muted-foreground">{cards.length} no total</span>
          </div>
          <Button variant="secondary" type="button" onClick={() => setCardDialog("new")} className="gap-2">
            <Plus size={16} />
            <span>Novo cartão</span>
          </Button>
        </section>

        {/* Cards List or Empty State */}
        {cards.length === 0 ? (
          <Empty className="min-h-[240px] border border-dashed border-border rounded-xl">
            <EmptyHeader>
              <EmptyTitle>Nenhum cartão ainda</EmptyTitle>
              <EmptyDescription>Adicione a primeira pergunta deste baralho.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="secondary" type="button" onClick={() => setCardDialog("new")} className="gap-2">
                <Plus size={16} />
                <span>Novo cartão</span>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="divide-y divide-border">
            {cards.map((card) => {
              const schedule = scheduleByCard.get(card.id);
              const status = !schedule
                ? "Novo"
                : new Date(schedule.due).getTime() <= now
                ? "Pendente"
                : `Em ${new Date(schedule.due).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`;
              const lapses = schedule?.lapses ?? 0;
              return (
                <article
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  key={card.id}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{status}</Badge>
                      {lapses > 0 ? (
                        <Badge
                          variant="outline"
                          className="text-[11px] text-amber-700 dark:text-amber-400 border-amber-500/30 bg-amber-500/10"
                        >
                          {lapses} {lapses === 1 ? "lapso" : "lapsos"}
                        </Badge>
                      ) : null}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground whitespace-pre-wrap">{card.front}</h3>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-2">{card.back}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            aria-label="Editar cartão"
                            onClick={() => setCardDialog(card)}
                          />
                        }
                      >
                        <Edit3 size={15} />
                      </TooltipTrigger>
                      <TooltipContent>Editar cartão</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            variant="destructive"
                            size="icon"
                            type="button"
                            aria-label="Excluir cartão"
                            onClick={() => setCardToDelete(card)}
                          />
                        }
                      >
                        <Trash2 size={15} />
                      </TooltipTrigger>
                      <TooltipContent>Excluir cartão</TooltipContent>
                    </Tooltip>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <DeckDialog
        open={deckDialogOpen}
        initial={{ name: deck.name, description: deck.description }}
        onClose={() => setDeckDialogOpen(false)}
        onSubmit={(value) => updateDeck(db, deckId, value)}
      />
      <CardDialog
        open={cardDialog !== null}
        initial={cardDialog && cardDialog !== "new" ? { front: cardDialog.front, back: cardDialog.back } : undefined}
        onClose={() => setCardDialog(null)}
        onSubmit={(value) =>
          cardDialog && cardDialog !== "new"
            ? updateCard(db, cardDialog.id, value)
            : createCard(db, { deckId, ...value }).then(() => undefined)
        }
      />
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-6">
          <DialogHeader className="pb-2">
            <DialogTitle>Meta da sessão</DialogTitle>
            <DialogDescription>{`${availableCount} cartões estão disponíveis agora.`}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            {[10, 20, 50, "all"].map((goal) => (
              <Button
                variant="outline"
                className="min-h-20 flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-secondary"
                type="button"
                key={goal}
                onClick={() => startSession(goal as SessionGoal)}
              >
                <strong className="text-lg font-bold">{goal === "all" ? "Todos" : goal}</strong>
                <span className="text-[11px] text-muted-foreground">{goal === "all" ? "Sem limite" : "cartões"}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmAlertDialog
        open={deleteDeckOpen}
        title="Excluir baralho?"
        description={`“${deck.name}” e todos os seus cartões serão excluídos permanentemente deste dispositivo.`}
        confirmLabel="Excluir baralho"
        onOpenChange={setDeleteDeckOpen}
        onConfirm={handleDeleteDeck}
      />
      <ConfirmAlertDialog
        open={cardToDelete !== null}
        title="Excluir cartão?"
        description="Este cartão e seu histórico de revisão serão excluídos permanentemente."
        confirmLabel="Excluir cartão"
        onOpenChange={(open) => !open && setCardToDelete(null)}
        onConfirm={() => (cardToDelete ? deleteCard(db, cardToDelete.id) : undefined)}
      />
    </AppFrame>
  );
}
