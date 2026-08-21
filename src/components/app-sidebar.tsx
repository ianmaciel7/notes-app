"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import {
  ArchiveIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  BriefcaseBusinessIcon,
  ChevronsUpDownIcon,
  CircleAlertIcon,
  Code2Icon,
  FlaskConicalIcon,
  GripVerticalIcon,
  LightbulbIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"

import { AppShellContent, AppShellHeader } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const SPACE_MENU_MAX_HEIGHT = "27rem"

type AppSidebarSpace = {
  id: string
  name: string
  icon: React.ElementType
}

type AppSidebarLabels = {
  changeSpace: string
  search: string
  clearSearch: string
  empty: string
  createSpace: string
}

type AppSidebarProps = {
  spaces: AppSidebarSpace[]
  value: string
  onValueChange: (value: string) => void
  onReorder: (spaces: AppSidebarSpace[]) => void
  labels?: Partial<AppSidebarLabels>
  children?: React.ReactNode
  className?: string
}

type DropPosition = "before" | "after"

type DragSession = {
  id: string
  pointerId: number
  startX: number
  startY: number
  activated: boolean
  moved: boolean
  offsetY: number
  previousCursor: string
  previousUserSelect: string
  previousTouchAction: string
  lastTargetKey: string | null
}

type DragPreview = {
  space: AppSidebarSpace
  left: number
  top: number
  width: number
  height: number
}

const defaultLabels: AppSidebarLabels = {
  changeSpace: "Change space",
  search: "Search",
  clearSearch: "Clear search",
  empty: "No options found.",
  createSpace: "Create space",
}

function areOrdersEqual(a: AppSidebarSpace[], b: AppSidebarSpace[]) {
  return a.length === b.length && a.every((space, index) => space.id === b[index]?.id)
}

function moveSpace(
  spaces: AppSidebarSpace[],
  sourceId: string,
  targetId: string,
  position: DropPosition
) {
  if (sourceId === targetId) return spaces

  const sourceIndex = spaces.findIndex((space) => space.id === sourceId)
  if (sourceIndex === -1) return spaces

  const next = [...spaces]
  const [movingSpace] = next.splice(sourceIndex, 1)
  if (!movingSpace) return spaces

  const targetIndex = next.findIndex((space) => space.id === targetId)
  if (targetIndex === -1) return spaces

  next.splice(targetIndex + (position === "after" ? 1 : 0), 0, movingSpace)
  return next
}

function AppSidebarSpaceSwitcher({
  spaces,
  value,
  onValueChange,
  onReorder,
  labels,
  className,
}: Omit<AppSidebarProps, "children">) {
  const text = { ...defaultLabels, ...labels }
  const isMobile = useIsMobile()
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const itemRefs = React.useRef(new Map<string, HTMLElement>())
  const spacesRef = React.useRef(spaces)
  const onReorderRef = React.useRef(onReorder)
  const draftSpacesRef = React.useRef<AppSidebarSpace[] | null>(null)
  const dragSessionRef = React.useRef<DragSession | null>(null)
  const suppressComboboxCloseUntilRef = React.useRef(0)
  const suppressSelectionUntilRef = React.useRef(0)
  const hintTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const [open, setOpen] = React.useState(false)
  const [hintOpen, setHintOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [draftSpaces, setDraftSpaces] = React.useState<AppSidebarSpace[] | null>(null)
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [dragPreview, setDragPreview] = React.useState<DragPreview | null>(null)

  spacesRef.current = spaces
  onReorderRef.current = onReorder

  const displayedSpaces = draftSpaces ?? spaces
  const selectedSpace =
    displayedSpaces.find((space) => space.id === value) ??
    spaces.find((space) => space.id === value) ??
    displayedSpaces[0]

  const filteredSpaces = React.useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    if (!search) return displayedSpaces

    return displayedSpaces.filter((space) =>
      space.name.toLocaleLowerCase().includes(search)
    )
  }, [displayedSpaces, query])

  const isSorting = draggingId !== null || dragSessionRef.current?.activated === true

  function clearHintTimer() {
    if (!hintTimerRef.current) return
    clearTimeout(hintTimerRef.current)
    hintTimerRef.current = null
  }

  function hideHint() {
    clearHintTimer()
    setHintOpen(false)
  }

  function scheduleHint() {
    if (open || isMobile) return

    clearHintTimer()
    hintTimerRef.current = setTimeout(() => {
      setHintOpen(true)
      hintTimerRef.current = null
    }, 400)
  }

  React.useEffect(() => () => clearHintTimer(), [])

  function measureItems() {
    const positions = new Map<string, number>()

    itemRefs.current.forEach((element, id) => {
      positions.set(id, element.getBoundingClientRect().top)
    })

    return positions
  }

  function animateReorder(previousPositions: Map<string, number>) {
    requestAnimationFrame(() => {
      itemRefs.current.forEach((element, id) => {
        const previousTop = previousPositions.get(id)
        if (previousTop === undefined) return

        const currentTop = element.getBoundingClientRect().top
        const delta = previousTop - currentTop
        if (Math.abs(delta) < 0.5) return

        element.getAnimations().forEach((animation) => animation.cancel())
        element.animate(
          [{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }],
          { duration: 200, easing: "ease-out" }
        )
      })
    })
  }

  function restoreBody(session: DragSession) {
    document.body.style.cursor = session.previousCursor
    document.body.style.userSelect = session.previousUserSelect
    document.body.style.touchAction = session.previousTouchAction
  }

  function clearVisualDragState() {
    const session = dragSessionRef.current
    if (session?.activated) restoreBody(session)

    dragSessionRef.current = null
    draftSpacesRef.current = null
    setDraggingId(null)
    setDragPreview(null)
    setDraftSpaces(null)
  }

  function activateDrag(session: DragSession, clientY: number) {
    const row = itemRefs.current.get(session.id)
    if (!row) return false

    const rect = row.getBoundingClientRect()
    session.activated = true
    session.offsetY = clientY - rect.top
    session.previousCursor = document.body.style.cursor
    session.previousUserSelect = document.body.style.userSelect
    session.previousTouchAction = document.body.style.touchAction

    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"
    document.body.style.touchAction = "none"

    const initialOrder = [...spacesRef.current]
    draftSpacesRef.current = initialOrder
    setDraftSpaces(initialOrder)
    setDraggingId(session.id)

    const space = initialOrder.find((item) => item.id === session.id)
    if (space) {
      setDragPreview({
        space,
        left: rect.left,
        top: clientY - session.offsetY,
        width: rect.width,
        height: rect.height,
      })
    }

    return true
  }

  React.useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const session = dragSessionRef.current
      if (!session || event.pointerId !== session.pointerId) return

      const distance = Math.hypot(
        event.clientX - session.startX,
        event.clientY - session.startY
      )

      if (!session.activated) {
        if (distance < 4) return
        if (!activateDrag(session, event.clientY)) {
          clearVisualDragState()
          return
        }
      }

      event.preventDefault()

      setDragPreview((preview) =>
        preview
          ? { ...preview, top: event.clientY - session.offsetY }
          : preview
      )

      const element = document.elementFromPoint(event.clientX, event.clientY)
      const row = element?.closest<HTMLElement>("[data-space-sort-id]")
      const targetId = row?.dataset.spaceSortId

      if (!row || !targetId || targetId === session.id) {
        session.lastTargetKey = null
        return
      }

      const rect = row.getBoundingClientRect()
      const position: DropPosition =
        event.clientY < rect.top + rect.height / 2 ? "before" : "after"
      const targetKey = `${targetId}:${position}`

      if (session.lastTargetKey === targetKey) return
      session.lastTargetKey = targetKey

      const currentOrder = draftSpacesRef.current ?? spacesRef.current
      const nextOrder = moveSpace(currentOrder, session.id, targetId, position)
      if (areOrdersEqual(currentOrder, nextOrder)) return

      const previousPositions = measureItems()
      session.moved = true
      draftSpacesRef.current = nextOrder
      setDraftSpaces(nextOrder)
      animateReorder(previousPositions)
    }

    function finishPointerSort(event: PointerEvent, commit: boolean) {
      const session = dragSessionRef.current
      if (!session || event.pointerId !== session.pointerId) return

      if (!session.activated) {
        dragSessionRef.current = null
        return
      }

      event.preventDefault()
      suppressSelectionUntilRef.current = performance.now() + 500
      suppressComboboxCloseUntilRef.current = performance.now() + 500

      const finalOrder = draftSpacesRef.current ?? spacesRef.current
      if (
        commit &&
        session.moved &&
        !areOrdersEqual(finalOrder, spacesRef.current)
      ) {
        onReorderRef.current(finalOrder)
      }

      clearVisualDragState()

      if (commit) {
        requestAnimationFrame(() => {
          setOpen(true)
          searchInputRef.current?.focus({ preventScroll: true })
        })
      }
    }

    const handlePointerUp = (event: PointerEvent) => finishPointerSort(event, true)
    const handlePointerCancel = (event: PointerEvent) => finishPointerSort(event, false)

    window.addEventListener("pointermove", handlePointerMove, { passive: false })
    window.addEventListener("pointerup", handlePointerUp)
    window.addEventListener("pointercancel", handlePointerCancel)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("pointercancel", handlePointerCancel)
    }
  }, [])

  React.useEffect(
    () => () => {
      const session = dragSessionRef.current
      if (session?.activated) restoreBody(session)
    },
    []
  )

  if (!selectedSpace) return null

  const SelectedIcon = selectedSpace.icon

  function clearSearch() {
    setQuery("")
    requestAnimationFrame(() => {
      searchInputRef.current?.focus({ preventScroll: true })
    })
  }

  function startPointerSort(event: React.PointerEvent, spaceId: string) {
    if (query.length > 0 || event.button !== 0 || dragSessionRef.current) return

    event.preventDefault()
    event.stopPropagation()
    hideHint()

    dragSessionRef.current = {
      id: spaceId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      activated: false,
      moved: false,
      offsetY: 0,
      previousCursor: "",
      previousUserSelect: "",
      previousTouchAction: "",
      lastTargetKey: null,
    }
  }

  function renderSearch(mobile = false) {
    return (
      <ComboboxInput
        ref={searchInputRef}
        autoFocus={mobile}
        showTrigger={false}
        showClear={false}
        placeholder={text.search}
        aria-label={text.search}
        className={cn(mobile && "h-9 w-full")}
      >
        {query.length > 0 && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={text.clearSearch}
              onPointerDown={(event) => event.preventDefault()}
              onClick={clearSearch}
            >
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </ComboboxInput>
    )
  }

  function renderSpaceItem(space: AppSidebarSpace) {
    const Icon = space.icon
    const isDragging = draggingId === space.id

    return (
      <ComboboxItem
        ref={(node) => {
          if (node) itemRefs.current.set(space.id, node as HTMLElement)
          else itemRefs.current.delete(space.id)
        }}
        key={space.id}
        value={space}
        data-space-sort-id={space.id}
        data-dragging={isDragging ? "true" : undefined}
        aria-grabbed={isDragging}
        className={cn(
          "group/space min-w-0",
          "data-[dragging=true]:pointer-events-none data-[dragging=true]:opacity-30"
        )}
      >
        <span className="relative flex size-4 shrink-0 items-center justify-center">
          <Icon
            className={cn(
              "transition-opacity duration-100",
              !isSorting && query.length === 0 && "group-hover/space:opacity-0",
              isDragging && "opacity-0"
            )}
          />

          {query.length === 0 && (
            <span
              aria-hidden="true"
              className={cn(
                "grab-handle absolute left-1/2 top-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm bg-accent text-muted-foreground opacity-0 transition-opacity duration-100 touch-none select-none cursor-grab",
                !isSorting && "group-hover/space:opacity-100",
                isDragging && "cursor-grabbing opacity-100"
              )}
              onPointerDown={(event) => startPointerSort(event, space.id)}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
            >
              <GripVerticalIcon />
            </span>
          )}
        </span>

        <span className="min-w-0 flex-1 truncate">{space.name}</span>
      </ComboboxItem>
    )
  }

  function renderFooter(mobile = false) {
    if (filteredSpaces.length === 0) return null

    return (
      <>
        <ComboboxSeparator />
        <div
          className={cn(
            "min-w-0 pt-1",
            mobile
              ? "px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
              : "px-1.5 pb-1.5"
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="w-full min-w-0 justify-start"
            disabled
          >
            <PlusIcon data-icon="inline-start" />
            {text.createSpace}
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Combobox
        items={displayedSpaces}
        filteredItems={filteredSpaces}
        value={selectedSpace}
        open={open}
        inline={isMobile}
        inputValue={query}
        autoHighlight={false}
        itemToStringLabel={(space: AppSidebarSpace) => space.name}
        itemToStringValue={(space: AppSidebarSpace) => space.name}
        onInputValueChange={setQuery}
        onOpenChange={(nextOpen, eventDetails) => {
          const session = dragSessionRef.current
          const shouldKeepOpen =
            !nextOpen &&
            (session?.activated ||
              draggingId !== null ||
              performance.now() < suppressComboboxCloseUntilRef.current)

          if (shouldKeepOpen) {
            eventDetails.cancel()
            setOpen(true)
            return
          }

          if (!nextOpen) {
            setOpen(false)
            return
          }

          setQuery("")
          hideHint()
          setOpen(true)
        }}
        onValueChange={(space) => {
          if (
            !space ||
            dragSessionRef.current ||
            draggingId !== null ||
            performance.now() < suppressSelectionUntilRef.current
          ) {
            return
          }

          hideHint()
          onValueChange(space.id)
          if (isMobile) setOpen(false)
        }}
      >
        <div
          data-slot="app-sidebar-space-switcher"
          className={cn(
            "relative -ml-[14px] inline-flex min-w-0 max-w-full",
            className
          )}
          onPointerEnter={scheduleHint}
          onPointerLeave={hideHint}
        >
          <HoverCard open={hintOpen && !open && !isMobile}>
            <HoverCardTrigger
              render={<span className="inline-flex min-w-0 max-w-full" />}
            >
              <ComboboxTrigger
                aria-label={text.changeSpace}
                className={cn(
                  "[&>svg:last-child]:hidden",
                  "data-[popup-open]:focus-visible:border-transparent data-[popup-open]:focus-visible:ring-0"
                )}
                onPointerDown={hideHint}
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="default"
                    className="w-auto max-w-full min-w-0 justify-start gap-0 px-2"
                  />
                }
              >
                <span className="inline-flex w-auto min-w-0 items-center overflow-hidden text-sm font-medium text-foreground">
                  <SelectedIcon
                    data-icon="inline-start"
                    className="!mr-2 size-[14px] shrink-0"
                  />
                  <span className="truncate">{selectedSpace.name}</span>
                </span>
                <ChevronsUpDownIcon
                  data-icon="inline-end"
                  className="ml-1 size-[14px] shrink-0 text-muted-foreground"
                />
              </ComboboxTrigger>
            </HoverCardTrigger>

            <HoverCardContent
              side="right"
              align="center"
              sideOffset={12}
              className="w-auto whitespace-nowrap"
            >
              {text.changeSpace}
            </HoverCardContent>
          </HoverCard>
        </div>

        {!isMobile && (
          <ComboboxContent
            side="right"
            align="start"
            sideOffset={4}
            alignOffset={4}
            initialFocus={searchInputRef}
            finalFocus={false}
            aria-label={text.changeSpace}
            className={cn(
              "flex w-[18rem] min-w-[18rem] max-w-[calc(100vw-1.75rem)] flex-col overflow-hidden",
              "data-closed:animate-none data-closed:duration-0 data-closed:opacity-0 data-closed:zoom-out-100",
              "*:data-[slot=input-group]:!m-0 *:data-[slot=input-group]:!mx-1.5 *:data-[slot=input-group]:!mt-1.5 *:data-[slot=input-group]:!mb-1.5 *:data-[slot=input-group]:shrink-0",
              "*:data-[slot=input-group]:[&>[data-slot=input-group-addon]:empty]:hidden"
            )}
          >
            {renderSearch()}

            <div
              className="no-scrollbar min-h-0 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain"
              style={{
                maxHeight: `min(${SPACE_MENU_MAX_HEIGHT}, calc(var(--available-height) - 2.75rem))`,
              }}
            >
              <ComboboxEmpty>
                <span className="inline-flex w-full min-w-0 items-center justify-center gap-1.5">
                  <CircleAlertIcon />
                  <span className="truncate">{text.empty}</span>
                </span>
              </ComboboxEmpty>

              <ComboboxList className="max-h-none min-w-0 overflow-visible overflow-x-hidden">
                {(space: AppSidebarSpace) => renderSpaceItem(space)}
              </ComboboxList>

              {renderFooter()}
            </div>
          </ComboboxContent>
        )}

        {isMobile && (
          <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
              if (dragSessionRef.current?.activated) return

              if (!nextOpen) {
                setOpen(false)
                return
              }

              setQuery("")
              setOpen(true)
            }}
          >
            <SheetContent
              side="bottom"
              showCloseButton={false}
              className="max-h-[calc(100dvh-1rem)] gap-0 overflow-hidden rounded-t-2xl p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>{text.changeSpace}</SheetTitle>
                <SheetDescription>{text.changeSpace}</SheetDescription>
              </SheetHeader>

              <div className="relative h-7 shrink-0">
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-2 h-[5px] w-8 -translate-x-1/2 rounded-full bg-muted-foreground/40"
                />
              </div>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <div className="shrink-0 px-3 pb-1.5">{renderSearch(true)}</div>

                <div
                  className="no-scrollbar min-h-0 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain"
                  style={{
                    maxHeight: `min(${SPACE_MENU_MAX_HEIGHT}, calc(100dvh - 7rem))`,
                  }}
                >
                  <ComboboxEmpty>
                    <span className="flex min-h-24 min-w-0 items-center justify-center gap-1.5 p-4 text-sm text-muted-foreground">
                      <CircleAlertIcon />
                      <span className="truncate">{text.empty}</span>
                    </span>
                  </ComboboxEmpty>

                  <ComboboxList className="max-h-none min-w-0 overflow-visible overflow-x-hidden p-3 pt-0">
                    {(space: AppSidebarSpace) => renderSpaceItem(space)}
                  </ComboboxList>

                  {renderFooter(true)}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </Combobox>

      {dragPreview &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-slot="app-sidebar-space-drag-preview"
            className="pointer-events-none fixed overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10"
            style={{
              zIndex: 100,
              left: dragPreview.left,
              top: dragPreview.top,
              width: dragPreview.width,
              height: dragPreview.height,
            }}
          >
            <div className="flex h-full min-w-0 items-center gap-2 px-1.5 text-sm">
              <GripVerticalIcon className="shrink-0 text-muted-foreground" />
              <span className="min-w-0 truncate">{dragPreview.space.name}</span>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

function AppSidebar({
  spaces,
  value,
  onValueChange,
  onReorder,
  labels,
  children,
  className,
}: AppSidebarProps) {
  return (
    <div data-slot="app-sidebar" className={cn("flex h-full min-w-0 flex-col", className)}>
      <AppShellHeader className="px-2 pt-1 pr-0.5 pb-px">
        <AppSidebarSpaceSwitcher
          spaces={spaces}
          value={value}
          onValueChange={onValueChange}
          onReorder={onReorder}
          labels={labels}
        />
      </AppShellHeader>

      <AppShellContent>{children}</AppShellContent>
    </div>
  )
}

const demoSpaces: AppSidebarSpace[] = [
  { id: "studies", name: "Studies", icon: BookOpenIcon },
  { id: "ideas", name: "Ideas", icon: LightbulbIcon },
  { id: "labs", name: "Labs", icon: FlaskConicalIcon },
  { id: "projects", name: "Projects", icon: BriefcaseBusinessIcon },
  { id: "dev", name: "Dev", icon: Code2Icon },
  { id: "knowledge", name: "Knowledge", icon: BrainCircuitIcon },
  { id: "archive", name: "Archive", icon: ArchiveIcon },
]

function AppSidebarDemo() {
  const [spaces, setSpaces] = React.useState(demoSpaces)
  const [spaceId, setSpaceId] = React.useState("labs")

  return (
    <AppSidebar
      spaces={spaces}
      value={spaceId}
      onValueChange={setSpaceId}
      onReorder={setSpaces}
    />
  )
}

export {
  AppSidebar,
  AppSidebarDemo,
  AppSidebarSpaceSwitcher,
  type AppSidebarLabels,
  type AppSidebarProps,
  type AppSidebarSpace,
}
