import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Home from "../src/app/page";

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
