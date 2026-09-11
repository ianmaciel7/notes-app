"use client";

import * as React from "react";
import { AppHeader, AppHeaderAction } from "@/components/app-header";
import {
  AppHeaderCaretDownIcon,
  AppHeaderCompassIcon,
  AppHeaderSidebarSimpleIcon,
} from "@/components/app-header-icons";
import { type AppHeaderTab, AppSpaceHeader } from "@/components/app-header-tabs";
import { AppShellContext } from "@/components/app-shell";
import {
  AppSidePanelHeader,
  defaultSpecialItems,
  type SidePanelSpecialEntryId,
  type SideSpecialItem,
} from "@/components/app-side-panel-header";
import { useFocusMode } from "@/components/focus-mode-provider";
import {
  ObjectCollectionIcon,
  ObjectPageIcon,
  objectIconToneBadgeClass,
} from "@/components/object-icons";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSpaceData } from "@/hooks/use-space-data";
import { db } from "@/lib/db";
import type {
  CreateStructureInput,
  ObjectIconName,
  ObjectIconTone,
} from "@/lib/space-object-types";
import {
  buildGraphInSpace,
  listBacklinksInSpace,
  searchEntitiesInSpace,
} from "@/lib/spaces/space-projections";
import { OBJECT_TYPE_ORDER_SETTING_KEY } from "@/lib/spaces/space-repository";
import { PERSONAL_SPACE_ID } from "@/lib/spaces/space-types";
import { resolveWorkspaceTabTarget } from "@/lib/spaces/workspace-tab-target";
import type { FSRSRating } from "@/lib/srs/fsrs";

// biome-ignore lint/suspicious/noExplicitAny: context compatibility while legacy UI APIs are migrated
export type WorkspaceContextValue = Record<string, any>;
export type CreateWorkspaceEntityOptions = {
  title?: string;
  collectionId?: string;
};

const initialMainTabs: AppHeaderTab[] = [
  {
    id: "page",
    label: "Pages",
    kind: "object-list",
    icon: ObjectPageIcon,
    iconClassName: objectIconToneBadgeClass.blue,
    draggable: true,
  },
];
const defaultSideTab: AppHeaderTab = {
  id: "side-1",
  label: "Explore",
  icon: AppHeaderCompassIcon,
  draggable: true,
};
const initialSideTabs = [defaultSideTab];

const PERSONAL_SPACE_ROUTE_GUID = "996adc8d-8e17-463b-92de-1b11a58e9c64";
const WORKSPACE_MAIN_TABS_STORAGE_KEY = "knowledgeos.workspace.mainTabsState";
const WORKSPACE_SIDE_STATE_STORAGE_KEY = "knowledgeos.workspace.sidePanelState";

type WorkspaceMainTabsStorageState = {
  mainValue: string;
  spaceId: string;
  tabIds: string[];
};

export function createWorkspaceRouteSpaceSegment(spaceId?: string | null) {
  if (!spaceId || spaceId === PERSONAL_SPACE_ID) return PERSONAL_SPACE_ROUTE_GUID;
  return spaceId;
}

export function isDefaultExploreSideTab(tab: Pick<AppHeaderTab, "id" | "label">) {
  return tab.id === "side-1" || tab.id === "explore" || tab.label === "Explore";
}

export function resolveSidePanelTabsAfterOpen(
  currentTabs: AppHeaderTab[],
  activeValue: string,
  nextTab: AppHeaderTab,
) {
  if (currentTabs.some((tab) => tab.id === nextTab.id)) return currentTabs;

  const [onlyTab] = currentTabs;
  const activeIsDefaultExplore =
    onlyTab &&
    currentTabs.length === 1 &&
    isDefaultExploreSideTab(onlyTab) &&
    (activeValue === onlyTab.id || activeValue === "explore");

  if (activeIsDefaultExplore) return [nextTab];

  return [...currentTabs, nextTab];
}

export function resolveSidePanelTabsAfterClose(
  currentTabs: AppHeaderTab[],
  activeValue: string,
  closingTab: AppHeaderTab,
  defaultTab: AppHeaderTab = defaultSideTab,
) {
  if (currentTabs.length <= 1) {
    return {
      tabs: [defaultTab],
      value: defaultTab.id,
      closedLastTab: true,
    };
  }

  const index = currentTabs.findIndex((tab) => tab.id === closingTab.id);
  const tabs = currentTabs.filter((tab) => tab.id !== closingTab.id);
  const fallback = tabs[index] ?? tabs[index - 1] ?? tabs[0] ?? defaultTab;

  return {
    tabs,
    value: activeValue === closingTab.id ? fallback.id : activeValue,
    closedLastTab: false,
  };
}

export function upsertWorkspaceTab(currentTabs: AppHeaderTab[], nextTab: AppHeaderTab) {
  let found = false;
  const tabs = currentTabs.map((tab) => {
    if (tab.id !== nextTab.id) return tab;
    found = true;
    return { ...tab, ...nextTab };
  });

  return found ? tabs : [...currentTabs, nextTab];
}

export function createWorkspaceMainTabsStorageState({
  mainValue,
  spaceId,
  tabs,
}: {
  mainValue: string;
  spaceId: string;
  tabs: readonly Pick<AppHeaderTab, "id">[];
}): WorkspaceMainTabsStorageState {
  const tabIds = Array.from(new Set(tabs.map((tab) => tab.id).filter(Boolean)));
  const safeTabIds = tabIds.length > 0 ? tabIds : ["page"];
  const safeMainValue = safeTabIds.includes(mainValue) ? mainValue : (safeTabIds[0] ?? "page");

  return {
    mainValue: safeMainValue,
    spaceId,
    tabIds: safeTabIds,
  };
}

export function resolveWorkspaceMainTabsFromStoredState({
  createTab,
  defaultTabs,
  storedState,
}: {
  createTab: (id: string) => AppHeaderTab | null;
  defaultTabs: AppHeaderTab[];
  routeMainValue?: string | null;
  storedState?: WorkspaceMainTabsStorageState | null;
}) {
  if (!storedState || storedState.tabIds.length === 0) return null;

  const restoredTabs = storedState.tabIds.flatMap((id) => {
    const tab = createTab(id);
    return tab ? [tab] : [];
  });
  const tabs = restoredTabs.length > 0 ? restoredTabs : defaultTabs;
  const mainValue = tabs.some((tab) => tab.id === storedState.mainValue)
    ? storedState.mainValue
    : (tabs[0]?.id ?? "page");

  return { tabs, mainValue };
}

export function resolveWorkspaceEntityTitle(
  objectTypeLabel?: string,
  options: CreateWorkspaceEntityOptions = {},
) {
  const title = options.title?.trim();
  if (title) return title;
  return `Untitled ${objectTypeLabel ?? "Object"}`;
}

export type WorkspaceSidePanelContext = "collection" | "item" | "list";

export function resolveWorkspaceSidePanelContext({
  activeEntityId,
  collections,
  entities,
  mainValue,
  objectTypes,
}: {
  activeEntityId?: string | null;
  collections: readonly { id: string }[];
  entities: readonly { id: string }[];
  mainValue?: string | null;
  objectTypes: readonly { id: string }[];
}): WorkspaceSidePanelContext {
  const activeIds = [activeEntityId, mainValue].filter((value): value is string => Boolean(value));
  const collectionIds = new Set(collections.map((collection) => collection.id));
  const entityIds = new Set(entities.map((entity) => entity.id));
  const objectTypeIds = new Set(objectTypes.map((objectType) => objectType.id));

  if (
    mainValue?.startsWith("object-type-item:collection:") ||
    activeIds.some((id) => collectionIds.has(id))
  ) {
    return "collection";
  }

  if (activeIds.some((id) => entityIds.has(id))) return "item";

  if (activeIds.some((id) => objectTypeIds.has(id)) || activeIds.includes("page")) {
    return "list";
  }

  return "list";
}

const sidePanelSpecialItemsByContext: Record<
  WorkspaceSidePanelContext,
  ReadonlySet<SidePanelSpecialEntryId> | null
> = {
  collection: new Set(["graphView", "aiAssistantChat", "localSpaceQuery"]),
  item: null,
  list: new Set(["aiAssistantChat", "localSpaceQuery"]),
};

export function filterSidePanelSpecialItemsForContext(
  items: readonly SideSpecialItem[],
  context: WorkspaceSidePanelContext,
) {
  const allowed = sidePanelSpecialItemsByContext[context];
  if (!allowed) return [...items];
  return items.filter((item) => allowed.has(item.id));
}

export function resolveWorkspaceExploreActivation(mainValue: string) {
  return {
    activeAction: undefined,
    mainValue,
    sideValue: "explore",
  };
}

export function createWorkspaceRouteMainSegment(mainValue?: string | null) {
  return (mainValue || "page").replace(/^entity-/, "");
}

export function resolveWorkspaceMainValueFromRouteSegment(
  routeMainValue: string,
  entities: readonly { id: string }[],
) {
  return (
    entities.find((entity) => entity.id === routeMainValue)?.id ??
    entities.find((entity) => createWorkspaceRouteMainSegment(entity.id) === routeMainValue)?.id ??
    routeMainValue
  );
}

export function createWorkspaceUrlPath({
  currentSearch = "",
  mainValue,
  spaceId = PERSONAL_SPACE_ID,
}: {
  currentSearch?: string;
  mainValue?: string | null;
  spaceId?: string | null;
}) {
  const params = new URLSearchParams(currentSearch);
  params.delete("main");
  params.delete("side");
  const query = params.toString();
  return `/${encodeURIComponent(createWorkspaceRouteSpaceSegment(spaceId))}/${encodeURIComponent(
    createWorkspaceRouteMainSegment(mainValue),
  )}${query ? `?${query}` : ""}`;
}

function getWorkspaceRouteStateFromLocation(pathname: string, search: string) {
  const [, , routeMainValue] = pathname.split("/").map((segment) => decodeURIComponent(segment));
  const params = new URLSearchParams(search);
  return {
    mainValue: routeMainValue || params.get("main"),
    sideValue: params.get("side"),
  };
}

function getStoredWorkspaceSideValue() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WORKSPACE_SIDE_STATE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { sideValue?: unknown };
    return typeof parsed.sideValue === "string" ? parsed.sideValue : null;
  } catch {
    return null;
  }
}

function getStoredWorkspaceMainTabsState(spaceId: string) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WORKSPACE_MAIN_TABS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      mainValue?: unknown;
      spaceId?: unknown;
      tabIds?: unknown;
    };
    if (parsed.spaceId !== spaceId) return null;
    if (typeof parsed.mainValue !== "string" || !Array.isArray(parsed.tabIds)) return null;
    const tabIds = parsed.tabIds.filter((id): id is string => typeof id === "string");
    if (tabIds.length === 0) return null;
    return { mainValue: parsed.mainValue, spaceId, tabIds };
  } catch {
    return null;
  }
}

export function shouldRenderWorkspaceHeaderTabs(routeRestored: boolean) {
  return routeRestored;
}

const defaultWorkspaceContext: WorkspaceContextValue = {
  spaces: [{ id: PERSONAL_SPACE_ID, name: "Personal Space", icon: "user" }],
  spaceId: PERSONAL_SPACE_ID,
  routeRestored: false,
  setSpaces: () => {},
  createSpace: () => {},
  deleteSpace: () => false,
  renameSpace: () => {},
  switchSpace: () => {},
  activeAction: undefined,
  setActiveAction: () => {},
  activeEntityId: "page",
  setActiveEntityId: () => {},
  mainTabs: initialMainTabs,
  setMainTabs: () => {},
  mainValue: "page",
  setMainValue: () => {},
  sideTabs: initialSideTabs,
  setSideTabs: () => {},
  sideValue: "side-1",
  setSideValue: () => {},
  selectEntity: () => {},
  pinnedEntities: [],
  availablePinnedEntities: [],
  objectTypes: [],
  objectTypeCollections: {},
  createdEntities: [],
  tags: [],
  customSections: [],
  setPinnedEntities: () => {},
  moveEntityToCollection: () => {},
  setCommandPaletteOpen: () => {},
  createWorkspaceStructureFromPreset: () => {},
  createWorkspaceStructure: () => {},
  updateWorkspaceStructure: () => {},
  deleteWorkspaceStructure: () => {},
  setObjectTypeCollections: () => {},
  setCustomSections: () => {},
  setSideSearchOpen: () => {},
  setShortcutBrowserOpen: () => {},
  openInSidePanel: () => {},
  openExploreSidePanel: () => {},
  createWorkspaceEntity: () => {},
  reviewFlashcard: async () => null,
  showMessage: () => {},
  trashItems: [],
  emptyTrash: () => {},
  purgeTrashItem: () => {},
  restoreTrashItem: () => {},
  searchEntities: async () => [],
  listBacklinks: async () => [],
  buildGraph: async () => ({ nodes: [], edges: [] }),
};

const WorkspaceContext = React.createContext<WorkspaceContextValue>(defaultWorkspaceContext);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const appShell = React.useContext(AppShellContext);
  const focusMode = useFocusMode();
  const { toggleTheme } = useTheme();
  const {
    repository,
    ready,
    error,
    spaces,
    spaceId: persistedSpaceId,
    objectTypes,
    objectTypeRecords,
    createdEntities,
    objectTypeCollections,
    pinnedEntityIds,
    objectTypeOrder,
    tags,
    trashItems,
  } = useSpaceData();
  const spaceId = persistedSpaceId ?? PERSONAL_SPACE_ID;

  const [mainTabs, setMainTabs] = React.useState<AppHeaderTab[]>(initialMainTabs);
  const [mainValue, setMainValue] = React.useState("page");
  const [sideTabs, setSideTabs] = React.useState<AppHeaderTab[]>(initialSideTabs);
  const [sideValue, setSideValue] = React.useState("side-1");
  const [activeAction, setActiveAction] = React.useState<string | undefined>();
  const [activeEntityId, setActiveEntityId] = React.useState<string | null>("page");
  const [routeRestored, setRouteRestored] = React.useState(false);
  const hasSyncedInitialUrlRef = React.useRef(false);
  // biome-ignore lint/suspicious/noExplicitAny: legacy custom section shape is owned by AppSidebarOverview
  const [customSections, setCustomSections] = React.useState<any[]>([]);
  const [, setCommandPaletteOpen] = React.useState(false);
  const [, setSideSearchOpen] = React.useState(false);
  const [, setShortcutBrowserOpen] = React.useState(false);

  const showMessage = React.useCallback((message: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("workspace:message", { detail: { message } }));
    }
  }, []);

  React.useEffect(() => {
    if (error) showMessage(error.message);
  }, [error, showMessage]);

  const resetSpaceUi = React.useCallback(() => {
    setActiveAction(undefined);
    setActiveEntityId("page");
    setCustomSections([]);
    setMainTabs(initialMainTabs);
    setMainValue("page");
    setSideTabs(initialSideTabs);
    setSideValue("side-1");
  }, []);

  const createSpace = React.useCallback(
    async (name: string) => {
      try {
        await repository.createBlankSpace(name);
        resetSpaceUi();
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [repository, resetSpaceUi, showMessage],
  );

  const switchSpace = React.useCallback(
    async (nextSpaceId: string) => {
      try {
        await repository.setActiveSpace(nextSpaceId);
        resetSpaceUi();
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [repository, resetSpaceUi, showMessage],
  );

  const setSpaces = React.useCallback(
    async (nextSpaces: readonly { id: string }[]) => {
      try {
        await repository.reorderSpaces(nextSpaces.map((space) => space.id));
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [repository, showMessage],
  );

  const renameSpace = React.useCallback(
    async (id: string, name: string) => {
      try {
        await repository.renameSpace(id, name);
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [repository, showMessage],
  );

  const deleteSpace = React.useCallback(
    (id: string, confirmation: string) => {
      const target = spaces.find((space) => space.id === id);
      if (!target || confirmation !== target.name) return false;
      void repository
        .deleteSpace(id)
        .then(resetSpaceUi)
        .catch((cause: unknown) => {
          showMessage(cause instanceof Error ? cause.message : String(cause));
        });
      return true;
    },
    [repository, resetSpaceUi, showMessage, spaces],
  );

  const createWorkspaceStructureFromPreset = React.useCallback(
    async (presetId: string) => {
      try {
        await repository.createObjectTypeFromPreset(spaceId, presetId);
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [repository, showMessage, spaceId],
  );

  const createWorkspaceStructure = React.useCallback(
    async (input: CreateStructureInput) => {
      try {
        await repository.createObjectType(spaceId, input);
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [repository, showMessage, spaceId],
  );

  const updateWorkspaceStructure = React.useCallback(
    async (
      id: string,
      update: {
        singularName: string;
        pluralName: string;
        iconName?: ObjectIconName;
        tone?: ObjectIconTone;
      },
    ) => {
      try {
        await repository.updateObjectType(spaceId, id, update);
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [repository, showMessage, spaceId],
  );

  const deleteWorkspaceStructure = React.useCallback(
    async (id: string) => {
      try {
        await repository.deleteObjectType(spaceId, id);
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [repository, showMessage, spaceId],
  );

  const createWorkspaceEntity = React.useCallback(
    async (objectTypeId: string, label?: string, options?: CreateWorkspaceEntityOptions) => {
      try {
        const entity = await repository.createEntity(
          spaceId,
          objectTypeId,
          resolveWorkspaceEntityTitle(label, options),
          options?.collectionId,
        );
        setActiveEntityId(entity.id);
        const objectType = objectTypes.find((item) => item.id === objectTypeId);
        if (objectType) {
          const tab: AppHeaderTab = {
            id: entity.id,
            label: entity.title,
            kind: "object",
            icon: objectType.icon,
            iconClassName: objectIconToneBadgeClass[objectType.tone],
            draggable: true,
          };
          setMainTabs((current) =>
            current.some((item) => item.id === entity.id) ? current : [...current, tab],
          );
          setMainValue(entity.id);
        }
        return entity;
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
        return null;
      }
    },
    [objectTypes, repository, showMessage, spaceId],
  );

  const reviewFlashcard = React.useCallback(
    async (flashcardId: string, rating: FSRSRating) => {
      try {
        await repository.recordFlashcardReview(spaceId, flashcardId, rating);
        showMessage("Flashcard review saved");
        return true;
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
        return false;
      }
    },
    [repository, showMessage, spaceId],
  );

  const setObjectTypeCollections = React.useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: preserves the existing React setter-style API
    (next: any) => {
      // biome-ignore lint/suspicious/noExplicitAny: current sidebar collection record is structurally compatible
      const resolved: Record<string, any> =
        typeof next === "function" ? next(objectTypeCollections) : next;
      void repository.replaceCollections(spaceId, resolved).catch((cause: unknown) => {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      });
    },
    [objectTypeCollections, repository, showMessage, spaceId],
  );

  const availablePinnedEntities = React.useMemo(() => {
    const byId = new Map(objectTypes.map((item) => [item.id, item]));
    return createdEntities.flatMap((entity) => {
      const type = byId.get(entity.objectTypeId);
      return type ? [{ id: entity.id, label: entity.title, icon: type.icon, tone: type.tone }] : [];
    });
  }, [createdEntities, objectTypes]);

  const pinnedEntities = React.useMemo(() => {
    const availableById = new Map(availablePinnedEntities.map((entity) => [entity.id, entity]));
    const collectionsById = new Map(
      Object.values(objectTypeCollections).map(
        (collection: { id: string; name: string }) => [collection.id, collection] as const,
      ),
    );
    const objectTypesById = new Map(objectTypes.map((objectType) => [objectType.id, objectType]));

    return pinnedEntityIds.flatMap((id: string) => {
      const entity = availableById.get(id);
      if (entity) return [entity];

      const collection = collectionsById.get(id);
      if (collection) {
        return [
          {
            id: collection.id,
            label: collection.name,
            icon: ObjectCollectionIcon,
            tone: "gray" as const,
          },
        ];
      }

      const objectType = objectTypesById.get(id);
      if (objectType) {
        return [
          {
            id: objectType.id,
            label: objectType.label,
            icon: objectType.icon,
            tone: objectType.tone,
          },
        ];
      }

      return [];
    });
  }, [availablePinnedEntities, objectTypeCollections, objectTypes, pinnedEntityIds]);

  const moveEntityToCollection = React.useCallback(
    (entityId: string, collectionId: string) => {
      const entity = createdEntities.find((item) => item.id === entityId);
      if (!entity || entity.collections?.includes(collectionId)) return;
      void repository
        .updateEntity(spaceId, entityId, {
          collections: [...(entity.collections ?? []), collectionId],
        })
        .catch((cause: unknown) =>
          showMessage(cause instanceof Error ? cause.message : String(cause)),
        );
    },
    [createdEntities, repository, showMessage, spaceId],
  );

  const setPinnedEntities = React.useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: preserves the existing React setter-style API
    (next: any) => {
      const resolved = typeof next === "function" ? next(pinnedEntities) : next;
      void repository
        .setPinnedEntityIds(
          spaceId,
          resolved.map((entity: { id: string }) => entity.id),
        )
        .catch((cause: unknown) => {
          showMessage(cause instanceof Error ? cause.message : String(cause));
        });
    },
    [pinnedEntities, repository, showMessage, spaceId],
  );

  const setObjectTypeOrder = React.useCallback(
    (next: readonly string[]) => {
      void repository
        .setSpaceSetting(spaceId, OBJECT_TYPE_ORDER_SETTING_KEY, [...next])
        .catch((cause: unknown) => {
          showMessage(cause instanceof Error ? cause.message : String(cause));
        });
    },
    [repository, showMessage, spaceId],
  );

  const selectEntity = React.useCallback((id: string) => {
    setActiveAction(undefined);
    setActiveEntityId(id);
  }, []);

  const emptyTrash = React.useCallback(() => {
    void Promise.all(trashItems.map((item) => repository.deleteTrash(spaceId, item.id))).catch(
      (cause: unknown) => showMessage(cause instanceof Error ? cause.message : String(cause)),
    );
  }, [repository, showMessage, spaceId, trashItems]);
  const purgeTrashItem = React.useCallback(
    (id: string) =>
      void repository.deleteTrash(spaceId, id).catch((cause: unknown) => {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      }),
    [repository, showMessage, spaceId],
  );
  const restoreTrashItem = React.useCallback(
    async (id: string) => {
      try {
        await repository.restoreTrash(spaceId, id);
        showMessage("Object restored");
      } catch (cause) {
        showMessage(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [repository, showMessage, spaceId],
  );

  const searchEntities = React.useCallback(
    (query: string) => searchEntitiesInSpace(db, spaceId, query),
    [spaceId],
  );
  const listBacklinks = React.useCallback(
    (targetId: string) => listBacklinksInSpace(db, spaceId, targetId),
    [spaceId],
  );
  const buildGraph = React.useCallback(() => buildGraphInSpace(db, spaceId), [spaceId]);
  const createRestoredMainTab = React.useCallback(
    (id: string): AppHeaderTab | null => {
      const target = resolveWorkspaceTabTarget(id, {
        entityIds: createdEntities.map((entity) => entity.id),
        objectTypeIds: objectTypes.map((type) => type.id),
        collections: objectTypeCollections,
      });
      const objectTypeId = target?.kind === "collection" ? target.objectTypeId : target?.id;
      const objectType =
        target?.kind !== "entity"
          ? objectTypes.find((item) => item.id === objectTypeId)
          : undefined;
      if (objectType) {
        return {
          id,
          label:
            target?.kind === "collection"
              ? objectTypeCollections[target.id].name
              : objectType.label,
          kind: "object-list",
          icon: objectType.icon,
          iconClassName: objectIconToneBadgeClass[objectType.tone],
          draggable: true,
        };
      }

      const entity = createdEntities.find((item) => item.id === target?.id);
      if (entity) {
        const entityType = objectTypes.find((item) => item.id === entity.objectTypeId);
        return {
          id,
          label: entity.title || "Sem título",
          kind: "object",
          icon: entityType?.icon,
          iconClassName: entityType ? objectIconToneBadgeClass[entityType.tone] : undefined,
          draggable: true,
        };
      }

      return null;
    },
    [createdEntities, objectTypes, objectTypeCollections],
  );

  const createRestoredSideTab = React.useCallback((id: string): AppHeaderTab | null => {
    const item = defaultSpecialItems.find((candidate) => candidate.id === id);
    if (!item) return null;
    return {
      id,
      label: item.label,
      icon: item.icon,
      draggable: true,
    };
  }, []);

  const openInSidePanel = React.useCallback(
    (
      tabOrDescriptor: Partial<AppHeaderTab> & {
        id?: string;
        label?: string;
        icon?: React.ElementType;
      },
    ) => {
      const id = tabOrDescriptor.id ?? `side-${Date.now()}`;
      setSideTabs((current) => {
        const nextTab: AppHeaderTab = {
          label: "Side Panel",
          ...tabOrDescriptor,
          id,
          draggable: true,
        };
        return resolveSidePanelTabsAfterOpen(current, sideValue, nextTab);
      });
      setSideValue(id);
      if (appShell?.rightCollapsed) appShell.toggleRight();
    },
    [appShell, sideValue],
  );

  const openExploreSidePanel = React.useCallback(() => {
    const activation = resolveWorkspaceExploreActivation(mainValue);
    setActiveAction(activation.activeAction);
    setSideValue(activation.sideValue);
    if (appShell?.rightCollapsed) appShell.toggleRight();
  }, [appShell, mainValue]);

  const resolveWorkspaceRouteMainValue = React.useCallback(
    (routeMainValue: string) =>
      resolveWorkspaceMainValueFromRouteSegment(routeMainValue, createdEntities),
    [createdEntities],
  );

  React.useEffect(() => {
    if (typeof window === "undefined" || !ready) return;

    function applyMainValue(nextMainValue: string) {
      setMainValue(nextMainValue);
      setActiveAction(
        nextMainValue.startsWith("primary-action:")
          ? nextMainValue.replace("primary-action:", "")
          : undefined,
      );
      if (!nextMainValue.startsWith("primary-action:")) setActiveEntityId(nextMainValue);
    }

    function restoreWorkspaceRouteState() {
      const routeState = getWorkspaceRouteStateFromLocation(
        window.location.pathname,
        window.location.search,
      );
      const storedMainTabsState = getStoredWorkspaceMainTabsState(spaceId);
      const restoredMainTabsState = resolveWorkspaceMainTabsFromStoredState({
        createTab: createRestoredMainTab,
        defaultTabs: initialMainTabs,
        routeMainValue: routeState.mainValue,
        storedState: storedMainTabsState,
      });

      if (restoredMainTabsState) {
        setMainTabs(restoredMainTabsState.tabs);
        applyMainValue(restoredMainTabsState.mainValue);
      } else if (routeState.mainValue) {
        const nextMainValue = resolveWorkspaceRouteMainValue(routeState.mainValue);
        const restoredTab = createRestoredMainTab(nextMainValue);
        if (restoredTab) {
          setMainTabs((current) => upsertWorkspaceTab(current, restoredTab));
        }
        applyMainValue(nextMainValue);
      }
      const nextSideValue = routeState.sideValue ?? getStoredWorkspaceSideValue();
      if (nextSideValue) {
        const restoredTab = createRestoredSideTab(nextSideValue);
        if (restoredTab) {
          setSideTabs((current) => {
            if (current.some((tab) => tab.id === restoredTab.id)) return current;
            const [onlyTab] = current;
            if (onlyTab && current.length === 1 && isDefaultExploreSideTab(onlyTab)) {
              return [restoredTab];
            }
            return [...current, restoredTab];
          });
        }
        setSideValue(nextSideValue);
      }
    }

    restoreWorkspaceRouteState();
    setRouteRestored(true);
    window.addEventListener("popstate", restoreWorkspaceRouteState);
    return () => window.removeEventListener("popstate", restoreWorkspaceRouteState);
  }, [
    createRestoredMainTab,
    createRestoredSideTab,
    ready,
    resolveWorkspaceRouteMainValue,
    spaceId,
  ]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !routeRestored) return;

    const currentPath = `${window.location.pathname}${window.location.search}`;
    const nextPath = createWorkspaceUrlPath({
      currentSearch: window.location.search,
      mainValue,
      spaceId,
    });
    if (currentPath === nextPath) {
      hasSyncedInitialUrlRef.current = true;
      return;
    }

    const method = hasSyncedInitialUrlRef.current ? "pushState" : "replaceState";
    window.history[method]({ mainValue }, "", nextPath);
    hasSyncedInitialUrlRef.current = true;
  }, [mainValue, routeRestored, spaceId]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !routeRestored) return;
    window.localStorage.setItem(
      WORKSPACE_MAIN_TABS_STORAGE_KEY,
      JSON.stringify(createWorkspaceMainTabsStorageState({ mainValue, spaceId, tabs: mainTabs })),
    );
  }, [mainTabs, mainValue, routeRestored, spaceId]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !routeRestored) return;
    window.localStorage.setItem(WORKSPACE_SIDE_STATE_STORAGE_KEY, JSON.stringify({ sideValue }));
  }, [routeRestored, sideValue]);

  React.useEffect(() => {
    function targetIsEditable(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      return (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      );
    }

    function openCommandPalette(openInNewTab = false) {
      window.dispatchEvent(
        new CustomEvent("workspace:open-command-palette", {
          detail: { openInNewTab },
        }),
      );
    }

    function closeCurrentTab() {
      if (mainTabs.length <= 1) return;
      const index = mainTabs.findIndex((tab) => tab.id === mainValue);
      const nextTabs = mainTabs.filter((tab) => tab.id !== mainValue);
      const fallback = nextTabs[index] ?? nextTabs[index - 1] ?? nextTabs[0];
      setMainTabs(nextTabs);
      if (fallback) setMainValue(fallback.id);
    }

    function selectRelativeTab(direction: 1 | -1) {
      if (mainTabs.length < 2) return;
      const index = Math.max(
        0,
        mainTabs.findIndex((tab) => tab.id === mainValue),
      );
      const nextIndex = (index + direction + mainTabs.length) % mainTabs.length;
      setMainValue(mainTabs[nextIndex]?.id ?? mainValue);
    }

    function claimShortcut(event: KeyboardEvent) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    function handleGlobalKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const mod = event.metaKey || event.ctrlKey;
      const editable = targetIsEditable(event.target);

      if (event.isComposing) return;

      if (mod && event.shiftKey && key === "t" && !editable) {
        claimShortcut(event);
        void createWorkspaceEntity("task", "Task");
        return;
      }

      if (mod && event.shiftKey && key === "p" && !editable) {
        claimShortcut(event);
        openCommandPalette(false);
        return;
      }

      if (mod && event.shiftKey && key === "b" && !editable) {
        claimShortcut(event);
        setShortcutBrowserOpen((open: boolean) => !open);
        return;
      }

      if (mod && key === "," && !editable) {
        claimShortcut(event);
        showMessage("Settings");
        return;
      }

      if (mod && key === "w" && !editable) {
        claimShortcut(event);
        closeCurrentTab();
        return;
      }

      if (mod && event.altKey && key === "h" && !editable) {
        claimShortcut(event);
        setActiveAction("calendar");
        setActiveEntityId(null);
        setMainValue("primary-action:calendar");
        return;
      }

      if (mod && event.altKey && key === "t" && !editable) {
        claimShortcut(event);
        setActiveAction("tasks");
        setActiveEntityId(null);
        setMainValue("primary-action:tasks");
        return;
      }

      if (mod && key === "j" && !editable) {
        claimShortcut(event);
        openExploreSidePanel();
        return;
      }

      if (mod && event.shiftKey && key === "l" && !editable) {
        claimShortcut(event);
        toggleTheme();
        return;
      }

      if (mod && event.shiftKey && key === "m" && !editable) {
        claimShortcut(event);
        focusMode?.toggle();
        return;
      }

      if (mod && event.shiftKey && event.key === "ArrowLeft" && !editable) {
        claimShortcut(event);
        appShell?.toggleLeft();
        return;
      }

      if (mod && event.shiftKey && event.key === "ArrowRight" && !editable) {
        claimShortcut(event);
        appShell?.toggleRight();
        return;
      }

      if (mod && event.altKey && event.key === "ArrowRight" && !editable) {
        claimShortcut(event);
        appShell?.toggleRight();
        return;
      }

      if (mod && (event.key === "ArrowLeft" || event.key === "[") && !editable) {
        claimShortcut(event);
        window.history.back();
        return;
      }

      if (mod && (event.key === "ArrowRight" || event.key === "]") && !editable) {
        claimShortcut(event);
        window.history.forward();
        return;
      }

      if (mod && key === "tab" && !editable) {
        claimShortcut(event);
        selectRelativeTab(event.shiftKey ? -1 : 1);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown, true);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown, true);
  }, [
    appShell,
    createWorkspaceEntity,
    focusMode,
    mainTabs,
    mainValue,
    openExploreSidePanel,
    showMessage,
    toggleTheme,
  ]);

  const value = React.useMemo<WorkspaceContextValue>(
    () => ({
      ...defaultWorkspaceContext,
      ready,
      spaces,
      spaceId,
      routeRestored,
      setSpaces,
      createSpace,
      deleteSpace,
      renameSpace,
      switchSpace,
      activeAction,
      setActiveAction,
      activeEntityId,
      setActiveEntityId,
      mainTabs,
      setMainTabs,
      mainValue,
      setMainValue,
      sideTabs,
      setSideTabs,
      sideValue,
      setSideValue,
      selectEntity,
      pinnedEntities,
      objectTypeOrder,
      availablePinnedEntities,
      objectTypes,
      objectTypeRecords,
      objectTypeCollections,
      createdEntities,
      tags,
      customSections,
      setPinnedEntities,
      moveEntityToCollection,
      setObjectTypeOrder,
      setCommandPaletteOpen,
      createWorkspaceStructureFromPreset,
      createWorkspaceStructure,
      updateWorkspaceStructure,
      deleteWorkspaceStructure,
      setObjectTypeCollections,
      setCustomSections,
      setSideSearchOpen,
      setShortcutBrowserOpen,
      openInSidePanel,
      openExploreSidePanel,
      createWorkspaceEntity,
      reviewFlashcard,
      showMessage,
      trashItems,
      emptyTrash,
      purgeTrashItem,
      restoreTrashItem,
      searchEntities,
      listBacklinks,
      buildGraph,
    }),
    [
      ready,
      spaces,
      spaceId,
      routeRestored,
      setSpaces,
      createSpace,
      deleteSpace,
      renameSpace,
      switchSpace,
      activeAction,
      activeEntityId,
      mainTabs,
      mainValue,
      sideTabs,
      sideValue,
      selectEntity,
      pinnedEntities,
      objectTypeOrder,
      availablePinnedEntities,
      objectTypes,
      objectTypeRecords,
      objectTypeCollections,
      createdEntities,
      tags,
      customSections,
      setPinnedEntities,
      moveEntityToCollection,
      setObjectTypeOrder,
      createWorkspaceStructureFromPreset,
      createWorkspaceStructure,
      updateWorkspaceStructure,
      deleteWorkspaceStructure,
      setObjectTypeCollections,
      openInSidePanel,
      openExploreSidePanel,
      createWorkspaceEntity,
      reviewFlashcard,
      showMessage,
      trashItems,
      emptyTrash,
      purgeTrashItem,
      restoreTrashItem,
      searchEntities,
      listBacklinks,
      buildGraph,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  return React.useContext(WorkspaceContext);
}

export function WorkspaceMainHeader() {
  const {
    activeEntityId,
    createdEntities,
    mainTabs,
    mainValue,
    objectTypeCollections,
    objectTypes,
    routeRestored,
    setMainTabs,
    setMainValue,
    openInSidePanel,
  } = useWorkspace();
  const appShell = React.useContext(AppShellContext);
  const rightCollapsed = appShell?.rightCollapsed ?? false;
  const toggleRight = appShell?.toggleRight;
  const rightPanelTriggerRef = appShell?.rightPanelTriggerRef;
  const tabs = mainTabs && mainTabs.length > 0 ? mainTabs : initialMainTabs;
  const value = mainValue || tabs[0]?.id || "page";
  const tabsRestored = shouldRenderWorkspaceHeaderTabs(Boolean(routeRestored));
  const specialItems = filterSidePanelSpecialItemsForContext(
    defaultSpecialItems,
    resolveWorkspaceSidePanelContext({
      activeEntityId,
      collections: Object.values(objectTypeCollections ?? {}),
      entities: createdEntities,
      mainValue,
      objectTypes,
    }),
  );

  function openSpecialEntry(entryId: SidePanelSpecialEntryId) {
    const item = specialItems.find((candidate) => candidate.id === entryId);
    if (!item) return;
    const tabId = entryId === "aiAssistantChat" ? `aiAssistantChat_${Date.now()}` : entryId;
    openInSidePanel({ id: tabId, label: item.label, icon: item.icon, draggable: true });
    if (rightCollapsed && toggleRight) toggleRight();
  }

  return (
    <AppHeader
      end={
        rightCollapsed ? (
          <div className="flex items-center">
            <AppHeaderAction
              ref={rightPanelTriggerRef}
              aria-label="Show side panel"
              tooltip="Show side panel"
              className="rounded-r-none border-r-0"
              onClick={toggleRight}
            >
              <AppHeaderSidebarSimpleIcon className="size-4 rotate-180" />
            </AppHeaderAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                aria-label="Side panel menu"
                className="relative flex h-7 w-4 shrink-0 items-center justify-center rounded-l-none rounded-r-lg border border-transparent bg-transparent text-[9px] text-[var(--app-header-text-secondary)] hover:bg-[var(--app-header-bg-front-hover)] hover:text-[var(--app-header-text-primary)] active:z-20 active:brightness-[0.97] focus:outline-none"
              >
                <AppHeaderCaretDownIcon className="size-2.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" sideOffset={6} className="w-64 p-1.5">
                {specialItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      className="h-10 gap-3 px-2.5 text-sm"
                      onClick={() => openSpecialEntry(item.id)}
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null
      }
    >
      {tabsRestored ? (
        <AppSpaceHeader
          tabs={tabs}
          value={value}
          onValueChange={setMainValue}
          onTabsChange={setMainTabs}
          onCreate={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent("workspace:open-command-palette", {
                  detail: { openInNewTab: true },
                }),
              );
            }
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          data-slot="workspace-header-tabs-loading"
          className="h-8 min-w-0 flex-1"
        />
      )}
    </AppHeader>
  );
}

export function WorkspaceSidePanelHeader() {
  const {
    activeEntityId,
    createdEntities,
    mainValue,
    objectTypeCollections,
    objectTypes,
    sideTabs,
    setSideTabs,
    sideValue,
    setSideValue,
    openInSidePanel,
  } = useWorkspace();
  const appShell = React.useContext(AppShellContext);
  const toggleRight = appShell?.toggleRight;
  const tabs = sideTabs && sideTabs.length > 0 ? sideTabs : initialSideTabs;
  const value = sideValue || tabs[0]?.id || "side-1";
  const handleSideTabCloseRequest = React.useCallback(
    (tab: AppHeaderTab) => {
      if (tabs.length > 1) return undefined;
      const nextState = resolveSidePanelTabsAfterClose(tabs, value, tab);
      setSideTabs(nextState.tabs);
      setSideValue(nextState.value);
      return undefined;
    },
    [setSideTabs, setSideValue, tabs, value],
  );
  const specialItems = filterSidePanelSpecialItemsForContext(
    defaultSpecialItems,
    resolveWorkspaceSidePanelContext({
      activeEntityId,
      collections: Object.values(objectTypeCollections ?? {}),
      entities: createdEntities,
      mainValue,
      objectTypes,
    }),
  );

  return (
    <AppSidePanelHeader
      tabs={tabs}
      value={value}
      onValueChange={setSideValue}
      onTabsChange={setSideTabs}
      onCloseRequest={handleSideTabCloseRequest}
      onHide={toggleRight}
      onSpecialEntrySelect={(entryId) => {
        const item = specialItems.find((candidate) => candidate.id === entryId);
        if (!item) return;
        const tabId = entryId === "aiAssistantChat" ? `aiAssistantChat_${Date.now()}` : entryId;
        openInSidePanel({ id: tabId, label: item.label, icon: item.icon, draggable: true });
      }}
      onCreate={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("workspace:open-command-palette", {
              detail: { openInNewTab: true },
            }),
          );
        }
      }}
      specialItems={specialItems}
    />
  );
}
