import { ChevronDown, MoreHorizontal, Plus, Rows3, Search } from "lucide-react";
import { defaultObjectListPreferences } from "@/app/_components/objects/list/object-list-model";
import type { ObjectListView } from "@/app/_components/objects/list/use-object-list";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  CompactMenuIconFrame,
  CompactMenuItemText,
  sidebarContextMenuContentClass,
  sidebarContextMenuItemClass,
  sidebarContextMenuSeparatorClass,
} from "@/components/ui/compact-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ObjectListMoreActions({ view }: { view: ObjectListView }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            tooltip="Mais ações"
            aria-label="Mais ações"
            className="size-8 rounded-none"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className={sidebarContextMenuContentClass}>
        <DropdownMenuItem
          className={sidebarContextMenuItemClass}
          onClick={() => view.setSearchOpen(true)}
        >
          <CompactMenuIconFrame variant="ghost">
            <Search />
          </CompactMenuIconFrame>
          <CompactMenuItemText>Buscar</CompactMenuItemText>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={sidebarContextMenuItemClass}
          onClick={() => view.updatePreferences({ ...defaultObjectListPreferences })}
        >
          <CompactMenuIconFrame variant="ghost">
            <Rows3 />
          </CompactMenuIconFrame>
          <CompactMenuItemText>Restaurar visualização</CompactMenuItemText>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ObjectListCreateMenu({ view }: { view: ObjectListView }) {
  const { singularName, listName, onCreateEntity } = view;
  return (
    <div data-slot="workspace-object-type-new-menu" className="-ml-px w-[30px]">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              aria-label={`Novo ${singularName}`}
              className={cn(
                "h-8 w-[30px] rounded-l-none rounded-r-[8px] border-0 border-l p-0",
                "border-l-[var(--app-text-secondary)] bg-transparent",
                "text-[var(--app-button-primary-text)]",
              )}
            >
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className={sidebarContextMenuContentClass}>
          <DropdownMenuItem className={sidebarContextMenuItemClass} onClick={onCreateEntity}>
            <CompactMenuIconFrame variant="ghost">
              <Plus />
            </CompactMenuIconFrame>
            <CompactMenuItemText>Novo {singularName}</CompactMenuItemText>
          </DropdownMenuItem>
          <DropdownMenuSeparator className={sidebarContextMenuSeparatorClass} />
          <DropdownMenuItem
            className={sidebarContextMenuItemClass}
            onClick={() => view.setSearchOpen(true)}
          >
            <CompactMenuIconFrame variant="ghost">
              <Search />
            </CompactMenuIconFrame>
            <CompactMenuItemText>Buscar em {listName}</CompactMenuItemText>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function ObjectListCreateAction({ view }: { view: ObjectListView }) {
  if (!view.onCreateEntity) return null;
  return (
    <div data-slot="workspace-object-type-new-action">
      <ButtonGroup
        className={cn(
          "h-8 w-[102.296875px] overflow-hidden rounded-[8px]",
          "bg-[var(--app-button-primary-bg)] text-[var(--app-button-primary-text)]",
        )}
      >
        <Button
          type="button"
          onClick={view.onCreateEntity}
          className={cn(
            "h-8 w-[73.296875px] gap-1 rounded-l-[8px] rounded-r-none border-0",
            "bg-transparent pl-3 pr-[11px] text-sm font-normal",
            "text-[var(--app-button-primary-text)]",
          )}
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Novo
        </Button>
        <ObjectListCreateMenu view={view} />
      </ButtonGroup>
    </div>
  );
}
