"use client"

import type { ElementType, ReactNode } from "react"

import {
  floatingSurfaceBaseClass,
  workspaceSmallActionStateClass,
  workspaceSubmenuStateClass,
} from "@/components/ui/shared-styles"
import { cn } from "@/lib/utils"

type CompactMenuIconFrameProps = {
  children: ReactNode
  className?: string
  variant?: "bordered" | "ghost"
}

type CompactMenuPlanBadgeProps = {
  icon: ElementType<{ className?: string }>
  label: ReactNode
  className?: string
  iconClassName?: string
}

type CompactMenuAccountPanelProps = {
  name: ReactNode
  email: ReactNode
  badge: ReactNode
  action: ReactNode
  className?: string
}

const compactMenuSurfaceClass = cn(
  floatingSurfaceBaseClass,
  "box-content flex w-auto min-w-[18rem] max-w-[calc(100vw-1.75rem)] flex-col overflow-hidden p-0 text-left text-xs font-normal",
)

const compactMenuSearchClass =
  "h-6 w-full rounded-[7px] border-0 bg-el px-[9px] text-sm text-primary shadow-none [&>input]:h-full [&>input]:px-0 [&>input]:py-0 [&>input]:text-sm [&>input]:text-primary [&>input]:placeholder:text-subtle [&>input]:placeholder:opacity-100"

const compactMenuItemClass =
  "group/compact-menu-item min-h-0 w-full min-w-0 gap-0 rounded-base px-0 py-0 pr-1 text-sm text-primary data-highlighted:bg-el data-highlighted:text-primary [&>[data-slot=compact-menu-item-text]]:ml-2"

const sidebarContextMenuContentClass =
  "preview-card-core box-content !w-[255px] !min-w-0 select-none rounded-[12px] border border-[var(--app-border-front)] bg-front !p-1.5 text-left text-xs font-sans font-normal text-subtle shadow-[var(--app-shadow-sidebar-popover)]"

const sidebarContextSubmenuContentClass = cn(
  "preview-card-core box-content !w-auto min-w-[220px] select-none rounded-[12px] border border-[var(--app-border-front)] bg-front !p-1.5 text-left text-xs font-sans font-normal text-subtle shadow-[var(--app-shadow-sidebar-popover)]",
  workspaceSubmenuStateClass,
)

const workspaceOverflowMenuContentClass = sidebarContextMenuContentClass

const workspaceOverflowMenuItemClass =
  "h-8 min-h-8 rounded-[8px] px-1 text-sm leading-5 transition-colors duration-200 ease-out motion-reduce:transition-none"

const sidebarContextMenuItemClass = cn(
  workspaceOverflowMenuItemClass,
  "h-base min-h-base justify-between gap-2 pl-1 pr-1 text-left font-normal text-[var(--app-text-primary)]",
  "hover:bg-[var(--app-bg-el)] data-highlighted:bg-[var(--app-bg-el)] data-highlighted:text-[var(--app-text-primary)] data-popup-open:bg-[var(--app-bg-el)] data-popup-open:text-[var(--app-text-primary)] data-open:bg-[var(--app-bg-el)] data-open:text-[var(--app-text-primary)]",
)

const sidebarContextMenuDestructiveItemClass = cn(
  sidebarContextMenuItemClass,
  "text-[var(--app-text-primary)] hover:text-[var(--app-text-primary)] data-highlighted:text-[var(--app-text-primary)] data-popup-open:text-[var(--app-text-primary)] data-open:text-[var(--app-text-primary)] [&_[data-slot=compact-menu-icon-frame]]:text-[var(--destructive-menu-action)] [&_[data-slot=compact-menu-icon-frame]_svg]:text-[var(--destructive-menu-action)] hover:[&_[data-slot=compact-menu-icon-frame]_svg]:text-[var(--destructive-menu-action)] data-highlighted:[&_[data-slot=compact-menu-icon-frame]_svg]:text-[var(--destructive-menu-action)]",
)

const sidebarContextMenuSeparatorClass =
  "my-1 h-0 border-b-[0.5px] border-[var(--app-border-front)] bg-transparent"

const compactMenuActionButtonClass = cn(
  "relative flex h-6 w-full shrink-0 cursor-pointer items-center justify-center gap-x-2 truncate rounded-lg border border-front bg-el px-3 text-sm font-normal text-[var(--app-text-secondary)] hover:border-[var(--app-border-base-strong)] hover:bg-[var(--app-bg-el-hover)] hover:text-primary active:brightness-[0.97] focus:outline-none disabled:pointer-events-none disabled:opacity-50",
  workspaceSmallActionStateClass,
)

const compactMenuIconShellClass =
  "flex shrink-0 grow-0 flex-row items-center justify-center gap-1 rounded-[0.475em] p-1"

function CompactMenuIconFrame({
  children,
  className,
  variant = "bordered",
}: CompactMenuIconFrameProps) {
  return (
    <span
      data-slot="compact-menu-icon-frame"
      data-variant={variant}
      className={cn(
        compactMenuIconShellClass,
        variant === "bordered"
          ? "border border-transparent text-subtle [border-width:0.5px]"
          : "border border-transparent text-subtle",
        className,
      )}
    >
      <span className="flex size-3 items-center justify-center [&_svg]:size-[1em] [&_svg]:text-sm [&_svg]:leading-none">
        {children}
      </span>
    </span>
  )
}

function CompactMenuItemText({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      data-slot="compact-menu-item-text"
      className={cn("flex h-6 min-w-0 flex-1 flex-col justify-center", className)}
    >
      <span className="flex min-w-0 flex-1 items-center justify-center truncate">
        <span className="flex min-w-0 flex-1 items-center truncate">
          <span className="max-w-full truncate pt-px text-primary">
            {children}
          </span>
        </span>
      </span>
    </span>
  )
}

function CompactMenuPlanBadge({
  icon: Icon,
  label,
  className,
  iconClassName,
}: CompactMenuPlanBadgeProps) {
  return (
    <span
      data-slot="compact-menu-plan-badge"
      className={cn(
        "relative inline-flex max-w-full min-w-0 flex-row items-center overflow-x-clip rounded-[0.475em] border border-[var(--app-bg-el-hover)] bg-[var(--app-bg-el-hover)] px-[0.49em] py-[0.2em] leading-[1.3] whitespace-nowrap text-[var(--app-text-secondary)] [border-width:0.0625em]",
        className,
      )}
    >
      <span className="mr-[0.325em] ml-[-0.1em] inline-flex min-h-[1em] min-w-[1em] shrink-0 grow-0 items-center justify-center rounded-[0.33em]">
        <Icon
          className={cn(
            "inline-flex min-h-[1.3em] min-w-[1.3em] rounded-[0.33em] p-[0.1em] text-[0.94em]",
            iconClassName,
          )}
        />
      </span>
      <span className="block min-w-0 truncate text-left text-[1em] whitespace-nowrap">
        {label}
      </span>
    </span>
  )
}

function CompactMenuAccountPanel({
  name,
  email,
  badge,
  action,
  className,
}: CompactMenuAccountPanelProps) {
  return (
    <div
      data-slot="compact-menu-account-panel"
      className={cn("flex w-full flex-col p-2 sm:w-72", className)}
    >
      <div className="flex w-full flex-col text-sm">
        <div className="truncate font-medium text-primary">{name}</div>
        <div className="truncate text-subtle">{email}</div>
      </div>
      <div className="mt-1">
        <div className="inline max-h-max grow-0 self-center">
          <span className="inline-flex max-w-full min-w-0 truncate whitespace-nowrap text-xs select-none">
            {badge}
          </span>
        </div>
      </div>
      <div className="mt-2">{action}</div>
    </div>
  )
}

export {
  CompactMenuAccountPanel,
  CompactMenuIconFrame,
  CompactMenuItemText,
  CompactMenuPlanBadge,
  compactMenuActionButtonClass,
  compactMenuItemClass,
  compactMenuSearchClass,
  compactMenuSurfaceClass,
  sidebarContextMenuContentClass,
  sidebarContextMenuDestructiveItemClass,
  sidebarContextMenuItemClass,
  sidebarContextMenuSeparatorClass,
  sidebarContextSubmenuContentClass,
  workspaceOverflowMenuContentClass,
  workspaceOverflowMenuItemClass,
}
