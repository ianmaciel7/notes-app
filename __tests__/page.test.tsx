import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Home from "../src/app/page";

afterEach(cleanup);

test("renders the connected workspace shell", () => {
  render(<Home />);

  expect(
    screen.getByRole("navigation", { name: "Navegacao do workspace" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("main", { name: "Documento ativo" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("complementary", { name: "Contexto do objeto" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Nota de exemplo" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Tipos de objeto")).toBeInTheDocument();
  expect(screen.getByText("Conteudo relacionado")).toBeInTheDocument();
});

test("opens and closes the mobile navigation", () => {
  render(<Home />);

  expect(
    screen.queryByRole("navigation", { name: "Navegacao movel" }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Abrir navegacao" }));
  expect(
    screen.getByRole("navigation", { name: "Navegacao movel" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Fechar navegacao" }));
  expect(
    screen.queryByRole("navigation", { name: "Navegacao movel" }),
  ).not.toBeInTheDocument();
});
