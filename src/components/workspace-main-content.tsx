"use client";

import * as React from "react";
import type { AppHeaderTab } from "@/components/app-header-tabs";
import { type ObjectIconTone, objectIconToneBadgeClass } from "@/components/object-icons";
import { PendingImplementation } from "@/components/pending-implementation";
import { useWorkspace } from "@/components/space-controller";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  WorkspaceObjectRenderer,
  WorkspaceObjectTypeListView,
} from "@/components/workspace-object-renderer";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

export { WorkspaceSidePanelContent } from "@/components/workspace-side-panel-content";

type WorkspaceTabLike = {
  id: string;
  label?: string;
};

const contextMenuPendingActions = {
  "change-type": "Change type",
  export: "Export",
  import: "Import",
  "new-collection": "New Collection",
  "new-from-template": "New from Template",
  "new-query": "New Query",
  "pin-sidebar": "Pin to Sidebar",
  present: "Present",
  settings: "Object type settings",
  share: "Share",
} as const;

export function getContextMenuPendingDetails(action: string) {
  const name = contextMenuPendingActions[action as keyof typeof contextMenuPendingActions];
  return name ? { description: `${name} should be implemented here.`, name } : undefined;
}

export function getWorkspaceTabPendingName(
  tabs: WorkspaceTabLike[] | undefined,
  value: string | undefined,
  fallback: string,
) {
  return tabs?.find((tab) => tab.id === value)?.label ?? fallback;
}

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
    <Empty className="h-full min-h-0 border-dashed bg-card p-8">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
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
      objectTypes.map((item: any) => [item.id, item.singularLabel ?? item.label]),
    );
  }, [objectTypes]);

  const results = React.useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return createdEntities;

    return createdEntities.filter((entity: any) => {
      const haystack = `${entity.title} ${entity.objectTypeId} ${entity.id}`.toLocaleLowerCase();
      return haystack.includes(needle);
    });
  }, [createdEntities, query]);

  React.useEffect(() => {
    if (activeEntityId && activeEntityId !== "page") {
      const activeResultIndex = results.findIndex((result: any) => result.id === activeEntityId);
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
    const objectType = objectTypes.find((item: any) => item.id === entity.objectTypeId);
    setActiveAction(undefined);
    setActiveEntityId(entity.id);
    setMainTabs((current: any[]) => {
      if (current.some((item: any) => item.id === entity.id)) return current;
      return [
        ...current,
        {
          id: entity.id,
          label: entity.title || "Sem título",
          icon: objectType?.icon,
          iconClassName: objectType
            ? objectIconToneBadgeClass[objectType.tone as ObjectIconTone]
            : undefined,
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
          <ul className="flex flex-col gap-2">
            {results.map((entity: any) => {
              const typeName = objectTypeById[entity.objectTypeId] ?? "Unknown";
              const isActive = activeSearchIndex === results.indexOf(entity);
              const itemId = `search-result-${entity.id}`;
              return (
                <li
                  key={entity.id}
                  id={itemId}
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
                      setActiveSearchIndex(
                        results.findIndex((result: any) => result.id === entity.id),
                      )
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
      objectTypes.map((item: any) => [item.id, item.singularLabel ?? item.label]),
    );
  }, [objectTypes]);

  React.useEffect(() => {
    if (!createdEntities.length) {
      setActiveTypeId(undefined);
      return;
    }

    if (activeEntityId && activeEntityId !== "page") {
      const activeEntity = createdEntities.find((entity: any) => entity.id === activeEntityId);
      if (
        activeEntity?.objectTypeId &&
        byType.some((bucket: any) => bucket.typeId === activeEntity.objectTypeId)
      ) {
        setActiveTypeId(activeEntity.objectTypeId);
        return;
      }
    }

    setActiveTypeId((current: any) => current ?? byType[0]?.typeId);
  }, [activeEntityId, createdEntities, byType]);

  function handleExploreKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (byType.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const index = byType.findIndex((item: any) => item.typeId === activeTypeId);
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
    const entry = byType.find((item: any) => item.typeId === typeId);
    const entity = entry?.latestEntity;
    if (!entity) return;
    const objectType = objectTypes.find((item: any) => item.id === typeId);

    setActiveAction(undefined);
    setActiveEntityId(entity.id);
    setMainTabs((current: any[]) => {
      if (current.some((item: any) => item.id === entity.id)) return current;
      return [
        ...current,
        {
          id: entity.id,
          label: entity.title || "Sem título",
          icon: objectType?.icon,
          iconClassName: objectType
            ? objectIconToneBadgeClass[objectType.tone as ObjectIconTone]
            : undefined,
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
    return createdEntities.filter((entity: any) => entity.objectTypeId === "task");
  }, [createdEntities]);

  React.useEffect(() => {
    if (tasks.length === 0) {
      setActiveTaskId(undefined);
      return;
    }

    if (activeEntityId && tasks.some((task: any) => task.id === activeEntityId)) {
      setActiveTaskId(activeEntityId);
      return;
    }

    setActiveTaskId((current: any) => current ?? tasks[0]?.id);
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
      const index = tasks.findIndex((task: any) => task.id === activeTaskId);
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
      const target = tasks.find((task: any) => task.id === activeTaskId);
      if (target) {
        openTask(target);
      }
    }
  }

  function openTask(task: (typeof createdEntities)[number]) {
    const objectType = objectTypes.find((item: any) => item.id === task.objectTypeId);
    setActiveAction(undefined);
    setActiveEntityId(task.id);
    setMainTabs((current: any[]) => {
      if (current.some((item: any) => item.id === task.id)) return current;
      return [
        ...current,
        {
          id: task.id,
          label: task.title || "Sem título",
          icon: objectType?.icon,
          iconClassName: objectType
            ? objectIconToneBadgeClass[objectType.tone as ObjectIconTone]
            : undefined,
          draggable: true,
        },
      ];
    });
    setMainValue(task.id);
  }

  function handleCreateTask() {
    void createWorkspaceEntity("task", "Task")
      .then((entity: any) => {
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
          <ul className="flex flex-col gap-2">
            {tasks.map((task: any) => (
              <li
                key={task.id}
                id={`task-result-${task.id}`}
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

export function WorkspaceDefaultPanel() {
  const {
    createWorkspaceEntity,
    createdEntities,
    mainTabs,
    mainValue,
    objectTypeRecords,
    objectTypes,
    setActiveAction,
    setActiveEntityId,
    setMainTabs,
    setMainValue,
  } = useWorkspace();
  const name = getWorkspaceTabPendingName(mainTabs, mainValue, "Main panel");
  const activeEntity = createdEntities.find((entity: { id: string }) => entity.id === mainValue);
  const objectType = activeEntity
    ? objectTypeRecords.find((item: { id: string }) => item.id === activeEntity.objectTypeId)
    : undefined;

  if (activeEntity) {
    return <WorkspaceObjectRenderer entity={activeEntity} objectType={objectType} tabName={name} />;
  }

  function openObjectTypeEntity(entity: SpaceEntityRecord) {
    const entityType = objectTypes.find(
      (item: { id: string; icon?: React.ElementType; tone: ObjectIconTone }) =>
        item.id === entity.objectTypeId,
    ) as { id: string; icon?: React.ElementType; tone: ObjectIconTone } | undefined;
    setActiveAction(undefined);
    setActiveEntityId(entity.id);
    setMainTabs((current: AppHeaderTab[]) => {
      if (current.some((item: AppHeaderTab) => item.id === entity.id)) return current;
      return [
        ...current,
        {
          id: entity.id,
          label: entity.title || "Untitled",
          kind: "object",
          icon: entityType?.icon,
          iconClassName: entityType ? objectIconToneBadgeClass[entityType.tone] : undefined,
          draggable: true,
        },
      ];
    });
    setMainValue(entity.id);
  }

  function createObjectTypeEntity(objectTypeId: string) {
    void createWorkspaceEntity(objectTypeId);
  }

  const activeObjectTypeRecord = objectTypeRecords.find(
    (item: { id: string }) => item.id === mainValue,
  );
  if (activeObjectTypeRecord) {
    return (
      <WorkspaceObjectTypeListView
        entities={createdEntities}
        objectType={activeObjectTypeRecord}
        tabName={name}
        onCreateEntity={() => createObjectTypeEntity(activeObjectTypeRecord.id)}
        onOpenEntity={openObjectTypeEntity}
      />
    );
  }

  const activeObjectType = objectTypes.find((item: { id: string }) => item.id === mainValue);
  if (activeObjectType) {
    return (
      <WorkspaceObjectTypeListView
        entities={createdEntities}
        objectType={{
          id: activeObjectType.id,
          pluralName: activeObjectType.label,
          singularName: activeObjectType.singularLabel ?? activeObjectType.label,
          tone: activeObjectType.tone,
        }}
        tabName={name}
        onCreateEntity={() => createObjectTypeEntity(activeObjectType.id)}
        onOpenEntity={openObjectTypeEntity}
      />
    );
  }

  return (
    <PendingImplementation
      area="Main panel"
      description={`${name} should be implemented here.`}
      name={name}
      variant="workspace"
    />
  );
}

function ContextMenuPendingActionPanel({
  action,
  onReturn,
}: WorkspaceActionPanelProps & { action: string }) {
  const details = getContextMenuPendingDetails(action);
  if (!details) return null;

  return (
    <section className="flex h-full min-h-0 flex-col bg-card p-6">
      <WorkspaceActionPanelHeader label="Context menu" title={details.name} onReturn={onReturn} />
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <PendingImplementation
          area="Workspace action"
          className="max-w-2xl"
          description={details.description}
          name={details.name}
        />
      </div>
    </section>
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
  if (activeAction?.startsWith("pending:")) {
    return (
      <ContextMenuPendingActionPanel
        action={activeAction.replace("pending:", "")}
        onReturn={returnToWorkspace}
      />
    );
  }

  return <WorkspaceDefaultPanel />;
}
