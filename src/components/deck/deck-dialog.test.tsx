import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DeckDialog } from "@/components/deck/deck-dialog";

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

  it("populates initial values in edit mode and submits updates", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <DeckDialog
        open
        initial={{ name: "História", description: "Idade Média" }}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Editar baralho" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toHaveValue("História");
    expect(screen.getByLabelText("Descrição (opcional)")).toHaveValue("Idade Média");

    await user.clear(screen.getByLabelText("Nome"));
    await user.type(screen.getByLabelText("Nome"), "História Geral");
    await user.click(screen.getByRole("button", { name: "Salvar baralho" }));

    expect(onSubmit).toHaveBeenCalledWith({ name: "História Geral", description: "Idade Média" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("displays error message when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Falha ao salvar"));
    const user = userEvent.setup();

    render(<DeckDialog open onClose={vi.fn()} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Nome"), "Química");
    await user.click(screen.getByRole("button", { name: "Salvar baralho" }));

    expect(await screen.findByText("Falha ao salvar")).toBeInTheDocument();
  });

  it("calls onClose when clicking Cancelar", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<DeckDialog open onClose={onClose} onSubmit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
