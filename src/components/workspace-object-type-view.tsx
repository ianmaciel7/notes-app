"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { AppHeaderCaretDownIcon } from "@/components/app-header-icons";
import {
  AppSidebarDotsIcon,
  AppSidebarPlusIcon,
  AppSidebarSearchIcon,
} from "@/components/app-sidebar-icons";
import type { AppSidebarObjectType } from "@/components/app-sidebar-overview";
import {
  ObjectCollectionIcon,
  ObjectIconBadge,
  ObjectQueryIcon,
  objectIconToneBadgeClass,
} from "@/components/object-icons";
import { ObjectTypeToolbarIcon } from "@/components/object-type-toolbar-icon";
import {
  DataViewRenderer,
  type ObjectViewLabels,
} from "@/components/object-views";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  WorkspaceEmptyState,
  workspaceFieldGroupClass,
  workspaceNamedCardClass,
  workspaceOverviewContentClass,
  workspaceRouteClass,
  workspaceSectionTitleClass,
} from "@/components/ui/workspace-surface";
import { useWorkspace } from "@/components/workspace-controller";
import { useWorkspaceViews } from "@/components/workspace-views-controller";
import { cn } from "@/lib/utils";
import {
  createCollectionId,
  selectWorkspaceCollectionRecordsForStructure,
  type WorkspaceCollectionRecord,
} from "@/lib/workspace-domain-identities";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import {
  type DataViewKind,
  executeQueryDefinition,
  type WorkspaceDataView,
} from "@/lib/workspace-object-views";
import type { WorkspaceEntity } from "@/lib/workspace-objects";

type WorkspaceObjectTypeViewProps = {
  readonly objectType: AppSidebarObjectType;
  readonly structure: WorkspaceStructure;
  readonly view: WorkspaceDataView;
};

type Mode = "all" | "overview";
type ObjectTypeNamedItemKind = "collection" | "query";
type ObjectTypeNamedItemTarget =
  | {
      kind: "collection";
      collectionId: string;
    }
  | {
      kind: "query";
      objectTypeId: string;
      index: number;
    };

function objectTypeNamedItemTabId(item: ObjectTypeNamedItemTarget) {
  return item.kind === "collection"
    ? `object-type-item:collection:${item.collectionId}`
    : `object-type-item:query:${item.objectTypeId}:${item.index}`;
}

type ObjectTypeHeaderProps = {
  readonly collapsed: boolean;
  readonly objectType: AppSidebarObjectType;
  readonly onAddCollection: () => void;
  readonly onAddQuery: () => void;
  readonly onCreateObject: () => void;
  readonly onSearch: (value: string) => void;
  readonly onSearchOpenChange: (value: boolean) => void;
  readonly onToggleCollapsed: () => void;
  readonly searchOpen: boolean;
  readonly searchValue?: string;
};

function ObjectTypeHeaderSearch({
  onSearch,
  onSearchOpenChange,
  searchOpen,
  searchValue,
}: Pick<
  ObjectTypeHeaderProps,
  "onSearch" | "onSearchOpenChange" | "searchOpen" | "searchValue"
>) {
  const t = useTranslations("workspace");
  if (searchOpen) {
    return (
      <Input
        autoFocus
        aria-label={t("objectTypeOverview.searchPlaceholder")}
        placeholder={t("objectTypeOverview.searchPlaceholder")}
        defaultValue={searchValue ?? ""}
        className="h-7 w-44 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
        onChange={(event) => onSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onSearchOpenChange(false);
            onSearch("");
          }
        }}
      />
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={t("actions.search")}
      className="size-8 rounded-none"
      onClick={() => onSearchOpenChange(true)}
    >
      <AppSidebarSearchIcon className="size-4" />
    </Button>
  );
}

function ObjectTypeMoreMenu({
  onAddCollection,
  onAddQuery,
  onCreateObject,
}: Pick<
  ObjectTypeHeaderProps,
  "onAddCollection" | "onAddQuery" | "onCreateObject"
>) {
  const t = useTranslations("workspace");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("actions.moreOptions")}
            className="size-8 rounded-none"
          >
            <AppSidebarDotsIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem onClick={onCreateObject}>
          {t("objectTypeOverview.newFromTemplate")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddQuery}>
          {t("objectTypeOverview.newQuery")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddCollection}>
          {t("objectTypeOverview.newCollection")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {t("objectTypeOverview.typeSettings")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ObjectTypeHeader({
  collapsed,
  objectType,
  onAddCollection,
  onAddQuery,
  onCreateObject,
  onSearch,
  onSearchOpenChange,
  onToggleCollapsed,
  searchOpen,
  searchValue,
}: ObjectTypeHeaderProps) {
  const t = useTranslations("workspace");
  return (
    <header className="@container flex flex-wrap items-center justify-between px-3 pt-4">
      <div className="flex min-w-0 items-center gap-[13px]">
        <ObjectIconBadge
          icon={objectType.icon}
          tone={objectType.tone}
          className="ml-[3px] size-[26px] rounded-lg"
          iconClassName="size-[15px]"
        />
        <h1 className="truncate text-[20px] font-bold leading-5 tracking-[-0.02em]">
          {objectType.label}
        </h1>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex h-8 items-center overflow-hidden rounded-lg bg-card text-muted-foreground shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
          <ObjectTypeHeaderSearch
            onSearch={onSearch}
            onSearchOpenChange={onSearchOpenChange}
            searchOpen={searchOpen}
            searchValue={searchValue}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t("actions.collapse")}
            aria-expanded={!collapsed}
            className="size-8 rounded-none"
            onClick={onToggleCollapsed}
          >
            <AppHeaderCaretDownIcon
              className={cn("size-4", !collapsed && "rotate-180")}
            />
          </Button>
          <ObjectTypeMoreMenu
            onAddCollection={onAddCollection}
            onAddQuery={onAddQuery}
            onCreateObject={onCreateObject}
          />
        </div>
        <div className="flex h-8 overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Button
            type="button"
            className="h-8 w-[73px] rounded-none border-r border-white/15 bg-transparent px-2 text-sm font-normal hover:bg-white/10"
            onClick={onCreateObject}
          >
            <AppSidebarPlusIcon className="size-4" />
            {t("actions.new")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  className="h-8 w-[30px] rounded-none bg-transparent px-0 hover:bg-white/10"
                  aria-label={t("objectTypeOverview.newObjectOptions")}
                >
                  <AppHeaderCaretDownIcon className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={onCreateObject}>
                {t("objectTypeOverview.newCurrentType", {
                  type: objectType.label,
                })}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCreateObject}>
                {t("objectTypeOverview.newFromTemplate")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onAddQuery}>
                {t("objectTypeOverview.newQuery")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddCollection}>
                {t("objectTypeOverview.newCollection")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

type ObjectTypeToolbarProps = {
  readonly count: number;
  readonly filterOpen: boolean;
  readonly mode: Mode;
  readonly onFilterOpenChange: (value: boolean) => void;
  readonly onLayoutChange: (kind: DataViewKind) => void;
  readonly onModeChange: (mode: Mode) => void;
  readonly onToggleSort: () => void;
  readonly view: WorkspaceDataView;
};

function ObjectTypeToolbar({
  count,
  filterOpen,
  mode,
  onFilterOpenChange,
  onLayoutChange,
  onModeChange,
  onToggleSort,
  view,
}: ObjectTypeToolbarProps) {
  const t = useTranslations("workspace");
  return (
    <div className="mt-4 flex items-center justify-between px-3 text-[13px] text-muted-foreground">
      <div
        role="tablist"
        aria-label={t("objectTypeOverview.viewLabel")}
        className="flex items-center"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "overview"}
          className={cn(
            "flex h-8 items-center gap-2 rounded-lg px-3.5 hover:bg-muted/70",
            mode === "overview" && "bg-muted text-foreground",
          )}
          onClick={() => onModeChange("overview")}
        >
          <ObjectTypeToolbarIcon name="overview" className="size-3.5" />
          {t("views.overview")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "all"}
          className={cn(
            "flex h-8 items-center gap-2 rounded-lg px-3.5 hover:bg-muted/70",
            mode === "all" && "bg-muted text-foreground",
          )}
          onClick={() => onModeChange("all")}
        >
          <ObjectTypeToolbarIcon name="all" className="size-3.5" />
          {t("views.all")}
        </button>
      </div>
      <ObjectTypeAllControls
        count={count}
        filterOpen={filterOpen}
        mode={mode}
        onFilterOpenChange={onFilterOpenChange}
        onLayoutChange={onLayoutChange}
        onToggleSort={onToggleSort}
        view={view}
      />
    </div>
  );
}

function ObjectTypeAllControls({
  count,
  filterOpen,
  mode,
  onFilterOpenChange,
  onLayoutChange,
  onToggleSort,
  view,
}: Omit<ObjectTypeToolbarProps, "onModeChange">) {
  const t = useTranslations("workspace");
  if (mode !== "all") return null;
  return (
    <div className="flex items-center gap-1">
      <span className="flex h-8 items-center gap-1 px-2">
        <ObjectTypeToolbarIcon name="count" className="size-3.5" />
        {count}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.filter")}
        aria-pressed={filterOpen}
        onClick={() => onFilterOpenChange(!filterOpen)}
      >
        <ObjectTypeToolbarIcon name="filter" className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.sort")}
        onClick={onToggleSort}
      >
        <ObjectTypeToolbarIcon name="sort" className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.list")}
        aria-pressed={view.presentation.kind === "list"}
        onClick={() => onLayoutChange("list")}
      >
        <ObjectTypeToolbarIcon name="list" className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("actions.grid")}
        aria-pressed={view.presentation.kind === "gallery"}
        onClick={() => onLayoutChange("gallery")}
      >
        <ObjectTypeToolbarIcon name="grid" className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t("objectTypeStudio.objectTypes.table")}
        aria-pressed={view.presentation.kind === "table"}
        onClick={() => onLayoutChange("table")}
      >
        <ObjectTypeToolbarIcon name="caret" className="size-3" />
      </Button>
    </div>
  );
}

type ObjectTypeFilterRowProps = {
  readonly filterOpen: boolean;
  readonly mode: Mode;
  readonly onFilterOpenChange: (value: boolean) => void;
  readonly onSearch: (value: string) => void;
};

function ObjectTypeFilterRow({
  filterOpen,
  mode,
  onFilterOpenChange,
  onSearch,
}: ObjectTypeFilterRowProps) {
  const t = useTranslations("workspace");
  if (mode !== "all" || !filterOpen) return null;
  return (
    <div
      data-slot="object-type-filter-row"
      className={cn(
        workspaceFieldGroupClass,
        "mx-5 mt-2 flex h-9 items-center gap-2 px-3 py-0 text-xs",
      )}
    >
      <span>{t("objectTypeOverview.where")}</span>
      <Input
        aria-label={t("objectTypeOverview.searchPlaceholder")}
        placeholder={t("objectTypeOverview.searchPlaceholder")}
        className="h-7 max-w-52"
        onChange={(event) => onSearch(event.target.value)}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="ml-auto h-7"
        onClick={() => {
          onFilterOpenChange(false);
          onSearch("");
        }}
      >
        {t("objectTypeOverview.remove")}
      </Button>
    </div>
  );
}

type ObjectTypeContentProps = {
  readonly collections: readonly WorkspaceCollectionRecord[];
  readonly createdEntities: readonly WorkspaceEntity[];
  readonly filtered: readonly WorkspaceEntity[];
  readonly labels: ObjectViewLabels;
  readonly mode: Mode;
  readonly objectTypeLabels: Readonly<Record<string, string>>;
  readonly onCreateObject: () => void;
  readonly onImport: () => void;
  readonly onOpen: (id: string) => void;
  readonly onRenameCollection: (id: string, value: string) => void;
  readonly onRenameQuery: (index: number, value: string) => void;
  readonly propertyLabels: Readonly<Record<string, string>>;
  readonly queries: readonly string[];
  readonly structures: readonly WorkspaceStructure[];
  readonly view: WorkspaceDataView;
};

function ObjectTypeContent({
  collections,
  createdEntities,
  filtered,
  labels,
  mode,
  objectTypeLabels,
  onCreateObject,
  onImport,
  onOpen,
  onRenameCollection,
  onRenameQuery,
  propertyLabels,
  queries,
  structures,
  view,
}: ObjectTypeContentProps) {
  if (mode === "overview") {
    return (
      <ObjectTypeOverviewContent
        collections={collections}
        filtered={filtered}
        labels={labels}
        objectTypeLabels={objectTypeLabels}
        onOpen={onOpen}
        onRenameCollection={onRenameCollection}
        onRenameQuery={onRenameQuery}
        propertyLabels={propertyLabels}
        queries={queries}
        structures={structures}
        view={view}
      />
    );
  }

  return (
    <ObjectTypeAllContent
      createdEntities={createdEntities}
      filtered={filtered}
      labels={labels}
      objectTypeLabels={objectTypeLabels}
      onCreateObject={onCreateObject}
      onImport={onImport}
      onOpen={onOpen}
      propertyLabels={propertyLabels}
      structures={structures}
      view={view}
    />
  );
}

function ObjectTypeOverviewContent({
  collections,
  filtered,
  labels,
  objectTypeLabels,
  onOpen,
  onRenameCollection,
  onRenameQuery,
  propertyLabels,
  queries,
  structures,
  view,
}: Omit<
  ObjectTypeContentProps,
  "createdEntities" | "mode" | "onCreateObject" | "onImport"
>) {
  const t = useTranslations("workspace");
  return (
    <div data-slot="object-type-overview" className="grid gap-6">
      <section>
        <h2 className={cn(workspaceSectionTitleClass, "mb-3")}>
          {t("objectTypeOverview.recentlyOpened")}
        </h2>
        {filtered.length ? (
          <DataViewRenderer
            entities={filtered.slice(0, 4)}
            labels={labels}
            objectTypeLabels={objectTypeLabels}
            onOpen={onOpen}
            propertyLabels={propertyLabels}
            structures={structures}
            view={view}
          />
        ) : (
          <WorkspaceEmptyState
            compact
            title={t("objectTypeOverview.noRecentDescription")}
          />
        )}
      </section>
      <section>
        <h2 className={cn(workspaceSectionTitleClass, "mb-3")}>
          {t("objectTypeOverview.collections")}
        </h2>
        {collections.length ? (
          <ObjectTypeNamedItems
            items={collections.map((collection) => ({
              count: filtered.filter(
                (entity) =>
                  "collections" in entity &&
                  entity.collections.includes(collection.id),
              ).length,
              id: collection.id,
              label: collection.name,
            }))}
            kind="collection"
            onRename={onRenameCollection}
          />
        ) : (
          <WorkspaceEmptyState
            compact
            title={t("objectTypeOverview.noCollectionsDescription")}
          />
        )}
      </section>
      <section>
        <h2 className={cn(workspaceSectionTitleClass, "mb-3")}>
          {t("objectTypeOverview.queries")}
        </h2>
        {queries.length ? (
          <ObjectTypeNamedItems
            items={queries.map((query, index) => ({
              count: 0,
              id: String(index),
              label: query,
            }))}
            kind="query"
            onRename={(id, value) => onRenameQuery(Number(id), value)}
          />
        ) : (
          <WorkspaceEmptyState
            compact
            title={t("objectTypeOverview.noQueriesDescription")}
          />
        )}
      </section>
    </div>
  );
}

function ObjectTypeNamedItems({
  items,
  kind,
  onRename,
}: {
  readonly items: readonly { count: number; id: string; label: string }[];
  readonly kind: ObjectTypeNamedItemKind;
  readonly onRename: (id: string, value: string) => void;
}) {
  const t = useTranslations("workspace");
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={`${kind}-${item.id}`}
          data-slot="object-type-named-card"
          data-kind={kind}
          data-item-id={item.id}
          className={workspaceNamedCardClass}
        >
          <span className="flex min-w-0 items-center gap-2">
            {kind === "collection" ? (
              <ObjectCollectionIcon className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <ObjectQueryIcon className="size-4 shrink-0 text-muted-foreground" />
            )}
            <ObjectTypeNamedItemInput
              item={item}
              onRename={(value) => onRename(item.id, value)}
            />
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            {t("objectTypeOverview.entryCount", { count: item.count })}
          </span>
        </div>
      ))}
    </div>
  );
}

function ObjectTypeNamedItemInput({
  item,
  onRename,
}: {
  readonly item: { id: string; label: string };
  readonly onRename: (value: string) => void;
}) {
  const [value, setValue] = React.useState(item.label);
  React.useEffect(() => {
    setValue(item.label);
  }, [item.label]);

  return (
    <Input
      aria-label={item.label}
      value={value}
      className="h-7 min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
      onBlur={() => onRename(value)}
      onChange={(event) => setValue(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key !== "Enter") return;
        event.currentTarget.blur();
      }}
    />
  );
}

function ObjectTypeAllContent({
  createdEntities,
  filtered,
  labels,
  objectTypeLabels,
  onCreateObject,
  onImport,
  onOpen,
  propertyLabels,
  structures,
  view,
}: Omit<
  ObjectTypeContentProps,
  "collections" | "mode" | "onRenameCollection" | "onRenameQuery" | "queries"
>) {
  const trailingContent = (
    <ObjectTypeTrailingContent
      filteredCount={filtered.length}
      onCreateObject={onCreateObject}
      onImport={onImport}
      view={view}
    />
  );
  if (filtered.length === 0 && view.presentation.kind !== "table") {
    return trailingContent;
  }
  return (
    <DataViewRenderer
      entities={createdEntities}
      labels={labels}
      objectTypeLabels={objectTypeLabels}
      onOpen={onOpen}
      propertyLabels={propertyLabels}
      structures={structures}
      trailingContent={trailingContent}
      view={view}
    />
  );
}

function ObjectTypeTrailingContent({
  filteredCount,
  onCreateObject,
  onImport,
  view,
}: {
  readonly filteredCount: number;
  readonly onCreateObject: () => void;
  readonly onImport: () => void;
  readonly view: WorkspaceDataView;
}) {
  const t = useTranslations("workspace");
  if (filteredCount === 0) {
    return (
      <WorkspaceEmptyState
        description={t("empty.description")}
        title={t("empty.title")}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onImport}
            >
              {t("objectTypeOverview.import")}
            </Button>
            <Button type="button" onClick={onCreateObject}>
              <AppSidebarPlusIcon className="size-4" />
              {t("actions.new")}
            </Button>
          </div>
        }
      />
    );
  }
  if (view.presentation.kind !== "gallery") return null;
  return (
    <button
      type="button"
      className="flex min-h-[25rem] items-start gap-2 pt-4 text-muted-foreground"
      onClick={onCreateObject}
    >
      <AppSidebarPlusIcon className="mt-0.5 size-4" />
      <span>{t("objectTypeOverview.newObject")}</span>
    </button>
  );
}

function getObjectTypeImportAccept(objectTypeId: string) {
  if (objectTypeId === "image") return "image/*";
  if (objectTypeId === "audio") return "audio/*";
  if (objectTypeId === "pdf") return "application/pdf,.pdf";
  return undefined;
}

function WorkspaceObjectTypeView({
  objectType,
  structure,
  view,
}: WorkspaceObjectTypeViewProps) {
  const t = useTranslations("workspace");
  const {
    createWorkspaceEntity,
    createdEntities,
    importWorkspaceFiles,
    objectTypeCollections,
    objectTypeQueries,
    selectEntity,
    setActiveAction,
    setActiveEntityId,
    setMainTabs,
    setMainValue,
    setObjectTypeCollections,
    setObjectTypeQueries,
    showMessage,
    structures,
  } = useWorkspace();
  const { switchWorkspaceDataViewKind, updateWorkspaceDataView } =
    useWorkspaceViews();
  const [mode, setMode] = React.useState<Mode>("all");
  const [collapsed, setCollapsed] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const importInputRef = React.useRef<HTMLInputElement>(null);
  const collections = selectWorkspaceCollectionRecordsForStructure(
    objectTypeCollections,
    objectType.id,
  );
  const queries = objectTypeQueries[objectType.id] ?? [];
  const filtered = executeQueryDefinition(createdEntities, view.query);
  const labels = React.useMemo<ObjectViewLabels>(
    () => ({
      emptyView: t("empty.title"),
      missingObject: t("empty.title"),
      openObject: (title) => `${t("lifecycle.task.open")}: ${title}`,
      untitledObject: t("lifecycle.untitled"),
    }),
    [t],
  );
  const objectTypeLabels = React.useMemo(
    () =>
      Object.fromEntries(
        structures.map((item) => [item.id, item.singularName]),
      ) as Readonly<Record<string, string>>,
    [structures],
  );
  const propertyLabels = React.useMemo(
    () => ({
      createdAt: t("lifecycle.query.created"),
      objectTypeId: t("footer.objectTypes"),
      title: t("fields.title"),
    }),
    [t],
  );

  function createObject() {
    createWorkspaceEntity(objectType.id, objectType.label);
  }

  function openNamedItem(
    kind: ObjectTypeNamedItemKind,
    id: string | number,
    label: string,
  ) {
    const tabId = objectTypeNamedItemTabId(
      kind === "collection"
        ? { kind, collectionId: String(id) }
        : { kind, objectTypeId: objectType.id, index: Number(id) },
    );
    const Icon = kind === "collection" ? ObjectCollectionIcon : ObjectQueryIcon;
    const tab = {
      draggable: true,
      icon: Icon,
      iconClassName: objectIconToneBadgeClass.gray,
      id: tabId,
      label,
    };
    setMainTabs((current) =>
      current.some((currentTab) => currentTab.id === tabId)
        ? current.map((currentTab) =>
            currentTab.id === tabId ? { ...currentTab, ...tab } : currentTab,
          )
        : [...current, tab],
    );
    setMainValue(tabId);
    setActiveEntityId(tabId);
    setActiveAction(undefined);
  }

  function addCollection() {
    const label = t("objectTypeOverview.untitled");
    const collectionId = createCollectionId(
      objectType.id,
      label,
      new Set(Object.keys(objectTypeCollections)),
    );
    setObjectTypeCollections((current) => ({
      ...current,
      [collectionId]: {
        id: collectionId,
        name: label,
        structureId: objectType.id,
      },
    }));
    openNamedItem("collection", collectionId, label);
  }

  function addQuery() {
    const label = t("objectTypeOverview.untitled");
    const index = queries.length;
    setObjectTypeQueries((current) => ({
      ...current,
      [objectType.id]: [...(current[objectType.id] ?? []), label],
    }));
    openNamedItem("query", index, label);
  }

  function setLayout(kind: DataViewKind) {
    switchWorkspaceDataViewKind(view.id, kind);
  }

  function toggleSort() {
    const titleSort = view.query.sorts[0]?.field === "title";
    updateWorkspaceDataView(view.id, {
      query: {
        ...view.query,
        sorts: titleSort
          ? [{ direction: "descending", field: "createdAt" }]
          : [{ direction: "ascending", field: "title" }],
      },
    });
  }

  function renameCollection(id: string, value: string) {
    const name = value.trim();
    if (!name) return;
    setObjectTypeCollections((current) => {
      const collection = current[id];
      return collection
        ? { ...current, [id]: { ...collection, name } }
        : current;
    });
  }

  function renameQuery(index: number, value: string) {
    setObjectTypeQueries((current) => ({
      ...current,
      [objectType.id]: (current[objectType.id] ?? []).map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  }

  function setSearch(value: string) {
    updateWorkspaceDataView(view.id, {
      query: { ...view.query, search: value.trim() || undefined },
    });
  }

  async function importFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) {
      showMessage(t("objectTypeOverview.importCancelled"));
      input.value = "";
      return;
    }
    await importWorkspaceFiles(objectType.id, files);
    input.value = "";
  }

  function openImportPicker() {
    importInputRef.current?.click();
  }

  return (
    <section
      data-slot="workspace-object-type-view"
      data-structure-id={structure.id}
      className={workspaceRouteClass}
    >
      <Input
        ref={importInputRef}
        type="file"
        multiple
        accept={getObjectTypeImportAccept(objectType.id)}
        aria-label={t("actions.importFiles")}
        className="sr-only"
        onChange={importFiles}
      />
      <ObjectTypeHeader
        collapsed={collapsed}
        objectType={objectType}
        onAddCollection={addCollection}
        onAddQuery={addQuery}
        onCreateObject={createObject}
        onSearch={setSearch}
        onSearchOpenChange={setSearchOpen}
        onToggleCollapsed={() => setCollapsed((current) => !current)}
        searchOpen={searchOpen}
        searchValue={view.query.search}
      />

      {!collapsed && (
        <ObjectTypeToolbar
          count={filtered.length}
          filterOpen={filterOpen}
          mode={mode}
          onFilterOpenChange={setFilterOpen}
          onLayoutChange={setLayout}
          onModeChange={setMode}
          onToggleSort={toggleSort}
          view={view}
        />
      )}

      <ObjectTypeFilterRow
        filterOpen={filterOpen}
        mode={mode}
        onFilterOpenChange={setFilterOpen}
        onSearch={setSearch}
      />

      <div className={workspaceOverviewContentClass}>
        <ObjectTypeContent
          collections={collections}
          createdEntities={createdEntities}
          filtered={filtered}
          labels={labels}
          mode={mode}
          objectTypeLabels={objectTypeLabels}
          onCreateObject={createObject}
          onImport={openImportPicker}
          onOpen={selectEntity}
          onRenameCollection={renameCollection}
          onRenameQuery={renameQuery}
          propertyLabels={propertyLabels}
          queries={queries}
          structures={structures}
          view={view}
        />
      </div>
    </section>
  );
}

export type { WorkspaceObjectTypeViewProps };
export { WorkspaceObjectTypeView };
