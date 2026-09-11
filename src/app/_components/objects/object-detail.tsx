import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function ObjectDetail({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      data-slot="workspace-generic-object"
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-auto bg-[var(--app-bg-front)]",
        className,
      )}
      {...props}
    />
  );
}

export function ObjectDetailHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      data-slot="object-detail-header"
      className={cn("border-b border-[var(--app-border-front)] px-8 pt-9 pb-4", className)}
      {...props}
    />
  );
}

export function ObjectDetailContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="object-detail-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-4 px-8 py-7", className)}
      {...props}
    />
  );
}

export function ObjectDetailAside({ className, ...props }: ComponentProps<"aside">) {
  return (
    <aside
      data-slot="object-detail-aside"
      className={cn("shrink-0 border-t border-border px-8 py-4", className)}
      {...props}
    />
  );
}
