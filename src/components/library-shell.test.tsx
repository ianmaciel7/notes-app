import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LibraryShell } from "@/components/library-shell";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    loginWithEmail: vi.fn(),
    registerWithEmail: vi.fn(),
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  }),
}));

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

  it("renders deck cards and study overview counters accurately", () => {
    const decks = [
      {
        id: "deck-1",
        name: "Vocabulário em Espanhol",
        description: "Palavras essenciais",
        cardCount: 20,
        dueCount: 5,
        newCount: 3,
      },
    ];

    render(<LibraryShell decks={decks} dueCount={5} newCount={3} />);

    expect(screen.getByRole("heading", { name: "Vocabulário em Espanhol" })).toBeInTheDocument();
    expect(screen.getByText("Palavras essenciais")).toBeInTheDocument();
    expect(screen.getAllByText("5").length).toBeGreaterThan(0);
    expect(screen.getAllByText("3").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Vocabulário em Espanhol/i })).toHaveAttribute("href", "/decks/deck-1");
  });
});
