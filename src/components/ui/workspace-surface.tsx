import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

const workspaceRouteClass =
  "relative flex h-full min-h-0 flex-col bg-card text-foreground";

const workspaceScrollAreaClass = "min-h-0 flex-1 overflow-y-auto";

const workspaceLongformColumnClass =
  "mx-auto w-full max-w-[50rem] px-5 pb-12 pt-8 sm:px-8 lg:pl-10 lg:pr-8";

const workspaceEditorSurfaceClass =
  "mx-3 mt-6 min-h-[302px] shrink-0 rounded-[12px] border border-border bg-card px-6 pb-8 pt-7 shadow-[0_1px_2px_rgb(0_0_0/0.02)] sm:px-10";

const workspaceOverviewContentClass =
  "min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-4";

const workspaceSectionTitleClass =
  "text-sm font-medium leading-5 text-foreground";

const workspaceMetaTextClass =
  "text-[13px] leading-5 text-muted-foreground";

const workspaceCardGridClass =
  "grid w-full grid-cols-1 gap-2 sm:grid-cols-2";

const workspaceListSurfaceClass =
  "overflow-hidden rounded-[12px] border border-border bg-card p-1";

const workspaceListRowClass =
  "group flex min-h-10 w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-sm text-foreground outline-none transition-colors duration-150 hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30 motion-reduce:transition-none";

const workspaceNamedCardClass =
  "group flex min-h-[68px] flex-col justify-center rounded-[12px] border border-border bg-card px-3 py-2 text-left shadow-[0_1px_2px_rgb(0_0_0/0.02)] outline-none transition-[background-color,border-color,box-shadow] duration-150 hover:bg-muted/50 focus-within:border-ring/40 focus-within:bg-muted/50 focus-within:ring-2 focus-within:ring-ring/20 motion-reduce:transition-none";

const workspaceFieldGroupClass =
  "rounded-[12px] border border-border bg-card p-3";

const workspaceEmptyStateSurfaceClass =
  "flex min-h-[190px] w-full flex-col items-center justify-center rounded-[12px] border border-dashed border-border bg-card px-6 py-10 text-center";

const workspaceEmptyStateIconClass =
  "mb-3 flex size-10 items-center justify-center rounded-[10px] border border-border bg-muted text-muted-foreground";

const workspaceContentScopeClass = cn(
  "h-full min-h-0 w-full",
  "[&>_*]:h-full [&>_*]:min-h-0 [&>_*]:w-full",
  "[&_[data-slot=created-object-workspace]]:bg-card",
  "[&_[data-slot=object-type-named-item-workspace]]:bg-card",
  "[&_[data-slot=object-type-named-item-workspace]]:text-foreground",
  "[&_[data-slot=citation-workspace]]:bg-card",
  "[&_[data-slot=document-object-editor]]:mx-auto",
  "[&_[data-slot=document-object-editor]]:max-w-[50rem]",
  "[&_[data-slot=document-object-editor]]:px-5",
  "sm:[&_[data-slot=document-object-editor]]:px-8",
  "lg:[&_[data-slot=document-object-editor]]:px-10",
  "[&_[data-slot=table-object-editor]]:rounded-[12px]",
  "[&_[data-slot=task-object-editor]]:rounded-[12px]",
  "[&_[data-slot=url-object-editor]]:rounded-[12px]",
  "[&_[data-slot=tag-object-editor]]:rounded-[12px]",
  "[&_[data-slot=query-object-editor]]:rounded-[12px]",
  "[&_[data-slot=file-object-editor]]:rounded-[12px]",
  "[&_[data-slot=citation-workspace]>section]:rounded-[12px]",
  "[&_[data-slot=object-type-named-item-workspace]>div]:mx-auto",
  "[&_[data-slot=object-type-named-item-workspace]>div]:w-full",
  "[&_[data-slot=object-type-named-item-workspace]>div]:max-w-[50rem]",
  "[&_[data-slot=object-type-named-item-workspace]_section]:rounded-[12px]",
  "[&_[data-slot=object-type-named-item-workspace]_section]:border",
  "[&_[data-slot=object-type-named-item-workspace]_section]:border-dashed",
  "[&_[data-slot=object-type-named-item-workspace]_section]:border-border",
  "[&_[data-slot=object-type-named-card]]:rounded-[12px]",
  "[&_[data-slot=object-type-named-card]]:border-border",
  "[&_[data-slot=object-type-named-card]]:bg-card",
  "[&_[data-slot=object-type-named-card]]:hover:bg-muted/50",
  "[&_[data-slot=object-type-overview]]:px-5",
  "[&_[data-slot=object-type-overview]]:pb-8",
  "[&_[data-slot=object-type-overview]]:pt-4",
  "[&_[data-slot=object-type-all]]:px-5",
  "[&_[data-slot=object-type-all]]:pb-8",
  "[&_[data-slot=object-type-all]]:pt-4",
  "[&_[data-slot=object-type-filter-row]]:rounded-[12px]",
  "[&_[data-slot=object-type-filter-row]]:border-border",
  "[&_[data-slot=object-type-sort-row]]:rounded-[12px]",
  "[&_[data-slot=object-type-sort-row]]:border-border",
);

type WorkspaceEmptyStateProps = {
  action?: ReactNode;
  className?: string;
  compact?: boolean;
  description?: ReactNode;
  icon?: ElementType;
  title: ReactNode;
};

function WorkspaceEmptyState({
  action,
  className,
  compact = false,
  description,
  icon: Icon,
  title,
}: WorkspaceEmptyStateProps) {
  return (
    <div
      data-slot="workspace-empty-state"
      data-compact={compact || undefined}
      className={cn(
        workspaceEmptyStateSurfaceClass,
        compact && "min-h-[132px] px-4 py-6",
        className,
      )}
    >
      {Icon ? (
        <span className={workspaceEmptyStateIconClass} aria-hidden="true">
          <Icon className="size-5" />
        </span>
      ) : null}
      <p className={workspaceSectionTitleClass}>{title}</p>
      {description ? (
        <p className={cn(workspaceMetaTextClass, "mt-1 max-w-md")}>
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export {
  WorkspaceEmptyState,
  workspaceCardGridClass,
  workspaceContentScopeClass,
  workspaceEditorSurfaceClass,
  workspaceEmptyStateSurfaceClass,
  workspaceFieldGroupClass,
  workspaceListRowClass,
  workspaceListSurfaceClass,
  workspaceLongformColumnClass,
  workspaceMetaTextClass,
  workspaceNamedCardClass,
  workspaceOverviewContentClass,
  workspaceRouteClass,
  workspaceScrollAreaClass,
  workspaceSectionTitleClass,
};
