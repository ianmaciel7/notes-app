"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  InboxIcon,
  LibraryBigIcon,
  MegaphoneIcon,
  MoonIcon,
  PinOffIcon,
  PlusIcon,
  RocketIcon,
  SettingsIcon,
  Share2Icon,
  SunIcon,
  Trash2Icon,
  UserRoundIcon,
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
  type AppSidebarObjectTypePreset,
} from "@/components/app-sidebar-object-type-studio"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type AppSidebarSortMode = "manual" | "alphabetical"

type AppSidebarTone = "blue" | "amber" | "rose" | "green" | "purple"

type AppSidebarPinnedEntity = {
  id: string
  label: string
  icon: React.ElementType
  tone: AppSidebarTone
}

type AppSidebarObjectType = {
  id: string
  label: string
  icon: React.ElementType
  tone: AppSidebarTone
  count: number
}

type AppSidebarCustomSection = {
  id: string
  label: string
  open: boolean
}

type AppSidebarDragState =
  | { kind: "pinned"; id: string }
  | { kind: "object-type"; id: string }
  | null

const toneClasses: Record<AppSidebarTone, string> = {
  blue:
    "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  rose:
    "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300",
  green:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  purple:
    "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
}

const allPinnedEntities: AppSidebarPinnedEntity[] = [
  {
    id: "page-1",
    label: "aaaaaaaaaaaaa",
    icon: AppSidebarPageIcon,
    tone: "blue",
  },
  {
    id: "page-2",
    label: "Projeto Alpha",
    icon: AppSidebarPageIcon,
    tone: "blue",
  },
  {
    id: "page-3",
    label: "Ideias 2026",
    icon: AppSidebarPageIcon,
    tone: "blue",
  },
]

const initialObjectTypes: AppSidebarObjectType[] = [
  {
    id: "atomic-note",
    label: "Notas atômicas",
    icon: AppSidebarAtomicNoteIcon,
    tone: "amber",
    count: 0,
  },
  {
    id: "quote",
    label: "Citações",
    icon: AppSidebarQuoteIcon,
    tone: "rose",
    count: 0,
  },
  {
    id: "page",
    label: "Páginas",
    icon: AppSidebarPageIcon,
    tone: "blue",
    count: 1,
  },
]

function reorderById<T extends { id: string }>(items: T[], fromId: string, toId: string) {
  if (fromId === toId) return items

  const from = items.findIndex((item) => item.id === fromId)
  const to = items.findIndex((item) => item.id === toId)
  if (from < 0 || to < 0) return items

  const next = [...items]
  const [moving] = next.splice(from, 1)
  if (!moving) return items

  next.splice(to, 0, moving)
  return next
}

function AppSidebarTypeLabel({
  icon: Icon,
  tone,
  children,
}: {
  icon: React.ElementType
  tone: AppSidebarTone
  children: React.ReactNode
}) {
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
          "items-center justify-center rounded-[0.33em]",
          toneClasses[tone]
        )}
      >
        <span className="inline-flex min-h-[1.3em] min-w-[1.3em] items-center justify-center rounded-[0.33em] p-[0.1em] text-[0.94em]">
          <Icon className="size-[1em]" />
        </span>
      </span>

      <span className="block min-w-0 truncate text-left text-[1em]">{children}</span>
    </span>
  )
}

function AppSidebarSectionMenu({
  value,
  onValueChange,
}: {
  value: AppSidebarSortMode
  onValueChange: (value: AppSidebarSortMode) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Ordenar seção"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-200",
          "group-hover/app-sidebar-section:opacity-70 hover:!opacity-100 data-popup-open:opacity-100"
        )}
      >
        <AppSidebarDotsIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-56">
        <DropdownMenuItem onClick={() => onValueChange("manual")}>
          Ordenar manualmente
          {value === "manual" && <CheckIcon className="ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onValueChange("alphabetical")}>
          Ordenar alfabeticamente
          {value === "alphabetical" && <CheckIcon className="ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppSidebarSection({
  icon: Icon,
  label,
  count,
  sort,
  onSortChange,
  action,
  open,
  onOpenChange,
  sticky = true,
  children,
}: {
  icon: React.ElementType
  label: string
  count?: number
  sort?: AppSidebarSortMode
  onSortChange?: (sort: AppSidebarSortMode) => void
  action?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  sticky?: boolean
  children?: React.ReactNode
}) {
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      data-slot="app-sidebar-section"
      className="flex shrink-0 flex-col"
    >
      <div
        className={cn(
          "group/app-sidebar-section mt-0 mr-2 ml-px bg-sidebar px-2 pr-1",
          sticky && "sticky top-0 z-[5]"
        )}
      >
        <div
          className={cn(
            "flex h-8 w-full items-center gap-x-1.5 truncate rounded-md px-2 py-1",
            "text-xs text-muted-foreground transition-colors duration-200 hover:bg-sidebar-accent"
          )}
        >
          <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-x-1.5 overflow-hidden text-left outline-none">
            <Icon className="size-[1em] shrink-0" />
            <span className="min-w-0 truncate font-medium">{label}</span>
            <span
              className={cn(
                "-ml-0.5 mr-1 flex size-4 shrink-0 items-center justify-center opacity-0",
                "transition duration-200 ease-in-out group-hover/app-sidebar-section:opacity-80"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-3 items-center justify-center transition-transform duration-200",
                  !open && "-rotate-90"
                )}
              >
                <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className="size-full">
                  <path d="m216.49 104.49-80 80a12 12 0 0 1-17 0l-80-80a12 12 0 0 1 17-17L128 159l71.51-71.52a12 12 0 0 1 17 17Z" />
                </svg>
              </span>
            </span>
            <span className="min-w-0 flex-1" />
          </CollapsibleTrigger>

          <div className="flex h-4 max-w-max shrink-0 items-center gap-px pb-px">
            {typeof count === "number" && (
              <span
                className={cn(
                  "inline-flex min-w-[1.3em] items-center justify-center rounded-[0.475em]",
                  "border border-transparent px-[0.49em] py-[0.2em] text-[11px] leading-[1.3]",
                  "text-muted-foreground opacity-0 transition-opacity duration-200",
                  "group-hover/app-sidebar-section:opacity-80"
                )}
              >
                {count}
              </span>
            )}

            {sort && onSortChange && (
              <AppSidebarSectionMenu value={sort} onValueChange={onSortChange} />
            )}

            {action}
          </div>
        </div>
      </div>

      <CollapsibleContent className="flex w-full max-w-full flex-col pt-0.5 pb-1.5">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

function AppSidebarPinnedMenu({
  entity,
  onUnpin,
}: {
  entity: AppSidebarPinnedEntity
  onUnpin: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Ações de ${entity.label}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-150",
          "group-hover/pinned-row:opacity-70 hover:!opacity-100 data-popup-open:opacity-100"
        )}
      >
        <AppSidebarDotsIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-64">
        <DropdownMenuItem>
          <ExternalLinkIcon />
          Abrir
        </DropdownMenuItem>
        <DropdownMenuItem>Abrir no painel lateral</DropdownMenuItem>
        <DropdownMenuItem>Abrir em nova aba</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onUnpin}>
          <PinOffIcon />
          Desafixar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppSidebarPinnedRow({
  entity,
  active,
  dragging,
  draggable,
  onSelect,
  onUnpin,
  onDragStart,
  onDrop,
}: {
  entity: AppSidebarPinnedEntity
  active: boolean
  dragging: boolean
  draggable: boolean
  onSelect: () => void
  onUnpin: () => void
  onDragStart: () => void
  onDrop: () => void
}) {
  return (
    <div
      data-slot="app-sidebar-pinned-row-wrapper"
      className="mx-2"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={(event) => {
        if (draggable) event.preventDefault()
      }}
      onDrop={(event) => {
        if (!draggable) return
        event.preventDefault()
        onDrop()
      }}
    >
      <div
        data-slot="app-sidebar-pinned-row"
        data-active={active || undefined}
        data-dragging={dragging || undefined}
        className={cn(
          "group/pinned-row flex h-[29px] w-full shrink-0 items-center rounded-md py-px pr-1.5 pl-[3px]",
          "text-left text-sm font-normal text-muted-foreground",
          "transition-[background-color,color,filter,opacity] duration-150",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground",
          "data-[active=true]:brightness-[0.965] data-[dragging=true]:opacity-40"
        )}
      >
        <button
          type="button"
          className="relative flex min-w-0 flex-1 items-center py-px text-left outline-none"
          onClick={onSelect}
        >
          <span
            className={cn(
              "flex w-12 min-w-0 flex-1 items-center gap-x-1.5 truncate",
              active && "font-medium"
            )}
          >
            <AppSidebarTypeLabel icon={entity.icon} tone={entity.tone}>
              {entity.label}
            </AppSidebarTypeLabel>
          </span>
        </button>

        <div
          className={cn(
            "flex w-0 max-w-max shrink-0 items-center overflow-hidden opacity-0",
            "transition-[width,opacity] duration-300 ease-in",
            "group-hover/pinned-row:w-[80px] group-hover/pinned-row:opacity-100 group-hover/pinned-row:ease-out"
          )}
        >
          <span className="ml-auto" />
          <AppSidebarPinnedMenu entity={entity} onUnpin={onUnpin} />
        </div>
      </div>
    </div>
  )
}

function AppSidebarObjectTypeMenu({
  objectType,
  onDuplicate,
  onDelete,
}: {
  objectType: AppSidebarObjectType
  onDuplicate: () => void
  onDelete: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Ações de ${objectType.label}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-150",
          "group-hover/object-type-row:opacity-70 hover:!opacity-100 data-popup-open:opacity-100"
        )}
      >
        <AppSidebarDotsIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-64">
        <DropdownMenuItem>
          <ExternalLinkIcon />
          Abrir
        </DropdownMenuItem>
        <DropdownMenuItem>Criar {objectType.label}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Configurações do tipo</DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <CopyIcon />
          Duplicar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2Icon />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppSidebarObjectTypeRow({
  objectType,
  active,
  dragging,
  draggable,
  onSelect,
  onDuplicate,
  onDelete,
  onDragStart,
  onDrop,
}: {
  objectType: AppSidebarObjectType
  active: boolean
  dragging: boolean
  draggable: boolean
  onSelect: () => void
  onDuplicate: () => void
  onDelete: () => void
  onDragStart: () => void
  onDrop: () => void
}) {
  return (
    <div
      data-slot="app-sidebar-object-type-row-wrapper"
      className="mx-2"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={(event) => {
        if (draggable) event.preventDefault()
      }}
      onDrop={(event) => {
        if (!draggable) return
        event.preventDefault()
        onDrop()
      }}
    >
      <div
        data-slot="app-sidebar-object-type-row"
        data-active={active || undefined}
        data-dragging={dragging || undefined}
        className={cn(
          "group/object-type-row flex h-[29px] w-full shrink-0 items-center rounded-md py-px pr-1.5 pl-[3px]",
          "text-left text-sm font-normal text-muted-foreground",
          "transition-[background-color,color,filter,opacity] duration-150",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground",
          "data-[active=true]:brightness-[0.965] data-[dragging=true]:opacity-40"
        )}
      >
        <button
          type="button"
          className="relative flex min-w-0 flex-1 items-center py-px text-left outline-none"
          onClick={onSelect}
        >
          <span className="flex w-12 min-w-0 flex-1 items-center gap-x-1.5 truncate">
            <AppSidebarTypeLabel icon={objectType.icon} tone={objectType.tone}>
              {objectType.label}
            </AppSidebarTypeLabel>
          </span>
        </button>

        <div
          className={cn(
            "flex w-0 max-w-max shrink-0 items-center overflow-hidden opacity-0",
            "transition-[width,opacity] duration-300 ease-in",
            "group-hover/object-type-row:w-[80px] group-hover/object-type-row:opacity-100 group-hover/object-type-row:ease-out"
          )}
        >
          <span
            className={cn(
              "text-[11px] text-muted-foreground opacity-0 transition-opacity duration-200",
              "group-hover/object-type-row:opacity-80"
            )}
          >
            <span className="inline-flex min-w-[1.3em] items-center justify-center rounded-[0.475em] border border-transparent px-[0.49em] py-[0.2em] leading-[1.3]">
              {objectType.count}
            </span>
          </span>

          <AppSidebarObjectTypeMenu
            objectType={objectType}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  )
}

function AppSidebarPinnedPicker({
  entities,
  selectedIds,
  onPick,
}: {
  entities: AppSidebarPinnedEntity[]
  selectedIds: Set<string>
  onPick: (entity: AppSidebarPinnedEntity) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const results = React.useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR")
    return entities.filter((entity) => {
      if (selectedIds.has(entity.id)) return false
      return !normalized || entity.label.toLocaleLowerCase("pt-BR").includes(normalized)
    })
  }, [entities, query, selectedIds])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Adicionar conteúdo aos Fixados"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-200",
          "group-hover/app-sidebar-section:opacity-100 data-popup-open:opacity-100"
        )}
      >
        <AppSidebarPlusIcon />
      </PopoverTrigger>

      <PopoverContent side="right" align="start" sideOffset={8} className="w-72 gap-1 p-1.5">
        <Input
          autoFocus
          value={query}
          className="h-8"
          placeholder="Adicionar conteúdo"
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="max-h-64 overflow-y-auto pt-1">
          {results.map((entity) => (
            <Button
              key={entity.id}
              type="button"
              variant="ghost"
              className="h-8 w-full justify-start px-1.5 font-normal"
              onClick={() => {
                onPick(entity)
                setQuery("")
                setOpen(false)
              }}
            >
              <AppSidebarTypeLabel icon={entity.icon} tone={entity.tone}>
                {entity.label}
              </AppSidebarTypeLabel>
            </Button>
          ))}

          {results.length === 0 && (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              Nenhum conteúdo disponível
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function AppSidebarSectionAction({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Button
      data-slot="app-sidebar-section-action"
      type="button"
      variant="outline"
      size="icon-xs"
      aria-label={label}
      className="size-[22px] opacity-0 transition-opacity duration-200 group-hover/app-sidebar-section:opacity-100"
      onClick={onClick}
    >
      <PlusIcon />
    </Button>
  )
}

function AppSidebarAddSection({
  onCreate,
}: {
  onCreate: (section: AppSidebarCustomSection) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")

  function create() {
    const label = name.trim()
    if (!label) return

    onCreate({ id: crypto.randomUUID(), label, open: true })
    setName("")
    setOpen(false)
  }

  return (
    <div data-slot="app-sidebar-add-section" className="mt-0 mr-2 ml-px bg-sidebar px-2 pr-0.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "pointer-events-none h-8 w-full justify-start gap-x-1.5 px-2 font-normal text-muted-foreground",
            "opacity-0 transition-opacity duration-200",
            "group-hover/section-container:pointer-events-auto group-hover/section-container:opacity-60",
            "hover:!opacity-100 data-popup-open:pointer-events-auto data-popup-open:opacity-100"
          )}
        >
          <AppSidebarPlusIcon />
          <span className="min-w-0 truncate">Adicionar seção</span>
        </PopoverTrigger>

        <PopoverContent side="right" align="start" sideOffset={8} className="w-72 gap-2 p-2">
          <Input
            autoFocus
            value={name}
            className="h-8"
            placeholder="Nome da seção"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return
              event.preventDefault()
              create()
            }}
          />
          <Button type="button" size="sm" className="w-full" disabled={!name.trim()} onClick={create}>
            Criar
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const utilityRowClass = cn(
  buttonVariants({ variant: "ghost", size: "default" }),
  "group/utility h-8 w-full justify-start gap-x-1.5 px-2 font-normal text-muted-foreground",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:brightness-[0.97]"
)

function AppSidebarUtilityRow({
  icon: Icon,
  label,
  external,
  tooltip,
  active,
  onClick,
}: {
  icon: React.ElementType
  label: string
  external?: boolean
  tooltip?: string
  active?: boolean
  onClick?: () => void
}) {
  const row = (
    <span className="flex w-full min-w-0 items-center">
      <Icon className="mr-1.5 size-4 shrink-0" />
      <span className="min-w-0 truncate">{label}</span>
      {external && (
        <ExternalLinkIcon
          className={cn(
            "ml-auto size-3 shrink-0 opacity-0 transition-opacity duration-200 ease-out",
            "group-hover/utility:opacity-100"
          )}
        />
      )}
    </span>
  )

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger
          data-slot="app-sidebar-utility-row"
          className={cn(
            utilityRowClass,
            active && "bg-sidebar-accent text-sidebar-accent-foreground brightness-[0.965]"
          )}
          onClick={onClick}
        >
          {row}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Button
      data-slot="app-sidebar-utility-row"
      type="button"
      variant="ghost"
      className={cn(
        utilityRowClass,
        active && "bg-sidebar-accent text-sidebar-accent-foreground brightness-[0.965]"
      )}
      onClick={onClick}
    >
      {row}
    </Button>
  )
}

function AppSidebarHelpSection() {
  const [open, setOpen] = React.useState(true)

  return (
    <AppSidebarSection
      icon={HelpCircleIcon}
      label="Ajuda e recursos"
      open={open}
      onOpenChange={setOpen}
    >
      <div data-slot="app-sidebar-help-items" className="flex flex-col px-2 pr-0.5">
        <AppSidebarUtilityRow icon={GraduationCapIcon} label="Primeiros passos" />
        <AppSidebarUtilityRow
          icon={HelpCircleIcon}
          label="Fazer uma pergunta"
          external
          tooltip="Faça perguntas sobre o Capacities"
        />
        <AppSidebarUtilityRow
          icon={LibraryBigIcon}
          label="Documentação"
          external
          tooltip="Saiba mais sobre o Capacities e como você pode usá-lo"
        />
        <AppSidebarUtilityRow icon={MegaphoneIcon} label="Novidades" />
        <AppSidebarUtilityRow
          icon={InboxIcon}
          label="Feedback"
          external
          tooltip="Compartilhe ideias, feedback ou problemas e vote em recursos"
        />
      </div>
    </AppSidebarSection>
  )
}

const footerIconClass = cn(
  buttonVariants({ variant: "ghost", size: "icon" }),
  "size-8 shrink-0 text-muted-foreground",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:brightness-[0.97]"
)

function AppSidebarFooterTooltip({
  label,
  children,
  onClick,
}: {
  label: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        data-slot="app-sidebar-footer-action"
        aria-label={label}
        className={footerIconClass}
        onClick={onClick}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={7}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function AppSidebarFooter() {
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    return () => document.documentElement.classList.remove("dark")
  }, [dark])

  return (
    <footer
      data-slot="app-sidebar-footer"
      className="flex shrink-0 flex-col gap-y-px px-2.5 py-1.5 pr-1 text-xs"
    >
      <div className="flex w-full flex-wrap items-center gap-x-0.5">
        <AppSidebarFooterTooltip label="Configurações">
          <SettingsIcon className="size-4" strokeWidth={1.75} />
        </AppSidebarFooterTooltip>

        <AppSidebarFooterTooltip
          label={dark ? "Usar tema claro" : "Usar tema escuro"}
          onClick={() => setDark((value) => !value)}
        >
          {dark ? (
            <SunIcon className="size-4" strokeWidth={1.75} />
          ) : (
            <MoonIcon className="size-4" strokeWidth={1.75} />
          )}
        </AppSidebarFooterTooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Perfil pessoal"
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "h-8 w-auto shrink-0 gap-x-1.5 px-1.5 text-xs font-normal text-muted-foreground",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "active:brightness-[0.97] data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
            )}
          >
            <UserRoundIcon className="size-4" strokeWidth={1.75} />
            <Badge
              variant="secondary"
              className="max-w-full gap-1 px-[0.49em] py-[0.2em] text-xs font-normal leading-[1.3] opacity-80"
            >
              <RocketIcon className="size-3" strokeWidth={1.75} />
              <span className="truncate">Pro</span>
            </Badge>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" sideOffset={6} className="w-56">
            <DropdownMenuItem>Minha conta</DropdownMenuItem>
            <DropdownMenuItem>Gerenciar plano</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="min-w-0 flex-1" />

        <AppSidebarFooterTooltip label="Compartilhar">
          <Share2Icon className="size-4" strokeWidth={1.75} />
        </AppSidebarFooterTooltip>
      </div>
    </footer>
  )
}

type AppSidebarOverviewProps = {
  activeId?: string | null
  onActiveIdChange?: (id: string | null) => void
}

function AppSidebarOverview({
  activeId: controlledActiveId,
  onActiveIdChange,
}: AppSidebarOverviewProps = {}) {
  const [internalActiveId, setInternalActiveId] = React.useState<string | null>("page-1")
  const isControlled = controlledActiveId !== undefined
  const activeId = isControlled ? controlledActiveId : internalActiveId

  function setActiveId(id: string | null) {
    if (!isControlled) setInternalActiveId(id)
    onActiveIdChange?.(id)
  }
  const [pinnedOpen, setPinnedOpen] = React.useState(true)
  const [objectTypesOpen, setObjectTypesOpen] = React.useState(true)
  const [pinnedSort, setPinnedSort] = React.useState<AppSidebarSortMode>("manual")
  const [objectSort, setObjectSort] = React.useState<AppSidebarSortMode>("manual")
  const [pinned, setPinned] = React.useState<AppSidebarPinnedEntity[]>([
    allPinnedEntities[0]!,
  ])
  const [objectTypes, setObjectTypes] = React.useState(initialObjectTypes)
  const [customSections, setCustomSections] = React.useState<AppSidebarCustomSection[]>([])
  const [drag, setDrag] = React.useState<AppSidebarDragState>(null)

  const pinnedIds = React.useMemo(() => new Set(pinned.map((entity) => entity.id)), [pinned])

  const visiblePinned = React.useMemo(
    () =>
      pinnedSort === "alphabetical"
        ? [...pinned].sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))
        : pinned,
    [pinned, pinnedSort]
  )

  const visibleObjectTypes = React.useMemo(
    () =>
      objectSort === "alphabetical"
        ? [...objectTypes].sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))
        : objectTypes,
    [objectSort, objectTypes]
  )

  function addObjectType(preset: AppSidebarObjectTypePreset) {
    setObjectTypes((current) => {
      if (current.some((entity) => entity.id === preset.id)) return current

      return [
        ...current,
        {
          id: preset.id,
          label: preset.label,
          icon: preset.icon,
          tone: preset.tone === "gray" ? "blue" : preset.tone,
          count: 0,
        },
      ]
    })
  }

  function duplicateObjectType(objectType: AppSidebarObjectType) {
    const copy = {
      ...objectType,
      id: `${objectType.id}-${crypto.randomUUID()}`,
      label: `${objectType.label} (cópia)`,
    }
    setObjectTypes((current) => [...current, copy])
    setActiveId(copy.id)
  }

  return (
    <div data-slot="app-sidebar-overview" className="flex min-h-0 flex-1 flex-col">
      <div data-slot="app-sidebar-pinned-region" className="shrink-0">
        <AppSidebarSection
          icon={AppSidebarPinIcon}
          label="Fixados"
          count={pinned.length}
          sort={pinnedSort}
          onSortChange={setPinnedSort}
          open={pinnedOpen}
          onOpenChange={setPinnedOpen}
          sticky={false}
          action={
            <AppSidebarPinnedPicker
              entities={allPinnedEntities}
              selectedIds={pinnedIds}
              onPick={(entity) => setPinned((current) => [...current, entity])}
            />
          }
        >
          {visiblePinned.length === 0 ? (
            <p className="h-10 px-5 py-1.5 text-xs italic leading-[18px] text-muted-foreground">
              Nenhum conteúdo fixado
            </p>
          ) : (
            visiblePinned.map((entity) => (
              <AppSidebarPinnedRow
                key={entity.id}
                entity={entity}
                active={activeId === entity.id}
                dragging={drag?.kind === "pinned" && drag.id === entity.id}
                draggable={pinnedSort === "manual"}
                onSelect={() => setActiveId(entity.id)}
                onUnpin={() =>
                  setPinned((current) => current.filter((item) => item.id !== entity.id))
                }
                onDragStart={() => setDrag({ kind: "pinned", id: entity.id })}
                onDrop={() => {
                  if (drag?.kind !== "pinned" || pinnedSort !== "manual") return
                  setPinned((current) => reorderById(current, drag.id, entity.id))
                  setDrag(null)
                }}
              />
            ))
          )}
        </AppSidebarSection>
      </div>

      <ScrollArea
        data-slot="app-sidebar-scroll-area"
        className={cn(
          "group/section-container relative mt-0.5 h-32 min-h-0 grow",
          "[&_[data-slot=scroll-area-viewport]>div]:!flex",
          "[&_[data-slot=scroll-area-viewport]>div]:!min-h-full",
          "[&_[data-slot=scroll-area-viewport]>div]:!w-full",
          "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:!w-[6px]",
          "[&_[data-slot=scroll-area-scrollbar]]:!p-0"
        )}
      >
        <div className="flex min-h-full w-full flex-col">
          <AppSidebarSection
            icon={AppSidebarObjectsIcon}
            label="Tipos de objeto"
            count={objectTypes.length}
            sort={objectSort}
            onSortChange={setObjectSort}
            open={objectTypesOpen}
            onOpenChange={setObjectTypesOpen}
            action={
              <AppSidebarObjectTypeStudio
                onSelect={addObjectType}
                trigger={<AppSidebarSectionAction label="Criar tipo de objeto" />}
              />
            }
          >
            {visibleObjectTypes.map((objectType) => (
              <AppSidebarObjectTypeRow
                key={objectType.id}
                objectType={objectType}
                active={activeId === objectType.id}
                dragging={drag?.kind === "object-type" && drag.id === objectType.id}
                draggable={objectSort === "manual"}
                onSelect={() => setActiveId(objectType.id)}
                onDuplicate={() => duplicateObjectType(objectType)}
                onDelete={() =>
                  setObjectTypes((current) =>
                    current.filter((item) => item.id !== objectType.id)
                  )
                }
                onDragStart={() => setDrag({ kind: "object-type", id: objectType.id })}
                onDrop={() => {
                  if (drag?.kind !== "object-type" || objectSort !== "manual") return
                  setObjectTypes((current) => reorderById(current, drag.id, objectType.id))
                  setDrag(null)
                }}
              />
            ))}
          </AppSidebarSection>

          {customSections.map((section) => (
            <AppSidebarSection
              key={section.id}
              icon={AppSidebarObjectsIcon}
              label={section.label}
              open={section.open}
              onOpenChange={(open) =>
                setCustomSections((current) =>
                  current.map((item) =>
                    item.id === section.id ? { ...item, open } : item
                  )
                )
              }
            >
              <p className="h-10 px-5 py-1.5 text-xs italic leading-[18px] text-muted-foreground">
                Nenhum conteúdo
              </p>
            </AppSidebarSection>
          ))}

          <AppSidebarAddSection
            onCreate={(section) => setCustomSections((current) => [...current, section])}
          />

          <div className="h-4 w-full shrink-0" />

          <div data-slot="app-sidebar-lower-content" className="mt-auto flex w-full flex-col pb-2">
            <div className="flex flex-col px-2 pr-0.5">
              <AppSidebarUtilityRow
                icon={Trash2Icon}
                label="Lixeira"
                active={activeId === "trash"}
                onClick={() => setActiveId("trash")}
              />
            </div>

            <div className="mt-2">
              <AppSidebarHelpSection />
            </div>
          </div>
        </div>
      </ScrollArea>

      <AppSidebarFooter />
    </div>
  )
}

export {
  AppSidebarAddSection,
  AppSidebarFooter,
  AppSidebarHelpSection,
  AppSidebarObjectTypeRow,
  AppSidebarOverview,
  AppSidebarPinnedPicker,
  AppSidebarPinnedRow,
  AppSidebarSection,
  AppSidebarSectionAction,
  AppSidebarSectionMenu,
  AppSidebarTypeLabel,
  AppSidebarUtilityRow,
  type AppSidebarCustomSection,
  type AppSidebarObjectType,
  type AppSidebarPinnedEntity,
  type AppSidebarSortMode,
  type AppSidebarTone,
}
