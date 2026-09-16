"use client";

import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { DeckDialog } from "@/components/deck-dialog";
import { LibraryShell, type DeckSummary } from "@/components/library-shell";
import { createDeck, db } from "@/lib/db";
import { useRevisaWebMcp } from "@/lib/webmcp";

export function LibraryApp() {
  useRevisaWebMcp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [now] = useState(() => Date.now());
  const decks = useLiveQuery(() => db.decks.orderBy("updatedAt").reverse().toArray(), []);
  const cards = useLiveQuery(() => db.cards.toArray(), []);
  const schedules = useLiveQuery(() => db.schedules.toArray(), []);

  const summaries = useMemo(() => {
    if (!decks || !cards || !schedules) return [];
    const scheduleByCard = new Map(schedules.map((schedule) => [schedule.cardId, schedule]));
    return decks.map<DeckSummary>((deck) => {
      const deckCards = cards.filter((card) => card.deckId === deck.id);
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
  }, [cards, decks, now, schedules]);

  const dueCount = summaries.reduce((total, deck) => total + deck.dueCount, 0);
  const newCount = summaries.reduce((total, deck) => total + deck.newCount, 0);

  return (
    <>
      <LibraryShell decks={summaries} dueCount={dueCount} newCount={newCount} onCreateDeck={() => setDialogOpen(true)} />
      <DeckDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={(value) => createDeck(db, value).then(() => undefined)} />
    </>
  );
}
