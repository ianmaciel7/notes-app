"use client";

import { type ReactNode, useEffect, useState } from "react";
import { CapacitiesSidebar } from "@/components/capacities-sidebar";
import { CapacitiesSidebarIcon } from "@/components/capacities-sidebar-icon";

type UiIconName =
  | "arrow-left"
  | "arrow-right"
  | "chevron-down"
  | "close"
  | "compass"
  | "cube"
  | "expand"
  | "link"
  | "network"
  | "panel-left"
  | "panel-right"
  | "plus"
  | "related"
  | "search"
  | "shrink";

type ContextTabId =
  | "explore"
  | "graph"
  | "links"
  | "objects"
  | "related"
  | "chat"
  | "search";

const uiIconPaths: Record<UiIconName, ReactNode> = {
  "arrow-left": (
    <>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  "chevron-down": <path d="m8 10 4 4 4-4" />,
  close: (
    <>
      <path d="M7 7l10 10" />
      <path d="M17 7 7 17" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  cube: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </>
  ),
  expand: (
    <>
      <path d="M8 3H3v5" />
      <path d="m3 3 6 6" />
      <path d="M16 3h5v5" />
      <path d="m21 3-6 6" />
      <path d="M8 21H3v-5" />
      <path d="m3 21 6-6" />
      <path d="M16 21h5v-5" />
      <path d="m21 21-6-6" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a4 4 0 0 0 5.66 0l2.12-2.12a4 4 0 0 0-5.66-5.66L11 6.34" />
      <path d="M14 11a4 4 0 0 0-5.66 0l-2.12 2.12a4 4 0 0 0 5.66 5.66L13 17.66" />
    </>
  ),
  network: (
    <>
      <circle cx="7" cy="12" r="2" />
      <circle cx="17" cy="7" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="m9 11 6-3" />
      <path d="m9 13 6 3" />
    </>
  ),
  "panel-left": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </>
  ),
  "panel-right": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M15 4v16" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  related: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M15 4v16" />
      <path d="M7 9h4" />
      <path d="M7 13h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
  shrink: (
    <>
      <path d="M8 8H3V3" />
      <path d="m3 8 5-5" />
      <path d="M16 8h5V3" />
      <path d="m21 8-5-5" />
      <path d="M8 16H3v5" />
      <path d="m3 16 5 5" />
      <path d="M16 16h5v5" />
      <path d="m21 16-5 5" />
    </>
  ),
};

const contextLabels: Record<ContextTabId, string> = {
  explore: "Explorar",
  graph: "Visualização em grafo",
  links: "Links de entrada",
  objects: "Objetos internos",
  related: "Conteúdo relacionado",
  chat: "Chat de IA",
  search: "Buscar",
};

const contextDescriptions: Record<ContextTabId, string> = {
  explore:
    "Abra conteúdo relevante, inicie um chat de IA ou visualize o grafo para ampliar o contexto do seu trabalho.",
  graph: "Visualize conexões entre objetos e conteúdos relacionados.",
  links: "Confira os objetos que fazem referência à página atual.",
  objects: "Veja os objetos internos contidos nesta página.",
  related: "Descubra conteúdos relacionados ao objeto atual.",
  chat: "Use o contexto da página para iniciar uma conversa com a IA.",
  search: "Encontre objetos, páginas e conteúdos no espaço atual.",
};

const contextItems: ReadonlyArray<{
  id: Exclude<ContextTabId, "explore">;
  label: string;
}> = [
  {
    id: "graph",
    label: "Visualização em grafo",
  },
  {
    id: "links",
    label: "Links de entrada",
  },
  {
    id: "objects",
    label: "Objetos internos",
  },
  {
    id: "related",
    label: "Conteúdo relacionado",
  },
  {
    id: "chat",
    label: "Chat de IA",
  },
  {
    id: "search",
    label: "Buscar",
  },
];

const contextUiIcons: Record<Exclude<ContextTabId, "chat">, UiIconName> = {
  explore: "compass",
  graph: "network",
  links: "link",
  objects: "cube",
  related: "related",
  search: "search",
};

function UiIcon({ className, name }: { className?: string; name: UiIconName }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.65"
      viewBox="0 0 24 24"
    >
      {uiIconPaths[name]}
    </svg>
  );
}

function ContextTabIcon({
  className,
  tab,
}: {
  className?: string;
  tab: ContextTabId;
}) {
  if (tab === "chat") {
    return <CapacitiesSidebarIcon className={className} name="chat" />;
  }

  return <UiIcon className={className} name={contextUiIcons[tab]} />;
}

function IconButton({
  active = false,
  className,
  disabled = false,
  icon,
  label,
  onClick,
}: {
  active?: boolean;
  className?: string;
  disabled?: boolean;
  icon: UiIconName;
  label: string;
  onClick?: () => void;
}) {
  const buttonClassName = [
    "cap-icon-button",
    active ? "cap-icon-button-active" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-label={label}
      aria-pressed={active || undefined}
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <UiIcon name={icon} />
    </button>
  );
}

function WorkspaceHeader({
  menuOpen,
  onCollapse,
  onToggleMenu,
}: {
  menuOpen: boolean;
  onCollapse: () => void;
  onToggleMenu: () => void;
}) {
  return (
    <header className="cap-workspace-header">
      <button
        aria-expanded={menuOpen}
        className="cap-workspace-picker"
        onClick={onToggleMenu}
        type="button"
      >
        <CapacitiesSidebarIcon
          className="cap-workspace-main-icon"
          name="workspace"
        />

        <span className="cap-workspace-name">Teste</span>

        <CapacitiesSidebarIcon
          className="cap-workspace-switch-icon"
          name="switch"
        />
      </button>

      <IconButton
        icon="panel-left"
        label="Recolher barra lateral"
        onClick={onCollapse}
      />

      {menuOpen ? (
        <div className="cap-workspace-menu">
          <div className="cap-menu-label">Espaços</div>

          <button
            className="cap-menu-item cap-menu-item-active"
            onClick={onToggleMenu}
            type="button"
          >
            <CapacitiesSidebarIcon name="workspace" />
            <span>Teste</span>
          </button>

          <button
            className="cap-menu-item"
            onClick={onToggleMenu}
            type="button"
          >
            <CapacitiesSidebarIcon name="workspace" />
            <span>Ideias</span>
          </button>

          <div className="cap-menu-separator" />

          <button
            className="cap-menu-item"
            onClick={onToggleMenu}
            type="button"
          >
            <UiIcon name="plus" />
            <span>Criar espaço</span>
          </button>
        </div>
      ) : null}
    </header>
  );
}

function MainHeader({
  contextOpen,
  documentOpen,
  sidebarOpen,
  wideLayout,
  onCloseDocument,
  onCreateDocument,
  onOpenContext,
  onOpenSidebar,
  onToggleWideLayout,
}: {
  contextOpen: boolean;
  documentOpen: boolean;
  sidebarOpen: boolean;
  wideLayout: boolean;
  onCloseDocument: () => void;
  onCreateDocument: () => void;
  onOpenContext: () => void;
  onOpenSidebar: () => void;
  onToggleWideLayout: () => void;
}) {
  return (
    <header className="cap-main-header">
      {!sidebarOpen ? (
        <IconButton
          icon="panel-left"
          label="Expandir barra lateral"
          onClick={onOpenSidebar}
        />
      ) : null}

      <div className="cap-history-controls">
        <IconButton disabled icon="arrow-left" label="Voltar" />

        <IconButton disabled icon="arrow-right" label="Avançar" />
      </div>

      {documentOpen ? (
        <div className="cap-active-tab">
          <span className="cap-active-tab-icon">
            <CapacitiesSidebarIcon name="page" />
          </span>

          <span className="cap-active-tab-label">Sem título</span>

          <button
            aria-label="Fechar Sem título"
            className="cap-tab-close-button"
            onClick={onCloseDocument}
            type="button"
          >
            <UiIcon name="close" />
          </button>
        </div>
      ) : null}

      <IconButton
        icon="plus"
        label="Adicionar objeto"
        onClick={onCreateDocument}
      />

      <div className="cap-grow" />

      <IconButton
        active={wideLayout}
        icon={wideLayout ? "shrink" : "expand"}
        label={wideLayout ? "Layout normal" : "Layout amplo"}
        onClick={onToggleWideLayout}
      />

      {!contextOpen ? (
        <IconButton
          icon="panel-right"
          label="Abrir painel de contexto"
          onClick={onOpenContext}
        />
      ) : null}
    </header>
  );
}

function ContextHeader({
  activeTab,
  menuOpen,
  onClose,
  onOpenExplore,
  onToggleMenu,
}: {
  activeTab: ContextTabId;
  menuOpen: boolean;
  onClose: () => void;
  onOpenExplore: () => void;
  onToggleMenu: () => void;
}) {
  return (
    <header className="cap-context-header">
      <div className="cap-context-tab">
        <ContextTabIcon className="cap-context-tab-icon" tab={activeTab} />

        <span className="cap-context-tab-label">
          {contextLabels[activeTab]}
        </span>

        <button
          aria-label={`Fechar ${contextLabels[activeTab]}`}
          className="cap-context-tab-close"
          onClick={onClose}
          type="button"
        >
          <UiIcon name="close" />
        </button>
      </div>

      <IconButton
        icon="plus"
        label="Nova aba de contexto"
        onClick={onOpenExplore}
      />

      <div className="cap-grow" />

      <div className="cap-context-header-actions">
        <IconButton
          icon="panel-right"
          label="Fechar painel de contexto"
          onClick={onClose}
        />

        <IconButton
          active={menuOpen}
          className="cap-context-menu-trigger"
          icon="chevron-down"
          label="Opções do painel de contexto"
          onClick={onToggleMenu}
        />
      </div>

      {menuOpen ? (
        <div className="cap-context-menu">
          <button
            className="cap-menu-item"
            onClick={onOpenExplore}
            type="button"
          >
            <UiIcon name="compass" />
            <span>Voltar para Explorar</span>
          </button>

          <button className="cap-menu-item" onClick={onClose} type="button">
            <UiIcon name="panel-right" />
            <span>Fechar painel</span>
          </button>
        </div>
      ) : null}
    </header>
  );
}

function MainPanel({
  documentOpen,
  onCreateDocument,
}: {
  documentOpen: boolean;
  onCreateDocument: () => void;
}) {
  return (
    <main aria-label="Área de trabalho" className="cap-main-card">
      {documentOpen ? (
        <div className="cap-page-scroll">
          <article className="cap-editor">
            <h1>Sem título</h1>

            <div className="cap-meta">
              <span className="cap-type-pill">
                <span className="cap-type-pill-icon">
                  <CapacitiesSidebarIcon name="page" />
                </span>
                Página
              </span>

              <button className="cap-meta-button" type="button">
                Coleções
              </button>

              <button className="cap-meta-button" type="button">
                Personalizar
              </button>
            </div>

            <div className="cap-editor-divider" />

            <div className="cap-property-row">
              <span className="cap-property-label">Etiquetas</span>

              <span className="cap-property-value">—</span>
            </div>

            <div className="cap-editor-caret" />
          </article>
        </div>
      ) : (
        <div className="cap-document-empty">
          <span className="cap-document-empty-icon">
            <CapacitiesSidebarIcon name="page" />
          </span>

          <h1>Nenhum objeto aberto</h1>

          <p>Crie uma nova página ou escolha um objeto na barra lateral.</p>

          <button
            className="cap-primary-button"
            onClick={onCreateDocument}
            type="button"
          >
            <UiIcon name="plus" />
            <span>Criar página</span>
          </button>
        </div>
      )}
    </main>
  );
}

function ExploreAction({
  id,
  label,
  onSelect,
}: {
  id: Exclude<ContextTabId, "explore">;
  label: string;
  onSelect: (tab: ContextTabId) => void;
}) {
  return (
    <button
      className="cap-explore-card"
      onClick={() => onSelect(id)}
      type="button"
    >
      <span className="cap-explore-card-icon">
        <ContextTabIcon tab={id} />
      </span>

      <span className="cap-explore-card-label">{label}</span>
    </button>
  );
}

function ContextPanel({
  activeTab,
  onSelect,
}: {
  activeTab: ContextTabId;
  onSelect: (tab: ContextTabId) => void;
}) {
  if (activeTab === "explore") {
    return (
      <aside aria-label="Contexto do objeto" className="cap-context-card">
        <div className="cap-context-scroll">
          <div className="cap-explore-view">
            <div className="cap-explore-empty-state">
              <div aria-hidden="true" className="cap-explore-illustration">
                <span className="cap-explore-sheet cap-explore-sheet-back" />

                <span className="cap-explore-sheet cap-explore-sheet-front">
                  <UiIcon name="panel-right" />
                </span>

                <span className="cap-explore-dot cap-explore-dot-one" />
                <span className="cap-explore-dot cap-explore-dot-two" />
              </div>

              <h2>Explorar</h2>

              <p>{contextDescriptions.explore}</p>
            </div>

            <section className="cap-explore-actions">
              <h3>Explorar</h3>

              <div className="cap-explore-grid">
                {contextItems.map((item) => (
                  <ExploreAction
                    id={item.id}
                    key={item.id}
                    label={item.label}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </aside>
    );
  }

  if (activeTab === "search") {
    return (
      <aside aria-label="Busca contextual" className="cap-context-card">
        <div className="cap-context-tool-view">
          <span className="cap-context-tool-icon">
            <UiIcon name="search" />
          </span>

          <h2>Buscar</h2>

          <p>{contextDescriptions.search}</p>

          <div className="cap-context-search-box">
            <UiIcon name="search" />

            <input
              aria-label="Buscar objetos"
              placeholder="Buscar"
              type="search"
            />
          </div>

          <button
            className="cap-context-back-button"
            onClick={() => onSelect("explore")}
            type="button"
          >
            Voltar para Explorar
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label={contextLabels[activeTab]} className="cap-context-card">
      <div className="cap-context-tool-view">
        <span className="cap-context-tool-icon">
          <ContextTabIcon tab={activeTab} />
        </span>

        <h2>{contextLabels[activeTab]}</h2>

        <p>{contextDescriptions[activeTab]}</p>

        <button
          className="cap-context-back-button"
          onClick={() => onSelect("explore")}
          type="button"
        >
          Voltar para Explorar
        </button>
      </div>
    </aside>
  );
}

export function CapacitiesLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contextOpen, setContextOpen] = useState(true);
  const [wideLayout, setWideLayout] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(true);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [activeContextTab, setActiveContextTab] =
    useState<ContextTabId>("explore");

  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setWorkspaceMenuOpen(false);
      setContextMenuOpen(false);
    };

    window.addEventListener("keydown", closeMenus);

    return () => {
      window.removeEventListener("keydown", closeMenus);
    };
  }, []);

  const openContextTab = (tab: ContextTabId) => {
    setActiveContextTab(tab);
    setContextOpen(true);
    setContextMenuOpen(false);
  };

  const rootClassName = [
    "cap-app",
    sidebarOpen ? "" : "cap-sidebar-closed",
    contextOpen ? "" : "cap-context-closed",
    wideLayout ? "cap-wide-layout" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      {sidebarOpen ? (
        <WorkspaceHeader
          menuOpen={workspaceMenuOpen}
          onCollapse={() => {
            setSidebarOpen(false);
            setWorkspaceMenuOpen(false);
          }}
          onToggleMenu={() => setWorkspaceMenuOpen((current) => !current)}
        />
      ) : null}

      <MainHeader
        contextOpen={contextOpen}
        documentOpen={documentOpen}
        sidebarOpen={sidebarOpen}
        wideLayout={wideLayout}
        onCloseDocument={() => setDocumentOpen(false)}
        onCreateDocument={() => setDocumentOpen(true)}
        onOpenContext={() => openContextTab("explore")}
        onOpenSidebar={() => setSidebarOpen(true)}
        onToggleWideLayout={() => setWideLayout((current) => !current)}
      />

      {contextOpen ? (
        <ContextHeader
          activeTab={activeContextTab}
          menuOpen={contextMenuOpen}
          onClose={() => {
            setContextOpen(false);
            setContextMenuOpen(false);
          }}
          onOpenExplore={() => openContextTab("explore")}
          onToggleMenu={() => setContextMenuOpen((current) => !current)}
        />
      ) : null}

      {sidebarOpen ? (
        <CapacitiesSidebar
          onOpenDocument={() => setDocumentOpen(true)}
          onOpenExplore={() => openContextTab("explore")}
          onOpenSearch={() => openContextTab("search")}
        />
      ) : null}

      <MainPanel
        documentOpen={documentOpen}
        onCreateDocument={() => setDocumentOpen(true)}
      />

      {contextOpen ? (
        <ContextPanel activeTab={activeContextTab} onSelect={openContextTab} />
      ) : null}
    </div>
  );
}
