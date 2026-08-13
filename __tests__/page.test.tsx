import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
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
test("moves focus from type search to the first result with Arrow Down", () => {
  render(<Home />);

  const trigger = screen.getByRole("button", { name: /^Página$/ });
  fireEvent.click(trigger);

  const search = screen.getByPlaceholderText("Buscar");
  search.focus();
  fireEvent.keyDown(search, { key: "ArrowDown" });

  expect(screen.getByRole("button", { name: "Área" })).toHaveFocus();
});

test("selects Área and dismisses the type picker", () => {
  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: /^Página$/ }));
  fireEvent.click(screen.getByRole("button", { name: "Área" }));

  expect(screen.queryByPlaceholderText("Buscar")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^Área$/ })).toHaveFocus();
});

test("keeps sidebar rows with contextual menus left aligned", () => {
  render(<Home />);

  expect(screen.getByRole("button", { name: "Sem título" })).toHaveClass(
    "justify-start",
  );
  expect(screen.getByRole("button", { name: "image" })).toHaveClass(
    "justify-start",
  );
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

test("collapses and restores each sidebar section independently", () => {
  render(<Home />);

  const pinned = screen.getByRole("button", { name: /^Fixados/ });
  expect(pinned).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("button", { name: "image" })).toBeInTheDocument();

  fireEvent.click(pinned);
  expect(pinned).toHaveAttribute("aria-expanded", "false");
  expect(
    screen.queryByRole("button", { name: "image" }),
  ).not.toBeInTheDocument();

  fireEvent.click(pinned);
  expect(screen.getByRole("button", { name: "image" })).toBeInTheDocument();
});

test("collapses the help and resources group", () => {
  render(<Home />);

  const help = screen.getByRole("button", { name: "Ajuda e recursos" });
  expect(help).toHaveAttribute("aria-expanded", "true");

  fireEvent.click(help);
  expect(
    screen.queryByRole("button", { name: "Primeiros passos" }),
  ).not.toBeInTheDocument();
});

test("changes graph density without inventing additional objects", () => {
  render(<Home />);

  expect(
    screen.getByRole("button", { name: "Selecionar image no grafo" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Mostrar menos" }));
  expect(
    screen.queryByRole("button", { name: "Selecionar image no grafo" }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Mostrar mais" }));
  expect(
    screen.getByRole("button", { name: "Selecionar image no grafo" }),
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

test("fits the graph back to its default viewport", () => {
  render(<Home />);

  const stage = document.querySelector<HTMLElement>(".workspace-graph-stage");
  expect(stage).toHaveStyle({
    transform: "translate(0px, 0px) scale(1)",
  });

  fireEvent.click(screen.getByRole("button", { name: "Aumentar zoom" }));
  expect(stage).toHaveStyle({
    transform: "translate(0px, 0px) scale(1.1)",
  });

  fireEvent.click(screen.getByRole("button", { name: "Ajustar à tela" }));
  expect(stage).toHaveStyle({
    transform: "translate(0px, 0px) scale(1)",
  });
});

test("selects graph nodes with pointer and keyboard", () => {
  render(<Home />);

  const imageNode = screen.getByRole("button", {
    name: "Selecionar image no grafo",
  });
  fireEvent.click(imageNode);
  expect(imageNode).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("status")).toHaveTextContent(
    "image selecionado no grafo",
  );

  const pageNode = screen.getByRole("button", {
    name: /Selecionar ADK 2\.0.*no grafo/,
  });
  fireEvent.keyDown(pageNode, { key: "Enter" });
  expect(pageNode).toHaveAttribute("aria-pressed", "true");
});

test("exposes keyboard shortcuts for back navigation", () => {
  render(<Home />);

  const back = screen.getByRole("button", { name: "Navegar para trás" });
  expect(back).toHaveAttribute(
    "aria-keyshortcuts",
    "Control+ArrowLeft Control+[",
  );
});

test("navigates back from both the button and advertised shortcuts", () => {
  const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: "Navegar para trás" }));
  fireEvent.keyDown(window, { key: "ArrowLeft", ctrlKey: true });
  fireEvent.keyDown(window, { key: "[", ctrlKey: true });
  fireEvent.keyDown(screen.getByRole("textbox", { name: "Título" }), {
    key: "ArrowLeft",
    ctrlKey: true,
  });

  expect(back).toHaveBeenCalledTimes(3);
  back.mockRestore();
});

test("keeps Personalizar visible when it receives keyboard focus", () => {
  render(<Home />);
  expect(screen.getByRole("button", { name: /Personalizar/ })).toHaveClass(
    "focus-visible:opacity-100",
  );
});

test("keeps the outline fixed and updates its active marker while scrolling", () => {
  render(<Home />);

  const editor = screen.getByRole("main", { name: "Documento ativo" });
  const outline = document.querySelector<HTMLElement>(
    ".workspace-document-outline",
  );
  const headings = document.querySelectorAll<HTMLElement>(
    ".workspace-editor-body h2",
  );
  const markers = outline?.querySelectorAll("span");

  [0, 180, 480, 1000, 1600, 2200].forEach((offsetTop, index) => {
    Object.defineProperty(headings[index], "offsetTop", {
      configurable: true,
      value: offsetTop,
    });
  });

  expect(markers?.[0]).toHaveAttribute("data-active");
  fireEvent.scroll(editor, { target: { scrollTop: 650 } });

  expect(outline).toHaveStyle({ transform: "translateY(650px)" });
  expect(markers?.[0]).not.toHaveAttribute("data-active");
  expect(markers?.[2]).toHaveAttribute("data-active");
});
