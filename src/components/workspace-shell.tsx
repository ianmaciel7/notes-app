"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  Compass,
  Copy,
  ExternalLink,
  FileText,
  FolderPlus,
  Info,
  Lightbulb,
  ListFilter,
  type LucideIcon,
  Maximize2,
  Menu,
  MessageCircle,
  MessagesSquare,
  Mic,
  Minimize2,
  MoreHorizontal,
  Network,
  PanelLeft,
  PanelRight,
  Pin,
  Plus,
  Search,
  Settings,
  Shapes,
  Sparkles,
  Sun,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CapacitiesSidebarIcon,
  type CapacitiesSidebarIconName,
} from "@/components/capacities-sidebar-icon";
import { ObjectTypeWorkspace } from "@/components/object-type-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  type AuditLoadResult,
  type AuditState,
  loadWorkspaceAuditData,
  type WorkspaceAuditData,
} from "@/lib/workspace-audit-data";
import type { CreatedObjectFixture } from "@/lib/workspace-audit-fixture";
import {
  getObjectTypeNavigationItem,
  isNavigationItemActive,
  normalizeObjectTypePath,
  type NavigationGroup,
  type NavigationIcon,
  type NavigationItem,
  navigationGroups,
} from "@/lib/workspace-navigation";

const sidebarIcons: Record<NavigationIcon, CapacitiesSidebarIconName> = {
  add: "add",
  search: "search",
  calendar: "calendar",
  tasks: "tasks",
  audit: "write",
  ai: "chat",
  image: "image",
  file: "file",
  audio: "audio",
  pdf: "pdf",
  query: "query",
  tag: "tag",
  tweet: "tweet",
  weblink: "weblink",
  table: "table",
  page: "page",
  trash: "trash",
  help: "graduation",
  question: "help",
  docs: "documentation",
  news: "news",
  feedback: "feedback",
};

const sectionIcons: Record<string, CapacitiesSidebarIconName> = {
  Fixados: "pin",
  "Tipos de objeto": "types",
  "Ajuda e recursos": "help",
};

const contextPanelTrack = {
  default: 496,
  min: 380,
  max: 620,
  storageKey: "notes-app:context-panel-width:v1",
} as const;

type ContextTabId =
  | "graph"
  | "objects"
  | "related"
  | "chat"
  | "assistant"
  | "explore";

const contextTabs: ReadonlyArray<{
  id: ContextTabId;
  icon: LucideIcon;
  label: string;
}> = [
  { id: "graph", icon: Network, label: "Visualização em grafo" },
  { id: "objects", icon: Shapes, label: "Objetos internos" },
  { id: "related", icon: PanelRight, label: "Conteúdo relacionado" },
  { id: "chat", icon: MessageCircle, label: "System Audit Response Test" },
  { id: "assistant", icon: MessageCircle, label: "Chat de IA" },
  { id: "explore", icon: Compass, label: "Explorar" },
];

type ContextPaletteItem = {
  id: string;
  icon: CapacitiesSidebarIconName;
  label: string;
  shortcut?: string;
  tabId?: ContextTabId;
  tone?: NonNullable<NavigationItem["tone"]>;
};

const contextPaletteItems: readonly ContextPaletteItem[] = [
  { id: "tables", icon: "table", label: "Tabelas", tone: "blue" },
  { id: "weblinks", icon: "weblink", label: "Weblinks", tone: "blue" },
  { id: "tweets", icon: "tweet", label: "Tweets", tone: "blue" },
  { id: "tags", icon: "tag", label: "Etiquetas", tone: "orange" },
  { id: "queries", icon: "query", label: "Queries", tone: "green" },
  { id: "pdfs", icon: "pdf", label: "PDFs", tone: "red" },
  { id: "audio", icon: "audio", label: "Áudios", tone: "red" },
  { id: "files", icon: "file", label: "Arquivos", tone: "red" },
  { id: "images", icon: "image", label: "Imagens", tone: "red" },
  { id: "chats", icon: "chat", label: "Chats de IA", tone: "violet" },
  { id: "entities", icon: "write", label: "AUDIT Entities", tone: "blue" },
  { id: "daily", icon: "calendar", label: "Notas Diárias", tone: "blue" },
  {
    id: "calendar",
    icon: "calendar",
    label: "Abrir calendário",
    shortcut: "Ctrl Alt H",
  },
  {
    id: "today",
    icon: "calendar",
    label: "Abrir hoje",
    shortcut: "Ctrl Alt H",
  },
  {
    id: "settings",
    icon: "settings",
    label: "Abrir configurações",
    shortcut: "Ctrl ,",
  },
  {
    id: "graph",
    icon: "types",
    label: "Abrir visualização em gráfico",
    tabId: "graph",
  },
  {
    id: "objects",
    icon: "types",
    label: "Abrir objetos internos",
    tabId: "objects",
  },
];

const navigationToneSurfaceClasses: Record<
  NonNullable<NavigationItem["tone"]>,
  string
> = {
  blue: "bg-[var(--type-label-bg-blue)] text-[var(--type-label-text-blue)]",
  violet:
    "bg-[var(--type-label-bg-purple)] text-[var(--type-label-text-purple)]",
  red: "bg-[var(--type-label-bg-red)] text-[var(--type-label-text-red)]",
  orange:
    "bg-[var(--type-label-bg-orange)] text-[var(--type-label-text-orange)]",
  green: "bg-[var(--type-label-bg-green)] text-[var(--type-label-text-green)]",
  cyan: "bg-[var(--type-label-bg-blue)] text-[var(--type-label-text-blue)]",
  indigo: "bg-[var(--type-label-bg-blue)] text-[var(--type-label-text-blue)]",
  sky: "bg-[var(--type-label-bg-blue)] text-[var(--type-label-text-blue)]",
};

const objectTypeSingularLabels: Partial<Record<NavigationIcon, string>> = {
  ai: "Chat de IA",
  audio: "Áudio",
  audit: "AUDIT Entity",
  file: "Arquivo",
  image: "Imagem",
  page: "Página",
  pdf: "PDF",
  query: "Query",
  table: "Tabela",
  tag: "Etiqueta",
  tweet: "Tweet",
  weblink: "Weblink",
};

const pinnableSidebarItems: NavigationItem[] = [
  {
    href: "/objetos/audit-pagina-completa",
    icon: "page",
    label: "AUDIT - Página completa",
    tone: "blue",
  },
  {
    href: "/objetos/audit-custom-entity",
    icon: "audit",
    label: "AUDIT - Custom entity",
    tone: "blue",
  },
  {
    href: "/objetos/audit-tabela-persistida",
    icon: "table",
    label: "AUDIT - Tabela persistida",
    tone: "blue",
  },
  {
    href: "/objetos/system-audit-response-test",
    icon: "ai",
    label: "System Audit Response Test",
    tone: "violet",
  },
];

export function WorkspaceShell({ pathname }: { pathname: string }) {
  const activeObjectType = getObjectTypeNavigationItem(pathname);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [wideLayout, setWideLayout] = useState(false);
  const [contextTrackWidth, setContextTrackWidth] = useState<number | null>(
    null,
  );
  const [contextPanelOpen, setContextPanelOpen] = useState(true);
  const [openContextTabs, setOpenContextTabs] = useState<ContextTabId[]>([
    "explore",
  ]);
  const [activeContextTab, setActiveContextTab] = useState<ContextTabId | null>(
    "explore",
  );
  const [lastClosedContextTab, setLastClosedContextTab] =
    useState<ContextTabId>("explore");
  const [contextPaletteOpen, setContextPaletteOpen] = useState(false);
  const [contextPaletteQuery, setContextPaletteQuery] = useState("");
  const [contextPaletteIndex, setContextPaletteIndex] = useState(0);
  const [contextTrackSource, setContextTrackSource] = useState<
    "default" | "localStorage" | "user"
  >("default");
  const [auditRuntime, setAuditRuntime] = useState<{
    state: AuditState;
    pendingRequests: number;
    completedConditions: readonly string[];
    result: AuditLoadResult | null;
    error: string | null;
  }>({
    state: "booting",
    pendingRequests: 0,
    completedConditions: [],
    result: null,
    error: null,
  });
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const contextPaletteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    loadWorkspaceAuditData((progress) => {
      if (!active) return;
      setAuditRuntime((current) => ({
        ...current,
        state: progress.state,
        pendingRequests: progress.pendingRequests,
        completedConditions: progress.completedConditions,
      }));
    })
      .then((result) => {
        if (!active) return;
        setAuditRuntime({
          state: "ready",
          pendingRequests: 0,
          completedConditions: result.completedConditions,
          result,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAuditRuntime((current) => ({
          ...current,
          state: "error",
          pendingRequests: 0,
          error: error instanceof Error ? error.message : String(error),
        }));
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const stored = Number(
      window.localStorage.getItem(contextPanelTrack.storageKey),
    );
    if (
      Number.isFinite(stored) &&
      stored >= contextPanelTrack.min &&
      stored <= contextPanelTrack.max
    ) {
      setContextTrackWidth(stored);
      setContextTrackSource("localStorage");
    }
  }, []);

  useEffect(() => {
    if (contextTrackWidth == null || contextTrackSource !== "user") return;
    window.localStorage.setItem(
      contextPanelTrack.storageKey,
      String(contextTrackWidth),
    );
  }, [contextTrackSource, contextTrackWidth]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    mobileCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMobileSidebarOpen(false);
      mobileTriggerRef.current?.focus();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (!contextPaletteOpen) return;
    const frame = requestAnimationFrame(() =>
      contextPaletteInputRef.current?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [contextPaletteOpen]);

  function closeMobileSidebar() {
    setMobileSidebarOpen(false);
    requestAnimationFrame(() => mobileTriggerRef.current?.focus());
  }

  function closeContextTab(tabId: ContextTabId) {
    setOpenContextTabs((currentTabs) => {
      const closingIndex = currentTabs.indexOf(tabId);
      const nextTabs = currentTabs.filter((id) => id !== tabId);

      if (activeContextTab === tabId && nextTabs.length > 0) {
        setActiveContextTab(
          nextTabs[Math.min(closingIndex, nextTabs.length - 1)],
        );
      } else if (activeContextTab === tabId) {
        setLastClosedContextTab(tabId);
        setActiveContextTab(null);
        setContextPanelOpen(false);
      }

      return nextTabs;
    });
  }

  function replaceContextTab(tabId: ContextTabId) {
    setOpenContextTabs([tabId]);
    setActiveContextTab(tabId);
    setContextPanelOpen(true);
  }

  function addContextTab(tabId: ContextTabId) {
    setOpenContextTabs((currentTabs) =>
      currentTabs.includes(tabId) ? currentTabs : [...currentTabs, tabId],
    );
    setActiveContextTab(tabId);
    setContextPanelOpen(true);
  }

  function replaceExploreTab(tabId: ContextTabId) {
    setOpenContextTabs((currentTabs) => {
      const exploreIndex = currentTabs.indexOf("explore");
      if (exploreIndex < 0) {
        return currentTabs.includes(tabId)
          ? currentTabs
          : [...currentTabs, tabId];
      }

      if (tabId === "explore") return currentTabs;

      const withoutExplore = currentTabs.filter((id) => id !== "explore");
      if (withoutExplore.includes(tabId)) return withoutExplore;

      const nextTabs = [...currentTabs];
      nextTabs[exploreIndex] = tabId;
      return nextTabs;
    });
    setActiveContextTab(tabId);
    setContextPanelOpen(true);
  }

  function reopenContextPanel() {
    if (openContextTabs.length === 0) {
      replaceContextTab(lastClosedContextTab);
      return;
    }
    setContextPanelOpen(true);
  }

  function openContextPalette() {
    addContextTab("explore");
    setContextPaletteQuery("");
    setContextPaletteIndex(0);
    setContextPaletteOpen(true);
  }

  const filteredContextPaletteItems = contextPaletteItems.filter((item) =>
    item.label
      .toLocaleLowerCase("pt-BR")
      .includes(contextPaletteQuery.trim().toLocaleLowerCase("pt-BR")),
  );

  function activateContextPaletteItem(item: ContextPaletteItem) {
    if (item.tabId) replaceExploreTab(item.tabId);
    setContextPaletteOpen(false);
  }

  const visibleContextTabs = openContextTabs
    .map((tabId) => contextTabs.find((tab) => tab.id === tabId))
    .filter((tab): tab is (typeof contextTabs)[number] => Boolean(tab));

  return (
    <TooltipProvider delayDuration={400}>
      <div
        className={cn(
          "grid h-dvh w-full grid-cols-[minmax(0,1fr)] grid-rows-[46px_minmax(0,1fr)] overflow-hidden bg-workspace text-workspace-text [--context-track:496px]",
          "md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]",
          contextPanelOpen && "workspace-context-open",
          desktopSidebarOpen
            ? "[--sidebar-width:288px]"
            : "[--sidebar-width:0px]",
        )}
        data-audit-conditions={auditRuntime.completedConditions.join(",")}
        data-audit-data-source={auditRuntime.result?.dataSource}
        data-audit-error={auditRuntime.error ?? undefined}
        data-audit-pending-requests={auditRuntime.pendingRequests}
        data-audit-ready-at-ms={auditRuntime.result?.readyAtMs}
        data-audit-state={auditRuntime.state}
        data-context-panel-open={contextPanelOpen}
        data-splitter-width-source={contextTrackSource}
        data-visual-audit="true"
        data-theme={darkTheme ? "dark" : "light"}
        style={
          contextTrackWidth
            ? ({
                "--context-track": `${contextTrackWidth}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <WorkspaceHeader
          desktopSidebarOpen={desktopSidebarOpen}
          onCollapse={() => setDesktopSidebarOpen(false)}
        />

        <header
          className="col-start-1 row-start-1 flex min-w-0 items-center gap-1 px-2.5 md:col-start-2"
          data-region="topbar-main"
        >
          <IconButton
            buttonRef={mobileTriggerRef}
            className="md:hidden"
            icon={Menu}
            label="Abrir navegação"
            onClick={() => setMobileSidebarOpen(true)}
          />
          {!desktopSidebarOpen ? (
            <IconButton
              className="hidden md:grid"
              icon={PanelLeft}
              label="Expandir barra lateral"
              onClick={() => setDesktopSidebarOpen(true)}
            />
          ) : null}
          <div className="flex h-7 shrink-0 items-center">
            <IconButton
              className="size-7 rounded-lg"
              icon={ArrowLeft}
              iconClassName="size-3.5"
              label="Voltar"
            />
            <IconButton
              className="size-7 rounded-lg"
              icon={ArrowRight}
              iconClassName="size-3.5"
              label="Avançar"
            />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <div className="group/current-tab flex h-8 min-w-0 cursor-pointer items-center gap-[0.3em] rounded-lg border border-transparent py-[3px] pr-px pl-1.5 text-[13px] leading-[1.3] text-workspace-text transition-colors duration-150 ease-out hover:bg-workspace-hover">
              <span className="grid size-[17px] shrink-0 place-items-center rounded-[4px] bg-workspace-hover text-workspace-subtle">
                {activeObjectType ? (
                  <CapacitiesSidebarIcon
                    aria-hidden="true"
                    className="size-3.5"
                    name={sidebarIcons[activeObjectType.icon]}
                  />
                ) : (
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                )}
              </span>
              <span className="hidden min-w-0 truncate text-left sm:block">
                {activeObjectType?.label ?? "11 de agosto de 2026"}
              </span>
              <span className="flex h-full w-5 shrink-0 items-center justify-end pr-0.5">
                <button
                  aria-label={
                    activeObjectType
                      ? `Fechar ${activeObjectType.label}`
                      : "Fechar data atual"
                  }
                  className="pointer-events-none grid h-7 w-[18px] place-items-center rounded-lg text-workspace-subtle opacity-0 transition-[background-color,color,opacity] duration-100 group-hover/current-tab:pointer-events-auto group-hover/current-tab:opacity-100 hover:bg-workspace-selected hover:text-workspace-muted focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-workspace-focus"
                  type="button"
                >
                  <X aria-hidden="true" className="size-3" />
                </button>
              </span>
            </div>
            <IconButton
              className="size-7 rounded-lg"
              icon={Plus}
              iconClassName="size-3.5"
              label="Adicionar objeto"
            />
            <div className="min-w-0 flex-1" />
          </div>
          <IconButton
            className="size-7 rounded-lg"
            icon={wideLayout ? Minimize2 : Maximize2}
            iconClassName="size-3.5"
            label={wideLayout ? "Layout normal" : "Layout amplo"}
            onClick={() => setWideLayout((current) => !current)}
            pressed={wideLayout}
          />
        </header>

        {contextPanelOpen ? (
          <header
            className="col-start-3 row-start-1 mr-2.5 hidden min-w-0 items-center justify-between overflow-hidden px-1 text-sm text-workspace-muted min-[1100px]:flex"
            data-region="topbar-tabs"
          >
            <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_fit-content(100%)] items-center gap-1">
              <div
                aria-label="Abas do painel de contexto"
                className="flex min-w-0 items-center gap-1 pr-[5px]"
                onKeyDown={(event) => {
                  if (
                    event.key !== "ArrowLeft" &&
                    event.key !== "ArrowRight" &&
                    event.key !== "Home" &&
                    event.key !== "End"
                  )
                    return;

                  const target = event.target as HTMLElement;
                  if (target.getAttribute("role") !== "tab") return;

                  event.preventDefault();
                  const visibleTabs = visibleContextTabs;
                  const currentIndex = visibleTabs.findIndex(
                    (tab) => tab.id === target.dataset.contextTab,
                  );
                  const nextIndex =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? visibleTabs.length - 1
                        : (currentIndex +
                            (event.key === "ArrowRight" ? 1 : -1) +
                            visibleTabs.length) %
                          visibleTabs.length;
                  const nextTab = visibleTabs[nextIndex];
                  setActiveContextTab(nextTab.id);
                  requestAnimationFrame(() => {
                    document
                      .querySelector<HTMLElement>(
                        `[role="tab"][data-context-tab="${nextTab.id}"]`,
                      )
                      ?.focus();
                  });
                }}
                role="tablist"
              >
                {visibleContextTabs.map((tab) => (
                  <TopRailTab
                    active={activeContextTab === tab.id}
                    icon={tab.icon}
                    key={tab.id}
                    label={tab.label}
                    onActivate={() => setActiveContextTab(tab.id)}
                    onClose={() => closeContextTab(tab.id)}
                    tabId={tab.id}
                  />
                ))}
              </div>
              <IconButton
                className="size-7 shrink-0"
                icon={Plus}
                label="Nova aba"
                onClick={openContextPalette}
              />
            </div>
            <div className="flex w-[43px] shrink-0 items-center">
              <IconButton
                className="size-7 shrink-0 rounded-r-none"
                icon={PanelRight}
                label="Fechar painel de contexto"
                onClick={() => setContextPanelOpen(false)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Opções do painel de contexto"
                    className="-ml-px h-7 w-4 shrink-0 rounded-l-none px-0"
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <ChevronDown aria-hidden="true" className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem
                    onSelect={() => replaceExploreTab("assistant")}
                  >
                    <MessagesSquare aria-hidden="true" className="size-4" />
                    Chat de IA
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={openContextPalette}>
                    <ListFilter aria-hidden="true" className="size-4" />
                    Buscar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        ) : null}

        {desktopSidebarOpen ? (
          <nav
            aria-label="Navegação principal"
            className="col-start-1 row-start-2 hidden min-h-0 flex-col md:flex"
            data-region="sidebar"
          >
            <SidebarContent
              darkTheme={darkTheme}
              onNavigate={() => undefined}
              onToggleTheme={() => setDarkTheme((current) => !current)}
              pathname={pathname}
            />
          </nav>
        ) : null}

        <main
          aria-label="Área de trabalho"
          className="col-start-1 row-start-2 mx-2 mb-2 min-h-0 min-w-0 rounded-xl border border-workspace-border bg-workspace-surface shadow-workspace-panel md:col-start-2 md:mx-2.5 md:mb-2.5"
          data-region="day-panel"
        >
          <div className="flex h-full min-h-0 min-w-0">
            <div className="min-h-0 min-w-0 flex-1">
              {activeObjectType ? (
                <ObjectTypeWorkspace
                  data={auditRuntime.result?.data ?? null}
                  error={auditRuntime.error}
                  objectType={activeObjectType}
                />
              ) : (
                <DailyWorkspace
                  data={auditRuntime.result?.data ?? null}
                  error={auditRuntime.error}
                  onToggleWideLayout={() =>
                    setWideLayout((current) => !current)
                  }
                  wideLayout={wideLayout}
                />
              )}
            </div>
            {!contextPanelOpen ? <MonthlyCalendarPanel /> : null}
          </div>
        </main>

        {contextPanelOpen ? (
          <aside
            aria-label="Contexto do objeto"
            className="relative col-start-3 row-start-2 mr-2.5 mb-2.5 hidden min-h-0 min-w-0 rounded-xl border border-workspace-border bg-workspace-surface min-[1100px]:block"
            data-region="chat-panel"
          >
            <hr
              aria-label="Redimensionar painel de contexto"
              aria-valuemax={contextPanelTrack.max}
              aria-valuemin={contextPanelTrack.min}
              aria-valuenow={contextTrackWidth ?? contextPanelTrack.default}
              aria-orientation="vertical"
              className="absolute inset-y-1 -left-2 z-20 hidden h-auto w-3 cursor-ew-resize touch-none select-none border-0 before:mx-auto before:block before:h-full before:w-0.5 before:rounded-full before:bg-workspace-border before:opacity-0 before:transition-opacity hover:before:opacity-100 focus-visible:before:opacity-100 min-[1250px]:block"
              onKeyDown={(event) => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
                  return;
                event.preventDefault();
                const direction = event.key === "ArrowLeft" ? 16 : -16;
                setContextTrackSource("user");
                setContextTrackWidth((current) =>
                  Math.min(
                    contextPanelTrack.max,
                    Math.max(
                      contextPanelTrack.min,
                      (current ?? contextPanelTrack.default) + direction,
                    ),
                  ),
                );
              }}
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={(event) => {
                if (!event.currentTarget.hasPointerCapture(event.pointerId))
                  return;
                setContextTrackSource("user");
                setContextTrackWidth(
                  Math.min(
                    contextPanelTrack.max,
                    Math.max(
                      contextPanelTrack.min,
                      window.innerWidth - event.clientX,
                    ),
                  ),
                );
              }}
              tabIndex={0}
            />
            <ContextPanel
              activeTab={activeContextTab}
              data={auditRuntime.result?.data ?? null}
              onOpenAssistant={() => replaceExploreTab("assistant")}
              onOpenSearch={openContextPalette}
            />
          </aside>
        ) : (
          <Button
            aria-label="Abrir painel de contexto"
            className="fixed top-2 right-2 z-30 hidden size-8 min-[1100px]:inline-flex"
            onClick={reopenContextPanel}
            size="icon"
            type="button"
            variant="ghost"
          >
            <PanelRight aria-hidden="true" className="size-[18px]" />
          </Button>
        )}

        {mobileSidebarOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
            <aside
              aria-label="Navegação móvel"
              aria-modal="true"
              className="relative flex h-dvh w-[min(288px,calc(100vw-32px))] flex-col border-r border-workspace-border bg-workspace shadow-xl"
              role="dialog"
            >
              <header className="flex h-[46px] shrink-0 items-center gap-2 px-2">
                <Lightbulb
                  aria-hidden="true"
                  className="size-[18px] shrink-0"
                />
                <span className="min-w-0 truncate text-[13px] leading-[16.9px] font-medium">
                  Codex Capacities Audit 2026-08-11
                </span>
                <div className="min-w-0 flex-1" />
                <IconButton
                  buttonRef={mobileCloseRef}
                  icon={X}
                  label="Fechar navegação"
                  onClick={closeMobileSidebar}
                />
              </header>
              <nav aria-label="Navegação principal" className="min-h-0 flex-1">
                <SidebarContent
                  darkTheme={darkTheme}
                  onNavigate={closeMobileSidebar}
                  onToggleTheme={() => setDarkTheme((current) => !current)}
                  pathname={pathname}
                />
              </nav>
            </aside>
          </div>
        ) : null}

        {contextPaletteOpen ? (
          <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[91px]">
            <button
              aria-label="Fechar busca"
              className="absolute inset-0 size-full bg-black/45"
              onClick={() => setContextPaletteOpen(false)}
              type="button"
            />
            <section
              aria-label="Busca global"
              aria-modal="true"
              className="relative flex max-h-[calc(100dvh-110px)] w-full max-w-[672px] flex-col overflow-hidden rounded-xl border border-workspace-border bg-workspace-surface shadow-2xl"
              role="dialog"
            >
              <div className="flex h-[51px] shrink-0 items-center gap-2 border-b border-workspace-border px-3">
                <Search
                  aria-hidden="true"
                  className="size-5 shrink-0 text-workspace-muted"
                />
                <input
                  aria-label="Buscar por conteúdo e ações"
                  className="h-full min-w-0 flex-1 bg-transparent text-base text-workspace-text outline-none placeholder:text-workspace-subtle"
                  onChange={(event) => {
                    setContextPaletteQuery(event.target.value);
                    setContextPaletteIndex(0);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      setContextPaletteOpen(false);
                      return;
                    }
                    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                      event.preventDefault();
                      const direction = event.key === "ArrowDown" ? 1 : -1;
                      setContextPaletteIndex((current) =>
                        filteredContextPaletteItems.length === 0
                          ? 0
                          : (current +
                              direction +
                              filteredContextPaletteItems.length) %
                            filteredContextPaletteItems.length,
                      );
                      return;
                    }
                    if (event.key === "Enter") {
                      const item =
                        filteredContextPaletteItems[contextPaletteIndex];
                      if (item) activateContextPaletteItem(item);
                    }
                  }}
                  placeholder="Buscar por conteúdo e ações, ou colar da área de transferência"
                  ref={contextPaletteInputRef}
                  value={contextPaletteQuery}
                />
                <IconButton
                  className="size-7"
                  icon={Info}
                  iconClassName="size-3.5"
                  label="Sobre a busca"
                />
                <IconButton
                  className="size-7"
                  icon={Maximize2}
                  iconClassName="size-3.5"
                  label="Expandir busca"
                />
              </div>
              <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-2 py-1.5">
                <div className="px-1.5 pb-1 text-[11px] text-workspace-subtle">
                  Abrir no painel lateral
                </div>
                {filteredContextPaletteItems.length > 0 ? (
                  filteredContextPaletteItems.map((item, index) => (
                    <button
                      aria-selected={contextPaletteIndex === index}
                      className={cn(
                        "flex h-[37px] w-full items-center gap-2 rounded-lg px-1.5 text-left text-sm text-workspace-text transition-colors hover:bg-workspace-hover",
                        contextPaletteIndex === index && "bg-workspace-hover",
                      )}
                      key={item.id}
                      onClick={() => activateContextPaletteItem(item)}
                      onMouseEnter={() => setContextPaletteIndex(index)}
                      role="option"
                      type="button"
                    >
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-md text-workspace-subtle",
                          item.tone && navigationToneSurfaceClasses[item.tone],
                        )}
                      >
                        <CapacitiesSidebarIcon
                          aria-hidden="true"
                          className="size-3.5"
                          name={item.icon}
                        />
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                      {item.tone ? (
                        <span
                          className={cn(
                            "inline-flex h-6 items-center gap-1 rounded-md border border-current/20 px-2 text-xs",
                            navigationToneSurfaceClasses[item.tone],
                          )}
                        >
                          <CapacitiesSidebarIcon
                            aria-hidden="true"
                            className="size-3"
                            name={item.icon}
                          />
                          {item.label}
                        </span>
                      ) : item.shortcut ? (
                        <kbd className="rounded-md bg-workspace-hover px-1.5 py-0.5 text-xs font-normal text-workspace-subtle">
                          {item.shortcut}
                        </kbd>
                      ) : null}
                    </button>
                  ))
                ) : (
                  <div className="grid h-24 place-items-center text-sm text-workspace-subtle">
                    Nenhum resultado encontrado
                  </div>
                )}
              </div>
              <footer className="flex h-7 shrink-0 items-center gap-4 border-t border-workspace-border px-3 text-[11px] text-workspace-subtle">
                <span>↑↓ para navegar</span>
                <span>Esc para abortar</span>
                <span>↵ para selecionar</span>
                <span className="ml-auto hidden sm:inline">
                  ⌘↵ / Ctrl+↵ em nova aba
                </span>
              </footer>
            </section>
          </div>
        ) : null}
      </div>
    </TooltipProvider>
  );
}

function DailyWorkspace({
  data,
  error,
  onToggleWideLayout,
  wideLayout,
}: {
  data: WorkspaceAuditData | null;
  error: string | null;
  onToggleWideLayout: () => void;
  wideLayout: boolean;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex h-[55px] shrink-0 items-center justify-between border-b border-workspace-border pr-4 pl-[23px] text-sm text-workspace-muted">
        <Button className="h-8 gap-0.5 px-2 text-sm font-normal" type="button">
          <span className="truncate">Dia</span>
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </Button>
        <div className="flex items-center gap-1">
          <IconButton icon={ArrowLeft} label="Dia anterior" />
          <span className="px-2">Hoje</span>
          <IconButton icon={ArrowRight} label="Próximo dia" />
        </div>
      </div>
      {!data ? (
        <div
          aria-busy={error ? undefined : "true"}
          className="grid min-h-0 flex-1 place-items-center text-sm text-workspace-subtle"
          role={error ? "alert" : "status"}
        >
          {error ?? "Preparando calendário..."}
        </div>
      ) : (
        <div
          className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-8 pt-[49px] pb-24 sm:px-10"
          data-scroll-container="day-view"
        >
          <div
            className={cn(
              "mx-auto",
              wideLayout ? "max-w-none" : "max-w-[682px]",
            )}
          >
            <p className="text-base leading-6 font-normal tracking-[0.4px] text-object-pink">
              {data.weekdayLabel}
            </p>
            <div className="mt-1 flex max-w-[410px] flex-wrap items-baseline gap-x-3 gap-y-2">
              <h1 className="shrink-0 text-[30px] leading-[33px] font-bold tracking-[0.4px] text-workspace-text">
                {data.formattedDate}
              </h1>
              <p className="text-sm tracking-[0.4px] text-workspace-subtle">
                Semana {data.weekNumber}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <Button
                className="gap-1 px-2 font-normal"
                size="sm"
                variant="outline"
                type="button"
              >
                <Plus aria-hidden="true" className="size-3.5" />
                <span
                  aria-hidden="true"
                  className="grid size-3.5 place-items-center rounded-full border border-orange-300 text-[8px] text-orange-500"
                >
                  ✓
                </span>
                Tarefa
              </Button>
            </div>
            <div className="group/daily-note mt-4 border-b border-workspace-border pb-[51px]">
              <div className="flex items-center">
                <h2 className="text-sm font-medium">Nota diária</h2>
                <div className="ml-auto flex opacity-0 transition-opacity group-hover/daily-note:opacity-100 group-focus-within/daily-note:opacity-100">
                  <IconButton
                    className="size-7"
                    icon={Maximize2}
                    label="Layout amplo da nota diária"
                    onClick={onToggleWideLayout}
                  />
                  <IconButton
                    className="size-7"
                    icon={MoreHorizontal}
                    label="Mais opções da nota diária"
                  />
                </div>
              </div>
              <Button
                className="mt-5 text-sm font-normal"
                size="sm"
                variant="outline"
                type="button"
              >
                <Plus aria-hidden="true" className="size-3.5" />
                Nota Diária
              </Button>
            </div>
            <section className="border-b border-workspace-border pt-10 pb-7">
              <h2 className="text-sm font-medium">Tarefas</h2>
              <div className="flex min-h-36 items-center justify-center text-center">
                <div>
                  <h3 className="text-sm font-medium text-workspace-muted">
                    Nenhuma tarefa neste dia
                  </h3>
                  <p className="mt-1 text-xs text-workspace-subtle">
                    Você pode mudar isso criando um novo objeto.
                  </p>
                </div>
              </div>
            </section>
            <section
              className="pt-[41px]"
              aria-labelledby="created-today-heading"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-medium" id="created-today-heading">
                  Criado Nesse Dia
                </h2>
                <Badge
                  className="border-0 px-1.5 py-0 text-xs font-normal tabular-nums"
                  variant="secondary"
                >
                  {data.createdObjects.length}
                </Badge>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {data.createdObjects.map((object) => (
                  <CreatedObjectCard key={object.id} object={object} />
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

const monthCalendarDays = [
  27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6,
] as const;

const monthWeekdays = [
  { id: "monday", label: "Sé" },
  { id: "tuesday", label: "Te" },
  { id: "wednesday", label: "Qu" },
  { id: "thursday", label: "Qu" },
  { id: "friday", label: "Se" },
  { id: "saturday", label: "Sá" },
  { id: "sunday", label: "Do" },
] as const;

function MonthlyCalendarPanel() {
  return (
    <aside
      aria-label="Calendário mensal"
      className="hidden h-full w-[368px] shrink-0 flex-col border-l border-workspace-border bg-workspace-surface min-[1100px]:flex"
    >
      <header className="flex h-[55px] shrink-0 items-center justify-end gap-1 border-b border-workspace-border px-2.5">
        {(["Mês", "Semana", "Três dias", "Dia"] as const).map((view) => (
          <Button
            aria-pressed={view === "Dia"}
            className={cn(
              "h-8 px-3 text-sm font-normal",
              view === "Dia" && "bg-workspace-hover text-workspace-text",
            )}
            key={view}
            type="button"
            variant="ghost"
          >
            {view}
          </Button>
        ))}
      </header>
      <div className="px-5 pt-2">
        <div className="flex h-10 items-center justify-between text-sm text-workspace-muted">
          <IconButton
            className="size-7"
            icon={ArrowLeft}
            iconClassName="size-3.5"
            label="Mês anterior"
          />
          <div className="flex items-center gap-5">
            <Button
              className="h-7 gap-1 px-1 text-sm font-normal"
              type="button"
            >
              Agosto
              <ChevronDown aria-hidden="true" className="size-3" />
            </Button>
            <Button
              className="h-7 gap-1 px-1 text-sm font-normal"
              type="button"
            >
              2026
              <ChevronDown aria-hidden="true" className="size-3" />
            </Button>
          </div>
          <IconButton
            className="size-7"
            icon={ArrowRight}
            iconClassName="size-3.5"
            label="Próximo mês"
          />
        </div>
        <div className="mt-1 grid grid-cols-7 text-center text-xs text-workspace-subtle">
          {monthWeekdays.map((weekday) => (
            <span className="py-2" key={weekday.id}>
              {weekday.label}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-workspace-muted">
          {monthCalendarDays.map((day, index) => {
            const outsideMonth = index < 5 || index > 35;
            const active = index === 15;
            const highlighted = index === 19;
            return (
              <button
                aria-current={active ? "date" : undefined}
                className={cn(
                  "mx-auto grid size-8 place-items-center rounded-full transition-colors hover:bg-workspace-hover",
                  outsideMonth && "text-workspace-subtle",
                  active && "bg-workspace-text text-workspace-surface",
                  highlighted && !active && "text-object-pink",
                )}
                key={`${index}-${day}`}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function ContextPanel({
  activeTab,
  data,
  onOpenAssistant,
  onOpenSearch,
}: {
  activeTab: ContextTabId | null;
  data: WorkspaceAuditData | null;
  onOpenAssistant: () => void;
  onOpenSearch: () => void;
}) {
  if (activeTab === null) {
    return (
      <ContextEmptyState
        description="Use o botão de nova aba para abrir uma visualização."
        icon={Plus}
        title="Nenhuma aba aberta"
      />
    );
  }

  if (activeTab === "objects") {
    return (
      <ContextEmptyState
        description="Os objetos incorporados nesta página aparecerão aqui."
        icon={Shapes}
        title="Nenhum objeto inserido"
      />
    );
  }

  if (activeTab === "related") {
    return (
      <ContextEmptyState
        description="Este tipo de conteúdo não suporta conteúdo relacionado."
        icon={PanelRight}
        title="Conteúdo relacionado não disponível"
      />
    );
  }

  if (activeTab === "explore") {
    return (
      <ExploreContextPanel
        data={data}
        onOpenAssistant={onOpenAssistant}
        onOpenSearch={onOpenSearch}
      />
    );
  }

  if (activeTab === "graph") {
    return (
      <ContextEmptyState
        description="As conexões entre os objetos desta página aparecerão aqui."
        icon={Network}
        title="Visualização em grafo"
      />
    );
  }

  if (activeTab === "assistant") {
    return <AssistantContextPanel selectedModel={data?.selectedModel} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-[55px] shrink-0 items-center gap-2 border-b border-workspace-border px-3">
        <Badge
          className="shrink-0 border-violet-200 bg-violet-50 text-violet-700"
          variant="outline"
        >
          <MessageCircle aria-hidden="true" className="size-3.5" />
          {data?.chat.type ?? "Chat de IA"}
        </Badge>
        <span className="min-w-0 truncate text-[13px] text-workspace-muted">
          {data?.chat.title ?? "Carregando conversa..."}
        </span>
        <IconButton
          className="ml-auto shrink-0 rounded-lg border border-workspace-border"
          icon={MoreHorizontal}
          label="Mais opções do contexto"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-2"
          data-scroll-container="chat-history"
        >
          <div className="flex min-h-full flex-col gap-8 text-[13px] leading-[19px]">
            {data?.chat.messages.map((message) =>
              message.role === "user" ? (
                <div
                  className="ml-auto w-4/5 rounded-xl border border-workspace-border px-3 py-2"
                  data-message-role="user"
                  key={message.id}
                >
                  <div>{message.text}</div>
                </div>
              ) : (
                <p
                  className="text-[13.333px] leading-[22px] text-workspace-text"
                  data-message-role="assistant"
                  key={message.id}
                >
                  {message.text}
                </p>
              ),
            )}
          </div>
        </div>
        <div
          className="shrink-0 bg-workspace-surface px-3 pt-4 pb-3"
          data-region="chat-composer"
        >
          <div className="rounded-xl border border-workspace-border px-2 py-2">
            <input
              aria-label="Mensagem para o Chat de IA"
              className="block h-[26px] w-full min-w-0 bg-transparent px-1 text-xs leading-5 outline-none placeholder:text-workspace-subtle"
              placeholder="Pergunte algo. @ para mencionar qualquer objeto."
              type="text"
            />
            <div className="mt-1 flex items-center gap-1">
              <Button
                className="h-7 min-w-0 gap-1.5 rounded-lg border border-workspace-border px-2 text-xs font-normal"
                type="button"
              >
                <Sparkles
                  aria-hidden="true"
                  className="size-3 text-object-blue"
                />
                <span className="truncate">
                  {data?.selectedModel ?? "Carregando modelo..."}
                </span>
                <ChevronDown aria-hidden="true" className="size-3 shrink-0" />
              </Button>
              <div className="flex-1" />
              <IconButton
                className="size-7"
                icon={Mic}
                label="Ditar mensagem"
              />
              <Button
                aria-label="Enviar mensagem"
                className="size-7 rounded-lg bg-workspace-selected text-workspace-subtle"
                disabled
                size="icon"
                type="button"
              >
                <ArrowUp aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssistantContextPanel({ selectedModel }: { selectedModel?: string }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid min-h-0 flex-1 place-items-center px-8">
        <div className="flex max-w-[280px] flex-col items-center text-center">
          <MessagesSquare
            aria-hidden="true"
            className="size-8 text-workspace-muted"
          />
          <h2 className="mt-4 text-sm font-medium text-workspace-text">
            Chat de IA Capacities
          </h2>
          <p className="mt-2 text-xs leading-5 text-workspace-subtle">
            O assistente de IA pode produzir informações imprecisas sobre
            pessoas, lugares ou fatos.
          </p>
          <Button
            className="mt-1 h-7 px-2 text-xs font-normal"
            size="sm"
            type="button"
            variant="ghost"
          >
            Saiba mais
          </Button>
        </div>
      </div>
      <div
        className="shrink-0 bg-workspace-surface px-3 pt-4 pb-3"
        data-region="chat-composer"
      >
        <div className="rounded-xl border border-workspace-border px-2 py-2">
          <input
            aria-label="Mensagem para o Chat de IA"
            className="block h-[26px] w-full min-w-0 bg-transparent px-1 text-xs leading-5 outline-none placeholder:text-workspace-subtle"
            placeholder="Pergunte algo. @ para mencionar qualquer objeto."
            type="text"
          />
          <div className="mt-1 flex items-center gap-1">
            <Button
              className="h-7 min-w-0 gap-1.5 rounded-lg border border-workspace-border px-2 text-xs font-normal"
              type="button"
            >
              <Sparkles
                aria-hidden="true"
                className="size-3 text-object-blue"
              />
              <span className="truncate">
                {selectedModel ?? "Carregando modelo..."}
              </span>
              <ChevronDown aria-hidden="true" className="size-3 shrink-0" />
            </Button>
            <div className="flex-1" />
            <IconButton className="size-7" icon={Mic} label="Ditar mensagem" />
            <Button
              aria-label="Enviar mensagem"
              className="size-7 rounded-lg bg-workspace-selected text-workspace-subtle"
              disabled
              size="icon"
              type="button"
            >
              <ArrowUp aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatedObjectCard({ object }: { object: CreatedObjectFixture }) {
  const toneClass = navigationToneSurfaceClasses[object.tone];
  const tablePreview = object.tableRows != null;

  return (
    <article
      className="min-h-40 overflow-hidden rounded-xl border border-workspace-border bg-workspace-surface p-2.5"
      data-created-object-id={object.id}
    >
      <Badge className={cn("px-1.5 py-0 text-xs font-normal", toneClass)}>
        <FileText aria-hidden="true" className="size-3" />
        {object.type}
      </Badge>
      <h3 className="mt-2 ml-0.5 text-base font-semibold leading-[22px]">
        {object.title}
      </h3>
      {tablePreview ? (
        <div className="mt-2 overflow-x-auto rounded-lg border border-workspace-border text-xs">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr>
                {object.tableRows?.[0].map((cell) => (
                  <th
                    className="px-2 py-1.5 font-normal"
                    key={cell}
                    scope="col"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {object.tableRows?.slice(1).map((row) => (
                <tr
                  className="border-t border-workspace-border"
                  key={row.join("-")}
                >
                  {row.map((cell) => (
                    <td className="px-2 py-1.5" key={cell}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-2 whitespace-pre-line rounded-lg border border-workspace-border bg-workspace px-3 py-3 text-sm leading-5">
          {object.preview}
        </p>
      )}
    </article>
  );
}

function WorkspaceHeader({
  desktopSidebarOpen,
  onCollapse,
}: {
  desktopSidebarOpen: boolean;
  onCollapse: () => void;
}) {
  if (!desktopSidebarOpen) return null;

  return (
    <header
      className="col-start-1 row-start-1 hidden items-center justify-between gap-px pt-1 pr-0.5 pb-px pl-2 md:flex"
      data-region="workspace-header"
    >
      <WorkspacePicker />
      <SidebarIconButton
        className="-mt-px size-7"
        label="Recolher barra lateral"
        name="sidebar"
        onClick={onCollapse}
      />
    </header>
  );
}

function WorkspacePicker() {
  const [query, setQuery] = useState("");
  const spaces = [
    "Como Estudar ?",
    "Ideias",
    "Tech-5aaa",
    "Tech-3",
    "Tech old",
    "Tech-old-2",
    "Tech",
    "Teste",
  ];
  const filteredSpaces = spaces.filter((space) =>
    space.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <DropdownMenu onOpenChange={(open) => !open && setQuery("")}>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-8 min-w-0 flex-1 justify-start gap-1.5 rounded-md px-2 text-left font-normal"
          type="button"
        >
          <CapacitiesSidebarIcon
            aria-hidden="true"
            className="mr-0.5 size-3.5 shrink-0"
            name="workspace"
          />
          <span className="min-w-0 truncate text-sm leading-5 font-medium">
            Codex Capacities Audit 2026-08-11
          </span>
          <CapacitiesSidebarIcon
            aria-hidden="true"
            className="ml-[-2px] size-3.5 shrink-0"
            name="switch"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <input
          aria-label="Buscar"
          className="mb-1 h-8 w-full rounded-sm border border-workspace-border bg-transparent px-2 text-sm outline-none placeholder:text-workspace-subtle focus:border-workspace-focus"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar"
          value={query}
        />
        <div className="max-h-56 overflow-y-auto">
          {filteredSpaces.map((space) => (
            <DropdownMenuItem key={space}>{space}</DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Criar espaço</DropdownMenuItem>
        <DropdownMenuItem>Configurações do espaço</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const relevantObjectIconNames: Record<string, CapacitiesSidebarIconName> = {
  "AUDIT Entity": "write",
  Imagem: "image",
  Página: "page",
  Weblink: "weblink",
  Áudio: "audio",
};

const relevantObjectIds = [
  "audit-page",
  "audit-entity",
  "audit-image",
  "audit-weblink-w3",
  "audit-audio",
] as const;

function ExploreContextPanel({
  data,
  onOpenAssistant,
  onOpenSearch,
}: {
  data: WorkspaceAuditData | null;
  onOpenAssistant: () => void;
  onOpenSearch: () => void;
}) {
  const relevantObjects = relevantObjectIds
    .map((id) => data?.createdObjects.find((object) => object.id === id))
    .filter((object): object is CreatedObjectFixture => Boolean(object));

  return (
    <div className="grid h-full min-h-0 place-items-center px-11">
      <div className="flex w-full max-w-[275px] flex-col gap-2">
        <h2 className="text-xs font-normal text-workspace-subtle">Explorar</h2>
        <div className="grid grid-cols-2 gap-2">
          <Button
            className="h-[90px] flex-col items-start justify-start gap-2 rounded-lg border border-workspace-border bg-workspace-surface p-4 text-xs font-normal text-workspace-subtle hover:bg-workspace-hover"
            onClick={onOpenAssistant}
            type="button"
            variant="outline"
          >
            <MessagesSquare
              aria-hidden="true"
              className="size-5 text-workspace-muted"
            />
            Chat de IA
          </Button>
          <Button
            className="h-[90px] flex-col items-start justify-start gap-2 rounded-lg border border-workspace-border bg-workspace-surface p-4 text-xs font-normal text-workspace-subtle hover:bg-workspace-hover"
            onClick={onOpenSearch}
            type="button"
            variant="outline"
          >
            <ListFilter
              aria-hidden="true"
              className="size-5 text-workspace-muted"
            />
            Buscar
          </Button>
        </div>
        <div className="mt-6 flex h-7 items-center justify-between text-xs text-workspace-subtle">
          <span>Conteúdo relevante</span>
          <Button
            className="h-7 gap-1 px-1.5 text-xs font-normal"
            onClick={onOpenSearch}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Search aria-hidden="true" className="size-3.5" />
            Encontrar mais
          </Button>
        </div>
        <div className="flex flex-col">
          {relevantObjects.map((object) => (
            <button
              className="group/relevant flex h-[38px] w-full min-w-0 items-center gap-2 rounded-md px-0.5 py-1 text-left transition-colors hover:bg-workspace-hover active:opacity-70"
              key={object.id}
              type="button"
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-md",
                  navigationToneSurfaceClasses[object.tone],
                )}
              >
                <CapacitiesSidebarIcon
                  aria-hidden="true"
                  className="size-3.5"
                  name={relevantObjectIconNames[object.type] ?? "page"}
                />
              </span>
              <span className="min-w-0 truncate text-sm leading-[1.3] text-workspace-text">
                {object.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContextEmptyState({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="grid h-full min-h-0 place-items-center px-8 text-center">
      <div className="max-w-72">
        <Icon
          aria-hidden="true"
          className="mx-auto mb-4 size-8 text-workspace-subtle"
        />
        <h2 className="text-sm font-medium text-workspace-text">{title}</h2>
        <p className="mt-2 text-xs leading-5 text-workspace-subtle">
          {description}
        </p>
      </div>
    </div>
  );
}

function SidebarContent({
  darkTheme,
  onNavigate,
  onToggleTheme,
  pathname,
}: {
  darkTheme: boolean;
  onNavigate: () => void;
  onToggleTheme: () => void;
  pathname: string;
}) {
  const primaryGroup = navigationGroups[0];
  const actionGroups = [
    { ...primaryGroup, items: primaryGroup.items.slice(0, 2) },
  ];
  const viewGroups = [{ ...primaryGroup, items: primaryGroup.items.slice(2) }];
  const scrollableGroups = navigationGroups.slice(1);

  return (
    <div className="relative -top-px flex h-[calc(100%+1px)] min-h-0 flex-col">
      <div className="shrink-0" data-region="sidebar-primary">
        <div className="px-2 pr-1">
          <NavigationGroups
            groups={actionGroups}
            onNavigate={onNavigate}
            pathname={pathname}
          />
        </div>
        <div className="mt-px px-2 pr-1 pb-1.5">
          <NavigationGroups
            groups={viewGroups}
            onNavigate={onNavigate}
            pathname={pathname}
          />
        </div>
      </div>

      <ScrollArea
        className="mt-0.5 min-h-0 flex-1"
        data-region="sidebar-scroll"
      >
        <div className="min-h-full w-[calc(100%-10px)] pb-1">
          <NavigationGroups
            groups={scrollableGroups}
            onNavigate={onNavigate}
            pathname={pathname}
          />
        </div>
      </ScrollArea>

      <div
        className="flex h-11 shrink-0 items-center gap-0.5 px-2.5 py-1.5 pr-1 text-xs"
        data-region="sidebar-footer"
      >
        <SidebarIconButton label="Configurações" name="settings" />
        {darkTheme ? (
          <IconButton
            icon={Sun}
            label="Usar tema claro"
            onClick={onToggleTheme}
          />
        ) : (
          <SidebarIconButton
            label="Usar tema escuro"
            name="moon"
            onClick={onToggleTheme}
          />
        )}
        <SidebarIconButton label="Perfil pessoal" name="user" />
        <div className="ml-1 inline-flex h-6 items-center gap-1 rounded-md bg-workspace-hover px-1.5 text-xs text-workspace-subtle">
          <CapacitiesSidebarIcon
            aria-hidden="true"
            className="size-3.5 text-object-violet"
            name="rocket"
          />
          <span>Pro</span>
        </div>
        <div className="flex-1" />
        <SidebarIconButton label="Compartilhar" name="share" />
      </div>
    </div>
  );
}

function NavigationGroups({
  groups = navigationGroups,
  onNavigate,
  pathname,
}: {
  groups?: NavigationGroup[];
  onNavigate: () => void;
  pathname: string;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Fixados: true,
    "Tipos de objeto": true,
    "Ajuda e recursos": true,
  });
  const [pinnedHrefs, setPinnedHrefs] = useState<string[]>([]);
  const [pinnedSort, setPinnedSort] = useState<"manual" | "alphabetical">(
    "manual",
  );
  const [customSections, setCustomSections] = useState<NavigationGroup[]>([]);
  const objectTypeItems =
    groups.find((group) => group.label === "Tipos de objeto")?.items ?? [];
  const availablePinnedItems = [...objectTypeItems, ...pinnableSidebarItems];
  const pinnedItems = pinnedHrefs
    .map((href) => availablePinnedItems.find((item) => item.href === href))
    .filter((item): item is NavigationItem => item != null)
    .sort((left, right) =>
      pinnedSort === "alphabetical"
        ? left.label.localeCompare(right.label, "pt-BR")
        : 0,
    );

  const objectTypesIndex = groups.findIndex(
    (group) => group.label === "Tipos de objeto",
  );
  const orderedGroups =
    objectTypesIndex >= 0
      ? [
          ...groups.slice(0, objectTypesIndex + 1),
          ...customSections,
          ...groups.slice(objectTypesIndex + 1),
        ]
      : groups;

  return orderedGroups.map((sourceGroup) => {
    const group =
      sourceGroup.label === "Fixados"
        ? {
            ...sourceGroup,
            count: pinnedItems.length,
            emptyText:
              pinnedItems.length === 0 ? sourceGroup.emptyText : undefined,
            items: pinnedItems,
          }
        : sourceGroup;

    return (
      <Fragment
        key={group.label ?? group.items.map((item) => item.href).join("-")}
      >
        <NavigationGroupView
          availablePinnedItems={pinnableSidebarItems}
          group={group}
          onNavigate={onNavigate}
          onSortPinned={setPinnedSort}
          onTogglePinned={(href) =>
            setPinnedHrefs((current) =>
              current.includes(href)
                ? current.filter((currentHref) => currentHref !== href)
                : [...current, href],
            )
          }
          open={group.label ? (openGroups[group.label] ?? true) : true}
          onToggle={
            group.label
              ? () =>
                  setOpenGroups((current) => ({
                    ...current,
                    [group.label as string]: !(
                      current[group.label as string] ?? true
                    ),
                  }))
              : undefined
          }
          pathname={pathname}
          pinnedHrefs={pinnedHrefs}
        />
        {sourceGroup.label === "Tipos de objeto" ? (
          <AddSidebarSection
            onAdd={(label) => {
              setCustomSections((current) => [
                ...current,
                { label, items: [] },
              ]);
              setOpenGroups((current) => ({ ...current, [label]: true }));
            }}
          />
        ) : null}
      </Fragment>
    );
  });
}

function NavigationGroupView({
  availablePinnedItems,
  group,
  onNavigate,
  onToggle,
  onTogglePinned,
  onSortPinned,
  open,
  pathname,
  pinnedHrefs,
}: {
  availablePinnedItems: NavigationItem[];
  group: NavigationGroup;
  onNavigate: () => void;
  onToggle?: () => void;
  onTogglePinned: (href: string) => void;
  onSortPinned: (sort: "manual" | "alphabetical") => void;
  open: boolean;
  pathname: string;
  pinnedHrefs: string[];
}) {
  if (!group.label) {
    const primary = group.items[0]?.icon === "add";
    const trash = group.items.some((item) => item.icon === "trash");

    return (
      <div className={cn("relative space-y-0", trash && "mt-12 ml-2 mr-0.5")}>
        {group.items.map((item) => (
          <NavigationLink
            item={item}
            key={item.href}
            onNavigate={onNavigate}
            pathname={pathname}
            primary={primary}
          />
        ))}
        {group.items[0]?.icon === "add" ? (
          <SidebarIconButton
            className="absolute right-2 top-0 size-7 text-object-violet hover:text-object-violet"
            label="Assistente de IA"
            name="assistant"
          />
        ) : null}
      </div>
    );
  }

  const SectionIcon = sectionIcons[group.label];
  const isPinnedSection = group.label === "Fixados";
  return (
    <section
      className={cn(
        "group/section",
        group.label === "Ajuda e recursos" && "mt-2",
      )}
    >
      {isPinnedSection ? (
        <div className="ml-[9px] flex h-8 w-[257px] items-center rounded-lg px-2 text-xs text-workspace-subtle transition duration-200 ease-out hover:bg-workspace-hover">
          <button
            aria-expanded={open}
            aria-label={group.label}
            className="flex min-w-0 flex-1 items-center gap-1.5 text-left font-medium"
            onClick={onToggle}
            type="button"
          >
            {SectionIcon ? (
              <CapacitiesSidebarIcon
                aria-hidden="true"
                className="size-4"
                name={SectionIcon}
              />
            ) : null}
            <span>{group.label}</span>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "size-3.5 opacity-0 transition duration-200 group-hover/section:opacity-80 group-focus-within/section:opacity-80",
                !open && "-rotate-90",
              )}
            />
          </button>
          <span className="w-[27px] text-center text-[11px] tabular-nums opacity-0 transition duration-200 group-hover/section:opacity-80 group-focus-within/section:opacity-80">
            {group.count ?? 0}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Mais opções de Fixados"
                className="size-[22px] rounded-lg p-0 opacity-0 group-hover/section:opacity-100 group-focus-within/section:opacity-100"
                size="icon"
                type="button"
              >
                <MoreHorizontal aria-hidden="true" className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
              <DropdownMenuItem
                className="h-8 rounded-lg px-2 text-sm"
                onSelect={() => onSortPinned("manual")}
              >
                Ordenar manualmente
              </DropdownMenuItem>
              <DropdownMenuItem
                className="h-8 rounded-lg px-2 text-sm"
                onSelect={() => onSortPinned("alphabetical")}
              >
                Ordenar alfabeticamente
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Adicionar aos Fixados"
                className="ml-px size-[22px] rounded-lg border border-workspace-border bg-workspace-surface p-0 opacity-0 group-hover/section:opacity-100 group-focus-within/section:opacity-100"
                size="icon"
                type="button"
              >
                <Plus aria-hidden="true" className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-xl p-1.5">
              {availablePinnedItems.map((item) => (
                <DropdownMenuItem
                  className="h-8 rounded-lg px-2 text-sm"
                  key={item.href}
                  onSelect={() => onTogglePinned(item.href)}
                >
                  <CapacitiesSidebarIcon
                    aria-hidden="true"
                    className="size-4 text-workspace-subtle"
                    name={sidebarIcons[item.icon]}
                  />
                  <span className="truncate">{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button
          aria-label={group.label}
          aria-expanded={open}
          className="ml-[9px] h-8 w-[257px] justify-start gap-1.5 rounded-lg px-2 text-xs font-medium text-workspace-subtle duration-200 ease-out"
          onClick={onToggle}
          size="sm"
          type="button"
        >
          {SectionIcon ? (
            <CapacitiesSidebarIcon
              aria-hidden="true"
              className="size-4"
              name={SectionIcon}
            />
          ) : null}
          <span>{group.label}</span>
          {group.count != null ? (
            <span className="ml-auto max-w-0 overflow-hidden text-[11px] tabular-nums opacity-0 transition-[max-width,opacity] group-hover/section:max-w-8 group-hover/section:opacity-100 group-focus-within/section:max-w-8 group-focus-within/section:opacity-100">
              {group.count}
            </span>
          ) : null}
        </Button>
      )}
      {open ? (
        <div
          className={cn(
            "space-y-0",
            group.label === "Fixados" &&
              (group.items.length === 0 ? "h-10 pt-1" : "pt-0.5 pb-1.5"),
            group.label === "Tipos de objeto" && "pt-0.5 pb-1.5",
            group.label === "Ajuda e recursos" && "px-2 pr-0.5",
          )}
        >
          {group.items.map((item) => (
            <NavigationLink
              item={item}
              key={item.href}
              objectType={
                group.label === "Tipos de objeto" || group.label === "Fixados"
              }
              onNavigate={onNavigate}
              onTogglePinned={onTogglePinned}
              pathname={pathname}
              pinned={pinnedHrefs.includes(item.href)}
            />
          ))}
          {group.emptyText ? (
            <p className="px-5 py-1 text-xs italic text-workspace-subtle">
              {group.emptyText}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function AddSidebarSection({ onAdd }: { onAdd: (label: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function closeDialog() {
    setName("");
    setOpen(false);
  }

  return (
    <>
      <button
        className="ml-[9px] flex h-8 w-[259px] items-center gap-1.5 rounded-lg px-2 text-sm text-workspace-muted opacity-60 transition duration-200 ease-out hover:bg-workspace-hover hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-workspace-focus"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Plus aria-hidden="true" className="size-4" />
        <span>Adicionar seção</span>
      </button>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-[100] grid place-items-center p-4">
              <button
                aria-hidden="true"
                className="absolute inset-0 bg-black/15"
                onClick={closeDialog}
                tabIndex={-1}
                type="button"
              />
              <form
                aria-labelledby="add-sidebar-section-title"
                className="relative w-full max-w-sm rounded-xl border border-workspace-border bg-workspace-surface p-4 text-workspace-text shadow-xl"
                onSubmit={(event) => {
                  event.preventDefault();
                  const label = name.trim();
                  if (!label) return;
                  onAdd(label);
                  closeDialog();
                }}
                role="dialog"
              >
                <Button
                  aria-label="Fechar criação de seção"
                  className="absolute top-2 right-2 size-7"
                  onClick={closeDialog}
                  size="icon"
                  type="button"
                >
                  <X aria-hidden="true" className="size-4" />
                </Button>
                <h2
                  className="text-base font-semibold"
                  id="add-sidebar-section-title"
                >
                  Adicionar seção
                </h2>
                <div className="mt-4 text-xs font-medium text-workspace-subtle">
                  Ícone
                  <span className="mt-1 flex h-8 items-center gap-2 rounded-lg border border-workspace-border px-2 text-sm text-workspace-muted">
                    <CapacitiesSidebarIcon
                      aria-hidden="true"
                      className="size-4"
                      name="types"
                    />
                    Seção
                  </span>
                </div>
                <label
                  className="mt-3 block text-xs font-medium text-workspace-subtle"
                  htmlFor="new-sidebar-section-name"
                >
                  Nome
                  <input
                    className="mt-1 h-8 w-full rounded-lg border border-workspace-border bg-transparent px-2 text-sm text-workspace-text outline-none focus:border-workspace-focus"
                    id="new-sidebar-section-name"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nome"
                    value={name}
                  />
                </label>
                <div className="mt-4 flex justify-end gap-2">
                  <Button onClick={closeDialog} type="button" variant="ghost">
                    Cancelar
                  </Button>
                  <Button disabled={!name.trim()} type="submit">
                    Criar
                  </Button>
                </div>
              </form>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function NavigationLink({
  item,
  objectType = false,
  onNavigate,
  onTogglePinned,
  pathname,
  pinned = false,
  primary = false,
}: {
  item: NavigationItem;
  objectType?: boolean;
  onNavigate: () => void;
  onTogglePinned?: (href: string) => void;
  pathname: string;
  pinned?: boolean;
  primary?: boolean;
}) {
  const iconName = sidebarIcons[item.icon];
  const activePath = objectType
    ? normalizeObjectTypePath(pathname)
    : pathname;
  const active = isNavigationItemActive(activePath, item.href);

  if (objectType) {
    return (
      <ObjectTypeNavigationLink
        active={active}
        iconName={iconName}
        item={item}
        onNavigate={onNavigate}
        onTogglePinned={onTogglePinned}
        pinned={pinned}
      />
    );
  }

  return (
    <Button
      asChild
      className={`group/nav-item h-8 w-full min-w-0 justify-start gap-1.5 rounded-lg px-2 text-sm leading-5 font-normal duration-200 ease-out ${
        active
          ? "bg-workspace-hover text-workspace-text brightness-[0.965]"
          : primary
            ? "text-workspace-muted hover:bg-workspace hover:text-workspace-muted"
            : "text-workspace-muted hover:bg-workspace-hover hover:text-workspace-text"
      }`}
      size="sm"
    >
      <Link
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        href={item.href}
        onClick={onNavigate}
      >
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-md",
            "size-4",
          )}
        >
          <CapacitiesSidebarIcon
            aria-hidden="true"
            className="size-4"
            name={iconName}
          />
        </span>
        <span className="min-w-0 truncate">{item.label}</span>
        {item.count != null ? (
          <span className="ml-auto max-w-0 overflow-hidden text-[11px] tabular-nums text-workspace-subtle opacity-0 transition-[max-width,opacity] group-hover/nav-item:max-w-8 group-hover/nav-item:opacity-100 group-focus-within/nav-item:max-w-8 group-focus-within/nav-item:opacity-100">
            {item.count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}

function ObjectTypeNavigationLink({
  active,
  iconName,
  item,
  onNavigate,
  onTogglePinned,
  pinned,
}: {
  active: boolean;
  iconName: CapacitiesSidebarIconName;
  item: NavigationItem;
  onNavigate: () => void;
  onTogglePinned?: (href: string) => void;
  pinned: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const [templateQuery, setTemplateQuery] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);
  const singularLabel = objectTypeSingularLabels[item.icon] ?? item.label;
  const createHref = `/novo?tipo=${encodeURIComponent(singularLabel.toLowerCase())}`;
  const source = encodeURIComponent(item.href);
  const rowClassName = cn(
    "group/nav-item mx-2 flex h-[29px] w-[calc(100%-1rem)] min-w-0 items-center rounded-lg pl-[3px] pr-1.5 text-sm leading-5 font-normal duration-200 ease-out",
    active
      ? "bg-workspace-hover text-workspace-text brightness-[0.965]"
      : "text-workspace-muted hover:bg-workspace-hover hover:text-workspace-text",
  );
  const menuItemClassName =
    "h-8 rounded-lg px-2 pr-1 text-sm text-workspace-text focus:bg-workspace-hover";

  return (
    <div className={rowClassName} data-object-type-row={item.label}>
      <Link
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        className="flex min-w-0 flex-1 items-center gap-1.5"
        href={item.href}
        onClick={onNavigate}
      >
        <span
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-md",
            navigationToneSurfaceClasses[item.tone ?? "blue"],
          )}
        >
          <CapacitiesSidebarIcon
            aria-hidden="true"
            className="size-3.5"
            name={iconName}
          />
        </span>
        <span className="min-w-0 truncate">{item.label}</span>
      </Link>

      <div
        className={cn(
          "flex w-0 shrink-0 items-center overflow-hidden opacity-0 transition-[width,opacity] duration-300 ease-in group-hover/nav-item:w-[49px] group-hover/nav-item:opacity-100 group-focus-within/nav-item:w-[49px] group-focus-within/nav-item:opacity-100",
          menuOpen && "w-[49px] opacity-100",
        )}
      >
        <span className="w-[27px] text-center text-[11px] tabular-nums text-workspace-subtle opacity-80">
          {item.count ?? 0}
        </span>
        <DropdownMenu
          onOpenChange={(open) => {
            setMenuOpen(open);
            if (!open) setTemplateQuery("");
          }}
          open={menuOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button
              aria-label={`Mais opções de ${item.label}`}
              className="size-[22px] shrink-0 rounded-lg p-0 text-workspace-muted opacity-70 hover:bg-workspace hover:text-workspace-muted hover:opacity-100 focus-visible:outline-offset-[-2px]"
              size="icon"
              type="button"
            >
              <MoreHorizontal aria-hidden="true" className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[270px] rounded-xl border-workspace-border p-1.5 shadow-[0_3px_5px_rgb(0_0_0/1%),0_5px_10px_rgb(0_0_0/2%),0_10px_14px_rgb(0_0_0/1%)]"
            side="right"
            sideOffset={4}
          >
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={menuItemClassName}>
                <ExternalLink
                  aria-hidden="true"
                  className="size-4 text-workspace-subtle"
                />
                Abrir
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56 rounded-xl p-1.5">
                <DropdownMenuItem asChild className={menuItemClassName}>
                  <Link href={item.href} onClick={onNavigate}>
                    Abrir como página
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={menuItemClassName}>
                  <Link href={item.href} target="_blank">
                    Abrir em nova aba
                    <DropdownMenuShortcut>CtrlClick</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem asChild className={menuItemClassName}>
              <Link href={createHref} onClick={onNavigate}>
                <Plus
                  aria-hidden="true"
                  className="size-4 text-workspace-subtle"
                />
                Criar {singularLabel}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={menuItemClassName}>
                <Copy
                  aria-hidden="true"
                  className="size-4 text-workspace-subtle"
                />
                Novo a Partir do Modelo
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-60 rounded-xl p-1.5">
                <input
                  aria-label="Buscar modelos"
                  className="mb-1 h-8 w-full rounded-lg bg-workspace-hover px-2 text-sm text-workspace-text outline-none placeholder:text-workspace-subtle focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-workspace-focus"
                  onChange={(event) => setTemplateQuery(event.target.value)}
                  onKeyDown={(event) => event.stopPropagation()}
                  placeholder="Buscar"
                  value={templateQuery}
                />
                {"Novo modelo"
                  .toLocaleLowerCase("pt-BR")
                  .includes(templateQuery.trim().toLocaleLowerCase("pt-BR")) ? (
                  <DropdownMenuItem asChild className={menuItemClassName}>
                    <Link
                      href={`/novo?tipo=modelo&origem=${source}`}
                      onClick={onNavigate}
                    >
                      <Plus
                        aria-hidden="true"
                        className="size-4 text-workspace-subtle"
                      />
                      Novo modelo
                    </Link>
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem asChild className={menuItemClassName}>
              <Link
                href={`/novo?tipo=query&origem=${source}`}
                onClick={onNavigate}
              >
                <ListFilter
                  aria-hidden="true"
                  className="size-4 text-workspace-subtle"
                />
                Nova Query
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={menuItemClassName}>
              <Link
                href={`/novo?tipo=colecao&origem=${source}`}
                onClick={onNavigate}
              >
                <FolderPlus
                  aria-hidden="true"
                  className="size-4 text-workspace-subtle"
                />
                Nova Coleção
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClassName}
              onSelect={() => onTogglePinned?.(item.href)}
            >
              <Pin
                aria-hidden="true"
                className="size-4 text-workspace-subtle"
              />
              {pinned ? "Desafixar da Barra Lateral" : "Fixar na Barra Lateral"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className={menuItemClassName}>
              <Link
                href={`/configuracoes/tipos/${encodeURIComponent(item.label.toLowerCase())}`}
                onClick={onNavigate}
              >
                <Settings
                  aria-hidden="true"
                  className="size-4 text-workspace-subtle"
                />
                Configurações do Tipo de Objeto
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={menuItemClassName}
              onSelect={() => importInputRef.current?.click()}
            >
              <Upload
                aria-hidden="true"
                className="size-4 text-workspace-subtle"
              />
              Importar
              <DropdownMenuShortcut>CtrlI</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <input
        className="sr-only"
        onChange={(event) =>
          setImportedFileName(event.currentTarget.files?.[0]?.name ?? null)
        }
        ref={importInputRef}
        tabIndex={-1}
        type="file"
      />
      <span aria-live="polite" className="sr-only">
        {importedFileName ? `Arquivo selecionado: ${importedFileName}` : ""}
      </span>
    </div>
  );
}

function TopRailTab({
  active = false,
  icon: Icon,
  label,
  onActivate,
  onClose,
  tabId,
}: {
  active?: boolean;
  icon: LucideIcon;
  label: string;
  onActivate: () => void;
  onClose: () => void;
  tabId: ContextTabId;
}) {
  return (
    <div
      className="outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 no-drag relative flex min-w-0 items-center transition-[width] duration-150 ease-out"
      draggable={false}
      style={{ maxWidth: 400, transition: "width 150ms ease-out", gap: "4px" }}
      data-dnd-type="draggable"
      data-dnd-item={tabId}
      data-sidepanel-tab-active={active ? "true" : "false"}
      data-dnd-id={tabId}
    >
      <span
        className={cn(
          "inline-flex max-w-full min-w-0 group/tab pointer-events-auto relative min-w-0 max-w-full rounded-md",
        )}
      >
        <div
          aria-selected={active}
          className={cn(
            "relative w-full flex min-w-0 items-center",
          )}
          data-context-tab={tabId}
          onClick={onActivate}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            onActivate();
          }}
          role="tab"
          tabIndex={0}
        >
            <span className="relative flex min-w-0 items-center">
            <span className="border-[0.5px] w-auto border-transparent text-primary relative flex h-8 min-h-8 min-w-0 cursor-pointer items-center gap-x-[0.3em] rounded-lg py-[3px] pl-[6px] pr-px text-[13px] leading-[1.3] transition duration-150 ease-out select-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 active:ring-0">
              <span
                className="inline-flex h-[1.3em] w-[1.3em] min-h-[1.3em] min-w-[1.3em] shrink-0 grow-0 items-center justify-center rounded-[0.33em]"
                style={{
                  backgroundColor: "var(--type-label-bg-gray)",
                  color: "var(--type-label-text-gray)",
                }}
              >
                <span
                  className="inline-flex size-full items-center justify-center [&>svg]:size-full"
                  style={{ verticalAlign: "-0.125em" }}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-full shrink-0 text-current"
                  />
                </span>
              </span>
              <span className="min-w-0 truncate text-left">{label}</span>
            </span>
          </span>
          <span
            className={cn(
              "flex h-full shrink-0 items-center pr-[2px] duration-200",
            )}
          >
            <div
              aria-label={`Fechar ${label}`}
              className={cn(
                "bg-transparent has-touch:hover:bg-front-hover mobile:active:bg-front-hover hover:bg-front-hover border border-transparent text-secondary hover:text-primary active:text-state-active active:brightness-95 w-[18px] h-sm text-xs justify-center ring-state-active box-border cursor-pointer gap-x-1.5 max-w-full truncate rounded-base phone:rounded-xl relative shrink-0 items-center transition-[opacity] duration-100 ease-out no-drag opacity-0 pointer-events-none group-hover/tab:opacity-100 group-hover/tab:pointer-events-auto",
              )}
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                onClose();
              }}
              role="button"
              tabIndex={0}
            >
              <span className="inline-flex size-[1em] shrink-0 grow-0 items-center justify-center leading-none relative">
                <span className="inline-flex size-full items-center justify-center [&>svg]:size-full">
                  <X aria-hidden="true" className="size-3" />
                </span>
              </span>
            </div>
          </span>
        </div>
      </span>
    </div>
  );
}

function IconButton({
  buttonRef,
  className = "",
  icon: Icon,
  iconClassName = "size-[18px]",
  label,
  onClick,
  pressed,
}: {
  buttonRef?: React.Ref<HTMLButtonElement>;
  className?: string;
  icon: LucideIcon;
  iconClassName?: string;
  label: string;
  onClick?: () => void;
  pressed?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          aria-pressed={pressed}
          className={cn("size-8", className)}
          onClick={onClick}
          ref={buttonRef}
          size="icon"
          type="button"
        >
          <Icon aria-hidden="true" className={iconClassName} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarIconButton({
  className = "",
  label,
  name,
  onClick,
}: {
  className?: string;
  label: string;
  name: CapacitiesSidebarIconName;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          className={cn("size-8", className)}
          onClick={onClick}
          size="icon"
          type="button"
        >
          <CapacitiesSidebarIcon
            aria-hidden="true"
            className="size-[18px]"
            name={name}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
