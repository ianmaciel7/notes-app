"use client";

import * as React from "react";
import type { AppHeaderTab } from "@/app/_components/workspace/app-header-tabs";
import type { AppSidebarObjectType } from "@/app/_components/workspace/app-sidebar-overview";
import { type ObjectIconTone, objectIconToneBadgeClass } from "@/app/_components/objects/object-icons";
import { PendingImplementation } from "@/app/_components/shared/pending-implementation";
import { useWorkspace } from "@/app/_components/workspace/space-controller";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  WorkspaceObjectRenderer,
  WorkspaceObjectTypeListView,
} from "@/app/_components/workspace/workspace-object-renderer";
import { searchWorkspaceEntities } from "@/lib/spaces/entity-search";
import type {
  SpaceCollectionRecord,
  SpaceEntityRecord,
  SpaceObjectTypeRecord,
} from "@/lib/spaces/space-types";
import { resolveWorkspaceTabTarget } from "@/lib/spaces/workspace-tab-target";

export { WorkspaceSidePanelContent } from "@/app/_components/workspace/workspace-side-panel-content";

type WorkspaceTabLike = {
  id: string;
  label?: string;
};

type WorkspaceMainPanelContext = {
  activeEntityId?: string | null;
  createdEntities: SpaceEntityRecord[];
  createWorkspaceEntity: (
    objectTypeId: string,
    label?: string,
    options?: { title?: string; collectionId?: string },
  ) => Promise<SpaceEntityRecord | null>;
  mainTabs: AppHeaderTab[];
  mainValue: string;
  objectTypeRecords: SpaceObjectTypeRecord[];
  objectTypeCollections: Record<string, SpaceCollectionRecord>;
  objectTypes: AppSidebarObjectType[];
  ready?: boolean;
  setActiveAction: (action: string | undefined) => void;
  setActiveEntityId: (id: string | null) => void;
  setMainTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>;
  setMainValue: (value: string) => void;
};

function localizeBuiltInObjectType(
  record: SpaceObjectTypeRecord,
  objectTypes: readonly AppSidebarObjectType[],
): SpaceObjectTypeRecord {
  if (record.ownership !== "built-in") return record;
  const localized = objectTypes.find((objectType) => objectType.id === record.id);
  if (!localized) return record;
  return {
    ...record,
    pluralName: localized.label,
    singularName: localized.singularLabel ?? localized.label,
  };
}

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

const workspaceActionPanelClass =
  "flex h-full min-h-0 flex-col gap-4 bg-[var(--app-bg-front)] px-6 py-4 text-[var(--app-text-primary)]";

const workspaceActionPanelSurfaceClass =
  "min-h-0 flex-1 overflow-auto rounded-[12px] border border-[var(--app-border-front)] bg-[var(--app-bg-base)] p-4";

const workspaceActionPanelItemClass =
  "rounded-[10px] border border-[var(--app-border-front)] bg-[var(--app-bg-front)] px-3 py-2 text-sm text-[var(--app-text-primary)] transition-colors hover:bg-[var(--app-bg-el-hover)]";

const workspaceActionPanelItemActiveClass =
  "border-[var(--app-border-base-strong)] bg-[var(--app-bg-el)]";

const workspaceActionPanelMutedTextClass = "text-[var(--app-text-secondary)]";

const workspaceActionPanelSubtleTextClass = "text-[var(--app-text-subtle)]";

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
        <p
          className={`text-xs font-medium uppercase tracking-wide ${workspaceActionPanelSubtleTextClass}`}
        >
          {label}
        </p>
        <h1 className="text-2xl font-semibold text-[var(--app-text-primary)]">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className={`hidden text-xs sm:inline ${workspaceActionPanelSubtleTextClass}`}>
          Esc para sair
        </span>
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
  } = useWorkspace() as WorkspaceMainPanelContext;
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

  const results = React.useMemo(
    () => searchWorkspaceEntities(createdEntities, query),
    [createdEntities, query],
  );

  React.useEffect(() => {
    if (activeEntityId && activeEntityId !== "page") {
      const activeResultIndex = results.findIndex((result) => result.id === activeEntityId);
      setActiveSearchIndex(activeResultIndex >= 0 ? activeResultIndex : 0);
    } else {
      setActiveSearchIndex(0);
    }
    searchInputRef.current?.focus();
  }, [activeEntityId, results]);

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
    <section className={workspaceActionPanelClass}>
      <WorkspaceActionPanelHeader label="Search" title="Search" onReturn={onReturn} />
      <div className="flex flex-col gap-3">
        <label
          className={`text-sm ${workspaceActionPanelMutedTextClass}`}
          htmlFor="workspace-search-input"
        >
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
        className={workspaceActionPanelSurfaceClass}
        tabIndex={0}
        aria-activedescendant={
          results[activeSearchIndex] ? `search-result-${results[activeSearchIndex]?.id}` : undefined
        }
        role="listbox"
        aria-label="Search results"
        onKeyDown={handleSearchListKeyDown}
      >
        {!ready ? (
          <p className={`text-sm ${workspaceActionPanelMutedTextClass}`}>Carregando workspace…</p>
        ) : results.length === 0 ? (
          <p className={`text-sm ${workspaceActionPanelMutedTextClass}`}>
            Nenhum resultado encontrado. Tente outro termo ou use o atalho{" "}
            <span className="font-medium text-[var(--app-text-primary)]">Ctrl+K</span> para abrir a
            paleta.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {results.map((entity) => {
              const typeName = objectTypeById[entity.objectTypeId] ?? "Unknown";
              const isActive = activeSearchIndex === results.indexOf(entity);
              const itemId = `search-result-${entity.id}`;
              return (
                <li
                  key={entity.id}
                  id={itemId}
                  className={`${workspaceActionPanelItemClass} ${
                    isActive || activeEntityId === entity.id
                      ? workspaceActionPanelItemActiveClass
                      : ""
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
                    <p className={`text-xs ${workspaceActionPanelSubtleTextClass}`}>
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
    <section className={workspaceActionPanelClass}>
      <WorkspaceActionPanelHeader label="Calendar" title="Agenda" onReturn={onReturn} />

      <div
        className={`${workspaceActionPanelSurfaceClass} text-sm ${workspaceActionPanelMutedTextClass}`}
      >
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
  } = useWorkspace() as WorkspaceMainPanelContext;
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
      .then((entity) => {
        if (!entity) return;
        openTask(entity);
      })
      .catch(() => undefined);
  }

  return (
    <section className={workspaceActionPanelClass}>
      <WorkspaceActionPanelHeader label="Tasks" title="Tarefas" onReturn={onReturn} />

      <div
        ref={listContainerRef}
        className={workspaceActionPanelSurfaceClass}
        role="listbox"
        tabIndex={0}
        aria-activedescendant={activeTaskId ? `task-result-${activeTaskId}` : undefined}
        onKeyDown={handleTasksKeyDown}
        aria-label="Task list"
      >
        {!ready ? (
          <p className={`text-sm ${workspaceActionPanelMutedTextClass}`}>Carregando tarefas…</p>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col gap-3">
            <p className={`text-sm ${workspaceActionPanelMutedTextClass}`}>
              Nenhuma tarefa encontrada.
            </p>
            <Button type="button" variant="outline" onClick={handleCreateTask}>
              Criar primeira tarefa
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                id={`task-result-${task.id}`}
                className={`${workspaceActionPanelItemClass} ${
                  activeTaskId === task.id ? workspaceActionPanelItemActiveClass : ""
                }`}
              >
                <button
                  type="button"
                  className="w-full rounded text-left"
                  onClick={() => openTask(task)}
                  onMouseEnter={() => setActiveTaskId(task.id)}
                >
                  <p className="font-medium">{task.title || "Sem título"}</p>
                  <p className={`text-xs ${workspaceActionPanelSubtleTextClass}`}>
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
    objectTypeCollections,
    objectTypes,
    setActiveAction,
    setActiveEntityId,
    setMainTabs,
    setMainValue,
  } = useWorkspace() as WorkspaceMainPanelContext;
  const name = getWorkspaceTabPendingName(mainTabs, mainValue, "Main panel");
  const collectionNamesById = React.useMemo(
    () =>
      Object.fromEntries(
        Object.values(objectTypeCollections ?? {}).map((collection) => [
          collection.id,
          collection.name,
        ]),
      ),
    [objectTypeCollections],
  );
  const target = resolveWorkspaceTabTarget(mainValue, {
    entityIds: createdEntities.map((entity) => entity.id),
    objectTypeIds: objectTypes.map((type) => type.id),
    collections: objectTypeCollections,
  });
  const activeEntity =
    target?.kind === "entity"
      ? createdEntities.find((entity) => entity.id === target.id)
      : undefined;
  const objectTypeRecord = activeEntity
    ? objectTypeRecords.find((item: { id: string }) => item.id === activeEntity.objectTypeId)
    : undefined;
  const objectType = objectTypeRecord
    ? localizeBuiltInObjectType(objectTypeRecord, objectTypes)
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
    void createWorkspaceEntity(objectTypeId, undefined, {
      collectionId: target?.kind === "collection" ? target.id : undefined,
    });
  }

  const typeId = target?.kind === "collection" ? target.objectTypeId : target?.id;
  const visibleEntities =
    target?.kind === "collection"
      ? createdEntities.filter((entity) => entity.collections?.includes(target.id))
      : createdEntities;
  const activeObjectTypeRecord = objectTypeRecords.find((item) => item.id === typeId);
  if (activeObjectTypeRecord) {
    const displayedObjectType = localizeBuiltInObjectType(activeObjectTypeRecord, objectTypes);
    return (
      <WorkspaceObjectTypeListView
        collectionNamesById={collectionNamesById}
        entities={visibleEntities}
        objectType={displayedObjectType}
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
        collectionNamesById={collectionNamesById}
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
    <section className={workspaceActionPanelClass}>
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
