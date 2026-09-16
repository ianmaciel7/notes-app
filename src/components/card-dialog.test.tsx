import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CardDialog } from "@/components/card-dialog";

describe("CardDialog", () => {
  it("renders new card dialog and submits values in anki format", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<CardDialog open onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.getByRole("dialog", { name: "Novo cartão" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Salvar cartão" }));
    expect(screen.getByText("Preencha a frente e o verso do cartão.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Frente"), "Pergunta 1");
    await user.type(screen.getByLabelText("Verso"), "Resposta 1");
    await user.click(screen.getByRole("button", { name: "Salvar cartão" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        front: "Pergunta 1",
        back: "Resposta 1",
        type: "anki",
      }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("renders with initial values for editing", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <CardDialog
        open
        initial={{ front: "Frente existente", back: "Verso existente", type: "anki" }}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Editar cartão" })).toBeInTheDocument();
    expect(screen.getByLabelText("Frente")).toHaveValue("Frente existente");
    expect(screen.getByLabelText("Verso")).toHaveValue("Verso existente");
  });

  it("creates a Readwise highlight card", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<CardDialog open onClose={onClose} onSubmit={onSubmit} />);

    // Switch to Readwise tab
    await user.click(screen.getByRole("tab", { name: /Readwise/ }));

    await user.type(screen.getByLabelText("Destaque / Citação"), "Trecho memorável");
    await user.type(screen.getByLabelText("Título da Obra"), "Livro");
    await user.type(screen.getByLabelText("Autor(a)"), "Autor");

    await user.click(screen.getByRole("button", { name: "Salvar cartão" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        front: "Trecho memorável",
        type: "readwise",
        sourceTitle: "Livro",
        sourceAuthor: "Autor",
      }),
    );
  });

  it("displays error message when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Erro ao salvar no banco"));
    const user = userEvent.setup();

    render(<CardDialog open onClose={vi.fn()} onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Frente"), "Frente");
    await user.type(screen.getByLabelText("Verso"), "Verso");
    await user.click(screen.getByRole("button", { name: "Salvar cartão" }));

    expect(await screen.findByText("Erro ao salvar no banco")).toBeInTheDocument();
  });

  it("calls onClose when clicking Cancelar", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<CardDialog open onClose={onClose} onSubmit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
