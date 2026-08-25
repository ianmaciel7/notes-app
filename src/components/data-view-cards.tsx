"use client";

import { ObjectView, objectConfig } from "@/components/object-view-renderer";
import type { ProjectedDataViewProps } from "@/components/object-view-types";
import type { WorkspaceDataView } from "@/lib/workspace-object-views";

function dataViewCardsClass(view: WorkspaceDataView): string {
  const presentation = view.presentation;
  if (presentation.kind === "wall") {
    if (presentation.columnWidth === "narrow") {
      return "columns-1 gap-3 sm:columns-2 lg:columns-4";
    }
    if (presentation.columnWidth === "wide") {
      return "columns-1 gap-3 lg:columns-2";
    }
    return "columns-1 gap-3 sm:columns-2 lg:columns-3";
  }
  if (presentation.kind === "gallery") {
    if (presentation.cardSize === "small") {
      return "grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),19rem))] items-start justify-start gap-4";
    }
    if (presentation.cardSize === "large") {
      return "grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),26rem))] items-start justify-start gap-4";
    }
  }
  return "grid grid-cols-[repeat(auto-fill,minmax(min(100%,19rem),21.5rem))] items-start justify-start gap-4";
}

function DataViewCards(props: ProjectedDataViewProps) {
  const presentation = props.view.presentation;
  const objectViewKind =
    presentation.kind === "embed"
      ? presentation.objectViewKind
      : "small-card";
  const wall = presentation.kind === "wall";
  return (
    <div
      data-slot="data-view-cards"
      className={dataViewCardsClass(props.view)}
      data-cover-fit={
        presentation.kind === "gallery" || presentation.kind === "wall"
          ? presentation.coverFit
          : undefined
      }
    >
      {props.entities.map((entity) => (
        <ObjectView
          {...props}
          key={entity.id}
          className={wall ? "mb-3 break-inside-avoid" : undefined}
          config={objectConfig(
            objectViewKind,
            presentation.visiblePropertyIds,
          )}
          entity={entity}
        />
      ))}
      {props.trailingContent}
    </div>
  );
}

export { DataViewCards };
