import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Home from "../src/app/page";

afterEach(cleanup);

test("renders the starter page with primary navigation targets", () => {
  render(<Home />);

  expect(screen.getByRole("link", { name: "Calendário" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(
    screen.getByRole("heading", { name: "11 De Agosto De 2026" }),
  ).toBeInTheDocument();
  expect(screen.getAllByText("AUDIT-OK")).toHaveLength(2);
  expect(
    screen.getByPlaceholderText(
      "Pergunte algo. @ para mencionar qualquer objeto.",
    ),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("article")).toHaveLength(12);
  expect(
    screen.queryByRole("link", { name: "Documentação" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Enviar mensagem" }),
  ).toBeDisabled();
});
