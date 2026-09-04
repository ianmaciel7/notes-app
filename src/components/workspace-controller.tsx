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
import {
  ObjectAiChatIcon,
  ObjectAudioIcon,
  ObjectFileIcon,
  ObjectImageIcon,
  ObjectPageIcon,
  ObjectPdfIcon,
  ObjectQueryIcon,
  ObjectTableIcon,
  ObjectTagIcon,
  ObjectTaskIcon,
  ObjectTweetIcon,
  ObjectWeblinkIcon,
} from "@/components/object-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ---------------------------------------------------------------------------
// Workspace context — app-shell chrome and default object types
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WorkspaceContextValue = Record<string, any>;

const defaultSpaces = [{ id: "personal", name: "Personal Space", icon: "user" }];

const defaultObjectTypes = [
  {
    id: "page",
    label: "Pages",
    singularLabel: "Page",
    icon: ObjectPageIcon,
    tone: "blue" as const,
    count: 0,
  },
  {
    id: "table",
    label: "Tables",
    singularLabel: "Table",
    icon: ObjectTableIcon,
    tone: "blue" as const,
    count: 0,
  },
  {
    id: "task",
    label: "Tasks",
    singularLabel: "Task",
    icon: ObjectTaskIcon,
    tone: "orange" as const,
    count: 0,
  },
  {
    id: "weblink",
    label: "Weblinks",
    singularLabel: "Weblink",
    icon: ObjectWeblinkIcon,
    tone: "blue" as const,
    count: 0,
  },
  {
    id: "image",
    label: "Images",
    singularLabel: "Image",
    icon: ObjectImageIcon,
    tone: "red" as const,
    count: 0,
  },
  {
    id: "pdf",
    label: "PDFs",
    singularLabel: "PDF",
    icon: ObjectPdfIcon,
    tone: "red" as const,
    count: 0,
  },
  {
    id: "audio",
    label: "Audio",
    singularLabel: "Audio",
    icon: ObjectAudioIcon,
    tone: "red" as const,
    count: 0,
  },
  {
    id: "file",
    label: "Files",
    singularLabel: "File",
    icon: ObjectFileIcon,
    tone: "red" as const,
    count: 0,
  },
  {
    id: "tweet",
    label: "Tweets",
    singularLabel: "Tweet",
    icon: ObjectTweetIcon,
    tone: "blue" as const,
    count: 0,
  },
  {
    id: "ai-chat",
    label: "AI chats",
    singularLabel: "AI chat",
    icon: ObjectAiChatIcon,
    tone: "purple" as const,
    count: 0,
  },
  {
    id: "tag",
    label: "Tags",
    singularLabel: "Tag",
    icon: ObjectTagIcon,
    tone: "orange" as const,
    count: 0,
  },
  {
    id: "query",
    label: "Queries",
    singularLabel: "Query",
    icon: ObjectQueryIcon,
    tone: "green" as const,
    count: 0,
  },
];

const initialMainTabs = [
  { id: "page-1", label: "Untitled Page", icon: ObjectPageIcon, draggable: true },
];

const initialSideTabs = [
  { id: "side-1", label: "Explore", icon: AppHeaderCompassIcon, draggable: true },
];

const defaultWorkspaceContext: WorkspaceContextValue = {
  spaces: defaultSpaces,
  spaceId: "personal",
  setSpaces: () => {},
  createSpace: () => {},
  deleteSpace: () => {},
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
  objectTypes: defaultObjectTypes,
  objectTypeCollections: {},
  createdEntities: [],
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
};

const WorkspaceContext = React.createContext<WorkspaceContextValue>(defaultWorkspaceContext);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [spaces, setSpaces] = React.useState(defaultSpaces);
  const [spaceId, setSpaceId] = React.useState("personal");
  const [mainTabs, setMainTabs] = React.useState<AppHeaderTab[]>(initialMainTabs);
  const [mainValue, setMainValue] = React.useState("page-1");
  const [sideTabs, setSideTabs] = React.useState<AppHeaderTab[]>(initialSideTabs);
  const [sideValue, setSideValue] = React.useState("side-1");
  const [activeEntityId, setActiveEntityId] = React.useState("overview");
  const [pinnedEntities, setPinnedEntities] = React.useState<any[]>([]);
  const [objectTypeCollections, setObjectTypeCollections] = React.useState<Record<string, any>>({});
  const [customSections, setCustomSections] = React.useState<any[]>([]);

  const createSpace = React.useCallback((name: string) => {
  const normalizedName = name.trim();
  if (!normalizedName) return;

  const id = `space-${crypto.randomUUID()}`;
  setSpaces((current) => [...current, { id, name: normalizedName, icon: "user" }]);
  setSpaceId(id);
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
        const existing = current.find((t) => t.id === id);
        if (existing) return current;
        return [...current, { label: "Side Panel", ...tabOrDescriptor, id, draggable: true }];
      });
      setSideValue(id);
    },
    [],
  );

  const value = React.useMemo<WorkspaceContextValue>(
    () => ({
      ...defaultWorkspaceContext,
      spaces,
      spaceId,
      setSpaces,
      createSpace,
      switchSpace: setSpaceId,
      mainTabs,
      setMainTabs,
      mainValue,
      setMainValue,
      sideTabs,
      setSideTabs,
      sideValue,
      setSideValue,
      openInSidePanel,
      activeEntityId,
      setActiveEntityId,
      pinnedEntities,
      setPinnedEntities,
      objectTypeCollections,
      setObjectTypeCollections,
      customSections,
      setCustomSections,
    }),
    [
      spaces,
      spaceId,
      createSpace,
      mainTabs,
      mainValue,
      sideTabs,
      sideValue,
      openInSidePanel,
      activeEntityId,
      pinnedEntities,
      objectTypeCollections,
      customSections,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  return React.useContext(WorkspaceContext);
}

/** Workspace main header with back/forward history, tab bar, and action controls. */
export function WorkspaceMainHeader() {
  const { mainTabs, setMainTabs, mainValue, setMainValue, openInSidePanel } = useWorkspace();
  const appShell = React.useContext(AppShellContext);
  const rightCollapsed = appShell?.rightCollapsed ?? false;
  const toggleRight = appShell?.toggleRight;
  const rightPanelTriggerRef = appShell?.rightPanelTriggerRef;

  const tabs = mainTabs && mainTabs.length > 0 ? mainTabs : initialMainTabs;
  const value = mainValue || tabs[0]?.id || "page-1";

  function openSpecialEntry(entryId: SidePanelSpecialEntryId) {
    const item = defaultSpecialItems.find((s) => s.id === entryId);
    if (!item) return;
    const tabId = entryId === "aiAssistantChat" ? `aiAssistantChat_${Date.now()}` : entryId;
    openInSidePanel({
      id: tabId,
      label: item.label,
      icon: item.icon,
      draggable: true,
    });
    if (rightCollapsed && toggleRight) {
      toggleRight();
    }
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
          const newTab = { id, label: "Untitled Page", icon: ObjectPageIcon, draggable: true };
          setMainTabs((prev: AppHeaderTab[]) => [...prev, newTab]);
          setMainValue(id);
        }}
      />
    </AppHeader>
  );
}

/** Workspace side panel header with side tabs and controls. */
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
        const item = defaultSpecialItems.find((s) => s.id === entryId);
        if (!item) return;
        const tabId = entryId === "aiAssistantChat" ? `aiAssistantChat_${Date.now()}` : entryId;
        openInSidePanel({
          id: tabId,
          label: item.label,
          icon: item.icon,
          draggable: true,
        });
      }}
      onCreate={() => {
        const id = `side-${Date.now()}`;
        const newTab = { id, label: "Side Panel", icon: ObjectPageIcon, draggable: true };
        setSideTabs((prev: AppHeaderTab[]) => [...prev, newTab]);
        setSideValue(id);
      }}
    />
  );
}
