"use client"

import * as React from "react"

import {
  AppHeaderCaretDownIcon,
  AppHeaderGraphIcon,
  AppHeaderPlusIcon,
  AppHeaderSidebarSimpleIcon,
} from "@/components/app-header-icons"
import {
  AppHeaderTabItem,
  type AppHeaderTab,
} from "@/components/app-header-tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const SIDE_TAB_MAX_WIDTH = 160
const SIDE_TAB_MIN_WIDTH = 44
const SIDE_TAB_GAP = 4
const SIDE_TAB_CONTROLS_WIDTH = 28

const sideHeaderTheme = {
  "--side-header-bg-base": "#ffffff",
  "--side-header-bg-back": "#f8f7f5",
  "--side-header-bg-back-hover": "#eeece9",
  "--side-header-bg-front-hover": "#efeeec",
  "--side-header-border-front": "rgba(36, 32, 28, 0.12)",
  "--side-header-text-primary": "#282522",
  "--side-header-text-secondary": "#595550",
  "--side-header-text-subtle": "#837d76",
} as React.CSSProperties

type SidePanelSpecialEntryId =
  | "graphView"
  | "backlinks"
  | "objectsInside"
  | "relatedContent"
  | "aiAssistantChat"
  | "localSpaceQuery"

type AppSidePanelHeaderProps = React.ComponentProps<"header"> & {
  tabs: AppHeaderTab[]
  value: string
  onValueChange: (value: string) => void
  onTabsChange: (tabs: AppHeaderTab[]) => void
  onCreate?: () => void
  onHide?: () => void
  onSpecialEntrySelect?: (entryId: SidePanelSpecialEntryId) => void
  onCloseRequest?: (tab: AppHeaderTab) => boolean | void
  createLabel?: string
  tabListLabel?: string
  hideLabel?: string
  menuLabel?: string
  closeLabel?: string
}

type SideSpecialItem = {
  id: SidePanelSpecialEntryId
  label: string
  icon: React.ElementType
}

function PhosphorIcon({
  children,
  ...props
}: React.SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      aria-hidden="true"
      role="img"
      {...props}
    >
      {children}
    </svg>
  )
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <PhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M240 88.23a54.43 54.43 0 0 1-16 37L189.25 160a54.27 54.27 0 0 1-38.63 16h-.05A54.63 54.63 0 0 1 96 119.84a8 8 0 0 1 16 .45A38.62 38.62 0 0 0 150.58 160h.04a38.39 38.39 0 0 0 27.31-11.31l34.75-34.75a38.63 38.63 0 0 0-54.63-54.63l-11 11A8 8 0 0 1 135.7 59l11-11A54.65 54.65 0 0 1 224 48a54.86 54.86 0 0 1 16 40.23ZM109 185.66l-11 11A38.41 38.41 0 0 1 70.6 208h-.04a38.63 38.63 0 0 1-27.29-65.94L78 107.31A38.63 38.63 0 0 1 144 135.71a8 8 0 0 0 16 .45A54.86 54.86 0 0 0 144 96a54.65 54.65 0 0 0-77.27 0L32 130.75A54.62 54.62 0 0 0 70.56 224h.04a54.28 54.28 0 0 0 38.64-16l11-11A8 8 0 0 0 109 185.66Z"
      />
    </PhosphorIcon>
  )
}

function CubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <PhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M223.68 66.15 135.68 18a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03ZM128 32l80.34 44L128 120 47.66 76ZM40 90l80 43.78v85.79l-80-43.75Zm96 129.57v-85.75L216 90v85.78Z"
      />
    </PhosphorIcon>
  )
}

function RelatedContentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <PhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M172 76a44 44 0 1 0-44 44 44.05 44.05 0 0 0 44-44Zm-44 28a28 28 0 1 1 28-28 28 28 0 0 1-28 28Zm60 24a44 44 0 1 0 44 44 44.05 44.05 0 0 0-44-44Zm0 72a28 28 0 1 1 28-28 28 28 0 0 1-28 28ZM68 128a44 44 0 1 0 44 44 44.05 44.05 0 0 0-44-44Zm0 72a28 28 0 1 1 28-28 28 28 0 0 1-28 28Z"
      />
    </PhosphorIcon>
  )
}

function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <PhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="M140 128a12 12 0 1 1-12-12 12 12 0 0 1 12 12Zm-56-12a12 12 0 1 0 12 12 12 12 0 0 0-12-12Zm88 0a12 12 0 1 0 12 12 12 12 0 0 0-12-12Zm60 12A104 104 0 0 1 79.12 219.82l-34.05 11.35a16 16 0 0 1-20.24-20.24l11.35-34.05A104 104 0 1 1 232 128Zm-16 0A88 88 0 1 0 51.81 172.06a8 8 0 0 1 .66 6.54L40 216l37.4-12.47a7.85 7.85 0 0 1 2.53-.42 8 8 0 0 1 4 1.08A88 88 0 0 0 216 128Z"
      />
    </PhosphorIcon>
  )
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <PhosphorIcon {...props}>
      <path
        fill="currentColor"
        d="m229.66 218.34-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32ZM40 112a72 72 0 1 1 72 72 72.08 72.08 0 0 1-72-72Z"
      />
    </PhosphorIcon>
  )
}

const defaultSpecialItems: SideSpecialItem[] = [
  { id: "graphView", label: "Visualização em grafo", icon: AppHeaderGraphIcon },
  { id: "backlinks", label: "Links de entrada", icon: LinkIcon },
  { id: "objectsInside", label: "Objetos internos", icon: CubeIcon },
  { id: "relatedContent", label: "Conteúdo relacionado", icon: RelatedContentIcon },
  { id: "aiAssistantChat", label: "Chat de IA", icon: ChatIcon },
  { id: "localSpaceQuery", label: "Buscar", icon: SearchIcon },
]

function useElementWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => setWidth(element.getBoundingClientRect().width)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}

function moveTab(tabs: AppHeaderTab[], sourceId: string, targetId: string) {
  if (sourceId === targetId) return tabs

  const sourceIndex = tabs.findIndex((tab) => tab.id === sourceId)
  const targetIndex = tabs.findIndex((tab) => tab.id === targetId)
  if (sourceIndex < 0 || targetIndex < 0) return tabs

  const next = [...tabs]
  const [moving] = next.splice(sourceIndex, 1)
  if (!moving) return tabs

  const nextTargetIndex = next.findIndex((tab) => tab.id === targetId)
  next.splice(Math.max(0, nextTargetIndex), 0, moving)
  return next
}

function SideHeaderAction({
  label,
  placement = "bottom",
  width = 28,
  className,
  children,
  onClick,
}: {
  label: string
  placement?: "bottom" | "left"
  width?: number
  className?: string
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
  const button = (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "relative flex h-7 shrink-0 items-center justify-center rounded-lg border border-transparent bg-transparent",
        "text-sm text-[var(--side-header-text-secondary)] transition-[opacity] duration-200 ease-out",
        "hover:bg-[var(--side-header-bg-front-hover)] hover:text-[var(--side-header-text-primary)]",
        "active:z-20 active:brightness-[0.97] focus:outline-none",
        className
      )}
      style={{ width }}
      onClick={onClick}
    >
      <span className="inline-flex size-4 items-center justify-center [&>svg]:size-full">
        {children}
      </span>
    </button>
  )

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent
        side={placement}
        sideOffset={8}
        className="rounded-lg border border-[var(--side-header-border-front)] bg-white/95 px-2 py-1.5 text-xs text-[var(--side-header-text-primary)] shadow-md backdrop-blur"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function SideTabList({
  tabs,
  value,
  show,
  onValueChange,
  onClose,
}: {
  tabs: AppHeaderTab[]
  value: string
  show: boolean
  onValueChange: (value: string) => void
  onClose: (tab: AppHeaderTab) => void
}) {
  if (!show) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Lista de abas laterais"
            className="flex size-7 items-center justify-center rounded-lg text-[var(--side-header-text-secondary)] hover:bg-[var(--side-header-bg-front-hover)] hover:text-[var(--side-header-text-primary)]"
          >
            <AppHeaderCaretDownIcon className="size-3.5" />
          </button>
        }
      />
      <DropdownMenuContent side="bottom" align="end" sideOffset={6} className="w-60">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <DropdownMenuItem
              key={tab.id}
              className={cn("group/tab-list h-9 gap-2", tab.id === value && "bg-accent")}
              onClick={() => onValueChange(tab.id)}
            >
              {Icon && (
                <span className={cn("inline-flex size-[1.3em] items-center justify-center rounded-[0.33em]", tab.iconClassName)}>
                  <Icon className="size-[0.94em]" />
                </span>
              )}
              <span className="min-w-0 flex-1 truncate">{tab.label}</span>
              {tabs.length > 1 && (
                <button
                  type="button"
                  aria-label={`Fechar ${tab.label}`}
                  className="flex size-6 items-center justify-center rounded-md opacity-0 group-hover/tab-list:opacity-100 hover:bg-background"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onClose(tab)
                  }}
                >
                  ×
                </button>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppSidePanelHeader({
  tabs,
  value,
  onValueChange,
  onTabsChange,
  onCreate,
  onHide,
  onSpecialEntrySelect,
  onCloseRequest,
  createLabel = "Nova aba lateral",
  hideLabel = "Ocultar painel lateral",
  menuLabel = "Abrir menu do painel lateral",
  closeLabel = "Fechar aba",
  className,
  style,
  ...props
}: AppSidePanelHeaderProps) {
  const [tabsRef, width] = useElementWidth<HTMLDivElement>()
  const [draggingId, setDraggingId] = React.useState<string | null>(null)

  const layout = React.useMemo(() => {
    const count = tabs.length
    if (!count || width <= 0) {
      return { tabWidth: SIDE_TAB_MAX_WIDTH, cramped: false }
    }

    const gaps = Math.max(0, count - 1) * SIDE_TAB_GAP
    const available = width - gaps
    const rawWidth = Math.max(
      1,
      Math.floor(Math.min(SIDE_TAB_MAX_WIDTH, available / count))
    )
    const cramped = rawWidth < SIDE_TAB_MIN_WIDTH
    const crampedAvailable = Math.max(
      1,
      width - SIDE_TAB_CONTROLS_WIDTH - gaps
    )

    return {
      tabWidth: cramped
        ? Math.max(1, Math.floor(crampedAvailable / count))
        : rawWidth,
      cramped,
    }
  }, [tabs.length, width])

  function closeTab(tab: AppHeaderTab) {
    if (tabs.length <= 1) return
    if (onCloseRequest?.(tab) === false) return

    const index = tabs.findIndex((item) => item.id === tab.id)
    const next = tabs.filter((item) => item.id !== tab.id)
    onTabsChange(next)

    if (value === tab.id) {
      const fallback = next[index] ?? next[index - 1] ?? next[0]
      if (fallback) onValueChange(fallback.id)
    }
  }

  return (
    <header
      data-slot="app-side-panel-header"
      className={cn(
        "flex h-[46px] w-full shrink-0 items-center justify-between bg-[var(--side-header-bg-back)] px-1",
        className
      )}
      style={{ ...sideHeaderTheme, ...style }}
      {...props}
    >
      <div className="flex min-w-0 grow flex-col items-center justify-center gap-1">
        <div className="grid w-full grid-cols-[minmax(0,1fr)_fit-content(100%)] items-center gap-1">
          <div className="relative flex min-w-0 w-full items-center justify-start">
            <div
              ref={tabsRef}
              className="flex w-full min-w-0 items-center overflow-hidden"
              style={{ gap: SIDE_TAB_GAP }}
            >
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  draggable={tab.draggable !== false}
                  data-dnd-type="draggable"
                  data-dnd-item={tab.id}
                  data-sidepanel-tab-active={tab.id === value || undefined}
                  className={cn(
                    "relative min-w-0 outline-none ring-0",
                    tabs.length > 1 && "shrink-0"
                  )}
                  style={
                    tabs.length === 1
                      ? { maxWidth: 400, transition: "width 150ms ease-out" }
                      : { width: layout.tabWidth, transition: "width 150ms ease-out" }
                  }
                  onDragStart={(event) => {
                    if (tab.draggable === false) {
                      event.preventDefault()
                      return
                    }
                    event.dataTransfer.effectAllowed = "move"
                    event.dataTransfer.setData("text/plain", tab.id)
                    setDraggingId(tab.id)
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault()
                    const sourceId = event.dataTransfer.getData("text/plain")
                    if (sourceId && sourceId !== tab.id) {
                      onTabsChange(moveTab(tabs, sourceId, tab.id))
                    }
                    setDraggingId(null)
                  }}
                  onDragEnd={() => setDraggingId(null)}
                >
                  <AppHeaderTabItem
                    tab={tab}
                    active={tab.id === value}
                    neutral={tabs.length === 1}
                    fitContent={tabs.length === 1}
                    closable={tabs.length > 1}
                    dragging={draggingId === tab.id}
                    actionLabels={{ close: closeLabel }}
                    onOpen={() => onValueChange(tab.id)}
                    onClose={() => closeTab(tab)}
                  />
                </div>
              ))}
            </div>
          </div>

          {tabs.length > 0 && (
            <div data-slot="app-side-panel-tab-controls" className="flex shrink-0 items-center gap-1">
              <SideTabList
                tabs={tabs}
                value={value}
                show={layout.cramped && tabs.length > 1}
                onValueChange={onValueChange}
                onClose={closeTab}
              />
              <SideHeaderAction
                label={createLabel}
                placement="left"
                onClick={onCreate}
              >
                <AppHeaderPlusIcon />
              </SideHeaderAction>
            </div>
          )}
        </div>
      </div>

      <div data-slot="app-side-panel-shell-controls" className="ml-1 flex shrink-0 items-center gap-x-1">
        <div className="flex items-center">
          <SideHeaderAction
            label={hideLabel}
            className="rounded-r-none border-r-0"
            onClick={onHide}
          >
            <AppHeaderSidebarSimpleIcon className="rotate-180" />
          </SideHeaderAction>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label={menuLabel}
                  className="relative -ml-px flex h-7 w-4 shrink-0 items-center justify-center rounded-l-none rounded-r-lg border border-transparent bg-transparent text-[9px] text-[var(--side-header-text-secondary)] hover:bg-[var(--side-header-bg-front-hover)] hover:text-[var(--side-header-text-primary)] active:z-20 active:brightness-[0.97] focus:outline-none"
                >
                  <AppHeaderCaretDownIcon className="size-2.5" />
                </button>
              }
            />
            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={6}
              className="w-64 rounded-xl p-1.5"
            >
              {defaultSpecialItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem
                    key={item.id}
                    className="h-10 gap-3 rounded-lg px-2.5 text-sm"
                    onClick={() => onSpecialEntrySelect?.(item.id)}
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export {
  AppSidePanelHeader,
  type AppSidePanelHeaderProps,
  type SidePanelSpecialEntryId,
}
