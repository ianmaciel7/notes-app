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
  expect(screen.getByRole("textbox", { name: "Título" })).toBeInTheDocument();
  expect(screen.getByText("Tipos de objeto")).toBeInTheDocument();
  expect(screen.getByText("Calendário")).toBeInTheDocument();
  expect(screen.getByText("Notas Diárias")).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: "Grafo do objeto atual" }),
  ).toBeInTheDocument();
  expect(
    screen.getByDisplayValue(
      "ADK 2.0: referência rápida de conceitos, ferramentas e comandos",
    ),
  ).toBeInTheDocument();
});

test("switches between graph and related content", () => {
  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: "Conteúdo relacionado" }));

  expect(
    screen.getByText("Nenhum conteúdo relacionado ainda"),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("img", { name: "Grafo do objeto atual" }),
  ).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Visualização em grafo" }),
  );
  expect(
    screen.getByRole("img", { name: "Grafo do objeto atual" }),
  ).toBeInTheDocument();
});

test("opens the object type picker", () => {
  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: /^Página$/ }));

  expect(screen.getByPlaceholderText("Buscar")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Área" })).toBeInTheDocument();
});

test("opens the selected object action menu", () => {
  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: "Ações de Sem título" }));

  expect(screen.getByRole("menuitem", { name: "Abrir" })).toBeInTheDocument();
  expect(
    screen.getByRole("menuitem", { name: "Fixar na Barra Lateral" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("menuitem", { name: "Excluir Objeto" }),
  ).toBeInTheDocument();
});

test("collapses and restores the desktop sidebar", () => {
  render(<Home />);

  fireEvent.click(
    screen.getByRole("button", { name: "Recolher barra lateral" }),
  );
  expect(
    screen.queryByRole("navigation", { name: "Navegacao do workspace" }),
  ).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Expandir barra lateral" }),
  );
  expect(
    screen.getByRole("navigation", { name: "Navegacao do workspace" }),
  ).toBeInTheDocument();
});

test("closes and reopens the context panel", () => {
  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: "Fechar painel" }));
  expect(
    screen.queryByRole("complementary", { name: "Contexto do objeto" }),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Abrir painel" }));
  expect(
    screen.getByRole("complementary", { name: "Contexto do objeto" }),
  ).toBeInTheDocument();
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
