"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import {
  ObjectIconBadge,
  type ObjectIconTone,
  objectIconToneBadgeClass,
  objectTypeDefinitionById,
} from "@/components/object-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWorkspace } from "@/components/workspace-controller";
import { objectLifecycleContractSlots } from "@/lib/object-lifecycle-contracts";
import { cn } from "@/lib/utils";
import { WorkspaceSidebar as BaseWorkspaceSidebar } from "./app-sidebar-primary-actions";

// --- Capacities SVG Icons ---

function CapacitiesSearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      aria-hidden="true"
      role="img"
      {...props}
    >
      <path
        fill="currentColor"
        d="m229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32M40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72"
      />
    </svg>
  );
}

function CapacitiesHelpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      aria-hidden="true"
      role="img"
      {...props}
    >
      <path
        fill="currentColor"
        d="M108 84a16 16 0 1 1 16 16a16 16 0 0 1-16-16m128 44A108 108 0 1 1 128 20a108.12 108.12 0 0 1 108 108m-24 0a84 84 0 1 0-84 84a84.09 84.09 0 0 0 84-84m-72 36.68V132a20 20 0 0 0-20-20a12 12 0 0 0-4 23.32V168a20 20 0 0 0 20 20a12 12 0 0 0 4-23.32"
      />
    </svg>
  );
}

function CapacitiesExpandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      aria-hidden="true"
      role="img"
      {...props}
    >
      <path
        fill="currentColor"
        d="M220 48v48a12 12 0 0 1-24 0V77l-39.51 39.52a12 12 0 0 1-17-17L179 60h-19a12 12 0 0 1 0-24h48a12 12 0 0 1 12 12M99.51 139.51L60 179v-19a12 12 0 0 0-24 0v48a12 12 0 0 0 12 12h48a12 12 0 0 0 0-24H77l39.52-39.51a12 12 0 0 0-17-17Z"
      />
    </svg>
  );
}

function CapacitiesNewTabIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      aria-hidden="true"
      role="img"
      {...props}
    >
      <path
        fill="currentColor"
        d="M216 36H40a20 20 0 0 0-20 20v144a20 20 0 0 0 20 20h176a20 20 0 0 0 20-20V56a20 20 0 0 0-20-20m-4 24v24H44V60ZM44 196v-88h168v88Z"
      />
    </svg>
  );
}

function CapacitiesActionCursorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      aria-hidden="true"
      role="img"
      {...props}
    >
      <path
        fill="currentColor"
        d="M88 24v-8a8 8 0 0 1 16 0v8a8 8 0 0 1-16 0m-72 80h8a8 8 0 0 0 0-16h-8a8 8 0 0 0 0 16m108.42-64.84a8 8 0 0 0 10.74-3.58l8-16a8 8 0 0 0-14.31-7.16l-8 16a8 8 0 0 0 3.57 10.74m-96 81.69l-16 8a8 8 0 0 0 7.16 14.31l16-8a8 8 0 1 0-7.16-14.31M219.31 184a16 16 0 0 1 0 22.63l-12.68 12.68a16 16 0 0 1-22.63 0L132.7 168L115 214.09c0 .1-.08.21-.13.32a15.83 15.83 0 0 1-14.6 9.59h-.79a15.83 15.83 0 0 1-14.41-11L32.8 52.92A16 16 0 0 1 52.92 32.8L213 85.07a16 16 0 0 1 1.41 29.8l-.32.13L168 132.69ZM208 195.31L156.69 144a16 16 0 0 1 4.93-26l.32-.14l45.95-17.64L48 48l52.2 159.86l17.65-46c0-.11.08-.22.13-.33a16 16 0 0 1 11.69-9.34a16.7 16.7 0 0 1 3-.28a16 16 0 0 1 11.3 4.69l51.34 51.4Z"
      />
    </svg>
  );
}

function normalizeQuery(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

type PaletteItem = {
  id: string;
  kind: "recent" | "action";
  title: string;
  group?: "Hoje" | "Anterior";
  objectTypeLabel?: string;
  icon?: React.ElementType;
  tone?: ObjectIconTone;
  shortcuts?: string[];
  execute: (options: { openInNewTab?: boolean; openInSidePanel?: boolean }) => void;
};

function NewContentCommandDialog({
  open,
  onOpenChange,
  initialOpenInNewTab = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialOpenInNewTab?: boolean;
}) {
  const t = useTranslations("workspace");
  const {
    objectTypes = [],
    createdEntities = [],
    spaces = [],
    switchSpace,
    createWorkspaceEntity,
    selectEntity,
    setMainTabs,
    setMainValue,
    setActiveAction,
    openInSidePanel,
    showMessage,
  } = useWorkspace();

  const [query, setQuery] = React.useState("");
  const [openInNewTab, setOpenInNewTab] = React.useState(initialOpenInNewTab);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      setOpenInNewTab(initialOpenInNewTab);
    }
  }, [open, initialOpenInNewTab]);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const itemRefs = React.useRef(new Map<string, HTMLButtonElement>());

  const deferredQuery = React.useDeferredValue(query);
  const normalizedQuery = normalizeQuery(deferredQuery.trim());

  // --- Build Palette Items ---

  const recentItems: PaletteItem[] = React.useMemo(() => {
    if (createdEntities.length > 0) {
      return createdEntities.map((entity: any, index: number) => {
        const typeDef =
          objectTypes.find((t: any) => t.id === entity.objectTypeId) ??
          objectTypeDefinitionById[entity.objectTypeId] ??
          objectTypeDefinitionById.page;

        const isToday = index < 3;
        return {
          id: `recent-${entity.id}`,
          kind: "recent" as const,
          group: isToday ? "Hoje" : "Anterior",
          title: entity.title || "Sem título",
          objectTypeLabel: typeDef?.singularLabel ?? typeDef?.label ?? "Page",
          icon: typeDef?.icon,
          tone: typeDef?.tone ?? "blue",
          execute: ({ openInNewTab, openInSidePanel: openInSide }) => {
            if (openInSide) {
              openInSidePanel({
                id: entity.id,
                label: entity.title || "Sem título",
                draggable: true,
              });
            } else if (openInNewTab) {
              const tabId = entity.id;
              setMainTabs((current: any[]) =>
                current.some((tab) => tab.id === tabId)
                  ? current
                  : [
                      ...current,
                      {
                        id: tabId,
                        label: entity.title || "Sem título",
                        icon: typeDef?.icon,
                        draggable: true,
                      },
                    ],
              );
              setMainValue(tabId);
            } else {
              selectEntity(entity.id);
            }
            onOpenChange(false);
          },
        };
      });
    }

    // Default sample recent items matching Capacities UI structure when empty (image.png)
    const sampleTypes = [
      {
        id: "prisma",
        title: "Prisma",
        typeId: "table",
        objectTypeLabel: "Prisma",
        tone: "lime" as const,
        group: "Hoje" as const,
      },
      {
        id: "daily",
        title: "Notas Diárias",
        typeId: "atomic-note",
        objectTypeLabel: "Notas Diárias",
        tone: "blue" as const,
        group: "Hoje" as const,
      },
      {
        id: "genai",
        title: "Generative AI Leader",
        typeId: "book",
        objectTypeLabel: "Cursos",
        tone: "teal" as const,
        group: "Hoje" as const,
      },
      {
        id: "autoscaling",
        title: "Autoscaling policy",
        typeId: "area",
        objectTypeLabel: "GCP",
        tone: "yellow" as const,
        group: "Hoje" as const,
      },
      {
        id: "gcp",
        title: "GCP",
        typeId: "area",
        objectTypeLabel: "GCP",
        tone: "yellow" as const,
        group: "Hoje" as const,
      },
      {
        id: "data",
        title: "Data",
        typeId: "definition",
        objectTypeLabel: "Data",
        tone: "violet" as const,
        group: "Hoje" as const,
      },
      {
        id: "queries",
        title: "Queries",
        typeId: "query",
        objectTypeLabel: "Queries",
        tone: "green" as const,
        group: "Anterior" as const,
      },
      {
        id: "notas",
        title: "Notas",
        typeId: "page",
        objectTypeLabel: "Notas",
        tone: "gray" as const,
        group: "Anterior" as const,
      },
      {
        id: "sem-titulo",
        title: "Sem título",
        typeId: "book",
        objectTypeLabel: "Cursos",
        tone: "teal" as const,
        group: "Anterior" as const,
      },
      {
        id: "cursos",
        title: "Cursos",
        typeId: "book",
        objectTypeLabel: "Cursos",
        tone: "teal" as const,
        group: "Anterior" as const,
      },
      {
        id: "cloud-monitoring",
        title: "Cloud Monitoring",
        typeId: "area",
        objectTypeLabel: "GCP",
        tone: "yellow" as const,
        group: "Anterior" as const,
      },
    ];

    return sampleTypes.map((sample) => {
      const typeDef = objectTypeDefinitionById[sample.typeId] ?? objectTypeDefinitionById.page;
      return {
        id: `recent-sample-${sample.id}`,
        kind: "recent" as const,
        group: sample.group,
        title: sample.title,
        objectTypeLabel: sample.objectTypeLabel ?? typeDef.label,
        icon: typeDef.icon,
        tone: sample.tone,
        execute: async ({ openInNewTab, openInSidePanel: openInSide }) => {
          if (openInSide) {
            openInSidePanel({ id: sample.id, label: sample.title, draggable: true });
          } else {
            const entity = await createWorkspaceEntity(sample.typeId, sample.title);
            if (entity && openInNewTab) {
              setMainTabs((current: any[]) =>
                current.some((tab) => tab.id === entity.id)
                  ? current
                  : [
                      ...current,
                      { id: entity.id, label: entity.title, icon: typeDef.icon, draggable: true },
                    ],
              );
              setMainValue(entity.id);
            }
          }
          onOpenChange(false);
        },
      };
    });
  }, [
    createdEntities,
    createWorkspaceEntity,
    objectTypes,
    onOpenChange,
    openInSidePanel,
    selectEntity,
    setMainTabs,
    setMainValue,
  ]);

  const actionItems: PaletteItem[] = React.useMemo(() => {
    const actions: PaletteItem[] = [
      {
        id: "action-calendar",
        kind: "action",
        title: "Abrir calendário",
        shortcuts: ["Ctrl", "Alt", "H"],
        execute: () => {
          setActiveAction("calendar");
          setMainValue("primary-action:calendar");
          onOpenChange(false);
        },
      },
      {
        id: "action-today",
        kind: "action",
        title: "Abrir hoje",
        shortcuts: ["Ctrl", "Alt", "H"],
        execute: () => {
          setActiveAction("calendar");
          setMainValue("primary-action:calendar");
          onOpenChange(false);
        },
      },
      {
        id: "action-settings",
        kind: "action",
        title: "Abrir configurações",
        shortcuts: ["Ctrl", ","],
        execute: () => {
          showMessage("Configurações do espaço");
          onOpenChange(false);
        },
      },
      {
        id: "action-graph",
        kind: "action",
        title: "Abrir visualização em gráfico",
        execute: () => {
          openInSidePanel({ id: "graph-view", label: "Local Graph", draggable: true });
          onOpenChange(false);
        },
      },
      {
        id: "action-internal-objects",
        kind: "action",
        title: "Abrir objetos internos",
        execute: () => {
          showMessage("Objetos internos");
          onOpenChange(false);
        },
      },
      {
        id: "action-related-content",
        kind: "action",
        title: "Abrir conteúdo relacionado",
        execute: () => {
          openInSidePanel({ id: "backlinks", label: "Backlinks", draggable: true });
          onOpenChange(false);
        },
      },
      {
        id: "action-focus-mode",
        kind: "action",
        title: "Alternar modo de foco",
        shortcuts: ["Ctrl", "M"],
        execute: () => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("workspace:toggle-focus-mode"));
          }
          onOpenChange(false);
        },
      },
      {
        id: "action-whats-new",
        kind: "action",
        title: "Novidades",
        execute: () => {
          showMessage("KnowledgeOS v2.0 - Local-first Capacities Parity");
          onOpenChange(false);
        },
      },
      {
        id: "action-explore",
        kind: "action",
        title: "Abrir Explorar. Use o atalho novamente para iniciar um novo chat.",
        shortcuts: ["Ctrl", "J"],
        execute: () => {
          setActiveAction("explore");
          setMainValue("primary-action:explore");
          onOpenChange(false);
        },
      },
      {
        id: "action-extended-search",
        kind: "action",
        title: "Abrir busca estendida",
        shortcuts: ["Ctrl", "P"],
        execute: () => {
          onOpenChange(false);
        },
      },
    ];

    // Creation commands for object types
    const creationActions: PaletteItem[] = (
      objectTypes.length > 0 ? objectTypes : Object.values(objectTypeDefinitionById)
    ).map((typeDef: any) => {
      const label = typeDef.singularLabel ?? typeDef.label;
      return {
        id: `action-create-${typeDef.id}`,
        kind: "action",
        title: `Criar ${label}`,
        icon: typeDef.icon,
        tone: typeDef.tone ?? "blue",
        execute: async ({ openInNewTab }) => {
          const entity = await createWorkspaceEntity(typeDef.id, label);
          if (entity && openInNewTab) {
            setMainTabs((current: any[]) =>
              current.some((tab) => tab.id === entity.id)
                ? current
                : [
                    ...current,
                    { id: entity.id, label: entity.title, icon: typeDef.icon, draggable: true },
                  ],
            );
            setMainValue(entity.id);
          }
          onOpenChange(false);
        },
      };
    });

    // Open Space actions
    const spaceActions: PaletteItem[] = spaces.map((space: any) => ({
      id: `action-space-${space.id}`,
      kind: "action",
      title: `Abrir espaço "${space.name}"`,
      execute: () => {
        void switchSpace(space.id);
        onOpenChange(false);
      },
    }));

    return [...actions, ...creationActions, ...spaceActions];
  }, [
    createWorkspaceEntity,
    objectTypes,
    onOpenChange,
    openInSidePanel,
    setActiveAction,
    setMainTabs,
    setMainValue,
    showMessage,
    spaces,
    switchSpace,
  ]);

  // Combine and filter items
  const filteredRecentItems = React.useMemo(
    () => recentItems.filter((item) => normalizeQuery(item.title).includes(normalizedQuery)),
    [recentItems, normalizedQuery],
  );

  const filteredActionItems = React.useMemo(
    () => actionItems.filter((item) => normalizeQuery(item.title).includes(normalizedQuery)),
    [actionItems, normalizedQuery],
  );

  const allFilteredItems = React.useMemo(
    () => [...filteredRecentItems, ...filteredActionItems],
    [filteredRecentItems, filteredActionItems],
  );

  // Keyboard navigation & Auto-scroll
  React.useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery]);

  React.useEffect(() => {
    const activeItem = allFilteredItems[activeIndex];
    if (!open || !activeItem) return;
    itemRefs.current.get(activeItem.id)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, allFilteredItems, open]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
      return;
    }

    if (allFilteredItems.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(
        (current) => (current + direction + allFilteredItems.length) % allFilteredItems.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const activeItem = allFilteredItems[activeIndex];
      if (activeItem) {
        if (event.metaKey || event.ctrlKey) {
          activeItem.execute({ openInNewTab: true });
        } else if (event.shiftKey) {
          activeItem.execute({ openInSidePanel: true });
        } else {
          activeItem.execute({ openInNewTab });
        }
      }
    }
  }

  // Split recent items into Hoje & Anterior
  const hojeRecent = React.useMemo(
    () => filteredRecentItems.filter((i) => i.group === "Hoje"),
    [filteredRecentItems],
  );
  const anteriorRecent = React.useMemo(
    () => filteredRecentItems.filter((i) => i.group !== "Hoje"),
    [filteredRecentItems],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lifecycle-contract={objectLifecycleContractSlots.ObjectCreationMenu}
        showCloseButton={false}
        overlayClassName="bg-black/50 backdrop-blur-none"
        className={cn(
          "preview-card-core top-0 left-0 flex h-dvh w-full translate-x-0 translate-y-0 flex-col gap-0 border-0 bg-popover p-0 text-popover-foreground ring-0 outline-none transition-all duration-200 select-none [scrollbar-width:thin] [scrollbar-color:var(--bg-el)_transparent]",
          "sm:top-[10vh] sm:left-1/2 sm:h-auto sm:max-h-[85vh] sm:-translate-x-1/2 sm:rounded-xl sm:border sm:border-border sm:bg-card sm:text-card-foreground sm:shadow-[0_2px_3px_#00000001,0_4px_9px_#00000003,0_8px_12px_#00000001]",
          isExpanded
            ? "sm:w-[min(56rem,calc(100vw-2rem))] sm:max-w-4xl sm:max-h-[92vh]"
            : "sm:w-[min(42rem,calc(100vw-3rem))] sm:max-w-2xl",
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{t("primaryNavigation.search")}</DialogTitle>
          <DialogDescription>
            Buscar por conteúdo e ações, ou colar da área de transferência
          </DialogDescription>
        </DialogHeader>

        {/* --- Capacities Outer Card Header --- */}
        <div className="w-full px-3 py-2 pb-0">
          {/* Top Search Input Row */}
          <div className="space-between pointer-events-auto flex items-center gap-x-[9px] border-b border-base px-0.5 py-0.5 pb-2 text-base font-normal text-primary">
            {/* Search Icon */}
            <div className="pointer-events-none flex items-center justify-center text-[1.25em]">
              <span
                className="inline-flex size-[1em] shrink-0 grow-0 items-center justify-center leading-none relative"
                style={{ verticalAlign: "-0.125em" }}
              >
                <span className="inline-flex size-full items-center justify-center [&>svg]:size-full">
                  <CapacitiesSearchIcon />
                </span>
              </span>
            </div>

            {/* Input & Top Right Action Buttons */}
            <div className="flex w-full min-w-0 flex-1 items-center justify-between gap-x-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar por conteúdo e ações, ou colar da área de transferência"
                autoComplete="off"
                autoFocus
                className="h-7 w-full min-w-0 flex-1 select-text appearance-none bg-transparent text-[14px] sm:text-[15px] leading-tight text-foreground placeholder:text-subtle placeholder:opacity-60 outline-none"
              />

              <div className="flex shrink-0 items-center gap-x-0.5">
                {/* Help Button */}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://docs.capacities.io/reference/search"
                  className="inline-flex size-7 items-center justify-center rounded-base text-secondary transition-colors hover:bg-front-hover hover:text-primary"
                  title="Ajuda com a busca"
                >
                  <CapacitiesHelpIcon className="size-4" />
                </a>

                {/* Expand / Fullscreen Button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="inline-flex size-7 items-center justify-center rounded-base text-secondary transition-colors hover:bg-front-hover hover:text-primary"
                  title={isExpanded ? "Reduzir visualização" : "Expandir visualização"}
                >
                  <CapacitiesExpandIcon className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sub-header Option Pill: Abrir em nova aba */}
          <div className="mt-1.5 flex px-0.5 pb-2">
            <span className="text-[11px]">
              <button
                type="button"
                onClick={() => setOpenInNewTab((prev) => !prev)}
                className={cn(
                  "box-border relative inline-flex cursor-pointer select-none flex-row items-center whitespace-nowrap rounded-[0.475em] border py-[0.2em] px-[0.49em] text-[11px] leading-[1.3] transition-colors outline-none",
                  openInNewTab
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-base bg-el text-secondary hover:text-primary",
                )}
              >
                <span className="mr-[0.325em] ml-[-0.1em] inline-flex min-h-[1em] min-w-[1em] shrink-0 items-center justify-center rounded-[0.33em]">
                  <span
                    className="inline-flex size-[1em] shrink-0 grow-0 items-center justify-center leading-none relative p-[0.1em]"
                    style={{ verticalAlign: "-0.125em" }}
                  >
                    <span className="inline-flex size-full items-center justify-center [&>svg]:size-full">
                      <CapacitiesNewTabIcon />
                    </span>
                  </span>
                </span>
                <span className="inline min-w-[1.3em] whitespace-nowrap text-center">
                  Abrir em nova aba
                </span>
              </button>
            </span>
          </div>
        </div>

        {/* --- Scrollable Content List Container --- */}
        <div className="relative flex w-full min-w-0 flex-1 flex-col rounded-none border-t border-base sm:max-h-[70vh] sm:rounded-b">
          <div
            id="control-dropdown-container"
            className="scroll-container flex h-full max-h-[65vh] w-full flex-col overflow-y-auto overflow-x-hidden px-1.5 py-0.5 sm:max-h-[70vh]"
            style={{ scrollBehavior: "auto", scrollPadding: "2rem" }}
          >
            <div className="flex flex-col py-1">
              {/* --- SECTION 1: RECENTEMENTE ABERTOS --- */}
              {filteredRecentItems.length > 0 && (
                <>
                  <div className="px-2.5 pt-2 pb-2 text-sm font-normal text-secondary">
                    Recentemente abertos
                  </div>

                  {hojeRecent.length > 0 && (
                    <>
                      <div className="px-2.5 pt-2 pb-1 text-xs font-medium text-subtle">Hoje</div>
                      {hojeRecent.map((item) => {
                        const globalIdx = allFilteredItems.findIndex((i) => i.id === item.id);
                        const isSelected = globalIdx === activeIndex;

                        return (
                          <div
                            key={item.id}
                            className="relative flex w-full shrink-0 grow-0 px-1.5 py-[0.5px]"
                          >
                            <button
                              type="button"
                              ref={(node) => {
                                if (node) itemRefs.current.set(item.id, node);
                                else itemRefs.current.delete(item.id);
                              }}
                              data-active={isSelected || undefined}
                              onPointerMove={() => setActiveIndex(globalIdx)}
                              onClick={() => item.execute({ openInNewTab })}
                              className={cn(
                                "group/dropdown-item flex w-full shrink-0 cursor-pointer select-none flex-row items-start text-left text-sm gap-x-2 p-1 rounded-base border border-transparent outline-none transition-colors",
                                isSelected
                                  ? "bg-el text-primary active:border-state-active"
                                  : "text-text-primary hover:text-primary active:text-primary sm:hover:bg-front-hover active:brightness-95",
                              )}
                            >
                              <div className="shrink-0">
                                <ObjectIconBadge
                                  icon={item.icon ?? CapacitiesSearchIcon}
                                  tone={item.tone ?? "blue"}
                                  variant="menu"
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex h-auto min-w-0 flex-1 flex-col pt-[0.5px]">
                                <div className="flex min-h-5 items-center font-normal line-clamp-2">
                                  <span>{item.title}</span>
                                </div>
                                <div className="font-normal" />
                              </div>

                              {item.objectTypeLabel && (
                                <div className="flex h-full shrink-0 items-center pt-[3.5px]">
                                  <span className="text-xxs">
                                    <span
                                      className={cn(
                                        "box-border relative inline-flex select-none flex-row items-center whitespace-nowrap rounded-[0.475em] border py-[0.2em] px-[0.49em] text-[11px] leading-[1.3] transition-colors",
                                        objectIconToneBadgeClass[item.tone ?? "blue"],
                                      )}
                                    >
                                      <span className="mr-[0.325em] ml-[-0.1em] inline-flex min-h-[1em] min-w-[1em] shrink-0 items-center justify-center rounded-[0.33em]">
                                        <span
                                          className="inline-flex size-[1em] shrink-0 grow-0 items-center justify-center leading-none relative"
                                          style={{ verticalAlign: "-0.125em" }}
                                        >
                                          <span className="inline-flex size-full items-center justify-center [&>svg]:size-full">
                                            {React.createElement(item.icon ?? CapacitiesSearchIcon)}
                                          </span>
                                        </span>
                                      </span>
                                      <span className="inline min-w-[1.3em] whitespace-nowrap text-center">
                                        {item.objectTypeLabel}
                                      </span>
                                    </span>
                                  </span>
                                </div>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {anteriorRecent.length > 0 && (
                    <>
                      <div className="px-2.5 pt-2 pb-1 text-xs font-medium text-subtle">
                        Anterior
                      </div>
                      {anteriorRecent.map((item) => {
                        const globalIdx = allFilteredItems.findIndex((i) => i.id === item.id);
                        const isSelected = globalIdx === activeIndex;

                        return (
                          <div
                            key={item.id}
                            className="relative flex w-full shrink-0 grow-0 px-1.5 py-[0.5px]"
                          >
                            <button
                              type="button"
                              ref={(node) => {
                                if (node) itemRefs.current.set(item.id, node);
                                else itemRefs.current.delete(item.id);
                              }}
                              data-active={isSelected || undefined}
                              onPointerMove={() => setActiveIndex(globalIdx)}
                              onClick={() => item.execute({ openInNewTab })}
                              className={cn(
                                "group/dropdown-item flex w-full shrink-0 cursor-pointer select-none flex-row items-start text-left text-sm gap-x-2 p-1 rounded-base border border-transparent outline-none transition-colors",
                                isSelected
                                  ? "bg-el text-primary active:border-state-active"
                                  : "text-text-primary hover:text-primary active:text-primary sm:hover:bg-front-hover active:brightness-95",
                              )}
                            >
                              <div className="shrink-0">
                                <ObjectIconBadge
                                  icon={item.icon ?? CapacitiesSearchIcon}
                                  tone={item.tone ?? "blue"}
                                  variant="menu"
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex h-auto min-w-0 flex-1 flex-col pt-[0.5px]">
                                <div className="flex min-h-5 items-center font-normal line-clamp-2">
                                  <span>{item.title}</span>
                                </div>
                                <div className="font-normal" />
                              </div>

                              {item.objectTypeLabel && (
                                <div className="flex h-full shrink-0 items-center pt-[3.5px]">
                                  <span className="text-xxs">
                                    <span
                                      className={cn(
                                        "box-border relative inline-flex select-none flex-row items-center whitespace-nowrap rounded-[0.475em] border py-[0.2em] px-[0.49em] text-[11px] leading-[1.3] transition-colors",
                                        objectIconToneBadgeClass[item.tone ?? "blue"],
                                      )}
                                    >
                                      <span className="mr-[0.325em] ml-[-0.1em] inline-flex min-h-[1em] min-w-[1em] shrink-0 items-center justify-center rounded-[0.33em]">
                                        <span
                                          className="inline-flex size-[1em] shrink-0 grow-0 items-center justify-center leading-none relative"
                                          style={{ verticalAlign: "-0.125em" }}
                                        >
                                          <span className="inline-flex size-full items-center justify-center [&>svg]:size-full">
                                            {React.createElement(item.icon ?? CapacitiesSearchIcon)}
                                          </span>
                                        </span>
                                      </span>
                                      <span className="inline min-w-[1.3em] whitespace-nowrap text-center">
                                        {item.objectTypeLabel}
                                      </span>
                                    </span>
                                  </span>
                                </div>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              )}

              {/* --- SECTION 2: TODAS AS AÇÕES --- */}
              {filteredActionItems.length > 0 && (
                <>
                  <div className="px-2.5 pt-4 pb-2 text-sm font-normal text-secondary">
                    Todas as ações
                  </div>

                  {filteredActionItems.map((item) => {
                    const globalIdx = allFilteredItems.findIndex((i) => i.id === item.id);
                    const isSelected = globalIdx === activeIndex;

                    return (
                      <div
                        key={item.id}
                        className="relative flex w-full shrink-0 grow-0 px-1.5 py-[0.5px]"
                      >
                        <button
                          type="button"
                          ref={(node) => {
                            if (node) itemRefs.current.set(item.id, node);
                            else itemRefs.current.delete(item.id);
                          }}
                          data-active={isSelected || undefined}
                          onPointerMove={() => setActiveIndex(globalIdx)}
                          onClick={() => item.execute({ openInNewTab })}
                          className={cn(
                            "group/dropdown-item flex w-full shrink-0 cursor-pointer select-none flex-row items-start text-left text-sm gap-x-2 p-1 rounded-base border border-transparent outline-none transition-colors",
                            isSelected
                              ? "bg-el text-primary active:border-state-active"
                              : "text-text-primary hover:text-primary active:text-primary sm:hover:bg-front-hover active:brightness-95",
                          )}
                        >
                          {/* Left Icon & Title */}
                          <div className="shrink-0">
                            <ObjectIconBadge
                              icon={item.icon ?? CapacitiesSearchIcon}
                              tone={item.tone ?? "blue"}
                              variant="menu"
                              className="mt-1"
                            />
                          </div>
                          <div className="flex h-auto w-24 grow flex-col pt-[0.5px]">
                            <div className="flex min-h-5 items-center font-normal line-clamp-2">
                              <span>{item.title}</span>
                            </div>
                            <div className="font-normal" />
                          </div>

                          {/* Shortcuts */}
                          {item.shortcuts && item.shortcuts.length > 0 && (
                            <div className="flex h-full items-center text-xs text-subtle">
                              <span className="flex items-center gap-1 font-normal normal-case">
                                {item.shortcuts.map((k) => (
                                  <span
                                    key={k}
                                    className="rounded border border-base bg-el px-1.5 py-0.5 text-xs text-secondary leading-normal"
                                  >
                                    {k}
                                  </span>
                                ))}
                              </span>
                            </div>
                          )}

                          {/* Far Right Action Cursor Button */}
                          <div className="flex h-full flex-col justify-start">
                            <div className="flex h-sm w-sm items-center justify-center gap-x-1 rounded-base bg-el p-0.5 text-secondary">
                              <span
                                className="inline-flex size-[1em] shrink-0 grow-0 items-center justify-center leading-none relative"
                                style={{ verticalAlign: "-0.125em" }}
                              >
                                <span className="inline-flex size-full items-center justify-center [&>svg]:size-full">
                                  <CapacitiesActionCursorIcon />
                                </span>
                              </span>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </>
              )}

              {allFilteredItems.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Nenhum resultado encontrado para &quot;{query}&quot;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Footer Navigation Bar */}
        <div className="flex h-9 shrink-0 items-center gap-x-4 border-t border-border px-3 py-1.5 text-xs text-muted-foreground select-none">
          <span className="whitespace-nowrap">
            <span className="font-medium text-foreground">↑ ↓</span> para navegar
          </span>
          <span className="whitespace-nowrap">
            <span className="font-medium text-foreground">Esc</span> para abortar
          </span>
          <span className="whitespace-nowrap">
            <span className="font-medium text-foreground">↵</span> para selecionar
          </span>
          <span className="whitespace-nowrap">
            <span className="font-medium text-foreground">⌘ ↵ / Ctrl ↵</span> em nova aba
          </span>
          <span className="whitespace-nowrap">
            <span className="font-medium text-foreground">⇧ ↵</span> no painel lateral
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function isNewContentTrigger(target: EventTarget | null) {
  return target instanceof Element && target.closest("#workspace-new-trigger") !== null;
}

function WorkspaceNewContentDialogController() {
  const [open, setOpen] = React.useState(false);
  const [openInNewTab, setOpenInNewTab] = React.useState(false);

  React.useEffect(() => {
    function blockLegacyPointerDown(event: PointerEvent) {
      if (!isNewContentTrigger(event.target)) return;
      event.stopImmediatePropagation();
    }

    function openFromClick(event: MouseEvent) {
      if (!isNewContentTrigger(event.target)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpenInNewTab(false);
      setOpen(true);
    }

    function openFromWorkspace(event: Event) {
      event.stopImmediatePropagation();
      const customEvent = event as CustomEvent<{ openInNewTab?: boolean }>;
      if (customEvent.detail?.openInNewTab !== undefined) {
        setOpenInNewTab(Boolean(customEvent.detail.openInNewTab));
      } else {
        setOpenInNewTab(false);
      }
      setOpen(true);
    }

    function handleGlobalKeyDown(event: KeyboardEvent) {
      if (
        (event.metaKey || event.ctrlKey) &&
        (event.key === "k" ||
          event.key === "K" ||
          event.key === "p" ||
          event.key === "P" ||
          event.key === "u" ||
          event.key === "U")
      ) {
        const target = event.target as HTMLElement | null;
        const isEditable =
          target &&
          (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
        if (!isEditable || event.key.toLowerCase() === "k") {
          event.preventDefault();
          setOpenInNewTab(false);
          setOpen((prev) => !prev);
        }
      }
    }

    document.addEventListener("pointerdown", blockLegacyPointerDown, true);
    document.addEventListener("click", openFromClick, true);
    window.addEventListener("workspace:open-new-palette", openFromWorkspace, true);
    window.addEventListener("workspace:open-command-palette", openFromWorkspace, true);
    window.addEventListener("keydown", handleGlobalKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", blockLegacyPointerDown, true);
      document.removeEventListener("click", openFromClick, true);
      window.removeEventListener("workspace:open-new-palette", openFromWorkspace, true);
      window.removeEventListener("workspace:open-command-palette", openFromWorkspace, true);
      window.removeEventListener("keydown", handleGlobalKeyDown, true);
    };
  }, []);

  return (
    <NewContentCommandDialog
      open={open}
      onOpenChange={setOpen}
      initialOpenInNewTab={openInNewTab}
    />
  );
}

function WorkspaceSidebar() {
  return <BaseWorkspaceSidebar />;
}

export * from "./app-sidebar-primary-actions";
export { WorkspaceNewContentDialogController, WorkspaceSidebar };
