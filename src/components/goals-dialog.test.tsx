import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GoalsDialog } from "@/components/goals-dialog";

describe("GoalsDialog", () => {
  it("renders goals and allows submitting valid values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <GoalsDialog
        open
        dailyGoal={20}
        monthlyGoal={500}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Metas de estudo" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Meta diária/)).toHaveValue(20);
    expect(screen.getByLabelText(/Meta mensal/)).toHaveValue(500);

    const dailyInput = screen.getByLabelText(/Meta diária/);
    await user.clear(dailyInput);
    await user.type(dailyInput, "30");

    await user.click(screen.getByRole("button", { name: "Salvar metas" }));

    expect(onSubmit).toHaveBeenCalledWith({
      dailyCardGoal: 30,
      monthlyCardGoal: 500,
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("validates boundary values and displays error message", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <GoalsDialog
        open
        dailyGoal={20}
        monthlyGoal={500}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    const dailyInput = screen.getByLabelText(/Meta diária/);
    await user.clear(dailyInput);
    await user.type(dailyInput, "0");
    await user.click(screen.getByRole("button", { name: "Salvar metas" }));

    expect(screen.getByText("A meta diária deve ser entre 1 e 1.000 cartões.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("displays error message when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("Erro ao salvar"));
    const user = userEvent.setup();

    render(
      <GoalsDialog
        open
        dailyGoal={20}
        monthlyGoal={500}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Salvar metas" }));
    expect(await screen.findByText("Não foi possível salvar as metas. Tente novamente.")).toBeInTheDocument();
  });

  it("calls onClose when clicking Cancelar", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <GoalsDialog
        open
        dailyGoal={20}
        monthlyGoal={500}
        onClose={onClose}
        onSubmit={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
