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
} from "@/components/app-side-panel-header";
import { ObjectPageIcon } from "@/components/object-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSpaceData } from "@/hooks/use-space-data";
import { db } from "@/lib/db";
import {
  buildGraphInSpace,
  listBacklinksInSpace,
  searchEntitiesInSpace,
} from "@/lib/spaces/space-projections";
import { PERSONAL_SPACE_ID } from "@/lib/spaces/space-types";
import type {
  CreateStructureInput,
  ObjectIconName,
  ObjectIconTone,
} from "@/lib/workspace-object-types";

// biome-ignore lint/suspicious/noExplicitAny: context compatibility while legacy UI APIs are migrated
export type WorkspaceContextValue = Record<string, any>;

const initialMainTabs = [
  { id: "page-1", label: "Untitled Page", icon: ObjectPageIcon, draggable: true },
];
const initialSideTabs = [
  { id: "side-1", label: "Explore", icon: AppHeaderCompassIcon, draggable: true },
];

const defaultWorkspaceContext: WorkspaceContextValue = {
  spaces: [{ id: PERSONAL_SPACE_ID, name: "Personal Space", icon: "user" }],
  spaceId: PERSONAL_SPACE_ID,
  setSpaces: () => {},
  createSpace: () => {},
  deleteSpace: () => false,
  renameSpace: () => {},
  switchSpace: () => {},
  activeAction: undefined,
  setActiveAction: () => {},
  activeEntityId: "overview",
  setActiveEntityId: () => {},
  mainTabs: initialMainTabs,
  setMainTabs: () => {},
  mainValue: "page-1",
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
  createWorkspaceEntity: () => {},
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
    tags,
    trashItems,
  } = useSpaceData();
  const spaceId = persistedSpaceId ?? PERSONAL_SPACE_ID;

  const [mainTabs, setMainTabs] = React.useState<AppHeaderTab[]>(initialMainTabs);
  const [mainValue, setMainValue] = React.useState("page-1");
  const [sideTabs, setSideTabs] = React.useState<AppHeaderTab[]>(initialSideTabs);
  const [sideValue, setSideValue] = React.useState("side-1");
  const [activeAction, setActiveAction] = React.useState<string | undefined>();
  const [activeEntityId, setActiveEntityId] = React.useState<string | null>("overview");
  // biome-ignore lint/suspicious/noExplicitAny: legacy sidebar item type is intentionally preserved
  const [pinnedEntities, setPinnedEntities] = React.useState<any[]>([]);
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
    setActiveEntityId("overview");
    setPinnedEntities([]);
    setCustomSections([]);
    setMainTabs(initialMainTabs);
    setMainValue("page-1");
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
    async (objectTypeId: string, label?: string) => {
      try {
        const entity = await repository.createEntity(spaceId, objectTypeId, `Untitled ${label ?? "Object"}`);
        setActiveEntityId(entity.id);
        const objectType = objectTypes.find((item) => item.id === objectTypeId);
        if (objectType) {
          const tab: AppHeaderTab = {
            id: entity.id,
            label: entity.title,
            icon: objectType.icon,
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
      return type
        ? [{ id: entity.id, label: entity.title, icon: type.icon, tone: type.tone }]
        : [];
    });
  }, [createdEntities, objectTypes]);

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
    (id: string) => void repository.deleteTrash(spaceId, id),
    [repository, spaceId],
  );
  const restoreTrashItem = purgeTrashItem;

  const searchEntities = React.useCallback(
    (query: string) => searchEntitiesInSpace(db, spaceId, query),
    [spaceId],
  );
  const listBacklinks = React.useCallback(
    (targetId: string) => listBacklinksInSpace(db, spaceId, targetId),
    [spaceId],
  );
  const buildGraph = React.useCallback(() => buildGraphInSpace(db, spaceId), [spaceId]);

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
        if (current.some((tab) => tab.id === id)) return current;
        return [...current, { label: "Side Panel", ...tabOrDescriptor, id, draggable: true }];
      });
      setSideValue(id);
    },
    [],
  );

  const value = React.useMemo<WorkspaceContextValue>(
    () => ({
      ...defaultWorkspaceContext,
      ready,
      spaces,
      spaceId,
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
      availablePinnedEntities,
      objectTypes,
      objectTypeRecords,
      objectTypeCollections,
      createdEntities,
      tags,
      customSections,
      setPinnedEntities,
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
      createWorkspaceEntity,
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
      availablePinnedEntities,
      objectTypes,
      objectTypeRecords,
      objectTypeCollections,
      createdEntities,
      tags,
      customSections,
      createWorkspaceStructureFromPreset,
      createWorkspaceStructure,
      updateWorkspaceStructure,
      deleteWorkspaceStructure,
      setObjectTypeCollections,
      openInSidePanel,
      createWorkspaceEntity,
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
  const { mainTabs, setMainTabs, mainValue, setMainValue, openInSidePanel } = useWorkspace();
  const appShell = React.useContext(AppShellContext);
  const rightCollapsed = appShell?.rightCollapsed ?? false;
  const toggleRight = appShell?.toggleRight;
  const rightPanelTriggerRef = appShell?.rightPanelTriggerRef;
  const tabs = mainTabs && mainTabs.length > 0 ? mainTabs : initialMainTabs;
  const value = mainValue || tabs[0]?.id || "page-1";

  function openSpecialEntry(entryId: SidePanelSpecialEntryId) {
    const item = defaultSpecialItems.find((candidate) => candidate.id === entryId);
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
                {defaultSpecialItems.map((item) => {
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
      <AppSpaceHeader
        tabs={tabs}
        value={value}
        onValueChange={setMainValue}
        onTabsChange={setMainTabs}
        onCreate={() => {
          const id = `tab-${Date.now()}`;
          setMainTabs((previous: AppHeaderTab[]) => [
            ...previous,
            { id, label: "Untitled Page", icon: ObjectPageIcon, draggable: true },
          ]);
          setMainValue(id);
        }}
      />
    </AppHeader>
  );
}

export function WorkspaceSidePanelHeader() {
  const { sideTabs, setSideTabs, sideValue, setSideValue, openInSidePanel } = useWorkspace();
  const appShell = React.useContext(AppShellContext);
  const toggleRight = appShell?.toggleRight;
  const tabs = sideTabs && sideTabs.length > 0 ? sideTabs : initialSideTabs;
  const value = sideValue || tabs[0]?.id || "side-1";

  return (
    <AppSidePanelHeader
      tabs={tabs}
      value={value}
      onValueChange={setSideValue}
      onTabsChange={setSideTabs}
      onHide={toggleRight}
      onSpecialEntrySelect={(entryId) => {
        const item = defaultSpecialItems.find((candidate) => candidate.id === entryId);
        if (!item) return;
        const tabId = entryId === "aiAssistantChat" ? `aiAssistantChat_${Date.now()}` : entryId;
        openInSidePanel({ id: tabId, label: item.label, icon: item.icon, draggable: true });
      }}
      onCreate={() => {
        const id = `side-${Date.now()}`;
        setSideTabs((previous: AppHeaderTab[]) => [
          ...previous,
          { id, label: "Side Panel", icon: ObjectPageIcon, draggable: true },
        ]);
        setSideValue(id);
      }}
    />
  );
}
