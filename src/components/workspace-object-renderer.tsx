"use client";

import {
  ArrowDownUp,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Grid2X2,
  Hash,
  LayoutPanelTop,
  List,
  MoreHorizontal,
  Plus,
  Rows3,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import * as React from "react";

import { ObjectTypeIconBadge } from "@/components/object-icons";
import { PendingImplementation } from "@/components/pending-implementation";
import { WorkspaceEmptyState } from "@/components/space-surface";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  CompactMenuIconFrame,
  CompactMenuItemText,
  sidebarContextMenuContentClass,
  sidebarContextMenuItemClass,
  sidebarContextMenuSeparatorClass,
} from "@/components/ui/compact-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  WorkspaceObjectDataView,
  type WorkspaceObjectDataViewGroup,
  type WorkspaceObjectDataViewLayout,
  type WorkspaceObjectDataViewType,
} from "@/components/workspace-object-data-view";
import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";
import { cn } from "@/lib/utils";

type WorkspaceObjectTypeListInfo = WorkspaceObjectDataViewType;

type WorkspaceObjectRendererProps = {
  entity: SpaceEntityRecord;
  objectType?: SpaceObjectTypeRecord;
  tabName: string;
};

type WorkspaceObjectTypeListViewProps = {
  entities: readonly SpaceEntityRecord[];
  objectType: WorkspaceObjectTypeListInfo;
  tabName: string;
  onCreateEntity?: () => void;
  onOpenEntity?: (entity: SpaceEntityRecord) => void;
};

type WorkspaceListRendererProps = {
  entities: readonly SpaceEntityRecord[];
  objectTypes?: readonly SpaceObjectTypeRecord[];
  tabName: string;
};

function readStringProperty(entity: SpaceEntityRecord, keys: string[]) {
  for (const key of keys) {
    const value = entity.properties[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function normalizeUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    return new URL(value).href.replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

export function getWorkspaceWeblinkUrl(entity: SpaceEntityRecord) {
  const propertyUrl = readStringProperty(entity, ["url", "URL", "href", "sourceUrl"]);
  return normalizeUrl(propertyUrl);
}

function getObjectTypeName(entity: SpaceEntityRecord, objectType?: SpaceObjectTypeRecord) {
  const name = objectType?.singularName ?? entity.objectTypeId.replace(/[-_]/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getReadablePropertyValue(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const items = value.map(getReadablePropertyValue).filter(Boolean);
    return items.length ? items.join(", ") : undefined;
  }
  if (typeof value === "object") return JSON.stringify(value);
  return undefined;
}

function getReadableProperties(entity: SpaceEntityRecord, hiddenKeys: string[] = []) {
  const hidden = new Set(hiddenKeys.map((key) => key.toLocaleLowerCase()));
  return Object.entries(entity.properties)
    .filter(([key]) => !hidden.has(key.toLocaleLowerCase()))
    .map(([key, value]) => [key, getReadablePropertyValue(value)] as const)
    .filter(([, value]) => value);
}

function renderWorkspaceBlock(block: SpaceEntityRecord["blocks"][number]) {
  const content = block.content.trim();

  if (block.type === "divider") {
    return <hr key={block.id} className="my-5 border-[var(--app-border-el)]" />;
  }

  if (!content) return null;

  if (block.type === "heading_1") {
    return (
      <h2 key={block.id} className="mt-6 text-2xl font-semibold text-[var(--app-text-primary)]">
        {content}
      </h2>
    );
  }

  if (block.type === "heading_2") {
    return (
      <h3 key={block.id} className="mt-5 text-xl font-semibold text-[var(--app-text-primary)]">
        {content}
      </h3>
    );
  }

  if (block.type === "heading_3") {
    return (
      <h4 key={block.id} className="mt-4 text-base font-semibold text-[var(--app-text-primary)]">
        {content}
      </h4>
    );
  }

  if (block.type === "quote" || block.type === "callout") {
    return (
      <blockquote
        key={block.id}
        className="rounded-lg border-l-2 border-[var(--app-border-front)] bg-[var(--app-bg-el)] px-4 py-3 text-[var(--app-text-secondary)]"
      >
        {content}
      </blockquote>
    );
  }

  if (block.type === "code") {
    return (
      <pre
        key={block.id}
        className="overflow-x-auto rounded-lg bg-[var(--app-bg-el)] p-3 text-sm text-[var(--app-text-primary)]"
      >
        <code>{content}</code>
      </pre>
    );
  }

  if (block.type === "bullet_list" || block.type === "numbered_list") {
    return (
      <p key={block.id} className="pl-4 text-[var(--app-text-primary)]">
        {block.type === "bullet_list" ? "• " : "1. "}
        {content}
      </p>
    );
  }

  return (
    <p key={block.id} className="text-[var(--app-text-primary)]">
      {content}
    </p>
  );
}

type WorkspaceObjectTypeListMode = "all" | "overview";
type WorkspaceObjectTypeListFilter = "all" | "tagged" | "untagged";
type WorkspaceObjectTypeListSort = "updated-desc" | "updated-asc" | "title-asc" | "title-desc";

type WorkspaceObjectTypeListPreferences = {
  allLayout: WorkspaceObjectDataViewLayout;
  filter: WorkspaceObjectTypeListFilter;
  groupBy: WorkspaceObjectDataViewGroup;
  mode: WorkspaceObjectTypeListMode;
  query: string;
  sort: WorkspaceObjectTypeListSort;
};

type StoredWorkspaceObjectTypeListPreferences = Partial<WorkspaceObjectTypeListPreferences> & {
  sortNewestFirst?: boolean;
};

const objectTypeListPreferencesPrefix = "knowledgeos.workspace.objectTypeList";

const defaultObjectTypeListPreferences: WorkspaceObjectTypeListPreferences = {
  allLayout: "cards",
  filter: "all",
  groupBy: "none",
  mode: "overview",
  query: "",
  sort: "updated-desc",
};

function WorkspaceObjectTypeMenuIcon({ children }: { children: React.ReactNode }) {
  return <CompactMenuIconFrame variant="ghost">{children}</CompactMenuIconFrame>;
}

function WorkspaceObjectTypeMenuLabel({ children }: { children: React.ReactNode }) {
  return <CompactMenuItemText>{children}</CompactMenuItemText>;
}

function getObjectTypeListPreferencesKey(spaceId: string, objectTypeId: string) {
  return `${objectTypeListPreferencesPrefix}.${spaceId}.${objectTypeId}`;
}

function readObjectTypeListPreferences(key: string): WorkspaceObjectTypeListPreferences {
  if (typeof window === "undefined") return defaultObjectTypeListPreferences;
  try {
    const value = JSON.parse(
      window.localStorage.getItem(key) ?? "null",
    ) as StoredWorkspaceObjectTypeListPreferences | null;
    return {
      allLayout: value?.allLayout === "list" ? "list" : "cards",
      filter: value?.filter === "tagged" || value?.filter === "untagged" ? value.filter : "all",
      groupBy: value?.groupBy === "tag" ? "tag" : "none",
      mode: value?.mode === "overview" ? "overview" : "all",
      query: typeof value?.query === "string" ? value.query : "",
      sort:
        value?.sort === "updated-asc" ||
        value?.sort === "title-asc" ||
        value?.sort === "title-desc" ||
        value?.sort === "updated-desc"
          ? value.sort
          : value?.sortNewestFirst === false
            ? "updated-asc"
            : "updated-desc",
    };
  } catch {
    return defaultObjectTypeListPreferences;
  }
}

function WorkspaceGenericObject({ entity, objectType }: WorkspaceObjectRendererProps) {
  const objectTypeName = getObjectTypeName(entity, objectType);
  const readableProperties = getReadableProperties(entity);
  const hasBody = entity.blocks.some((block) => block.type === "divider" || block.content.trim());

  return (
    <article
      data-slot="workspace-generic-object"
      className="flex h-full min-h-0 w-full flex-col overflow-auto bg-[var(--app-bg-front)]"
    >
      <header className="border-b border-[var(--app-border-front)] px-8 py-7">
        <div className="flex min-w-0 items-center gap-2">
          <ObjectTypeIconBadge
            id={objectType?.id ?? entity.objectTypeId}
            iconName={objectType?.iconName}
            tone={objectType?.tone ?? "gray"}
            className="size-6 rounded-md"
            iconClassName="size-3.5"
          />
          <p className="text-xs font-medium uppercase text-[var(--app-text-secondary)]">
            {objectTypeName}
          </p>
        </div>
        <h1 className="mt-3 break-words text-3xl font-semibold text-[var(--app-text-primary)]">
          {entity.title || "Sem título"}
        </h1>
        {entity.tags.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {entity.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[var(--app-border-el)] bg-[var(--app-bg-el)] px-2 py-1 text-xs text-[var(--app-text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-8 py-7">
        {hasBody ? (
          <div className="space-y-3 text-sm leading-6">
            {entity.blocks.map(renderWorkspaceBlock)}
          </div>
        ) : (
          <WorkspaceEmptyState
            className="border-[var(--app-border-el)] bg-[var(--app-bg-front)]"
            title="Sem conteúdo"
            description="Este objeto ainda não tem blocos salvos."
          />
        )}
        {readableProperties.length ? (
          <section className="mt-4 border-t border-[var(--app-border-front)] pt-4">
            <h2 className="text-sm font-medium text-[var(--app-text-primary)]">Propriedades</h2>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              {readableProperties.map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg border border-[var(--app-border-el)] bg-[var(--app-bg-el)] p-3"
                >
                  <dt className="text-xs font-medium uppercase text-[var(--app-text-secondary)]">
                    {key}
                  </dt>
                  <dd className="mt-1 break-words text-[var(--app-text-primary)]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>
    </article>
  );
}

function WorkspaceObjectTypeOverviewEmptyCard({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="py-10 flex w-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <h3 className="text-sm font-medium text-[var(--app-text-secondary)]">{title}</h3>
        <p className="max-w-md px-4 text-xs text-[var(--app-text-secondary)]">{description}</p>
      </div>
    </div>
  );
}

function WorkspaceObjectTypeOverview({
  entities,
  objectType,
  onOpenEntity,
}: Pick<WorkspaceObjectTypeListViewProps, "onOpenEntity"> & {
  entities: readonly SpaceEntityRecord[];
  objectType: WorkspaceObjectTypeListInfo;
}) {
  return (
    <div data-slot="workspace-object-type-overview" className="w-full space-y-6">
      <section data-slot="workspace-object-type-overview-recent">
        <h2 className="mb-2 px-0.5 text-sm font-medium text-[var(--app-text-secondary)]">
          Recentemente aberto
        </h2>
        {entities.length ? (
          <WorkspaceObjectDataView
            entities={entities}
            layout="cards"
            groupBy="none"
            objectType={objectType}
            onOpenEntity={onOpenEntity}
          />
        ) : (
          <WorkspaceObjectTypeOverviewEmptyCard
            title="Sem objetos recentes"
            description="Os objetos abertos recentemente aparecerão aqui."
          />
        )}
      </section>
      <section data-slot="workspace-object-type-overview-collections">
        <h2 className="mb-2 px-0.5 text-sm font-medium text-[var(--app-text-secondary)]">
          Coleções
        </h2>
        <WorkspaceObjectTypeOverviewEmptyCard
          title="Sem coleções"
          description="Você pode mudar isso criando uma nova coleção."
        />
      </section>
      <section data-slot="workspace-object-type-overview-queries">
        <h2 className="mb-2 px-0.5 text-sm font-medium text-[var(--app-text-secondary)]">
          Queries
        </h2>
        <WorkspaceObjectTypeOverviewEmptyCard
          title="Sem queries"
          description="As Queries que você criar neste banco de dados aparecerão aqui."
        />
      </section>
    </div>
  );
}

export function WorkspaceObjectTypeListView({
  entities,
  objectType,
  tabName,
  onCreateEntity,
  onOpenEntity,
}: WorkspaceObjectTypeListViewProps) {
  const listName = objectType.pluralName || tabName;
  const singularName = objectType.singularName || listName;
  const spaceId = objectType.spaceId ?? entities[0]?.spaceId ?? "personal";
  const preferencesKey = React.useMemo(
    () => getObjectTypeListPreferencesKey(spaceId, objectType.id),
    [objectType.id, spaceId],
  );
  const [preferences, setPreferences] = React.useState<WorkspaceObjectTypeListPreferences>(
    defaultObjectTypeListPreferences,
  );
  const [loadedPreferencesKey, setLoadedPreferencesKey] = React.useState<string | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [headerCollapsed, setHeaderCollapsed] = React.useState(false);
  const searchTriggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const nextPreferences = readObjectTypeListPreferences(preferencesKey);
    setPreferences(nextPreferences);
    setSearchOpen(Boolean(nextPreferences.query));
    setLoadedPreferencesKey(preferencesKey);
  }, [preferencesKey]);

  React.useEffect(() => {
    if (loadedPreferencesKey !== preferencesKey || typeof window === "undefined") return;
    window.localStorage.setItem(preferencesKey, JSON.stringify(preferences));
  }, [loadedPreferencesKey, preferences, preferencesKey]);

  function updatePreferences(update: Partial<WorkspaceObjectTypeListPreferences>) {
    setPreferences((current) => ({ ...current, ...update }));
  }

  const items = React.useMemo<SpaceEntityRecord[]>(() => {
    const normalizedQuery = preferences.query.trim().toLocaleLowerCase();
    const matchingItems = entities.filter((entity) => {
      if (entity.objectTypeId !== objectType.id) return false;
      if (preferences.filter === "tagged" && entity.tags.length === 0) return false;
      if (preferences.filter === "untagged" && entity.tags.length > 0) return false;
      if (!normalizedQuery) return true;
      return `${entity.title} ${entity.blocks.map((block) => block.content).join(" ")}`
        .toLocaleLowerCase()
        .includes(normalizedQuery);
    });

    return [...matchingItems].sort((left, right) => {
      if (preferences.sort === "title-asc" || preferences.sort === "title-desc") {
        const order = (left.title || "Sem título").localeCompare(right.title || "Sem título");
        return preferences.sort === "title-asc" ? order : -order;
      }
      const order = left.updatedAt.localeCompare(right.updatedAt);
      return preferences.sort === "updated-desc" ? -order : order;
    });
  }, [entities, objectType.id, preferences.filter, preferences.query, preferences.sort]);
  const layout: WorkspaceObjectDataViewLayout =
    preferences.mode === "overview" ? "cards" : preferences.allLayout;
  const objectCountLabel = `${items.length} ${items.length === 1 ? "objeto" : "objetos"}`;
  const hasFilteredResults = Boolean(preferences.query.trim()) || preferences.filter !== "all";

  return (
    <section
      data-slot="workspace-object-type-list-view"
      className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-[var(--app-border-front)] bg-[var(--app-bg-base)] text-[var(--app-text-primary)] shadow-[0_2px_3px_0_rgba(0,0,0,0.004),0_4px_9px_0_rgba(0,0,0,0.01),0_8px_12px_0_rgba(0,0,0,0.004)]"
    >
      <header className="shrink-0 border-b border-[var(--app-border-front)] bg-[var(--app-bg-front)] px-3 pb-1.5 pt-4">
        <div className="flex min-h-8 items-center justify-between gap-2">
          <div
            data-slot="workspace-object-type-heading"
            data-context-menu-entity-context-key={`${objectType.id}:${singularName}`}
            className="flex min-w-0 grow items-center truncate"
          >
            <div className="dataview-heading-icon-container mr-2.5 size-[26px] shrink-0">
              <div className="dataview-heading-icon-fill h-full w-full">
                <ObjectTypeIconBadge
                  id={objectType.id}
                  iconName={objectType.iconName}
                  tone={objectType.tone ?? "gray"}
                  className="size-full rounded-[7px]"
                  iconClassName="size-3.5 opacity-90"
                />
              </div>
            </div>
            <h1 className="dataview-heading max-w-max truncate text-xl font-semibold leading-6 text-[var(--app-text-primary)]">
              {listName}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <div className="flex h-8 items-center rounded-lg bg-[var(--app-bg-el)]">
              {searchOpen ? (
                <Input
                  autoFocus
                  value={preferences.query}
                  onChange={(event) => updatePreferences({ query: event.target.value })}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setSearchOpen(false);
                      updatePreferences({ query: "" });
                      requestAnimationFrame(() => searchTriggerRef.current?.focus());
                    }
                  }}
                  placeholder={`Buscar em ${listName}`}
                  className="h-8 w-40 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0"
                />
              ) : (
                <Button
                  type="button"
                  ref={searchTriggerRef}
                  variant="ghost"
                  size="icon-sm"
                  tooltip="Buscar nesta visualização"
                  aria-label={`Buscar em ${listName}`}
                  aria-pressed={searchOpen}
                  className="size-8 rounded-none"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="size-3.5" />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                tooltip={headerCollapsed ? "Expandir cabeçalho" : "Recolher cabeçalho"}
                aria-label={headerCollapsed ? "Expandir cabeçalho" : "Recolher cabeçalho"}
                aria-expanded={!headerCollapsed}
                className="size-8 rounded-none"
                onClick={() => setHeaderCollapsed((current) => !current)}
              >
                <ChevronUp
                  className={cn("size-3.5 transition-transform", headerCollapsed && "rotate-180")}
                />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      tooltip="Mais ações"
                      aria-label="Mais ações"
                      className="size-8 rounded-none"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className={sidebarContextMenuContentClass}>
                  <DropdownMenuItem
                    className={sidebarContextMenuItemClass}
                    onClick={() => setSearchOpen(true)}
                  >
                    <WorkspaceObjectTypeMenuIcon>
                      <Search />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>Buscar</WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={sidebarContextMenuItemClass}
                    onClick={() =>
                      updatePreferences({
                        allLayout: "cards",
                        filter: "all",
                        groupBy: "none",
                        mode: "overview",
                        query: "",
                        sort: "updated-desc",
                      })
                    }
                  >
                    <WorkspaceObjectTypeMenuIcon>
                      <Rows3 />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>
                      Restaurar visualização
                    </WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {onCreateEntity ? (
              <div data-slot="workspace-object-type-new-action">
                <ButtonGroup className="h-8 overflow-hidden rounded-lg bg-[var(--app-button-primary-bg)] text-[var(--app-button-primary-text)]">
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 rounded-r-none border-r border-white/15 bg-transparent px-2.5 text-[var(--app-button-primary-text)] hover:bg-white/10"
                    onClick={onCreateEntity}
                  >
                    <Plus className="size-3.5" />
                    Novo
                  </Button>
                  <div data-slot="workspace-object-type-new-menu">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            size="icon-sm"
                            aria-label={`Novo ${singularName}`}
                            className="h-8 w-8 rounded-l-none bg-transparent text-[var(--app-button-primary-text)] hover:bg-white/10"
                          >
                            <ChevronDown className="size-3.5" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className={sidebarContextMenuContentClass}>
                        <DropdownMenuItem
                          className={sidebarContextMenuItemClass}
                          onClick={onCreateEntity}
                        >
                          <WorkspaceObjectTypeMenuIcon>
                            <Plus />
                          </WorkspaceObjectTypeMenuIcon>
                          <WorkspaceObjectTypeMenuLabel>
                            Novo {singularName}
                          </WorkspaceObjectTypeMenuLabel>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className={sidebarContextMenuSeparatorClass} />
                        <DropdownMenuItem
                          className={sidebarContextMenuItemClass}
                          onClick={() => setSearchOpen(true)}
                        >
                          <WorkspaceObjectTypeMenuIcon>
                            <Search />
                          </WorkspaceObjectTypeMenuIcon>
                          <WorkspaceObjectTypeMenuLabel>
                            Buscar em {listName}
                          </WorkspaceObjectTypeMenuLabel>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </ButtonGroup>
              </div>
            ) : null}
          </div>
        </div>

        {!headerCollapsed ? (
          <div
            data-slot="workspace-object-type-list-toolbar"
            className="mt-4 flex min-h-8 items-center gap-0 overflow-x-auto text-sm text-[var(--app-text-secondary)]"
          >
            <button
              type="button"
              aria-pressed={preferences.mode === "overview"}
              onClick={() => updatePreferences({ mode: "overview" })}
              className={cn(
                "relative flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-1 text-sm font-medium transition-all duration-250",
                preferences.mode === "overview"
                  ? "border-[var(--app-border-front)] bg-[var(--app-bg-el)] text-[var(--app-text-primary)]"
                  : "border-[var(--app-border-el)] text-[var(--app-text-secondary)] hover:bg-[var(--app-bg-el-hover)] hover:text-[var(--app-text-primary)]",
              )}
            >
              <LayoutPanelTop className="size-3.5 text-[var(--app-text-secondary)]" />
              Visão geral
            </button>
            <button
              type="button"
              aria-pressed={preferences.mode === "all"}
              onClick={() => updatePreferences({ mode: "all" })}
              className={cn(
                "relative flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-1 text-sm font-medium transition-all duration-250",
                preferences.mode === "all"
                  ? "border-[var(--app-border-front)] bg-[var(--app-bg-el)] text-[var(--app-text-primary)]"
                  : "border-[var(--app-border-el)] text-[var(--app-text-secondary)] hover:bg-[var(--app-bg-el-hover)] hover:text-[var(--app-text-primary)]",
              )}
            >
              <List className="size-3.5 text-[var(--app-text-secondary)]" />
              Tudo
            </button>
            <span
              aria-label={`Quantidade de objetos: ${objectCountLabel}`}
              role="status"
              className="ml-auto mr-2 flex h-7 shrink-0 items-center gap-1.5 rounded-lg px-1.5 text-xs text-[var(--app-text-secondary)]"
            >
              <Hash className="size-3.5" />
              {items.length}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    tooltip="Filtrar"
                    aria-label="Filtrar objetos"
                    className="h-7 w-8 rounded-lg px-2 hover:!bg-[var(--app-bg-el-hover)] aria-expanded:!bg-[var(--app-bg-el)]"
                  >
                    <SlidersHorizontal className="size-3.5" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className={sidebarContextMenuContentClass}>
                <DropdownMenuRadioGroup
                  value={preferences.filter}
                  onValueChange={(filter) =>
                    updatePreferences({ filter: filter as WorkspaceObjectTypeListFilter })
                  }
                >
                  <DropdownMenuRadioItem className={sidebarContextMenuItemClass} value="all">
                    <WorkspaceObjectTypeMenuIcon>
                      <SlidersHorizontal />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>Todos os objetos</WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className={sidebarContextMenuItemClass} value="tagged">
                    <WorkspaceObjectTypeMenuIcon>
                      <SlidersHorizontal />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>Com etiquetas</WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className={sidebarContextMenuItemClass} value="untagged">
                    <WorkspaceObjectTypeMenuIcon>
                      <SlidersHorizontal />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>Sem etiquetas</WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    tooltip="Classificar"
                    aria-label="Classificar objetos"
                    className="h-7 w-8 rounded-lg px-2 hover:!bg-[var(--app-bg-el-hover)] aria-expanded:!bg-[var(--app-bg-el)]"
                  >
                    <ArrowDownUp className="size-3.5" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className={sidebarContextMenuContentClass}>
                <DropdownMenuRadioGroup
                  value={preferences.sort}
                  onValueChange={(sort) =>
                    updatePreferences({ sort: sort as WorkspaceObjectTypeListSort })
                  }
                >
                  <DropdownMenuRadioItem
                    className={sidebarContextMenuItemClass}
                    value="updated-desc"
                  >
                    <WorkspaceObjectTypeMenuIcon>
                      <ArrowDownUp />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>
                      Atualização, mais recente
                    </WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    className={sidebarContextMenuItemClass}
                    value="updated-asc"
                  >
                    <WorkspaceObjectTypeMenuIcon>
                      <ArrowDownUp />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>
                      Atualização, mais antiga
                    </WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className={sidebarContextMenuItemClass} value="title-asc">
                    <WorkspaceObjectTypeMenuIcon>
                      <ArrowDownUp />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>Título, crescente</WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className={sidebarContextMenuItemClass} value="title-desc">
                    <WorkspaceObjectTypeMenuIcon>
                      <ArrowDownUp />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>Título, decrescente</WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    tooltip="Agrupar por"
                    aria-label="Agrupar objetos"
                    className="h-7 w-8 rounded-lg px-2 hover:!bg-[var(--app-bg-el-hover)] aria-expanded:!bg-[var(--app-bg-el)]"
                  >
                    <Rows3 className="size-3.5" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className={sidebarContextMenuContentClass}>
                <DropdownMenuRadioGroup
                  value={preferences.groupBy}
                  onValueChange={(groupBy) =>
                    updatePreferences({ groupBy: groupBy as WorkspaceObjectDataViewGroup })
                  }
                >
                  <DropdownMenuRadioItem className={sidebarContextMenuItemClass} value="none">
                    <WorkspaceObjectTypeMenuIcon>
                      <Rows3 />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>Sem agrupamento</WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className={sidebarContextMenuItemClass} value="tag">
                    <WorkspaceObjectTypeMenuIcon>
                      <Rows3 />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>Etiqueta</WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    tooltip="Layout"
                    aria-label="Escolher layout"
                    className="ml-1 h-7 w-[46px] rounded-lg px-1.5 hover:!bg-[var(--app-bg-el-hover)] aria-expanded:!bg-[var(--app-bg-el)]"
                  >
                    {preferences.allLayout === "cards" ? (
                      <Grid2X2 className="size-3.5" />
                    ) : (
                      <List className="size-3.5" />
                    )}
                    <ChevronDown className="size-3.5" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className={sidebarContextMenuContentClass}>
                <DropdownMenuRadioGroup
                  value={preferences.allLayout}
                  onValueChange={(allLayout) =>
                    updatePreferences({
                      allLayout: allLayout as WorkspaceObjectDataViewLayout,
                      mode: "all",
                    })
                  }
                >
                  <DropdownMenuRadioItem className={sidebarContextMenuItemClass} value="cards">
                    <WorkspaceObjectTypeMenuIcon>
                      <Grid2X2 />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>Cartões</WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem className={sidebarContextMenuItemClass} value="list">
                    <WorkspaceObjectTypeMenuIcon>
                      <List />
                    </WorkspaceObjectTypeMenuIcon>
                    <WorkspaceObjectTypeMenuLabel>Lista</WorkspaceObjectTypeMenuLabel>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
      </header>

      <div
        data-slot="workspace-object-type-list-scroll"
        className="min-h-0 flex-1 overflow-y-auto bg-[var(--app-bg-base)] px-3 pb-4 pt-2.5"
      >
        {items.length === 0 ? (
          <WorkspaceEmptyState
            className="mt-2 border-[var(--app-border-el)] bg-[var(--app-bg-front)]"
            title={hasFilteredResults ? "Nenhum resultado encontrado" : `Ainda não há ${listName}`}
            description={
              hasFilteredResults
                ? "Ajuste ou limpe a busca e os filtros para ver outros objetos."
                : `Crie ${singularName === listName ? "um objeto" : `um(a) ${singularName}`} para adicionar aqui.`
            }
            action={
              hasFilteredResults ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => updatePreferences({ filter: "all", query: "" })}
                >
                  Limpar filtros
                </Button>
              ) : onCreateEntity ? (
                <Button type="button" size="sm" onClick={onCreateEntity}>
                  <Plus className="size-3.5" />
                  Novo {singularName}
                </Button>
              ) : undefined
            }
          />
        ) : preferences.mode === "overview" ? (
          <WorkspaceObjectTypeOverview
            entities={items}
            objectType={objectType}
            onOpenEntity={onOpenEntity}
          />
        ) : (
          <WorkspaceObjectDataView
            entities={items}
            layout={layout}
            groupBy={preferences.groupBy}
            objectType={objectType}
            onCreateEntity={onCreateEntity}
            onOpenEntity={onOpenEntity}
          />
        )}
      </div>
    </section>
  );
}

export const WorkspaceObjectListRenderer = WorkspaceObjectTypeListView;

function WorkspaceWeblinkObject({ entity }: { entity: SpaceEntityRecord }) {
  const url = getWorkspaceWeblinkUrl(entity);
  const description = readStringProperty(entity, ["description", "Description", "summary"]);
  const readableProperties = getReadableProperties(entity, ["url", "href", "sourceUrl"]);
  const hasBody = entity.blocks.some((block) => block.type === "divider" || block.content.trim());

  if (!url) {
    return (
      <PendingImplementation
        area="Weblink"
        description="Add a URL property to render this saved link."
        name="Weblink URL"
        variant="workspace"
      />
    );
  }

  return (
    <article className="flex h-full min-h-0 w-full flex-col overflow-auto bg-[var(--app-bg-front)]">
      <div className="border-b border-[var(--app-border-front)] px-8 py-7">
        <p className="text-xs font-medium uppercase text-[var(--app-text-secondary)]">Weblink</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-semibold text-[var(--app-text-primary)]">
              {entity.title}
            </h1>
            <a
              className="mt-2 block truncate text-sm text-primary hover:underline"
              href={url}
              rel="noreferrer"
              target="_blank"
            >
              {url}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              className={buttonVariants({ variant: "outline" })}
              href={url}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink className="size-4" />
              Open
            </a>
            <Button
              variant="secondary"
              onClick={() => {
                void navigator.clipboard?.writeText(url);
              }}
            >
              <Copy className="size-4" />
              Copy URL
            </Button>
          </div>
        </div>
        {description ? (
          <p className="mt-5 max-w-2xl text-sm text-[var(--app-text-secondary)]">{description}</p>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 px-8 py-7">
        {hasBody || readableProperties.length ? (
          <div className="space-y-5 text-sm leading-6">
            {hasBody ? (
              <div className="space-y-3">{entity.blocks.map(renderWorkspaceBlock)}</div>
            ) : null}
            {readableProperties.length ? (
              <dl className="grid gap-2 sm:grid-cols-2">
                {readableProperties.map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-[var(--app-border-el)] bg-[var(--app-bg-el)] p-3"
                  >
                    <dt className="text-xs font-medium uppercase text-[var(--app-text-secondary)]">
                      {key}
                    </dt>
                    <dd className="mt-1 break-words text-[var(--app-text-primary)]">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : (
          <WorkspaceEmptyState
            className="border-[var(--app-border-el)] bg-[var(--app-bg-front)]"
            title="Sem notas"
            description="Este link ainda não tem blocos ou propriedades extras salvas."
          />
        )}
      </div>
    </article>
  );
}

export function WorkspaceObjectRenderer(props: WorkspaceObjectRendererProps) {
  if (props.entity.objectTypeId === "weblink" || props.entity.type === "weblink") {
    return <WorkspaceWeblinkObject entity={props.entity} />;
  }

  return <WorkspaceGenericObject {...props} />;
}

export function WorkspaceListRenderer({
  entities,
  objectTypes = [],
  tabName,
}: WorkspaceListRendererProps) {
  if (entities.length === 0) {
    return (
      <PendingImplementation
        area={tabName}
        description={`${tabName} does not have objects to render yet.`}
        name="Object list"
        variant="workspace"
      />
    );
  }

  return (
    <div className="h-full min-h-0 w-full overflow-auto bg-[var(--app-bg-base)] p-6">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
        {entities.map((entity) => {
          const objectType = objectTypes.find((candidate) => candidate.id === entity.objectTypeId);

          return (
            <section
              className="min-h-[22rem] overflow-hidden rounded-lg border border-[var(--app-border-front)] bg-[var(--app-bg-front)]"
              key={entity.id}
            >
              <WorkspaceObjectRenderer
                entity={entity}
                objectType={objectType}
                tabName={entity.title || tabName}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
