import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { StudyCard } from "@/components/study-card";

const card = {
  id: "card-1",
  deckId: "deck-1",
  front: "Qual é a capital do Brasil?",
  back: "Brasília",
  createdAt: "2026-09-15T12:00:00.000Z",
  updatedAt: "2026-09-15T12:00:00.000Z",
};

describe("StudyCard", () => {
  it("reveals the answer before accepting a rating", async () => {
    const onRate = vi.fn();
    const user = userEvent.setup();

    render(<StudyCard card={card} now={new Date("2026-09-15T12:00:00.000Z")} onRate={onRate} />);

    expect(screen.getByText(card.front)).toBeInTheDocument();
    expect(screen.queryByText(card.back)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Mostrar resposta" }));
    expect(screen.getByText(card.back)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Bom/ }));
    expect(onRate).toHaveBeenCalledWith("good");
  });
});
