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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  trigger?: React.ReactNode
  className?: string
}

const toneClasses: Record<AppSidebarObjectTypeTone, string> = {
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

function AppSidebarObjectTypeCard({
  preset,
  onSelect,
}: {
  preset: AppSidebarObjectTypePreset
  onSelect: (preset: AppSidebarObjectTypePreset) => void
}) {
  const Icon = preset.icon

  return (
    <Item
      variant="outline"
      render={<button type="button" onClick={() => onSelect(preset)} />}
      className="min-h-[52px] flex-nowrap px-2 py-2.5 text-left hover:bg-muted/50"
    >
      <ItemMedia>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg border",
            toneClasses[preset.tone]
          )}
        >
          <Icon className="size-4" />
        </span>
      </ItemMedia>

      <ItemContent className="min-w-0">
        <ItemTitle className="w-full truncate font-semibold">{preset.label}</ItemTitle>
      </ItemContent>
    </Item>
  )
}

function AppSidebarObjectTypeStudio({
  onSelect,
  trigger,
  className,
}: AppSidebarObjectTypeStudioProps) {
  const [open, setOpen] = React.useState(false)
  const dialogContentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      const content = dialogContentRef.current
      const target = event.target

      if (!content || !(target instanceof Node)) return
      if (!content.contains(target)) setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown, true)
    document.addEventListener("keydown", handleKeyDown, true)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true)
      document.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [open])

  function selectPreset(preset: AppSidebarObjectTypePreset) {
    onSelect?.(preset)
    setOpen(false)
  }

  return (
    <div
      data-slot="app-sidebar-object-type-studio"
      className={cn(trigger ? "inline-flex" : "px-2", className)}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <span className="inline-flex" onClick={() => setOpen(true)}>
          {trigger ?? (
            <Button
              type="button"
              variant="ghost"
              size="default"
              className="w-full justify-start px-2 font-normal text-muted-foreground"
            >
              <PlusIcon data-icon="inline-start" />
              <span className="min-w-0 truncate">Add object type</span>
            </Button>
          )}
        </span>

        <DialogContent
          ref={dialogContentRef}
          showCloseButton={false}
          className={cn(
            "flex h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-6xl flex-col gap-0 overflow-hidden p-0",
            "sm:h-[calc(100dvh-4rem)] sm:w-[calc(100vw-4rem)] sm:max-w-6xl",
            "lg:h-[calc(100dvh-8rem)] lg:w-[calc(100vw-8rem)]"
          )}
        >
          <DialogHeader className="shrink-0 gap-1 border-b px-5 py-3.5">
            <DialogTitle className="text-lg font-semibold">Add new object type</DialogTitle>
            <DialogDescription className="sr-only">
              Choose a suggested or basic preset to add an object type.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea
            className={cn(
              "min-h-0 flex-1 bg-muted/20",
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
                    onSelect={selectPreset}
                  />
                ))}

                <Item
                  variant="outline"
                  render={<button type="button" />}
                  className="min-h-[52px] flex-nowrap px-2 py-2.5 text-left hover:bg-muted/50"
                >
                  <ItemMedia>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                      <PlusIcon className="size-4" />
                    </span>
                  </ItemMedia>
                  <ItemContent className="min-w-0">
                    <ItemTitle className="w-full truncate font-semibold">Create your own</ItemTitle>
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
                      onSelect={selectPreset}
                    />
                  ))}
                </div>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export {
  AppSidebarObjectTypeStudio,
  basicObjectTypes,
  suggestedObjectTypes,
  type AppSidebarObjectTypePreset,
  type AppSidebarObjectTypeStudioProps,
  type AppSidebarObjectTypeTone,
}
