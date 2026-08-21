"use client"

import * as React from "react"

import { AppFocusModeControls, AppHeader } from "@/components/app-header"
import {
  AppHeaderBookOpenIcon,
  AppHeaderCompassIcon,
  AppHeaderFileIcon,
  AppHeaderFolderIcon,
  AppHeaderGraphIcon,
  AppHeaderLightbulbIcon,
} from "@/components/app-header-icons"
import {
  AppSidePanelHeader,
  AppSpaceHeader,
  type AppHeaderTab,
} from "@/components/app-header-tabs"
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
    id: "graph-view",
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

type AppHeaderDemoContextValue = {
  mainTabs: AppHeaderTab[]
  mainValue: string
  sideTabs: AppHeaderTab[]
  sideValue: string
  focusMode: boolean
  message: string | null
  setMainTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>
  setMainValue: React.Dispatch<React.SetStateAction<string>>
  setSideTabs: React.Dispatch<React.SetStateAction<AppHeaderTab[]>>
  setSideValue: React.Dispatch<React.SetStateAction<string>>
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>
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
      message,
      setMainTabs,
      setMainValue,
      setSideTabs,
      setSideValue,
      setFocusMode,
      showMessage,
    }),
    [focusMode, mainTabs, mainValue, message, showMessage, sideTabs, sideValue]
  )

  return (
    <TooltipProvider delay={200}>
      <AppHeaderDemoContext.Provider value={value}>
        {children}
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
    showMessage(`Opened ${tab.label} in the side panel`)
  }

  return (
    <AppHeader
      onBack={() => showMessage("Back")}
      onForward={() => showMessage("Forward")}
      onFocus={() => setFocusMode(true)}
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
    showMessage,
  } = useAppHeaderDemo()

  if (focusMode) return null

  function createSideTab() {
    const explore = sideTabs.find((tab) => tab.id === "explore")

    if (explore) {
      setSideValue(explore.id)
      showMessage("Explore is already open")
      return
    }

    const nextExplore = initialSideTabs.find((tab) => tab.id === "explore")
    if (!nextExplore) return

    setSideTabs((current) => [...current, nextExplore])
    setSideValue(nextExplore.id)
  }

  return (
    <AppSidePanelHeader
      tabs={sideTabs}
      value={sideValue}
      onValueChange={setSideValue}
      onTabsChange={setSideTabs}
      onCreate={createSideTab}
      onMenu={() => showMessage("Side-panel options")}
    />
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
