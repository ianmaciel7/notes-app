"use client";

import { useTranslations } from "next-intl";
import * as React from "react";

import { AppSidebarFooter, AppSidebarHelpSection, AppSidebarUtilityRow } from "@/components/app-sidebar-floating-nav";
import { AppSidebarObjectsIcon, AppSidebarPinIcon } from "@/components/app-sidebar-icons";
import { AppSidebarObjectTypeStudio } from "@/components/app-sidebar-object-type-studio";
import { ObjectAreaIcon } from "@/components/object-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { WorkspaceCollectionRecord } from "@/lib/workspace-domain-identities";
import { cn } from "@/lib/utils";
import type { CreateStructureInput, ObjectIconName } from "@/lib/workspace-object-types";

import {
  AppSidebarAddSection,
  type AppSidebarCollectionAction,
  type AppSidebarCustomSection,
  type AppSidebarObjectType,
  AppSidebarObjectTypeRow,
  AppSidebarOverview as BaseAppSidebarOverview,
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
} from "./app-sidebar-overview";

import styles from "./app-sidebar-overview-parity.module.css";

type AppSidebarOverviewProps = React.ComponentProps<typeof BaseAppSidebarOverview>;
type AppSidebarDragState = { kind: "pinned"; id: string } | null;

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
  objectTypeCollections = {},
  customSections: controlledCustomSections,
  onCreateObjectTypeFromPreset,
  onCreateObjectType,
  onUpdateObjectType,
  onDeleteObjectType,
  onPinnedEntitiesChange,
  onOpenPinnedInSidePanel,
  onCustomSectionsChange,
  onCollectionAction,
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

  function setActiveId(id: string | null) {
    if (!isControlled) setInternalActiveId(id);
    onActiveIdChange?.(id);
  }

  const [pinnedOpen, setPinnedOpen] = React.useState(true);
  const [objectTypesOpen, setObjectTypesOpen] = React.useState(true);
  const [objectTypeCollectionsOpen, setObjectTypeCollectionsOpen] = React.useState<
    Record<string, boolean>
  >({});
  const [pinnedSort, setPinnedSort] = React.useState<AppSidebarSortMode>("manual");
  const [objectSort, setObjectSort] = React.useState<AppSidebarSortMode>("manual");
  const [internalPinned, setInternalPinned] = React.useState<AppSidebarPinnedEntity[]>([]);
  const [internalCustomSections, setInternalCustomSections] = React.useState<
    AppSidebarCustomSection[]
  >([]);
  const [drag, setDrag] = React.useState<AppSidebarDragState>(null);

  useSidebarDragAutoScroll(drag !== null, rootRef);

  const pinned = controlledPinned ?? internalPinned;
  const customSections = controlledCustomSections ?? internalCustomSections;

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
        const resolved =
          typeof next === "function" ? next(controlledCustomSections) : next;
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

  const visibleObjectTypes = React.useMemo(
    () =>
      objectSort === "alphabetical"
        ? [...objectTypes].sort((a, b) => a.label.localeCompare(b.label, "pt-BR"))
        : objectTypes,
    [objectSort, objectTypes],
  );

  return (
    <div
      ref={rootRef}
      data-slot="app-sidebar-overview"
      className={cn(styles.root, "flex min-h-0 flex-1 flex-col")}
      onDragEndCapture={() => setDrag(null)}
    >
      <ScrollArea
        data-slot="app-sidebar-scroll-area"
        className={cn(
          "group/section-container relative mt-0.5 h-32 min-h-0 grow",
          "[&_[data-slot=scroll-area-viewport]>div]:!flex",
          "[&_[data-slot=scroll-area-viewport]>div]:!min-h-full",
          "[&_[data-slot=scroll-area-viewport]>div]:!w-full",
          "[&_[data-slot=scroll-area-scrollbar]]:!p-0",
        )}
      >
        <div className="flex min-h-full w-full flex-col">
          <div data-slot="app-sidebar-pinned-region" className="shrink-0">
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
              {visiblePinned.length === 0 ? (
                <p className="h-10 px-5 py-1.5 text-xs italic leading-[18px] text-muted-foreground">
                  {t("sidebarPinned.noPinnedContent")}
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
                    onOpenInSidePanel={() =>
                      onOpenPinnedInSidePanel?.(entity) ?? setActiveId(entity.id)
                    }
                    onUnpin={() =>
                      setPinned((current) => current.filter((item) => item.id !== entity.id))
                    }
                    onDragStart={() => setDrag({ kind: "pinned", id: entity.id })}
                    onDrop={() => {
                      if (drag?.kind !== "pinned" || pinnedSort !== "manual") return;
                      setPinned((current) => reorderById(current, drag.id, entity.id));
                      setDrag(null);
                    }}
                  />
                ))
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
                  (collection: WorkspaceCollectionRecord) => collection.structureId === objectType.id,
                )}
                collectionsOpen={objectTypeCollectionsOpen[objectType.id] ?? true}
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
                  if (action === "open") setActiveId(collection.id);
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

export type { CreateStructureInput, ObjectIconName };
