import { ChevronUp } from "lucide-react";
import { ObjectTypeIconBadge } from "@/components/object-icons";
import {
  ObjectListCreateAction,
  ObjectListMoreActions,
} from "@/components/objects/list/object-list-actions";
import { ObjectListSearch } from "@/components/objects/list/object-list-search";
import type { ObjectListView } from "@/components/objects/list/use-object-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ObjectListHeading({ view }: { view: ObjectListView }) {
  const { objectType, singularName, listName, headerCollapsed } = view;
  return (
    <div className="flex min-h-8 items-center justify-between gap-2 py-4">
      <div
        data-slot="workspace-object-type-heading"
        data-context-menu-entity-context-key={`${objectType.id}:${singularName}`}
        className="flex min-w-0 grow items-center truncate"
      >
        <div
          className={cn(
            "dataview-heading-icon-container mr-2.5 size-8 shrink-0 rounded-[8px]",
            "border border-[var(--app-border-front)] bg-[var(--app-bg-front)] p-0.5",
          )}
        >
          <div className="dataview-heading-icon-fill h-full w-full">
            <ObjectTypeIconBadge
              id={objectType.id}
              iconName={objectType.iconName}
              tone={objectType.tone ?? "gray"}
              className="size-full rounded-[7px]"
              iconClassName="size-3.5 opacity-90"
            />
          </div>
        </div>
        <h1
          className={cn(
            "dataview-heading max-w-max truncate text-xl font-bold leading-5",
            "text-[var(--app-text-primary)]",
          )}
        >
          {listName}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex h-8 items-center rounded-lg bg-[var(--app-bg-el)]">
          <ObjectListSearch view={view} />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            tooltip={headerCollapsed ? "Expandir cabeçalho" : "Recolher cabeçalho"}
            aria-label={headerCollapsed ? "Expandir cabeçalho" : "Recolher cabeçalho"}
            aria-expanded={!headerCollapsed}
            className="size-8 rounded-none"
            onClick={() => view.setHeaderCollapsed((current) => !current)}
          >
            <ChevronUp
              aria-hidden="true"
              className={cn("size-3.5 transition-transform", headerCollapsed && "rotate-180")}
            />
          </Button>
          <ObjectListMoreActions view={view} />
        </div>
        <ObjectListCreateAction view={view} />
      </div>
    </div>
  );
}
