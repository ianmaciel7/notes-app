"use client";

import { useTranslations } from "next-intl";
import * as React from "react";

import { WorkspaceSidebar as BaseWorkspaceSidebar } from "./app-sidebar-primary-actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ObjectIconBadge } from "@/components/object-icons";
import { useWorkspace } from "@/components/workspace-controller";
import { objectLifecycleContractSlots } from "@/lib/object-lifecycle-contracts";

function NewContentCommandDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("workspace");
  const { objectTypes, createWorkspaceEntity } = useWorkspace();
  const availableObjectTypes = objectTypes ?? [];

  function selectObjectType(objectTypeId: string, objectTypeLabel: string) {
    createWorkspaceEntity(objectTypeId, objectTypeLabel);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lifecycle-contract={objectLifecycleContractSlots.ObjectCreationMenu}
        showCloseButton={false}
        overlayClassName="bg-black/50 backdrop-blur-none"
        className="top-0 left-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-popover p-0 ring-0 sm:top-[10vh] sm:left-1/2 sm:h-auto sm:max-h-[85vh] sm:w-[min(42rem,calc(100vw-3rem))] sm:max-w-2xl sm:-translate-x-1/2 sm:rounded-xl sm:ring-1 sm:ring-foreground/10"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{t("primaryNavigation.new")}</DialogTitle>
          <DialogDescription>{t("primaryNavigation.searchContentType")}</DialogDescription>
        </DialogHeader>

        <Command className="min-h-0 flex-1 rounded-none bg-popover p-0">
          <div className="shrink-0 border-b border-border px-3 py-2">
            <CommandInput
              autoFocus
              placeholder={t("primaryNavigation.searchContentType")}
              className="text-base"
            />
          </div>

          <CommandList className="min-h-0 max-h-none flex-1 scroll-py-8 overflow-x-hidden overflow-y-auto px-1.5 py-1">
            <CommandEmpty>{t("primaryNavigation.searchContentType")}</CommandEmpty>
            <CommandGroup heading={t("primaryNavigation.typesLabel")}>
              {availableObjectTypes.map((objectType: any) => {
                const label = objectType.singularLabel ?? objectType.label;
                return (
                  <CommandItem
                    key={objectType.id}
                    value={`${label} ${objectType.label}`}
                    data-lifecycle-contract={objectLifecycleContractSlots.ObjectTypeOptionRow}
                    className="min-h-10 cursor-pointer gap-2 rounded-lg px-2 py-1.5"
                    onSelect={() => selectObjectType(objectType.id, label)}
                  >
                    <ObjectIconBadge
                      icon={objectType.icon}
                      tone={objectType.tone}
                      variant="menu"
                    />
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>

        <div className="mx-1 flex h-9 shrink-0 items-center gap-x-3 overflow-hidden border-t border-border px-2 py-1.5 text-xs text-muted-foreground">
          <span className="whitespace-nowrap">
            <span className="font-medium">↑↓</span> {t("primaryNavigation.navigate")}
          </span>
          <span className="whitespace-nowrap">
            <span className="font-medium">Esc</span> {t("primaryNavigation.cancel")}
          </span>
          <span className="whitespace-nowrap">
            <span className="font-medium">↵</span> {t("primaryNavigation.select")}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function isNewContentTrigger(target: EventTarget | null) {
  return target instanceof Element && target.closest("#workspace-new-trigger") !== null;
}

function WorkspaceNewContentDialogController() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function blockLegacyPointerDown(event: PointerEvent) {
      if (!isNewContentTrigger(event.target)) return;
      event.stopImmediatePropagation();
    }

    function openFromClick(event: MouseEvent) {
      if (!isNewContentTrigger(event.target)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(true);
    }

    function openFromWorkspace(event: Event) {
      event.stopImmediatePropagation();
      setOpen(true);
    }

    document.addEventListener("pointerdown", blockLegacyPointerDown, true);
    document.addEventListener("click", openFromClick, true);
    window.addEventListener("workspace:open-new-palette", openFromWorkspace, true);

    return () => {
      document.removeEventListener("pointerdown", blockLegacyPointerDown, true);
      document.removeEventListener("click", openFromClick, true);
      window.removeEventListener("workspace:open-new-palette", openFromWorkspace, true);
    };
  }, []);

  return <NewContentCommandDialog open={open} onOpenChange={setOpen} />;
}

function WorkspaceSidebar() {
  return <BaseWorkspaceSidebar />;
}

export * from "./app-sidebar-primary-actions";
export { WorkspaceNewContentDialogController, WorkspaceSidebar };
