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
  | "dots"

type AppSidebarIconProps = React.ComponentProps<"svg"> & {
  name: AppSidebarIconName
}

type IconPath = {
  d: string
  opacity?: number
}

const iconPaths: Record<Exclude<AppSidebarIconName, "flask">, readonly IconPath[]> = {
  plus: [
    {
      d: "M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12",
    },
  ],
  search: [
    {
      d: "M232.49 215.51 185 168a92.12 92.12 0 1 0-17 17l47.53 47.54a12 12 0 0 0 17-17ZM44 112a68 68 0 1 1 68 68 68.07 68.07 0 0 1-68-68",
    },
  ],
  explore: [
    {
      d: "m199 125.31-49.88-18.39L130.69 57a19.92 19.92 0 0 0-37.38 0l-18.39 49.92L25 125.31a19.92 19.92 0 0 0 0 37.38l49.88 18.39L93.31 231a19.92 19.92 0 0 0 37.38 0l18.39-49.88L199 162.69a19.92 19.92 0 0 0 0-37.38m-63.38 35.16a12 12 0 0 0-7.11 7.11L112 212.28l-16.47-44.7a12 12 0 0 0-7.11-7.11L43.72 144l44.7-16.47a12 12 0 0 0 7.11-7.11L112 75.72l16.47 44.7a12 12 0 0 0 7.11 7.11l44.7 16.47ZM140 40a12 12 0 0 1 12-12h12V16a12 12 0 0 1 24 0v12h12a12 12 0 0 1 0 24h-12v12a12 12 0 0 1-24 0V52h-12a12 12 0 0 1-12-12m112 48a12 12 0 0 1-12 12h-4v4a12 12 0 0 1-24 0v-4h-4a12 12 0 0 1 0-24h4v-4a12 12 0 0 1 24 0v4h4a12 12 0 0 1 12 12",
    },
  ],
  calendar: [
    {
      d: "M208 28h-20v-4a12 12 0 0 0-24 0v4H92v-4a12 12 0 0 0-24 0v4H48a20 20 0 0 0-20 20v160a20 20 0 0 0 20 20h160a20 20 0 0 0 20-20V48a20 20 0 0 0-20-20M68 52a12 12 0 0 0 24 0h72a12 12 0 0 0 24 0h16v24H52V52ZM52 204V100h152v104Zm60-80v56a12 12 0 0 1-24 0v-36.68a12 12 0 0 1-9.37-22l16-8A12 12 0 0 1 112 124m61.49 33.88L163.9 168h4.1a12 12 0 0 1 0 24h-32a12 12 0 0 1-8.71-20.25L155.45 142a4 4 0 0 0 .55-2a4 4 0 0 0-7.47-2a12 12 0 0 1-20.78-12A28 28 0 0 1 180 140a27.77 27.77 0 0 1-5.64 16.86 11 11 0 0 1-.87 1.02",
    },
  ],
  pin: [
    {
      d: "m238.15 78.54-60.69-60.68a20 20 0 0 0-28.3 0L97.2 70c-12.43-3.33-36.68-5.72-61.74 14.5a20 20 0 0 0-1.6 29.73l45.46 45.47-39.8 39.8a12 12 0 0 0 17 17l39.8-39.81 45.47 45.46a20 20 0 0 0 14.12 5.85c.46 0 .93 0 1.4-.05a20 20 0 0 0 14.56-7.95c4.69-6.23 11-16.13 14.44-28s3.45-22.88.16-33.4l51.7-51.87a20 20 0 0 0-.02-28.19m-74.26 68.79a12 12 0 0 0-2.23 13.84c3.43 6.86 6.9 21-6.28 40.65L54.08 100.53c21.09-14.59 39.53-6.64 41-6a11.67 11.67 0 0 0 13.81-2.29l54.43-54.61 55 55Z",
    },
  ],
  objects: [
    {
      d: "M216 36H40a20 20 0 0 0-20 20v144a20 20 0 0 0 20 20h176a20 20 0 0 0 20-20V56a20 20 0 0 0-20-20m-4 24v32H44V60ZM44 116h48v80H44Zm72 80v-80h96v80Z",
    },
  ],
  "atomic-note": [
    {
      d: "M208 88H48a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-96a16 16 0 0 0-16-16m0 112H48v-96h160zM48 64a8 8 0 0 1 8-8h144a8 8 0 0 1 0 16H56a8 8 0 0 1-8-8m16-32a8 8 0 0 1 8-8h112a8 8 0 0 1 0 16H72a8 8 0 0 1-8-8",
    },
  ],
  quote: [
    {
      d: "M100 56H40a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h60v8a32 32 0 0 1-32 32a8 8 0 0 0 0 16 48.05 48.05 0 0 0 48-48V72a16 16 0 0 0-16-16m0 80H40V72h60Zm116-80h-60a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h60v8a32 32 0 0 1-32 32a8 8 0 0 0 0 16 48.05 48.05 0 0 0 48-48V72a16 16 0 0 0-16-16m0 80h-60V72h60Z",
    },
  ],
  page: [
    {
      d: "m213.66 82.34-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 51.31 188.69 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48zm-32-80a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8",
    },
  ],
  dots: [
    {
      d: "M144 128a16 16 0 1 1-16-16 16 16 0 0 1 16 16m-84-16a16 16 0 1 0 16 16 16 16 0 0 0-16-16m136 0a16 16 0 1 0 16 16 16 16 0 0 0-16-16",
    },
  ],
}

function AppSidebarIcon({
  name,
  className,
  children,
  ...props
}: AppSidebarIconProps) {
  if (name === "flask") {
    return (
      <svg
        data-slot="app-sidebar-icon"
        data-icon-name={name}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
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

  return (
    <svg
      data-slot="app-sidebar-icon"
      data-icon-name={name}
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      {iconPaths[name].map((path) => (
        <path key={path.d} d={path.d} opacity={path.opacity} />
      ))}
    </svg>
  )
}

function AppSidebarPlusIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="plus" {...props} />
}

function AppSidebarSearchIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="search" {...props} />
}

function AppSidebarExploreIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="explore" {...props} />
}

function AppSidebarCalendarIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="calendar" {...props} />
}

function AppSidebarPinIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="pin" {...props} />
}

function AppSidebarObjectsIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="objects" {...props} />
}

function AppSidebarFlaskIcon(props: Omit<AppSidebarIconProps, "name">) {
  return (
    <AppSidebarIcon name="flask" {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v5.2L5.6 17a2.5 2.5 0 0 0 2.2 3.7h8.4a2.5 2.5 0 0 0 2.2-3.7L14 8.2V3" />
      <path d="M7.6 15h8.8" />
    </AppSidebarIcon>
  )
}

function AppSidebarAtomicNoteIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="atomic-note" {...props} />
}

function AppSidebarQuoteIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="quote" {...props} />
}

function AppSidebarPageIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="page" {...props} />
}

function AppSidebarDotsIcon(props: Omit<AppSidebarIconProps, "name">) {
  return <AppSidebarIcon name="dots" {...props} />
}

export {
  AppSidebarAtomicNoteIcon,
  AppSidebarCalendarIcon,
  AppSidebarDotsIcon,
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
