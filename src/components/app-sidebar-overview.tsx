"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  FilesIcon,
  LayoutListIcon,
  PinIcon,
  PinOffIcon,
  PlusIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react"

import {
  AppSidebarObjectTypeStudio,
  type AppSidebarObjectTypePreset,
} from "@/components/app-sidebar-object-type-studio"
import { Button } from "@/components/ui/button"
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
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type AppSidebarSortMode = "manual" | "alphabetical"

type AppSidebarEntity = {
  id: string
  label: string
  icon: React.ElementType
  toneClassName?: string
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
  children?: React.ReactNode
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
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Ordenar seção"
            className="opacity-0 group-hover/app-sidebar-section:opacity-100 data-popup-open:opacity-100"
          />
        }
      >
        <EllipsisIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" sideOffset={6} className="w-72">
        <DropdownMenuItem onClick={() => onValueChange("manual")}>
          <LayoutListIcon />
          Ordenar manualmente
          {value === "manual" && <CheckIcon className="ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onValueChange("alphabetical")}>
          <LayoutListIcon />
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
  sort = "manual",
  onSortChange,
  action,
  emptyLabel,
  defaultOpen = true,
  children,
}: AppSidebarSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const hasChildren = React.Children.count(children) > 0

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="group/app-sidebar-section sticky top-0 z-10 bg-sidebar px-2">
        <div className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-muted/50">
          <CollapsibleTrigger
            render={
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-1.5 text-left outline-none"
              />
            }
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="truncate font-medium">{label}</span>
          </CollapsibleTrigger>

          {typeof count === "number" && (
            <span className="text-[11px] tabular-nums opacity-0 group-hover/app-sidebar-section:opacity-100">
              {count}
            </span>
          )}

          <AppSidebarSectionMenu
            value={sort}
            onValueChange={onSortChange ?? (() => {})}
          />

          {action}
        </div>
      </div>

      <CollapsibleContent className="flex flex-col gap-0.5 pb-1.5">
        {hasChildren ? (
          children
        ) : emptyLabel ? (
          <div className="px-5 py-2 text-xs italic text-muted-foreground">{emptyLabel}</div>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  )
}

function AppSidebarSectionAction({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-xs"
      aria-label={label}
      className="opacity-0 group-hover/app-sidebar-section:opacity-100"
      onClick={onClick}
    >
      <PlusIcon />
    </Button>
  )
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
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            aria-label="Adicionar existente"
            className="opacity-0 group-hover/app-sidebar-section:opacity-100 data-popup-open:opacity-100"
          />
        }
      >
        <PlusIcon />
      </PopoverTrigger>

      <PopoverContent side="right" align="start" sideOffset={8} className="w-96 p-2">
        <Input
          autoFocus
          value={query}
          placeholder="Buscar"
          className="mb-1.5 h-9 bg-muted/60"
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            <div className="flex flex-col gap-1">
              {results.map((entity) => {
                const Icon = entity.icon
                return (
                  <button
                    key={entity.id}
                    type="button"
                    className="flex h-10 w-full items-center gap-2 rounded-md px-2 text-left text-sm hover:bg-muted"
                    onClick={() => {
                      onPick(entity)
                      setOpen(false)
                    }}
                  >
                    <span className={cn("flex size-7 items-center justify-center rounded-md border bg-background", entity.toneClassName)}>
                      <Icon className="size-4" />
                    </span>
                    <span className="truncate">{entity.label}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">Nenhum objeto encontrado</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function AppSidebarObjectMenu({
  entity,
  pinned,
  onOpen,
  onTogglePin,
  onDuplicate,
  onDelete,
}: {
  entity: AppSidebarEntity
  pinned?: boolean
  onOpen?: () => void
  onTogglePin?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Ações de ${entity.label}`}
            className="opacity-0 group-hover/app-sidebar-entity-row:opacity-100 data-popup-open:opacity-100"
          />
        }
      >
        <EllipsisIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-80">
        <DropdownMenuItem onClick={onOpen}>
          <ExternalLinkIcon />
          Abrir
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onTogglePin}>
          {pinned ? <PinOffIcon /> : <PinIcon />}
          {pinned ? "Desafixar do Espaço" : "Fixar na Barra Lateral"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SettingsIcon />
          Configurações do Tipo de Objeto
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDuplicate}>
          <CopyIcon />
          Duplicar
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2Icon />
          Excluir Objeto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AppSidebarEntityRow({
  entity,
  active,
  pinned,
  onClick,
  onTogglePin,
  onDuplicate,
  onDelete,
}: {
  entity: AppSidebarEntity
  active?: boolean
  pinned?: boolean
  onClick?: () => void
  onTogglePin?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
}) {
  const Icon = entity.icon

  return (
    <div className="group/app-sidebar-entity-row mx-2 flex h-9 items-center rounded-md pr-1 hover:bg-muted/60 data-[active=true]:bg-muted" data-active={active || undefined}>
      <Item
        size="xs"
        render={<button type="button" onClick={onClick} />}
        className="min-w-0 flex-1 flex-nowrap border-0 bg-transparent px-2 py-1 hover:bg-transparent"
      >
        <ItemMedia>
          <span className={cn("flex size-6 items-center justify-center rounded-md border bg-background", entity.toneClassName)}>
            <Icon className="size-3.5" />
          </span>
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle className="w-full truncate font-normal">{entity.label}</ItemTitle>
        </ItemContent>
      </Item>

      <AppSidebarObjectMenu
        entity={entity}
        pinned={pinned}
        onOpen={onClick}
        onTogglePin={onTogglePin}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    </div>
  )
}

const demoEntities: AppSidebarEntity[] = [
  { id: "page-1", label: "aaaaaaaaaaaaa", icon: FilesIcon, toneClassName: "text-blue-600" },
  { id: "note-1", label: "Ideias do produto", icon: FilesIcon, toneClassName: "text-amber-600" },
  { id: "quote-1", label: "Design is how it works", icon: FilesIcon, toneClassName: "text-rose-600" },
]

const initialObjectTypes: AppSidebarEntity[] = [
  { id: "atomic-note", label: "Notas atômicas", icon: FilesIcon, toneClassName: "text-amber-600" },
  { id: "quote", label: "Citações", icon: FilesIcon, toneClassName: "text-rose-600" },
  { id: "page", label: "Páginas", icon: FilesIcon, toneClassName: "text-blue-600" },
]

function AppSidebarOverview() {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [pinnedSort, setPinnedSort] = React.useState<AppSidebarSortMode>("manual")
  const [objectSort, setObjectSort] = React.useState<AppSidebarSortMode>("manual")
  const [pinned, setPinned] = React.useState<AppSidebarEntity[]>([])
  const [entities, setEntities] = React.useState(demoEntities)
  const [objectTypes, setObjectTypes] = React.useState(initialObjectTypes)

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

  function duplicateEntity(entity: AppSidebarEntity) {
    const copy = { ...entity, id: `${entity.id}-${crypto.randomUUID()}`, label: `${entity.label} (cópia)` }
    setEntities((current) => [...current, copy])
    if (pinnedIds.has(entity.id)) setPinned((current) => [...current, copy])
    setActiveId(copy.id)
  }

  function deleteEntity(id: string) {
    setEntities((current) => current.filter((entity) => entity.id !== id))
    setPinned((current) => current.filter((entity) => entity.id !== id))
    setActiveId((current) => (current === id ? null : current))
  }

  function addObjectType(preset: AppSidebarObjectTypePreset) {
    setObjectTypes((current) =>
      current.some((entity) => entity.id === preset.id)
        ? current
        : [...current, { id: preset.id, label: preset.label, icon: preset.icon, toneClassName: `text-${preset.tone}-600` }]
    )
  }

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex min-h-full flex-col py-1">
        <AppSidebarSection
          icon={PinIcon}
          label="Fixados"
          count={pinned.length}
          sort={pinnedSort}
          onSortChange={setPinnedSort}
          emptyLabel="Nenhum conteúdo fixado"
          action={<AppSidebarEntityPicker entities={entities} selectedIds={pinnedIds} onPick={(entity) => setPinned((current) => [...current, entity])} />}
        >
          {visiblePinned.map((entity) => (
            <AppSidebarEntityRow
              key={entity.id}
              entity={entity}
              active={activeId === entity.id}
              pinned
              onClick={() => setActiveId(entity.id)}
              onTogglePin={() => setPinned((current) => current.filter((item) => item.id !== entity.id))}
              onDuplicate={() => duplicateEntity(entity)}
              onDelete={() => deleteEntity(entity.id)}
            />
          ))}
        </AppSidebarSection>

        <AppSidebarSection
          icon={FilesIcon}
          label="Tipos de objeto"
          count={objectTypes.length}
          sort={objectSort}
          onSortChange={setObjectSort}
          action={
            <AppSidebarObjectTypeStudio
              onSelect={addObjectType}
              trigger={
                <AppSidebarSectionAction label="Criar tipo de objeto" />
              }
            />
          }
        >
          {visibleObjectTypes.map((entity) => (
            <AppSidebarEntityRow
              key={entity.id}
              entity={entity}
              active={activeId === entity.id}
              pinned={pinnedIds.has(entity.id)}
              onClick={() => setActiveId(entity.id)}
              onTogglePin={() => {
                setPinned((current) =>
                  current.some((item) => item.id === entity.id)
                    ? current.filter((item) => item.id !== entity.id)
                    : [...current, entity]
                )
              }}
              onDuplicate={() => duplicateEntity(entity)}
              onDelete={() => setObjectTypes((current) => current.filter((item) => item.id !== entity.id))}
            />
          ))}
        </AppSidebarSection>
      </div>
    </ScrollArea>
  )
}

export {
  AppSidebarEntityPicker,
  AppSidebarEntityRow,
  AppSidebarObjectMenu,
  AppSidebarOverview,
  AppSidebarSection,
  AppSidebarSectionAction,
  AppSidebarSectionMenu,
  type AppSidebarEntity,
  type AppSidebarSortMode,
}
