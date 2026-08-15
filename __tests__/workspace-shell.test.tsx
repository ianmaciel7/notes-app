import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Home from "../src/app/page";
import { WorkspaceShell } from "../src/components/workspace-shell";
import { navigationGroups } from "../src/lib/workspace-navigation";

afterEach(cleanup);

test("renders the Portuguese navigation contract with real links", () => {
  render(<Home />);
  const navigation = screen.getByRole("navigation", {
    name: "Navegação principal",
  });

  const visibleNavigationItems = navigationGroups
    .flatMap((group) => group.items)
    .filter(
      (item) =>
        ![
          "/ajuda/documentacao",
          "/ajuda/novidades",
          "/ajuda/feedback",
        ].includes(item.href),
    );

  for (const item of visibleNavigationItems) {
    expect(
      within(navigation).getByRole("link", {
        name: item.label,
      }),
    ).toHaveAttribute("href", item.href);
  }

  expect(
    within(navigation).getByRole("link", { name: "Calendário" }),
  ).toHaveAttribute("aria-current", "page");
  expect(screen.getByLabelText("Área de trabalho")).toHaveTextContent(
    "11 De Agosto De 2026",
  );
  expect(screen.getByLabelText("Contexto do objeto")).toHaveTextContent(
    "System Audit Response Test",
  );
  expect(screen.getByText("Nenhum conteúdo fixado")).toBeInTheDocument();
  expect(within(navigation).queryByText("13")).not.toBeInTheDocument();
});

test("keeps the parent destination active on a nested route", () => {
  render(<WorkspaceShell pathname="/tipos/chats-de-ia/system-1" />);

  expect(screen.getByRole("link", { name: "Chats de IA" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("opens and closes the mobile navigation with controls and Escape", () => {
  render(<Home />);
  const trigger = screen.getByRole("button", { name: "Abrir navegação" });

  fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Navegação móvel" });
  expect(dialog).toBeInTheDocument();
  expect(
    within(dialog).getByRole("link", { name: "Chats de IA" }),
  ).toBeInTheDocument();

  fireEvent.keyDown(window, { key: "Escape" });
  expect(
    screen.queryByRole("dialog", { name: "Navegação móvel" }),
  ).not.toBeInTheDocument();

  fireEvent.click(trigger);
  fireEvent.click(screen.getByRole("button", { name: "Fechar navegação" }));
  expect(
    screen.queryByRole("dialog", { name: "Navegação móvel" }),
  ).not.toBeInTheDocument();
});

test("collapses sidebar sections without removing their toggle", () => {
  render(<Home />);
  const studyToggle = screen.getByRole("button", {
    name: "Tipos de objeto",
  });

  fireEvent.click(studyToggle);
  expect(studyToggle).toHaveAttribute("aria-expanded", "false");
  expect(
    screen.queryByRole("link", { name: "Chats de IA" }),
  ).not.toBeInTheDocument();
});

test("opens the workspace picker and filters spaces", () => {
  render(<Home />);

  const workspaceButton = screen.getByRole("button", {
    name: /Codex Capacities Audit 2026-08-11/i,
  });
  fireEvent.pointerDown(workspaceButton);
  fireEvent.click(workspaceButton);

  expect(screen.getByRole("textbox", { name: "Buscar" })).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Buscar" }), {
    target: { value: "Ideias" },
  });
  expect(screen.getByRole("menuitem", { name: "Ideias" })).toBeInTheDocument();
  expect(
    screen.queryByRole("menuitem", { name: "Tech-5aaa" }),
  ).not.toBeInTheDocument();
});

test("toggles the wide daily layout from the top rail", () => {
  render(<Home />);
  const layoutButton = screen.getByRole("button", { name: "Layout amplo" });

  expect(layoutButton).toHaveAttribute("aria-pressed", "false");
  fireEvent.click(layoutButton);
  expect(screen.getByRole("button", { name: "Layout normal" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
