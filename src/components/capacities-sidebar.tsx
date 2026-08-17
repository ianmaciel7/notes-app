"use client";

import { ChevronDown, ChevronUp, Ellipsis, Plus } from "lucide-react";
import {
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { CapacitiesSidebarIcon, type CapacitiesSidebarIconName } from "@/components/capacities-sidebar-icon";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type SectionKey = "pinned" | "types" | "help";
type PinnedSort = "manual" | "alphabetical";

type SidebarCustomSection = {
  id: string;
  label: string;
  open: boolean;
};

type SidebarState = {
  openSections: {
    pinned: boolean;
    types: boolean;
    help: boolean;
  };
  pinnedPage: boolean;
  pinnedSort: PinnedSort;
  customSections: SidebarCustomSection[];
};

type CapacitiesSidebarProps = {
  onOpenDocument: () => void;
  onOpenExplore: () => void;
  onOpenSearch: () => void;
  onOpenCalendar?: () => void;
};

const STORAGE_KEY_V4 = "notes-app:capacities-shell:v4";
const STORAGE_KEY_V3 = "notes-app:capacities-sidebar:v3";
const STORAGE_KEY_V2 = "notes-app:capacities-sidebar:v2";

const DEFAULT_STATE: SidebarState = {
  openSections: {
    pinned: true,
    types: true,
    help: true,
  },
  pinnedPage: false,
  pinnedSort: "manual",
  customSections: [],
};

type SidebarMigrationStatus = "none" | "v2" | "v3";

function createSectionId() {
  const randomSuffix = Math.random().toString(36).slice(2, 10);
  return `section-${Date.now().toString(36)}-${randomSuffix}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return value === true ? true : value === false ? false : fallback;
}

function asSort(value: unknown): PinnedSort {
  return value === "alphabetical" ? "alphabetical" : "manual";
}

function asOpenSections(value: unknown): SidebarState["openSections"] {
  if (!isRecord(value)) {
    return { pinned: true, types: true, help: true };
  }

  return {
    pinned: asBoolean(value.pinned, true),
    types: asBoolean(value.types, true),
    help: asBoolean(value.help, true),
  };
}

function parseV2CustomSections(
  raw: unknown,
  rawOpen: unknown,
): SidebarCustomSection[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const rawOpenRecord = isRecord(rawOpen) ? rawOpen : {};
  return raw
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      if (typeof item.id !== "string" || typeof item.label !== "string") {
        return null;
      }

      return {
        id: item.id,
        label: item.label,
        open: asBoolean((rawOpenRecord as Record<string, unknown>)[item.id], true),
      };
    })
    .filter((section): section is SidebarCustomSection => section !== null);
}

function parseFromV2(raw: unknown): SidebarState | null {
  if (!isRecord(raw)) {
    return null;
  }

  return {
    openSections: asOpenSections((raw as { openSections: unknown }).openSections),
    pinnedPage: asBoolean((raw as { pinnedPage: unknown }).pinnedPage, false),
    pinnedSort: asSort((raw as { pinnedSort: unknown }).pinnedSort),
    customSections: parseV2CustomSections(
      (raw as { customSections: unknown }).customSections,
      (raw as { customOpen: unknown }).customOpen,
    ),
  };
}

function parseFromV3(raw: unknown): SidebarState | null {
  if (!isRecord(raw)) {
    return null;
  }

  if (
    !isRecord(raw.openSections) ||
    !Array.isArray(raw.customSections) ||
    typeof raw.pinnedPage !== "boolean" ||
    (raw.pinnedSort !== "manual" && raw.pinnedSort !== "alphabetical")
  ) {
    return null;
  }

  return {
    openSections: asOpenSections(raw.openSections),
    pinnedPage: asBoolean(raw.pinnedPage, false),
    pinnedSort: asSort(raw.pinnedSort),
    customSections: parseV3CustomSections((raw as { customSections: unknown }).customSections),
  };
}

function parseV3CustomSections(raw: unknown): SidebarCustomSection[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((section) => {
      if (!isRecord(section)) {
        return null;
      }

      if (typeof section.id !== "string" || typeof section.label !== "string") {
        return null;
      }

      return {
        id: section.id,
        label: section.label,
        open: asBoolean((section as { open: unknown }).open, true),
      };
    })
    .filter((section): section is SidebarCustomSection => section !== null);
}

function stopPropagation(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

function primarySortLabel(sort: PinnedSort) {
  return sort === "alphabetical" ? "Ordenar alfabeticamente" : "Ordenar manualmente";
}

function SectionHeader({
  children,
  count,
  icon,
  isOpen,
  onToggle,
  section,
  actions,
}: {
  children: string;
  count?: number;
  icon: CapacitiesSidebarIconName;
  isOpen: boolean;
  onToggle: () => void;
  section: string;
  actions?: ReactNode;
}) {
  return (
    <div className="cap-section-header" data-testid={`${section}-header`}>
      <SidebarGroupLabel
        onClick={onToggle}
        render={
          <button className="cap-section-title" type="button">
            <CapacitiesSidebarIcon name={icon} />

            <span className="cap-section-label">{children}</span>

            <span
              aria-hidden="true"
              className={`cap-section-chevron ${isOpen ? "cap-section-chevron-open" : ""}`}
            >
              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>
        }
      />

      {typeof count === "number" ? (
        <span aria-live="polite" className="cap-section-count">
          {count}
        </span>
      ) : null}

      {actions}
    </div>
  );
}

function NavItem({
  actions,
  children,
  icon,
  isActive,
  onClick,
}: {
  actions?: ReactNode;
  children?: string;
  icon: CapacitiesSidebarIconName;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="cap-nav-item"
        isActive={isActive}
        onClick={onClick}
        type="button"
      >
        <span className="cap-nav-icon">
          <CapacitiesSidebarIcon name={icon} />
        </span>

        <span className="cap-nav-label">{children}</span>
      </SidebarMenuButton>

      {actions}
    </SidebarMenuItem>
  );
}

function ObjectRow({
  children,
  count,
  icon,
  onClick,
  title,
  actions,
}: {
  children?: ReactNode;
  count?: number;
  icon: CapacitiesSidebarIconName;
  onClick: () => void;
  title: string;
  actions?: ReactNode;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        aria-label={`Abrir ${title}`}
        className="cap-object-row cap-object-row-active"
        onClick={onClick}
        size="default"
        type="button"
      >
        <span className="cap-object-icon">
          <CapacitiesSidebarIcon name={icon} />
        </span>

        <span className="cap-object-label">{title}</span>

        <SidebarMenuBadge>{count}</SidebarMenuBadge>
      </SidebarMenuButton>

      {children}
      {actions}
    </SidebarMenuItem>
  );
}

export function CapacitiesSidebar({
  onOpenCalendar = onOpenSearch,
  onOpenDocument,
  onOpenExplore,
  onOpenSearch,
}: CapacitiesSidebarProps) {
  const [state, setState] = useState<SidebarState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [migration, setMigration] = useState<SidebarMigrationStatus>("none");

  const pinnedCount = state.pinnedPage ? 1 : 0;

  useEffect(() => {
    let nextState: SidebarState | null = null;
    let migrationFrom: SidebarMigrationStatus = "none";

    try {
      const rawV4 = window.localStorage.getItem(STORAGE_KEY_V4);
      if (rawV4) {
        nextState = parseFromV3(JSON.parse(rawV4));
      }
    } catch {
      nextState = null;
    }

    if (!nextState) {
      try {
        const rawV3 = window.localStorage.getItem(STORAGE_KEY_V3);
        if (rawV3) {
          nextState = parseFromV3(JSON.parse(rawV3));
          if (nextState) {
            migrationFrom = "v3";
          }
        }
      } catch {
        nextState = null;
      }
    }

    if (!nextState) {
      try {
        const rawV2 = window.localStorage.getItem(STORAGE_KEY_V2);
        if (rawV2) {
          nextState = parseFromV2(JSON.parse(rawV2));
          if (nextState) {
            migrationFrom = "v2";
          }
        }
      } catch {
        nextState = null;
      }
    }

    setState(nextState ?? DEFAULT_STATE);
    setMigration(migrationFrom);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY_V4, JSON.stringify(state));

    if (migration === "v2") {
      window.localStorage.removeItem(STORAGE_KEY_V2);
      setMigration("none");
    }

    if (migration === "v3") {
      window.localStorage.removeItem(STORAGE_KEY_V3);
      setMigration("none");
    }
  }, [hydrated, migration, state]);

  const toggleSection = (section: SectionKey) => {
    setState((previous) => ({
      ...previous,
      openSections: {
        ...previous.openSections,
        [section]: !previous.openSections[section],
      },
    }));
  };

  const togglePinnedPage = () => {
    setState((previous) => ({
      ...previous,
      pinnedPage: !previous.pinnedPage,
    }));
  };

  const clearPinned = () => {
    setState((previous) => ({
      ...previous,
      pinnedPage: false,
    }));
  };

  const setPinnedSort = (sort: PinnedSort) => {
    setState((previous) => ({
      ...previous,
      pinnedSort: sort,
    }));
  };

  const setCustomSectionOpen = (id: string, open: boolean) => {
    setState((previous) => ({
      ...previous,
      customSections: previous.customSections.map((item) =>
        item.id === id ? { ...item, open } : item,
      ),
    }));
  };

  const removeCustomSection = (id: string) => {
    setState((previous) => ({
      ...previous,
      customSections: previous.customSections.filter((item) => item.id !== id),
    }));
  };

  const createSection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = sectionName.trim();
    if (!trimmed) {
      return;
    }

    setState((previous) => ({
      ...previous,
      customSections: [
        ...previous.customSections,
        { id: createSectionId(), label: trimmed, open: true },
      ],
    }));

    setSectionName("");
    setDialogOpen(false);
  };

  return (
    <Sidebar
      className="cap-sidebar"
      collapsible="offcanvas"
      side="left"
      variant="sidebar"
    >
      <SidebarHeader className="cap-sidebar-header">
        <button className="cap-sidebar-workspace-menu" type="button">
          <span className="cap-sidebar-main-icon">
            <CapacitiesSidebarIcon name="workspace" />
          </span>
          Teste
        </button>

        <SidebarMenu>
          <NavItem
            icon="add"
            onClick={onOpenDocument}
          >
            Novo
          </NavItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              aria-label="Abrir assistente"
              className="cap-assistant-button"
              onClick={onOpenSearch}
              size="icon-sm"
              type="button"
              showOnHover
            >
              <CapacitiesSidebarIcon name="assistant" />
              <span className="sr-only">Assistente de IA</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <NavItem
            icon="search"
            onClick={onOpenSearch}
          >
            Buscar
          </NavItem>

          <div className="cap-nav-gap" />

          <NavItem
            icon="rocket"
            onClick={onOpenExplore}
          >
            Explorar
          </NavItem>

          <NavItem
            icon="calendar"
            onClick={onOpenCalendar}
          >
            Calendário
          </NavItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="cap-sidebar-content">
        <SidebarGroup>
          <SectionHeader
            count={pinnedCount}
            icon="pin"
            isOpen={state.openSections.pinned}
            onToggle={() => toggleSection("pinned")}
            section="pinned"
          >
            Fixados
          </SectionHeader>

          <Collapsible open={state.openSections.pinned} onOpenChange={() => {}}>
            <CollapsibleContent>
              <SidebarGroupContent>
                {state.pinnedPage ? (
                  <SidebarMenu>
                    <ObjectRow
                      count={1}
                      icon="page"
                      onClick={onOpenDocument}
                      title="Páginas"
                      actions={
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <SidebarMenuAction
                                aria-label="Mais opções de Fixados"
                                className="cap-section-action-button"
                                onClick={stopPropagation}
                                showOnHover
                              >
                                <Ellipsis size={14} />
                              </SidebarMenuAction>
                            }
                          />

                          <DropdownMenuContent
                            align="start"
                            className="cap-dropdown-content"
                            sideOffset={4}
                          >
                            <DropdownMenuItem
                              className="cap-dropdown-item"
                              onClick={() => setPinnedSort("manual")}
                            >
                              Ordenar manualmente
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="cap-dropdown-item"
                              onClick={() => setPinnedSort("alphabetical")}
                            >
                              Ordenar alfabeticamente
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="cap-dropdown-item"
                              onClick={() =>
                                setPinnedSort(state.pinnedSort)
                              }
                            >
                              {primarySortLabel(state.pinnedSort)}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="cap-dropdown-separator" />

                            <DropdownMenuItem
                              className="cap-dropdown-item"
                              onClick={togglePinnedPage}
                            >
                              {state.pinnedPage
                                ? "Desafixar Páginas"
                                : "Fixar Páginas"}
                            </DropdownMenuItem>

                            {state.pinnedPage ? (
                              <DropdownMenuItem
                                className="cap-dropdown-item"
                                onClick={clearPinned}
                              >
                                Limpar Fixados
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      }
                    />
                  </SidebarMenu>
                ) : (
                  <p className="cap-empty">Nenhum conteúdo fixado</p>
                )}
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarGroup>
          <SectionHeader
            count={1}
            icon="types"
            isOpen={state.openSections.types}
            onToggle={() => toggleSection("types")}
            section="types"
          >
            Tipos de objeto
          </SectionHeader>

          <Collapsible open={state.openSections.types} onOpenChange={() => {}}>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <ObjectRow
                    count={1}
                    icon="page"
                    onClick={onOpenDocument}
                    title="Páginas"
                    actions={
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <SidebarMenuAction
                              aria-label="Mais opções de Página"
                              className="cap-object-menu-button"
                              onClick={stopPropagation}
                              showOnHover
                              size="icon-sm"
                            >
                              <Ellipsis size={13} />
                            </SidebarMenuAction>
                          }
                        />

                        <DropdownMenuContent
                          align="start"
                          className="cap-dropdown-content"
                          sideOffset={4}
                        >
                          <DropdownMenuItem
                            className="cap-dropdown-item"
                            onClick={onOpenDocument}
                          >
                            Abrir
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cap-dropdown-item"
                            onClick={onOpenDocument}
                          >
                            Criar Página
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cap-dropdown-item"
                            onClick={togglePinnedPage}
                          >
                            {state.pinnedPage
                              ? "Desafixar da Barra Lateral"
                              : "Fixar na Barra Lateral"}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cap-dropdown-item"
                            onClick={onOpenSearch}
                          >
                            Nova Query
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cap-dropdown-item"
                            onClick={onOpenSearch}
                          >
                            Nova Coleção
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cap-dropdown-item"
                            onClick={onOpenExplore}
                          >
                            Configurações do Tipo de Objeto
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    }
                  />

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      aria-label="Adicionar seção"
                      className="cap-add-section"
                      onClick={() => setDialogOpen(true)}
                      size="default"
                      variant="default"
                      type="button"
                    >
                      <Plus className="cap-add-section-icon" />
                      <span>Adicionar seção</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {state.customSections.length > 0 ? (
          <div data-testid="custom-sections">
            {state.customSections.map((section) => (
              <SidebarGroup key={section.id} className="cap-custom-section">
                <SectionHeader
                  icon="file"
                  isOpen={section.open}
                  onToggle={() => setCustomSectionOpen(section.id, !section.open)}
                  section={`custom:${section.id}`}
                  actions={
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <SidebarGroupAction
                            aria-label={`Opções de ${section.label}`}
                            className="cap-section-action-button"
                            onClick={stopPropagation}
                            showOnHover
                          >
                            <Ellipsis size={13} />
                          </SidebarGroupAction>
                        }
                      />

                      <DropdownMenuContent
                        align="start"
                        className="cap-dropdown-content"
                        sideOffset={4}
                      >
                        <DropdownMenuItem
                          className="cap-dropdown-item"
                          onClick={() => setCustomSectionOpen(section.id, !section.open)}
                        >
                          {section.open ? "Ocultar seção" : "Mostrar seção"}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="cap-dropdown-separator" />

                        <DropdownMenuItem
                          className="cap-dropdown-item"
                          onClick={() => removeCustomSection(section.id)}
                        >
                          Remover seção
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                >
                  {section.label}
                </SectionHeader>

                <Collapsible open={section.open} onOpenChange={() => {}}>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <p className="cap-sidebar-empty">Sem itens</p>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarGroup>
            ))}
          </div>
        ) : null}

        <SidebarGroup data-testid="trash-section">
          <NavItem icon="trash" onClick={() => {}}>Lixeira</NavItem>
        </SidebarGroup>

        <SidebarGroup data-testid="help-section">
          <SectionHeader
            icon="help"
            isOpen={state.openSections.help}
            onToggle={() => toggleSection("help")}
            section="help"
          >
            Ajuda e recursos
          </SectionHeader>

          <Collapsible open={state.openSections.help} onOpenChange={() => {}}>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <NavItem icon="graduation" onClick={onOpenExplore}>
                    Primeiros passos
                  </NavItem>

                  <NavItem icon="chat" onClick={onOpenSearch}>
                    Fazer uma pergunta
                  </NavItem>

                  <NavItem icon="documentation" onClick={onOpenExplore}>
                    Documentação
                  </NavItem>

                  <NavItem icon="news" onClick={onOpenExplore}>
                    Novidades
                  </NavItem>

                  <NavItem icon="feedback" onClick={onOpenSearch}>
                    Feedback
                  </NavItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="cap-sidebar-footer" data-testid="sidebar-footer">
        <NavItem icon="settings" onClick={() => {}}>
          Configurações
        </NavItem>

        <NavItem icon="moon" onClick={() => {}}>
          Tema
        </NavItem>

        <NavItem icon="user" onClick={() => {}}>
          Perfil
        </NavItem>

        <button className="cap-pro-pill" type="button">
          <CapacitiesSidebarIcon name="rocket" />
          <span>Pro</span>
        </button>

        <div className="cap-grow" />

        <NavItem icon="share" onClick={() => {}}>
          Compartilhar
        </NavItem>
      </SidebarFooter>

      <SidebarRail />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="cap-sidebar-dialog">
          <DialogHeader>
            <DialogTitle>Adicionar seção</DialogTitle>
            <DialogDescription>
              Nomeie a nova seção personalizada para organizar itens dentro da
              barra lateral.
            </DialogDescription>
          </DialogHeader>

          <form className="cap-sidebar-dialog-form" onSubmit={createSection}>
            <label className="cap-sidebar-dialog-field" htmlFor="cap-section-name">
              Nome da seção
            </label>
            <Input
              autoFocus
              id="cap-section-name"
              onChange={(event) => setSectionName(event.target.value)}
              placeholder="Ex.: Projetos"
              type="text"
              value={sectionName}
            />

            <DialogFooter className="cap-sidebar-dialog-actions">
              <Button
                onClick={() => {
                  setDialogOpen(false);
                  setSectionName("");
                }}
                type="button"
                variant="outline"
              >
                Cancelar
              </Button>

              <Button disabled={!sectionName.trim()} type="submit">
                Criar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
