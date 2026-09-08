"use client";

import * as React from "react";

import { useWorkspace } from "@/components/space-controller";
import { Button } from "@/components/ui/button";
import {
  isFlashcardReviewEntity,
  selectDueFlashcards,
  type FlashcardReviewEntity,
} from "@/lib/srs/flashcard-review";
import type { FSRSRating } from "@/lib/srs/fsrs";

const ratingActions = [
  { label: "Again", rating: 1 },
  { label: "Hard", rating: 2 },
  { label: "Good", rating: 3 },
  { label: "Easy", rating: 4 },
] as const satisfies readonly { label: string; rating: FSRSRating }[];

function formatDueDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "No due date";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getReviewCount(card: FlashcardReviewEntity) {
  return card.srs?.repetitionCount ?? 0;
}

export function WorkspaceFlashcardReviewPanel() {
  const { createdEntities, ready, reviewFlashcard } = useWorkspace();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [showBack, setShowBack] = React.useState(false);
  const [pendingRating, setPendingRating] = React.useState<FSRSRating | null>(null);

  const allFlashcards = React.useMemo(
    () => createdEntities.filter(isFlashcardReviewEntity),
    [createdEntities],
  );
  const dueFlashcards = React.useMemo(
    () => selectDueFlashcards(createdEntities),
    [createdEntities],
  );
  const activeCard = React.useMemo(
    () => dueFlashcards.find((card) => card.id === activeId) ?? dueFlashcards[0] ?? null,
    [activeId, dueFlashcards],
  );

  React.useEffect(() => {
    if (!activeCard) {
      setActiveId(null);
      setShowBack(false);
      return;
    }
    if (activeId !== activeCard.id) {
      setActiveId(activeCard.id);
      setShowBack(false);
    }
  }, [activeCard, activeId]);

  async function recordReview(rating: FSRSRating) {
    if (!activeCard || typeof reviewFlashcard !== "function") return;
    setPendingRating(rating);
    const reviewed = await reviewFlashcard(activeCard.id, rating);
    setPendingRating(null);
    if (reviewed) setShowBack(false);
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-card">
      <div className="border-b border-border px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground tracking-normal">
              Review
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">Flashcards</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{dueFlashcards.length} due</span>
            <span className="text-border">/</span>
            <span>{allFlashcards.length} total</span>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-6 py-6">
        {!ready ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
            Loading local workspace data...
          </div>
        ) : !activeCard ? (
          <div className="rounded-lg border border-dashed border-border p-6">
            <h2 className="text-base font-medium text-foreground">No flashcards due</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              This panel is reading real Dexie entities. When flashcards are created or become due,
              they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid min-h-full gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <article className="flex min-h-[24rem] flex-col rounded-lg border border-border bg-background">
              <div className="border-b border-border px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{activeCard.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Due {formatDueDate(activeCard.srs.dueDate)}
                    </p>
                  </div>
                  <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                    {activeCard.cardType}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-5 p-5">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground tracking-normal">
                    Front
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-foreground">
                    {activeCard.front}
                  </p>
                </div>

                {showBack ? (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground tracking-normal">
                      Back
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-foreground">
                      {activeCard.back}
                    </p>
                  </div>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={() => setShowBack((visible) => !visible)}>
                    {showBack ? "Hide answer" : "Show answer"}
                  </Button>
                  {ratingActions.map((action) => (
                    <Button
                      key={action.rating}
                      variant={action.rating === 3 ? "default" : "secondary"}
                      disabled={!showBack || pendingRating !== null}
                      onClick={() => void recordReview(action.rating)}
                    >
                      {pendingRating === action.rating ? "Saving..." : action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </article>

            <aside className="rounded-lg border border-border bg-background p-4">
              <h3 className="text-sm font-medium text-foreground">Due queue</h3>
              <div className="mt-3 space-y-2">
                {dueFlashcards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className="flex w-full flex-col rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-muted"
                    data-active={card.id === activeCard.id || undefined}
                    onClick={() => {
                      setActiveId(card.id);
                      setShowBack(false);
                    }}
                  >
                    <span className="font-medium text-foreground">{card.title}</span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {getReviewCount(card)} reviews
                    </span>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
