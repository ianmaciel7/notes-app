import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LibraryShell } from "@/components/library-shell";

describe("LibraryShell", () => {
  it("presents the empty library and starts deck creation", async () => {
    const onCreateDeck = vi.fn();
    const user = userEvent.setup();

    render(
      <LibraryShell
        decks={[]}
        dueCount={0}
        newCount={0}
        onCreateDeck={onCreateDeck}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Seus baralhos" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sua biblioteca está vazia")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Criar baralho" })[0]);

    expect(onCreateDeck).toHaveBeenCalledOnce();
  });
});
