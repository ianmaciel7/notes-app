"use client"

import * as React from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookOpenIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  FilesIcon,
  GripVerticalIcon,
  LayoutListIcon,
  PinOffIcon,
  SearchIcon,
  SettingsIcon,
  Share2Icon,
  SlidersHorizontalIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react"

import {
  AppSidebarAtomicNoteIcon,
  AppSidebarDotsIcon,
  AppSidebarObjectsIcon,
  AppSidebarPageIcon,
  AppSidebarPinIcon,
  AppSidebarPlusIcon,
  AppSidebarQuoteIcon,
} from "@/components/app-sidebar-icons"
import {
  AppSidebarObjectTypeStudio,
  appSidebarObjectTypeToneClasses,
  type AppSidebarObjectTypePreset,
  type AppSidebarObjectTypeTone,
} from "@/components/app-sidebar-object-type-studio"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type AppSidebarSortMode = "manual" | "alphabetical"

type AppSidebarEntityKind = "object" | "object-type"

type AppSidebarEntity = {
  id: string
  label: string
  icon: React.ElementType
  tone: AppSidebarObjectTypeTone
  kind: AppSidebarEntityKind
  singularLabel?: string
  count?: number
}

type AppSidebarCustomSection = {
  id: string
  label: string
  sort: AppSidebarSortMode
  entityIds: string[]
}

type AppSidebarSectionProps = {
  icon: React.ElementType
  label: string
  count?: number
  sort?: AppSidebarSortMode
  onSortChange?: (sort: AppSidebarSortMode) => void
  action?: React.ReactNode
  emptyLabel?: string
  defaultOpen?: boolean
  menuSide?: "top" | "bottom"
  menuWidthClassName?: string
  customSection?: AppSidebarCustomSection
  onRenameSection?: (label: string) => void
  onDeleteSection?: () => void
  children?: React.ReactNode
}

function AppSidebarHoverHint({
  label,
  children,
}: {
  label: string
  children: React.ReactElement
}) {
  const isMobile = useIsMobile()
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const [open, setOpen] = React.useState(false)

  function clearTimer() {
    if (!timerRef.current) return
    clearTimeout(timerRef.current)
    timerRef.current = null
  }

  function closeHint() {
    clearTimer()
    setOpen(false)
  }

  React.useEffect(() => () => clearTimer(), [])

  if (isMobile) return children

  return (
    <span
      className="inline-flex"
      onPointerEnter={() => {
        clearTimer()
        timerRef.current = setTimeout(() => {
          setOpen(true)
          timerRef.current = null
        }, 200)
      }}
      onPointerLeave={closeHint}
      onPointerDown={closeHint}
    >
      <HoverCard open={open}>
        <HoverCardTrigger render={<span className="inline-flex" />}>
          {children}
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          align="center"
          sideOffset={6}
          className="pointer-events-none w-auto max-w-48 px-2.5 py-1.5 text-xs"
        >
          {label}
        </HoverCardContent>
      </HoverCard>
    </span>
  )
}

function AppSidebarTypeLabel({
  entity,
}: {
  entity: AppSidebarEntity
}) {
  const Icon = entity.icon

  return (
    <span
      data-slot="app-sidebar-type-label"
      className={cn(
        "inline-flex max-w-full min-w-0 items-center overflow-x-clip whitespace-nowrap",
        "rounded-[0.475em] border border-transparent px-[0.49em] py-[0.2em] leading-[1.3]"
      )}
    >
      <span
        className={cn(
          "mr-[0.4em] ml-[-0.1em] inline-flex min-h-[1.3em] min-w-[1.3em] shrink-0",
          "items-center justify-center rounded-[0.33em] border",
          appSidebarObjectTypeToneClasses[entity.tone]
        )}
      >
        <span className="inline-flex min-h-[1.3em] min-w-[1.3em] items-center justify-center rounded-[0.33em] p-[0.1em] text-[0.94em]">
          <Icon className="size-[1em]" />
        </span>
      </span>

      <span className="block min-w-0 truncate text-left text-[1em]">
        {entity.label}
      </span>
    </span>
  )
}

function AppSidebarSectionMenu({
  value,
  onValueChange,
  side = "top",
  widthClassName = "w-56",
}: {
  value: AppSidebarSortMode
  onValueChange: (value: AppSidebarSortMode) => void
  side?: "top" | "bottom"
  widthClassName?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Sort section"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-200",
          "group-hover/app-sidebar-section:opacity-100 data-popup-open:opacity-100"
        )}
      >
        <AppSidebarDotsIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={side}
        align="start"
        sideOffset={6}
        className={cn(widthClassName, "p-1")}
      >
        <DropdownMenuItem onClick={() => onValueChange("manual")}>
          <GripVerticalIcon />
          Sort manually
          {value === "manual" && <CheckIcon className="ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onValueChange("alphabetical")}>
          <LayoutListIcon />
          Sort alphabetically
          {value === "alphabetical" && <CheckIcon className="ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppSidebarCustomSectionMenu({
  section,
  onRename,
  onSortChange,
  onDelete,
}: {
  section: AppSidebarCustomSection
  onRename: (label: string) => void
  onSortChange: (sort: AppSidebarSortMode) => void
  onDelete: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [draftLabel, setDraftLabel] = React.useState(section.label)

  React.useEffect(() => {
    if (!open) setDraftLabel(section.label)
  }, [open, section.label])

  function commitLabel() {
    const nextLabel = draftLabel.trim()
    if (nextLabel && nextLabel !== section.label) onRename(nextLabel)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Section options"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-200",
          "group-hover/app-sidebar-section:opacity-100 data-popup-open:opacity-100"
        )}
      >
        <AppSidebarDotsIcon />
      </PopoverTrigger>

      <PopoverContent side="bottom" align="start" sideOffset={6} className="w-72 gap-0 p-0">
        <div className="flex flex-col gap-2 p-3">
          <label htmlFor={`section-${section.id}`} className="text-xs text-muted-foreground">
            Section name
          </label>
          <Input
            id={`section-${section.id}`}
            value={draftLabel}
            className="h-8 bg-muted/50"
            onChange={(event) => setDraftLabel(event.target.value)}
            onBlur={commitLabel}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return
              event.preventDefault()
              commitLabel()
            }}
          />
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col p-1">
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="justify-start font-normal"
            onClick={() => onSortChange("manual")}
          >
            <GripVerticalIcon data-icon="inline-start" />
            Sort manually
            {section.sort === "manual" && <CheckIcon className="ml-auto" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="justify-start font-normal"
            onClick={() => onSortChange("alphabetical")}
          >
            <LayoutListIcon data-icon="inline-start" />
            Sort alphabetically
            {section.sort === "alphabetical" && <CheckIcon className="ml-auto" />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="justify-start font-normal text-destructive hover:text-destructive"
            onClick={() => {
              onDelete()
              setOpen(false)
            }}
          >
            <Trash2Icon data-icon="inline-start" />
            Delete section
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function AppSidebarSection({
  icon: Icon,
  label,
  count,
  sort = "manual",
  onSortChange,
  action,
  emptyLabel,
  defaultOpen = true,
  menuSide = "top",
  menuWidthClassName = "w-56",
  customSection,
  onRenameSection,
  onDeleteSection,
  children,
}: AppSidebarSectionProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(defaultOpen)
  const hasChildren = React.Children.count(children) > 0

  return (
    <Collapsible
      data-slot="app-sidebar-section"
      open={open}
      onOpenChange={setOpen}
      className="flex w-full shrink-0 flex-col"
    >
      <div className="group/app-sidebar-section sticky top-0 z-[5] mt-0 mr-2 ml-px bg-sidebar px-2 pr-1">
        <div
          className={cn(
            "flex w-full items-center truncate rounded-md px-2 py-1 text-muted-foreground",
            "transition duration-200 ease-out hover:bg-sidebar-accent",
            isMobile ? "h-11 gap-x-1.5 text-sm" : "h-8 gap-x-1.5 text-[12px]"
          )}
        >
          <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-x-1.5 overflow-hidden text-left outline-none">
            <Icon className={cn("shrink-0", isMobile ? "size-4" : "size-[1em]")} />
            <span className={cn("min-w-0 truncate", isMobile ? "font-semibold" : "font-medium")}>
              {label}
            </span>
            <span
              className={cn(
                "-ml-0.5 mr-1 flex size-4 shrink-0 items-center justify-center text-[0.9em]",
                "transition duration-200 ease-in-out",
                isMobile ? "opacity-70" : "opacity-0 group-hover/app-sidebar-section:opacity-80"
              )}
            >
              <svg
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                className={cn("size-[1em] transition-transform duration-200", !open && "-rotate-90")}
              >
                <path d="m216.49 104.49-80 80a12 12 0 0 1-17 0l-80-80a12 12 0 0 1 17-17L128 159l71.51-71.52a12 12 0 0 1 17 17Z" />
              </svg>
            </span>
            <span className="min-w-0 flex-1" />
          </CollapsibleTrigger>

          <div className="flex h-4 max-w-max shrink-0 items-center gap-px pb-px">
            {typeof count === "number" && (
              <span
                className={cn(
                  "text-[11px] tabular-nums text-muted-foreground transition-opacity duration-200",
                  isMobile ? "opacity-70" : "opacity-0 group-hover/app-sidebar-section:opacity-80"
                )}
              >
                {count}
              </span>
            )}

            {customSection ? (
              <AppSidebarCustomSectionMenu
                section={customSection}
                onRename={onRenameSection ?? (() => {})}
                onSortChange={onSortChange ?? (() => {})}
                onDelete={onDeleteSection ?? (() => {})}
              />
            ) : (
              <AppSidebarSectionMenu
                value={sort}
                onValueChange={onSortChange ?? (() => {})}
                side={menuSide}
                widthClassName={menuWidthClassName}
              />
            )}

            {action}
          </div>
        </div>
      </div>

      <CollapsibleContent className={cn("flex w-full max-w-full flex-col pt-0.5 pb-1.5", isMobile && "pl-2")}>
        {hasChildren ? (
          children
        ) : emptyLabel ? (
          <p className="h-10 px-5 py-1.5 text-xs italic leading-[18px] text-muted-foreground">
            {emptyLabel}
          </p>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  )
}

function AppSidebarSectionAction({
  label,
}: {
  label: string
}) {
  const isMobile = useIsMobile()

  const action = (
    <Button
      data-slot="app-sidebar-section-action"
      type="button"
      variant="outline"
      size="icon-xs"
      aria-label={label}
      className={cn(
        "size-[22px] shrink-0 transition-opacity duration-200",
        isMobile
          ? "opacity-100"
          : "opacity-0 group-hover/app-sidebar-section:opacity-100 data-popup-open:opacity-100"
      )}
    >
      <AppSidebarPlusIcon className="size-[14px]" />
    </Button>
  )

  return <AppSidebarHoverHint label={label}>{action}</AppSidebarHoverHint>
}

function AppSidebarEntityPicker({
  entities,
  selectedIds,
  onPick,
}: {
  entities: AppSidebarEntity[]
  selectedIds: Set<string>
  onPick: (entity: AppSidebarEntity) => void
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const results = React.useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    return entities.filter((entity) => {
      if (selectedIds.has(entity.id)) return false
      return !normalized || entity.label.toLocaleLowerCase().includes(normalized)
    })
  }, [entities, query, selectedIds])

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setQuery("")
      }}
    >
      <PopoverTrigger
        aria-label="Add existing"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon-xs" }),
          "size-[22px] shrink-0 transition-opacity duration-200",
          isMobile
            ? "opacity-100"
            : "opacity-0 group-hover/app-sidebar-section:opacity-100 data-popup-open:opacity-100"
        )}
      >
        <AppSidebarPlusIcon className="size-[14px]" />
      </PopoverTrigger>

      <PopoverContent
        side={isMobile ? "bottom" : "right"}
        align="start"
        sideOffset={8}
        className="w-[min(24rem,calc(100vw-1.5rem))] gap-1.5 p-2"
      >
        <Input
          autoFocus
          value={query}
          placeholder="Search"
          className="h-9 bg-muted/60"
          onChange={(event) => setQuery(event.target.value)}
        />

        <ScrollArea className="max-h-64">
          <div className="flex flex-col gap-0.5 py-0.5">
            {results.length > 0 ? (
              results.map((entity) => (
                <Item
                  key={entity.id}
                  size="xs"
                  render={
                    <button
                      type="button"
                      onClick={() => {
                        onPick(entity)
                        setOpen(false)
                      }}
                    />
                  }
                  className="min-h-8 flex-nowrap border-0 px-1.5 py-1 hover:bg-muted"
                >
                  <ItemMedia>
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-md border",
                        appSidebarObjectTypeToneClasses[entity.tone]
                      )}
                    >
                      <entity.icon className="size-3.5" />
                    </span>
                  </ItemMedia>
                  <ItemContent className="min-w-0">
                    <ItemTitle className="w-full truncate font-normal">{entity.label}</ItemTitle>
                  </ItemContent>
                </Item>
              ))
            ) : (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No objects found
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function AppSidebarOpenSubmenu({
  pinned,
  onOpen,
}: {
  pinned: boolean
  onOpen?: () => void
}) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <ExternalLinkIcon />
        Open
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-64">
        <DropdownMenuItem onClick={onOpen}>
          <ExternalLinkIcon />
          Open as page
        </DropdownMenuItem>
        {pinned && (
          <>
            <DropdownMenuItem>
              <FilesIcon />
              Open in preview
              <DropdownMenuShortcut>Alt ⇧ Click</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LayoutListIcon />
              Open in side panel
              <DropdownMenuShortcut>⇧ Click</DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem>
          <BookOpenIcon />
          Open in new tab
          <DropdownMenuShortcut>Ctrl Click</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

function AppSidebarTemplateSubmenu({
  singularLabel,
}: {
  singularLabel: string
}) {
  const [query, setQuery] = React.useState("")

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <CopyIcon />
        New from template
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-72 p-1.5">
        <div
          className="p-1"
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Input
            value={query}
            placeholder="Search"
            className="h-8 bg-muted/50"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <DropdownMenuItem>
          <AppSidebarPlusIcon />
          New {singularLabel.toLocaleLowerCase()} template
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

function AppSidebarCopySubmenu() {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <CopyIcon />
        Copy
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-72">
        <DropdownMenuItem>
          <CopyIcon />
          Copy as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          Copy object reference
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

function AppSidebarPinnedObjectMenu({
  entity,
  onOpen,
  onUnpin,
  onDuplicate,
  onDelete,
}: {
  entity: AppSidebarEntity
  onOpen?: () => void
  onUnpin?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${entity.label}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-150 ease-out",
          "group-hover/app-sidebar-entity-row:opacity-70 hover:!opacity-100 data-popup-open:opacity-100"
        )}
      >
        <AppSidebarDotsIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-80">
        <AppSidebarOpenSubmenu pinned onOpen={onOpen} />
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onUnpin}>
          <PinOffIcon />
          Unpin from space
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <SettingsIcon />
          Object type settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Share2Icon />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SlidersHorizontalIcon />
          Present
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ArrowDownIcon />
          Export
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ArrowUpIcon />
          Import
          <DropdownMenuShortcut>Ctrl I</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <AppSidebarCopySubmenu />
        <DropdownMenuItem onClick={onDuplicate}>
          <FilesIcon />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2Icon />
          Delete object
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppSidebarObjectTypeMenu({
  entity,
  active,
  pinned,
  onOpen,
  onTogglePin,
  onDelete,
}: {
  entity: AppSidebarEntity
  active?: boolean
  pinned?: boolean
  onOpen?: () => void
  onTogglePin?: () => void
  onDelete?: () => void
}) {
  const singularLabel = entity.singularLabel ?? entity.label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${entity.label}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-150 ease-out",
          "group-hover/app-sidebar-entity-row:opacity-70 hover:!opacity-100 data-popup-open:opacity-100"
        )}
      >
        <AppSidebarDotsIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-80">
        {!active && (
          <>
            <AppSidebarOpenSubmenu pinned={false} onOpen={onOpen} />
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem>
          <AppSidebarPlusIcon />
          Create {singularLabel}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <AppSidebarTemplateSubmenu singularLabel={singularLabel} />
        <DropdownMenuItem>
          <SearchIcon />
          New query
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FilesIcon />
          New collection
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onTogglePin}>
          {pinned ? <PinOffIcon /> : <AppSidebarPinIcon />}
          {pinned ? "Unpin from sidebar" : "Pin to sidebar"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <SettingsIcon />
          Object type settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <ArrowUpIcon />
          Import
          <DropdownMenuShortcut>Ctrl I</DropdownMenuShortcut>
        </DropdownMenuItem>

        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2Icon />
              Remove object type
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppSidebarEntityRow({
  entity,
  active,
  pinned,
  mode,
  onClick,
  onTogglePin,
  onDuplicate,
  onDelete,
}: {
  entity: AppSidebarEntity
  active?: boolean
  pinned?: boolean
  mode: AppSidebarEntityKind
  onClick?: () => void
  onTogglePin?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
}) {
  const isMobile = useIsMobile()

  return (
    <div
      data-slot="app-sidebar-entity-row"
      data-active={active || undefined}
      className={cn(
        "group/app-sidebar-entity-row mx-2 flex w-auto items-center rounded-md pr-1.5",
        "text-sm font-normal text-muted-foreground transition-[background-color,color,filter] duration-150",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground data-[active=true]:brightness-[0.965]",
        isMobile ? "min-h-10 py-1 pl-1" : "h-[29px] py-px pl-[3px]"
      )}
    >
      <button
        type="button"
        className="relative flex min-w-0 flex-1 items-center py-px text-left outline-none"
        onClick={onClick}
      >
        <span className={cn("flex w-12 min-w-0 flex-1 items-center truncate", active && "font-medium")}>
          <AppSidebarTypeLabel entity={entity} />
        </span>
      </button>

      {!isMobile && (
        <div
          className={cn(
            "flex w-0 max-w-max shrink-0 items-center overflow-hidden opacity-0",
            "transition-[width,opacity] duration-300 ease-in",
            "group-hover/app-sidebar-entity-row:w-[80px] group-hover/app-sidebar-entity-row:opacity-100 group-hover/app-sidebar-entity-row:ease-out"
          )}
        >
          {entity.count !== undefined && (
            <span className="text-[11px] tabular-nums text-muted-foreground opacity-0 transition-opacity duration-200 group-hover/app-sidebar-entity-row:opacity-80">
              {entity.count}
            </span>
          )}

          {mode === "object-type" ? (
            <AppSidebarObjectTypeMenu
              entity={entity}
              active={active}
              pinned={pinned}
              onOpen={onClick}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
            />
          ) : (
            <AppSidebarPinnedObjectMenu
              entity={entity}
              onOpen={onClick}
              onUnpin={onTogglePin}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          )}
        </div>
      )}
    </div>
  )
}

function AppSidebarAddSection({
  onCreate,
}: {
  onCreate: (section: AppSidebarCustomSection) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")

  function createSection() {
    const label = name.trim()
    if (!label) return

    onCreate({
      id: crypto.randomUUID(),
      label,
      sort: "manual",
      entityIds: [],
    })
    setName("")
    setOpen(false)
  }

  return (
    <div data-slot="app-sidebar-add-section" className="mt-0 mr-2 ml-px bg-sidebar px-2 pr-0.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "h-8 w-full justify-start gap-x-1.5 px-2 font-normal text-muted-foreground",
            "opacity-60 transition-opacity duration-200 hover:!opacity-100 data-popup-open:opacity-100"
          )}
        >
          <AppSidebarPlusIcon />
          <span className="min-w-0 truncate">Add section</span>
        </PopoverTrigger>

        <PopoverContent side="right" align="start" sideOffset={8} className="w-72 gap-2 p-3">
          <p className="text-sm leading-snug text-muted-foreground">
            Group pages and collections under a named section in the space overview.
          </p>
          <label htmlFor="new-sidebar-section" className="flex flex-col gap-2 text-xs">
            Section name
            <Input
              id="new-sidebar-section"
              autoFocus
              value={name}
              className="h-8 bg-muted/50"
              placeholder="Section name"
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return
                event.preventDefault()
                createSection()
              }}
            />
          </label>
          <Button type="button" size="sm" className="w-full" disabled={!name.trim()} onClick={createSection}>
            <AppSidebarPlusIcon data-icon="inline-start" />
            Create
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const availableEntities: AppSidebarEntity[] = [
  {
    id: "example-page",
    label: "Example page",
    icon: AppSidebarPageIcon,
    tone: "blue",
    kind: "object",
  },
  {
    id: "product-notes",
    label: "Product notes",
    icon: AppSidebarAtomicNoteIcon,
    tone: "amber",
    kind: "object",
  },
]

const initialObjectTypes: AppSidebarEntity[] = [
  {
    id: "page",
    label: "Pages",
    singularLabel: "Page",
    icon: AppSidebarPageIcon,
    tone: "blue",
    kind: "object-type",
    count: 0,
  },
]

type AppSidebarOverviewProps = {
  activeId?: string | null
  onActiveIdChange?: (id: string | null) => void
}

function AppSidebarOverview({
  activeId: controlledActiveId,
  onActiveIdChange,
}: AppSidebarOverviewProps = {}) {
  const [internalActiveId, setInternalActiveId] = React.useState<string | null>(null)
  const isControlled = controlledActiveId !== undefined
  const activeId = isControlled ? controlledActiveId : internalActiveId

  function setActiveId(id: string | null) {
    if (!isControlled) setInternalActiveId(id)
    onActiveIdChange?.(id)
  }
  const [pinnedSort, setPinnedSort] = React.useState<AppSidebarSortMode>("manual")
  const [objectSort, setObjectSort] = React.useState<AppSidebarSortMode>("manual")
  const [pinned, setPinned] = React.useState<AppSidebarEntity[]>([])
  const [objectTypes, setObjectTypes] = React.useState<AppSidebarEntity[]>(initialObjectTypes)
  const [customSections, setCustomSections] = React.useState<AppSidebarCustomSection[]>([])

  const pinnedIds = React.useMemo(() => new Set(pinned.map((entity) => entity.id)), [pinned])

  const visiblePinned = React.useMemo(
    () =>
      pinnedSort === "alphabetical"
        ? [...pinned].sort((a, b) => a.label.localeCompare(b.label))
        : pinned,
    [pinned, pinnedSort]
  )

  const visibleObjectTypes = React.useMemo(
    () =>
      objectSort === "alphabetical"
        ? [...objectTypes].sort((a, b) => a.label.localeCompare(b.label))
        : objectTypes,
    [objectSort, objectTypes]
  )

  function addObjectType(preset: AppSidebarObjectTypePreset) {
    setObjectTypes((current) =>
      current.some((entity) => entity.id === preset.id)
        ? current
        : [
            ...current,
            {
              id: preset.id,
              label: preset.label,
              singularLabel: preset.label,
              icon: preset.icon,
              tone: preset.tone,
              kind: "object-type",
              count: 0,
            },
          ]
    )
  }

  function duplicateEntity(entity: AppSidebarEntity) {
    const copy = {
      ...entity,
      id: `${entity.id}-${crypto.randomUUID()}`,
      label: `${entity.label} copy`,
    }
    setPinned((current) => [...current, copy])
    setActiveId(copy.id)
  }

  function updateCustomSection(
    sectionId: string,
    update: (section: AppSidebarCustomSection) => AppSidebarCustomSection
  ) {
    setCustomSections((current) =>
      current.map((section) => (section.id === sectionId ? update(section) : section))
    )
  }

  return (
    <ScrollArea
      data-slot="app-sidebar-overview"
      className={cn(
        "group/section-container mt-0.5 h-32 min-h-0 flex-1",
        "[&_[data-slot=scroll-area-viewport]>div]:!block",
        "[&_[data-slot=scroll-area-viewport]>div]:!min-h-full",
        "[&_[data-slot=scroll-area-viewport]>div]:!w-full",
        "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:!w-[6px]",
        "[&_[data-slot=scroll-area-scrollbar]]:!p-0"
      )}
    >
      <div className="flex min-h-full w-full flex-col pr-px">
        <AppSidebarSection
          icon={AppSidebarPinIcon}
          label="Pinned"
          count={pinned.length}
          sort={pinnedSort}
          onSortChange={setPinnedSort}
          menuSide="bottom"
          menuWidthClassName="w-64"
          emptyLabel="No pinned content"
          action={
            <AppSidebarEntityPicker
              entities={availableEntities}
              selectedIds={pinnedIds}
              onPick={(entity) => setPinned((current) => [...current, entity])}
            />
          }
        >
          {visiblePinned.map((entity) => (
            <AppSidebarEntityRow
              key={entity.id}
              entity={entity}
              mode="object"
              active={activeId === entity.id}
              pinned
              onClick={() => setActiveId(entity.id)}
              onTogglePin={() =>
                setPinned((current) => current.filter((item) => item.id !== entity.id))
              }
              onDuplicate={() => duplicateEntity(entity)}
              onDelete={() => {
                setPinned((current) => current.filter((item) => item.id !== entity.id))
                if (activeId === entity.id) setActiveId(null)
              }}
            />
          ))}
        </AppSidebarSection>

        <AppSidebarSection
          icon={AppSidebarObjectsIcon}
          label="Object types"
          count={objectTypes.length}
          sort={objectSort}
          onSortChange={setObjectSort}
          menuSide="top"
          menuWidthClassName="w-56"
          emptyLabel="No object types"
          action={
            <AppSidebarObjectTypeStudio
              onSelect={addObjectType}
              trigger={<AppSidebarSectionAction label="Create object type" />}
            />
          }
        >
          {visibleObjectTypes.map((entity) => (
            <AppSidebarEntityRow
              key={entity.id}
              entity={entity}
              mode="object-type"
              active={activeId === entity.id}
              pinned={pinnedIds.has(entity.id)}
              onClick={() => setActiveId(entity.id)}
              onTogglePin={() => {
                setPinned((current) =>
                  current.some((item) => item.id === entity.id)
                    ? current.filter((item) => item.id !== entity.id)
                    : [...current, { ...entity, kind: "object" }]
                )
              }}
              onDelete={() => {
                setObjectTypes((current) => current.filter((item) => item.id !== entity.id))
                if (activeId === entity.id) setActiveId(null)
              }}
            />
          ))}
        </AppSidebarSection>

        {customSections.map((section) => {
          const sectionEntities = section.entityIds
            .map((id) => availableEntities.find((entity) => entity.id === id))
            .filter((entity): entity is AppSidebarEntity => Boolean(entity))
          const visibleEntities =
            section.sort === "alphabetical"
              ? [...sectionEntities].sort((a, b) => a.label.localeCompare(b.label))
              : sectionEntities
          const selectedIds = new Set(section.entityIds)

          return (
            <AppSidebarSection
              key={section.id}
              icon={TagIcon}
              label={section.label}
              count={sectionEntities.length}
              sort={section.sort}
              onSortChange={(sort) =>
                updateCustomSection(section.id, (current) => ({ ...current, sort }))
              }
              customSection={section}
              onRenameSection={(label) =>
                updateCustomSection(section.id, (current) => ({ ...current, label }))
              }
              onDeleteSection={() =>
                setCustomSections((current) =>
                  current.filter((currentSection) => currentSection.id !== section.id)
                )
              }
              emptyLabel="No content"
              action={
                <AppSidebarEntityPicker
                  entities={availableEntities}
                  selectedIds={selectedIds}
                  onPick={(entity) =>
                    updateCustomSection(section.id, (current) => ({
                      ...current,
                      entityIds: [...current.entityIds, entity.id],
                    }))
                  }
                />
              }
            >
              {visibleEntities.map((entity) => (
                <AppSidebarEntityRow
                  key={entity.id}
                  entity={entity}
                  mode="object"
                  active={activeId === entity.id}
                  onClick={() => setActiveId(entity.id)}
                  onTogglePin={() =>
                    updateCustomSection(section.id, (current) => ({
                      ...current,
                      entityIds: current.entityIds.filter((id) => id !== entity.id),
                    }))
                  }
                  onDuplicate={() => duplicateEntity(entity)}
                  onDelete={() =>
                    updateCustomSection(section.id, (current) => ({
                      ...current,
                      entityIds: current.entityIds.filter((id) => id !== entity.id),
                    }))
                  }
                />
              ))}
            </AppSidebarSection>
          )
        })}

        <AppSidebarAddSection
          onCreate={(section) => setCustomSections((current) => [...current, section])}
        />

        <div className="h-4 shrink-0" />
      </div>
    </ScrollArea>
  )
}

export {
  AppSidebarAddSection,
  AppSidebarEntityPicker,
  AppSidebarEntityRow,
  AppSidebarObjectTypeMenu,
  AppSidebarOverview,
  AppSidebarPinnedObjectMenu,
  AppSidebarSection,
  AppSidebarSectionAction,
  AppSidebarSectionMenu,
  AppSidebarTypeLabel,
  type AppSidebarCustomSection,
  type AppSidebarEntity,
  type AppSidebarEntityKind,
  type AppSidebarSortMode,
}
