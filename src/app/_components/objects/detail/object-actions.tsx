"use client";

import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { ObjectEditor } from "@/app/_components/objects/detail/object-editor";
import { ObjectTrashButton } from "@/app/_components/objects/detail/object-trash-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

export function ObjectActions({ entity }: { entity: SpaceEntityRecord }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);

  return (
    <div
      data-slot="object-actions"
      className="relative no-drag shrink-0 grow-0"
      data-context-menu-entity-context-key={`${entity.id}:Page`}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Mais ações"
          className="border-[var(--app-border-el-subtle)] hover:border-[var(--app-border-el-subtle-hover)] bg-[var(--app-bg-base)] border text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] w-[26px] h-[26px] text-sm justify-center ring-state-active box-border cursor-pointer gap-x-1.5 max-w-full truncate rounded-base relative flex shrink-0 items-center transition-[opacity] duration-200 ease-out no-drag"
        >
          <span className="inline-flex size-[1em] shrink-0 grow-0 items-center justify-center leading-none relative">
            <span className="inline-flex size-full items-center justify-center [&>svg]:size-full">
              <MoreHorizontal className="size-4" />
            </span>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setEditorOpen(true)}>
            <Edit3 className="mr-2 size-4" />
            Editar objeto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTrashOpen(true)} className="text-destructive">
            <Trash2 className="mr-2 size-4" />
            Mover para a lixeira
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden triggered dialogs for editing and trashing */}
      <div className="hidden">
        <ObjectEditor entity={entity} />
        <ObjectTrashButton entity={entity} />
      </div>
    </div>
  );
}
