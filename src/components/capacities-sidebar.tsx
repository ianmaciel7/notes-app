"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CapacitiesSidebarIcon,
  type CapacitiesSidebarIconName,
} from "@/components/capacities-sidebar-icon";

type SectionKey = "pinned" | "types" | "help";
type MenuKey = "pinned" | "page" | null;
type PinnedSort = "manual" | "alphabetical";

type CustomSection = {
  id: string;
  label: string;
};

type OpenSections = Record<SectionKey, boolean>;

type SidebarState = {
  openSections: OpenSections;
  pinnedPage: boolean;
  pinnedSort: PinnedSort;
  customSections: CustomSection[];
  customOpen: Record<string, boolean>;
};

const STORAGE_KEY = "notes-app:capacities-sidebar:v2";

const DEFAULT_STATE: SidebarState = {
  openSections: {
    pinned: true,
    types: true,
    help: true,
  },
  pinnedPage: false,
  pinnedSort: "manual",
  customSections: [],
  customOpen: {},
};

type UiIconName = "chevron-down" | "chevron-up" | "dots" | "plus" | "search";

type CapacitiesSidebarProps = {
  onOpenDocument: () => void;
  onOpenExplore: () => void;
  onOpenSearch: () => void;
};

const uiIconPaths: Record<UiIconName, ReactNode> = {
  "chevron-down": (
    <>
      <path d="m6 9 6 6 6-6" />
    </>
  ),
  "chevron-up": (
    <>
      <path d="m6 15 6-6 6 6" />
    </>
  ),
  dots: (
    <>
      <circle cx="5" cy="12" r="1.25" />
      <circle cx="12" cy="12" r="1.25" />
      <circle cx="19" cy="12" r="1.25" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
};

function isSidebarState(value: unknown): value is Partial<SidebarState> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function Icon({ className, name }: { className?: string; name: UiIconName }) {
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

function ActionIconButton({
  "aria-label": ariaLabel,
  children,
  onClick,
  title,
}: {
  "aria-label": string;
  children: ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className="cap-section-action-button"
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

function SidebarNavItem({
  children,
  count,
  icon,
  onClick,
}: {
  children: ReactNode;
  count?: number;
  icon: CapacitiesSidebarIconName;
  onClick?: () => void;
}) {
  return (
    <button className="cap-nav-item" onClick={onClick} type="button">
      <span className="cap-nav-icon">
        <CapacitiesSidebarIcon name={icon} />
      </span>
      <span className="cap-nav-label">{children}</span>
      {typeof count === "number" ? (
        <span className="cap-nav-count">{count}</span>
      ) : null}
    </button>
  );
}

function SectionHeader({
  children,
  count,
  icon,
  expanded,
  onToggle,
  onAdd,
  onMenu,
  menuOpen,
}: {
  children: ReactNode;
  count?: number;
  icon: CapacitiesSidebarIconName;
  expanded: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  onMenu?: () => void;
  menuOpen?: boolean;
}) {
  return (
    <div className="cap-section-header">
      <button
        aria-expanded={expanded}
        className="cap-section-title"
        onClick={onToggle}
        type="button"
      >
        <CapacitiesSidebarIcon name={icon} />
        <span className="cap-section-label">{children}</span>
        {typeof count === "number" ? (
          <span className="cap-section-count">{count}</span>
        ) : null}
        <span className="cap-section-chevron" aria-hidden="true">
          <Icon name={expanded ? "chevron-up" : "chevron-down"} />
        </span>
      </button>

      <div className="cap-section-actions">
        {onAdd ? (
          <ActionIconButton
            aria-label="Adicionar"
            onClick={onAdd}
            title="Adicionar"
          >
            <Icon name="plus" />
          </ActionIconButton>
        ) : null}
        {onMenu ? (
          <ActionIconButton
            aria-label={menuOpen ? "Ocultar opções" : "Mais opções"}
            aria-expanded={menuOpen}
            onClick={onMenu}
            title={menuOpen ? "Ocultar opções" : "Mais opções"}
          >
            <Icon name="dots" />
          </ActionIconButton>
        ) : null}
      </div>
    </div>
  );
}

function MenuItem({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button className="cap-sidebar-menu-item" onClick={onClick} type="button">
      {children}
    </button>
  );
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Main component contains intentional branching per sidebar interaction states.
export function CapacitiesSidebar({
  onOpenDocument,
  onOpenExplore,
  onOpenSearch,
}: CapacitiesSidebarProps) {
  const [state, setState] = useState<SidebarState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [menuOpen, setMenuOpen] = useState<MenuKey>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sectionName, setSectionName] = useState("");

  const pinnedRowMenuRef = useRef<HTMLDivElement>(null);
  const pageRowMenuRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const sectionNameInputRef = useRef<HTMLInputElement>(null);

  const pinnedCount = state.pinnedPage ? 1 : 0;

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);

        if (isSidebarState(parsed)) {
          const saved = parsed as Partial<SidebarState>;

          setState({
            ...DEFAULT_STATE,
            ...saved,
            openSections: {
              ...DEFAULT_STATE.openSections,
              ...saved.openSections,
            },
            customOpen: saved.customOpen ?? {},
            customSections: saved.customSections ?? [],
          });
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setMenuOpen(null);
      setDialogOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    const closeOnPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (!target) {
        return;
      }

      if (
        menuOpen === "pinned" &&
        pinnedRowMenuRef.current &&
        !pinnedRowMenuRef.current.contains(target)
      ) {
        setMenuOpen(null);
      }

      if (
        menuOpen === "page" &&
        pageRowMenuRef.current &&
        !pageRowMenuRef.current.contains(target)
      ) {
        setMenuOpen(null);
      }

      if (
        dialogOpen &&
        dialogRef.current &&
        !dialogRef.current.contains(target)
      ) {
        setDialogOpen(false);
      }
    };

    window.addEventListener("pointerdown", closeOnPointerDown);

    return () => {
      window.removeEventListener("pointerdown", closeOnPointerDown);
    };
  }, [dialogOpen, menuOpen]);

  useEffect(() => {
    if (!dialogOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      sectionNameInputRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [dialogOpen]);

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
    setMenuOpen(null);
  };

  const togglePinPage = () => {
    setState((previous) => ({
      ...previous,
      pinnedPage: !previous.pinnedPage,
    }));
    setMenuOpen(null);
  };

  const clearPinned = () => {
    setState((previous) => ({
      ...previous,
      pinnedPage: false,
    }));
    setMenuOpen(null);
  };

  const toggleSectionMenu = (key: MenuKey) => {
    setMenuOpen((current) => (current === key ? null : key));
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const createSection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const label = sectionName.trim();
    if (!label) {
      return;
    }

    const id = `section-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 9)}`;

    setState((previous) => ({
      ...previous,
      customSections: [...previous.customSections, { id, label }],
      customOpen: {
        ...previous.customOpen,
        [id]: true,
      },
    }));

    setSectionName("");
    setDialogOpen(false);
  };

  const removeSection = (id: string) => {
    setState((previous) => {
      const customOpen = { ...previous.customOpen };
      delete customOpen[id];

      return {
        ...previous,
        customSections: previous.customSections.filter(
          (section) => section.id !== id,
        ),
        customOpen,
      };
    });
  };

  const toggleCustomSection = (id: string) => {
    setState((previous) => ({
      ...previous,
      customOpen: {
        ...previous.customOpen,
        [id]: !previous.customOpen[id],
      },
    }));
  };

  return (
    <aside className="cap-sidebar">
      <div className="cap-sidebar-primary">
        <div className="cap-new-row">
          <SidebarNavItem icon="add" onClick={onOpenDocument}>
            Novo
          </SidebarNavItem>
          <button
            aria-label="Abrir assistente de IA"
            className="cap-assistant-button"
            onClick={onOpenExplore}
            type="button"
          >
            <CapacitiesSidebarIcon name="assistant" />
          </button>
        </div>

        <SidebarNavItem icon="search" onClick={onOpenSearch}>
          Buscar
        </SidebarNavItem>

        <div className="cap-nav-gap" />

        <SidebarNavItem icon="rocket" onClick={onOpenExplore}>
          Explorar
        </SidebarNavItem>

        <SidebarNavItem icon="calendar">Calendário</SidebarNavItem>
      </div>

      <div className="cap-sidebar-scroll">
        <section className="cap-sidebar-section">
          <SectionHeader
            count={pinnedCount}
            expanded={state.openSections.pinned}
            icon="pin"
            menuOpen={menuOpen === "pinned"}
            onAdd={() => {
              if (!state.pinnedPage) {
                togglePinPage();
              }
              setMenuOpen(null);
            }}
            onMenu={() => toggleSectionMenu("pinned")}
            onToggle={() => toggleSection("pinned")}
          >
            Fixados
          </SectionHeader>

          {state.openSections.pinned ? (
            <div className="cap-sidebar-block">
              {state.pinnedPage ? (
                <button
                  aria-current="page"
                  aria-label="Abrir página"
                  className="cap-object-row cap-object-row-active"
                  onClick={onOpenDocument}
                  type="button"
                >
                  <span className="cap-object-icon">
                    <CapacitiesSidebarIcon name="page" />
                  </span>

                  <span className="cap-object-label">Páginas</span>

                  <span className="cap-object-count">1</span>
                </button>
              ) : (
                <p className="cap-empty">Nenhum conteúdo fixado</p>
              )}

              <div className="cap-sidebar-menu-wrap" ref={pinnedRowMenuRef}>
                {menuOpen === "pinned" ? (
                  <div className="cap-sidebar-menu">
                    <MenuItem onClick={() => togglePinnedSort("manual")}>
                      Ordenar manualmente
                    </MenuItem>
                    <MenuItem onClick={() => togglePinnedSort("alphabetical")}>
                      Ordenar alfabeticamente
                    </MenuItem>
                    <MenuItem onClick={togglePinPage}>
                      {state.pinnedPage ? "Desafixar Páginas" : "Fixar Páginas"}
                    </MenuItem>
                    {state.pinnedPage ? (
                      <MenuItem onClick={clearPinned}>Limpar fixados</MenuItem>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        <section className="cap-sidebar-section">
          <SectionHeader
            count={1}
            expanded={state.openSections.types}
            icon="types"
            onToggle={() => toggleSection("types")}
          >
            Tipos de objeto
          </SectionHeader>

          {state.openSections.types ? (
            <div className="cap-sidebar-block">
              <div className="cap-object-row-shell" ref={pageRowMenuRef}>
                <button
                  aria-label="Abrir Páginas"
                  aria-current="page"
                  className="cap-object-row cap-object-row-active"
                  onClick={onOpenDocument}
                  type="button"
                >
                  <span className="cap-object-icon">
                    <CapacitiesSidebarIcon name="page" />
                  </span>
                  <span className="cap-object-label">Páginas</span>
                  <span className="cap-object-count">1</span>
                </button>

                <button
                  aria-expanded={menuOpen === "page"}
                  aria-label="Mais opções do tipo"
                  className="cap-object-menu-toggle"
                  onClick={() => {
                    toggleSectionMenu("page");
                  }}
                  type="button"
                >
                  <Icon name="dots" />
                </button>

                {menuOpen === "page" ? (
                  <div className="cap-sidebar-menu">
                    <MenuItem onClick={onOpenDocument}>Abrir</MenuItem>
                    <MenuItem onClick={onOpenDocument}>Criar Página</MenuItem>
                    <MenuItem onClick={togglePinPage}>
                      {state.pinnedPage
                        ? "Desafixar da Barra Lateral"
                        : "Fixar na Barra Lateral"}
                    </MenuItem>
                    <MenuItem onClick={onOpenSearch}>Nova Query</MenuItem>
                    <MenuItem onClick={onOpenSearch}>Nova Coleção</MenuItem>
                    <MenuItem onClick={onOpenExplore}>
                      Configurações do Tipo de Objeto
                    </MenuItem>
                  </div>
                ) : null}
              </div>

              <button
                aria-label="Adicionar seção"
                className="cap-add-section"
                onClick={openDialog}
                type="button"
              >
                <CapacitiesSidebarIcon name="add" />
                <span>Adicionar seção</span>
              </button>
            </div>
          ) : null}
        </section>

        {state.customSections.length > 0 ? (
          <div>
            {state.customSections.map((section) => (
              <section className="cap-sidebar-section" key={section.id}>
                <SectionHeader
                  expanded={state.customOpen[section.id] ?? true}
                  icon="file"
                  onToggle={() => toggleCustomSection(section.id)}
                >
                  {section.label}
                </SectionHeader>

                {(state.customOpen[section.id] ?? true) ? (
                  <div className="cap-sidebar-block cap-custom-section">
                    <button
                      className="cap-sidebar-menu-item"
                      onClick={() => {
                        removeSection(section.id);
                      }}
                      type="button"
                    >
                      Remover seção
                    </button>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        ) : null}

        <section className="cap-sidebar-section">
          <SidebarNavItem icon="trash">Lixeira</SidebarNavItem>
        </section>

        <section className="cap-sidebar-section">
          <SectionHeader
            expanded={state.openSections.help}
            icon="help"
            onToggle={() => toggleSection("help")}
          >
            Ajuda e recursos
          </SectionHeader>

          {state.openSections.help ? (
            <div className="cap-help-rows">
              <SidebarNavItem icon="graduation">
                Primeiros passos
              </SidebarNavItem>
              <SidebarNavItem icon="help">Fazer uma pergunta</SidebarNavItem>
              <SidebarNavItem icon="documentation">Documentação</SidebarNavItem>
              <SidebarNavItem icon="news">Novidades</SidebarNavItem>
              <SidebarNavItem icon="feedback">Feedback</SidebarNavItem>
            </div>
          ) : null}
        </section>
      </div>

      <footer className="cap-sidebar-footer">
        <button
          aria-label="Configurações"
          className="cap-footer-button"
          type="button"
        >
          <CapacitiesSidebarIcon name="settings" />
        </button>

        <button aria-label="Tema" className="cap-footer-button" type="button">
          <CapacitiesSidebarIcon name="moon" />
        </button>

        <button aria-label="Perfil" className="cap-footer-button" type="button">
          <CapacitiesSidebarIcon name="user" />
        </button>

        <button aria-label="Plano Pro" className="cap-pro-pill" type="button">
          <CapacitiesSidebarIcon name="rocket" />
          <span>Pro</span>
        </button>

        <div className="cap-grow" />

        <button
          aria-label="Compartilhar"
          className="cap-footer-button"
          type="button"
        >
          <CapacitiesSidebarIcon name="share" />
        </button>
      </footer>

      {dialogOpen ? (
        <button
          aria-label="Fechar diálogo"
          className="cap-dialog-backdrop"
          onMouseDown={() => setDialogOpen(false)}
          type="button"
        />
      ) : null}

      {dialogOpen ? (
        <div
          className="cap-dialog"
          onMouseDown={(event) => event.stopPropagation()}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cap-add-section-title"
        >
          <h2 className="cap-dialog-title" id="cap-add-section-title">
            Adicionar seção
          </h2>

          <form className="cap-dialog-form" onSubmit={createSection}>
            <label className="cap-dialog-field" htmlFor="cap-section-name">
              <span>Nome</span>
              <input
                aria-required={true}
                id="cap-section-name"
                maxLength={80}
                onChange={(event) => setSectionName(event.target.value)}
                placeholder="Nome"
                ref={sectionNameInputRef}
                type="text"
                value={sectionName}
              />
            </label>

            <div className="cap-dialog-actions">
              <button
                className="cap-dialog-cancel"
                onClick={() => setDialogOpen(false)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="cap-dialog-confirm"
                disabled={sectionName.trim().length === 0}
                type="submit"
              >
                Criar
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </aside>
  );
}
