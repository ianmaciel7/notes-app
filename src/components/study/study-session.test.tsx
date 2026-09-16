import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { StudySession } from "@/components/study/study-session";
import * as dbModule from "@/data/db";
import type { CardRecord, DeckRecord } from "@/data/types";

const sampleDeck: DeckRecord = {
  id: "deck-123",
  name: "Direito Constitucional",
  description: "Conceitos fundamentais",
  createdAt: "2026-09-15T12:00:00.000Z",
  updatedAt: "2026-09-15T12:00:00.000Z",
};

const sampleCard: CardRecord = {
  id: "card-1",
  deckId: "deck-123",
  type: "anki",
  front: "O que é o princípio da legalidade?",
  back: "Ninguém será obrigado a fazer algo senão em virtude de lei.",
  createdAt: "2026-09-15T12:00:00.000Z",
  updatedAt: "2026-09-15T12:00:00.000Z",
};

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (param: string) => (param === "mode" ? null : null),
  }),
}));

vi.mock("dexie-react-hooks", () => ({
  useLiveQuery: (querier: () => unknown) => {
    const fnStr = querier.toString();
    if (fnStr.includes("schedules")) {
      return [];
    }
    if (fnStr.includes("reviewLogs")) {
      return [];
    }
    if (fnStr.includes("cards")) {
      return [sampleCard];
    }
    if (fnStr.includes("decks") || fnStr.includes("isGlobalMistakes")) {
      return sampleDeck;
    }
    return undefined;
  },
}));

describe("StudySession", () => {
  beforeEach(() => {
    vi.spyOn(dbModule, "saveReview").mockResolvedValue(undefined as unknown as void);
  });

  it("renders study session card and progresses through review", async () => {
    const user = userEvent.setup();
    render(<StudySession deckId="deck-123" />);

    // Header with deck name
    expect(screen.getByText("Direito Constitucional")).toBeInTheDocument();
    expect(screen.getByText("1 de 1")).toBeInTheDocument();

    // Front of the card
    expect(screen.getByText(sampleCard.front)).toBeInTheDocument();

    // Click show answer
    await user.click(screen.getByRole("button", { name: "Mostrar resposta" }));
    expect(screen.getByText(sampleCard.back)).toBeInTheDocument();

    // Click rating "Bom"
    await user.click(screen.getByRole("button", { name: /Bom/ }));

    // Session completion screen
    expect(await screen.findByRole("heading", { name: /1 cartão revisado/i })).toBeInTheDocument();
    expect(screen.getByText("Seu progresso e revisões foram salvos com sucesso.")).toBeInTheDocument();
  });
});
