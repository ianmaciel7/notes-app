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

test("renders the Portuguese navigation contract with real links", async () => {
  render(<Home />);
  const navigation = screen.getByRole("navigation", {
    name: "Navegação principal",
  });
  const primaryNavigation = document.querySelector(
    '[data-region="sidebar-primary"]',
  );
  const scrollableNavigation = document.querySelector(
    '[data-region="sidebar-scroll"]',
  );
  const sidebarFooter = document.querySelector(
    '[data-region="sidebar-footer"]',
  );

  expect(primaryNavigation).not.toBeNull();
  expect(scrollableNavigation).not.toBeNull();
  expect(sidebarFooter).not.toBeNull();
  const newObjectLink = within(primaryNavigation as HTMLElement).getByRole(
    "link",
    { name: "Novo" },
  );
  expect(newObjectLink).toBeInTheDocument();
  expect(newObjectLink.firstElementChild).not.toHaveClass("text-object-blue");
  expect(
    within(scrollableNavigation as HTMLElement).queryByRole("link", {
      name: "Novo",
    }),
  ).not.toBeInTheDocument();
  expect(
    within(scrollableNavigation as HTMLElement).getByRole("button", {
      name: "Fixados",
    }),
  ).toBeInTheDocument();
  expect(within(sidebarFooter as HTMLElement).getByText("Pro")).toBeVisible();

  const visibleNavigationItems = navigationGroups.flatMap(
    (group) => group.items,
  );

  for (const item of visibleNavigationItems) {
    expect(
      within(navigation).getByRole("link", {
        name: item.label,
      }),
    ).toHaveAttribute("href", item.href);
  }

  const calendarLink = within(navigation).getByRole("link", {
    name: "Calendário",
  });
  expect(calendarLink).toHaveAttribute("aria-current", "page");
  expect(calendarLink.querySelector("svg")).toHaveAttribute(
    "viewBox",
    "0 0 256 256",
  );
  const auditIcon = within(navigation)
    .getByRole("link", { name: "AUDIT Entities" })
    .querySelector("svg");
  expect(auditIcon?.parentElement).toHaveClass(
    "bg-[var(--type-label-bg-blue)]",
    "text-[var(--type-label-text-blue)]",
  );
  expect(
    await screen.findByRole("heading", { name: "11 De Agosto De 2026" }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("Contexto do objeto")).toHaveTextContent(
    "Conteúdo relevante",
  );
  expect(screen.getByText("Nenhum conteúdo fixado")).toBeInTheDocument();
  expect(within(navigation).getByText("13")).toBeInTheDocument();
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

test("exposes the Capacities object type actions from the hover menu", async () => {
  render(<Home />);
  const optionsButton = screen.getByRole("button", {
    name: "Mais opções de Arquivos",
  });

  fireEvent.pointerDown(optionsButton, { button: 0, pointerType: "mouse" });
  fireEvent.click(optionsButton);

  expect(
    await screen.findByRole("menuitem", { name: /Abrir/ }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("menuitem", { name: "Criar Arquivo" }),
  ).toHaveAttribute("href", "/novo?tipo=arquivo");
  expect(
    screen.getByRole("menuitem", { name: /Novo a Partir do Modelo/ }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("menuitem", { name: "Nova Query" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("menuitem", { name: "Nova Coleção" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("menuitem", { name: "Configurações do Tipo de Objeto" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("menuitem", { name: /Importar/ })).toHaveTextContent(
    "CtrlI",
  );

  fireEvent.click(
    screen.getByRole("menuitem", { name: "Fixar na Barra Lateral" }),
  );
  expect(screen.queryByText("Nenhum conteúdo fixado")).not.toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: "Arquivos" })).toHaveLength(2);
  fireEvent.pointerDown(optionsButton, { button: 0, pointerType: "mouse" });
  fireEvent.click(optionsButton);
  expect(
    await screen.findByRole("menuitem", {
      name: "Desafixar da Barra Lateral",
    }),
  ).toBeInTheDocument();
});

test("matches the pinned section controls and custom section flow", async () => {
  render(<Home />);
  const navigation = screen.getByRole("navigation", {
    name: "Navegação principal",
  });
  const optionsButton = within(navigation).getByRole("button", {
    name: "Mais opções de Fixados",
  });
  const addPinnedButton = within(navigation).getByRole("button", {
    name: "Adicionar aos Fixados",
  });

  fireEvent.pointerDown(optionsButton, { button: 0, pointerType: "mouse" });
  fireEvent.click(optionsButton);
  expect(
    await screen.findByRole("menuitem", { name: "Ordenar manualmente" }),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("menuitem", { name: "Ordenar alfabeticamente" }),
  );

  fireEvent.pointerDown(addPinnedButton, { button: 0, pointerType: "mouse" });
  fireEvent.click(addPinnedButton);
  fireEvent.click(
    await screen.findByRole("menuitem", { name: "AUDIT - Página completa" }),
  );
  expect(
    within(navigation).getByRole("link", { name: "AUDIT - Página completa" }),
  ).toBeInTheDocument();
  expect(within(navigation).queryByText("Nenhum conteúdo fixado")).toBeNull();

  fireEvent.click(
    within(navigation).getByRole("button", { name: "Adicionar seção" }),
  );
  const dialog = await screen.findByRole("dialog", {
    name: "Adicionar seção",
  });
  fireEvent.change(within(dialog).getByPlaceholderText("Nome"), {
    target: { value: "Projetos" },
  });
  fireEvent.click(within(dialog).getByRole("button", { name: "Criar" }));
  expect(
    within(navigation).getByRole("button", { name: "Projetos" }),
  ).toBeInTheDocument();
});

test("opens the workspace picker and filters spaces", () => {
  render(<Home />);

  const workspaceButton = screen.getByRole("button", {
    name: /Codex Capacities Audit 2026-08-11/i,
  });
  expect(
    screen.queryByRole("button", { name: "Mais opções do workspace" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Recolher barra lateral" }),
  ).toBeInTheDocument();
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

  expect(screen.getByRole("button", { name: "Voltar" })).toHaveClass(
    "size-7",
    "rounded-lg",
  );
  expect(screen.getByRole("button", { name: "Avançar" })).toHaveClass(
    "size-7",
    "rounded-lg",
  );
  expect(screen.getByRole("button", { name: "Fechar data atual" })).toHaveClass(
    "opacity-0",
    "group-hover/current-tab:opacity-100",
  );

  expect(layoutButton).toHaveAttribute("aria-pressed", "false");
  fireEvent.click(layoutButton);
  expect(screen.getByRole("button", { name: "Layout normal" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("keeps contextual controls available and resizes the context panel by keyboard", async () => {
  render(<Home />);

  expect(
    await screen.findByRole("button", {
      name: "Mais opções da nota diária",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Documentação" }),
  ).toBeInTheDocument();

  const separator = screen.getByRole("separator", {
    name: "Redimensionar painel de contexto",
  });
  expect(separator).toHaveAttribute("aria-valuenow", "496");
  fireEvent.keyDown(separator, { key: "ArrowLeft" });
  expect(separator).toHaveAttribute("aria-valuenow", "512");
  fireEvent.keyDown(separator, { key: "ArrowRight" });
  expect(separator).toHaveAttribute("aria-valuenow", "496");
});

test("switches, closes, explores, and collapses contextual tabs", async () => {
  render(<Home />);

  const exploreTab = screen.getByRole("tab", { name: "Explorar" });
  expect(exploreTab).toHaveAttribute("aria-selected", "true");
  expect(exploreTab).toHaveClass(
    "border-workspace-border",
    "bg-workspace-surface",
    "font-medium",
  );
  expect(exploreTab.parentElement).toHaveClass("flex-1");
  expect(screen.getAllByRole("tab")).toHaveLength(1);
  expect(screen.getByRole("heading", { name: "Explorar" })).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: "AUDIT - Página completa" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "AUDIT - Custom entity" }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: "Sem título" })).toHaveLength(3);

  fireEvent.click(
    within(screen.getByLabelText("Contexto do objeto")).getByRole("button", {
      name: "Chat de IA",
    }),
  );
  expect(screen.getByRole("tab", { name: "Chat de IA" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(
    screen.getByRole("heading", { name: "Chat de IA Capacities" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("tab", { name: "Explorar" })).toBeNull();

  const newTabButton = screen.getByRole("button", { name: "Nova aba" });
  fireEvent.click(newTabButton);
  expect(
    screen.getByRole("dialog", { name: "Busca global" }),
  ).toBeInTheDocument();
  const paletteInput = screen.getByRole("textbox", {
    name: "Buscar por conteúdo e ações",
  });
  expect(screen.getByRole("option", { name: /Tabelas/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  fireEvent.change(paletteInput, { target: { value: "gráfico" } });
  expect(
    screen.getByRole("option", { name: "Abrir visualização em gráfico" }),
  ).toBeInTheDocument();
  fireEvent.keyDown(paletteInput, { key: "Escape" });
  expect(screen.queryByRole("dialog", { name: "Busca global" })).toBeNull();
  expect(screen.getByRole("tab", { name: "Explorar" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(screen.getByRole("tab", { name: "Chat de IA" })).toBeInTheDocument();
  expect(screen.getAllByRole("tab")).toHaveLength(2);

  const contextOptions = screen.getByRole("button", {
    name: "Opções do painel de contexto",
  });
  fireEvent.pointerDown(contextOptions);
  fireEvent.click(contextOptions);
  expect(screen.getByRole("menuitem", { name: "Chat de IA" })).toBeVisible();
  expect(screen.getByRole("menuitem", { name: "Buscar" })).toBeVisible();
  fireEvent.keyDown(document, { key: "Escape" });

  fireEvent.click(screen.getByRole("button", { name: "Nova aba" }));
  const graphPaletteInput = screen.getByRole("textbox", {
    name: "Buscar por conteúdo e ações",
  });
  fireEvent.change(graphPaletteInput, { target: { value: "gráfico" } });
  fireEvent.keyDown(graphPaletteInput, { key: "Enter" });
  const graphTab = screen.getByRole("tab", {
    name: "Visualização em grafo",
  });
  expect(graphTab.parentElement).toHaveClass("flex-1");
  expect(screen.getByRole("tab", { name: "Chat de IA" })).toBeInTheDocument();
  expect(screen.queryByRole("tab", { name: "Explorar" })).toBeNull();
  expect(screen.getByLabelText("Contexto do objeto")).toHaveClass("mb-2.5");
  expect(screen.getByLabelText("Contexto do objeto")).not.toHaveClass(
    "h-[calc(100%-56px)]",
    "self-start",
  );

  fireEvent.click(
    screen.getByRole("button", { name: "Fechar Visualização em grafo" }),
  );
  expect(screen.getByRole("tab", { name: "Chat de IA" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  fireEvent.click(screen.getByRole("button", { name: "Fechar Chat de IA" }));
  expect(screen.queryByLabelText("Contexto do objeto")).not.toBeInTheDocument();
  expect(
    screen.getByRole("complementary", { name: "Calendário mensal" }),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Abrir painel de contexto" }),
  );
  expect(screen.getByRole("tab", { name: "Chat de IA" })).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: "Fechar painel de contexto" }),
  );
  expect(screen.queryByLabelText("Contexto do objeto")).not.toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Abrir painel de contexto" }),
  );
  expect(screen.getByLabelText("Contexto do objeto")).toBeInTheDocument();
});

test("matches contextual tab hover affordances and supports arrow navigation", () => {
  render(<Home />);

  fireEvent.click(screen.getByRole("button", { name: "Nova aba" }));
  let paletteInput = screen.getByRole("textbox", {
    name: "Buscar por conteúdo e ações",
  });
  fireEvent.change(paletteInput, { target: { value: "gráfico" } });
  fireEvent.keyDown(paletteInput, { key: "Enter" });
  fireEvent.click(screen.getByRole("button", { name: "Nova aba" }));
  paletteInput = screen.getByRole("textbox", {
    name: "Buscar por conteúdo e ações",
  });
  fireEvent.change(paletteInput, { target: { value: "objetos internos" } });
  fireEvent.keyDown(paletteInput, { key: "Enter" });

  const graphTab = screen.getByRole("tab", {
    name: "Visualização em grafo",
  });
  const graphTabWrapper = graphTab.parentElement;
  const graphClose = screen.getByRole("button", {
    name: "Fechar Visualização em grafo",
  });

  expect(graphTab).toHaveClass(
    "rounded-lg",
    "border-transparent",
    "duration-150",
  );
  expect(graphTabWrapper).toHaveClass("group/tab", "duration-150");
  expect(graphClose.parentElement?.parentElement).toHaveClass(
    "hidden",
    "group-hover/tab:flex",
  );

  fireEvent.click(graphTab);
  expect(graphTab).toHaveClass(
    "border-workspace-border",
    "bg-workspace-surface",
    "font-medium",
  );
  expect(graphClose.parentElement?.parentElement).toHaveClass("flex");
  fireEvent.keyDown(graphTab, { key: "ArrowRight" });
  expect(screen.getByRole("tab", { name: "Objetos internos" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
