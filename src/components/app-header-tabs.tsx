"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  GripVerticalIcon,
  PinIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const MAIN_TAB_MAX_WIDTH = 200
const MAIN_TAB_MIN_WIDTH = 60
const MAIN_TAB_GAP = 5
const SIDE_TAB_MAX_WIDTH = 160
const SIDE_TAB_MIN_WIDTH = 44
const SIDE_TAB_GAP = 4
const SIDE_TAB_CONTROLS_WIDTH = 28
const TAB_PREVIEW_DELAY = 200

const appHeaderTabTheme = {
  "--app-tab-bg-base": "oklch(1 0.0001 263.28)",
  "--app-tab-bg-back": "oklch(0.9856 0.0016 67)",
  "--app-tab-bg-back-hover": "oklch(0.9676 0.0016 67.02)",
  "--app-tab-bg-front": "oklch(1 0.0001 263.28)",
  "--app-tab-bg-front-hover": "oklch(0.9856 0.0016 67)",
  "--app-tab-border-front": "oklch(0.9163 0.0017 67.07)",
  "--app-tab-border-front-strong": "oklch(0.8643 0.0017 67.13)",
  "--app-tab-text-primary": "oklch(0.2191 0.0058 285.84)",
  "--app-tab-text-secondary": "oklch(0.3887 0.0052 301.05)",
  "--app-tab-text-subtle": "oklch(0.5725 0.0051 33.89)",
} as React.CSSProperties

type DropPosition = "before" | "after"

type HeaderTabLayout = {
  tabWidth: number
  cramped: boolean
  maxVisible: number
}

export type AppHeaderTab = {
  id: string
  label: string
  icon?: React.ElementType
  iconClassName?: string
  pinned?: boolean
  draggable?: boolean
  preview?: React.ReactNode
}

export type AppHeaderTabActionLabels = {
  pin: string
  unpin: string
  close: string
}

export type AppHeaderTabProps = React.ComponentProps<"div"> & {
  tab: AppHeaderTab
  active?: boolean
  neutral?: boolean
  fitContent?: boolean
  closable?: boolean
  pinnable?: boolean
  dragging?: boolean
  showSeparator?: boolean
  actionLabels?: Partial<AppHeaderTabActionLabels>
  onOpen?: () => void
  onShiftOpen?: () => void
  onClose?: () => void
  onTogglePin?: () => void
}

export type AppSpaceHeaderProps = React.ComponentProps<"div"> & {
  tabs: AppHeaderTab[]
  value: string
  onValueChange: (value: string) => void
  onTabsChange: (tabs: AppHeaderTab[]) => void
  onCreate?: () => void
  onShiftOpen?: (tab: AppHeaderTab) => void
  onCloseRequest?: (tab: AppHeaderTab) => boolean | void
  createLabel?: string
  tabListLabel?: string
  searchTabsPlaceholder?: string
  actionLabels?: Partial<AppHeaderTabActionLabels>
}

export type AppSidePanelHeaderProps = React.ComponentProps<"header"> & {
  tabs: AppHeaderTab[]
  value: string
  onValueChange: (value: string) => void
  onTabsChange: (tabs: AppHeaderTab[]) => void
  onCreate?: () => void
  onCloseRequest?: (tab: AppHeaderTab) => boolean | void
  onMenu?: () => void
  createLabel?: string
  tabListLabel?: string
  menuLabel?: string
  searchTabsPlaceholder?: string
  closeLabel?: string
}

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

function moveTab(
  tabs: AppHeaderTab[],
  sourceId: string,
  targetId: string,
  position: DropPosition
) {
  if (sourceId === targetId) return tabs

  const sourceIndex = tabs.findIndex((tab) => tab.id === sourceId)
  if (sourceIndex === -1) return tabs

  const next = [...tabs]
  const [moving] = next.splice(sourceIndex, 1)
  if (!moving) return tabs

  const targetIndex = next.findIndex((tab) => tab.id === targetId)
  if (targetIndex === -1) return tabs

  next.splice(targetIndex + (position === "after" ? 1 : 0), 0, moving)
  return next
}

function getMainLayout(width: number, count: number): HeaderTabLayout {
  if (!count || width <= 0) {
    return { tabWidth: MAIN_TAB_MAX_WIDTH, cramped: false, maxVisible: count }
  }

  const controlsWidth = 28 + MAIN_TAB_GAP
  const gaps = Math.max(0, count - 1) * MAIN_TAB_GAP
  const initialAvailable = width - controlsWidth - gaps
  const initialWidth =
    initialAvailable <= 0
      ? 1
      : Math.max(
          1,
          Math.floor(Math.min(MAIN_TAB_MAX_WIDTH, initialAvailable / count))
        )
  const cramped = initialWidth < MAIN_TAB_MAX_WIDTH - 1
  const available = cramped ? width - gaps : initialAvailable
  const tabWidth =
    available <= 0
      ? 1
      : Math.max(
          1,
          Math.floor(Math.min(MAIN_TAB_MAX_WIDTH, available / count))
        )

  if (tabWidth >= MAIN_TAB_MIN_WIDTH) {
    return { tabWidth, cramped, maxVisible: count }
  }

  return {
    tabWidth: MAIN_TAB_MIN_WIDTH,
    cramped: true,
    maxVisible: Math.min(
      count,
      Math.max(
        1,
        Math.floor((width + MAIN_TAB_GAP) / (MAIN_TAB_MIN_WIDTH + MAIN_TAB_GAP))
      )
    ),
  }
}

function getSideLayout(width: number, count: number): HeaderTabLayout {
  if (!count || width <= 0) {
    return { tabWidth: SIDE_TAB_MAX_WIDTH, cramped: false, maxVisible: count }
  }

  const gaps = Math.max(0, count - 1) * SIDE_TAB_GAP
  const available = width - gaps
  const rawWidth =
    available <= 0
      ? 1
      : Math.max(
          1,
          Math.floor(Math.min(SIDE_TAB_MAX_WIDTH, available / count))
        )
  const cramped = rawWidth < SIDE_TAB_MIN_WIDTH
  const crampedAvailable = width - SIDE_TAB_CONTROLS_WIDTH - gaps
  const tabWidth = cramped
    ? Math.max(1, Math.floor(Math.max(1, crampedAvailable) / count))
    : rawWidth

  return { tabWidth, cramped, maxVisible: count }
}

function getVisibleRange(tabs: AppHeaderTab[], value: string, maxVisible: number) {
  const count = tabs.length
  if (!count || maxVisible >= count) return { start: 0, end: count }

  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === value))
  let start = activeIndex >= maxVisible ? activeIndex - maxVisible + 1 : 0
  start = Math.min(start, Math.max(0, count - maxVisible))

  return { start, end: start + maxVisible }
}

function AppHeaderTabIcon({ tab }: { tab: AppHeaderTab }) {
  const Icon = tab.icon
  if (!Icon) return null

  return (
    <span
      data-slot="app-header-tab-icon"
      className={cn(
        "inline-flex min-h-[1.3em] min-w-[1.3em] shrink-0 grow-0 items-center justify-center rounded-[0.33em]",
        tab.iconClassName ?? "bg-[oklch(0.94_0.002_67)] text-[oklch(0.50_0.008_67)]"
      )}
    >
      <Icon className="min-h-[1.3em] min-w-[1.3em] rounded-[0.33em] p-[0.1em] text-[0.94em]" />
    </span>
  )
}

function AppHeaderTabAction({
  label,
  className,
  children,
  onClick,
}: {
  label: string
  className?: string
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <Button
      data-slot="app-header-tab-action"
      type="button"
      variant="ghost"
      aria-label={label}
      title={label}
      className={cn(
        "h-7 w-[18px] rounded-lg border border-transparent bg-transparent p-0 text-xs",
        "text-[var(--app-tab-text-subtle)] shadow-none transition-[opacity] duration-200 ease-out",
        "hover:bg-[var(--app-tab-bg-front-hover)] hover:text-[var(--app-tab-text-primary)]",
        "active:translate-y-0 active:brightness-[0.97] focus-visible:border-transparent focus-visible:ring-0",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function AppHeaderTabItem({
  tab,
  active = false,
  neutral = false,
  fitContent = false,
  closable = true,
  pinnable = false,
  dragging = false,
  showSeparator = false,
  actionLabels,
  onOpen,
  onShiftOpen,
  onClose,
  onTogglePin,
  className,
  onPointerEnter,
  onPointerLeave,
  ...props
}: AppHeaderTabProps) {
  const labels = {
    pin: "Pin tab",
    unpin: "Unpin tab",
    close: "Close tab",
    ...actionLabels,
  }
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const previewTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeVisual = active && !neutral
  const keepActionRegionVisible = Boolean(tab.pinned) || (active && closable)
  const actionBackground = activeVisual
    ? "bg-[var(--app-tab-bg-base)]"
    : neutral
      ? "bg-[var(--app-tab-bg-back)]"
      : "bg-[var(--app-tab-bg-back)] group-hover/tab:bg-[var(--app-tab-bg-back-hover)]"
  const actionGradient = activeVisual
    ? "to-[var(--app-tab-bg-base)]"
    : neutral
      ? "to-[var(--app-tab-bg-back)]"
      : "to-[var(--app-tab-bg-back)] group-hover/tab:to-[var(--app-tab-bg-back-hover)]"

  const clearPreviewTimer = React.useCallback(() => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current)
    previewTimerRef.current = null
  }, [])

  const closePreview = React.useCallback(() => {
    clearPreviewTimer()
    setPreviewOpen(false)
  }, [clearPreviewTimer])

  const schedulePreview = React.useCallback(() => {
    if (!tab.preview || active || dragging) return

    clearPreviewTimer()
    previewTimerRef.current = setTimeout(() => {
      previewTimerRef.current = null
      setPreviewOpen(true)
    }, TAB_PREVIEW_DELAY)
  }, [active, clearPreviewTimer, dragging, tab.preview])

  React.useEffect(() => () => clearPreviewTimer(), [clearPreviewTimer])

  const tabNode = (
    <div
      data-slot="app-header-tab"
      data-active={active || undefined}
      data-neutral={neutral || undefined}
      data-pinned={tab.pinned || undefined}
      className={cn(
        "group/tab pointer-events-auto relative min-w-0 max-w-full rounded-md",
        fitContent ? "inline-flex" : "w-full",
        className
      )}
      onPointerEnter={(event) => {
        schedulePreview()
        onPointerEnter?.(event)
      }}
      onPointerLeave={(event) => {
        closePreview()
        onPointerLeave?.(event)
      }}
      {...props}
    >
      <div className={cn("relative flex min-w-0 items-center", !fitContent && "w-full")}>
        <div
          role="tab"
          aria-selected={active}
          tabIndex={active ? 0 : -1}
          className={cn(
            "relative flex h-8 min-w-0 cursor-pointer select-none items-center gap-x-[0.3em] rounded-lg border-[0.5px] py-[3px] pl-[6px] pr-px text-[13px] leading-[1.3] outline-none ring-0 transition duration-150 ease-out",
            fitContent ? "w-auto" : "w-full",
            neutral && "border-transparent text-[var(--app-tab-text-primary)]",
            !neutral &&
              active &&
              "border-[var(--app-tab-border-front)] bg-[var(--app-tab-bg-base)] font-medium text-[var(--app-tab-text-primary)]",
            !neutral &&
              !active &&
              "border-transparent text-[var(--app-tab-text-subtle)] hover:bg-[var(--app-tab-bg-back-hover)] hover:text-[var(--app-tab-text-secondary)]",
            dragging && "cursor-grabbing opacity-40"
          )}
          onClick={(event) => {
            if (event.shiftKey) onShiftOpen?.()
            else onOpen?.()
          }}
          onDoubleClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            if (closable) onClose?.()
          }}
        >
          <AppHeaderTabIcon tab={tab} />
          <span className={cn("min-w-0 truncate text-left", !fitContent && "flex-1")}>
            {tab.label}
          </span>

          {!fitContent && (pinnable || closable) && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
              <div
                className={cn(
                  "flex h-full items-center transition-opacity duration-100 ease-out",
                  keepActionRegionVisible
                    ? "opacity-100"
                    : "opacity-0 group-hover/tab:opacity-100"
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none h-full w-5 bg-linear-to-r from-transparent",
                    actionGradient
                  )}
                />
                <div
                  className={cn(
                    "pointer-events-auto flex h-full items-center rounded-r-lg pr-[2px]",
                    actionBackground
                  )}
                >
                  {pinnable && onTogglePin && (
                    <AppHeaderTabAction
                      label={tab.pinned ? labels.unpin : labels.pin}
                      className={tab.pinned ? "flex" : "hidden group-hover/tab:flex"}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        onTogglePin()
                      }}
                    >
                      <PinIcon className={cn("size-3", tab.pinned && "fill-current")} />
                    </AppHeaderTabAction>
                  )}

                  {closable && onClose && (
                    <AppHeaderTabAction
                      label={labels.close}
                      className={active ? "flex" : "hidden group-hover/tab:flex"}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        onClose()
                      }}
                    >
                      <XIcon className="size-3" />
                    </AppHeaderTabAction>
                  )}
                </div>
              </div>
            </div>
          )}

          {fitContent && pinnable && onTogglePin && (
            <div className="flex h-full shrink-0 items-center pr-[2px]">
              <AppHeaderTabAction
                label={tab.pinned ? labels.unpin : labels.pin}
                className={cn(
                  "transition-opacity duration-100 ease-out",
                  tab.pinned
                    ? "opacity-100"
                    : "pointer-events-none opacity-0 group-hover/tab:pointer-events-auto group-hover/tab:opacity-100"
                )}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onTogglePin()
                }}
              >
                <PinIcon className={cn("size-3", tab.pinned && "fill-current")} />
              </AppHeaderTabAction>
            </div>
          )}
        </div>

        {showSeparator && (
          <div className="absolute right-0 top-1/2 h-[18px] w-[0.5px] -translate-y-1/2 rounded-full bg-[var(--app-tab-border-front)] group-hover/tab:opacity-0" />
        )}
      </div>
    </div>
  )

  if (!tab.preview || active || dragging) return tabNode

  return (
    <HoverCard open={previewOpen}>
      <HoverCardTrigger render={<span className="inline-flex min-w-0 max-w-full" />}>
        {tabNode}
      </HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        align="center"
        sideOffset={8}
        className="pointer-events-none w-64"
      >
        {tab.preview}
      </HoverCardContent>
    </HoverCard>
  )
}

function AppHeaderTabList({
  tabs,
  value,
  visible,
  label,
  searchPlaceholder,
  onValueChange,
  onClose,
}: {
  tabs: AppHeaderTab[]
  value: string
  visible: boolean
  label: string
  searchPlaceholder: string
  onValueChange: (value: string) => void
  onClose: (tab: AppHeaderTab) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [draggingId, setDraggingId] = React.useState<string | null>(null)

  if (!visible) return null

  const normalized = query.trim().toLocaleLowerCase()
  const filteredTabs = normalized
    ? tabs.filter((tab) => tab.label.toLocaleLowerCase().includes(normalized))
    : tabs

  return (
    <div data-slot="app-header-tab-list" className="relative shrink-0">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={label}
        aria-expanded={open}
        className="size-7 border-transparent bg-transparent text-[var(--app-tab-text-secondary)] shadow-none hover:bg-[var(--app-tab-bg-front-hover)] hover:text-[var(--app-tab-text-primary)] focus-visible:ring-0"
        onClick={() => setOpen((current) => !current)}
      >
        <ChevronDownIcon />
      </Button>

      {open && (
        <div className="absolute right-0 top-[34px] z-[80] w-64 rounded-lg border bg-popover p-2 shadow-xl">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="mb-2 h-8"
          />
          <div className="max-h-64 overflow-y-auto">
            {filteredTabs.map((tab) => (
              <div
                key={tab.id}
                draggable={tab.draggable !== false}
                className={cn(
                  "group/list flex h-9 items-center gap-1 rounded-md px-1 text-sm hover:bg-muted",
                  tab.id === value && "bg-muted"
                )}
                onDragStart={() => setDraggingId(tab.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  setDraggingId(null)
                }}
                onDragEnd={() => setDraggingId(null)}
              >
                {tab.draggable !== false && (
                  <GripVerticalIcon className="size-3 shrink-0 cursor-grab text-muted-foreground" />
                )}
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 px-1 text-left"
                  onClick={() => {
                    onValueChange(tab.id)
                    setOpen(false)
                  }}
                >
                  <AppHeaderTabIcon tab={tab} />
                  <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                  {tab.pinned && <PinIcon className="size-3 fill-current text-muted-foreground" />}
                </button>
                {tabs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Close ${tab.label}`}
                    className="opacity-0 group-hover/list:opacity-100"
                    onClick={() => onClose(tab)}
                  >
                    <XIcon />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AppSpaceHeader({
  tabs,
  value,
  onValueChange,
  onTabsChange,
  onCreate,
  onShiftOpen,
  onCloseRequest,
  createLabel = "Create new tab",
  tabListLabel = "Tab list",
  searchTabsPlaceholder = "Search tabs",
  actionLabels,
  className,
  style,
  ...props
}: AppSpaceHeaderProps) {
  const [containerRef, width] = useElementWidth<HTMLDivElement>()
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [dropTarget, setDropTarget] = React.useState<{
    id: string
    position: DropPosition
  } | null>(null)

  const layout = React.useMemo(() => getMainLayout(width, tabs.length), [tabs.length, width])
  const range = React.useMemo(
    () => getVisibleRange(tabs, value, layout.maxVisible),
    [layout.maxVisible, tabs, value]
  )
  const visibleTabs = tabs.slice(range.start, range.end)
  const hasHiddenTabs = layout.maxVisible > 0 && layout.maxVisible < tabs.length
  const showTabList = (layout.cramped || hasHiddenTabs) && tabs.length > 1

  function togglePin(tab: AppHeaderTab) {
    onTabsChange(
      tabs.map((item) =>
        item.id === tab.id ? { ...item, pinned: !item.pinned } : item
      )
    )
  }

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
    <div
      data-slot="app-space-header"
      className={cn(
        "sticky top-0 z-[41] flex min-w-0 flex-1 select-none items-center justify-between",
        "bg-[var(--app-tab-bg-back)] [font-family:Inter,ui-sans-serif,system-ui,sans-serif]",
        className
      )}
      style={{ ...appHeaderTabTheme, ...style }}
      {...props}
    >
      <div
        ref={containerRef}
        data-slot="app-space-header-viewport"
        className="flex w-0 min-w-0 grow items-center overflow-hidden px-1 [contain:layout_style_paint]"
      >
        <div
          role="tablist"
          aria-label="Open tabs"
          className="flex w-full min-w-0 items-center"
          style={{ gap: MAIN_TAB_GAP }}
        >
          {visibleTabs.map((tab, localIndex) => {
            const active = tab.id === value
            const absoluteIndex = range.start + localIndex
            const before = dropTarget?.id === tab.id && dropTarget.position === "before"
            const after = dropTarget?.id === tab.id && dropTarget.position === "after"

            return (
              <React.Fragment key={tab.id}>
                {before && <div className="h-6 w-[1.5px] shrink-0 rounded-full bg-blue-300" />}
                <div
                  draggable={tab.draggable !== false}
                  data-slot="app-space-header-tab-wrapper"
                  data-tab-id={tab.id}
                  className={cn(
                    "relative min-w-0 outline-none ring-0",
                    tabs.length > 1 && "shrink-0",
                    draggingId ? "cursor-grabbing" : "cursor-pointer"
                  )}
                  style={
                    tabs.length === 1
                      ? { maxWidth: 500, transition: "width 150ms ease-out" }
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
                  onDragOver={(event) => {
                    event.preventDefault()
                    const rect = event.currentTarget.getBoundingClientRect()
                    setDropTarget({
                      id: tab.id,
                      position:
                        event.clientX < rect.left + rect.width / 2 ? "before" : "after",
                    })
                  }}
                  onDrop={(event) => {
                    event.preventDefault()
                    const sourceId = event.dataTransfer.getData("text/plain")
                    if (sourceId && sourceId !== tab.id) {
                      onTabsChange(
                        moveTab(
                          tabs,
                          sourceId,
                          tab.id,
                          dropTarget?.id === tab.id ? dropTarget.position : "after"
                        )
                      )
                    }
                    setDraggingId(null)
                    setDropTarget(null)
                  }}
                  onDragEnd={() => {
                    setDraggingId(null)
                    setDropTarget(null)
                  }}
                >
                  <AppHeaderTabItem
                    tab={tab}
                    active={active}
                    neutral={tabs.length === 1}
                    fitContent={tabs.length === 1}
                    closable={tabs.length > 1}
                    pinnable
                    dragging={draggingId === tab.id}
                    showSeparator={absoluteIndex === tabs.length - 1 && !active}
                    actionLabels={actionLabels}
                    onOpen={() => onValueChange(tab.id)}
                    onShiftOpen={() => onShiftOpen?.(tab)}
                    onClose={() => closeTab(tab)}
                    onTogglePin={() => togglePin(tab)}
                  />
                </div>
                {after && <div className="h-6 w-[1.5px] shrink-0 rounded-full bg-blue-300" />}
              </React.Fragment>
            )
          })}

          {!layout.cramped && (
            <Button
              data-slot="app-space-header-create"
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 border-transparent bg-transparent text-[var(--app-tab-text-secondary)] shadow-none hover:bg-[var(--app-tab-bg-front-hover)] hover:text-[var(--app-tab-text-primary)] focus-visible:ring-0"
              aria-label={createLabel}
              title={createLabel}
              onClick={onCreate}
            >
              <PlusIcon />
            </Button>
          )}
        </div>
      </div>

      <div data-slot="app-space-header-controls" className="flex shrink-0 items-center gap-1">
        <AppHeaderTabList
          tabs={tabs}
          value={value}
          visible={showTabList}
          label={tabListLabel}
          searchPlaceholder={searchTabsPlaceholder}
          onValueChange={onValueChange}
          onClose={closeTab}
        />

        {layout.cramped && (
          <Button
            data-slot="app-space-header-create"
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0 border-transparent bg-transparent text-[var(--app-tab-text-secondary)] shadow-none hover:bg-[var(--app-tab-bg-front-hover)] hover:text-[var(--app-tab-text-primary)] focus-visible:ring-0"
            aria-label={createLabel}
            title={createLabel}
            onClick={onCreate}
          >
            <PlusIcon />
          </Button>
        )}
      </div>
    </div>
  )
}

function AppSidePanelHeader({
  tabs,
  value,
  onValueChange,
  onTabsChange,
  onCreate,
  onCloseRequest,
  onMenu,
  createLabel = "New side-panel tab",
  tabListLabel = "Tab list",
  menuLabel = "Side-panel options",
  searchTabsPlaceholder = "Search tabs",
  closeLabel = "Close tab",
  className,
  style,
  ...props
}: AppSidePanelHeaderProps) {
  const [tabsRef, tabsWidth] = useElementWidth<HTMLDivElement>()
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const layout = React.useMemo(
    () => getSideLayout(tabsWidth, tabs.length),
    [tabs.length, tabsWidth]
  )
  const showTabList = layout.cramped && tabs.length > 1

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
        "flex h-[46px] w-full shrink-0 items-center justify-between px-1",
        "bg-[var(--app-tab-bg-back)] [font-family:Inter,ui-sans-serif,system-ui,sans-serif]",
        className
      )}
      style={{ ...appHeaderTabTheme, ...style }}
      {...props}
    >
      <div className="flex min-w-0 grow flex-col items-center justify-center gap-1">
        <div className="grid w-full grid-cols-[minmax(0,1fr)_fit-content(100%)] items-center gap-1">
          <div ref={tabsRef} className="relative flex min-w-0 w-full items-center justify-start">
            <div
              role="tablist"
              aria-label="Side-panel tabs"
              className="flex w-full min-w-0 items-center overflow-hidden"
              style={{ gap: SIDE_TAB_GAP }}
            >
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  draggable={tab.draggable !== false}
                  data-slot="app-side-panel-tab-wrapper"
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
                      onTabsChange(moveTab(tabs, sourceId, tab.id, "before"))
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
                    closable
                    dragging={draggingId === tab.id}
                    actionLabels={{ close: closeLabel }}
                    onOpen={() => onValueChange(tab.id)}
                    onClose={() => closeTab(tab)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div data-slot="app-side-panel-tab-controls" className="flex shrink-0 items-center gap-1">
            <AppHeaderTabList
              tabs={tabs}
              value={value}
              visible={showTabList}
              label={tabListLabel}
              searchPlaceholder={searchTabsPlaceholder}
              onValueChange={onValueChange}
              onClose={closeTab}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 border-transparent bg-transparent text-[var(--app-tab-text-secondary)] shadow-none hover:bg-[var(--app-tab-bg-front-hover)] hover:text-[var(--app-tab-text-primary)] focus-visible:ring-0"
              aria-label={createLabel}
              title={createLabel}
              onClick={onCreate}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>

      <div data-slot="app-side-panel-shell-controls" className="ml-1 flex shrink-0 items-center">
        <div aria-hidden="true" className="w-7 shrink-0" />
        <Button
          type="button"
          variant="ghost"
          aria-label={menuLabel}
          title={menuLabel}
          className="h-7 w-4 rounded-lg border-transparent bg-transparent px-0 text-[9px] text-[var(--app-tab-text-secondary)] shadow-none hover:bg-[var(--app-tab-bg-front-hover)] hover:text-[var(--app-tab-text-primary)] focus-visible:ring-0"
          onClick={onMenu}
        >
          <ChevronDownIcon className="size-2.5" />
        </Button>
      </div>
    </header>
  )
}

export {
  AppHeaderTabItem,
  AppSidePanelHeader,
  AppSpaceHeader,
  MAIN_TAB_GAP,
  MAIN_TAB_MAX_WIDTH,
  MAIN_TAB_MIN_WIDTH,
  SIDE_TAB_GAP,
  SIDE_TAB_MAX_WIDTH,
  SIDE_TAB_MIN_WIDTH,
}
