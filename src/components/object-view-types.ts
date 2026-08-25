import type { ReactNode } from "react";

import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import type { WorkspaceEntity } from "@/lib/workspace-objects";
import type {
  DataViewKind,
  ObjectViewConfig,
  ObjectViewKind,
  WorkspaceDataView,
} from "@/lib/workspace-object-views";

export type ObjectViewLabels = {
  readonly emptyView: string;
  readonly missingObject: string;
  readonly openObject: (title: string) => string;
  readonly untitledObject: string;
};

export type ProjectionLabels = {
  readonly objectTypeLabels?: Readonly<Record<string, string>>;
  readonly propertyLabels?: Readonly<Record<string, string>>;
};

export type ObjectViewProps = ProjectionLabels & {
  readonly className?: string;
  readonly config: ObjectViewConfig;
  readonly entity?: WorkspaceEntity | null;
  readonly labels: ObjectViewLabels;
  readonly onOpen?: (entityId: string) => void;
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
  readonly structures?: readonly WorkspaceStructure[];
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
