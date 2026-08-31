import type { ReactNode } from "react";

import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import type { WorkspaceEntity } from "@/lib/workspace-objects";
import type {
  CardPropertySurface,
  DataViewKind,
  ObjectViewConfig,
  ObjectViewKind,
  WorkspaceDataView,
} from "@/lib/workspace-object-views";

export type ObjectViewLabels = {
  readonly columnWidth: string;
  readonly emptyView: string;
  readonly missingObject: string;
  readonly missingColumn: string;
  readonly moveColumnLeft: (label: string) => string;
  readonly moveColumnRight: (label: string) => string;
  readonly objectActions?: {
    readonly deleteObject: string;
    readonly duplicate: string;
    readonly export: string;
    readonly moreOptions: (title: string) => string;
    readonly pinSidebar: string;
  };
  readonly openObject: (title: string) => string;
  readonly untitledObject: string;
  readonly wrapColumn: string;
};

export type ProjectionLabels = {
  readonly objectTypeLabels?: Readonly<Record<string, string>>;
  readonly propertyLabels?: Readonly<Record<string, string>>;
};

export type ObjectViewProps = ProjectionLabels & {
  readonly cardSurface?: CardPropertySurface;
  readonly className?: string;
  readonly config: ObjectViewConfig;
  readonly entity?: WorkspaceEntity | null;
  readonly labels: ObjectViewLabels;
  readonly onOpen?: (entityId: string) => void;
  readonly onPropertyCommit?: (
    entityId: string,
    propertyId: string,
    value: unknown,
  ) => void;
  readonly onViewUpdate?: (
    view: WorkspaceDataView,
    update: Partial<Pick<WorkspaceDataView, "presentation" | "query">>,
  ) => void;
  readonly structures?: readonly WorkspaceStructure[];
};

export type ReadyObjectViewProps = ObjectViewProps & {
  readonly entity: WorkspaceEntity;
};

export type DataViewRendererProps = ProjectionLabels & {
  readonly className?: string;
  readonly entities: readonly WorkspaceEntity[];
  readonly labels: ObjectViewLabels;
  readonly onOpen?: (entityId: string) => void;
  readonly onPropertyCommit?: (
    entityId: string,
    propertyId: string,
    value: unknown,
  ) => void;
  readonly onViewUpdate?: (
    view: WorkspaceDataView,
    update: Partial<Pick<WorkspaceDataView, "presentation" | "query">>,
  ) => void;
  readonly structures?: readonly WorkspaceStructure[];
  readonly structure?: WorkspaceStructure;
  readonly trailingContent?: ReactNode;
  readonly view: WorkspaceDataView;
};

export type ProjectedDataViewProps = DataViewRendererProps & {
  readonly entities: readonly WorkspaceEntity[];
};

export type DataViewLayoutSwitcherProps = {
  readonly ariaLabel: string;
  readonly kinds?: readonly DataViewKind[];
  readonly labels: Readonly<Partial<Record<DataViewKind, string>>>;
  readonly onValueChange: (kind: DataViewKind) => void;
  readonly value: DataViewKind;
};

export type ObjectViewLayoutSwitcherProps = {
  readonly ariaLabel: string;
  readonly labels: Readonly<Partial<Record<ObjectViewKind, string>>>;
  readonly onValueChange: (kind: ObjectViewKind) => void;
  readonly value: ObjectViewKind;
};
