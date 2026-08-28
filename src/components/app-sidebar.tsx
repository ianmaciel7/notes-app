"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import {
  AppSidebarAlertIcon,
  AppSidebarCheckIcon,
  AppSidebarChevronsUpDownIcon,
  AppSidebarGripVerticalIcon,
  AppSidebarPlusIcon,
  AppSidebarXIcon,
} from "@/components/app-sidebar-icons";
import { AppShellContent, AppShellHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import {
  CompactMenuIconFrame,
  CompactMenuItemText,
  compactMenuActionButtonClass,
  compactMenuItemClass,
  compactMenuSearchClass,
  compactMenuSurfaceClass,
} from "@/components/ui/compact-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SPACE_MENU_MAX_HEIGHT = "27rem";

type AppSidebarSpace = {
  id: string;
  name: string;
  icon: React.ElementType;
};

type AppSidebarLabels = {
  changeSpace: string;
  search: string;
  clearSearch: string;
  empty: string;
  createSpace: string;
  createSpaceSubmit: string;
  createSpaceTitle: string;
  deleteSpace: string;
  deleteSpaceConfirmation: string;
  deleteSpaceDescription: string;
  deleteSpaceError: string;
  nameSpace: string;
  renameSpace: string;
  saveSpace: string;
  spaceSettings: string;
  spaceSettingsDescription: string;
};

type AppSidebarProps = {
  spaces: AppSidebarSpace[];
  value: string;
  onValueChange: (value: string) => void;
  onReorder: (spaces: AppSidebarSpace[]) => void;
  onCreateSpace?: (name: string) => void;
  onDeleteSpace?: (id: string, confirmation: string) => boolean;
  onRenameSpace?: (id: string, name: string) => void;
  labels?: Partial<AppSidebarLabels>;
  children?: React.ReactNode;
  className?: string;
};

type DropPosition = "before" | "after";

type DragSession = {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  activated: boolean;
  moved: boolean;
  offsetY: number;
  previousCursor: string;
  previousUserSelect: string;
  previousTouchAction: string;
  lastTargetKey: string | null;
};

function isPointerForSession(
  session: DragSession | null,
  event: PointerEvent,
): session is DragSession {
  return session !== null && event.pointerId === session.pointerId;
}

type DragPreview = {
  space: AppSidebarSpace;
  left: number;
  top: number;
  width: number;
  height: number;
};

const defaultLabels: AppSidebarLabels = {
  changeSpace: "Change space",
  search: "Search",
  clearSearch: "Clear search",
  empty: "No spaces found.",
  createSpace: "Create space",
  createSpaceSubmit: "Create",
  createSpaceTitle: "Create space",
  deleteSpace: "Delete space",
  deleteSpaceConfirmation: "Type {name} to confirm",
  deleteSpaceDescription:
    "This removes the local Space from this device. Other Spaces are kept.",
  deleteSpaceError: "Type the exact Space name.",
  nameSpace: "Space name",
  renameSpace: "Rename space",
  saveSpace: "Save changes",
  spaceSettings: "Space settings",
  spaceSettingsDescription:
    "Rename this Space without affecting content in another Space.",
};

function areOrdersEqual(a: AppSidebarSpace[], b: AppSidebarSpace[]) {
  return (
    a.length === b.length &&
    a.every((space, index) => space.id === b[index]?.id)
  );
}

function moveSpace(
  spaces: AppSidebarSpace[],
  sourceId: string,
  targetId: string,
  position: DropPosition,
) {
  if (sourceId === targetId) return spaces;

  const sourceIndex = spaces.findIndex((space) => space.id === sourceId);
  if (sourceIndex === -1) return spaces;

  const next = [...spaces];
  const [movingSpace] = next.splice(sourceIndex, 1);
  if (!movingSpace) return spaces;

  const targetIndex = next.findIndex((space) => space.id === targetId);
  if (targetIndex === -1) return spaces;

  next.splice(targetIndex + (position === "after" ? 1 : 0), 0, movingSpace);
  return next;
}

function resolveSelectedSpace(
  displayedSpaces: AppSidebarSpace[],
  spaces: AppSidebarSpace[],
  value: string,
) {
  return (
    displayedSpaces.find((space) => space.id === value) ??
    spaces.find((space) => space.id === value) ??
    displayedSpaces[0]
  );
}

function hasActiveSpaceSort(
  draggingId: string | null,
  session: DragSession | null,
) {
  return draggingId !== null || session?.activated === true;
}

function AppSidebarSpaceSwitcher({
  spaces,
  value,
  onValueChange,
  onReorder,
  onCreateSpace,
  onDeleteSpace,
  onRenameSpace,
  labels,
  className,
}: Omit<AppSidebarProps, "children">) {
  const text = { ...defaultLabels, ...labels };
  const isMobile = useIsMobile();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const itemRefs = React.useRef(new Map<string, HTMLElement>());
  const spacesRef = React.useRef(spaces);
  const onReorderRef = React.useRef(onReorder);
  const draftSpacesRef = React.useRef<AppSidebarSpace[] | null>(null);
  const dragSessionRef = React.useRef<DragSession | null>(null);
  const suppressComboboxCloseUntilRef = React.useRef(0);
  const suppressSelectionUntilRef = React.useRef(0);
  const hintTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = React.useState(false);
  const [hintOpen, setHintOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [draftSpaces, setDraftSpaces] = React.useState<
    AppSidebarSpace[] | null
  >(null);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [dragPreview, setDragPreview] = React.useState<DragPreview | null>(
    null,
  );
  const [createOpen, setCreateOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [createName, setCreateName] = React.useState("");
  const [renameName, setRenameName] = React.useState("");
  const [deleteConfirmation, setDeleteConfirmation] = React.useState("");
  const [deleteError, setDeleteError] = React.useState(false);

  spacesRef.current = spaces;
  onReorderRef.current = onReorder;

  const displayedSpaces = draftSpaces ?? spaces;
  const selectedSpace = resolveSelectedSpace(displayedSpaces, spaces, value);

  const filteredSpaces = React.useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    if (!search) return displayedSpaces;

    return displayedSpaces.filter((space) =>
      space.name.toLocaleLowerCase().includes(search),
    );
  }, [displayedSpaces, query]);

  const isSorting = hasActiveSpaceSort(draggingId, dragSessionRef.current);

  function clearHintTimer() {
    if (!hintTimerRef.current) return;
    clearTimeout(hintTimerRef.current);
    hintTimerRef.current = null;
  }

  function hideHint() {
    clearHintTimer();
    setHintOpen(false);
  }

  function scheduleHint() {
    if (open || isMobile) return;

    clearHintTimer();
    hintTimerRef.current = setTimeout(() => {
      setHintOpen(true);
      hintTimerRef.current = null;
    }, 400);
  }

  // The timer lives in a ref and this effect intentionally installs one unmount cleanup.
  // biome-ignore lint/correctness/useExhaustiveDependencies: ref-backed cleanup is mount-scoped
  React.useEffect(() => () => clearHintTimer(), []);

  function measureItems() {
    const positions = new Map<string, number>();

    itemRefs.current.forEach((element, id) => {
      positions.set(id, element.getBoundingClientRect().top);
    });

    return positions;
  }

  function animateReorder(previousPositions: Map<string, number>) {
    requestAnimationFrame(() => {
      itemRefs.current.forEach((element, id) => {
        const previousTop = previousPositions.get(id);
        if (previousTop === undefined) return;

        const currentTop = element.getBoundingClientRect().top;
        const delta = previousTop - currentTop;
        if (Math.abs(delta) < 0.5) return;

        element.getAnimations().forEach((animation) => {
          animation.cancel();
        });
        element.animate(
          [
            { transform: `translateY(${delta}px)` },
            { transform: "translateY(0)" },
          ],
          { duration: 200, easing: "ease-out" },
        );
      });
    });
  }

  function restoreBody(session: DragSession) {
    document.body.style.cursor = session.previousCursor;
    document.body.style.userSelect = session.previousUserSelect;
    document.body.style.touchAction = session.previousTouchAction;
  }

  function clearVisualDragState() {
    const session = dragSessionRef.current;
    if (session?.activated) restoreBody(session);

    dragSessionRef.current = null;
    draftSpacesRef.current = null;
    setDraggingId(null);
    setDragPreview(null);
    setDraftSpaces(null);
  }

  function activateDrag(session: DragSession, clientY: number) {
    const row = itemRefs.current.get(session.id);
    if (!row) return false;

    const rect = row.getBoundingClientRect();
    session.activated = true;
    session.offsetY = clientY - rect.top;
    session.previousCursor = document.body.style.cursor;
    session.previousUserSelect = document.body.style.userSelect;
    session.previousTouchAction = document.body.style.touchAction;

    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    document.body.style.touchAction = "none";

    const initialOrder = [...spacesRef.current];
    draftSpacesRef.current = initialOrder;
    setDraftSpaces(initialOrder);
    setDraggingId(session.id);

    const space = initialOrder.find((item) => item.id === session.id);
    if (space) {
      setDragPreview({
        space,
        left: rect.left,
        top: clientY - session.offsetY,
        width: rect.width,
        height: rect.height,
      });
    }

    return true;
  }

  // Pointer listeners are installed once; every mutable value they consume is ref-backed.
  // biome-ignore lint/correctness/useExhaustiveDependencies: global drag session is mount-scoped
  React.useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const session = dragSessionRef.current;
      if (!isPointerForSession(session, event)) return;

      const distance = Math.hypot(
        event.clientX - session.startX,
        event.clientY - session.startY,
      );

      if (!session.activated) {
        if (distance < 4) return;
        if (!activateDrag(session, event.clientY)) {
          clearVisualDragState();
          return;
        }
      }

      event.preventDefault();

      setDragPreview((preview) =>
        preview
          ? { ...preview, top: event.clientY - session.offsetY }
          : preview,
      );

      const element = document.elementFromPoint(event.clientX, event.clientY);
      const row = element?.closest<HTMLElement>("[data-space-sort-id]");
      const targetId = row?.dataset.spaceSortId;

      if (!row || !targetId || targetId === session.id) {
        session.lastTargetKey = null;
        return;
      }

      const rect = row.getBoundingClientRect();
      const position: DropPosition =
        event.clientY < rect.top + rect.height / 2 ? "before" : "after";
      const targetKey = `${targetId}:${position}`;

      if (session.lastTargetKey === targetKey) return;
      session.lastTargetKey = targetKey;

      const currentOrder = draftSpacesRef.current ?? spacesRef.current;
      const nextOrder = moveSpace(currentOrder, session.id, targetId, position);
      if (areOrdersEqual(currentOrder, nextOrder)) return;

      const previousPositions = measureItems();
      session.moved = true;
      draftSpacesRef.current = nextOrder;
      setDraftSpaces(nextOrder);
      animateReorder(previousPositions);
    }

    function finishPointerSort(event: PointerEvent, commit: boolean) {
      const session = dragSessionRef.current;
      if (!session || event.pointerId !== session.pointerId) return;

      if (!session.activated) {
        dragSessionRef.current = null;
        return;
      }

      event.preventDefault();
      suppressSelectionUntilRef.current = performance.now() + 500;
      suppressComboboxCloseUntilRef.current = performance.now() + 500;

      const finalOrder = draftSpacesRef.current ?? spacesRef.current;
      if (
        commit &&
        session.moved &&
        !areOrdersEqual(finalOrder, spacesRef.current)
      ) {
        onReorderRef.current(finalOrder);
      }

      clearVisualDragState();

      if (commit) {
        requestAnimationFrame(() => {
          setOpen(true);
          searchInputRef.current?.focus({ preventScroll: true });
        });
      }
    }

    const handlePointerUp = (event: PointerEvent) =>
      finishPointerSort(event, true);
    const handlePointerCancel = (event: PointerEvent) =>
      finishPointerSort(event, false);

    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ref-backed cleanup is mount-scoped
  React.useEffect(
    () => () => {
      const session = dragSessionRef.current;
      if (session?.activated) restoreBody(session);
    },
    [],
  );

  if (!selectedSpace) return null;

  const SelectedIcon = selectedSpace.icon;

  function clearSearch() {
    setQuery("");
    requestAnimationFrame(() => {
      searchInputRef.current?.focus({ preventScroll: true });
    });
  }

  function openCreateDialog() {
    setOpen(false);
    setCreateName("");
    setCreateOpen(true);
  }

  function openSettingsDialog() {
    if (!selectedSpace) return;
    setOpen(false);
    setRenameName(selectedSpace.name);
    setSettingsOpen(true);
  }

  function openDeleteDialog() {
    setOpen(false);
    setDeleteConfirmation("");
    setDeleteError(false);
    setDeleteOpen(true);
  }

  function submitCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = createName.trim();
    if (!name) return;
    onCreateSpace?.(name);
    setCreateOpen(false);
  }

  function submitRename(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = renameName.trim();
    if (!name || !selectedSpace) return;
    onRenameSpace?.(selectedSpace.id, name);
    setSettingsOpen(false);
  }

  function submitDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSpace) return;
    const deleted =
      onDeleteSpace?.(selectedSpace.id, deleteConfirmation) ?? false;
    if (!deleted) {
      setDeleteError(true);
      return;
    }
    setDeleteOpen(false);
  }

  function startPointerSort(event: React.PointerEvent, spaceId: string) {
    if (query.length > 0 || event.button !== 0 || dragSessionRef.current)
      return;

    event.preventDefault();
    event.stopPropagation();
    hideHint();

    dragSessionRef.current = {
      id: spaceId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      activated: false,
      moved: false,
      offsetY: 0,
      previousCursor: "",
      previousUserSelect: "",
      previousTouchAction: "",
      lastTargetKey: null,
    };
  }

  function renderSearch(mobile = false) {
    return (
      <ComboboxInput
        ref={searchInputRef}
        autoFocus={mobile}
        showTrigger={false}
        showClear={false}
        placeholder={text.search}
        aria-label={text.search}
        className={cn(compactMenuSearchClass, mobile && "h-9")}
      >
        {query.length > 0 && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={text.clearSearch}
              onPointerDown={(event) => event.preventDefault()}
              onClick={clearSearch}
            >
              <AppSidebarXIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </ComboboxInput>
    );
  }

  function renderSpaceItem(space: AppSidebarSpace) {
    const Icon = space.icon;
    const isDragging = draggingId === space.id;
    const isSelected = space.id === selectedSpace.id;

    return (
      <ComboboxItem
        ref={(node) => {
          if (node) itemRefs.current.set(space.id, node as HTMLElement);
          else itemRefs.current.delete(space.id);
        }}
        key={space.id}
        value={space}
        data-space-sort-id={space.id}
        data-dragging={isDragging ? "true" : undefined}
        aria-grabbed={isDragging}
        className={cn(
          compactMenuItemClass,
          "group/space [&>span:last-child]:hidden",
          "data-[dragging=true]:pointer-events-none data-[dragging=true]:opacity-30",
        )}
      >
        <span className="relative flex h-6 shrink-0 flex-row items-center justify-center">
          {query.length === 0 && (
            <span
              aria-hidden="true"
              className={cn(
                "grab-handle invisible absolute bottom-0 left-0 top-0 z-10 flex items-center justify-start bg-[#f3f1ee] pr-px text-[#8f8983]",
                "cursor-grab transition-none hover:text-[#595550] group-hover/space:visible",
                !isSorting && "group-hover/space:opacity-100",
                isDragging && "visible cursor-grabbing opacity-100",
              )}
              onPointerDown={(event) => startPointerSort(event, space.id)}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <CompactMenuIconFrame variant="ghost">
                <AppSidebarGripVerticalIcon />
              </CompactMenuIconFrame>
            </span>
          )}

          <CompactMenuIconFrame>
            <Icon />
          </CompactMenuIconFrame>
        </span>

        <CompactMenuItemText>{space.name}</CompactMenuItemText>

        <span className="ml-1 flex flex-row items-center gap-1">
          {isSelected && (
            <span className="flex items-center justify-center text-[#282522]">
              <AppSidebarCheckIcon className="size-[1em]" />
            </span>
          )}
        </span>
      </ComboboxItem>
    );
  }

  function renderFooter(mobile = false) {
    if (filteredSpaces.length === 0) return null;

    return (
      <>
        <ComboboxSeparator />
        <div
          className={cn(
            "min-w-0",
            mobile
              ? "px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
              : "px-1.5 pb-1.5",
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="default"
            className={cn(
              compactMenuActionButtonClass,
              "justify-start px-1 text-[#282522]",
            )}
            onClick={openCreateDialog}
          >
            <span className="flex h-6 shrink-0 flex-row items-center justify-center">
              <CompactMenuIconFrame variant="ghost">
                <AppSidebarPlusIcon />
              </CompactMenuIconFrame>
            </span>
            {text.createSpace}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="default"
            className={cn(
              compactMenuActionButtonClass,
              "justify-start px-1 text-[#282522]",
            )}
            onClick={openSettingsDialog}
          >
            {text.spaceSettings}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="default"
            className={cn(
              compactMenuActionButtonClass,
              "justify-start px-1 text-destructive",
            )}
            onClick={openDeleteDialog}
          >
            {text.deleteSpace}
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Combobox
        items={displayedSpaces}
        filteredItems={filteredSpaces}
        value={selectedSpace}
        open={open}
        inline={isMobile}
        inputValue={query}
        autoHighlight={false}
        itemToStringLabel={(space: AppSidebarSpace) => space.name}
        itemToStringValue={(space: AppSidebarSpace) => space.name}
        onInputValueChange={setQuery}
        onOpenChange={(nextOpen, eventDetails) => {
          const session = dragSessionRef.current;
          const shouldKeepOpen =
            !nextOpen &&
            (session?.activated ||
              draggingId !== null ||
              performance.now() < suppressComboboxCloseUntilRef.current);

          if (shouldKeepOpen) {
            eventDetails.cancel();
            setOpen(true);
            return;
          }

          if (!nextOpen) {
            setOpen(false);
            return;
          }

          setQuery("");
          hideHint();
          setOpen(true);
        }}
        onValueChange={(space) => {
          if (
            !space ||
            dragSessionRef.current ||
            draggingId !== null ||
            performance.now() < suppressSelectionUntilRef.current
          ) {
            return;
          }

          hideHint();
          onValueChange(space.id);
          if (isMobile) setOpen(false);
        }}
      >
        <div
          data-slot="app-sidebar-space-switcher"
          className={cn("relative inline-flex min-w-0 max-w-full", className)}
          onPointerEnter={scheduleHint}
          onPointerLeave={hideHint}
        >
          <HoverCard open={hintOpen && !open && !isMobile}>
            <HoverCardTrigger
              render={<span className="inline-flex min-w-0 max-w-full" />}
            >
              <ComboboxTrigger
                aria-label={text.changeSpace}
                className={cn(
                  "[&>svg:last-child]:hidden",
                  "data-[popup-open]:focus-visible:border-transparent data-[popup-open]:focus-visible:ring-0",
                )}
                onPointerDown={hideHint}
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="default"
                    className="w-auto max-w-full min-w-0 justify-start gap-0 px-2"
                  />
                }
              >
                <span className="inline-flex w-auto min-w-0 items-center overflow-hidden text-sm font-medium text-foreground">
                  <SelectedIcon
                    data-icon="inline-start"
                    className="!mr-2 size-[14px] shrink-0"
                  />
                  <span className="truncate">{selectedSpace.name}</span>
                </span>
                <AppSidebarChevronsUpDownIcon
                  data-icon="inline-end"
                  className="ml-1 size-[14px] shrink-0 text-muted-foreground"
                />
              </ComboboxTrigger>
            </HoverCardTrigger>

            <HoverCardContent
              side="right"
              align="center"
              sideOffset={12}
              className="w-auto whitespace-nowrap"
            >
              {text.changeSpace}
            </HoverCardContent>
          </HoverCard>
        </div>

        {!isMobile && (
          <ComboboxContent
            side="right"
            align="start"
            sideOffset={8}
            alignOffset={40}
            initialFocus={searchInputRef}
            finalFocus={false}
            aria-label={text.changeSpace}
            className={cn(
              "mt-1",
              compactMenuSurfaceClass,
              "data-closed:animate-none data-closed:duration-0 data-closed:opacity-0 data-closed:zoom-out-100",
              "*:data-[slot=input-group]:!m-0 *:data-[slot=input-group]:!mx-1.5 *:data-[slot=input-group]:!mt-1.5 *:data-[slot=input-group]:!mb-1.5 *:data-[slot=input-group]:shrink-0",
              "*:data-[slot=input-group]:[&>[data-slot=input-group-addon]:empty]:hidden",
            )}
          >
            {renderSearch()}

            <div
              className="no-scrollbar relative min-h-0 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain"
              style={{
                maxHeight: `min(${SPACE_MENU_MAX_HEIGHT}, calc(var(--available-height) - 2.75rem))`,
              }}
            >
              <ComboboxEmpty>
                <span className="inline-flex w-full min-w-0 items-center justify-center gap-1.5">
                  <AppSidebarAlertIcon />
                  <span className="truncate">{text.empty}</span>
                </span>
              </ComboboxEmpty>

              <ComboboxList className="max-h-none min-w-0 overflow-visible overflow-x-hidden px-1.5 pb-1.5 pt-0">
                {(space: AppSidebarSpace) => renderSpaceItem(space)}
              </ComboboxList>

              {renderFooter()}
            </div>
          </ComboboxContent>
        )}

        {isMobile && (
          <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
              if (dragSessionRef.current?.activated) return;

              if (!nextOpen) {
                setOpen(false);
                return;
              }

              setQuery("");
              setOpen(true);
            }}
          >
            <SheetContent
              side="bottom"
              showCloseButton={false}
              className="max-h-[calc(100dvh-1rem)] gap-0 overflow-hidden rounded-t-2xl p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>{text.changeSpace}</SheetTitle>
                <SheetDescription>{text.changeSpace}</SheetDescription>
              </SheetHeader>

              <div className="relative h-7 shrink-0">
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-2 h-[5px] w-8 -translate-x-1/2 rounded-full bg-muted-foreground/40"
                />
              </div>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <div className="shrink-0 px-3 pb-1.5">{renderSearch(true)}</div>

                <div
                  className="no-scrollbar min-h-0 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain"
                  style={{
                    maxHeight: `min(${SPACE_MENU_MAX_HEIGHT}, calc(100dvh - 7rem))`,
                  }}
                >
                  <ComboboxEmpty>
                    <span className="flex min-h-24 min-w-0 items-center justify-center gap-1.5 p-4 text-sm text-muted-foreground">
                      <AppSidebarAlertIcon />
                      <span className="truncate">{text.empty}</span>
                    </span>
                  </ComboboxEmpty>

                  <ComboboxList className="max-h-none min-w-0 overflow-visible overflow-x-hidden p-3 pt-0">
                    {(space: AppSidebarSpace) => renderSpaceItem(space)}
                  </ComboboxList>

                  {renderFooter(true)}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </Combobox>

      {dragPreview &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-slot="app-sidebar-space-drag-preview"
            className="pointer-events-none fixed overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10"
            style={{
              zIndex: 100,
              left: dragPreview.left,
              top: dragPreview.top,
              width: dragPreview.width,
              height: dragPreview.height,
            }}
          >
            <div className="flex h-full min-w-0 items-center gap-2 px-1.5 text-sm">
              <AppSidebarGripVerticalIcon className="shrink-0 text-muted-foreground" />
              <span className="min-w-0 truncate">{dragPreview.space.name}</span>
            </div>
          </div>,
          document.body,
        )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent data-slot="app-sidebar-space-create-dialog">
          <form onSubmit={submitCreate} className="contents">
            <DialogHeader>
              <DialogTitle>{text.createSpaceTitle}</DialogTitle>
              <DialogDescription>
                {text.spaceSettingsDescription}
              </DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              aria-label={text.nameSpace}
              value={createName}
              onChange={(event) => setCreateName(event.target.value)}
            />
            <DialogFooter>
              <Button type="submit" disabled={!createName.trim()}>
                {text.createSpaceSubmit}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent data-slot="app-sidebar-space-settings-dialog">
          <form onSubmit={submitRename} className="contents">
            <DialogHeader>
              <DialogTitle>{text.spaceSettings}</DialogTitle>
              <DialogDescription>
                {text.spaceSettingsDescription}
              </DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              aria-label={text.nameSpace}
              value={renameName}
              onChange={(event) => setRenameName(event.target.value)}
            />
            <DialogFooter>
              <Button type="submit" disabled={!renameName.trim()}>
                {text.saveSpace}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-slot="app-sidebar-space-delete-dialog">
          <form onSubmit={submitDelete} className="contents">
            <DialogHeader>
              <DialogTitle>{text.deleteSpace}</DialogTitle>
              <DialogDescription>
                {text.deleteSpaceDescription}
              </DialogDescription>
            </DialogHeader>
            <Input
              autoFocus
              aria-label={text.deleteSpaceConfirmation.replace(
                "{name}",
                selectedSpace.name,
              )}
              value={deleteConfirmation}
              aria-invalid={deleteError || undefined}
              onChange={(event) => {
                setDeleteConfirmation(event.target.value);
                setDeleteError(false);
              }}
            />
            {deleteError && (
              <p className="text-sm text-destructive">
                {text.deleteSpaceError}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" variant="destructive">
                {text.deleteSpace}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AppSidebar({
  spaces,
  value,
  onValueChange,
  onReorder,
  onCreateSpace,
  onDeleteSpace,
  onRenameSpace,
  labels,
  children,
  className,
}: AppSidebarProps) {
  return (
    <div
      data-slot="app-sidebar"
      className={cn("flex h-full min-w-0 flex-col", className)}
    >
      <AppShellHeader className="px-2 py-[13px] pr-9">
        <AppSidebarSpaceSwitcher
          spaces={spaces}
          value={value}
          onValueChange={onValueChange}
          onReorder={onReorder}
          onCreateSpace={onCreateSpace}
          onDeleteSpace={onDeleteSpace}
          onRenameSpace={onRenameSpace}
          labels={labels}
        />
      </AppShellHeader>

      <AppShellContent>{children}</AppShellContent>
    </div>
  );
}

export {
  AppSidebar,
  AppSidebarSpaceSwitcher,
  type AppSidebarLabels,
  type AppSidebarProps,
  type AppSidebarSpace,
};
