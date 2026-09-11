import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function ObjectList({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      data-slot="workspace-object-type-list-view"
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden",
        "rounded-none border-0 bg-transparent text-[var(--app-text-primary)] shadow-none",
        className,
      )}
      {...props}
    />
  );
}

export function ObjectListHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header data-slot="object-list-header" className={cn("shrink-0 px-3", className)} {...props} />
  );
}

export function ObjectListToolbar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="workspace-object-type-list-toolbar"
      className={cn(
        "flex min-h-8 items-center gap-0 overflow-x-auto pb-1.5 pt-px text-sm",
        "text-[var(--app-text-secondary)]",
        className,
      )}
      {...props}
    />
  );
}

export function ObjectListContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="workspace-object-type-list-scroll"
      className={cn(
        "min-h-0 flex-1 overflow-y-auto bg-[var(--app-bg-base)] px-3 pb-4 pt-2.5",
        className,
      )}
      {...props}
    />
  );
}
