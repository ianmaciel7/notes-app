"use client"

import * as React from "react"
import {
  ArchiveIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  Code2Icon,
  FlaskConicalIcon,
  LightbulbIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
} from "lucide-react"

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
    label: "New",
    icon: PlusIcon,
    hints: [
      {
        description: "New",
        shortcut: {
          windows: ["Ctrl", "U"],
          mac: ["⌘", "U"],
        },
      },
    ],
  },
  {
    id: "search",
    label: "Search",
    icon: SearchIcon,
    hints: [
      {
        description: "Search",
        shortcut: {
          windows: ["Ctrl", "P", "or", "Ctrl", "K"],
          mac: ["⌘", "P", "or", "⌘", "K"],
        },
      },
      {
        description: "Open extended search",
        shortcut: {
          windows: ["Ctrl", "⇧", "P"],
          mac: ["⌘", "⇧", "P"],
        },
      },
    ],
  },
  {
    id: "explore",
    label: "Explore",
    icon: SparklesIcon,
    hints: [
      {
        description:
          "Open Explore. Use the shortcut again to start a new chat.",
        shortcut: {
          windows: ["Ctrl", "J"],
          mac: ["⌘", "J"],
        },
      },
      {
        description: "Open Explore in the side panel",
        shortcut: {
          windows: ["Ctrl", "⇧", "J"],
          mac: ["⇧", "⌘", "J"],
        },
      },
    ],
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: CalendarDaysIcon,
    hints: [
      {
        description:
          "Go to Calendar. Double-click or use the keyboard shortcut twice to jump to today.",
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
      {keys.map((key, index) =>
        key === "or" ? (
          <span
            key={`${key}-${index}`}
            className="px-0.5 text-xs text-muted-foreground"
          >
            or
          </span>
        ) : (
          <Kbd key={`${key}-${index}`}>{key}</Kbd>
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
      {hints.map((hint, index) => (
        <div key={index} className="flex flex-col gap-1.5">
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

  function clearTimer() {
    if (!timerRef.current) return
    clearTimeout(timerRef.current)
    timerRef.current = null
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

  React.useEffect(() => () => clearTimer(), [])

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
              "w-full justify-start px-2 font-normal",
              "data-[active=true]:bg-muted data-[active=true]:hover:bg-muted"
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
          side="bottom"
          align="start"
          sideOffset={8}
          alignOffset={0}
          className="pointer-events-none w-max max-w-40 text-sm leading-snug"
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
  { id: "labs", name: "Labs", icon: FlaskConicalIcon },
  { id: "projects", name: "Projects", icon: BriefcaseBusinessIcon },
  { id: "dev", name: "Dev", icon: Code2Icon },
  { id: "knowledge", name: "Knowledge", icon: BrainCircuitIcon },
  { id: "archive", name: "Archive", icon: ArchiveIcon },
]

function AppSidebarPrimaryActionsDemo() {
  const [spaces, setSpaces] = React.useState(demoSpaces)
  const [spaceId, setSpaceId] = React.useState("labs")
  const [activeAction, setActiveAction] =
    React.useState<AppSidebarPrimaryNavigationAction>("calendar")

  return (
    <AppSidebar
      spaces={spaces}
      value={spaceId}
      onValueChange={setSpaceId}
      onReorder={setSpaces}
    >
      <div className="px-2 pt-1">
        <AppSidebarPrimaryActions
          activeAction={activeAction}
          onAction={(action) => {
            if (action !== "new") setActiveAction(action)
          }}
        />
      </div>
    </AppSidebar>
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
