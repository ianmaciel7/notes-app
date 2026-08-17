"use client";

import { ChevronDown, ChevronUp, Ellipsis, Plus } from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import {
  CapacitiesSidebarIcon,
  type CapacitiesSidebarIconName,
} from "@/components/capacities-sidebar-icon";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
};

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

function toOpenSections(value: unknown): SidebarState["openSections"] {
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
        open: asBoolean(
          (rawOpenRecord as Record<string, unknown>)[item.id],
          true,
        ),
      };
    })
    .filter((item): item is SidebarCustomSection => item !== null);
}

function fromV2State(raw: unknown): SidebarState | null {
  if (!isRecord(raw)) {
    return null;
  }

  const candidate = {
    openSections: toOpenSections(
      (raw as { openSections: unknown }).openSections,
    ),
    pinnedPage: asBoolean((raw as { pinnedPage: unknown }).pinnedPage, false),
    pinnedSort: asSort((raw as { pinnedSort: unknown }).pinnedSort),
    customSections: parseV2CustomSections(
      (raw as { customSections: unknown }).customSections,
      (raw as { customOpen: unknown }).customOpen,
    ),
  };

  return candidate;
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

function fromV3State(raw: unknown): SidebarState | null {
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
    openSections: toOpenSections(raw.openSections),
    pinnedPage: asBoolean(raw.pinnedPage, false),
    pinnedSort: asSort(raw.pinnedSort),
    customSections: parseV3CustomSections(
      (raw as { customSections: unknown }).customSections,
    ),
  };
}

function toLabelSortText(sort: PinnedSort) {
  return sort === "alphabetical"
    ? "Ordenar alfabeticamente"
    : "Ordenar manualmente";
}

function SidebarNavItem({
  children,
  icon,
  label,
  onClick,
}: {
  children?: string;
  icon: CapacitiesSidebarIconName;
  label?: string;
  onClick: () => void;
}) {
  const text = children ?? label ?? "";
  return (
    <Button
      aria-label={label ?? text}
      className="cap-nav-item"
      onClick={onClick}
      size="default"
      variant="ghost"
      type="button"
    >
      <span className="cap-nav-icon">
        <CapacitiesSidebarIcon name={icon} />
      </span>

      <span className="cap-nav-label">{text}</span>
    </Button>
  );
}

function SectionHeader({
  actions,
  children,
  count,
  icon,
  open,
  onToggle,
  section,
}: {
  actions?: ReactNode;
  children: string;
  count?: number;
  icon: CapacitiesSidebarIconName;
  open: boolean;
  onToggle: () => void;
  section: SectionKey | `custom:${string}`;
}) {
  return (
    <div className="cap-section-header" data-testid={`${section}-header`}>
      <button
        aria-controls={`${section}-content`}
        aria-expanded={open}
        className="cap-section-title"
        onClick={onToggle}
        type="button"
      >
        <CapacitiesSidebarIcon name={icon} />

        <span className="cap-section-label">{children}</span>

        <span
          aria-hidden="true"
          className={`cap-section-chevron ${open ? "cap-section-chevron-open" : ""}`}
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {typeof count === "number" ? (
        <span className="cap-section-count" aria-live="polite">
          {count}
        </span>
      ) : null}

      {actions ? <div className="cap-section-actions">{actions}</div> : null}
    </div>
  );
}

function SidebarObjectRow({
  actions,
  children,
  count = 1,
  icon,
  onClick,
  testId,
  title,
}: {
  actions?: ReactNode;
  children?: ReactNode;
  count?: number;
  icon: CapacitiesSidebarIconName;
  onClick: () => void;
  testId?: string;
  title: string;
}) {
  return (
    <div className="cap-object-row-shell" data-testid={testId}>
      <Button
        aria-label={`Abrir ${title}`}
        className="cap-object-row cap-object-row-active"
        onClick={onClick}
        size="default"
        variant="ghost"
        type="button"
      >
        <span className="cap-object-icon">
          <CapacitiesSidebarIcon name={icon} />
        </span>

        <span className="cap-object-label">{title}</span>

        <span className="cap-object-count" aria-live="polite">
          {count}
        </span>
      </Button>

      <div
        className="cap-object-menu-trigger"
        data-testid={testId ? `${testId}-menu` : undefined}
      >
        {children}
        {actions}
      </div>
    </div>
  );
}

export function CapacitiesSidebar({
  onOpenDocument,
  onOpenExplore,
  onOpenSearch,
}: CapacitiesSidebarProps) {
  const [state, setState] = useState<SidebarState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [needsCleanupV2, setNeedsCleanupV2] = useState(false);

  const pinnedCount = state.pinnedPage ? 1 : 0;

  useEffect(() => {
    let nextState: SidebarState | null = null;
    let migratedFromV2 = false;

    try {
      const rawV3 = window.localStorage.getItem(STORAGE_KEY_V3);
      if (rawV3) {
        nextState = fromV3State(JSON.parse(rawV3));
      }
    } catch {
      nextState = null;
    }

    if (!nextState) {
      try {
        const rawV2 = window.localStorage.getItem(STORAGE_KEY_V2);
        if (rawV2) {
          const parsedV2 = fromV2State(JSON.parse(rawV2));
          if (parsedV2) {
            nextState = parsedV2;
            migratedFromV2 = true;
          }
        }
      } catch {
        nextState = null;
      }
    }

    setState(nextState ?? DEFAULT_STATE);
    setNeedsCleanupV2(migratedFromV2);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(state));

    if (needsCleanupV2) {
      window.localStorage.removeItem(STORAGE_KEY_V2);
      setNeedsCleanupV2(false);
    }
  }, [hydrated, needsCleanupV2, state]);

  const toggleSection = (section: SectionKey) => {
    setState((previous) => ({
      ...previous,
      openSections: {
        ...previous.openSections,
        [section]: !previous.openSections[section],
      },
    }));
  };

  const togglePinnedSort = (sort: PinnedSort) => {
    setState((previous) => ({
      ...previous,
      pinnedSort: sort,
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

  const setCustomSectionOpen = (id: string, open: boolean) => {
    setState((previous) => ({
      ...previous,
      customSections: previous.customSections.map((section) =>
        section.id === id ? { ...section, open } : section,
      ),
    }));
  };

  const removeCustomSection = (id: string) => {
    setState((previous) => ({
      ...previous,
      customSections: previous.customSections.filter(
        (section) => section.id !== id,
      ),
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
    <aside className="cap-sidebar" aria-label="Barra lateral">
      <div className="cap-sidebar-primary">
        <div className="cap-new-row">
          <SidebarNavItem
            icon="add"
            label="Criar novo documento"
            onClick={onOpenDocument}
          >
            Novo
          </SidebarNavItem>

          <Button
            aria-label="Abrir assistente"
            className="cap-assistant-button"
            onClick={onOpenSearch}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <CapacitiesSidebarIcon name="assistant" />
            <span className="sr-only">Assistente de IA</span>
          </Button>
        </div>

        <SidebarNavItem icon="search" label="Buscar" onClick={onOpenSearch}>
          Buscar
        </SidebarNavItem>

        <div className="cap-nav-gap" />

        <SidebarNavItem icon="rocket" label="Explorar" onClick={onOpenExplore}>
          Explorar
        </SidebarNavItem>

        <SidebarNavItem
          icon="calendar"
          label="Calendário"
          onClick={onOpenExplore}
        >
          Calendário
        </SidebarNavItem>
      </div>

      <ScrollArea className="cap-sidebar-scroll" data-testid="sidebar-scroll">
        <div className="cap-sidebar-content">
          <section className="cap-sidebar-section" data-testid="pinned-section">
            <SectionHeader
              count={pinnedCount}
              icon="pin"
              onToggle={() => toggleSection("pinned")}
              open={state.openSections.pinned}
              section="pinned"
            >
              Fixados
            </SectionHeader>

            <Collapsible open={state.openSections.pinned} id="pinned-content">
              <CollapsibleContent className="cap-sidebar-block">
                {state.pinnedPage ? (
                  <SidebarObjectRow
                    count={1}
                    icon="page"
                    onClick={onOpenDocument}
                    testId="pinned-page-row"
                    title="Páginas"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            aria-label="Mais opções de Fixados"
                            className="cap-section-action-button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            <Ellipsis size={13} />
                          </Button>
                        }
                      />

                      <DropdownMenuContent
                        align="start"
                        className="cap-dropdown-content"
                        sideOffset={4}
                      >
                        <DropdownMenuItem
                          className="cap-dropdown-item"
                          onClick={() => togglePinnedSort("manual")}
                        >
                          Ordenar manualmente
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cap-dropdown-item"
                          onClick={() => togglePinnedSort("alphabetical")}
                        >
                          Ordenar alfabeticamente
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cap-dropdown-item"
                          onClick={() => {
                            onOpenSearch();
                          }}
                        >
                          {toLabelSortText(state.pinnedSort)}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="cap-dropdown-separator" />

                        <DropdownMenuItem
                          className="cap-dropdown-item"
                          onClick={() => {
                            setState((previous) => ({
                              ...previous,
                              pinnedPage: !previous.pinnedPage,
                            }));
                          }}
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
                  </SidebarObjectRow>
                ) : (
                  <p className="cap-sidebar-empty">Nenhum conteúdo fixado</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </section>

          <section className="cap-sidebar-section" data-testid="types-section">
            <SectionHeader
              count={1}
              icon="types"
              onToggle={() => toggleSection("types")}
              open={state.openSections.types}
              section="types"
            >
              Tipos de objeto
            </SectionHeader>

            <Collapsible open={state.openSections.types} id="types-content">
              <CollapsibleContent className="cap-sidebar-block">
                <SidebarObjectRow
                  icon="page"
                  onClick={onOpenDocument}
                  testId="types-page-row"
                  title="Páginas"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          aria-label="Mais opções de Página"
                          className="cap-object-menu-button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          <Ellipsis size={13} />
                        </Button>
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
                </SidebarObjectRow>

                <Button
                  aria-label="Adicionar seção"
                  className="cap-add-section"
                  onClick={() => setDialogOpen(true)}
                  size="default"
                  variant="ghost"
                >
                  <Plus className="cap-add-section-icon" size={14} />
                  <span>Adicionar seção</span>
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </section>

          {state.customSections.length > 0 ? (
            <div>
              {state.customSections.map((section) => (
                <section
                  className="cap-sidebar-section cap-custom-section"
                  key={section.id}
                >
                  <SectionHeader
                    icon="file"
                    onToggle={() =>
                      setCustomSectionOpen(section.id, !section.open)
                    }
                    open={section.open}
                    section={`custom:${section.id}`}
                    actions={
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              aria-label={`Opções de ${section.label}`}
                              className="cap-section-action-button"
                              size="icon-sm"
                              variant="ghost"
                            >
                              <Ellipsis size={13} />
                            </Button>
                          }
                        />

                        <DropdownMenuContent
                          align="start"
                          className="cap-dropdown-content"
                          sideOffset={4}
                        >
                          <DropdownMenuItem
                            className="cap-dropdown-item"
                            onClick={() =>
                              setCustomSectionOpen(section.id, !section.open)
                            }
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

                  <Collapsible
                    open={section.open}
                    id={`custom:${section.id}-content`}
                  >
                    <CollapsibleContent className="cap-sidebar-block">
                      <p className="cap-sidebar-empty">Sem itens</p>
                    </CollapsibleContent>
                  </Collapsible>
                </section>
              ))}
            </div>
          ) : null}

          <section
            className="cap-sidebar-section cap-sidebar-trash"
            data-testid="trash-section"
          >
            <SidebarNavItem icon="trash" label="Lixeira" onClick={() => {}}>
              Lixeira
            </SidebarNavItem>
          </section>

          <section className="cap-sidebar-section" data-testid="help-section">
            <SectionHeader
              icon="help"
              onToggle={() => toggleSection("help")}
              open={state.openSections.help}
              section="help"
            >
              Ajuda e recursos
            </SectionHeader>

            <Collapsible open={state.openSections.help}>
              <CollapsibleContent className="cap-sidebar-block">
                <div className="cap-help-rows">
                  <SidebarNavItem
                    icon="graduation"
                    label="Primeiros passos"
                    onClick={onOpenExplore}
                  >
                    Primeiros passos
                  </SidebarNavItem>

                  <SidebarNavItem
                    icon="chat"
                    label="Fazer uma pergunta"
                    onClick={onOpenSearch}
                  >
                    Fazer uma pergunta
                  </SidebarNavItem>

                  <SidebarNavItem
                    icon="documentation"
                    label="Documentação"
                    onClick={onOpenExplore}
                  >
                    Documentação
                  </SidebarNavItem>

                  <SidebarNavItem
                    icon="news"
                    label="Novidades"
                    onClick={onOpenExplore}
                  >
                    Novidades
                  </SidebarNavItem>

                  <SidebarNavItem
                    icon="feedback"
                    label="Feedback"
                    onClick={onOpenSearch}
                  >
                    Feedback
                  </SidebarNavItem>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </section>
        </div>
      </ScrollArea>

      <footer className="cap-sidebar-footer" data-testid="sidebar-footer">
        <Button aria-label="Configurações" size="icon-sm" variant="ghost">
          <CapacitiesSidebarIcon name="settings" />
        </Button>

        <Button aria-label="Tema" size="icon-sm" variant="ghost">
          <CapacitiesSidebarIcon name="moon" />
        </Button>

        <Button aria-label="Perfil" size="icon-sm" variant="ghost">
          <CapacitiesSidebarIcon name="user" />
        </Button>

        <button className="cap-pro-pill" type="button">
          <CapacitiesSidebarIcon name="rocket" />
          <span>Pro</span>
        </button>

        <div className="cap-grow" />

        <Button aria-label="Compartilhar" size="icon-sm" variant="ghost">
          <CapacitiesSidebarIcon name="share" />
        </Button>
      </footer>

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
            <label
              className="cap-sidebar-dialog-field"
              htmlFor="cap-section-name"
            >
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
    </aside>
  );
}
