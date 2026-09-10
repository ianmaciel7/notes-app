"use client";

import * as React from "react";
import {
  ArrowDownUp,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Hash,
  Grid2X2,
  LayoutGrid,
  List,
  Rows3,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { ObjectTypeIconBadge } from "@/components/object-icons";
import { PendingImplementation } from "@/components/pending-implementation";
import { WorkspaceEmptyState } from "@/components/space-surface";
import {
  WorkspaceObjectDataView,
  type WorkspaceObjectDataViewGroup,
  type WorkspaceObjectDataViewLayout,
  type WorkspaceObjectDataViewType,
} from "@/components/workspace-object-data-view";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
  mode: "all",
  query: "",
  sort: "updated-desc",
};

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

function PendingObjectRenderer({ entity, objectType, tabName }: WorkspaceObjectRendererProps) {
  const objectTypeName = getObjectTypeName(entity, objectType);

  return (
    <PendingImplementation
      area={objectTypeName}
      description={`${tabName} should be implemented here.`}
      name={`${objectTypeName} object`}
      variant="workspace"
    />
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

  const items = React.useMemo(() => {
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
      className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[var(--app-bg-base)] text-[var(--app-text-primary)]"
    >
      <header className="shrink-0 border-b border-[var(--app-border-front)] bg-[var(--app-bg-front)] px-3 pb-1.5 pt-4">
        <div className="flex min-h-8 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <ObjectTypeIconBadge
              id={objectType.id}
              iconName={objectType.iconName}
              tone={objectType.tone ?? "gray"}
              className="size-[26px] rounded-[7px]"
              iconClassName="size-3.5"
            />
            <h1 className="truncate text-xl font-semibold leading-6 text-[var(--app-text-primary)]">
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
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSearchOpen(true)}>Buscar</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updatePreferences({
                        allLayout: "cards",
                        filter: "all",
                        groupBy: "none",
                        mode: "all",
                        query: "",
                        sort: "updated-desc",
                      })
                    }
                  >
                    Restaurar visualização
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
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onCreateEntity}>
                          Novo {singularName}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSearchOpen(true)}>
                          Buscar em {listName}
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
                "flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm transition-colors",
                preferences.mode === "overview"
                  ? "bg-[var(--app-bg-el)] text-[var(--app-text-primary)]"
                  : "hover:bg-[var(--app-bg-el-hover)] hover:text-[var(--app-text-primary)]",
              )}
            >
              <LayoutGrid className="size-3.5" />
              Visão geral
            </button>
            <button
              type="button"
              aria-pressed={preferences.mode === "all"}
              onClick={() => updatePreferences({ mode: "all" })}
              className={cn(
                "flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm transition-colors",
                preferences.mode === "all"
                  ? "bg-[var(--app-bg-el)] text-[var(--app-text-primary)]"
                  : "hover:bg-[var(--app-bg-el-hover)] hover:text-[var(--app-text-primary)]",
              )}
            >
              <List className="size-3.5" />
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
              <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuRadioGroup
                  value={preferences.filter}
                  onValueChange={(filter) =>
                    updatePreferences({ filter: filter as WorkspaceObjectTypeListFilter })
                  }
                >
                  <DropdownMenuRadioItem value="all">Todos os objetos</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="tagged">Com etiquetas</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="untagged">Sem etiquetas</DropdownMenuRadioItem>
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
              <DropdownMenuContent align="end" className="min-w-52">
                <DropdownMenuRadioGroup
                  value={preferences.sort}
                  onValueChange={(sort) =>
                    updatePreferences({ sort: sort as WorkspaceObjectTypeListSort })
                  }
                >
                  <DropdownMenuRadioItem value="updated-desc">
                    Atualização, mais recente
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="updated-asc">
                    Atualização, mais antiga
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="title-asc">Título, crescente</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="title-desc">
                    Título, decrescente
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
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuRadioGroup
                  value={preferences.groupBy}
                  onValueChange={(groupBy) =>
                    updatePreferences({ groupBy: groupBy as WorkspaceObjectDataViewGroup })
                  }
                >
                  <DropdownMenuRadioItem value="none">Sem agrupamento</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="tag">Etiqueta</DropdownMenuRadioItem>
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
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuRadioGroup
                  value={preferences.allLayout}
                  onValueChange={(allLayout) =>
                    updatePreferences({
                      allLayout: allLayout as WorkspaceObjectDataViewLayout,
                      mode: "all",
                    })
                  }
                >
                  <DropdownMenuRadioItem value="cards">Cartões</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="list">Lista</DropdownMenuRadioItem>
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
    <article className="flex h-full min-h-0 w-full flex-col overflow-auto bg-card">
      <div className="border-b border-border px-8 py-7">
        <p className="text-xs font-medium uppercase text-muted-foreground">Weblink</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-semibold text-foreground">{entity.title}</h1>
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
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 px-8 py-7">
        <PendingImplementation
          area="Weblink notes"
          className="min-h-64"
          description="Notes, saved article content, summary, keywords, category, and topic should be implemented here."
          name="Weblink reader"
        />
      </div>
    </article>
  );
}

export function WorkspaceObjectRenderer(props: WorkspaceObjectRendererProps) {
  if (props.entity.objectTypeId === "weblink" || props.entity.type === "weblink") {
    return <WorkspaceWeblinkObject entity={props.entity} />;
  }

  return <PendingObjectRenderer {...props} />;
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
    <div className="h-full min-h-0 w-full overflow-auto bg-card p-6">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
        {entities.map((entity) => {
          const objectType = objectTypes.find((candidate) => candidate.id === entity.objectTypeId);

          return (
            <section
              className="min-h-[22rem] overflow-hidden rounded-lg border border-border bg-card"
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
