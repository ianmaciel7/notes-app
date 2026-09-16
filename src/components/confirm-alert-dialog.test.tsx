import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ConfirmAlertDialog } from "@/components/confirm-alert-dialog";

describe("ConfirmAlertDialog", () => {
  it("runs a destructive action only after explicit confirmation", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <ConfirmAlertDialog
        open
        title="Excluir baralho?"
        description="Todos os cartões também serão excluídos."
        confirmLabel="Excluir baralho"
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole("alertdialog", { name: "Excluir baralho?" })).toHaveAccessibleDescription(
      "Todos os cartões também serão excluídos.",
    );
    expect(onConfirm).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Excluir baralho" }));

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("keeps the dialog open and reports a failed action", async () => {
    const user = userEvent.setup();

    render(
      <ConfirmAlertDialog
        open
        title="Excluir baralho?"
        description="Todos os cartões também serão excluídos."
        confirmLabel="Excluir baralho"
        onOpenChange={vi.fn()}
        onConfirm={() => Promise.reject(new Error("Falha ao excluir."))}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Excluir baralho" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Falha ao excluir.");
    expect(screen.getByRole("alertdialog", { name: "Excluir baralho?" })).toBeInTheDocument();
  });
});
