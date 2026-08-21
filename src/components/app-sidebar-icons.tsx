import * as React from "react"

import { cn } from "@/lib/utils"

type AppSidebarIconName =
  | "plus"
  | "search"
  | "explore"
  | "calendar"
  | "pin"
  | "objects"
  | "flask"
  | "atomic-note"
  | "quote"
  | "page"

type AppSidebarIconProps = React.ComponentProps<"svg"> & {
  name: AppSidebarIconName
}

function AppSidebarIcon({
  name,
  className,
  children,
  ...props
}: AppSidebarIconProps) {
  return (
    <svg
      data-slot="app-sidebar-icon"
      data-icon-name={name}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      {children}
    </svg>
  )
}

function AppSidebarPlusIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="plus" {...props}>
      <path d="M12 4.5v15" />
      <path d="M4.5 12h15" />
    </AppSidebarIcon>
  )
}

function AppSidebarSearchIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="search" {...props}>
      <circle cx="10.5" cy="10.5" r="6.25" />
      <path d="m15.1 15.1 4.65 4.65" />
    </AppSidebarIcon>
  )
}

function AppSidebarExploreIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="explore" {...props}>
      <path d="m10.15 4.1 1.35 4.2 4.2 1.35-4.2 1.35-1.35 4.2-1.35-4.2-4.2-1.35 4.2-1.35 1.35-4.2Z" />
      <path d="m17.8 3.35.65 1.95 1.95.65-1.95.65-.65 1.95-.65-1.95-1.95-.65 1.95-.65.65-1.95Z" />
      <path d="m4.55 14.55.6 1.75 1.75.6-1.75.6-.6 1.75-.6-1.75-1.75-.6 1.75-.6.6-1.75Z" />
    </AppSidebarIcon>
  )
}

function AppSidebarCalendarIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="calendar" {...props}>
      <rect x="3.75" y="5.25" width="16.5" height="15" rx="2" />
      <path d="M8 3.5v3.25M16 3.5v3.25M3.75 9.25h16.5" />
      <path d="M7.25 12.25h1M11.5 12.25h1M15.75 12.25h1M7.25 15.75h1M11.5 15.75h1M15.75 15.75h1" strokeWidth="2.1" />
    </AppSidebarIcon>
  )
}

function AppSidebarPinIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="pin" {...props}>
      <path d="M9 3.5h6l-.8 4.75 2.8 2.6v2.4H7v-2.4l2.8-2.6L9 3.5Z" />
      <path d="M12 13.25v7.25" />
    </AppSidebarIcon>
  )
}

function AppSidebarObjectsIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="objects" {...props}>
      <path d="M8.25 3.5h6.4l4.1 4.1v10.15H8.25V3.5Z" />
      <path d="M14.5 3.5v4.25h4.25" />
      <path d="M5.25 6.25H4.5a1 1 0 0 0-1 1v12.25a1 1 0 0 0 1 1h9.25a1 1 0 0 0 1-1v-.75" />
    </AppSidebarIcon>
  )
}

function AppSidebarFlaskIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="flask" {...props}>
      <path d="M9 3h6M10 3v5.6L5.3 17.5A2.3 2.3 0 0 0 7.35 21h9.3a2.3 2.3 0 0 0 2.05-3.5L14 8.6V3" />
      <path d="M7.5 15h9" />
    </AppSidebarIcon>
  )
}

function AppSidebarAtomicNoteIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="atomic-note" {...props}>
      <path d="M7 3.5h10v17H7z" />
      <path d="M10 8h4M10 12h4M10 16h4" />
    </AppSidebarIcon>
  )
}

function AppSidebarQuoteIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="quote" {...props}>
      <path d="M8.75 7H5.5v5.25h3.25V17H5.5" />
      <path d="M18.5 7h-3.25v5.25h3.25V17h-3.25" />
    </AppSidebarIcon>
  )
}

function AppSidebarPageIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="page" {...props}>
      <path d="M7 3.5h7l3.5 3.5v13.5H7z" />
      <path d="M14 3.5V7h3.5M9.75 11.5h5M9.75 15h5" />
    </AppSidebarIcon>
  )
}

export {
  AppSidebarAtomicNoteIcon,
  AppSidebarCalendarIcon,
  AppSidebarExploreIcon,
  AppSidebarFlaskIcon,
  AppSidebarIcon,
  AppSidebarObjectsIcon,
  AppSidebarPageIcon,
  AppSidebarPinIcon,
  AppSidebarPlusIcon,
  AppSidebarQuoteIcon,
  AppSidebarSearchIcon,
  type AppSidebarIconName,
  type AppSidebarIconProps,
}
