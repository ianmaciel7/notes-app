"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDashedIcon,
  PlusIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AppHeaderProps = React.ComponentProps<"header"> & {
  backDisabled?: boolean
  forwardDisabled?: boolean
  onBack?: () => void
  onForward?: () => void
  onCreate?: () => void
  onFocus?: () => void
}

function AppHeader({
  className,
  children,
  backDisabled = false,
  forwardDisabled = false,
  onBack,
  onForward,
  onCreate,
  onFocus,
  ...props
}: AppHeaderProps) {
  return (
    <header
      data-slot="app-header"
      className={cn(
        "flex h-[46px] w-full shrink-0 items-center justify-between",
        className
      )}
      {...props}
    >
      <div
        data-slot="app-header-start"
        className="flex shrink-0 items-center pl-2.5"
      >
        <AppHeaderHistory
          backDisabled={backDisabled}
          forwardDisabled={forwardDisabled}
          onBack={onBack}
          onForward={onForward}
        />

        <AppHeaderAction aria-label="Create" onClick={onCreate}>
          <PlusIcon />
        </AppHeaderAction>
      </div>

      <div data-slot="app-header-content" className="min-w-0 flex-1">
        {children}
      </div>

      <div
        data-slot="app-header-end"
        className="flex shrink-0 items-center pr-2.5"
      >
        <AppHeaderAction aria-label="Enter focus mode" onClick={onFocus}>
          <CircleDashedIcon />
        </AppHeaderAction>
      </div>
    </header>
  )
}

function AppHeaderHistory({
  backDisabled = false,
  forwardDisabled = false,
  onBack,
  onForward,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  backDisabled?: boolean
  forwardDisabled?: boolean
  onBack?: () => void
  onForward?: () => void
}) {
  return (
    <div
      data-slot="app-header-history"
      className={cn("flex items-center", className)}
      {...props}
    >
      <AppHeaderAction
        aria-label="Back"
        disabled={backDisabled}
        onClick={onBack}
      >
        <ChevronLeftIcon />
      </AppHeaderAction>

      <AppHeaderAction
        aria-label="Forward"
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
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="app-header-action"
      type="button"
      variant={variant}
      size={size}
      className={className}
      {...props}
    />
  )
}

export {
  AppHeader,
  AppHeaderAction,
  AppHeaderHistory,
  type AppHeaderProps,
}
