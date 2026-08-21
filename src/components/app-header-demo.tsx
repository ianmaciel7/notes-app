"use client"

import * as React from "react"

import {
  AppFocusModeControls,
  AppHeader,
  AppHeaderAction,
} from "@/components/app-header"
import {
  AppHeaderBookOpenIcon,
  AppHeaderCaretDownIcon,
  AppHeaderCompassIcon,
  AppHeaderFileIcon,
  AppHeaderFolderIcon,
  AppHeaderGraphIcon,
  AppHeaderLightbulbIcon,
  AppHeaderSidebarSimpleIcon,
} from "@/components/app-header-icons"
import {
  AppSidePanelHeader,
  type SidePanelSpecialEntryId,
} from "@/components/app-side-panel-header"
import {
  AppSpaceHeader,
  type AppHeaderTab,
} from "@/components/app-header-tabs"
import { useAppShell } from "@/components/app-shell"
import { TooltipProvider } from "@/components/ui/tooltip"

const initialMainTabs: AppHeaderTab[] = [
  {
    id: "cloud-monitoring",
    label: "Cloud Monitoring",
    icon: AppHeaderFolderIcon,
    iconClassName: "bg-[#fff0d6] text-[#b96b0e]",
    pinned: true,
    preview: <TabPreview eyebrow="Folder" title="Cloud Monitoring" />,
  },
  {
    id: "azure",
    label: "Azure",
    icon: AppHeaderFileIcon,
    iconClassName: "bg-[#e8f0ff] text-[#3f6fce]",
    preview: <TabPreview eyebrow="Page" title="Azure" />,
  },
  {
    id: "courses",
    label: "Cursos",
    icon: AppHeaderBookOpenIcon,
    iconClassName: "bg-[#e7f4e9] text-[#39774b]",
    preview: <TabPreview eyebrow="Collection" title="Cursos" />,
  },
  {
    id: "ideas-one",
    label: "Ideias",
    icon: AppHeaderLightbulbIcon,
    iconClassName: "bg-[#fff5d6] text-[#927019]",
    preview: <TabPreview eyebrow="Page" title="Ideias" />,
  },
  {
    id: "ideas-two",
    label: "Ideias",
    icon: AppHeaderLightbulbIcon,
    iconClassName: "bg-[#fff5d6] text-[#927019]",
    preview: <TabPreview eyebrow="Page" title="Ideias" />,
  },
]

const initialSideTabs: AppHeaderTab[] = [
  {
    id: "graphView",
    label: "Visualização em grafo",
    icon: AppHeaderGraphIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  {
    id: "explore",
    label: "Explorar",
    icon: AppHeaderCompassIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
    draggable: false,
  },
]

const specialSideTabs: Record<SidePanelSpecialEntryId, Omit<AppHeaderTab, "id">> = {
  graphView: {
    label: "Visualização em grafo",
    icon: AppHeaderGraphIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  backlinks: {
    label: "Links de entrada",
    icon: AppHeaderFileIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  objectsInside: {
    label: "Objetos internos",
    icon: AppHeaderFolderIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  relatedContent: {
    label: "Conteúdo relacionado",
    icon: AppHeaderGraphIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  aiAssistantChat: {
    label: "Chat de IA",
    icon: AppHeaderFileIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
  localSpaceQuery: {
    label: "Buscar",
    icon: AppHeaderFileIcon,
    iconClassName: "bg-[#ebeae8] text-[#68635e]",
  },
}

type AppHeaderDemoContextValue = {
  mainTabs: AppHeaderTab[]
  mainValue: string
  sideTabs: AppHeaderTab[]
  sideValue: string
  focusMode: boolean
  sideSearchOpen: boolean
  message: string | null
  setMainTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>
  setMainValue: React.Dispatch<React.SetStateAction<string>>
  setSideTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>
  setSideValue: React.Dispatch<React.SetStateAction<string>>
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>
  setSideSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
  showMessage: (message: string) => void
}

const AppHeaderDemoContext = React.createContext<AppHeaderDemoContextValue | null>(null)

function useAppHeaderDemo() {
  const context = React.useContext(AppHeaderDemoContext)

  if (!context) {
    throw new Error("useAppHeaderDemo must be used within AppHeaderDemoProvider.")
  }

  return context
}

function AppHeaderDemoProvider({ children }: { children: React.ReactNode }) {
  const [mainTabs, setMainTabs] = React.useState(initialMainTabs)
  const [mainValue, setMainValue] = React.useState("ideas-two")
  const [sideTabs, setSideTabs] = React.useState(initialSideTabs)
  const [sideValue, setSideValue] = React.useState("explore")
  const [focusMode, setFocusMode] = React.useState(false)
  const [sideSearchOpen, setSideSearchOpen] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const messageTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const showMessage = React.useCallback((nextMessage: string) => {
    setMessage(nextMessage)

    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    messageTimerRef.current = setTimeout(() => {
      messageTimerRef.current = null
      setMessage(null)
    }, 2200)
  }, [])

  React.useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    }
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLocaleLowerCase() === "m"
      ) {
        event.preventDefault()
        setFocusMode((current) => !current)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const value = React.useMemo<AppHeaderDemoContextValue>(
    () => ({
      mainTabs,
      mainValue,
      sideTabs,
      sideValue,
      focusMode,
      sideSearchOpen,
      message,
      setMainTabs,
      setMainValue,
      setSideTabs,
      setSideValue,
      setFocusMode,
      setSideSearchOpen,
      showMessage,
    }),
    [
      focusMode,
      mainTabs,
      mainValue,
      message,
      showMessage,
      sideSearchOpen,
      sideTabs,
      sideValue,
    ]
  )

  return (
    <TooltipProvider delay={200}>
      <AppHeaderDemoContext.Provider value={value}>
        {children}
        {sideSearchOpen && <SidePanelSearchOverlay />}
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
  )
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
    showMessage,
  } = useAppHeaderDemo()
  const { rightCollapsed, toggleRight } = useAppShell()
  const createIndexRef = React.useRef(1)

  if (focusMode) {
    return (
      <AppFocusModeControls
        onBack={() => showMessage("Back")}
        onForward={() => showMessage("Forward")}
        onExit={() => setFocusMode(false)}
      />
    )
  }

  function createTab() {
    const index = createIndexRef.current++
    const id = `new-page-${index}`
    const label = index === 1 ? "Nova página" : `Nova página ${index}`
    const tab: AppHeaderTab = {
      id,
      label,
      icon: AppHeaderFileIcon,
      iconClassName: "bg-[#e8f0ff] text-[#3f6fce]",
      preview: <TabPreview eyebrow="Page" title={label} />,
    }

    setMainTabs((current) => [...current, tab])
    setMainValue(id)
  }

  function openInSidePanel(tab: AppHeaderTab) {
    setSideTabs((current) => {
      if (current.some((item) => item.id === tab.id)) return current
      return [...current, { ...tab, pinned: undefined, draggable: true }]
    })
    setSideValue(tab.id)
    if (rightCollapsed) toggleRight()
    showMessage(`Opened ${tab.label} in the side panel`)
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
        onShiftOpen={openInSidePanel}
        onCloseRequest={(tab) => {
          if (!tab.pinned) return true
          showMessage("Pinned tabs cannot be closed. Unpin the tab first.")
          return false
        }}
      />
    </AppHeader>
  )
}

function AppHeaderDemoSidePanel() {
  const {
    sideTabs,
    sideValue,
    focusMode,
    setSideTabs,
    setSideValue,
    setSideSearchOpen,
  } = useAppHeaderDemo()
  const { toggleRight } = useAppShell()

  if (focusMode) return null

  function openSpecialEntry(entryId: SidePanelSpecialEntryId) {
    if (entryId === "localSpaceQuery") {
      setSideSearchOpen(true)
      return
    }

    const existing = sideTabs.find((tab) => {
      if (entryId === "aiAssistantChat") return tab.id.startsWith("aiAssistantChat_")
      return tab.id === entryId
    })

    if (existing) {
      setSideValue(existing.id)
      return
    }

    const descriptor = specialSideTabs[entryId]
    const id = entryId === "aiAssistantChat" ? `aiAssistantChat_${Date.now()}` : entryId
    const next: AppHeaderTab = {
      id,
      ...descriptor,
      draggable: true,
    }

    setSideTabs((current) => [...current, next])
    setSideValue(id)
  }

  function createSideTab() {
    const explore = sideTabs.find((tab) => tab.id === "explore")

    if (!explore) {
      const nextExplore = initialSideTabs.find((tab) => tab.id === "explore")
      if (!nextExplore) return

      setSideTabs((current) => [...current, nextExplore])
      setSideValue(nextExplore.id)
      return
    }

    if (sideValue === explore.id) {
      setSideSearchOpen(true)
      return
    }

    setSideValue(explore.id)
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
  )
}

function SidePanelSearchOverlay() {
  const { setSideSearchOpen, setSideTabs, setSideValue } = useAppHeaderDemo()
  const [query, setQuery] = React.useState("")

  const recentItems = React.useMemo(
    () => [
      {
        id: "recent-atomic-notes",
        label: "Notas atômicas",
        icon: AppHeaderFolderIcon,
        iconClassName: "bg-[#fff0d6] text-[#b96b0e]",
      },
      {
        id: "recent-pages",
        label: "Páginas",
        icon: AppHeaderFileIcon,
        iconClassName: "bg-[#e8f0ff] text-[#3f6fce]",
      },
      {
        id: "recent-citations",
        label: "Citações",
        icon: AppHeaderFileIcon,
        iconClassName: "bg-[#ffe8ed] text-[#d74b67]",
      },
    ],
    []
  )

  const normalized = query.trim().toLocaleLowerCase("pt-BR")
  const filtered = normalized
    ? recentItems.filter((item) =>
        item.label.toLocaleLowerCase("pt-BR").includes(normalized)
      )
    : recentItems

  function openRecent(item: (typeof recentItems)[number]) {
    const tab: AppHeaderTab = {
      id: item.id,
      label: item.label,
      icon: item.icon,
      iconClassName: item.iconClassName,
      draggable: true,
    }

    setSideTabs((current) => {
      if (current.some((entry) => entry.id === tab.id)) return current
      return [...current, tab]
    })
    setSideValue(tab.id)
    setSideSearchOpen(false)
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
          <div className="mb-3 text-[15px] text-[#595550]">Recentemente abertos</div>
          <div className="mb-2 text-xs text-[#837d76]">Ontem</div>

          <div className="space-y-0.5">
            {filtered.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "flex h-11 w-full items-center gap-3 rounded-lg px-1.5 text-left text-[15px]",
                    index === 0 && !normalized ? "bg-[#f2f0ee]" : "hover:bg-[#f2f0ee]"
                  )}
                  onClick={() => openRecent(item)}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-md",
                      item.iconClassName
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span
                    className={cn(
                      "rounded-md border border-current/50 px-2 py-1 text-xs",
                      item.iconClassName
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mb-2 mt-5 text-[15px] text-[#595550]">Todas as ações</div>
          {[
            "Abrir calendário",
            "Abrir hoje",
            "Abrir configurações",
            "Abrir visualização em gráfico",
            "Abrir objetos internos",
            "Abrir conteúdo relacionado",
            "Alternar modo de foco",
          ].map((label) => (
            <div key={label} className="flex h-11 items-center gap-3 px-1.5 text-[15px]">
              <span className="flex size-6 items-center justify-center rounded-md border border-black/10 text-[#837d76]">
                ◇
              </span>
              <span className="flex-1">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex h-8 items-center border-t border-black/10 px-3 text-xs text-[#595550]">
          ↑↓ para navegar　 Esc para abortar　 ↵ para selecionar　 ⌘↵ / Ctrl↵ em nova aba　 ⇧↵ no painel lateral
        </div>
      </div>
    </div>
  )
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
  )
}

export {
  AppHeaderDemoMain,
  AppHeaderDemoProvider,
  AppHeaderDemoSidePanel,
}
