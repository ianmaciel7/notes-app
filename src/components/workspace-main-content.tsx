"use client";

import * as React from "react";
import { objectIconToneBadgeClass } from "@/components/object-icons";
import { useWorkspace } from "@/components/space-controller";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { WorkspaceFlashcardReviewPanel } from "@/components/workspace-flashcard-review-panel";
import { WorkspaceStudyGoalDashboard } from "@/components/workspace-study-goal-dashboard";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data inválida";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center rounded-[12px] border border-dashed border-border bg-card p-8 text-center">
      <div className="max-w-md">
        <h2 className="text-lg font-medium text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

type WorkspaceActionPanelProps = {
  onReturn: () => void;
};

function WorkspaceActionPanelHeader({
  label,
  title,
  onReturn,
}: {
  label: string;
  title: string;
  onReturn: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground sm:inline">Esc para sair</span>
        <Button type="button" variant="outline" size="sm" onClick={onReturn}>
          Voltar
        </Button>
      </div>
    </div>
  );
}

function SearchActionPanel({ onReturn }: WorkspaceActionPanelProps) {
  const {
    ready,
    createdEntities,
    objectTypes,
    setMainTabs,
    setActiveAction,
    activeEntityId,
    setActiveEntityId,
    setMainValue,
  } = useWorkspace();
  const [query, setQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [activeSearchIndex, setActiveSearchIndex] = React.useState(0);
  const listContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const objectTypeById = React.useMemo(() => {
    return Object.fromEntries(
      objectTypes.map((item) => [item.id, item.singularLabel ?? item.label]),
    );
  }, [objectTypes]);

  const results = React.useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return createdEntities;

    return createdEntities.filter((entity) => {
      const haystack = `${entity.title} ${entity.objectTypeId} ${entity.id}`.toLocaleLowerCase();
      return haystack.includes(needle);
    });
  }, [createdEntities, query]);

  React.useEffect(() => {
    if (activeEntityId && activeEntityId !== "page") {
      const activeResultIndex = results.findIndex((result) => result.id === activeEntityId);
      setActiveSearchIndex(activeResultIndex >= 0 ? activeResultIndex : 0);
    } else {
      setActiveSearchIndex(0);
    }
    searchInputRef.current?.focus();
  }, [query, results.length, activeEntityId, results]);

  function safeSearchIndex() {
    return Math.max(0, Math.min(activeSearchIndex, Math.max(0, results.length - 1)));
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const safeIndex = safeSearchIndex();
      const nextIndex =
        event.key === "ArrowDown"
          ? (safeIndex + 1) % results.length
          : (safeIndex - 1 + results.length) % results.length;
      setActiveSearchIndex(nextIndex);
      listContainerRef.current?.focus();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      openEntity(results[safeSearchIndex()]);
    }
  }

  function handleSearchListKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (results.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const safeIndex = safeSearchIndex();
      const nextIndex =
        event.key === "ArrowDown"
          ? (safeIndex + 1) % results.length
          : (safeIndex - 1 + results.length) % results.length;
      setActiveSearchIndex(nextIndex);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      openEntity(results[safeSearchIndex()]);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onReturn();
    }
  }

  function openEntity(entity: (typeof createdEntities)[number]) {
    const objectType = objectTypes.find((item) => item.id === entity.objectTypeId);
    setActiveAction(undefined);
    setActiveEntityId(entity.id);
    setMainTabs((current) => {
      if (current.some((item) => item.id === entity.id)) return current;
      return [
        ...current,
        {
          id: entity.id,
          label: entity.title || "Sem título",
          icon: objectType?.icon,
          iconClassName: objectType ? objectIconToneBadgeClass[objectType.tone] : undefined,
          draggable: true,
        },
      ];
    });
    setMainValue(entity.id);
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-4 bg-card px-6 py-4">
      <WorkspaceActionPanelHeader label="Search" title="Search" onReturn={onReturn} />
      <div className="flex flex-col gap-3">
        <label className="text-sm text-muted-foreground" htmlFor="workspace-search-input">
          Busque por título, tipo ou ID da entidade.
        </label>
        <Input
          id="workspace-search-input"
          placeholder="Digite para buscar"
          ref={searchInputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="h-10 rounded-[10px]"
        />
      </div>

      <div
        ref={listContainerRef}
        className="min-h-0 flex-1 overflow-auto rounded-[12px] border border-border bg-background p-4"
        tabIndex={0}
        aria-activedescendant={
          results[activeSearchIndex] ? `search-result-${results[activeSearchIndex]?.id}` : undefined
        }
        role="listbox"
        aria-label="Search results"
        onKeyDown={handleSearchListKeyDown}
      >
        {!ready ? (
          <p className="text-sm text-muted-foreground">Carregando workspace…</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum resultado encontrado. Tente outro termo ou use o atalho{" "}
            <span className="font-medium text-foreground">Ctrl+K</span> para abrir a paleta.
          </p>
        ) : (
          <ul className="space-y-2">
            {results.map((entity) => {
              const typeName = objectTypeById[entity.objectTypeId] ?? "Unknown";
              const isActive = activeSearchIndex === results.indexOf(entity);
              const itemId = `search-result-${entity.id}`;
              return (
                <li
                  key={entity.id}
                  id={itemId}
                  role="option"
                  aria-selected={isActive || activeEntityId === entity.id}
                  className={`rounded-[10px] border px-3 py-2 text-sm text-foreground ${
                    isActive || activeEntityId === entity.id
                      ? "border-primary bg-muted/50"
                      : "border-border bg-background"
                  }`}
                >
                  <button
                    type="button"
                    className="w-full rounded text-left"
                    onClick={() => openEntity(entity)}
                    onMouseEnter={() =>
                      setActiveSearchIndex(results.findIndex((result) => result.id === entity.id))
                    }
                  >
                    <p className="font-medium">{entity.title || "Sem título"}</p>
                    <p className="text-xs text-muted-foreground">
                      {typeName} · atualizada em {formatDate(entity.updatedAt)}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function CalendarActionPanel({ onReturn }: WorkspaceActionPanelProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  return (
    <section className="flex h-full min-h-0 flex-col gap-4 bg-card px-6 py-4">
      <WorkspaceActionPanelHeader label="Calendar" title="Agenda" onReturn={onReturn} />

      <div className="min-h-0 flex-1 rounded-[12px] border border-border p-4 text-sm text-muted-foreground">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={(nextDate) => setSelectedDate(nextDate as Date | undefined)}
          className="h-full w-full [&_*]:text-sm"
        />
        <p className="mt-3">
          Data selecionada: {selectedDate ? formatDate(selectedDate.toISOString()) : "Nenhuma"}
        </p>
      </div>
    </section>
  );
}

function ExploreActionPanel({ onReturn }: WorkspaceActionPanelProps) {
  const {
    createdEntities,
    objectTypes,
    setMainTabs,
    setActiveAction,
    activeEntityId,
    setActiveEntityId,
    setMainValue,
  } = useWorkspace();
  const [activeTypeId, setActiveTypeId] = React.useState<string | undefined>(undefined);

  const byType = React.useMemo(() => {
    type ExploreTypeBucket = {
      typeId: string;
      count: number;
      latestEntity: (typeof createdEntities)[number];
    };

    const buckets = new Map<string, number>();
    const latestByType = new Map<string, (typeof createdEntities)[number]>();
    for (const entity of createdEntities) {
      buckets.set(entity.objectTypeId, (buckets.get(entity.objectTypeId) ?? 0) + 1);
      const current = latestByType.get(entity.objectTypeId);
      if (
        !current ||
        new Date(entity.updatedAt).getTime() > new Date(current.updatedAt).getTime()
      ) {
        latestByType.set(entity.objectTypeId, entity);
      }
    }
    return Array.from(buckets.entries()).map(([typeId, count]) => ({
      typeId,
      count,
      latestEntity: latestByType.get(typeId) as (typeof createdEntities)[number],
    }));
  }, [createdEntities]);

  const typeLabelById = React.useMemo(() => {
    return Object.fromEntries(
      objectTypes.map((item) => [item.id, item.singularLabel ?? item.label]),
    );
  }, [objectTypes]);

  React.useEffect(() => {
    if (!createdEntities.length) {
      setActiveTypeId(undefined);
      return;
    }

    if (activeEntityId && activeEntityId !== "page") {
      const activeEntity = createdEntities.find((entity) => entity.id === activeEntityId);
      if (
        activeEntity?.objectTypeId &&
        byType.some((bucket) => bucket.typeId === activeEntity.objectTypeId)
      ) {
        setActiveTypeId(activeEntity.objectTypeId);
        return;
      }
    }

    setActiveTypeId((current) => current ?? byType[0]?.typeId);
  }, [activeEntityId, createdEntities, byType]);

  function handleExploreKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (byType.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const index = byType.findIndex((item) => item.typeId === activeTypeId);
      const safeIndex = Math.max(0, index >= 0 ? index : 0);
      const nextIndex =
        event.key === "ArrowDown"
          ? (safeIndex + 1) % byType.length
          : (safeIndex - 1 + byType.length) % byType.length;
      setActiveTypeId(byType[nextIndex]?.typeId);
      return;
    }

    if (event.key === "Enter" && activeTypeId) {
      event.preventDefault();
      openType(activeTypeId);
    }
  }

  function openType(typeId: string) {
    const entry = byType.find((item) => item.typeId === typeId);
    const entity = entry?.latestEntity;
    if (!entity) return;
    const objectType = objectTypes.find((item) => item.id === typeId);

    setActiveAction(undefined);
    setActiveEntityId(entity.id);
    setMainTabs((current) => {
      if (current.some((item) => item.id === entity.id)) return current;
      return [
        ...current,
        {
          id: entity.id,
          label: entity.title || "Sem título",
          icon: objectType?.icon,
          iconClassName: objectType ? objectIconToneBadgeClass[objectType.tone] : undefined,
          draggable: true,
        },
      ];
    });
    setMainValue(entity.id);
  }

  const listContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      listContainerRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section className="flex h-full min-h-0 flex-col gap-4 bg-card px-6 py-4">
      <WorkspaceActionPanelHeader label="Explore" title="Explorar estrutura" onReturn={onReturn} />

      <div
        ref={listContainerRef}
        className="min-h-0 flex-1 overflow-auto rounded-[12px] border border-border p-4"
        tabIndex={0}
        role="listbox"
        aria-activedescendant={activeTypeId ? `explore-type-${activeTypeId}` : undefined}
        onKeyDown={handleExploreKeyDown}
        aria-label="Explorer panel actions"
      >
        {byType.length === 0 ? (
          <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4">
            <EmptyState
              title="Sem objetos ainda"
              description="Crie objetos no painel lateral para começar a explorar conexões."
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("workspace:open-command-palette"));
                }
              }}
            >
              Abrir criação rápida
            </Button>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {byType.map(({ typeId, count }) => (
              <article
                key={typeId}
                id={`explore-type-${typeId}`}
                role="option"
                aria-selected={activeTypeId === typeId}
                className={`rounded-[10px] border p-3 text-sm text-foreground hover:bg-muted/60 ${
                  activeTypeId === typeId
                    ? "border-primary bg-muted/50"
                    : "border-border bg-background"
                }`}
              >
                <button
                  type="button"
                  onClick={() => openType(typeId)}
                  className="w-full rounded text-left"
                  onMouseEnter={() => setActiveTypeId(typeId)}
                >
                  <p className="font-medium">{typeLabelById[typeId] ?? typeId}</p>
                  <p className="text-xs text-muted-foreground">{count} item(ns)</p>
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TasksActionPanel({ onReturn }: WorkspaceActionPanelProps) {
  const {
    createdEntities,
    ready,
    createWorkspaceEntity,
    setActiveAction,
    setMainTabs,
    activeEntityId,
    setActiveEntityId,
    setMainValue,
    objectTypes,
  } = useWorkspace();
  const [activeTaskId, setActiveTaskId] = React.useState<string | undefined>(undefined);
  const listContainerRef = React.useRef<HTMLDivElement>(null);
  const tasks = React.useMemo(() => {
    return createdEntities.filter((entity) => entity.objectTypeId === "task");
  }, [createdEntities]);

  React.useEffect(() => {
    if (tasks.length === 0) {
      setActiveTaskId(undefined);
      return;
    }

    if (activeEntityId && tasks.some((task) => task.id === activeEntityId)) {
      setActiveTaskId(activeEntityId);
      return;
    }

    setActiveTaskId((current) => current ?? tasks[0]?.id);
  }, [activeEntityId, tasks]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      listContainerRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  function handleTasksKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (tasks.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const index = tasks.findIndex((task) => task.id === activeTaskId);
      const safeIndex = Math.max(0, index >= 0 ? index : 0);
      const nextIndex =
        event.key === "ArrowDown"
          ? (safeIndex + 1) % tasks.length
          : (safeIndex - 1 + tasks.length) % tasks.length;
      setActiveTaskId(tasks[nextIndex]?.id);
      return;
    }

    if (event.key === "Enter" && activeTaskId) {
      event.preventDefault();
      const target = tasks.find((task) => task.id === activeTaskId);
      if (target) {
        openTask(target);
      }
    }
  }

  function openTask(task: (typeof createdEntities)[number]) {
    const objectType = objectTypes.find((item) => item.id === task.objectTypeId);
    setActiveAction(undefined);
    setActiveEntityId(task.id);
    setMainTabs((current) => {
      if (current.some((item) => item.id === task.id)) return current;
      return [
        ...current,
        {
          id: task.id,
          label: task.title || "Sem título",
          icon: objectType?.icon,
          iconClassName: objectType ? objectIconToneBadgeClass[objectType.tone] : undefined,
          draggable: true,
        },
      ];
    });
    setMainValue(task.id);
  }

  function handleCreateTask() {
    void createWorkspaceEntity("task", "Task")
      .then((entity) => {
        if (!entity) return;
        openTask(entity);
      })
      .catch(() => undefined);
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-4 bg-card px-6 py-4">
      <WorkspaceActionPanelHeader label="Tasks" title="Tarefas" onReturn={onReturn} />

      <div
        ref={listContainerRef}
        className="min-h-0 flex-1 overflow-auto rounded-[12px] border border-border p-4"
        role="listbox"
        tabIndex={0}
        aria-activedescendant={activeTaskId ? `task-result-${activeTaskId}` : undefined}
        onKeyDown={handleTasksKeyDown}
        aria-label="Task list"
      >
        {!ready ? (
          <p className="text-sm text-muted-foreground">Carregando tarefas…</p>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Nenhuma tarefa encontrada.</p>
            <Button type="button" variant="outline" onClick={handleCreateTask}>
              Criar primeira tarefa
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                id={`task-result-${task.id}`}
                role="option"
                aria-selected={activeTaskId === task.id}
                className={`rounded-[10px] border px-3 py-2 text-sm text-foreground ${
                  activeTaskId === task.id ? "border-primary bg-muted/50" : "border-border"
                }`}
              >
                <button
                  type="button"
                  className="w-full rounded text-left"
                  onClick={() => openTask(task)}
                  onMouseEnter={() => setActiveTaskId(task.id)}
                >
                  <p className="font-medium">{task.title || "Sem título"}</p>
                  <p className="text-xs text-muted-foreground">
                    Atualizada em {formatDate(task.updatedAt)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function WorkspaceDefaultPanel() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <WorkspaceStudyGoalDashboard />
      <div className="min-h-0 flex-1">
        <WorkspaceFlashcardReviewPanel />
      </div>
    </div>
  );
}

function SidePanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border px-4 py-3 last:border-b-0">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function MiniGraphPreview({
  activeTitle,
  related,
}: {
  activeTitle: string;
  related: { id: string; title: string }[];
}) {
  const orbit = related.slice(0, 6);
  const center = { x: 112, y: 76 };
  const radius = 52;

  return (
    <div className="relative h-40 overflow-hidden rounded-[8px] border border-border bg-background">
      <svg
        className="h-full w-full"
        viewBox="0 0 224 152"
        role="img"
        aria-label="Local graph preview"
      >
        <title>Local graph preview for {activeTitle}</title>
        {orbit.map((node, index) => {
          const angle = (index / Math.max(1, orbit.length)) * Math.PI * 2 - Math.PI / 2;
          const x = center.x + Math.cos(angle) * radius;
          const y = center.y + Math.sin(angle) * radius;
          return (
            <g key={`edge-${node.id}`}>
              <line
                x1={center.x}
                y1={center.y}
                x2={x}
                y2={y}
                className="stroke-border"
                strokeWidth="1"
              />
            </g>
          );
        })}
        {orbit.map((node, index) => {
          const angle = (index / Math.max(1, orbit.length)) * Math.PI * 2 - Math.PI / 2;
          const x = center.x + Math.cos(angle) * radius;
          const y = center.y + Math.sin(angle) * radius;
          return (
            <g key={node.id}>
              <circle cx={x} cy={y} r="9" className="fill-muted stroke-border" strokeWidth="1" />
              <title>{node.title || "Sem título"}</title>
            </g>
          );
        })}
        <circle
          cx={center.x}
          cy={center.y}
          r="15"
          className="fill-primary/15 stroke-primary"
          strokeWidth="1.5"
        />
        <circle cx={center.x} cy={center.y} r="4" className="fill-primary" />
      </svg>
    </div>
  );
}

export function WorkspaceSidePanelContent() {
  const {
    activeEntityId,
    createdEntities,
    objectTypes,
    sideValue,
    listBacklinks,
    buildGraph,
    setActiveAction,
    setActiveEntityId,
    setMainTabs,
    setMainValue,
  } = useWorkspace();
  const activeEntity = React.useMemo(() => {
    if (!activeEntityId || activeEntityId === "page") return undefined;
    return createdEntities.find((entity) => entity.id === activeEntityId);
  }, [activeEntityId, createdEntities]);
  const objectType = React.useMemo(() => {
    if (!activeEntity) return undefined;
    return objectTypes.find((item) => item.id === activeEntity.objectTypeId);
  }, [activeEntity, objectTypes]);
  const [backlinks, setBacklinks] = React.useState<typeof createdEntities>([]);
  const [graphSummary, setGraphSummary] = React.useState<{
    nodes: number;
    edges: number;
    related: typeof createdEntities;
  }>({ nodes: 0, edges: 0, related: [] });

  React.useEffect(() => {
    let cancelled = false;

    if (!activeEntity) {
      setBacklinks([]);
      setGraphSummary({ nodes: 0, edges: 0, related: [] });
      return () => {
        cancelled = true;
      };
    }

    void Promise.all([listBacklinks(activeEntity.id), buildGraph()]).then(
      ([nextBacklinks, graph]) => {
        if (cancelled) return;
        const relatedIds = new Set(
          graph.edges.flatMap((edge: { sourceId: string; targetId: string }) =>
            edge.sourceId === activeEntity.id
              ? [edge.targetId]
              : edge.targetId === activeEntity.id
                ? [edge.sourceId]
                : [],
          ),
        );
        setBacklinks(nextBacklinks);
        setGraphSummary({
          nodes: graph.nodes.length,
          edges: graph.edges.length,
          related: createdEntities.filter((entity) => relatedIds.has(entity.id)).slice(0, 5),
        });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [activeEntity, buildGraph, createdEntities, listBacklinks]);

  function openEntity(entity: (typeof createdEntities)[number]) {
    const type = objectTypes.find((item) => item.id === entity.objectTypeId);
    setActiveAction(undefined);
    setActiveEntityId(entity.id);
    setMainTabs((current: { id: string }[]) => {
      if (current.some((item) => item.id === entity.id)) return current;
      return [
        ...current,
        {
          id: entity.id,
          label: entity.title || "Sem título",
          icon: type?.icon,
          iconClassName: type ? objectIconToneBadgeClass[type.tone] : undefined,
          draggable: true,
        },
      ];
    });
    setMainValue(entity.id);
  }

  if (!activeEntity) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Selecione um objeto para ver propriedades, backlinks e relações locais.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto bg-card">
      <SidePanelSection
        title={
          sideValue === "graph-view"
            ? "Graph"
            : sideValue === "backlinks"
              ? "Backlinks"
              : "Inspector"
        }
      >
        <div className="flex items-start gap-3">
          {objectType?.icon ? (
            <span
              className={`inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] border ${objectIconToneBadgeClass[objectType.tone]}`}
            >
              {React.createElement(objectType.icon, { className: "size-4" })}
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {activeEntity.title || "Sem título"}
            </p>
            <p className="text-xs text-muted-foreground">
              {objectType?.singularLabel ?? objectType?.label ?? activeEntity.objectTypeId}
            </p>
          </div>
        </div>
      </SidePanelSection>

      <SidePanelSection title="Properties">
        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Atualizado</dt>
            <dd className="text-right text-foreground">{formatDate(activeEntity.updatedAt)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Tags</dt>
            <dd className="text-foreground">{activeEntity.tags.length}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Relações</dt>
            <dd className="text-foreground">{activeEntity.relations.length}</dd>
          </div>
        </dl>
      </SidePanelSection>

      <SidePanelSection title="Backlinks">
        {backlinks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum backlink encontrado.</p>
        ) : (
          <div className="space-y-1">
            {backlinks.map((entity) => (
              <button
                key={entity.id}
                type="button"
                className="block w-full rounded-[8px] px-2 py-1.5 text-left text-sm text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={() => openEntity(entity)}
              >
                {entity.title || "Sem título"}
              </button>
            ))}
          </div>
        )}
      </SidePanelSection>

      <SidePanelSection title="Local graph">
        <MiniGraphPreview
          activeTitle={activeEntity.title || "Sem título"}
          related={graphSummary.related}
        />
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-[8px] border border-border bg-background p-2">
            <p className="text-lg font-semibold text-foreground">{graphSummary.nodes}</p>
            <p className="text-xs text-muted-foreground">objetos</p>
          </div>
          <div className="rounded-[8px] border border-border bg-background p-2">
            <p className="text-lg font-semibold text-foreground">{graphSummary.edges}</p>
            <p className="text-xs text-muted-foreground">links</p>
          </div>
        </div>
        {graphSummary.related.length > 0 ? (
          <div className="mt-3 space-y-1">
            {graphSummary.related.map((entity) => (
              <button
                key={entity.id}
                type="button"
                className="block w-full rounded-[8px] px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={() => openEntity(entity)}
              >
                {entity.title || "Sem título"}
              </button>
            ))}
          </div>
        ) : null}
      </SidePanelSection>
    </div>
  );
}

export function WorkspaceMainContent() {
  const { activeAction, setActiveAction, setActiveEntityId, setMainValue, mainValue } =
    useWorkspace();
  const previousWorkspaceMainRef = React.useRef<string>("page");
  const actionReturnRef = React.useRef<string | null>(null);
  const escapeEnabledRef = React.useRef(false);

  React.useEffect(() => {
    if (activeAction) {
      if (!actionReturnRef.current) {
        actionReturnRef.current = previousWorkspaceMainRef.current;
      }
      escapeEnabledRef.current = true;
      return;
    }

    actionReturnRef.current = null;
    escapeEnabledRef.current = false;
    if (mainValue && !mainValue.startsWith("primary-action:")) {
      previousWorkspaceMainRef.current = mainValue;
    }
  }, [activeAction, mainValue]);

  const returnToWorkspace = React.useCallback(() => {
    const returnToValue = actionReturnRef.current ?? previousWorkspaceMainRef.current;
    setActiveAction(undefined);
    setActiveEntityId(returnToValue);
    setMainValue(returnToValue);
  }, [setActiveAction, setActiveEntityId, setMainValue]);

  React.useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (!escapeEnabledRef.current) return;
      if (event.key !== "Escape") return;

      const target = event.target as EventTarget | null;
      if (target instanceof HTMLElement) {
        const isEditable =
          target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
        if (isEditable) return;
      }

      event.preventDefault();
      returnToWorkspace();
    }

    window.addEventListener("keydown", handleEsc, true);
    return () => window.removeEventListener("keydown", handleEsc, true);
  }, [returnToWorkspace]);

  if (activeAction === "search") return <SearchActionPanel onReturn={returnToWorkspace} />;
  if (activeAction === "calendar") return <CalendarActionPanel onReturn={returnToWorkspace} />;
  if (activeAction === "explore") return <ExploreActionPanel onReturn={returnToWorkspace} />;
  if (activeAction === "tasks") return <TasksActionPanel onReturn={returnToWorkspace} />;

  return <WorkspaceDefaultPanel />;
}
