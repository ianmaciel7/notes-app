"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDashedIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type AppHeaderProps = React.ComponentProps<"header"> & {
  backDisabled?: boolean
  forwardDisabled?: boolean
  onBack?: () => void
  onForward?: () => void
  onFocus?: () => void
  backLabel?: string
  forwardLabel?: string
  focusLabel?: string
}

type AppFocusModeControlsProps = React.ComponentProps<"div"> & {
  backDisabled?: boolean
  forwardDisabled?: boolean
  onBack?: () => void
  onForward?: () => void
  onExit?: () => void
  backLabel?: string
  forwardLabel?: string
  exitLabel?: string
}

function AppHeader({
  className,
  children,
  backDisabled = false,
  forwardDisabled = false,
  onBack,
  onForward,
  onFocus,
  backLabel = "Back",
  forwardLabel = "Forward",
  focusLabel = "Enter focus mode",
  ...props
}: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={cn(
        "flex h-[46px] w-full shrink-0 grow-0 items-center justify-between bg-sidebar",
        className
      )}
      {...props}
    >
      <div
        data-slot="app-header-start"
        className="flex h-full shrink-0 items-center gap-x-2 pl-2.5"
      >
        <AppHeaderHistory
          backDisabled={backDisabled}
          forwardDisabled={forwardDisabled}
          onBack={onBack}
          onForward={onForward}
          backLabel={backLabel}
          forwardLabel={forwardLabel}
        />
      </div>

      <div
        data-slot="app-header-content"
        className="flex min-w-0 flex-1 items-center"
      >
        {children}
      </div>

      <div
        data-slot="app-header-end"
        className="flex max-w-max shrink-0 items-center justify-end pr-2.5 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-1 px-1">
          <AppHeaderAction aria-label={focusLabel} tooltip={focusLabel} onClick={onFocus}>
            <CircleDashedIcon />
          </AppHeaderAction>
        </div>
      </div>
    </header>
  )
}

function AppHeaderHistory({
  backDisabled = false,
  forwardDisabled = false,
  onBack,
  onForward,
  backLabel = "Back",
  forwardLabel = "Forward",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  backDisabled?: boolean
  forwardDisabled?: boolean
  onBack?: () => void
  onForward?: () => void
  backLabel?: string
  forwardLabel?: string
}) {
  return (
    <div
      data-slot="app-header-history"
      className={cn("flex items-center", className)}
      {...props}
    >
      <AppHeaderAction
        aria-label={backLabel}
        tooltip={backLabel}
        disabled={backDisabled}
        onClick={onBack}
      >
        <ChevronLeftIcon />
      </AppHeaderAction>

      <AppHeaderAction
        aria-label={forwardLabel}
        tooltip={forwardLabel}
        disabled={forwardDisabled}
        onClick={onForward}
      >
        <ChevronRightIcon />
      </AppHeaderAction>
    </div>
  )
}

function AppHeaderAction({
  className,
  variant = "ghost",
  size = "icon-sm",
  tooltip,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  tooltip?: React.ReactNode
}) {
  const button = (
    <Button
      data-slot="app-header-action"
      type="button"
      variant={variant}
      size={size}
      className={cn(
        "active:translate-y-0 active:brightness-[0.97] focus-visible:ring-0",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )

  if (!tooltip) return button

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side="bottom" sideOffset={8}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

function AppFocusModeControls({
  className,
  backDisabled = false,
  forwardDisabled = false,
  onBack,
  onForward,
  onExit,
  backLabel = "Back",
  forwardLabel = "Forward",
  exitLabel = "Leave focus mode",
  ...props
}: AppFocusModeControlsProps) {
  return (
    <div
      data-slot="app-focus-mode-controls"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-center px-4 pt-2",
        className
      )}
      {...props}
    >
      <div className="group/focus pointer-events-auto flex flex-row">
        <div className="grid min-w-0 grid-cols-[0fr] overflow-hidden transition-[grid-template-columns] duration-300 ease-out group-hover/focus:grid-cols-[1fr] group-hover/focus:delay-50">
          <div className="min-w-0 overflow-hidden">
            <div className="flex min-w-0 flex-row overflow-hidden">
              <AppHeaderAction
                aria-label={backLabel}
                tooltip={backLabel}
                disabled={backDisabled}
                className="border-border bg-background/70 shadow-sm backdrop-blur"
                onClick={onBack}
              >
                <ChevronLeftIcon />
              </AppHeaderAction>
              <AppHeaderAction
                aria-label={forwardLabel}
                tooltip={forwardLabel}
                disabled={forwardDisabled}
                className="border-border bg-background/70 shadow-sm backdrop-blur"
                onClick={onForward}
              >
                <ChevronRightIcon />
              </AppHeaderAction>
            </div>
          </div>
        </div>

        <div className="h-0 w-0 bg-border opacity-0 transition-[width,height,opacity] duration-300 ease-out group-hover/focus:h-7 group-hover/focus:w-px group-hover/focus:opacity-100 group-hover/focus:delay-50" />

        <AppHeaderAction
          aria-label={exitLabel}
          tooltip={exitLabel}
          className="border-border bg-background/70 shadow-sm backdrop-blur"
          onClick={onExit}
        >
          <XIcon />
        </AppHeaderAction>
      </div>
    </div>
  )
}

export {
  AppFocusModeControls,
  AppHeader,
  AppHeaderAction,
  AppHeaderHistory,
  type AppFocusModeControlsProps,
  type AppHeaderProps,
}
