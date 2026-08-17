import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Home from "../src/app/page";

afterEach(cleanup);

test("renders the notes app shell with primary controls", () => {
  render(<Home />);

  expect(screen.getByRole("heading", { name: "Sem título" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Seleção de espaço" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Teste")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Recolher barra lateral" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Adicionar objeto" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Fechar Sem título" })).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { name: "Explorar" })).toHaveLength(2);
  expect(screen.getByRole("button", { name: "Nova aba de contexto" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Abrir Páginas" })).toBeInTheDocument();
});
