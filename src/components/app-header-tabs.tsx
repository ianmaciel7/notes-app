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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const MAIN_TAB_MAX_WIDTH = 200
const MAIN_TAB_MIN_WIDTH = 60
const MAIN_TAB_GAP = 5
const SIDE_TAB_MAX_WIDTH = 160
const SIDE_TAB_MIN_WIDTH = 44
const SIDE_TAB_GAP = 4
const SIDE_TAB_CONTROLS_WIDTH = 28
const TAB_PREVIEW_DELAY = 200

type AppHeaderTab = {
  id: string
  label: string
  icon?: React.ElementType
  iconClassName?: string
  pinned?: boolean
  draggable?: boolean
  preview?: React.ReactNode
}

type AppHeaderTabActionLabels = {
  pin: string
  unpin: string
  close: string
}

type AppHeaderTabProps = React.ComponentProps<"div"> & {
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

type AppSpaceHeaderProps = React.ComponentProps<"div"> & {
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

type AppSidePanelHeaderProps = React.ComponentProps<"header"> & {
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

type DropPosition = "before" | "after"

type HeaderTabLayout = {
  tabWidth: number
  cramped: boolean
  maxVisible: number
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
  const firstAvailable = width - controlsWidth - gaps
  const firstWidth =
    firstAvailable <= 0
      ? 1
      : Math.max(
          1,
          Math.floor(Math.min(MAIN_TAB_MAX_WIDTH, firstAvailable / count))
        )
  const cramped = firstWidth < MAIN_TAB_MAX_WIDTH - 1
  const available = cramped ? width - gaps : firstAvailable
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

  const maxVisible = Math.max(
    1,
    Math.floor((width + MAIN_TAB_GAP) / (MAIN_TAB_MIN_WIDTH + MAIN_TAB_GAP))
  )

  return {
    tabWidth: MAIN_TAB_MIN_WIDTH,
    cramped: true,
    maxVisible: Math.min(maxVisible, count),
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

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === value)
  )
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
        tab.iconClassName ?? "bg-muted text-muted-foreground"
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
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            data-slot="app-header-tab-action"
            type="button"
            variant="ghost"
            aria-label={label}
            className={cn(
              "h-7 w-[18px] rounded-lg border-transparent p-0 text-xs text-muted-foreground shadow-none",
              "hover:bg-muted hover:text-foreground active:translate-y-0 active:brightness-[0.97] focus-visible:ring-0",
              className
            )}
            onClick={onClick}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function AppHeaderTab({
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
    ? "bg-background"
    : neutral
      ? "bg-sidebar"
      : "bg-sidebar group-hover/tab:bg-muted"
  const actionGradient = activeVisual
    ? "to-background"
    : neutral
      ? "to-sidebar"
      : "to-sidebar group-hover/tab:to-muted"

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
            neutral && "border-transparent text-foreground",
            !neutral &&
              active &&
              "border-border bg-background font-medium text-foreground",
            !neutral &&
              !active &&
              "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
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

          {fitContent && (pinnable || closable) && (
            <div className="flex h-full shrink-0 items-center pr-[2px]">
              {pinnable && onTogglePin && (
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
              )}

              {closable && onClose && (
                <AppHeaderTabAction
                  label={labels.close}
                  className="pointer-events-none opacity-0 transition-opacity duration-100 ease-out group-hover/tab:pointer-events-auto group-hover/tab:opacity-100"
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
          )}
        </div>

        {showSeparator && (
          <div className="absolute right-0 top-1/2 h-[18px] w-[0.5px] -translate-y-1/2 rounded-full bg-border group-hover/tab:opacity-0" />
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

function AppTabList({
  tabs,
  value,
  visible,
  onValueChange,
  onTabsChange,
  onCloseRequest,
  label,
  searchPlaceholder,
}: {
  tabs: AppHeaderTab[]
  value: string
  visible: boolean
  onValueChange: (value: string) => void
  onTabsChange: (tabs: AppHeaderTab[]) => void
  onCloseRequest?: (tab: AppHeaderTab) => boolean | void
  label: string
  searchPlaceholder: string
}) {
  const [query, setQuery] = React.useState("")
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const filteredTabs = tabs.filter((tab) =>
    tab.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  )

  if (!visible) return null

  function closeTab(tab: AppHeaderTab) {
    if (onCloseRequest?.(tab) === false) return

    const index = tabs.findIndex((item) => item.id === tab.id)
    const next = tabs.filter((item) => item.id !== tab.id)
    onTabsChange(next)

    if (value === tab.id) {
      onValueChange(next[index]?.id ?? next[index - 1]?.id ?? next[0]?.id ?? "")
    }
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            data-slot="app-header-tab-list-trigger"
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            className="size-7 shrink-0"
          />
        }
      >
        <ChevronDownIcon />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" sideOffset={6} className="w-64 p-2">
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
              data-active={tab.id === value || undefined}
              className="group/list flex h-9 items-center gap-1 rounded-md px-1 text-sm hover:bg-muted data-[active=true]:bg-muted"
              onDragStart={() => setDraggingId(tab.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                if (!draggingId || draggingId === tab.id) return
                onTabsChange(moveTab(tabs, draggingId, tab.id, "before"))
                setDraggingId(null)
              }}
              onDragEnd={() => setDraggingId(null)}
            >
              {tab.draggable !== false && (
                <GripVerticalIcon className="size-3 shrink-0 cursor-grab text-muted-foreground" />
              )}
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                onClick={() => onValueChange(tab.id)}
              >
                <AppHeaderTabIcon tab={tab} />
                <span className="truncate">{tab.label}</span>
                {tab.pinned && (
                  <PinIcon className="ml-auto size-3 fill-current text-muted-foreground" />
                )}
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="opacity-0 group-hover/list:opacity-100"
                aria-label={`Close ${tab.label}`}
                onClick={() => closeTab(tab)}
              >
                <XIcon />
              </Button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
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
  ...props
}: AppSpaceHeaderProps) {
  const [containerRef, containerWidth] = useElementWidth<HTMLDivElement>()
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [dropTarget, setDropTarget] = React.useState<{
    id: string
    position: DropPosition
  } | null>(null)
  const layout = React.useMemo(
    () => getMainLayout(containerWidth, tabs.length),
    [containerWidth, tabs.length]
  )
  const range = React.useMemo(
    () => getVisibleRange(tabs, value, layout.maxVisible),
    [layout.maxVisible, tabs, value]
  )
  const visibleTabs = tabs.slice(range.start, range.end)
  const hasHiddenTabs = layout.maxVisible > 0 && layout.maxVisible < tabs.length
  const showTabList = (layout.cramped || hasHiddenTabs) && tabs.length > 1

  function closeTab(tab: AppHeaderTab) {
    if (onCloseRequest?.(tab) === false) return

    const index = tabs.findIndex((item) => item.id === tab.id)
    const next = tabs.filter((item) => item.id !== tab.id)
    onTabsChange(next)

    if (value === tab.id) {
      onValueChange(next[index]?.id ?? next[index - 1]?.id ?? next[0]?.id ?? "")
    }
  }

  function togglePin(tab: AppHeaderTab) {
    onTabsChange(
      tabs.map((item) =>
        item.id === tab.id ? { ...item, pinned: !item.pinned } : item
      )
    )
  }

  return (
    <div
      data-slot="app-space-header"
      className={cn(
        "sticky top-0 z-[41] flex min-w-0 flex-1 select-none justify-between bg-sidebar",
        className
      )}
      {...props}
    >
      <div className="flex h-full w-full flex-col">
        <div className="flex h-full w-full grow items-center">
          <div className="flex h-full w-full min-w-0 grow items-center">
            <div className="flex w-full min-w-0 items-center">
              <div
                ref={containerRef}
                className="flex w-0 min-w-0 grow cursor-default items-center overflow-hidden px-1 [contain:layout_style_paint]"
              >
                <div
                  role="tablist"
                  aria-label="Open tabs"
                  className="flex w-full min-w-0 items-center"
                  style={{ gap: MAIN_TAB_GAP }}
                >
                  {visibleTabs.map((tab, localIndex) => {
                    const absoluteIndex = range.start + localIndex
                    const before =
                      dropTarget?.id === tab.id && dropTarget.position === "before"
                    const after =
                      dropTarget?.id === tab.id && dropTarget.position === "after"

                    return (
                      <React.Fragment key={tab.id}>
                        {before && (
                          <div className="my-1 h-[26px] w-[1.5px] shrink-0 self-stretch rounded-full bg-primary/40" />
                        )}
                        <div
                          draggable={tab.draggable !== false}
                          data-tab-id={tab.id}
                          className={cn(
                            "relative min-w-0",
                            tabs.length > 1 && "shrink-0",
                            draggingId ? "cursor-grabbing" : "cursor-pointer"
                          )}
                          style={
                            tabs.length === 1
                              ? { maxWidth: 500, transition: "width 150ms ease-out" }
                              : {
                                  width: `${layout.tabWidth}px`,
                                  transition: "width 150ms ease-out",
                                }
                          }
                          onDragStart={(event) => {
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
                                event.clientX < rect.left + rect.width / 2
                                  ? "before"
                                  : "after",
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
                                  dropTarget?.id === tab.id
                                    ? dropTarget.position
                                    : "after"
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
                          <AppHeaderTab
                            tab={tab}
                            active={tab.id === value}
                            neutral={tabs.length === 1}
                            fitContent={tabs.length === 1}
                            closable={tabs.length > 1}
                            pinnable
                            dragging={draggingId === tab.id}
                            showSeparator={
                              absoluteIndex === tabs.length - 1 && tab.id !== value
                            }
                            actionLabels={actionLabels}
                            onOpen={() => onValueChange(tab.id)}
                            onShiftOpen={() => onShiftOpen?.(tab)}
                            onClose={() => closeTab(tab)}
                            onTogglePin={() => togglePin(tab)}
                          />
                        </div>
                        {after && (
                          <div className="my-1 h-[26px] w-[1.5px] shrink-0 self-stretch rounded-full bg-primary/40" />
                        )}
                      </React.Fragment>
                    )
                  })}

                  {!layout.cramped && (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            data-slot="app-space-header-create"
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="size-7 shrink-0"
                            aria-label={createLabel}
                            onClick={onCreate}
                          />
                        }
                      >
                        <PlusIcon />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        {createLabel}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              <div data-slot="app-space-header-controls" className="flex shrink-0 items-center gap-1">
                <AppTabList
                  tabs={tabs}
                  value={value}
                  visible={showTabList}
                  onValueChange={onValueChange}
                  onTabsChange={onTabsChange}
                  onCloseRequest={onCloseRequest}
                  label={tabListLabel}
                  searchPlaceholder={searchTabsPlaceholder}
                />

                {layout.cramped && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          data-slot="app-space-header-create"
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="size-7 shrink-0"
                          aria-label={createLabel}
                          onClick={onCreate}
                        />
                      }
                    >
                      <PlusIcon />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={8}>
                      {createLabel}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
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
    if (onCloseRequest?.(tab) === false) return

    const index = tabs.findIndex((item) => item.id === tab.id)
    const next = tabs.filter((item) => item.id !== tab.id)
    onTabsChange(next)

    if (value === tab.id) {
      onValueChange(next[index]?.id ?? next[index - 1]?.id ?? next[0]?.id ?? "")
    }
  }

  return (
    <header
      data-slot="app-side-panel-header"
      className={cn(
        "flex h-[46px] w-full shrink-0 items-center justify-between bg-sidebar px-1",
        className
      )}
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
                  data-sidepanel-tab-active={tab.id === value || undefined}
                  className={cn(
                    "relative min-w-0",
                    tabs.length > 1 && "shrink-0"
                  )}
                  style={
                    tabs.length === 1
                      ? { maxWidth: 400, transition: "width 150ms ease-out" }
                      : {
                          width: `${layout.tabWidth}px`,
                          transition: "width 150ms ease-out",
                        }
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
                  <AppHeaderTab
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
            <AppTabList
              tabs={tabs}
              value={value}
              visible={showTabList}
              onValueChange={onValueChange}
              onTabsChange={onTabsChange}
              onCloseRequest={onCloseRequest}
              label={tabListLabel}
              searchPlaceholder={searchTabsPlaceholder}
            />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 shrink-0"
                    aria-label={createLabel}
                    onClick={onCreate}
                  />
                }
              >
                <PlusIcon />
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                {createLabel}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div data-slot="app-side-panel-shell-controls" className="ml-1 flex shrink-0 items-center">
        <div aria-hidden="true" className="w-7 shrink-0" />
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                aria-label={menuLabel}
                className="h-7 w-4 rounded-lg px-0 text-[9px]"
                onClick={onMenu}
              />
            }
          >
            <ChevronDownIcon className="size-2.5" />
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            {menuLabel}
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}

export {
  AppHeaderTab,
  AppSidePanelHeader,
  AppSpaceHeader,
  MAIN_TAB_GAP,
  MAIN_TAB_MAX_WIDTH,
  MAIN_TAB_MIN_WIDTH,
  SIDE_TAB_GAP,
  SIDE_TAB_MAX_WIDTH,
  SIDE_TAB_MIN_WIDTH,
  type AppHeaderTab,
  type AppHeaderTabActionLabels,
  type AppHeaderTabProps,
  type AppSidePanelHeaderProps,
  type AppSpaceHeaderProps,
}
