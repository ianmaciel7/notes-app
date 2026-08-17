"use client";

import {
  ArrowLeft,
  ArrowRight,
  Box,
  ChevronDown,
  Compass,
  FolderPlus,
  Link,
  Maximize2,
  MessageSquare,
  Minimize2,
  MoreHorizontal,
  Network,
  PanelLeft,
  PanelRight,
  Plus,
  Search,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { CapacitiesSidebar } from "@/components/capacities-sidebar";
import { CapacitiesSidebarIcon } from "@/components/capacities-sidebar-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type UiIconName =
  | "arrow-left"
  | "arrow-right"
  | "chevron-down"
  | "compass"
  | "cube"
  | "link"
  | "network"
  | "panel-left"
  | "panel-right"
  | "plus"
  | "search";

type ContextTabId =
  | "explore"
  | "graph"
  | "links"
  | "objects"
  | "related"
  | "chat"
  | "search";

type UiIconProps = {
  className?: string;
  name: UiIconName;
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

const contextIcons: Record<Exclude<ContextTabId, "chat">, UiIconName> = {
  explore: "compass",
  graph: "network",
  links: "link",
  objects: "cube",
  related: "search",
  search: "search",
};

function UiIcon({ className, name }: UiIconProps) {
  const iconClassName = className ?? "cap-top-icon";

  if (name === "arrow-left") {
    return <ArrowLeft className={iconClassName} />;
  }
  if (name === "arrow-right") {
    return <ArrowRight className={iconClassName} />;
  }
  if (name === "chevron-down") {
    return <ChevronDown className={iconClassName} />;
  }
  if (name === "compass") {
    return <Compass className={iconClassName} />;
  }
  if (name === "cube") {
    return <Box className={iconClassName} />;
  }
  if (name === "link") {
    return <Link className={iconClassName} />;
  }
  if (name === "network") {
    return <Network className={iconClassName} />;
  }
  if (name === "panel-left") {
    return <PanelLeft className={iconClassName} />;
  }
  if (name === "panel-right") {
    return <PanelRight className={iconClassName} />;
  }
  if (name === "plus") {
    return <Plus className={iconClassName} />;
  }

  return <Search className={iconClassName} />;
}

function IconWithTooltip({
  disabled = false,
  icon,
  label,
  onClick,
}: {
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        disabled={disabled}
        onClick={onClick}
        render={
          <Button
            aria-label={label}
            className="cap-top-button cap-icon-button"
            size="icon-sm"
            variant="ghost"
          >
            {icon}
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function WorkspaceHeader({ onCollapse }: { onCollapse: () => void }) {
  return (
    <header className="cap-workspace-header">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label="Seleção de espaço"
              className="cap-workspace-picker"
              variant="ghost"
            >
              <CapacitiesSidebarIcon
                className="cap-workspace-main-icon"
                name="workspace"
              />
              <span className="cap-workspace-name">Teste</span>
              <UiIcon
                className="cap-workspace-switch-icon"
                name="chevron-down"
              />
            </Button>
          }
        />

        <DropdownMenuContent
          align="start"
          className="cap-dropdown-content"
          sideOffset={4}
        >
          <DropdownMenuItem className="cap-dropdown-item">
            Teste
          </DropdownMenuItem>
          <DropdownMenuItem className="cap-dropdown-item">
            Ideias
          </DropdownMenuItem>
          <DropdownMenuItem className="cap-dropdown-item">
            <Plus className="cap-dropdown-inline-icon" size={14} />
            <span>Criar espaço</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <IconWithTooltip
        icon={<PanelLeft className="cap-top-icon" />}
        label="Recolher barra lateral"
        onClick={onCollapse}
      />
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
        <IconWithTooltip
          icon={<PanelLeft className="cap-top-icon" />}
          label="Abrir barra lateral"
          onClick={onOpenSidebar}
        />
      ) : null}

      <div className="cap-history-controls">
        <IconWithTooltip
          disabled
          icon={<ArrowLeft className="cap-top-icon" />}
          label="Voltar"
        />

        <IconWithTooltip
          disabled
          icon={<ArrowRight className="cap-top-icon" />}
          label="Avançar"
        />
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
            <X className="cap-close-icon" />
          </button>
        </div>
      ) : null}

      <Button
        aria-label="Adicionar objeto"
        className="cap-top-add-button"
        onClick={onCreateDocument}
        size="default"
        variant="outline"
      >
        <Plus className="cap-top-icon" />
        <span>Adicionar</span>
      </Button>

      <div className="cap-grow" />

      {wideLayout ? (
        <IconWithTooltip
          icon={<Minimize2 className="cap-top-icon" />}
          label="Layout normal"
          onClick={onToggleWideLayout}
        />
      ) : (
        <IconWithTooltip
          icon={<Maximize2 className="cap-top-icon" />}
          label="Layout amplo"
          onClick={onToggleWideLayout}
        />
      )}

      {contextOpen ? null : (
        <IconWithTooltip
          icon={<PanelRight className="cap-top-icon" />}
          label="Abrir painel de contexto"
          onClick={onOpenContext}
        />
      )}
    </header>
  );
}

function ContextHeader({
  activeTab,
  onClose,
  onOpenExplore,
  onOpenSearch,
  onOpenGraph,
}: {
  activeTab: ContextTabId;
  onClose: () => void;
  onOpenExplore: () => void;
  onOpenSearch: () => void;
  onOpenGraph: () => void;
}) {
  return (
    <header className="cap-context-header">
      <div className="cap-context-tab">
        {activeTab === "chat" ? (
          <CapacitiesSidebarIcon className="cap-context-tab-icon" name="chat" />
        ) : (
          <UiIcon
            className="cap-context-tab-icon"
            name={contextIcons[activeTab]}
          />
        )}

        <span className="cap-context-tab-label">
          {contextLabels[activeTab]}
        </span>

        <button
          aria-label={`Fechar ${contextLabels[activeTab]}`}
          className="cap-context-tab-close"
          onClick={onClose}
          type="button"
        >
          <X className="cap-close-icon" />
        </button>
      </div>

      <Button
        aria-label="Nova aba de contexto"
        className="cap-top-button"
        onClick={onOpenExplore}
        size="icon-sm"
        variant="ghost"
      >
        <FolderPlus className="cap-top-icon" />
      </Button>

      <div className="cap-grow" />

      <div className="cap-context-header-actions">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Fechar painel de contexto"
                className="cap-top-button"
                onClick={onClose}
                size="icon-sm"
                variant="ghost"
              >
                <PanelRight className="cap-top-icon" />
              </Button>
            }
          />
          <TooltipContent>Fechar painel</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                aria-label="Mais opções"
                className="cap-top-button cap-context-menu-trigger"
                size="icon-sm"
                variant="ghost"
              >
                <MoreHorizontal className="cap-top-icon" />
                <ChevronDown className="cap-top-icon" />
              </Button>
            }
          />

          <DropdownMenuContent
            align="end"
            className="cap-dropdown-content"
            sideOffset={6}
          >
            <DropdownMenuItem
              className="cap-dropdown-item"
              onClick={onOpenExplore}
            >
              Voltar para Explorar
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cap-dropdown-item"
              onClick={onOpenGraph}
            >
              Abrir grafo
            </DropdownMenuItem>

            <DropdownMenuItem className="cap-dropdown-item" onClick={onClose}>
              Fechar painel
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cap-dropdown-item"
              onClick={onOpenSearch}
            >
              Buscar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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

          <Button
            className="cap-top-button"
            onClick={onCreateDocument}
            size="default"
            variant="outline"
          >
            <Plus className="cap-top-icon" />
            <span>Criar página</span>
          </Button>
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
        <UiIcon
          className="cap-top-icon"
          name={
            id === "chat" ? "compass" : id === "search" ? "search" : "network"
          }
        />
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
  const [query, setQuery] = useState("");

  if (activeTab === "explore") {
    return (
      <aside aria-label="Contexto do objeto" className="cap-context-card">
        <div className="cap-context-scroll">
          <div className="cap-explore-view">
            <div className="cap-explore-empty-state">
              <div aria-hidden="true" className="cap-explore-illustration">
                <span className="cap-explore-sheet cap-explore-sheet-back" />

                <span className="cap-explore-sheet cap-explore-sheet-front">
                  <PanelRight className="cap-top-icon" />
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
            <Search className="cap-top-icon" />
          </span>

          <h2>Buscar</h2>

          <p>{contextDescriptions.search}</p>

          <div className="cap-context-search-box">
            <Search className="cap-top-icon" />

            <Input
              aria-label="Buscar objetos"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar"
              type="search"
              value={query}
            />
          </div>

          <Button
            aria-label="Voltar para Explorar"
            className="cap-context-back-button"
            onClick={() => onSelect("explore")}
            size="sm"
            variant="outline"
            type="button"
          >
            Voltar para Explorar
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label={contextLabels[activeTab]} className="cap-context-card">
      <div className="cap-context-tool-view">
        <span className="cap-context-tool-icon">
          {activeTab === "chat" ? (
            <MessageSquare className="cap-top-icon" />
          ) : (
            <UiIcon className="cap-top-icon" name={contextIcons[activeTab]} />
          )}
        </span>

        <h2>{contextLabels[activeTab]}</h2>

        <p>{contextDescriptions[activeTab]}</p>

        <Button
          aria-label="Voltar para Explorar"
          className="cap-context-back-button"
          onClick={() => onSelect("explore")}
          size="sm"
          variant="outline"
          type="button"
        >
          Voltar para Explorar
        </Button>
      </div>
    </aside>
  );
}

export function CapacitiesLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contextOpen, setContextOpen] = useState(true);
  const [wideLayout, setWideLayout] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(true);
  const [activeContextTab, setActiveContextTab] =
    useState<ContextTabId>("explore");

  const openContextTab = (tab: ContextTabId) => {
    setActiveContextTab(tab);
    setContextOpen(true);
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
    <TooltipProvider>
      <div className={rootClassName}>
        {sidebarOpen ? (
          <WorkspaceHeader onCollapse={() => setSidebarOpen(false)} />
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
            onClose={() => setContextOpen(false)}
            onOpenExplore={() => openContextTab("explore")}
            onOpenGraph={() => openContextTab("graph")}
            onOpenSearch={() => openContextTab("search")}
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
          <ContextPanel
            activeTab={activeContextTab}
            onSelect={openContextTab}
          />
        ) : null}
      </div>
    </TooltipProvider>
  );
}
