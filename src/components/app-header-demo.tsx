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
import { useAppShell } from "@/components/app-shell";
import { AppSidebarSearchIcon } from "@/components/app-sidebar-icons";
import {
  ObjectAiChatIcon,
  ObjectAreaIcon,
  ObjectAtomicNoteIcon,
  ObjectPageIcon,
  ObjectQueryIcon,
  ObjectQuoteIcon,
} from "@/components/object-icons";
import {
  AppSidePanelHeader,
  type SidePanelSpecialEntryId,
} from "@/components/app-side-panel-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const initialMainTabs: AppHeaderTab[] = [
  {
    id: "atomic-notes",
    label: "Notas atômicas",
    icon: ObjectAtomicNoteIcon,
    iconClassName: "bg-[#fff0d6] text-[#b96b0e]",
    preview: <TabPreview eyebrow="Tipo de objeto" title="Notas atômicas" />,
  },
];

const initialSideTabs: AppHeaderTab[] = [
  {
    id: "explore",
    label: "Explorar",
    icon: AppHeaderCompassIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
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
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  backlinks: {
    label: "Links de entrada",
    icon: ObjectPageIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  objectsInside: {
    label: "Objetos internos",
    icon: ObjectAreaIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  relatedContent: {
    label: "Conteúdo relacionado",
    icon: AppHeaderGraphIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  aiAssistantChat: {
    label: "Chat de IA",
    icon: ObjectAiChatIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  localSpaceQuery: {
    label: "Buscar",
    icon: ObjectQueryIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
};

type AppHeaderDemoContextValue = {
  mainTabs: AppHeaderTab[];
  mainValue: string;
  sideTabs: AppHeaderTab[];
  sideValue: string;
  focusMode: boolean;
  sideSearchOpen: boolean;
  mainSearchOpen: boolean;
  message: string | null;
  setMainTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>;
  setMainValue: React.Dispatch<React.SetStateAction<string>>;
  setSideTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>;
  setSideValue: React.Dispatch<React.SetStateAction<string>>;
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSideSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMainSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showMessage: (message: string) => void;
};

const AppHeaderDemoContext =
  React.createContext<AppHeaderDemoContextValue | null>(null);

function useAppHeaderDemo() {
  const context = React.useContext(AppHeaderDemoContext);

  if (!context) {
    throw new Error(
      "useAppHeaderDemo must be used within AppHeaderDemoProvider.",
    );
  }

  return context;
}

function AppHeaderDemoProvider({ children }: { children: React.ReactNode }) {
  const [mainTabs, setMainTabs] = React.useState(initialMainTabs);
  const [mainValue, setMainValue] = React.useState("atomic-notes");
  const [sideTabs, setSideTabs] = React.useState(initialSideTabs);
  const [sideValue, setSideValue] = React.useState("explore");
  const [focusMode, setFocusMode] = React.useState(false);
  const [sideSearchOpen, setSideSearchOpen] = React.useState(false);
  const [mainSearchOpen, setMainSearchOpen] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const messageTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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

  const value = React.useMemo<AppHeaderDemoContextValue>(
    () => ({
      mainTabs,
      mainValue,
      sideTabs,
      sideValue,
      focusMode,
      sideSearchOpen,
      mainSearchOpen,
      message,
      setMainTabs,
      setMainValue,
      setSideTabs,
      setSideValue,
      setFocusMode,
      setSideSearchOpen,
      setMainSearchOpen,
      showMessage,
    }),
    [
      focusMode,
      mainTabs,
      mainValue,
      message,
      showMessage,
      sideSearchOpen,
      mainSearchOpen,
      sideTabs,
      sideValue,
    ],
  );

  return (
    <TooltipProvider delay={200}>
      <AppHeaderDemoContext.Provider value={value}>
        {children}
        {sideSearchOpen && <SidePanelSearchOverlay />}
        {mainSearchOpen && <MainTabSearchOverlay />}
        {message && (
          <div
            data-slot="app-header-demo-message"
            role="status"
            className="pointer-events-none fixed left-1/2 top-14 z-[100] -translate-x-1/2 rounded-lg border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
          >
            {message}
          </div>
        )}
      </AppHeaderDemoContext.Provider>
    </TooltipProvider>
  );
}

function AppHeaderDemoMain() {
  const {
    mainTabs,
    mainValue,
    focusMode,
    setMainTabs,
    setMainValue,
    setFocusMode,
    setSideTabs,
    setSideValue,
    setMainSearchOpen,
    showMessage,
  } = useAppHeaderDemo();
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
      iconClassName: "bg-[#e8f0ff] text-[#3f6fce]",
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

  function openInSidePanel(tab: AppHeaderTab) {
    setSideTabs((current) => {
      if (current.some((item) => item.id === tab.id)) return current;
      return [...current, { ...tab, pinned: undefined, draggable: true }];
    });
    setSideValue(tab.id);
    if (rightCollapsed) toggleRight();
    showMessage(`Opened ${tab.label} in the side panel`);
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
        onShiftOpen={openInSidePanel}
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
  } = useAppHeaderDemo();
  const [query, setQuery] = React.useState("");

  const options = [
    { id: "atomic-notes", label: "Notas atômicas", icon: ObjectAtomicNoteIcon },
    { id: "page-1", label: "aaaaaaaaaaaaa", icon: ObjectPageIcon },
    { id: "pages", label: "Páginas", icon: ObjectPageIcon },
    { id: "quotes", label: "Citações", icon: ObjectQuoteIcon },
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
    setMainValue(next[0]?.id ?? "atomic-notes");
    setMainSearchOpen(false);
  }

  function select(option: (typeof options)[number]) {
    const selected: AppHeaderTab = {
      id: option.id,
      label: option.label,
      icon: option.icon,
      iconClassName:
        option.id === "atomic-notes"
          ? "bg-[#fff0d6] text-[#b96b0e]"
          : "bg-[#e8f0ff] text-[#3f6fce]",
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
            return (
              <button
                key={option.id}
                type="button"
                className="flex h-10 w-full items-center gap-2 rounded-lg px-2 text-left text-sm hover:bg-muted"
                onClick={() => select(option)}
              >
                <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AppHeaderDemoSidePanel() {
  const {
    sideTabs,
    sideValue,
    focusMode,
    setSideTabs,
    setSideValue,
    setSideSearchOpen,
  } = useAppHeaderDemo();
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
  const { setSideSearchOpen, setSideTabs, setSideValue } = useAppHeaderDemo();
  const [query, setQuery] = React.useState("");

  const recentItems = React.useMemo(
    () => [
      {
        id: "recent-atomic-notes",
        label: "Notas atômicas",
        icon: ObjectAtomicNoteIcon,
        iconClassName: "bg-[#fff0d6] text-[#b96b0e]",
      },
      {
        id: "recent-pages",
        label: "Páginas",
        icon: ObjectPageIcon,
        iconClassName: "bg-[#e8f0ff] text-[#3f6fce]",
      },
      {
        id: "recent-citations",
        label: "Citações",
        icon: ObjectQuoteIcon,
        iconClassName: "bg-[#ffe8ed] text-[#d74b67]",
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
  AppHeaderDemoMain,
  AppHeaderDemoProvider,
  AppHeaderDemoSidePanel,
  useAppHeaderDemo,
};
