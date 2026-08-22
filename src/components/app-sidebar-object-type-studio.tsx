"use client"

import * as React from "react"
import {
  ArchiveIcon,
  AudioLinesIcon,
  BookOpenIcon,
  BookmarkIcon,
  BoxesIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  CheckIcon,
  CircleCheckIcon,
  FileIcon,
  FileTextIcon,
  FilmIcon,
  GlobeIcon,
  ImageIcon,
  LightbulbIcon,
  MapPinIcon,
  MessageCircleIcon,
  PlusIcon,
  QuoteIcon,
  SearchIcon,
  SquareIcon,
  StickyNoteIcon,
  Table2Icon,
  TagIcon,
  UserIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type AppSidebarObjectTypeTone =
  | "blue"
  | "amber"
  | "rose"
  | "green"
  | "purple"
  | "gray"

type AppSidebarObjectTypePreset = {
  id: string
  label: string
  icon: React.ElementType
  tone: AppSidebarObjectTypeTone
}

type AppSidebarObjectTypeStudioProps = {
  onSelect?: (preset: AppSidebarObjectTypePreset) => void
  trigger?: React.ReactElement
  className?: string
}

const appSidebarObjectTypeToneClasses: Record<
  AppSidebarObjectTypeTone,
  string
> = {
  blue:
    "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
  amber:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  rose:
    "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300",
  green:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  purple:
    "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300",
  gray: "border-border bg-muted text-muted-foreground",
}

const suggestedObjectTypes: AppSidebarObjectTypePreset[] = [
  { id: "book", label: "Book", icon: BookOpenIcon, tone: "purple" },
  { id: "person", label: "Person", icon: UserIcon, tone: "amber" },
  { id: "area", label: "Area", icon: SquareIcon, tone: "purple" },
  { id: "meeting", label: "Meeting", icon: UsersIcon, tone: "rose" },
  { id: "quote", label: "Quote", icon: QuoteIcon, tone: "rose" },
  { id: "definition", label: "Definition", icon: BookmarkIcon, tone: "purple" },
  { id: "idea", label: "Idea", icon: LightbulbIcon, tone: "amber" },
  { id: "place", label: "Place", icon: MapPinIcon, tone: "green" },
  { id: "project", label: "Project", icon: BoxesIcon, tone: "green" },
  { id: "organization", label: "Organization", icon: Building2Icon, tone: "rose" },
  { id: "atomic-note", label: "Atomic note", icon: StickyNoteIcon, tone: "amber" },
  { id: "media", label: "Media", icon: FilmIcon, tone: "green" },
  { id: "travel", label: "Travel", icon: BriefcaseBusinessIcon, tone: "purple" },
]

const basicObjectTypes: AppSidebarObjectTypePreset[] = [
  { id: "page", label: "Page", icon: FileTextIcon, tone: "blue" },
  { id: "tag", label: "Tag", icon: TagIcon, tone: "amber" },
  { id: "image", label: "Image", icon: ImageIcon, tone: "rose" },
  { id: "weblink", label: "Weblink", icon: GlobeIcon, tone: "blue" },
  { id: "pdf", label: "PDF", icon: FileTextIcon, tone: "rose" },
  { id: "audio", label: "Audio", icon: AudioLinesIcon, tone: "rose" },
  { id: "file", label: "File", icon: FileIcon, tone: "rose" },
  { id: "tweet", label: "Tweet", icon: MessageCircleIcon, tone: "blue" },
  { id: "ai-chat", label: "AI chat", icon: MessageCircleIcon, tone: "purple" },
  { id: "table", label: "Table", icon: Table2Icon, tone: "blue" },
  { id: "task", label: "Task", icon: CircleCheckIcon, tone: "amber" },
  { id: "query", label: "Query", icon: SearchIcon, tone: "green" },
  { id: "archive", label: "Archive", icon: ArchiveIcon, tone: "gray" },
]

function AppSidebarObjectTypeIcon({
  preset,
  className,
}: {
  preset: AppSidebarObjectTypePreset
  className?: string
}) {
  const Icon = preset.icon

  return (
    <span
      data-slot="app-sidebar-object-type-icon"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg border",
        appSidebarObjectTypeToneClasses[preset.tone],
        className
      )}
    >
      <Icon className="size-[18px]" />
    </span>
  )
}

function AppSidebarObjectTypeCard({
  preset,
  selected,
  onSelect,
}: {
  preset: AppSidebarObjectTypePreset
  selected: boolean
  onSelect: (preset: AppSidebarObjectTypePreset) => void
}) {
  return (
    <Item
      variant="outline"
      data-selected={selected || undefined}
      render={<button type="button" onClick={() => onSelect(preset)} />}
      className={cn(
        "min-h-[52px] flex-nowrap gap-3 px-2 py-2.5 text-left",
        "hover:border-border/80 hover:bg-muted/40",
        "data-[selected=true]:border-foreground/20 data-[selected=true]:bg-muted/60"
      )}
    >
      <ItemMedia>
        <AppSidebarObjectTypeIcon preset={preset} />
      </ItemMedia>

      <ItemContent className="min-w-0">
        <ItemTitle
          className={cn(
            "w-full truncate font-semibold",
            !selected && "text-muted-foreground"
          )}
        >
          {preset.label}
        </ItemTitle>
      </ItemContent>

      {selected && (
        <span
          aria-hidden="true"
          className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
        >
          <CheckIcon className="size-3" />
        </span>
      )}
    </Item>
  )
}

function AppSidebarObjectTypeDetails({
  preset,
  customName,
  onCustomNameChange,
  onClose,
  onConfirm,
}: {
  preset: AppSidebarObjectTypePreset | null
  customName: string
  onCustomNameChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  const isCustom = preset === null
  const displayPreset: AppSidebarObjectTypePreset =
    preset ?? {
      id: "custom",
      label: customName || "Custom object type",
      icon: BoxesIcon,
      tone: "gray",
    }

  return (
    <aside
      data-slot="app-sidebar-object-type-details"
      className={cn(
        "absolute inset-0 z-20 flex min-h-0 flex-col overflow-hidden bg-background shadow-xl ring-1 ring-foreground/10",
        "sm:inset-y-2 sm:right-2 sm:left-auto sm:w-[22rem] sm:rounded-xl"
      )}
    >
      <div className="flex shrink-0 items-center gap-3 border-b p-4">
        <AppSidebarObjectTypeIcon preset={displayPreset} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {isCustom ? "Create your own" : preset.label}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Object type setup
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Close object type details"
          onClick={onClose}
        >
          <XIcon />
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 p-4">
          {isCustom ? (
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Name</span>
              <Input
                value={customName}
                placeholder="Object type name"
                autoFocus
                onChange={(event) => onCustomNameChange(event.target.value)}
              />
            </label>
          ) : (
            <>
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-sm font-medium">{preset.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Review this preset before adding it to the current space.
                </p>
              </div>

              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Preset
                </p>
                <p className="mt-1 text-sm">{preset.id}</p>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="shrink-0 border-t p-3">
        <Button
          type="button"
          className="w-full"
          disabled={isCustom && customName.trim().length === 0}
          onClick={onConfirm}
        >
          Add object type
        </Button>
      </div>
    </aside>
  )
}

function AppSidebarObjectTypeStudio({
  onSelect,
  trigger,
  className,
}: AppSidebarObjectTypeStudioProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] =
    React.useState<AppSidebarObjectTypePreset | null>(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [customName, setCustomName] = React.useState("")

  function resetSelection() {
    setSelectedPreset(null)
    setDetailsOpen(false)
    setCustomName("")
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) resetSelection()
  }

  function selectPreset(preset: AppSidebarObjectTypePreset) {
    setSelectedPreset(preset)
    setCustomName("")
    setDetailsOpen(true)
  }

  function selectCustom() {
    setSelectedPreset(null)
    setCustomName("")
    setDetailsOpen(true)
  }

  function confirmSelection() {
    if (selectedPreset) {
      onSelect?.(selectedPreset)
      setOpen(false)
      resetSelection()
      return
    }

    const name = customName.trim()
    if (!name) return

    onSelect?.({
      id: `custom-${crypto.randomUUID()}`,
      label: name,
      icon: BoxesIcon,
      tone: "gray",
    })
    setOpen(false)
    resetSelection()
  }

  return (
    <div
      data-slot="app-sidebar-object-type-studio"
      className={cn(trigger ? "inline-flex" : "px-2", className)}
    >
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            trigger ?? (
              <Button
                type="button"
                variant="ghost"
                size="default"
                className="w-full justify-start px-2 font-normal text-muted-foreground"
              >
                <PlusIcon data-icon="inline-start" />
                <span className="min-w-0 truncate">Add object type</span>
              </Button>
            )
          }
        />

        <DialogContent
          showCloseButton={false}
          className={cn(
            "flex h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-none flex-col gap-0 overflow-hidden p-0",
            "sm:h-[calc(100dvh-4rem)] sm:w-[calc(100vw-4rem)] sm:max-w-6xl",
            "lg:h-[calc(100dvh-8rem)] lg:w-[calc(100vw-8rem)]"
          )}
        >
          <DialogHeader className="shrink-0 gap-1 border-b px-5 py-3.5">
            <DialogTitle className="text-lg font-semibold">
              Add new object type
            </DialogTitle>
            <DialogDescription className="sr-only">
              Choose a suggested or basic preset, review it, and add the object type.
            </DialogDescription>
          </DialogHeader>

          <div className="relative flex min-h-0 flex-1 overflow-hidden bg-muted/20">
            <ScrollArea
              className={cn(
                "min-h-0 flex-1",
                "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:w-1.5",
                "[&_[data-slot=scroll-area-scrollbar]]:p-0",
                "[&_[data-slot=scroll-area-thumb]]:rounded-full"
              )}
            >
              <div className="flex min-h-full flex-col gap-3 px-5 pb-5 pt-2">
                <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {suggestedObjectTypes.map((preset) => (
                    <AppSidebarObjectTypeCard
                      key={preset.id}
                      preset={preset}
                      selected={detailsOpen && selectedPreset?.id === preset.id}
                      onSelect={selectPreset}
                    />
                  ))}

                  <Item
                    variant="outline"
                    data-selected={detailsOpen && selectedPreset === null || undefined}
                    render={<button type="button" onClick={selectCustom} />}
                    className={cn(
                      "min-h-[52px] flex-nowrap gap-3 px-2 py-2.5 text-left",
                      "hover:border-border/80 hover:bg-muted/40",
                      "data-[selected=true]:border-foreground/20 data-[selected=true]:bg-muted/60"
                    )}
                  >
                    <ItemMedia>
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                        <PlusIcon className="size-[18px]" />
                      </span>
                    </ItemMedia>
                    <ItemContent className="min-w-0">
                      <ItemTitle className="w-full truncate font-semibold text-muted-foreground">
                        Create your own
                      </ItemTitle>
                    </ItemContent>
                  </Item>
                </div>

                <section className="flex flex-col pb-4">
                  <h2 className="py-2 text-base font-medium">Basic types</h2>
                  <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {basicObjectTypes.map((preset) => (
                      <AppSidebarObjectTypeCard
                        key={preset.id}
                        preset={preset}
                        selected={detailsOpen && selectedPreset?.id === preset.id}
                        onSelect={selectPreset}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </ScrollArea>

            {detailsOpen && (
              <AppSidebarObjectTypeDetails
                preset={selectedPreset}
                customName={customName}
                onCustomNameChange={setCustomName}
                onClose={resetSelection}
                onConfirm={confirmSelection}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export {
  AppSidebarObjectTypeIcon,
  AppSidebarObjectTypeStudio,
  appSidebarObjectTypeToneClasses,
  basicObjectTypes,
  suggestedObjectTypes,
  type AppSidebarObjectTypePreset,
  type AppSidebarObjectTypeStudioProps,
  type AppSidebarObjectTypeTone,
}
