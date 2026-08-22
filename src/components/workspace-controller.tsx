"use client";

import * as React from "react";

import {
  AppFocusModeControls,
  AppHeader,
  AppHeaderAction,
} from "@/components/app-header";
import {
  AppHeaderCaretDownIcon,
  AppHeaderCompassIcon,
  AppHeaderGraphIcon,
  AppHeaderSidebarSimpleIcon,
} from "@/components/app-header-icons";
import {
  type AppHeaderTab,
  AppSpaceHeader,
} from "@/components/app-header-tabs";
import { type AppSidebarSpace } from "@/components/app-sidebar";
import { useAppShell } from "@/components/app-shell";
import { AppSidebarSearchIcon } from "@/components/app-sidebar-icons";
import { AppSidebarWorkspaceIcon } from "@/components/app-sidebar-source-icon";
import {
  type AppSidebarCustomSection,
  type AppSidebarObjectType,
  type AppSidebarPinnedEntity,
} from "@/components/app-sidebar-overview";
import {
  ObjectAiChatIcon,
  ObjectArchiveIcon,
  ObjectAreaIcon,
  ObjectAtomicNoteIcon,
  ObjectBookIcon,
  ObjectCodeIcon,
  ObjectIconBadge,
  ObjectIdeaIcon,
  ObjectKnowledgeIcon,
  ObjectPageIcon,
  ObjectProjectIcon,
  ObjectQueryIcon,
  ObjectQuoteIcon,
  type ObjectIconProps,
  type ObjectIconTone,
  objectIconToneBadgeClass,
  objectTypeDefinitionById,
} from "@/components/object-icons";
import {
  AppSidePanelHeader,
  type SidePanelSpecialEntryId,
} from "@/components/app-side-panel-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const initialMainTabs: AppHeaderTab[] = [
  {
    id: "page-1",
    label: "aaaaaaaaaaaaa",
    icon: ObjectPageIcon,
    iconClassName: objectIconToneBadgeClass.blue,
    preview: <TabPreview eyebrow="Página" title="aaaaaaaaaaaaa" />,
  },
  {
    id: "atomic-note",
    label: "Notas atômicas",
    icon: ObjectAtomicNoteIcon,
    iconClassName: objectIconToneBadgeClass.amber,
    preview: <TabPreview eyebrow="Tipo de objeto" title="Notas atômicas" />,
  },
  {
    id: "quote",
    label: "Citações",
    icon: ObjectQuoteIcon,
    iconClassName: objectIconToneBadgeClass.rose,
    preview: <TabPreview eyebrow="Tipo de objeto" title="Citações" />,
  },
  {
    id: "page",
    label: "Páginas",
    icon: ObjectPageIcon,
    iconClassName: objectIconToneBadgeClass.blue,
    preview: <TabPreview eyebrow="Tipo de objeto" title="Páginas" />,
  },
  {
    id: "untitled",
    label: "Sem título",
    icon: ObjectQuoteIcon,
    iconClassName: objectIconToneBadgeClass.rose,
    preview: <TabPreview eyebrow="Citação" title="Sem título" />,
  },
];

const initialSideTabs: AppHeaderTab[] = [
  {
    id: "explore",
    label: "Explorar",
    icon: AppHeaderCompassIcon,
    iconClassName: objectIconToneBadgeClass.gray,
    draggable: false,
  },
];

const MAIN_DRAFT_TAB_ID = "new-tab-draft";

const specialSideTabs: Record<
  SidePanelSpecialEntryId,
  Omit<AppHeaderTab, "id">
> = {
  graphView: {
    label: "Visualização em grafo",
    icon: AppHeaderGraphIcon,
    iconClassName: objectIconToneBadgeClass.gray,
  },
  backlinks: {
    label: "Links de entrada",
    icon: ObjectPageIcon,
    iconClassName: objectIconToneBadgeClass.gray,
  },
  objectsInside: {
    label: "Objetos internos",
    icon: ObjectAreaIcon,
    iconClassName: objectIconToneBadgeClass.gray,
  },
  relatedContent: {
    label: "Conteúdo relacionado",
    icon: AppHeaderGraphIcon,
    iconClassName: objectIconToneBadgeClass.gray,
  },
  aiAssistantChat: {
    label: "Chat de IA",
    icon: ObjectAiChatIcon,
    iconClassName: objectIconToneBadgeClass.purple,
  },
  localSpaceQuery: {
    label: "Buscar",
    icon: ObjectQueryIcon,
    iconClassName: objectIconToneBadgeClass.emerald,
  },
};

type AppSidebarPrimaryNavigationAction = "search" | "explore" | "calendar";

const initialSpaces: AppSidebarSpace[] = [
  { id: "studies", name: "Studies", icon: ObjectBookIcon },
  { id: "ideas", name: "Ideas", icon: ObjectIdeaIcon },
  { id: "labs", name: "zzzzzzzzzz", icon: AppSidebarWorkspaceIcon },
  { id: "projects", name: "Projects", icon: ObjectProjectIcon },
  { id: "dev", name: "Dev", icon: ObjectCodeIcon },
  { id: "knowledge", name: "Knowledge", icon: ObjectKnowledgeIcon },
  { id: "archive", name: "Archive", icon: ObjectArchiveIcon },
];

const availablePinnedEntities: AppSidebarPinnedEntity[] = [
  {
    id: "page-1",
    label: "aaaaaaaaaaaaa",
    icon: ObjectPageIcon,
    tone: "blue",
  },
];

const initialObjectTypes: AppSidebarObjectType[] = [
  {
    id: "atomic-note",
    label: "Notas atômicas",
    icon: ObjectAtomicNoteIcon,
    tone: "amber",
    count: 0,
  },
  {
    id: "quote",
    label: "Citações",
    icon: ObjectQuoteIcon,
    tone: "rose",
    count: 1,
  },
  {
    id: "page",
    label: "Páginas",
    icon: ObjectPageIcon,
    tone: "blue",
    count: 1,
  },
];

type WorkspaceContextValue = {
  spaces: AppSidebarSpace[];
  spaceId: string;
  mainTabs: AppHeaderTab[];
  mainValue: string;
  sideTabs: AppHeaderTab[];
  sideValue: string;
  focusMode: boolean;
  sideSearchOpen: boolean;
  mainSearchOpen: boolean;
  activeAction: AppSidebarPrimaryNavigationAction | undefined;
  activeEntityId: string | null;
  pinnedEntities: AppSidebarPinnedEntity[];
  availablePinnedEntities: AppSidebarPinnedEntity[];
  objectTypes: AppSidebarObjectType[];
  createdEntities: WorkspaceCreatedEntity[];
  customSections: AppSidebarCustomSection[];
  setSpaces: React.Dispatch<React.SetStateAction<AppSidebarSpace[]>>;
  setSpaceId: React.Dispatch<React.SetStateAction<string>>;
  message: string | null;
  setMainTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>;
  setMainValue: React.Dispatch<React.SetStateAction<string>>;
  setSideTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>;
  setSideValue: React.Dispatch<React.SetStateAction<string>>;
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSideSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMainSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveAction: React.Dispatch<
    React.SetStateAction<AppSidebarPrimaryNavigationAction | undefined>
  >;
  setActiveEntityId: React.Dispatch<React.SetStateAction<string | null>>;
  setPinnedEntities: React.Dispatch<React.SetStateAction<AppSidebarPinnedEntity[]>>;
  setObjectTypes: React.Dispatch<React.SetStateAction<AppSidebarObjectType[]>>;
  setCustomSections: React.Dispatch<React.SetStateAction<AppSidebarCustomSection[]>>;
  showMessage: (message: string) => void;
  createWorkspaceEntity: (objectTypeId: string) => void;
  selectEntity: (id: string) => void;
  openInSidePanel: (tab: AppHeaderTab) => void;
};

type WorkspaceCreatedEntity = {
  id: string;
  objectTypeId: string;
  label: string;
  icon: React.ElementType<ObjectIconProps>;
  tone: ObjectIconTone;
};

const WorkspaceContext =
  React.createContext<WorkspaceContextValue | null>(null);

function useWorkspace() {
  const context = React.useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used within WorkspaceProvider.",
    );
  }

  return context;
}

function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [spaces, setSpaces] = React.useState(initialSpaces);
  const [spaceId, setSpaceId] = React.useState("labs");
  const [mainTabs, setMainTabs] = React.useState(initialMainTabs);
  const [mainValue, setMainValue] = React.useState("untitled");
  const [sideTabs, setSideTabs] = React.useState(initialSideTabs);
  const [sideValue, setSideValue] = React.useState("explore");
  const [focusMode, setFocusMode] = React.useState(false);
  const [sideSearchOpen, setSideSearchOpen] = React.useState(false);
  const [mainSearchOpen, setMainSearchOpen] = React.useState(false);
  const [activeAction, setActiveAction] =
    React.useState<AppSidebarPrimaryNavigationAction | undefined>(undefined);
  const [activeEntityId, setActiveEntityId] =
    React.useState<string | null>("quote");
  const [pinnedEntities, setPinnedEntities] =
    React.useState<AppSidebarPinnedEntity[]>([availablePinnedEntities[0]!]);
  const [objectTypes, setObjectTypes] = React.useState(initialObjectTypes);
  const [createdEntities, setCreatedEntities] = React.useState<
    WorkspaceCreatedEntity[]
  >([]);
  const [customSections, setCustomSections] = React.useState<
    AppSidebarCustomSection[]
  >([]);
  const [message, setMessage] = React.useState<string | null>(null);
  const messageTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const createdEntitySequenceRef = React.useRef(0);

  const showMessage = React.useCallback((nextMessage: string) => {
    setMessage(nextMessage);

    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => {
      messageTimerRef.current = null;
      setMessage(null);
    }, 2200);
  }, []);

  React.useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLocaleLowerCase() === "m"
      ) {
        event.preventDefault();
        setFocusMode((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const ensureMainTab = React.useCallback((tab: AppHeaderTab) => {
    setMainTabs((current) =>
      current.some((item) => item.id === tab.id) ? current : [...current, tab],
    );
    setMainValue(tab.id);
  }, []);

  const openInSidePanel = React.useCallback((tab: AppHeaderTab) => {
    setSideTabs((current) => {
      if (current.some((item) => item.id === tab.id)) return current;
      return [...current, { ...tab, pinned: undefined, draggable: true }];
    });
    setSideValue(tab.id);
  }, []);

  const selectEntity = React.useCallback(
    (id: string) => {
      const objectType = objectTypes.find((item) => item.id === id);
      const pinnedEntity = availablePinnedEntities.find((item) => item.id === id);
      const entity = objectType ?? pinnedEntity;

      setActiveEntityId(id);
      setActiveAction(undefined);

      if (!entity) return;

      ensureMainTab({
        id: entity.id,
        label: entity.label,
        icon: entity.icon,
        iconClassName:
          objectIconToneBadgeClass[entity.tone],
        preview: <TabPreview eyebrow="Objeto" title={entity.label} />,
      });
    },
    [ensureMainTab, objectTypes],
  );

  const createWorkspaceEntity = React.useCallback((objectTypeId: string) => {
    const definition = objectTypeDefinitionById[objectTypeId];
    if (!definition) return;

    createdEntitySequenceRef.current += 1;
    const id = `created-${objectTypeId}-${createdEntitySequenceRef.current}`;
    const entity: WorkspaceCreatedEntity = {
      id,
      objectTypeId,
      label: "Sem título",
      icon: definition.icon,
      tone: definition.tone,
    };

    setCreatedEntities((current) => [...current, entity]);
    setObjectTypes((current) =>
      current.map((objectType) =>
        objectType.id === objectTypeId
          ? { ...objectType, count: objectType.count + 1 }
          : objectType,
      ),
    );
    setMainTabs((current) => [
      ...current,
      {
        id,
        label: entity.label,
        icon: entity.icon,
        iconClassName: objectIconToneBadgeClass[entity.tone],
        preview: (
          <TabPreview eyebrow={definition.label} title={entity.label} />
        ),
      },
    ]);
    setMainValue(id);
    setActiveEntityId(id);
    setActiveAction(undefined);
  }, []);

  const value = React.useMemo<WorkspaceContextValue>(
    () => ({
      spaces,
      spaceId,
      mainTabs,
      mainValue,
      sideTabs,
      sideValue,
      focusMode,
      sideSearchOpen,
      mainSearchOpen,
      activeAction,
      activeEntityId,
      pinnedEntities,
      availablePinnedEntities,
      objectTypes,
      createdEntities,
      customSections,
      setSpaces,
      setSpaceId,
      message,
      setMainTabs,
      setMainValue,
      setSideTabs,
      setSideValue,
      setFocusMode,
      setSideSearchOpen,
      setMainSearchOpen,
      setActiveAction,
      setActiveEntityId,
      setPinnedEntities,
      setObjectTypes,
      setCustomSections,
      showMessage,
      createWorkspaceEntity,
      selectEntity,
      openInSidePanel,
    }),
    [
      spaces,
      spaceId,
      focusMode,
      mainTabs,
      mainValue,
      message,
      showMessage,
      sideSearchOpen,
      mainSearchOpen,
      sideTabs,
      sideValue,
      activeAction,
      activeEntityId,
      pinnedEntities,
      objectTypes,
      createdEntities,
      customSections,
      selectEntity,
      createWorkspaceEntity,
      openInSidePanel,
    ],
  );

  return (
    <TooltipProvider delay={200}>
      <WorkspaceContext.Provider value={value}>
        {children}
        {sideSearchOpen && <SidePanelSearchOverlay />}
        {mainSearchOpen && <MainTabSearchOverlay />}
        {message && (
          <div
            data-slot="workspace-message"
            role="status"
            className="pointer-events-none fixed left-1/2 top-14 z-[100] -translate-x-1/2 rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
          >
            {message}
          </div>
        )}
      </WorkspaceContext.Provider>
    </TooltipProvider>
  );
}

function WorkspaceMainHeader() {
  const {
    mainTabs,
    mainValue,
    focusMode,
    setMainTabs,
    setMainValue,
    setFocusMode,
    setMainSearchOpen,
    openInSidePanel,
    showMessage,
  } = useWorkspace();
  const { rightCollapsed, toggleRight } = useAppShell();

  if (focusMode) {
    return (
      <AppFocusModeControls
        onBack={() => showMessage("Back")}
        onForward={() => showMessage("Forward")}
        onExit={() => setFocusMode(false)}
      />
    );
  }

  function createTab() {
    const draft: AppHeaderTab = {
      id: MAIN_DRAFT_TAB_ID,
      label: "Nova aba",
      icon: ObjectPageIcon,
      iconClassName: objectIconToneBadgeClass.blue,
      draggable: false,
    };

    setMainTabs((current) =>
      current.some((tab) => tab.id === MAIN_DRAFT_TAB_ID)
        ? current
        : [...current, draft],
    );
    setMainValue(MAIN_DRAFT_TAB_ID);
    setMainSearchOpen(true);
  }

  return (
    <AppHeader
      onBack={() => showMessage("Back")}
      onForward={() => showMessage("Forward")}
      onFocus={() => setFocusMode(true)}
      end={
        rightCollapsed ? (
          <div className="flex items-center">
            <AppHeaderAction
              aria-label="Show side panel"
              tooltip="Show side panel"
              className="rounded-r-none border-r-0"
              onClick={toggleRight}
            >
              <AppHeaderSidebarSimpleIcon className="size-4 rotate-180" />
            </AppHeaderAction>
            <AppHeaderAction
              aria-label="Side-panel options"
              tooltip="Side-panel options"
              className="h-7 w-4 rounded-l-none px-0 text-[9px]"
              onClick={() => showMessage("Side-panel options")}
            >
              <AppHeaderCaretDownIcon className="size-2.5" />
            </AppHeaderAction>
          </div>
        ) : null
      }
    >
      <AppSpaceHeader
        tabs={mainTabs}
        value={mainValue}
        onValueChange={setMainValue}
        onTabsChange={setMainTabs}
        onCreate={createTab}
        createLabel="Criar nova aba"
        tabListLabel="Lista de abas"
        searchTabsPlaceholder="Buscar abas"
        onShiftOpen={(tab) => {
          openInSidePanel(tab);
          if (rightCollapsed) toggleRight();
          showMessage(`Opened ${tab.label} in the side panel`);
        }}
        onCloseRequest={(tab) => {
          if (!tab.pinned) return true;
          showMessage("Pinned tabs cannot be closed. Unpin the tab first.");
          return false;
        }}
      />
    </AppHeader>
  );
}

function MainTabSearchOverlay() {
  const {
    mainTabs,
    setMainTabs,
    setMainValue,
    setMainSearchOpen,
  } = useWorkspace();
  const [query, setQuery] = React.useState("");

  const options = [
    { id: "atomic-note", label: "Notas atômicas", icon: ObjectAtomicNoteIcon },
    { id: "page-1", label: "aaaaaaaaaaaaa", icon: ObjectPageIcon },
    { id: "page", label: "Páginas", icon: ObjectPageIcon },
    { id: "quote", label: "Citações", icon: ObjectQuoteIcon },
  ];
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  const filtered = normalized
    ? options.filter((option) =>
        option.label.toLocaleLowerCase("pt-BR").includes(normalized),
      )
    : options;

  function cancel() {
    const next = mainTabs.filter((tab) => tab.id !== MAIN_DRAFT_TAB_ID);
    setMainTabs(next);
    setMainValue(next[0]?.id ?? "atomic-note");
    setMainSearchOpen(false);
  }

  function select(option: (typeof options)[number]) {
    const selected: AppHeaderTab = {
      id: option.id,
      label: option.label,
      icon: option.icon,
      iconClassName:
        objectIconToneBadgeClass[
          objectTypeDefinitionById[option.id]?.tone ?? "blue"
        ],
    };
    setMainTabs((current) => {
      const withoutDraft = current.filter((tab) => tab.id !== MAIN_DRAFT_TAB_ID);
      return withoutDraft.some((tab) => tab.id === selected.id)
        ? withoutDraft
        : [...withoutDraft, selected];
    });
    setMainValue(selected.id);
    setMainSearchOpen(false);
  }

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") cancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-black/15 px-4 pt-[10vh]"
    >
      <button
        type="button"
        aria-label="Cancelar criação de nova aba"
        className="absolute inset-0 cursor-default"
        onClick={cancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Criar nova aba"
        className="relative w-full max-w-[42rem] overflow-hidden rounded-xl border border-black/10 bg-popover text-popover-foreground shadow-2xl"
      >
        <div className="flex h-12 items-center gap-2 border-b px-3">
          <AppSidebarSearchIcon className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar conteúdo para abrir em uma nova aba"
            aria-label="Buscar conteúdo para nova aba"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Esc</span>
        </div>
        <div className="p-2">
          <p className="px-2 pb-1.5 text-xs text-muted-foreground">Recentemente abertos</p>
          {filtered.map((option) => {
            const Icon = option.icon;
            const tone =
              objectTypeDefinitionById[option.id]?.tone ?? "blue";
            return (
              <button
                key={option.id}
                type="button"
                className="flex h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-sm hover:bg-muted"
                onClick={() => select(option)}
              >
                <ObjectIconBadge icon={Icon} tone={tone} />
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkspaceSidePanelHeader() {
  const {
    sideTabs,
    sideValue,
    focusMode,
    setSideTabs,
    setSideValue,
    setSideSearchOpen,
  } = useWorkspace();
  const { toggleRight } = useAppShell();

  if (focusMode) return null;

  function openSpecialEntry(entryId: SidePanelSpecialEntryId) {
    if (entryId === "localSpaceQuery") {
      setSideSearchOpen(true);
      return;
    }

    const existing = sideTabs.find((tab) => {
      if (entryId === "aiAssistantChat")
        return tab.id.startsWith("aiAssistantChat_");
      return tab.id === entryId;
    });

    if (existing) {
      setSideValue(existing.id);
      return;
    }

    const descriptor = specialSideTabs[entryId];
    const id =
      entryId === "aiAssistantChat" ? `aiAssistantChat_${Date.now()}` : entryId;
    const next: AppHeaderTab = {
      id,
      ...descriptor,
      draggable: true,
    };

    setSideTabs((current) => [...current, next]);
    setSideValue(id);
  }

  function createSideTab() {
    const explore = sideTabs.find((tab) => tab.id === "explore");

    if (!explore) {
      const nextExplore = initialSideTabs.find((tab) => tab.id === "explore");
      if (!nextExplore) return;

      setSideTabs((current) => [...current, nextExplore]);
      setSideValue(nextExplore.id);
      return;
    }

    if (sideValue === explore.id) {
      setSideSearchOpen(true);
      return;
    }

    setSideValue(explore.id);
  }

  return (
    <AppSidePanelHeader
      tabs={sideTabs}
      value={sideValue}
      onValueChange={setSideValue}
      onTabsChange={setSideTabs}
      onCreate={createSideTab}
      onHide={toggleRight}
      onSpecialEntrySelect={openSpecialEntry}
    />
  );
}

function SidePanelSearchOverlay() {
  const { setSideSearchOpen, setSideTabs, setSideValue } = useWorkspace();
  const [query, setQuery] = React.useState("");

  const recentItems = React.useMemo(
    () => [
      {
        id: "recent-atomic-note",
        label: "Notas atômicas",
        icon: ObjectAtomicNoteIcon,
        iconClassName: objectIconToneBadgeClass.amber,
      },
      {
        id: "recent-page",
        label: "Páginas",
        icon: ObjectPageIcon,
        iconClassName: objectIconToneBadgeClass.blue,
      },
      {
        id: "recent-citations",
        label: "Citações",
        icon: ObjectQuoteIcon,
        iconClassName: objectIconToneBadgeClass.rose,
      },
    ],
    [],
  );

  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  const filtered = normalized
    ? recentItems.filter((item) =>
        item.label.toLocaleLowerCase("pt-BR").includes(normalized),
      )
    : recentItems;

  function openRecent(item: (typeof recentItems)[number]) {
    const tab: AppHeaderTab = {
      id: item.id,
      label: item.label,
      icon: item.icon,
      iconClassName: item.iconClassName,
      draggable: true,
    };

    setSideTabs((current) => {
      if (current.some((entry) => entry.id === tab.id)) return current;
      return [...current, tab];
    });
    setSideValue(tab.id);
    setSideSearchOpen(false);
  }

  return (
    <div
      data-slot="side-panel-search-overlay"
      className="fixed inset-0 z-[120] flex items-start justify-center bg-black/50 px-4 pt-[10vh]"
      onMouseDown={() => setSideSearchOpen(false)}
    >
      <div
        className="w-full max-w-[50rem] overflow-hidden rounded-xl border border-black/10 bg-white text-[#282522] shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex h-[58px] items-center gap-3 border-b border-black/10 px-4">
          <span className="text-xl">⌕</span>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por conteúdo e ações, ou colar da área de transferência"
            className="min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-[#9a9692]"
          />
          <span className="text-sm text-[#6b6661]">ⓘ</span>
          <span className="text-sm text-[#6b6661]">↗</span>
        </div>

        <div className="px-4 pt-2">
          <span className="inline-flex h-6 items-center rounded-md bg-[#f1efed] px-2 text-xs text-[#595550]">
            ▣ Abrir no painel lateral
          </span>
        </div>

        <div className="max-h-[520px] overflow-y-auto px-4 pb-4 pt-4">
          <div className="mb-3 text-[15px] text-[#595550]">
            Recentemente abertos
          </div>
          <div className="mb-2 text-xs text-[#837d76]">Ontem</div>

          <div className="space-y-0.5">
            {filtered.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "flex h-11 w-full items-center gap-3 rounded-lg px-1.5 text-left text-[15px]",
                    index === 0 && !normalized
                      ? "bg-[#f2f0ee]"
                      : "hover:bg-[#f2f0ee]",
                  )}
                  onClick={() => openRecent(item)}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-md",
                      item.iconClassName,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span
                    className={cn(
                      "rounded-md border border-current/50 px-2 py-1 text-xs",
                      item.iconClassName,
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mb-2 mt-5 text-[15px] text-[#595550]">
            Todas as ações
          </div>
          {[
            "Abrir calendário",
            "Abrir hoje",
            "Abrir configurações",
            "Abrir visualização em gráfico",
            "Abrir objetos internos",
            "Abrir conteúdo relacionado",
            "Alternar modo de foco",
          ].map((label) => (
            <div
              key={label}
              className="flex h-11 items-center gap-3 px-1.5 text-[15px]"
            >
              <span className="flex size-6 items-center justify-center rounded-md border border-black/10 text-[#837d76]">
                ◇
              </span>
              <span className="flex-1">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex h-8 items-center border-t border-black/10 px-3 text-xs text-[#595550]">
          ↑↓ para navegar　 Esc para abortar　 ↵ para selecionar　 ⌘↵ / Ctrl↵ em
          nova aba　 ⇧↵ no painel lateral
        </div>
      </div>
    </div>
  );
}

function TabPreview({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{eyebrow}</span>
      <span className="font-medium text-foreground">{title}</span>
      <span className="text-sm leading-5 text-muted-foreground">
        Preview content for {title}.
      </span>
    </div>
  );
}

export {
  type WorkspaceCreatedEntity,
  WorkspaceMainHeader,
  WorkspaceProvider,
  WorkspaceSidePanelHeader,
  useWorkspace,
};
