"use client";

import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, BookOpenCheck, Edit3, Plus, Play, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AppFrame } from "@/components/app-frame";
import { CardDialog } from "@/components/card-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DeckDialog } from "@/components/deck-dialog";
import { Modal } from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { createCard, db, deleteCard, deleteDeck, updateCard, updateDeck } from "@/data/db";
import type { CardRecord, SessionGoal } from "@/data/types";

interface DeckAppProps { deckId: string; }

export function DeckApp({ deckId }: DeckAppProps) {
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

  if (deck === undefined || cards === undefined) {
    return <AppFrame active="decks"><div className="content-wrap"><div className="loading-line">Carregando baralho...</div></div></AppFrame>;
  }

  if (!deck) {
    return <AppFrame active="decks"><div className="content-wrap"><Link className="back-link" href="/"><ArrowLeft size={17} />Voltar</Link><section className="empty-state"><h1>Baralho não encontrado</h1><p>Ele pode ter sido removido deste dispositivo.</p></section></div></AppFrame>;
  }

  async function handleDeleteDeck() {
    await deleteDeck(db, deckId);
    router.push("/");
  }

  function startSession(goal: SessionGoal) {
    router.push(`/study/${deckId}?meta=${goal}`);
  }

  return (
    <AppFrame active="decks">
      <div className="content-wrap detail-page">
        <Link className="back-link" href="/"><ArrowLeft size={17} />Todos os baralhos</Link>
        <section className="detail-heading">
          <div>
            <p className="eyebrow">Baralho</p>
            <h1>{deck.name}</h1>
            <p>{deck.description || `${cards.length} ${cards.length === 1 ? "cartão" : "cartões"}`}</p>
          </div>
          <div className="detail-actions">
            <Tooltip><TooltipTrigger render={<Button variant="outline" size="icon-lg" type="button" aria-label="Editar baralho" onClick={() => setDeckDialogOpen(true)} />}><Edit3 /></TooltipTrigger><TooltipContent>Editar baralho</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger render={<Button variant="destructive" size="icon-lg" type="button" aria-label="Excluir baralho" onClick={() => setDeleteDeckOpen(true)} />}><Trash2 /></TooltipTrigger><TooltipContent>Excluir baralho</TooltipContent></Tooltip>
          </div>
        </section>

        <section className="study-callout">
          <div className="study-callout-copy">
            <span className="overview-icon"><BookOpenCheck size={20} /></span>
            <div><strong>{availableCount} para estudar</strong><span>{availableCount ? "Escolha uma meta e comece sua sessão." : "Você está em dia neste baralho."}</span></div>
          </div>
          <Button type="button" disabled={availableCount === 0} onClick={() => setGoalDialogOpen(true)}><Play fill="currentColor" />Estudar agora</Button>
        </section>

        <section className="section-heading">
          <div><h2>Cartões</h2><span>{cards.length} no total</span></div>
          <Button variant="secondary" type="button" onClick={() => setCardDialog("new")}><Plus />Novo cartão</Button>
        </section>

        {cards.length === 0 ? (
          <section className="empty-state compact-empty"><h2>Nenhum cartão ainda</h2><p>Adicione a primeira pergunta deste baralho.</p><Button variant="secondary" type="button" onClick={() => setCardDialog("new")}><Plus />Novo cartão</Button></section>
        ) : (
          <div className="card-list">
            {cards.map((card) => {
              const schedule = scheduleByCard.get(card.id);
              const status = !schedule ? "Novo" : new Date(schedule.due).getTime() <= now ? "Pendente" : `Em ${new Date(schedule.due).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`;
              return (
                <article className="card-row" key={card.id}>
                  <div className="card-copy"><Badge variant="secondary">{status}</Badge><h3>{card.front}</h3><p>{card.back}</p></div>
                  <div className="card-actions">
                    <Tooltip><TooltipTrigger render={<Button variant="outline" size="icon-lg" type="button" aria-label="Editar cartão" onClick={() => setCardDialog(card)} />}><Edit3 /></TooltipTrigger><TooltipContent>Editar cartão</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger render={<Button variant="destructive" size="icon-lg" type="button" aria-label="Excluir cartão" onClick={() => setCardToDelete(card)} />}><Trash2 /></TooltipTrigger><TooltipContent>Excluir cartão</TooltipContent></Tooltip>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <DeckDialog open={deckDialogOpen} initial={{ name: deck.name, description: deck.description }} onClose={() => setDeckDialogOpen(false)} onSubmit={(value) => updateDeck(db, deckId, value)} />
      <CardDialog
        open={cardDialog !== null}
        initial={cardDialog && cardDialog !== "new" ? { front: cardDialog.front, back: cardDialog.back } : undefined}
        onClose={() => setCardDialog(null)}
        onSubmit={(value) => cardDialog && cardDialog !== "new" ? updateCard(db, cardDialog.id, value) : createCard(db, { deckId, ...value }).then(() => undefined)}
      />
      <Modal open={goalDialogOpen} title="Meta da sessão" description={`${availableCount} cartões estão disponíveis agora.`} onClose={() => setGoalDialogOpen(false)}>
        <div className="goal-grid">
          {[10, 20, 50, "all"].map((goal) => (
            <Button variant="outline" className="goal-button" type="button" key={goal} onClick={() => startSession(goal as SessionGoal)}>
              <strong>{goal === "all" ? "Todos" : goal}</strong><span>{goal === "all" ? "Sem limite" : "cartões"}</span>
            </Button>
          ))}
        </div>
      </Modal>
      <ConfirmDialog
        open={deleteDeckOpen}
        title="Excluir baralho?"
        description={`“${deck.name}” e todos os seus cartões serão excluídos permanentemente deste dispositivo.`}
        confirmLabel="Excluir baralho"
        onOpenChange={setDeleteDeckOpen}
        onConfirm={handleDeleteDeck}
      />
      <ConfirmDialog
        open={cardToDelete !== null}
        title="Excluir cartão?"
        description="Este cartão e seu histórico de revisão serão excluídos permanentemente."
        confirmLabel="Excluir cartão"
        onOpenChange={(open) => !open && setCardToDelete(null)}
        onConfirm={() => cardToDelete ? deleteCard(db, cardToDelete.id) : undefined}
      />
    </AppFrame>
  );
}
