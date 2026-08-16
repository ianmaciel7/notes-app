import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Home from "../src/app/page";
import { WorkspaceShell } from "../src/components/workspace-shell";

afterEach(cleanup);

test("renders the starter page with primary navigation targets", async () => {
  render(<Home />);

  expect(screen.getByRole("link", { name: "Calendário" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(
    await screen.findByRole("heading", { name: "11 De Agosto De 2026" }),
  ).toBeInTheDocument();
  expect(screen.getAllByText("AUDIT-OK")).toHaveLength(1);
  expect(screen.getByRole("heading", { name: "Explorar" })).toBeInTheDocument();
  expect(screen.getAllByRole("article")).toHaveLength(12);
  expect(
    screen.getByRole("link", { name: "Documentação" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Chat de IA" })).toBeVisible();
});

test("marks the audit ready only after hydration, indexing, and queries", async () => {
  const { container } = render(<Home />);
  const root = container.querySelector("[data-audit-state]");

  expect(root).toHaveAttribute("data-audit-state", "booting");
  await waitFor(() =>
    expect(root).toHaveAttribute("data-audit-state", "ready"),
  );
  expect(root).toHaveAttribute("data-audit-pending-requests", "0");
  expect(root?.getAttribute("data-audit-conditions")).toContain("bootstrap");
  expect(root?.getAttribute("data-audit-conditions")).toContain("hydration");
  expect(root?.getAttribute("data-audit-conditions")).toContain("index");
  expect(root?.getAttribute("data-audit-conditions")).toContain(
    "created-today-query",
  );
  expect(screen.getAllByRole("article")).toHaveLength(12);
});

test("renders the Tabelas object-type route instead of the calendar", async () => {
  render(<WorkspaceShell pathname="/tipos/tabelas" />);

  expect(screen.getByRole("link", { name: "Tabelas" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(
    await screen.findByRole("heading", { name: "Tabelas", level: 1 }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "AUDIT - Tabela persistida" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "11 De Agosto De 2026" }),
  ).not.toBeInTheDocument();
});

test("renders an empty state from the shared object-type route contract", async () => {
  render(<WorkspaceShell pathname="/tipos/arquivos" />);

  expect(
    await screen.findByRole("heading", { name: "Arquivos", level: 1 }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: "Não há nada aqui (por enquanto).",
    }),
  ).toBeInTheDocument();
});

test("keeps the object-type inventory distinct from the daily feed", async () => {
  render(<WorkspaceShell pathname="/tipos/etiquetas" />);

  expect(
    await screen.findByRole("heading", { name: "Etiquetas", level: 1 }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Sem título", level: 2 }),
  ).toBeInTheDocument();
  expect(screen.getByText("Etiqueta persistida")).toBeInTheDocument();
});
