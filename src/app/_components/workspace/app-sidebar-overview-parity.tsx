"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { ObjectAreaIcon } from "@/app/_components/objects/object-icons";
import {
  AppSidebarFooter,
  AppSidebarHelpSection,
  AppSidebarUtilityRow,
} from "@/app/_components/workspace/app-sidebar-floating-nav";
import {
  AppSidebarObjectsIcon,
  AppSidebarPinIcon,
} from "@/app/_components/workspace/app-sidebar-icons";
import { AppSidebarObjectTypeStudio } from "@/app/_components/workspace/app-sidebar-object-type-studio";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { WorkspaceCollectionRecord } from "@/lib/space-domain-identities";
import type { CreateStructureInput, ObjectIconName } from "@/lib/space-object-types";
import { cn } from "@/lib/utils";

import {
  AppSidebarAddSection,
  type AppSidebarCollectionAction,
  type AppSidebarCustomSection,
  type AppSidebarObjectType,
  AppSidebarObjectTypeRow,
  type AppSidebarPinnedEntity,
  AppSidebarPinnedPicker,
  AppSidebarPinnedRow,
  AppSidebarSection,
  AppSidebarSectionAction,
  AppSidebarSectionMenu,
  type AppSidebarSortMode,
  type AppSidebarTone,
  type AppSidebarTrashItem,
  AppSidebarTrashRow,
  AppSidebarTypeLabel,
  type AppSidebarOverview as BaseAppSidebarOverview,
  setSidebarDragPreview,
} from "./app-sidebar-overview";

type AppSidebarOverviewProps = NonNullable<React.ComponentProps<typeof BaseAppSidebarOverview>>;
type AppSidebarSelectionEvent = Parameters<
  NonNullable<AppSidebarOverviewProps["onActiveIdChange"]>
>[1];
type AppSidebarDragState =
  | { kind: "pinned"; id: string }
  | { kind: "object-type"; id: string }
  | null;

const DRAG_SCROLL_EDGE_PX = 56;
const DRAG_SCROLL_MIN_SPEED = 1;
const DRAG_SCROLL_MAX_SPEED = 20;

function reorderById<T extends { id: string }>(items: T[], fromId: string, toId: string) {
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

function useSidebarDragAutoScroll(
  active: boolean,
  rootRef: React.RefObject<HTMLDivElement | null>,
) {
  React.useEffect(() => {
    if (!active) return;

    let frame: number | null = null;
    let direction: -1 | 0 | 1 = 0;
    let speed = DRAG_SCROLL_MIN_SPEED;

    const getViewport = () =>
      rootRef.current?.querySelector<HTMLElement>(
        '[data-slot="app-sidebar-scroll-area"] [data-slot="scroll-area-viewport"]',
      ) ?? null;

    const stop = () => {
      direction = 0;
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
    };

    const tick = () => {
      const viewport = getViewport();
      if (!viewport || direction === 0) {
        frame = null;
        return;
      }

      const before = viewport.scrollTop;
      viewport.scrollTop += direction * speed;

      if (viewport.scrollTop === before) {
        stop();
        return;
      }

      frame = window.requestAnimationFrame(tick);
    };

    const start = (nextDirection: -1 | 1, nextSpeed: number) => {
      direction = nextDirection;
      speed = Math.min(DRAG_SCROLL_MAX_SPEED, Math.max(DRAG_SCROLL_MIN_SPEED, nextSpeed));
      if (frame === null) frame = window.requestAnimationFrame(tick);
    };

    const handleDragOver = (event: DragEvent) => {
      const viewport = getViewport();
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const y = event.clientY;
      if (y < rect.top || y > rect.bottom) {
        stop();
        return;
      }

      const topDistance = y - rect.top;
      const bottomDistance = rect.bottom - y;

      if (topDistance <= DRAG_SCROLL_EDGE_PX) {
        event.preventDefault();
        const intensity = 1 - topDistance / DRAG_SCROLL_EDGE_PX;
        start(-1, DRAG_SCROLL_MIN_SPEED + intensity * (DRAG_SCROLL_MAX_SPEED - 1));
        return;
      }

      if (bottomDistance <= DRAG_SCROLL_EDGE_PX) {
        event.preventDefault();
        const intensity = 1 - bottomDistance / DRAG_SCROLL_EDGE_PX;
        start(1, DRAG_SCROLL_MIN_SPEED + intensity * (DRAG_SCROLL_MAX_SPEED - 1));
        return;
      }

      stop();
    };

    document.addEventListener("dragover", handleDragOver, true);
    document.addEventListener("dragend", stop, true);
    document.addEventListener("drop", stop, true);

    return () => {
      document.removeEventListener("dragover", handleDragOver, true);
      document.removeEventListener("dragend", stop, true);
      document.removeEventListener("drop", stop, true);
      stop();
    };
  }, [active, rootRef]);
}

function AppSidebarOverview({
  activeId: controlledActiveId,
  onActiveIdChange,
  pinnedEntities: controlledPinned,
  availablePinnedEntities = [],
  objectTypes = [],
  objectTypeOrder: controlledObjectTypeOrder,
  objectTypeCollections = {},
  customSections: controlledCustomSections,
  onCreateObjectTypeFromPreset,
  onCreateObjectType,
  onObjectTypeAction,
  onUpdateObjectType,
  onDeleteObjectType,
  onPinnedEntitiesChange,
  onObjectTypeOrderChange,
  onOpenPinnedInSidePanel,
  onCustomSectionsChange,
  onCollectionAction,
  onMovePinnedEntityToCollection,
  onEmptyTrash,
  onPurgeTrashItem,
  onRestoreTrashItem,
  onOpenShortcuts,
  trashItems = [],
}: AppSidebarOverviewProps = {}) {
  const t = useTranslations("workspace");
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [internalActiveId, setInternalActiveId] = React.useState<string | null>(null);
  const isControlled = controlledActiveId !== undefined;
  const activeId = isControlled ? controlledActiveId : internalActiveId;

  function setActiveId(id: string | null, event?: AppSidebarSelectionEvent) {
    if (!isControlled) setInternalActiveId(id);
    onActiveIdChange?.(id, event);
  }

  const [pinnedOpen, setPinnedOpen] = React.useState(true);
  const [objectTypesOpen, setObjectTypesOpen] = React.useState(true);
  const [objectTypeCollectionsOpen, setObjectTypeCollectionsOpen] = React.useState<
    Record<string, boolean>
  >({});
  const [pinnedSort, setPinnedSort] = React.useState<AppSidebarSortMode>("manual");
  const [objectSort, setObjectSort] = React.useState<AppSidebarSortMode>("manual");
  const [objectTypeOrder, setObjectTypeOrder] = React.useState<string[]>(() =>
    controlledObjectTypeOrder?.length
      ? [...controlledObjectTypeOrder]
      : objectTypes.map((objectType) => objectType.id),
  );
  const [internalPinned, setInternalPinned] = React.useState<AppSidebarPinnedEntity[]>([]);
  const [internalCustomSections, setInternalCustomSections] = React.useState<
    AppSidebarCustomSection[]
  >([]);
  const [drag, setDrag] = React.useState<AppSidebarDragState>(null);
  const dragRef = React.useRef<AppSidebarDragState>(null);
  const [trashDropTarget, setTrashDropTarget] = React.useState(false);

  useSidebarDragAutoScroll(drag !== null, rootRef);

  const pinned = controlledPinned ?? internalPinned;
  const customSections = controlledCustomSections ?? internalCustomSections;
  const draggedObjectType =
    drag?.kind === "object-type" ? objectTypes.find((item) => item.id === drag.id) : undefined;

  React.useEffect(() => {
    if (controlledObjectTypeOrder?.length) {
      setObjectTypeOrder([...controlledObjectTypeOrder]);
      return;
    }

    setObjectTypeOrder((current) => {
      const nextIds = objectTypes.map((objectType) => objectType.id);
      const nextIdSet = new Set(nextIds);
      const keptIds = current.filter((id) => nextIdSet.has(id));
      const addedIds = nextIds.filter((id) => !keptIds.includes(id));
      return [...keptIds, ...addedIds];
    });
  }, [controlledObjectTypeOrder, objectTypes]);

  const setPinned = React.useCallback<
    React.Dispatch<React.SetStateAction<AppSidebarPinnedEntity[]>>
  >(
    (next) => {
      if (controlledPinned !== undefined) {
        const resolved = typeof next === "function" ? next(controlledPinned) : next;
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
        const resolved = typeof next === "function" ? next(controlledCustomSections) : next;
        onCustomSectionsChange?.(resolved);
        return;
      }

      setInternalCustomSections(next);
    },
    [controlledCustomSections, onCustomSectionsChange],
  );

  const pinnedIds = React.useMemo(() => new Set(pinned.map((entity) => entity.id)), [pinned]);

  const visiblePinned = React.useMemo(
    () =>
      pinnedSort === "alphabetical"
        ? [...pinned].sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))
        : pinned,
    [pinned, pinnedSort],
  );

  const visibleObjectTypes = React.useMemo(() => {
    if (objectSort === "alphabetical") {
      return [...objectTypes].sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    }

    const orderIndex = new Map(objectTypeOrder.map((id, index) => [id, index]));
    return [...objectTypes].sort(
      (a, b) =>
        (orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
        (orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER),
    );
  }, [objectSort, objectTypeOrder, objectTypes]);

  const startDrag = React.useCallback((nextDrag: AppSidebarDragState) => {
    dragRef.current = nextDrag;
    setDrag(nextDrag);
  }, []);

  const clearDrag = React.useCallback(() => {
    dragRef.current = null;
    setDrag(null);
  }, []);

  const measureItems = React.useCallback((selector: string, dataAttribute: string) => {
    const positions = new Map<string, number>();
    if (!rootRef.current) return positions;
    const elements = rootRef.current.querySelectorAll<HTMLElement>(selector);
    elements.forEach((element) => {
      const id = element.getAttribute(dataAttribute);
      if (id) positions.set(id, element.getBoundingClientRect().top);
    });
    return positions;
  }, []);

  const animateReorder = React.useCallback(
    (previousPositions: Map<string, number>, selector: string, dataAttribute: string) => {
      if (!rootRef.current) return;
      window.requestAnimationFrame(() => {
        const elements = rootRef.current?.querySelectorAll<HTMLElement>(selector);
        elements?.forEach((element) => {
          const id = element.getAttribute(dataAttribute);
          if (!id) return;
          const previousTop = previousPositions.get(id);
          if (previousTop === undefined) return;

          const currentTop = element.getBoundingClientRect().top;
          const delta = previousTop - currentTop;
          if (Math.abs(delta) < 0.5) return;

          element.getAnimations().forEach((animation) => animation.cancel());
          element.animate(
            [{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }],
            { duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)" },
          );
        });
      });
    },
    [],
  );

  const moveObjectType = React.useCallback(
    (fromId: string, toId: string) => {
      if (fromId === toId) return;

      const previousPositions = measureItems(
        '[data-slot="app-sidebar-object-type-row-wrapper"]',
        "data-object-type-id",
      );

      const sourceOrder =
        objectSort === "alphabetical" ? visibleObjectTypes.map((item) => item.id) : objectTypeOrder;
      const nextOrder = reorderById(
        sourceOrder.map((id) => ({ id })),
        fromId,
        toId,
      ).map((item) => item.id);

      setObjectTypeOrder(nextOrder);
      setObjectSort("manual");
      onObjectTypeOrderChange?.(nextOrder);

      animateReorder(
        previousPositions,
        '[data-slot="app-sidebar-object-type-row-wrapper"]',
        "data-object-type-id",
      );
    },
    [animateReorder, measureItems, objectSort, objectTypeOrder, onObjectTypeOrderChange, visibleObjectTypes],
  );

  const reorderPinned = React.useCallback(
    (fromId: string, toId: string) => {
      if (fromId === toId) return;

      const previousPositions = measureItems(
        '[data-slot="app-sidebar-pinned-row-wrapper"]',
        "data-pinned-id",
      );

      setPinned((current) => reorderById(current, fromId, toId));

      animateReorder(
        previousPositions,
        '[data-slot="app-sidebar-pinned-row-wrapper"]',
        "data-pinned-id",
      );
    },
    [animateReorder, measureItems, setPinned],
  );

  const pinObjectType = React.useCallback(
    (objectTypeId: string, beforeId?: string) => {
      const objectType = objectTypes.find((item) => item.id === objectTypeId);
      if (!objectType || pinned.some((item) => item.id === objectType.id)) return;

      setPinned((current) => {
        const pinnedEntity = {
          id: objectType.id,
          label: objectType.label,
          icon: objectType.icon,
          tone: objectType.tone,
        };
        if (!beforeId) return [...current, pinnedEntity];
        const targetIndex = current.findIndex((item) => item.id === beforeId);
        if (targetIndex < 0) return [...current, pinnedEntity];
        const next = [...current];
        next.splice(targetIndex, 0, pinnedEntity);
        return next;
      });
    },
    [objectTypes, pinned, setPinned],
  );

  function handlePinnedDragOver(event: React.DragEvent<HTMLDivElement>) {
    const currentDrag = dragRef.current ?? drag;
    if (currentDrag?.kind !== "object-type") return;
    event.preventDefault();
  }

  function handlePinnedDrop(event: React.DragEvent<HTMLDivElement>) {
    const currentDrag = dragRef.current ?? drag;
    if (currentDrag?.kind !== "object-type") return;
    event.preventDefault();
    pinObjectType(currentDrag.id);
    clearDrag();
  }

  return (
    <div
      ref={rootRef}
      data-slot="app-sidebar-overview"
      className="flex min-h-0 flex-1 flex-col"
      onDragEndCapture={() => setDrag(null)}
    >
      <ScrollArea
        data-slot="app-sidebar-scroll-area"
        className={cn(
          "group/section-container relative mt-0.5 h-32 min-h-0 grow",
          "[&_[data-slot=scroll-area-viewport]>div]:!flex",
          "[&_[data-slot=scroll-area-viewport]>div]:!min-h-full",
          "[&_[data-slot=scroll-area-viewport]>div]:!w-full",
          "[&_[data-slot=scroll-area-viewport]]:!overflow-x-hidden",
          "[&_[data-slot=scroll-area-viewport]]:scroll-auto",
          "[&_[data-slot=scroll-area-viewport]]:scroll-p-8",
          "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:!w-[6px]",
          "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:!p-0",
          "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:transition-[width]",
          "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:duration-300",
          "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:ease-in-out",
          "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]:hover]:!w-[10px]",
          "[&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]:active]:!w-[10px]",
        )}
      >
        <div className="flex min-h-full w-full flex-col">
          {/* biome-ignore lint/a11y/noStaticElementInteractions: drop target belongs on the pinned region wrapper */}
          <div
            role="presentation"
            data-slot="app-sidebar-pinned-region"
            data-dnd-type="droppable"
            data-dnd-id="sidebar-pinned"
            data-workspace-section-key="pinned"
            className="shrink-0"
            onDragOver={handlePinnedDragOver}
            onDragOverCapture={handlePinnedDragOver}
            onDrop={handlePinnedDrop}
            onDropCapture={handlePinnedDrop}
          >
            <AppSidebarSection
              icon={AppSidebarPinIcon}
              label={t("sidebarPinned.title")}
              count={pinned.length}
              sort={pinnedSort}
              onSortChange={setPinnedSort}
              open={pinnedOpen}
              onOpenChange={setPinnedOpen}
              action={
                <AppSidebarPinnedPicker
                  entities={availablePinnedEntities}
                  selectedIds={pinnedIds}
                  onPick={(entity) => setPinned((current) => [...current, entity])}
                />
              }
            >
              {visiblePinned.length === 0 && !draggedObjectType ? (
                <p className="h-10 px-5 py-1.5 text-xs italic leading-[18px] text-muted-foreground">
                  {t("sidebarPinned.noPinnedContent")}
                </p>
              ) : (
                <>
                  {draggedObjectType && !pinnedIds.has(draggedObjectType.id) && (
                    <div
                      data-slot="app-sidebar-drag-preview"
                      className="mx-2 flex h-[29px] items-center rounded-md border border-dashed border-sidebar-ring/70 bg-sidebar-accent/60 px-[3px] text-sm text-sidebar-foreground"
                    >
                      <AppSidebarTypeLabel
                        icon={draggedObjectType.icon}
                        tone={draggedObjectType.tone}
                      >
                        {draggedObjectType.label}
                      </AppSidebarTypeLabel>
                    </div>
                  )}
                  {visiblePinned.map((entity) => (
                    <AppSidebarPinnedRow
                      key={entity.id}
                      entity={entity}
                      active={activeId === entity.id}
                      dragging={drag?.kind === "pinned" && drag.id === entity.id}
                      draggable={pinnedSort === "manual" || drag?.kind === "object-type"}
                      onSelect={(event) => setActiveId(entity.id, event)}
                      onOpenInSidePanel={() =>
                        onOpenPinnedInSidePanel?.(entity) ?? setActiveId(entity.id)
                      }
                      onUnpin={() =>
                        setPinned((current) => current.filter((item) => item.id !== entity.id))
                      }
                      onDragStart={(event) => {
                        setSidebarDragPreview(event);
                        event.dataTransfer.setData("application/x-sidebar-drag-kind", "pinned");
                        event.dataTransfer.setData("application/x-sidebar-drag-id", entity.id);
                        startDrag({ kind: "pinned", id: entity.id });
                      }}
                      onDragOverTarget={() => {
                        const currentDrag = dragRef.current;
                        if (currentDrag?.kind === "pinned" && pinnedSort === "manual") {
                          reorderPinned(currentDrag.id, entity.id);
                        }
                      }}
                      onDrop={() => {
                        const currentDrag = dragRef.current ?? drag;
                        if (currentDrag?.kind === "object-type") {
                          pinObjectType(currentDrag.id, entity.id);
                          clearDrag();
                          return;
                        }
                        if (currentDrag?.kind !== "pinned" || pinnedSort !== "manual") return;
                        setPinned((current) => reorderById(current, currentDrag.id, entity.id));
                        clearDrag();
                      }}
                    />
                  ))}
                </>
              )}
            </AppSidebarSection>
          </div>

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
                trigger={<AppSidebarSectionAction label={t("objectTypeStudio.trigger")} />}
              />
            }
          >
            {visibleObjectTypes.map((objectType) => (
              <AppSidebarObjectTypeRow
                key={objectType.id}
                objectType={objectType}
                collections={Object.values(objectTypeCollections).filter(
                  (collection: WorkspaceCollectionRecord) =>
                    collection.structureId === objectType.id,
                )}
                collectionsOpen={objectTypeCollectionsOpen[objectType.id] ?? true}
                active={activeId === objectType.id}
                activeId={activeId}
                dragging={drag?.kind === "object-type" && drag.id === objectType.id}
                draggable={objectSort === "manual"}
                onSelect={(event) => setActiveId(objectType.id, event)}
                onCollectionsOpenChange={(open) =>
                  setObjectTypeCollectionsOpen((current) => ({
                    ...current,
                    [objectType.id]: open,
                  }))
                }
                onCollectionAction={(action, type, collection, event) => {
                  if (action === "open") setActiveId(collection.id, event);
                  onCollectionAction?.(action, type, collection, event);
                }}
                onObjectTypeAction={onObjectTypeAction}
                onUpdate={onUpdateObjectType}
                onDelete={onDeleteObjectType}
                onDragStart={(event) => {
                  setSidebarDragPreview(event);
                  event.dataTransfer.setData("application/x-sidebar-drag-kind", "object-type");
                  event.dataTransfer.setData("application/x-sidebar-drag-id", objectType.id);
                  startDrag({ kind: "object-type", id: objectType.id });
                }}
                onPointerDown={() => {
                  dragRef.current = { kind: "object-type", id: objectType.id };
                }}
                onDragEnd={clearDrag}
                onDragOverTarget={() => {
                  const currentDrag = dragRef.current;
                  if (currentDrag?.kind !== "object-type") return;
                  moveObjectType(currentDrag.id, objectType.id);
                }}
                onDrop={() => {
                  const currentDrag = dragRef.current ?? drag;
                  if (currentDrag?.kind !== "object-type") return;
                  moveObjectType(currentDrag.id, objectType.id);
                  clearDrag();
                }}
                onCollectionDrop={(collectionId, event) => {
                  const transferKind = event.dataTransfer.getData(
                    "application/x-sidebar-drag-kind",
                  );
                  const transferId = event.dataTransfer.getData("application/x-sidebar-drag-id");
                  const pinnedId =
                    transferKind === "pinned" && transferId
                      ? transferId
                      : dragRef.current?.kind === "pinned"
                        ? dragRef.current.id
                        : undefined;
                  if (!pinnedId) return;
                  onMovePinnedEntityToCollection?.(pinnedId, collectionId);
                  clearDrag();
                }}
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
                  current.map((item) => (item.id === section.id ? { ...item, open } : item)),
                )
              }
            >
              <p className="h-10 px-5 py-1.5 text-xs italic leading-[18px] text-muted-foreground">
                {t("sidebarSections.noContent")}
              </p>
            </AppSidebarSection>
          ))}

          <AppSidebarAddSection
            onCreate={(section) => setCustomSections((current) => [...current, section])}
          />

          <div className="h-4 w-full shrink-0" />

          <div data-slot="app-sidebar-lower-content" className="mt-auto flex w-full flex-col pb-2">
            <div className="flex flex-col px-2 pr-0.5">
              <AppSidebarTrashRow
                active={activeId === "trash"}
                items={trashItems}
                isDropTarget={trashDropTarget}
                onDragOver={(event) => {
                  const currentDrag = dragRef.current ?? drag;
                  if (currentDrag) {
                    event.preventDefault();
                    setTrashDropTarget(true);
                  }
                }}
                onDragLeave={() => setTrashDropTarget(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setTrashDropTarget(false);
                  const currentDrag = dragRef.current ?? drag;
                  if (currentDrag?.kind === "pinned") {
                    setPinned((current) => current.filter((item) => item.id !== currentDrag.id));
                    clearDrag();
                  }
                }}
                onEmptyTrash={onEmptyTrash}
                onOpenChange={() => setActiveId("trash")}
                onPurgeTrashItem={onPurgeTrashItem}
                onRestoreTrashItem={onRestoreTrashItem}
              />
            </div>

            <div className="mt-2">
              <AppSidebarHelpSection />
            </div>
          </div>
        </div>
      </ScrollArea>

      <AppSidebarFooter onOpenShortcuts={onOpenShortcuts} />
    </div>
  );
}

export type { CreateStructureInput, ObjectIconName };
export {
  AppSidebarAddSection,
  type AppSidebarCollectionAction,
  type AppSidebarCustomSection,
  AppSidebarFooter,
  AppSidebarHelpSection,
  type AppSidebarObjectType,
  AppSidebarObjectTypeRow,
  AppSidebarOverview,
  type AppSidebarPinnedEntity,
  AppSidebarPinnedPicker,
  AppSidebarPinnedRow,
  AppSidebarSection,
  AppSidebarSectionAction,
  AppSidebarSectionMenu,
  type AppSidebarSortMode,
  type AppSidebarTone,
  type AppSidebarTrashItem,
  AppSidebarTrashRow,
  AppSidebarTypeLabel,
  AppSidebarUtilityRow,
};
