import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CardDialog } from "@/components/card-dialog";

describe("CardDialog", () => {
  it("renders new card dialog and submits values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<CardDialog open onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.getByRole("dialog", { name: "Novo cartão" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Salvar cartão" }));
    expect(screen.getByText("Preencha a frente e o verso do cartão.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Frente"), "O que é mitocôndria?");
    await user.type(screen.getByLabelText("Verso"), "Organela responsável pela respiração celular.");
    await user.click(screen.getByRole("button", { name: "Salvar cartão" }));

    expect(onSubmit).toHaveBeenCalledWith({
      front: "O que é mitocôndria?",
      back: "Organela responsável pela respiração celular.",
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("renders with initial values for editing", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <CardDialog
        open
        initial={{ front: "Frente existente", back: "Verso existente" }}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Editar cartão" })).toBeInTheDocument();
    expect(screen.getByLabelText("Frente")).toHaveValue("Frente existente");
    expect(screen.getByLabelText("Verso")).toHaveValue("Verso existente");
  });
});
