"use client";

import { useTranslations } from "next-intl";
import * as React from "react";

import {
  AppSidebarCheckIcon,
  AppSidebarCopyIcon,
  AppSidebarDotsIcon,
  AppSidebarObjectsIcon,
  AppSidebarPinIcon,
  AppSidebarPinOffIcon,
  AppSidebarPlusIcon,
  AppSidebarSunIcon,
} from "@/components/app-sidebar-icons";
import { AppSidebarObjectTypeStudio } from "@/components/app-sidebar-object-type-studio";
import { AppSidebarSourceIcon } from "@/components/app-sidebar-source-icon";
import {
  ObjectAreaIcon,
  ObjectCollectionIcon,
  ObjectIconBadge,
  objectIconToneBadgeClass,
  type ObjectIconProps,
  type ObjectIconTone,
} from "@/components/object-icons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CompactMenuAccountPanel,
  CompactMenuPlanBadge,
  compactMenuActionButtonClass,
  sidebarContextMenuContentClass,
  sidebarContextSubmenuContentClass,
} from "@/components/ui/compact-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  workspaceRevealActionClass,
  workspaceRowStateClass,
} from "@/components/ui/shared-styles";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  OBJECT_ICON_NAMES,
  type CreateStructureInput,
  type ObjectIconName,
  type StructureOwnership,
} from "@/lib/workspace-object-types";

type AppSidebarSortMode = "manual" | "alphabetical";

type AppSidebarTone = ObjectIconTone;

type AppSidebarPinnedEntity = {
  id: string;
  label: string;
  icon: React.ElementType<ObjectIconProps>;
  tone: AppSidebarTone;
};

type AppSidebarObjectType = {
  id: string;
  label: string;
  icon: React.ElementType<ObjectIconProps>;
  tone: AppSidebarTone;
  count: number;
  iconName?: ObjectIconName;
  ownership?: StructureOwnership;
  singularLabel?: string;
};

type AppSidebarCustomSection = {
  id: string;
  label: string;
  open: boolean;
};

type AppSidebarDragState = { kind: "pinned"; id: string } | null;

type AppSidebarCollectionAction =
  | "open"
  | "create"
  | "template"
  | "pin"
  | "unpin-type"
  | "settings"
  | "share"
  | "import"
  | "duplicate"
  | "delete";

function appSidebarCollectionId(objectTypeId: string, collection: string) {
  return `collection:${objectTypeId}:${encodeURIComponent(collection)}`;
}

const objectTypeMenuIconPaths = {
  chevronRight:
    "m181.66 133.66l-80 80a8 8 0 0 1-11.32-11.32L164.69 128L90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32",
  import:
    "M205.66 117.66a8 8 0 0 1-11.32 0L136 59.31V216a8 8 0 0 1-16 0V59.31l-58.34 58.35a8 8 0 0 1-11.32-11.32l72-72a8 8 0 0 1 11.32 0l72 72a8 8 0 0 1 0 11.32",
  pin: "m235.32 81.37l-60.69-60.68a16 16 0 0 0-22.63 0l-53.63 53.8c-10.66-3.34-35-7.37-60.4 13.14a16 16 0 0 0-1.29 23.78L85 159.71l-42.66 42.63a8 8 0 0 0 11.32 11.32L96.29 171l48.29 48.29A16 16 0 0 0 155.9 224h1.13a15.93 15.93 0 0 0 11.64-6.33c19.64-26.1 17.75-47.32 13.19-60L235.33 104a16 16 0 0 0-.01-22.63M224 92.69l-57.27 57.46a8 8 0 0 0-1.49 9.22c9.46 18.93-1.8 38.59-9.34 48.62L48 100.08c12.08-9.74 23.64-12.31 32.48-12.31A40.1 40.1 0 0 1 96.81 91a8 8 0 0 0 9.25-1.51L163.32 32L224 92.68Z",
  plus: "M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8",
  settings:
    "M128 80a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m88-29.84q.06-2.16 0-4.32l14.92-18.64a8 8 0 0 0 1.48-7.06a107.2 107.2 0 0 0-10.88-26.25a8 8 0 0 0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186 40.54a8 8 0 0 0-3.94-6a107.7 107.7 0 0 0-26.25-10.87a8 8 0 0 0-7.06 1.49L130.16 40h-4.32L107.2 25.11a8 8 0 0 0-7.06-1.48a107.6 107.6 0 0 0-26.25 10.88a8 8 0 0 0-3.93 6l-2.64 23.76q-1.56 1.49-3 3L40.54 70a8 8 0 0 0-6 3.94a107.7 107.7 0 0 0-10.87 26.25a8 8 0 0 0 1.49 7.06L40 125.84v4.32L25.11 148.8a8 8 0 0 0-1.48 7.06a107.2 107.2 0 0 0 10.88 26.25a8 8 0 0 0 6 3.93l23.72 2.64q1.49 1.56 3 3L70 215.46a8 8 0 0 0 3.94 6a107.7 107.7 0 0 0 26.25 10.87a8 8 0 0 0 7.06-1.49L125.84 216q2.16.06 4.32 0l18.64 14.92a8 8 0 0 0 7.06 1.48a107.2 107.2 0 0 0 26.25-10.88a8 8 0 0 0 3.93-6l2.64-23.72q1.56-1.48 3-3l23.78-2.8a8 8 0 0 0 6-3.94a107.7 107.7 0 0 0 10.87-26.25a8 8 0 0 0-1.49-7.06Zm-16.1-6.5a74 74 0 0 1 0 8.68a8 8 0 0 0 1.74 5.48l14.19 17.73a91.6 91.6 0 0 1-6.23 15l-22.6 2.56a8 8 0 0 0-5.1 2.64a74 74 0 0 1-6.14 6.14a8 8 0 0 0-2.64 5.1l-2.51 22.58a91.3 91.3 0 0 1-15 6.23l-17.74-14.19a8 8 0 0 0-5-1.75h-.48a74 74 0 0 1-8.68 0a8 8 0 0 0-5.48 1.74l-17.78 14.2a91.6 91.6 0 0 1-15-6.23L82.89 187a8 8 0 0 0-2.64-5.1a74 74 0 0 1-6.14-6.14a8 8 0 0 0-5.1-2.64l-22.58-2.52a91.3 91.3 0 0 1-6.23-15l14.19-17.74a8 8 0 0 0 1.74-5.48a74 74 0 0 1 0-8.68a8 8 0 0 0-1.74-5.48L40.2 100.45a91.6 91.6 0 0 1 6.23-15L69 82.89a8 8 0 0 0 5.1-2.64a74 74 0 0 1 6.14-6.14A8 8 0 0 0 82.89 69l2.51-22.57a91.3 91.3 0 0 1 15-6.23l17.74 14.19a8 8 0 0 0 5.48 1.74a74 74 0 0 1 8.68 0a8 8 0 0 0 5.48-1.74l17.77-14.19a91.6 91.6 0 0 1 15 6.23L173.11 69a8 8 0 0 0 2.64 5.1a74 74 0 0 1 6.14 6.14a8 8 0 0 0 5.1 2.64l22.58 2.51a91.3 91.3 0 0 1 6.23 15l-14.19 17.74a8 8 0 0 0-1.74 5.53Z",
} as const;

function AppSidebarObjectTypeMenuIcon({
  name,
  className,
  ...props
}: {
  name: keyof typeof objectTypeMenuIconPaths;
  className?: string;
} & React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={cn("flex size-3 items-center justify-center", className)}
    >
      <svg
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        className="size-full"
      >
        <path d={objectTypeMenuIconPaths[name]} />
      </svg>
    </span>
  );
}

function reorderById<T extends { id: string }>(
  items: T[],
  fromId: string,
  toId: string,
) {
  if (fromId === toId) return items;

  const from = items.findIndex((item) => item.id === fromId);
  const to = items.findIndex((item) => item.id === toId);
  if (from < 0 || to < 0) return items;

  const next = [...items];
  const [moving] = next.splice(from, 1);
  if (!moving) return items;

  next.splice(to, 0, moving);
  return next;
}

function AppSidebarTypeLabel({
  icon: Icon,
  tone,
  children,
}: {
  icon: React.ElementType<ObjectIconProps>;
  tone: AppSidebarTone;
  children: React.ReactNode;
}) {
  return (
    <span
      data-slot="app-sidebar-type-label"
      className={cn(
        "inline-flex max-w-full min-w-0 items-center overflow-x-clip whitespace-nowrap",
        "rounded-[0.475em] border border-transparent px-[0.49em] py-[0.2em] leading-[1.3]",
      )}
    >
      <span className="mr-[0.4em] ml-[-0.1em] inline-flex min-h-[1.3em] min-w-[1.3em] shrink-0 items-center justify-center">
        <ObjectIconBadge icon={Icon} tone={tone} variant="sidebar" />
      </span>

      <span className="block min-w-0 truncate text-left text-[1em]">
        {children}
      </span>
    </span>
  );
}

function AppSidebarSectionMenu({
  value,
  onValueChange,
}: {
  value: AppSidebarSortMode;
  onValueChange: (value: AppSidebarSortMode) => void;
}) {
  const t = useTranslations("workspace.sidebarSections");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("sort")}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-200",
          "group-hover/app-sidebar-section:opacity-70 hover:!opacity-100 data-popup-open:opacity-100",
        )}
      >
        <AppSidebarDotsIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-56"
      >
        <DropdownMenuItem onClick={() => onValueChange("manual")}>
          {t("manual")}
          {value === "manual" && <AppSidebarCheckIcon className="ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onValueChange("alphabetical")}>
          {t("alphabetical")}
          {value === "alphabetical" && (
            <AppSidebarCheckIcon className="ml-auto" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppSidebarSection({
  icon: Icon,
  label,
  count,
  sort,
  onSortChange,
  action,
  open,
  onOpenChange,
  sticky = true,
  children,
}: {
  icon: React.ElementType<ObjectIconProps>;
  label: string;
  count?: number;
  sort?: AppSidebarSortMode;
  onSortChange?: (sort: AppSidebarSortMode) => void;
  action?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sticky?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      data-slot="app-sidebar-section"
      className="flex shrink-0 flex-col"
    >
      <div
        className={cn(
          "group/app-sidebar-section mt-0 mr-2 ml-px bg-sidebar px-2 pr-1",
          sticky && "sticky top-0 z-[5]",
        )}
      >
        <div
          className={cn(
            "flex h-6 w-full select-none items-center gap-x-1.5 truncate rounded-md px-2 py-1",
            "text-[12px] text-muted-foreground transition duration-200 ease-out hover:bg-sidebar-accent",
          )}
        >
          <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-x-1.5 overflow-hidden text-left outline-none">
            <Icon className="size-[1em] shrink-0" />
            <span className="min-w-0 truncate font-medium">{label}</span>
            <span
              className={cn(
                "-ml-0.5 mr-1 flex size-4 shrink-0 items-center justify-center opacity-0",
                "transition duration-200 ease-in-out group-hover/app-sidebar-section:opacity-80",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-3 items-center justify-center transition-transform duration-200",
                  !open && "-rotate-90",
                )}
              >
                <svg
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-full"
                >
                  <path d="m216.49 104.49-80 80a12 12 0 0 1-17 0l-80-80a12 12 0 0 1 17-17L128 159l71.51-71.52a12 12 0 0 1 17 17Z" />
                </svg>
              </span>
            </span>
            <span className="min-w-0 flex-1" />
          </CollapsibleTrigger>

          <div className="flex h-4 max-w-max shrink-0 items-center gap-px pb-px">
            {typeof count === "number" && (
              <span
                className={cn(
                  "inline-flex min-w-[1.3em] items-center justify-center rounded-[0.475em]",
                  "border border-transparent px-[0.49em] py-[0.2em] text-[11px] leading-[1.3]",
                  "text-muted-foreground opacity-0 transition-opacity duration-200",
                  "group-hover/app-sidebar-section:opacity-80",
                )}
              >
                {count}
              </span>
            )}

            {sort && onSortChange && (
              <AppSidebarSectionMenu
                value={sort}
                onValueChange={onSortChange}
              />
            )}

            {action}
          </div>
        </div>
      </div>

      <CollapsibleContent className="flex w-full max-w-full flex-col pt-0.5 pb-1.5">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function AppSidebarPinnedMenu({
  entity,
  onUnpin,
}: {
  entity: AppSidebarPinnedEntity;
  onUnpin: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Ações de ${entity.label}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-150",
          "group-hover/pinned-row:opacity-70 hover:!opacity-100 data-popup-open:opacity-100",
        )}
      >
        <AppSidebarDotsIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-64"
      >
        <DropdownMenuItem>
          <AppSidebarSourceIcon name="external" />
          Abrir
        </DropdownMenuItem>
        <DropdownMenuItem>Abrir no painel lateral</DropdownMenuItem>
        <DropdownMenuItem>Abrir em nova aba</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onUnpin}>
          <AppSidebarPinOffIcon />
          Desafixar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppSidebarPinnedRow({
  entity,
  active,
  dragging,
  draggable,
  onSelect,
  onUnpin,
  onDragStart,
  onDrop,
}: {
  entity: AppSidebarPinnedEntity;
  active: boolean;
  dragging: boolean;
  draggable: boolean;
  onSelect: () => void;
  onUnpin: () => void;
  onDragStart: () => void;
  onDrop: () => void;
}) {
  return (
    /* biome-ignore lint/a11y/noStaticElementInteractions: native drag events belong on the visual row wrapper */
    <div
      role="presentation"
      data-slot="app-sidebar-pinned-row-wrapper"
      className="mx-2"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={(event) => {
        if (draggable) event.preventDefault();
      }}
      onDrop={(event) => {
        if (!draggable) return;
        event.preventDefault();
        onDrop();
      }}
    >
      <div
        data-slot="app-sidebar-pinned-row"
        data-active={active || undefined}
        data-dragging={dragging || undefined}
        className={cn(
          "group/interactive group/pinned-row flex h-[29px] w-full shrink-0 items-center rounded-md py-px pr-1.5 pl-[3px]",
          "text-left text-sm font-normal text-muted-foreground",
          workspaceRowStateClass,
          "data-[dragging=true]:opacity-40",
        )}
      >
        <button
          type="button"
          className="relative flex min-w-0 flex-1 items-center py-px text-left outline-none"
          onClick={onSelect}
        >
          <span
            className={cn(
              "flex w-12 min-w-0 flex-1 items-center gap-x-1.5 truncate",
              active && "font-medium",
            )}
          >
            <AppSidebarTypeLabel icon={entity.icon} tone={entity.tone}>
              {entity.label}
            </AppSidebarTypeLabel>
          </span>
        </button>

        <div
          className={cn(
            "flex w-[26px] shrink-0 items-center justify-end",
            workspaceRevealActionClass,
          )}
        >
          <span className="ml-auto" />
          <AppSidebarPinnedMenu entity={entity} onUnpin={onUnpin} />
        </div>
      </div>
    </div>
  );
}

function AppSidebarObjectTypeMenu({
  objectType,
  onUpdate,
  onDelete,
}: {
  objectType: AppSidebarObjectType;
  onUpdate?: (
    id: string,
    input: {
      singularName: string;
      pluralName: string;
      iconName: ObjectIconName;
      tone: AppSidebarTone;
    },
  ) => void;
  onDelete?: (id: string) => void;
}) {
  const t = useTranslations("workspace.objectTypeStudio");
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const settingsNameInputId = React.useId();
  const settingsPluralInputId = React.useId();
  const settingsIconInputId = React.useId();
  const settingsToneInputId = React.useId();
  const [singularName, setSingularName] = React.useState(
    objectType.singularLabel ?? objectType.label,
  );
  const [pluralName, setPluralName] = React.useState(objectType.label);
  const [iconName, setIconName] = React.useState<ObjectIconName>(
    objectType.iconName ?? "area",
  );
  const [tone, setTone] = React.useState<AppSidebarTone>(objectType.tone);
  const editable =
    objectType.ownership === "custom" || objectType.ownership === "legacy";

  function openSettings() {
    setSingularName(objectType.singularLabel ?? objectType.label);
    setPluralName(objectType.label);
    setIconName(objectType.iconName ?? "area");
    setTone(objectType.tone);
    setSettingsOpen(true);
  }

  function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!singularName.trim() || !pluralName.trim()) return;
    onUpdate?.(objectType.id, {
      singularName: singularName.trim(),
      pluralName: pluralName.trim(),
      iconName,
      tone,
    });
    setSettingsOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t("actionsLabel", { type: objectType.label })}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-xs" }),
            "size-[22px] shrink-0 opacity-0 transition-opacity duration-150",
            "group-hover/object-type-row:opacity-70 hover:!opacity-100 data-popup-open:opacity-100",
          )}
        >
          <AppSidebarDotsIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={8}
          className={sidebarContextMenuContentClass}
        >
          <DropdownMenuItem onClick={openSettings} disabled={!editable}>
            <AppSidebarObjectTypeMenuIcon name="settings" />
            {t("details.settings")}
          </DropdownMenuItem>
          {editable && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete?.(objectType.id)}
              >
                {t("details.delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <form onSubmit={saveSettings}>
            <DialogHeader>
              <DialogTitle>{t("details.settings")}</DialogTitle>
              <DialogDescription>
                {t("details.settingsDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <label
                htmlFor={settingsNameInputId}
                className="grid gap-1 text-sm"
              >
                {t("details.name")}
                <Input
                  id={settingsNameInputId}
                  value={singularName}
                  onChange={(event) => setSingularName(event.target.value)}
                  autoFocus
                />
              </label>
              <label
                htmlFor={settingsPluralInputId}
                className="grid gap-1 text-sm"
              >
                {t("details.pluralName")}
                <Input
                  id={settingsPluralInputId}
                  value={pluralName}
                  onChange={(event) => setPluralName(event.target.value)}
                />
              </label>
              <label
                htmlFor={settingsIconInputId}
                className="grid gap-1 text-sm"
              >
                {t("details.icon")}
                <select
                  id={settingsIconInputId}
                  value={iconName}
                  onChange={(event) =>
                    setIconName(event.target.value as ObjectIconName)
                  }
                  className="h-9 rounded-md border bg-background px-2"
                >
                  {OBJECT_ICON_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label
                htmlFor={settingsToneInputId}
                className="grid gap-1 text-sm"
              >
                {t("details.color")}
                <select
                  id={settingsToneInputId}
                  value={tone}
                  onChange={(event) =>
                    setTone(event.target.value as AppSidebarTone)
                  }
                  className="h-9 rounded-md border bg-background px-2"
                >
                  {Object.keys(objectIconToneBadgeClass).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!singularName.trim() || !pluralName.trim()}
              >
                {t("details.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AppSidebarObjectTypeRow({
  objectType,
  collections,
  collectionsOpen,
  active,
  activeId,
  onSelect,
  onCollectionsOpenChange,
  onCollectionAction,
  onUpdate,
  onDelete,
}: {
  objectType: AppSidebarObjectType;
  collections: string[];
  collectionsOpen: boolean;
  active: boolean;
  activeId: string | null;
  onSelect: () => void;
  onCollectionsOpenChange: (open: boolean) => void;
  onCollectionAction: (
    action: AppSidebarCollectionAction,
    objectType: AppSidebarObjectType,
    collection: string,
  ) => void;
  onUpdate?: (
    id: string,
    input: {
      singularName: string;
      pluralName: string;
      iconName: ObjectIconName;
      tone: AppSidebarTone;
    },
  ) => void;
  onDelete?: (id: string) => void;
}) {
  const hasCollections = collections.length > 0;

  return (
    <div data-slot="app-sidebar-object-type-row-wrapper" className="mx-2">
      <div
        data-slot="app-sidebar-object-type-row"
        data-active={active || undefined}
        className={cn(
          "group/interactive group/object-type-row flex h-[29px] w-full shrink-0 items-center rounded-md py-px pr-1.5 pl-[3px]",
          "text-left text-sm font-normal text-muted-foreground",
          workspaceRowStateClass,
        )}
      >
        {hasCollections && (
          <button
            type="button"
            aria-label={objectType.label}
            aria-expanded={collectionsOpen}
            className={cn(
              "relative ml-[5px] inline-flex size-[21px] shrink-0 items-center justify-center rounded-md bg-transparent text-muted-foreground",
              "transition-[background-color,opacity] duration-150 ease-out motion-reduce:transition-none",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground",
              "focus-visible:[&_[data-slot=app-sidebar-object-type-icon]]:opacity-0 focus-visible:[&_[data-slot=app-sidebar-object-type-chevron]]:opacity-100",
            )}
            onClick={() => onCollectionsOpenChange(!collectionsOpen)}
          >
            <span
              data-slot="app-sidebar-object-type-icon"
              className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-150 motion-reduce:transition-none group-hover/object-type-row:opacity-0"
            >
              <ObjectIconBadge
                icon={objectType.icon}
                tone={objectType.tone}
                variant="sidebar"
              />
            </span>
            <AppSidebarObjectTypeMenuIcon
              data-slot="app-sidebar-object-type-chevron"
              name="chevronRight"
              className={cn(
                "size-3 opacity-0 transition-[opacity,transform] duration-150 motion-reduce:transition-none group-hover/object-type-row:opacity-100",
                collectionsOpen && "rotate-90",
              )}
            />
          </button>
        )}

        <button
          type="button"
          className="relative flex min-w-0 flex-1 items-center py-px text-left outline-none"
          onClick={onSelect}
        >
          <span className="flex w-12 min-w-0 flex-1 items-center gap-x-1.5 truncate">
            {hasCollections ? (
              <span className="ml-[4px] block min-w-0 truncate px-[0.49em] py-[0.2em] text-left leading-[1.3]">
                {objectType.label}
              </span>
            ) : (
              <AppSidebarTypeLabel
                icon={objectType.icon}
                tone={objectType.tone}
              >
                {objectType.label}
              </AppSidebarTypeLabel>
            )}
          </span>
        </button>

        <div
          className={cn(
            "flex w-12 shrink-0 items-center justify-end",
            workspaceRevealActionClass,
          )}
        >
          <span
            className={cn(
              "text-[11px] text-muted-foreground opacity-0 transition-opacity duration-200",
              "group-hover/object-type-row:opacity-80",
            )}
          >
            <span className="inline-flex min-w-[1.3em] items-center justify-center rounded-[0.475em] border border-transparent px-[0.49em] py-[0.2em] leading-[1.3]">
              {objectType.count}
            </span>
          </span>

          <AppSidebarObjectTypeMenu
            objectType={objectType}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      </div>

      {hasCollections && collectionsOpen && (
        <div data-slot="app-sidebar-object-type-collections">
          {collections.map((collection) => {
            const collectionId = appSidebarCollectionId(
              objectType.id,
              collection,
            );
            return (
              <div
                key={collection}
                data-slot="app-sidebar-collection-row"
                data-active={collectionId === activeId || undefined}
                className={cn(
                  "group/collection-row group/interactive flex h-[29px] w-full min-w-0 items-center rounded-md pl-[26px] pr-1 text-sm font-normal text-muted-foreground",
                  workspaceRowStateClass,
                )}
              >
                <button
                  type="button"
                  draggable={false}
                  className="flex min-w-0 flex-1 items-center text-left"
                  onClick={() =>
                    onCollectionAction("open", objectType, collection)
                  }
                >
                  <span className="mr-1.5 inline-flex min-h-[1.3em] min-w-[1.3em] shrink-0 items-center justify-center">
                    <ObjectIconBadge
                      icon={ObjectCollectionIcon}
                      tone="gray"
                      variant="sidebar"
                    />
                  </span>
                  <span className="min-w-0 truncate">{collection}</span>
                </button>
                <AppSidebarCollectionMenu
                  collection={collection}
                  objectType={objectType}
                  onAction={onCollectionAction}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AppSidebarPinnedPicker({
  entities,
  selectedIds,
  onPick,
}: {
  entities: AppSidebarPinnedEntity[];
  selectedIds: Set<string>;
  onPick: (entity: AppSidebarPinnedEntity) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const results = React.useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return entities.filter((entity) => {
      if (selectedIds.has(entity.id)) return false;
      return (
        !normalized ||
        entity.label.toLocaleLowerCase("pt-BR").includes(normalized)
      );
    });
  }, [entities, query, selectedIds]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Adicionar conteúdo aos Fixados"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-200",
          "group-hover/app-sidebar-section:opacity-100 data-popup-open:opacity-100",
        )}
      >
        <AppSidebarPlusIcon />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-72 gap-1 p-1.5"
      >
        <Input
          autoFocus
          value={query}
          className="h-8"
          placeholder="Adicionar conteúdo"
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="max-h-64 overflow-y-auto pt-1">
          {results.map((entity) => (
            <Button
              key={entity.id}
              type="button"
              variant="ghost"
              className="h-8 w-full justify-start px-1.5 font-normal"
              onClick={() => {
                onPick(entity);
                setQuery("");
                setOpen(false);
              }}
            >
              <AppSidebarTypeLabel icon={entity.icon} tone={entity.tone}>
                {entity.label}
              </AppSidebarTypeLabel>
            </Button>
          ))}

          {results.length === 0 && (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              Nenhum conteúdo disponível
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function AppSidebarSectionAction({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      data-slot="app-sidebar-section-action"
      type="button"
      variant="outline"
      size="icon-xs"
      aria-label={label}
      className="size-[22px] opacity-0 transition-opacity duration-200 group-hover/app-sidebar-section:opacity-100"
      onClick={onClick}
    >
      <AppSidebarPlusIcon />
    </Button>
  );
}

function AppSidebarAddSection({
  onCreate,
}: {
  onCreate: (section: AppSidebarCustomSection) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  function create() {
    const label = name.trim();
    if (!label) return;

    onCreate({ id: crypto.randomUUID(), label, open: true });
    setName("");
    setOpen(false);
  }

  return (
    <div
      data-slot="app-sidebar-add-section"
      className="mt-0 mr-2 ml-px bg-sidebar px-2 pr-0.5"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "ghost", size: "default" }),
            "pointer-events-none h-8 w-full justify-start gap-x-1.5 px-2 font-normal text-muted-foreground",
            "opacity-0 transition-opacity duration-200",
            "group-hover/section-container:pointer-events-auto group-hover/section-container:opacity-60",
            "hover:!opacity-100 data-popup-open:pointer-events-auto data-popup-open:opacity-100",
          )}
        >
          <AppSidebarPlusIcon />
          <span className="min-w-0 truncate">Adicionar seção</span>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="start"
          sideOffset={8}
          className="w-72 gap-2 p-2"
        >
          <Input
            autoFocus
            value={name}
            className="h-8"
            placeholder="Nome da seção"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              create();
            }}
          />
          <Button
            type="button"
            size="sm"
            className="w-full"
            disabled={!name.trim()}
            onClick={create}
          >
            Criar
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const utilityRowClass = cn(
  buttonVariants({ variant: "ghost", size: "default" }),
  "group/interactive group/utility h-8 w-full justify-start gap-x-1.5 px-2 font-normal text-muted-foreground",
  workspaceRowStateClass,
  "active:brightness-[0.97]",
);

function AppSidebarUtilityRow({
  icon: Icon,
  label,
  external,
  tooltip,
  active,
  onClick,
}: {
  icon: React.ElementType<ObjectIconProps>;
  label: string;
  external?: boolean;
  tooltip?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const row = (
    <span className="flex w-full min-w-0 items-center">
      <Icon className="mr-1.5 size-4 shrink-0" />
      <span className="min-w-0 truncate">{label}</span>
      {external && (
        <AppSidebarSourceIcon
          name="external"
          className={cn(
            "ml-auto size-3 shrink-0 opacity-0 transition-opacity duration-200 ease-out",
            "group-hover/utility:opacity-100",
          )}
        />
      )}
    </span>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger
          data-slot="app-sidebar-utility-row"
          className={cn(
            utilityRowClass,
            active &&
              "bg-sidebar-accent text-sidebar-accent-foreground brightness-[0.965]",
          )}
          onClick={onClick}
        >
          {row}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      data-slot="app-sidebar-utility-row"
      type="button"
      variant="ghost"
      className={cn(
        utilityRowClass,
        active &&
          "bg-sidebar-accent text-sidebar-accent-foreground brightness-[0.965]",
      )}
      onClick={onClick}
    >
      {row}
    </Button>
  );
}

function AppSidebarHelpSection() {
  const [open, setOpen] = React.useState(true);

  return (
    <AppSidebarSection
      icon={(props) => <AppSidebarSourceIcon name="help" {...props} />}
      label="Ajuda e recursos"
      open={open}
      onOpenChange={setOpen}
    >
      <div
        data-slot="app-sidebar-help-items"
        className="flex flex-col px-2 pr-0.5"
      >
        <AppSidebarUtilityRow
          icon={(props) => (
            <AppSidebarSourceIcon name="graduation" {...props} />
          )}
          label="Primeiros passos"
        />
        <AppSidebarUtilityRow
          icon={(props) => <AppSidebarSourceIcon name="help" {...props} />}
          label="Fazer uma pergunta"
          external
          tooltip="Faça perguntas sobre o Capacities"
        />
        <AppSidebarUtilityRow
          icon={(props) => (
            <AppSidebarSourceIcon name="documentation" {...props} />
          )}
          label="Documentação"
          external
          tooltip="Saiba mais sobre o Capacities e como você pode usá-lo"
        />
        <AppSidebarUtilityRow
          icon={(props) => <AppSidebarSourceIcon name="news" {...props} />}
          label="Novidades"
        />
        <AppSidebarUtilityRow
          icon={(props) => <AppSidebarSourceIcon name="feedback" {...props} />}
          label="Feedback"
          external
          tooltip="Compartilhe ideias, feedback ou problemas e vote em recursos"
        />
      </div>
    </AppSidebarSection>
  );
}

const footerIconClass = cn(
  buttonVariants({ variant: "ghost", size: "icon" }),
  "size-8 shrink-0 text-muted-foreground",
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:brightness-[0.97]",
);

function AppSidebarFooterTooltip({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        data-slot="app-sidebar-footer-action"
        aria-label={label}
        className={footerIconClass}
        onClick={onClick}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={7}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function AppSidebarFooter() {
  const t = useTranslations("workspace");
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <footer
      data-slot="app-sidebar-footer"
      className="flex shrink-0 flex-col gap-y-px px-2.5 py-1.5 pr-1 text-xs"
    >
      <div className="flex w-full flex-wrap items-center gap-x-0.5">
        <AppSidebarFooterTooltip label={t("footer.settings")}>
          <AppSidebarSourceIcon name="settings" className="size-4" />
        </AppSidebarFooterTooltip>

        <AppSidebarFooterTooltip
          label={dark ? t("footer.useLightTheme") : t("footer.useDarkTheme")}
          onClick={() => setDark((value) => !value)}
        >
          {dark ? (
            <AppSidebarSunIcon className="size-4" />
          ) : (
            <AppSidebarSourceIcon name="moon" className="size-4" />
          )}
        </AppSidebarFooterTooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t("footer.profile")}
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "h-8 w-auto shrink-0 gap-x-1.5 px-1.5 text-xs font-normal text-muted-foreground",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "active:brightness-[0.97] data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground",
            )}
          >
            <AppSidebarSourceIcon name="user" className="size-4" />
            <Badge
              variant="secondary"
              className="max-w-full gap-1 px-[0.49em] py-[0.2em] text-xs font-normal leading-[1.3] opacity-80"
            >
              <AppSidebarSourceIcon name="rocket" className="size-3" />
              <span className="truncate">Pro</span>
            </Badge>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={6}
            className="w-auto min-w-0 overflow-visible p-0"
          >
            <CompactMenuAccountPanel
              name="Ian Maciel Carvalho"
              email="ianmaciel76@gmail.com"
              badge={
                <CompactMenuPlanBadge
                  icon={(props) => (
                    <AppSidebarSourceIcon name="rocket" {...props} />
                  )}
                  label="Pro"
                />
              }
              action={
                <Button
                  type="button"
                  variant="ghost"
                  className={compactMenuActionButtonClass}
                >
                  <AppSidebarSourceIcon name="logout" className="size-[1em]" />
                  <span>{t("footer.signOut")}</span>
                </Button>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="min-w-0 flex-1" />

        <AppSidebarFooterTooltip label={t("documentMenu.share")}>
          <AppSidebarSourceIcon name="share" className="size-4" />
        </AppSidebarFooterTooltip>
      </div>
    </footer>
  );
}

type AppSidebarOverviewProps = {
  activeId?: string | null;
  onActiveIdChange?: (id: string | null) => void;
  pinnedEntities?: AppSidebarPinnedEntity[];
  availablePinnedEntities?: AppSidebarPinnedEntity[];
  objectTypes?: AppSidebarObjectType[];
  objectTypeCollections?: Record<string, string[]>;
  customSections?: AppSidebarCustomSection[];
  onCreateObjectTypeFromPreset?: (presetId: string) => void;
  onCreateObjectType?: (input: CreateStructureInput) => void;
  onUpdateObjectType?: (
    id: string,
    input: {
      singularName: string;
      pluralName: string;
      iconName: ObjectIconName;
      tone: AppSidebarTone;
    },
  ) => void;
  onDeleteObjectType?: (id: string) => void;
  onCollectionAction?: (
    action: AppSidebarCollectionAction,
    objectType: AppSidebarObjectType,
    collection: string,
  ) => void;
  onPinnedEntitiesChange?: React.Dispatch<
    React.SetStateAction<AppSidebarPinnedEntity[]>
  >;
  onCustomSectionsChange?: React.Dispatch<
    React.SetStateAction<AppSidebarCustomSection[]>
  >;
};

function AppSidebarCollectionMenu({
  collection,
  objectType,
  onAction,
}: {
  collection: string;
  objectType: AppSidebarObjectType;
  onAction: (
    action: AppSidebarCollectionAction,
    objectType: AppSidebarObjectType,
    collection: string,
  ) => void;
}) {
  const t = useTranslations("workspace");
  const objectTypeName = t(`objectTypeStudio.objectTypes.${objectType.id}`);
  const action = (name: AppSidebarCollectionAction) => () =>
    onAction(name, objectType, collection);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${t("actions.moreOptions")}: ${collection}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-[22px] shrink-0 opacity-0 transition-opacity duration-150",
          "group-hover/collection-row:opacity-70 hover:!opacity-100 data-popup-open:opacity-100",
        )}
      >
        <AppSidebarDotsIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={8}
        className={sidebarContextMenuContentClass}
      >
        <DropdownMenuItem onClick={action("open")}>
          <AppSidebarSourceIcon name="external" />
          {t("lifecycle.task.open")}
          <AppSidebarObjectTypeMenuIcon
            name="chevronRight"
            className="ml-auto"
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={action("create")}>
          <AppSidebarPlusIcon />
          {t("sidebarCollections.createObject", { type: objectTypeName })}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={action("template")}>
          <AppSidebarCopyIcon />
          {t("objectTypeOverview.newFromTemplate")}
          <AppSidebarObjectTypeMenuIcon
            name="chevronRight"
            className="ml-auto"
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={action("pin")}>
          <AppSidebarPinIcon />
          {t("documentMenu.pinSidebar")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={action("unpin-type")}>
          <AppSidebarPinOffIcon />
          {t("sidebarCollections.unpinFromType")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={action("settings")}>
          <AppSidebarSourceIcon name="settings" />
          {t("documentMenu.typeSettings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={action("share")}>
          <AppSidebarSourceIcon name="share" />
          {t("documentMenu.share")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={action("import")}>
          <AppSidebarObjectTypeMenuIcon name="import" />
          {t("documentMenu.import")}
          <DropdownMenuShortcut>Ctrl I</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <AppSidebarCopyIcon />
            {t("documentMenu.copy")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={sidebarContextSubmenuContentClass}>
            <DropdownMenuItem onClick={action("duplicate")}>
              <AppSidebarCopyIcon />
              {t("documentMenu.duplicate")}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem variant="destructive" onClick={action("delete")}>
          <AppSidebarSourceIcon name="trash" />
          {t("sidebarCollections.deleteCollection")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppSidebarOverview({
  activeId: controlledActiveId,
  onActiveIdChange,
  pinnedEntities: controlledPinned,
  availablePinnedEntities = [],
  objectTypes = [],
  objectTypeCollections = {},
  customSections: controlledCustomSections,
  onCreateObjectTypeFromPreset,
  onCreateObjectType,
  onUpdateObjectType,
  onDeleteObjectType,
  onPinnedEntitiesChange,
  onCustomSectionsChange,
  onCollectionAction,
}: AppSidebarOverviewProps = {}) {
  const t = useTranslations("workspace");
  const [internalActiveId, setInternalActiveId] = React.useState<string | null>(
    null,
  );
  const isControlled = controlledActiveId !== undefined;
  const activeId = isControlled ? controlledActiveId : internalActiveId;

  function setActiveId(id: string | null) {
    if (!isControlled) setInternalActiveId(id);
    onActiveIdChange?.(id);
  }
  const [pinnedOpen, setPinnedOpen] = React.useState(true);
  const [objectTypesOpen, setObjectTypesOpen] = React.useState(true);
  const [objectTypeCollectionsOpen, setObjectTypeCollectionsOpen] =
    React.useState<Record<string, boolean>>({});
  const [pinnedSort, setPinnedSort] =
    React.useState<AppSidebarSortMode>("manual");
  const [objectSort, setObjectSort] =
    React.useState<AppSidebarSortMode>("manual");
  const [internalPinned, setInternalPinned] = React.useState<
    AppSidebarPinnedEntity[]
  >([]);
  const [internalCustomSections, setInternalCustomSections] = React.useState<
    AppSidebarCustomSection[]
  >([]);
  const [drag, setDrag] = React.useState<AppSidebarDragState>(null);

  const pinned = controlledPinned ?? internalPinned;
  const customSections = controlledCustomSections ?? internalCustomSections;
  const setPinned = React.useCallback<
    React.Dispatch<React.SetStateAction<AppSidebarPinnedEntity[]>>
  >(
    (next) => {
      if (controlledPinned !== undefined) {
        const resolved =
          typeof next === "function" ? next(controlledPinned) : next;
        onPinnedEntitiesChange?.(resolved);
        return;
      }

      setInternalPinned(next);
    },
    [controlledPinned, onPinnedEntitiesChange],
  );
  const setCustomSections = React.useCallback<
    React.Dispatch<React.SetStateAction<AppSidebarCustomSection[]>>
  >(
    (next) => {
      if (controlledCustomSections !== undefined) {
        const resolved =
          typeof next === "function" ? next(controlledCustomSections) : next;
        onCustomSectionsChange?.(resolved);
        return;
      }

      setInternalCustomSections(next);
    },
    [controlledCustomSections, onCustomSectionsChange],
  );

  const pinnedIds = React.useMemo(
    () => new Set(pinned.map((entity) => entity.id)),
    [pinned],
  );

  const visiblePinned = React.useMemo(
    () =>
      pinnedSort === "alphabetical"
        ? [...pinned].sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))
        : pinned,
    [pinned, pinnedSort],
  );

  const visibleObjectTypes = React.useMemo(
    () =>
      objectSort === "alphabetical"
        ? [...objectTypes].sort((a, b) =>
            a.label.localeCompare(b.label, "pt-BR"),
          )
        : objectTypes,
    [objectSort, objectTypes],
  );

  return (
    <div
      data-slot="app-sidebar-overview"
      className="flex min-h-0 flex-1 flex-col"
    >
      <div data-slot="app-sidebar-pinned-region" className="shrink-0">
        <AppSidebarSection
          icon={AppSidebarPinIcon}
          label="Fixados"
          count={pinned.length}
          sort={pinnedSort}
          onSortChange={setPinnedSort}
          open={pinnedOpen}
          onOpenChange={setPinnedOpen}
          sticky={false}
          action={
            <AppSidebarPinnedPicker
              entities={availablePinnedEntities}
              selectedIds={pinnedIds}
              onPick={(entity) => setPinned((current) => [...current, entity])}
            />
          }
        >
          {visiblePinned.length === 0 ? (
            <p className="h-10 px-5 py-1.5 text-xs italic leading-[18px] text-muted-foreground">
              Nenhum conteúdo fixado
            </p>
          ) : (
            visiblePinned.map((entity) => (
              <AppSidebarPinnedRow
                key={entity.id}
                entity={entity}
                active={activeId === entity.id}
                dragging={drag?.kind === "pinned" && drag.id === entity.id}
                draggable={pinnedSort === "manual"}
                onSelect={() => setActiveId(entity.id)}
                onUnpin={() =>
                  setPinned((current) =>
                    current.filter((item) => item.id !== entity.id),
                  )
                }
                onDragStart={() => setDrag({ kind: "pinned", id: entity.id })}
                onDrop={() => {
                  if (drag?.kind !== "pinned" || pinnedSort !== "manual")
                    return;
                  setPinned((current) =>
                    reorderById(current, drag.id, entity.id),
                  );
                  setDrag(null);
                }}
              />
            ))
          )}
        </AppSidebarSection>
      </div>

      <ScrollArea
        data-slot="app-sidebar-scroll-area"
        className={cn(
          "group/section-container relative mt-0.5 h-32 min-h-0 grow",
          "[&_[data-slot=scroll-area-viewport]>div]:!flex",
          "[&_[data-slot=scroll-area-viewport]>div]:!min-h-full",
          "[&_[data-slot=scroll-area-viewport]>div]:!w-full",
          "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:!w-[6px]",
          "[&_[data-slot=scroll-area-scrollbar]]:!p-0",
        )}
      >
        <div className="flex min-h-full w-full flex-col">
          <AppSidebarSection
            icon={AppSidebarObjectsIcon}
            label={t("footer.objectTypes")}
            count={objectTypes.length}
            sort={objectSort}
            onSortChange={setObjectSort}
            open={objectTypesOpen}
            onOpenChange={setObjectTypesOpen}
            action={
              <AppSidebarObjectTypeStudio
                onCreateFromPreset={onCreateObjectTypeFromPreset}
                onCreateCustom={onCreateObjectType}
                trigger={
                  <AppSidebarSectionAction
                    label={t("objectTypeStudio.trigger")}
                  />
                }
              />
            }
          >
            {visibleObjectTypes.map((objectType) => (
              <AppSidebarObjectTypeRow
                key={objectType.id}
                objectType={objectType}
                collections={objectTypeCollections[objectType.id] ?? []}
                collectionsOpen={
                  objectTypeCollectionsOpen[objectType.id] ?? true
                }
                active={activeId === objectType.id}
                activeId={activeId}
                onSelect={() => setActiveId(objectType.id)}
                onCollectionsOpenChange={(open) =>
                  setObjectTypeCollectionsOpen((current) => ({
                    ...current,
                    [objectType.id]: open,
                  }))
                }
                onCollectionAction={(action, type, collection) => {
                  if (action === "open") {
                    setActiveId(appSidebarCollectionId(type.id, collection));
                  }
                  onCollectionAction?.(action, type, collection);
                }}
                onUpdate={onUpdateObjectType}
                onDelete={onDeleteObjectType}
              />
            ))}
          </AppSidebarSection>

          {customSections.map((section) => (
            <AppSidebarSection
              key={section.id}
              icon={ObjectAreaIcon}
              label={section.label}
              open={section.open}
              onOpenChange={(open) =>
                setCustomSections((current) =>
                  current.map((item) =>
                    item.id === section.id ? { ...item, open } : item,
                  ),
                )
              }
            >
              <p className="h-10 px-5 py-1.5 text-xs italic leading-[18px] text-muted-foreground">
                Nenhum conteúdo
              </p>
            </AppSidebarSection>
          ))}

          <AppSidebarAddSection
            onCreate={(section) =>
              setCustomSections((current) => [...current, section])
            }
          />

          <div className="h-4 w-full shrink-0" />

          <div
            data-slot="app-sidebar-lower-content"
            className="mt-auto flex w-full flex-col pb-2"
          >
            <div className="flex flex-col px-2 pr-0.5">
              <AppSidebarUtilityRow
                icon={(props) => (
                  <AppSidebarSourceIcon name="trash" {...props} />
                )}
                label="Lixeira"
                active={activeId === "trash"}
                onClick={() => setActiveId("trash")}
              />
            </div>

            <div className="mt-2">
              <AppSidebarHelpSection />
            </div>
          </div>
        </div>
      </ScrollArea>

      <AppSidebarFooter />
    </div>
  );
}

export {
  appSidebarCollectionId,
  AppSidebarAddSection,
  AppSidebarFooter,
  AppSidebarHelpSection,
  AppSidebarObjectTypeRow,
  AppSidebarOverview,
  AppSidebarPinnedPicker,
  AppSidebarPinnedRow,
  AppSidebarSection,
  AppSidebarSectionAction,
  AppSidebarSectionMenu,
  AppSidebarTypeLabel,
  AppSidebarUtilityRow,
  type AppSidebarCustomSection,
  type AppSidebarCollectionAction,
  type AppSidebarObjectType,
  type AppSidebarPinnedEntity,
  type AppSidebarSortMode,
  type AppSidebarTone,
};
