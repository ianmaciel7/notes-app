"use client"

import type { ElementType, ReactNode } from "react"

import { floatingSurfaceBaseClass } from "@/components/ui/shared-styles"
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
  "h-6 w-full rounded-[7px] border-0 bg-[#f3f1ee] px-[9px] text-sm text-[#595550] shadow-none [&>input]:h-full [&>input]:px-0 [&>input]:py-0 [&>input]:text-sm [&>input]:placeholder:text-[#8f8983] [&>input]:placeholder:opacity-60"

const compactMenuItemClass =
  "group/compact-menu-item min-h-0 w-full min-w-0 gap-0 rounded-[7px] px-0 py-0 pr-1 text-sm text-[#282522] data-highlighted:bg-[#f3f1ee] data-highlighted:text-[#282522]"

const sidebarContextMenuContentClass = "w-64"

const sidebarContextSubmenuContentClass = "w-52"

const compactMenuActionButtonClass =
  "relative flex h-6 w-full shrink-0 cursor-pointer items-center justify-center gap-x-1.5 truncate rounded-lg border border-[#dedbd7] bg-[#f3f1ee] px-3 text-sm font-normal text-[#595550] transition-[opacity] duration-200 ease-out hover:border-[#cbc7c1] hover:bg-[#f3f1ee] hover:text-[#595550] active:brightness-[0.97] focus:outline-none disabled:pointer-events-none disabled:opacity-50"

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
          ? "border border-[#dedbd7] bg-white text-[#8f8983] [border-width:0.5px]"
          : "border border-transparent text-[#8f8983]",
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
          <span className="max-w-full truncate pt-px text-[#282522]">
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
        "relative inline-flex max-w-full min-w-0 flex-row items-center overflow-x-clip rounded-[0.475em] border px-[0.49em] py-[0.2em] leading-[1.3] whitespace-nowrap text-[#5f5a55] [background-color:#ebe8e3] [border-color:#ebe8e3] [border-width:0.0625em]",
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
        <div className="truncate font-medium text-[#282522]">{name}</div>
        <div className="truncate text-[#8f8983]">{email}</div>
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
  sidebarContextSubmenuContentClass,
}
