import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DeckDialog } from "@/components/deck-dialog";

describe("DeckDialog", () => {
  it("exposes its supporting copy as the dialog description", () => {
    render(<DeckDialog open onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByRole("dialog", { name: "Novo baralho" })).toHaveAccessibleDescription(
      "Organize cartões do mesmo assunto em um só lugar.",
    );
  });

  it("validates and submits a new deck", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<DeckDialog open onClose={vi.fn()} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Salvar baralho" }));
    expect(screen.getByText("Informe o nome do baralho.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Nome"), "Biologia");
    await user.type(screen.getByLabelText("Descrição (opcional)"), "Células e genética");
    await user.click(screen.getByRole("button", { name: "Salvar baralho" }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "Biologia", description: "Células e genética" });
  });
});
