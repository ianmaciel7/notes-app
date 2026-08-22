"use client"

import * as React from "react"
import {
  ArchiveIcon,
  AudioLinesIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  BriefcaseBusinessIcon,
  ChevronRightIcon,
  Code2Icon,
  CornerDownLeftIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileType2Icon,
  Globe2Icon,
  ImageIcon,
  LightbulbIcon,
  SearchIcon,
  Table2Icon,
  CheckCircle2Icon,
} from "lucide-react"

import { AppSidebarOverview } from "@/components/app-sidebar-overview"
import {
  AppSidebarCalendarIcon,
  AppSidebarExploreIcon,
  AppSidebarPlusIcon,
  AppSidebarSearchIcon,
} from "@/components/app-sidebar-icons"
import { AppSidebarWorkspaceIcon } from "@/components/app-sidebar-source-icon"
import {
  AppSidebar,
  type AppSidebarSpace,
} from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type AppSidebarPrimaryActionId =
  | "new"
  | "search"
  | "explore"
  | "calendar"

type AppSidebarPrimaryNavigationAction = Exclude<
  AppSidebarPrimaryActionId,
  "new"
>

type AppSidebarShortcut = {
  windows: string[]
  mac: string[]
}

type AppSidebarPrimaryActionHint = {
  description: string
  shortcut?: AppSidebarShortcut
}

const newContentItems = [
  { label: "Página", icon: FileTextIcon, tone: "text-blue-500" },
  { label: "Tabela", icon: Table2Icon, tone: "text-blue-500" },
  { label: "Tarefa", icon: CheckCircle2Icon, tone: "text-orange-500" },
  { label: "Imagem", icon: ImageIcon, tone: "text-red-400" },
  { label: "Weblink", icon: Globe2Icon, tone: "text-blue-500" },
  { label: "Tweet", icon: FileImageIcon, tone: "text-sky-500" },
  { label: "PDF", icon: FileType2Icon, tone: "text-red-400" },
  { label: "Áudio", icon: AudioLinesIcon, tone: "text-red-400" },
  { label: "Arquivo", icon: FileIcon, tone: "text-red-400" },
]

function NewContentMenu({ action }: { action: AppSidebarPrimaryAction }) {
  const [query, setQuery] = React.useState("")
  const Icon = action.icon
  const items = newContentItems.filter((item) =>
    item.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  )

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="h-8 w-full justify-start gap-x-1.5 px-2 font-normal text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&_svg]:size-4"
          />
        }
      >
        <Icon data-icon="inline-start" />
        <span className="min-w-0 truncate">{action.label}</span>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={4}
        className="w-[22rem] max-w-[calc(100vw-1rem)] gap-2 rounded-xl p-2"
      >
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar"
            aria-label="Buscar tipo de conteúdo"
            className="h-8 bg-muted/60 pl-8"
            autoFocus
          />
        </div>

        <div className="max-h-[19rem] overflow-y-auto pr-0.5">
          {items.map(({ label, icon: Icon, tone }) => (
            <Button
              key={label}
              type="button"
              variant="ghost"
              className="h-8 w-full justify-start gap-2 px-1.5 font-normal"
            >
              <span className={cn("flex size-6 items-center justify-center rounded-md bg-muted", tone)}>
                <Icon className="size-4" />
              </span>
              <span className="truncate">{label}</span>
              <ChevronRightIcon className="ml-auto size-4 text-muted-foreground" />
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t px-1 pt-2 text-[11px] text-muted-foreground">
          <span><Kbd><ArrowUpIcon /></Kbd><Kbd><ArrowDownIcon /></Kbd> para navegar</span>
          <span><Kbd>Esc</Kbd> para abortar</span>
          <span><Kbd><CornerDownLeftIcon /></Kbd> para selecionar</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}

type AppSidebarPrimaryAction = {
  id: AppSidebarPrimaryActionId
  label: string
  icon: React.ElementType
  hints: AppSidebarPrimaryActionHint[]
}

type AppSidebarPrimaryActionsProps = {
  activeAction?: AppSidebarPrimaryNavigationAction
  onAction?: (action: AppSidebarPrimaryActionId) => void
  actions?: AppSidebarPrimaryAction[]
  className?: string
}

const defaultActions: AppSidebarPrimaryAction[] = [
  {
    id: "new",
    label: "Novo",
    icon: AppSidebarPlusIcon,
    hints: [
      {
        description: "Novo",
        shortcut: {
          windows: ["Ctrl", "U"],
          mac: ["⌘", "U"],
        },
      },
    ],
  },
  {
    id: "search",
    label: "Buscar",
    icon: AppSidebarSearchIcon,
    hints: [
      {
        description: "Buscar",
        shortcut: {
          windows: ["Ctrl", "P", "or", "Ctrl", "K"],
          mac: ["⌘", "P", "or", "⌘", "K"],
        },
      },
      {
        description: "Abrir busca estendida",
        shortcut: {
          windows: ["Ctrl", "⇧", "P"],
          mac: ["⌘", "⇧", "P"],
        },
      },
    ],
  },
  {
    id: "explore",
    label: "Explorar",
    icon: AppSidebarExploreIcon,
    hints: [
      {
        description: "Abrir Explorar. Use o atalho novamente para iniciar um novo chat.",
        shortcut: {
          windows: ["Ctrl", "J"],
          mac: ["⌘", "J"],
        },
      },
      {
        description: "Abrir Explorar no painel lateral",
        shortcut: {
          windows: ["Ctrl", "⇧", "J"],
          mac: ["⇧", "⌘", "J"],
        },
      },
    ],
  },
  {
    id: "calendar",
    label: "Calendário",
    icon: AppSidebarCalendarIcon,
    hints: [
      {
        description: "Ir para o Calendário. Clique duas vezes para ir para hoje.",
        shortcut: {
          windows: ["Ctrl", "Alt", "H"],
          mac: ["⌃", "⌘", "H"],
        },
      },
    ],
  },
]

function useIsMac() {
  const [isMac, setIsMac] = React.useState(false)

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform))
  }, [])

  return isMac
}

function AppSidebarShortcut({ shortcut }: { shortcut: AppSidebarShortcut }) {
  const isMac = useIsMac()
  const keys = isMac ? shortcut.mac : shortcut.windows

  return (
    <KbdGroup className="flex-wrap">
      {keys.map((key) =>
        key === "or" ? (
          <span
            key="or"
            className="px-0.5 text-xs text-muted-foreground"
          >
            ou
          </span>
        ) : (
          <Kbd key={key}>{key}</Kbd>
        )
      )}
    </KbdGroup>
  )
}

function AppSidebarPrimaryActionHintContent({
  hints,
}: {
  hints: AppSidebarPrimaryActionHint[]
}) {
  return (
    <div className="flex flex-col gap-3">
      {hints.map((hint) => (
        <div key={hint.description} className="flex flex-col gap-1.5">
          <p>{hint.description}</p>
          {hint.shortcut && <AppSidebarShortcut shortcut={hint.shortcut} />}
        </div>
      ))}
    </div>
  )
}

function AppSidebarPrimaryActionItem({
  action,
  active,
  onAction,
}: {
  action: AppSidebarPrimaryAction
  active: boolean
  onAction?: (action: AppSidebarPrimaryActionId) => void
}) {
  const isMobile = useIsMobile()
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const [open, setOpen] = React.useState(false)
  const Icon = action.icon

  const clearTimer = React.useCallback(() => {
    if (!timerRef.current) return
    clearTimeout(timerRef.current)
    timerRef.current = null
  }, [])

  React.useEffect(() => () => clearTimer(), [clearTimer])

  if (action.id === "new") {
    return <NewContentMenu action={action} />
  }

  function scheduleOpen() {
    if (isMobile) return

    clearTimer()
    timerRef.current = setTimeout(() => {
      setOpen(true)
      timerRef.current = null
    }, 200)
  }

  function closeHint() {
    clearTimer()
    setOpen(false)
  }

  return (
    <div
      data-slot="app-sidebar-primary-action"
      className="w-full"
      onPointerEnter={scheduleOpen}
      onPointerLeave={closeHint}
    >
      <HoverCard open={open && !isMobile}>
        <HoverCardTrigger render={<span className="block w-full" />}>
          <Button
            type="button"
            variant="ghost"
            size="default"
            data-active={active || undefined}
            className={cn(
              "h-8 w-full justify-start gap-x-1.5 px-2 font-normal",
              "text-sm text-muted-foreground",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "[&_svg]:size-4",
              "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
              "data-[active=true]:brightness-[0.965] data-[active=true]:hover:bg-sidebar-accent"
            )}
            onPointerDown={closeHint}
            onClick={() => {
              closeHint()
              onAction?.(action.id)
            }}
          >
            <Icon data-icon="inline-start" />
            <span className="min-w-0 truncate">{action.label}</span>
          </Button>
        </HoverCardTrigger>

        <HoverCardContent
          side="right"
          align="center"
          sideOffset={8}
          className="pointer-events-none w-max max-w-56 text-sm leading-snug"
        >
          <AppSidebarPrimaryActionHintContent hints={action.hints} />
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

function AppSidebarPrimaryActions({
  activeAction,
  onAction,
  actions = defaultActions,
  className,
}: AppSidebarPrimaryActionsProps) {
  return (
    <nav
      data-slot="app-sidebar-primary-actions"
      aria-label="Primary navigation"
      className={cn("flex w-full flex-col", className)}
    >
      {actions.map((action) => (
        <AppSidebarPrimaryActionItem
          key={action.id}
          action={action}
          active={action.id !== "new" && action.id === activeAction}
          onAction={onAction}
        />
      ))}
    </nav>
  )
}

const demoSpaces: AppSidebarSpace[] = [
  { id: "studies", name: "Studies", icon: BookOpenIcon },
  { id: "ideas", name: "Ideas", icon: LightbulbIcon },
  { id: "labs", name: "zzzzzzzzzz", icon: AppSidebarWorkspaceIcon },
  { id: "projects", name: "Projects", icon: BriefcaseBusinessIcon },
  { id: "dev", name: "Dev", icon: Code2Icon },
  { id: "knowledge", name: "Knowledge", icon: BrainCircuitIcon },
  { id: "archive", name: "Archive", icon: ArchiveIcon },
]

function AppSidebarPrimaryActionsDemo() {
  const [spaces, setSpaces] = React.useState(demoSpaces)
  const [spaceId, setSpaceId] = React.useState("labs")
  const [activeAction, setActiveAction] =
    React.useState<AppSidebarPrimaryNavigationAction | undefined>("calendar")
  const [activeEntityId, setActiveEntityId] = React.useState<string | null>(null)

  return (
    <TooltipProvider delay={200}>
      <AppSidebar
        spaces={spaces}
        value={spaceId}
        onValueChange={setSpaceId}
        onReorder={setSpaces}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="my-px mt-0 shrink-0 px-2 pr-1 pb-1.5">
            <AppSidebarPrimaryActions
              activeAction={activeAction}
              onAction={(action) => {
                if (action !== "new") {
                  setActiveAction(action)
                  setActiveEntityId(null)
                }
              }}
            />
          </div>

          <AppSidebarOverview
            activeId={activeEntityId}
            onActiveIdChange={(id) => {
              setActiveEntityId(id)
              if (id !== null) setActiveAction(undefined)
            }}
          />
        </div>
      </AppSidebar>
    </TooltipProvider>
  )
}

export {
  AppSidebarPrimaryActions,
  AppSidebarPrimaryActionsDemo,
  defaultActions,
  type AppSidebarPrimaryAction,
  type AppSidebarPrimaryActionHint,
  type AppSidebarPrimaryActionId,
  type AppSidebarPrimaryActionsProps,
  type AppSidebarPrimaryNavigationAction,
  type AppSidebarShortcut,
}
