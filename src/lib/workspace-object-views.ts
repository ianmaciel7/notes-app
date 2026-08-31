import type {
  PropertyDefinition,
  PropertyValueType,
  StructureId,
  WorkspaceStructure,
} from "./workspace-object-types.ts";
import {
  selectActiveEntities,
  type WorkspaceEntity,
  type WorkspaceObjectState,
} from "./workspace-objects.ts";
import { readWorkspacePropertyValue } from "./workspace-property-values.ts";

export const OBJECT_VIEW_KINDS = [
  "inline",
  "link-block",
  "small-card",
  "wide-card",
  "embed",
  "page",
] as const;

export const DATA_VIEW_KINDS = [
  "list",
  "table",
  "gallery",
  "wall",
  "embed",
] as const;

export type ObjectViewKind = (typeof OBJECT_VIEW_KINDS)[number];
export type DataViewKind = (typeof DATA_VIEW_KINDS)[number];
export type SortDirection = "ascending" | "descending";

export type PageLayoutConfig = {
  readonly contentWidth: "narrow" | "standard" | "wide";
  readonly header: "compact" | "cover" | "hidden";
  readonly properties: "hidden" | "side" | "top";
  readonly showBacklinks: boolean;
  readonly showTableOfContents: boolean;
};

export type ObjectViewConfig = {
  readonly kind: ObjectViewKind;
  readonly pageLayout: PageLayoutConfig;
  readonly visiblePropertyIds: readonly string[];
};

export type QueryFilter =
  | {
      readonly field: "createdAt";
      readonly operator: "after" | "before" | "on";
      readonly value: string;
    }
  | {
      readonly field: "kind";
      readonly operator: "is" | "is-not";
      readonly value: WorkspaceEntity["kind"];
    }
  | {
      readonly field: "structure";
      readonly operator: "is-any-of" | "is-none-of";
      readonly value: readonly StructureId[];
    }
  | {
      readonly field: "tag";
      readonly operator: "contains" | "does-not-contain";
      readonly value: string;
    }
  | {
      readonly field: "title";
      readonly operator: "contains" | "equals" | "starts-with";
      readonly value: string;
    };

export type QuerySort = {
  readonly direction: SortDirection;
  readonly field: "createdAt" | "kind" | "objectTypeId" | "title";
};

export type QueryDefinition = {
  readonly filters: readonly QueryFilter[];
  readonly limit?: number;
  readonly search?: string;
  readonly sorts: readonly QuerySort[];
  readonly version: 1;
};

export type DataViewGrouping = {
  readonly direction: SortDirection;
  readonly emptyLabel?: string;
  readonly propertyId: string;
};

export type DataViewColumn = {
  readonly id: string;
  readonly label: string;
  readonly propertyId: string;
  readonly visible: boolean;
  readonly wrap?: boolean;
  readonly width?: number;
};

type DataViewPresentationBase = {
  readonly groupBy?: DataViewGrouping;
  readonly visiblePropertyIds: readonly string[];
};

export type ListDataViewPresentation = DataViewPresentationBase & {
  readonly density: "compact" | "comfortable";
  readonly kind: "list";
  readonly showDescription: boolean;
  readonly showIcon: boolean;
};

export type TableDataViewPresentation = DataViewPresentationBase & {
  readonly columns: readonly DataViewColumn[];
  readonly kind: "table";
  readonly rowDensity: "compact" | "comfortable";
};

export type GalleryDataViewPresentation = DataViewPresentationBase & {
  readonly cardSize: "small" | "medium" | "large";
  readonly coverFit: "contain" | "cover";
  readonly coverPropertyId?: string;
  readonly kind: "gallery";
};

export type WallDataViewPresentation = DataViewPresentationBase & {
  readonly columnWidth: "narrow" | "standard" | "wide";
  readonly coverFit: "contain" | "cover";
  readonly coverPropertyId?: string;
  readonly kind: "wall";
};

export type EmbeddedDataViewPresentation = DataViewPresentationBase & {
  readonly kind: "embed";
  readonly objectViewKind: Exclude<ObjectViewKind, "page">;
};

export type DataViewPresentation =
  | EmbeddedDataViewPresentation
  | GalleryDataViewPresentation
  | ListDataViewPresentation
  | TableDataViewPresentation
  | WallDataViewPresentation;

export type WorkspaceDataView = {
  readonly createdAt: string;
  readonly creatorId: string;
  readonly id: string;
  readonly name: string;
  readonly presentation: DataViewPresentation;
  readonly query: QueryDefinition;
  readonly updatedAt: string;
  readonly workspaceId: string;
};

export type ObjectViewProjection =
  | {
      readonly config: ObjectViewConfig;
      readonly entity: WorkspaceEntity;
      readonly status: "ready";
    }
  | {
      readonly config: ObjectViewConfig;
      readonly entityId: string;
      readonly status: "missing";
    };

export type DataViewProjection = {
  readonly groups: readonly DataViewProjectionGroup[];
  readonly items: readonly WorkspaceEntity[];
  readonly view: WorkspaceDataView;
};

export type DataViewProjectionGroup = {
  readonly id: string;
  readonly items: readonly WorkspaceEntity[];
  readonly label: string;
};

export const DASHBOARD_BUILT_IN_SECTION_IDS = [
  "recently-opened",
  "untagged",
  "not-in-collection",
  "no-backlinks",
  "collections",
] as const;

export type DashboardBuiltInSectionId =
  (typeof DASHBOARD_BUILT_IN_SECTION_IDS)[number];

export type DashboardSectionSource =
  | { readonly kind: "all" }
  | {
      readonly builtInId: DashboardBuiltInSectionId;
      readonly kind: "built-in";
    }
  | {
      readonly collectionId: string;
      readonly kind: "collection";
    }
  | {
      readonly kind: "query";
      readonly queryId: string;
    };

export type StructureDashboardSection = {
  readonly id: string;
  readonly order: number;
  readonly source: DashboardSectionSource;
  readonly title: string;
  readonly visible: boolean;
};

export type StructureDashboard = {
  readonly sections: readonly StructureDashboardSection[];
  readonly structureId: StructureId;
  readonly updatedAt: string;
};

export type ObjectTemplateBlock = {
  readonly children?: readonly ObjectTemplateBlock[];
  readonly content?: unknown;
  readonly id: string;
  readonly type: string;
};

export type ObjectCreationTemplate = {
  readonly blocks: readonly ObjectTemplateBlock[];
  readonly id: string;
  readonly name: string;
  readonly propertyValues: Readonly<Record<string, unknown>>;
  readonly structureId: StructureId;
  readonly title: string;
};

export type InstantiatedObjectTemplate = {
  readonly blocks: readonly ObjectTemplateBlock[];
  readonly objectId: string;
  readonly propertyValues: Readonly<Record<string, unknown>>;
  readonly structureId: StructureId;
  readonly title: string;
};

export type PropertyCompatibility =
  | "compatible"
  | "incompatible"
  | "requires-confirmation";

export type ConversionResolution =
  | { readonly kind: "discard" }
  | { readonly kind: "map"; readonly targetPropertyId: string }
  | { readonly kind: "unresolved" };

export type ConversionFieldPlan = {
  readonly compatibility: PropertyCompatibility;
  readonly reason: string;
  readonly resolution: ConversionResolution;
  readonly sourcePropertyId: string;
  readonly sourceValue: unknown;
  readonly suggestedTargetPropertyId?: string;
};

export type ObjectConversionPlan = {
  readonly fields: readonly ConversionFieldPlan[];
  readonly sourceStructureId: StructureId;
  readonly targetStructureId: StructureId;
};

export type CommittedObjectConversion = {
  readonly propertyValues: Readonly<Record<string, unknown>>;
  readonly sourceStructureId: StructureId;
  readonly targetStructureId: StructureId;
};

export type WorkspaceViewState = {
  readonly dashboards: readonly StructureDashboard[];
  readonly dataViews: readonly WorkspaceDataView[];
  readonly templates: readonly ObjectCreationTemplate[];
  readonly version: 1;
};

export type ViewDomainErrorCode =
  | "duplicate-id"
  | "invalid-conversion-plan"
  | "invalid-dashboard"
  | "invalid-data-view"
  | "invalid-query"
  | "invalid-snapshot"
  | "immutable-dashboard-section"
  | "unknown-dashboard-section"
  | "unknown-data-view";

export type ViewDomainError = {
  readonly code: ViewDomainErrorCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export type ViewDomainResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly error: ViewDomainError; readonly ok: false };

export type CreateDataViewInput = {
  readonly creatorId: string;
  readonly name: string;
  readonly presentation?: DataViewPresentation;
  readonly query?: QueryDefinition;
  readonly workspaceId: string;
};

export type DashboardSourceRecord = {
  readonly id: string;
  readonly title: string;
};

export type DashboardSourceCatalog = {
  readonly collections?: readonly DashboardSourceRecord[];
  readonly queries?: readonly DashboardSourceRecord[];
};

export type DashboardMigrationDiagnostic = {
  readonly code: "legacy-section-migrated" | "unknown-section-hidden";
  readonly message: string;
  readonly sectionId: string;
};

export type DashboardMigrationResult = {
  readonly dashboard: StructureDashboard;
  readonly diagnostics: readonly DashboardMigrationDiagnostic[];
};

export type DashboardBuiltInProjection = {
  readonly id: DashboardBuiltInSectionId | string;
  readonly items: readonly WorkspaceEntity[];
  readonly reason?: string;
  readonly supported: boolean;
  readonly title: string;
};

export type DashboardBuiltInProjectionInput = {
  readonly collectionRecords?: readonly DashboardSourceRecord[];
  readonly entities:
    | Pick<WorkspaceObjectState, "entities" | "trashRecords">
    | readonly WorkspaceEntity[];
  readonly relationSourcesByTargetId?: ReadonlyMap<string, readonly string[]>;
  readonly structureId: StructureId;
};

export type TaskDashboardSectionProvider = {
  readonly project: (
    input: DashboardBuiltInProjectionInput,
  ) => DashboardBuiltInProjection;
};

export type CardPropertySurface = "embed" | "gallery" | "small-card" | "wall";

export type ObjectCardPropertyProjection = {
  readonly directEdit: boolean;
  readonly empty: boolean;
  readonly label: string;
  readonly propertyId: string;
  readonly value: unknown;
};

export type TableViewColumnProjection = DataViewColumn & {
  readonly missing: boolean;
};

const DEFAULT_PAGE_LAYOUT: PageLayoutConfig = {
  contentWidth: "standard",
  header: "compact",
  properties: "top",
  showBacklinks: true,
  showTableOfContents: false,
};

const DEFAULT_QUERY: QueryDefinition = {
  filters: [],
  sorts: [{ direction: "descending", field: "createdAt" }],
  version: 1,
};

function success<T>(value: T): ViewDomainResult<T> {
  return { ok: true, value };
}

function failure(
  code: ViewDomainErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): ViewDomainResult<never> {
  return { error: { code, details, message }, ok: false };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasUniqueValues(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function isIsoDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

function readEntityTags(entity: WorkspaceEntity): readonly string[] {
  return "tags" in entity && Array.isArray(entity.tags) ? entity.tags : [];
}

export function readWorkspaceEntityProperty(
  entity: WorkspaceEntity,
  propertyId: string,
): unknown {
  if (propertyId === "objectTypeId") return entity.objectTypeId;
  if (
    entity.propertyValues &&
    Object.hasOwn(entity.propertyValues, propertyId)
  ) {
    return readWorkspacePropertyValue(entity.propertyValues[propertyId]);
  }
  const record = entity as unknown as Readonly<Record<string, unknown>>;
  return record[propertyId];
}

function compareUnknownValues(left: unknown, right: unknown): number {
  if (left === right) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function matchesStructureFilter(
  entity: WorkspaceEntity,
  filter: Extract<QueryFilter, { readonly field: "structure" }>,
): boolean {
  const contains = filter.value.includes(entity.objectTypeId);
  return filter.operator === "is-any-of" ? contains : !contains;
}

function matchesKindFilter(
  entity: WorkspaceEntity,
  filter: Extract<QueryFilter, { readonly field: "kind" }>,
): boolean {
  const matches = entity.kind === filter.value;
  return filter.operator === "is" ? matches : !matches;
}

function matchesTagFilter(
  entity: WorkspaceEntity,
  filter: Extract<QueryFilter, { readonly field: "tag" }>,
): boolean {
  const contains = readEntityTags(entity).some(
    (tag) => normalizeText(tag) === normalizeText(filter.value),
  );
  return filter.operator === "contains" ? contains : !contains;
}

function matchesTitleFilter(
  entity: WorkspaceEntity,
  filter: Extract<QueryFilter, { readonly field: "title" }>,
): boolean {
  const title = normalizeText(entity.title);
  const expected = normalizeText(filter.value);
  if (filter.operator === "equals") return title === expected;
  if (filter.operator === "starts-with") return title.startsWith(expected);
  return title.includes(expected);
}

function isSameUtcDay(left: Date, right: Date): boolean {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}

function matchesCreatedAtFilter(
  entity: WorkspaceEntity,
  filter: Extract<QueryFilter, { readonly field: "createdAt" }>,
): boolean {
  const entityTime = Date.parse(entity.createdAt);
  const filterTime = Date.parse(filter.value);
  if (!Number.isFinite(entityTime) || !Number.isFinite(filterTime))
    return false;
  if (filter.operator === "before") return entityTime < filterTime;
  if (filter.operator === "after") return entityTime > filterTime;
  return isSameUtcDay(new Date(entityTime), new Date(filterTime));
}

function matchesQueryFilter(
  entity: WorkspaceEntity,
  filter: QueryFilter,
): boolean {
  if (filter.field === "structure")
    return matchesStructureFilter(entity, filter);
  if (filter.field === "kind") return matchesKindFilter(entity, filter);
  if (filter.field === "tag") return matchesTagFilter(entity, filter);
  if (filter.field === "title") return matchesTitleFilter(entity, filter);
  return matchesCreatedAtFilter(entity, filter);
}

function createDefaultPresentation(kind: DataViewKind): DataViewPresentation {
  const visiblePropertyIds = ["title", "objectTypeId", "createdAt"];
  if (kind === "table") {
    return {
      columns: [
        { id: "title", label: "Title", propertyId: "title", visible: true },
        {
          id: "object-type",
          label: "Object type",
          propertyId: "objectTypeId",
          visible: true,
        },
        {
          id: "created-at",
          label: "Created",
          propertyId: "createdAt",
          visible: true,
        },
      ],
      kind,
      rowDensity: "comfortable",
      visiblePropertyIds,
    };
  }
  if (kind === "gallery") {
    return {
      cardSize: "medium",
      coverFit: "cover",
      kind,
      visiblePropertyIds,
    };
  }
  if (kind === "wall") {
    return {
      columnWidth: "standard",
      coverFit: "cover",
      kind,
      visiblePropertyIds,
    };
  }
  if (kind === "embed") {
    return {
      kind,
      objectViewKind: "small-card",
      visiblePropertyIds,
    };
  }
  return {
    density: "comfortable",
    kind,
    showDescription: true,
    showIcon: true,
    visiblePropertyIds,
  };
}

function isDataViewKind(value: unknown): value is DataViewKind {
  return DATA_VIEW_KINDS.includes(value as DataViewKind);
}

function isObjectViewKind(value: unknown): value is ObjectViewKind {
  return OBJECT_VIEW_KINDS.includes(value as ObjectViewKind);
}

function isDashboardBuiltInSectionId(
  value: unknown,
): value is DashboardBuiltInSectionId {
  return DASHBOARD_BUILT_IN_SECTION_IDS.includes(
    value as DashboardBuiltInSectionId,
  );
}

function isDashboardSectionSource(
  value: unknown,
): value is DashboardSectionSource {
  if (!value || typeof value !== "object") return false;
  const source = value as Partial<DashboardSectionSource>;
  if (source.kind === "all") return true;
  if (source.kind === "built-in") {
    return isDashboardBuiltInSectionId(source.builtInId);
  }
  if (source.kind === "collection") {
    return isNonEmptyString(source.collectionId);
  }
  if (source.kind === "query") {
    return isNonEmptyString(source.queryId);
  }
  return false;
}

function isStructureQueryFilter(filter: Partial<QueryFilter>): boolean {
  return (
    (filter.operator === "is-any-of" || filter.operator === "is-none-of") &&
    Array.isArray(filter.value) &&
    filter.value.every(isNonEmptyString)
  );
}

function isKindQueryFilter(filter: Partial<QueryFilter>): boolean {
  return (
    (filter.operator === "is" || filter.operator === "is-not") &&
    isNonEmptyString(filter.value)
  );
}

function isTagQueryFilter(filter: Partial<QueryFilter>): boolean {
  return (
    (filter.operator === "contains" ||
      filter.operator === "does-not-contain") &&
    isNonEmptyString(filter.value)
  );
}

function isTitleQueryFilter(filter: Partial<QueryFilter>): boolean {
  return (
    (filter.operator === "contains" ||
      filter.operator === "equals" ||
      filter.operator === "starts-with") &&
    typeof filter.value === "string"
  );
}

function isCreatedAtQueryFilter(filter: Partial<QueryFilter>): boolean {
  return (
    (filter.operator === "after" ||
      filter.operator === "before" ||
      filter.operator === "on") &&
    typeof filter.value === "string" &&
    isIsoDate(filter.value)
  );
}

function isQueryFilter(value: unknown): value is QueryFilter {
  if (!value || typeof value !== "object") return false;
  const filter = value as Partial<QueryFilter>;
  if (filter.field === "structure") return isStructureQueryFilter(filter);
  if (filter.field === "kind") return isKindQueryFilter(filter);
  if (filter.field === "tag") return isTagQueryFilter(filter);
  if (filter.field === "title") return isTitleQueryFilter(filter);
  return filter.field === "createdAt" && isCreatedAtQueryFilter(filter);
}

function isQuerySort(value: unknown): value is QuerySort {
  if (!value || typeof value !== "object") return false;
  const sort = value as Partial<QuerySort>;
  return (
    (sort.direction === "ascending" || sort.direction === "descending") &&
    (sort.field === "createdAt" ||
      sort.field === "kind" ||
      sort.field === "objectTypeId" ||
      sort.field === "title")
  );
}

export function createDefaultObjectViewConfig(
  kind: ObjectViewKind = "page",
): ObjectViewConfig {
  return {
    kind,
    pageLayout: { ...DEFAULT_PAGE_LAYOUT },
    visiblePropertyIds: ["title", "objectTypeId", "createdAt"],
  };
}

export function createDefaultQueryDefinition(): QueryDefinition {
  return {
    ...DEFAULT_QUERY,
    filters: [...DEFAULT_QUERY.filters],
    sorts: [...DEFAULT_QUERY.sorts],
  };
}

export function createDefaultDataViewPresentation(
  kind: DataViewKind,
): DataViewPresentation {
  return createDefaultPresentation(kind);
}

function hasValidQueryCollections(query: Partial<QueryDefinition>): boolean {
  return (
    Array.isArray(query.filters) &&
    query.filters.every(isQueryFilter) &&
    Array.isArray(query.sorts) &&
    query.sorts.every(isQuerySort)
  );
}

function hasValidQueryOptions(query: Partial<QueryDefinition>): boolean {
  const validSearch =
    query.search === undefined || typeof query.search === "string";
  const validLimit =
    query.limit === undefined ||
    (Number.isInteger(query.limit) && (query.limit ?? 0) > 0);
  return validSearch && validLimit;
}

export function validateQueryDefinition(
  value: unknown,
): ViewDomainResult<QueryDefinition> {
  if (!value || typeof value !== "object") {
    return failure("invalid-query", "QueryDefinition must be an object.");
  }
  const query = value as Partial<QueryDefinition>;
  if (
    query.version !== 1 ||
    !hasValidQueryCollections(query) ||
    !hasValidQueryOptions(query)
  ) {
    return failure("invalid-query", "QueryDefinition is invalid.");
  }
  return success(query as QueryDefinition);
}

function hasValidDataViewIdentity(view: Partial<WorkspaceDataView>): boolean {
  return (
    isNonEmptyString(view.id) &&
    isNonEmptyString(view.workspaceId) &&
    isNonEmptyString(view.creatorId) &&
    isNonEmptyString(view.name)
  );
}

function hasValidDataViewTimestamps(view: Partial<WorkspaceDataView>): boolean {
  return isIsoDate(view.createdAt ?? "") && isIsoDate(view.updatedAt ?? "");
}

function hasValidPresentationBase(
  presentation: unknown,
): presentation is DataViewPresentation {
  if (!presentation || typeof presentation !== "object") return false;
  const candidate = presentation as Partial<DataViewPresentation>;
  return (
    isDataViewKind(candidate.kind) &&
    Array.isArray(candidate.visiblePropertyIds) &&
    candidate.visiblePropertyIds.every(isNonEmptyString) &&
    hasUniqueValues(candidate.visiblePropertyIds)
  );
}

function isValidDataViewColumn(column: DataViewColumn): boolean {
  const validWidth =
    column.width === undefined ||
    (Number.isFinite(column.width) && (column.width ?? 0) > 0);
  const validWrapping =
    column.wrap === undefined || typeof column.wrap === "boolean";
  return (
    isNonEmptyString(column.id) &&
    isNonEmptyString(column.label) &&
    isNonEmptyString(column.propertyId) &&
    typeof column.visible === "boolean" &&
    validWrapping &&
    validWidth
  );
}

function hasValidTablePresentation(
  presentation: DataViewPresentation,
): boolean {
  if (presentation.kind !== "table") return true;
  const columns = presentation.columns;
  return (
    columns.length > 0 &&
    columns.every(isValidDataViewColumn) &&
    hasUniqueValues(columns.map((column) => column.id))
  );
}

function hasValidEmbeddedPresentation(
  presentation: DataViewPresentation,
): boolean {
  if (presentation.kind !== "embed") return true;
  const objectViewKind: unknown = presentation.objectViewKind;
  return isObjectViewKind(objectViewKind) && objectViewKind !== "page";
}

export function validateDataView(
  value: unknown,
): ViewDomainResult<WorkspaceDataView> {
  if (!value || typeof value !== "object") {
    return failure("invalid-data-view", "Data View must be an object.");
  }
  const view = value as Partial<WorkspaceDataView>;
  const query = validateQueryDefinition(view.query);
  if (!query.ok) return query;
  if (
    !hasValidDataViewIdentity(view) ||
    !hasValidDataViewTimestamps(view) ||
    !hasValidPresentationBase(view.presentation)
  ) {
    return failure("invalid-data-view", "Data View metadata is invalid.");
  }
  if (!hasValidTablePresentation(view.presentation)) {
    return failure("invalid-data-view", "Table columns are invalid.");
  }
  if (!hasValidEmbeddedPresentation(view.presentation)) {
    return failure(
      "invalid-data-view",
      "Embedded Object View kind is invalid.",
    );
  }
  return success(view as WorkspaceDataView);
}

export function createDataView(
  current: readonly WorkspaceDataView[],
  input: CreateDataViewInput,
  idFactory: () => string = () => crypto.randomUUID(),
  nowFactory: () => string = () => new Date().toISOString(),
): ViewDomainResult<readonly WorkspaceDataView[]> {
  const id = idFactory();
  if (current.some((view) => view.id === id)) {
    return failure("duplicate-id", `Data View id "${id}" already exists.`);
  }
  const now = nowFactory();
  const view: WorkspaceDataView = {
    createdAt: now,
    creatorId: input.creatorId,
    id,
    name: input.name.trim(),
    presentation: input.presentation ?? createDefaultPresentation("list"),
    query: input.query ?? createDefaultQueryDefinition(),
    updatedAt: now,
    workspaceId: input.workspaceId,
  };
  const validated = validateDataView(view);
  return validated.ok ? success([...current, validated.value]) : validated;
}

export function updateDataView(
  current: readonly WorkspaceDataView[],
  id: string,
  update: Partial<Pick<WorkspaceDataView, "name" | "presentation" | "query">>,
  nowFactory: () => string = () => new Date().toISOString(),
): ViewDomainResult<readonly WorkspaceDataView[]> {
  const existing = current.find((view) => view.id === id);
  if (!existing) {
    return failure("unknown-data-view", `Data View "${id}" does not exist.`);
  }
  const next: WorkspaceDataView = {
    ...existing,
    ...update,
    name: update.name === undefined ? existing.name : update.name.trim(),
    updatedAt: nowFactory(),
  };
  const validated = validateDataView(next);
  if (!validated.ok) return validated;
  return success(
    current.map((view) => (view.id === id ? validated.value : view)),
  );
}

export function deleteDataView(
  current: readonly WorkspaceDataView[],
  id: string,
): ViewDomainResult<readonly WorkspaceDataView[]> {
  if (!current.some((view) => view.id === id)) {
    return failure("unknown-data-view", `Data View "${id}" does not exist.`);
  }
  return success(current.filter((view) => view.id !== id));
}

function dashboardSectionId(source: DashboardSectionSource): string {
  if (source.kind === "all") return "dashboard-section:all";
  if (source.kind === "built-in") {
    return `dashboard-section:built-in:${source.builtInId}`;
  }
  if (source.kind === "collection") {
    return `dashboard-section:collection:${source.collectionId}`;
  }
  return `dashboard-section:query:${source.queryId}`;
}

function dashboardSectionTitle(
  source: DashboardSectionSource,
  catalog: DashboardSourceCatalog = {},
): string {
  if (source.kind === "all") return "All";
  if (source.kind === "built-in") {
    return source.builtInId
      .split("-")
      .map((part) => part[0]?.toLocaleUpperCase() + part.slice(1))
      .join(" ");
  }
  if (source.kind === "collection") {
    return (
      catalog.collections?.find((item) => item.id === source.collectionId)
        ?.title ?? "Missing collection"
    );
  }
  return (
    catalog.queries?.find((item) => item.id === source.queryId)?.title ??
    "Missing query"
  );
}

export function createDashboardSection(
  source: DashboardSectionSource,
  order: number,
  catalog?: DashboardSourceCatalog,
): StructureDashboardSection {
  return {
    id: dashboardSectionId(source),
    order,
    source,
    title: dashboardSectionTitle(source, catalog),
    visible: true,
  };
}

export function createDefaultStructureDashboard(
  structureId: StructureId,
  nowFactory: () => string = () => new Date().toISOString(),
): StructureDashboard {
  return {
    sections: [createDashboardSection({ kind: "all" }, 0)],
    structureId,
    updatedAt: nowFactory(),
  };
}

export function resolveDashboardSectionTitles(
  dashboard: StructureDashboard,
  catalog: DashboardSourceCatalog,
  nowFactory: () => string = () => new Date().toISOString(),
): StructureDashboard {
  return {
    ...dashboard,
    sections: dashboard.sections.map((section) => ({
      ...section,
      title: dashboardSectionTitle(section.source, catalog),
    })),
    updatedAt: nowFactory(),
  };
}

export function removeDashboardSection(
  dashboard: StructureDashboard,
  sectionId: string,
  nowFactory: () => string = () => new Date().toISOString(),
): ViewDomainResult<StructureDashboard> {
  if (sectionId.startsWith("sidebar-section:")) {
    return failure(
      "unknown-dashboard-section",
      "Sidebar section ids cannot be used by dashboard commands.",
      { sectionId },
    );
  }
  const section = dashboard.sections.find((item) => item.id === sectionId);
  if (!section) {
    return failure(
      "unknown-dashboard-section",
      `Dashboard section "${sectionId}" does not exist.`,
    );
  }
  if (section.source.kind === "all") {
    return failure(
      "immutable-dashboard-section",
      "The All dashboard section cannot be removed.",
    );
  }
  return success({
    ...dashboard,
    sections: dashboard.sections.filter((item) => item.id !== sectionId),
    updatedAt: nowFactory(),
  });
}

export function reorderDashboardSections(
  dashboard: StructureDashboard,
  sectionIds: readonly string[],
  nowFactory: () => string = () => new Date().toISOString(),
): ViewDomainResult<StructureDashboard> {
  if (
    sectionIds.some((sectionId) => sectionId.startsWith("sidebar-section:"))
  ) {
    return failure(
      "unknown-dashboard-section",
      "Sidebar section ids cannot be used by dashboard commands.",
    );
  }
  const currentIds = dashboard.sections.map((section) => section.id);
  const sameMembership =
    sectionIds.length === currentIds.length &&
    currentIds.every((sectionId) => sectionIds.includes(sectionId));
  if (!sameMembership) {
    return failure(
      "unknown-dashboard-section",
      "Dashboard reorder must include each dashboard section exactly once.",
    );
  }
  const byId = new Map(
    dashboard.sections.map((section) => [section.id, section]),
  );
  return success({
    ...dashboard,
    sections: sectionIds.flatMap((sectionId, order) => {
      const section = byId.get(sectionId);
      return section ? [{ ...section, order }] : [];
    }),
    updatedAt: nowFactory(),
  });
}

export function setDashboardSectionVisibility(
  dashboard: StructureDashboard,
  sectionId: string,
  visible: boolean,
  nowFactory: () => string = () => new Date().toISOString(),
): ViewDomainResult<StructureDashboard> {
  if (sectionId.startsWith("sidebar-section:")) {
    return failure(
      "unknown-dashboard-section",
      "Sidebar section ids cannot be used by dashboard commands.",
      { sectionId },
    );
  }
  const section = dashboard.sections.find((item) => item.id === sectionId);
  if (!section) {
    return failure(
      "unknown-dashboard-section",
      `Dashboard section "${sectionId}" does not exist.`,
    );
  }
  if (section.source.kind === "all" && !visible) {
    return failure(
      "immutable-dashboard-section",
      "The All dashboard section cannot be hidden.",
    );
  }
  return success({
    ...dashboard,
    sections: dashboard.sections.map((item) =>
      item.id === sectionId ? { ...item, visible } : item,
    ),
    updatedAt: nowFactory(),
  });
}

function dashboardEntitiesForStructure(
  entities:
    | Pick<WorkspaceObjectState, "entities" | "trashRecords">
    | readonly WorkspaceEntity[],
  structureId: StructureId,
): WorkspaceEntity[] {
  return selectActiveEntities(entities).filter(
    (entity) => entity.objectTypeId === structureId,
  );
}

function hasEntityCollectionMembership(entity: WorkspaceEntity): boolean {
  return "collections" in entity && entity.collections.length > 0;
}

function hasEntityTags(entity: WorkspaceEntity): boolean {
  return "tags" in entity && entity.tags.length > 0;
}

export function projectDashboardBuiltInSection(
  builtInId: DashboardBuiltInSectionId,
  input: DashboardBuiltInProjectionInput,
): DashboardBuiltInProjection {
  const structureEntities = dashboardEntitiesForStructure(
    input.entities,
    input.structureId,
  );
  if (builtInId === "recently-opened") {
    return {
      id: builtInId,
      items: [],
      reason: "No canonical opened-at field is available in local data.",
      supported: false,
      title: dashboardSectionTitle({ builtInId, kind: "built-in" }),
    };
  }
  if (builtInId === "untagged") {
    return {
      id: builtInId,
      items: structureEntities.filter((entity) => !hasEntityTags(entity)),
      supported: true,
      title: dashboardSectionTitle({ builtInId, kind: "built-in" }),
    };
  }
  if (builtInId === "not-in-collection") {
    return {
      id: builtInId,
      items: structureEntities.filter(
        (entity) => !hasEntityCollectionMembership(entity),
      ),
      supported: true,
      title: dashboardSectionTitle({ builtInId, kind: "built-in" }),
    };
  }
  if (builtInId === "no-backlinks") {
    return {
      id: builtInId,
      items: structureEntities.filter(
        (entity) =>
          (input.relationSourcesByTargetId?.get(entity.id) ?? []).length === 0,
      ),
      supported: true,
      title: dashboardSectionTitle({ builtInId, kind: "built-in" }),
    };
  }
  return {
    id: builtInId,
    items: [],
    supported: true,
    title: dashboardSectionTitle({ builtInId, kind: "built-in" }),
  };
}

export function projectTaskDashboardSection(
  id: string,
  title: string,
  input: DashboardBuiltInProjectionInput,
  provider: TaskDashboardSectionProvider | undefined,
): DashboardBuiltInProjection {
  if (!provider) {
    return {
      id,
      items: [],
      reason: "Task dashboard section provider is not available.",
      supported: false,
      title,
    };
  }
  return provider.project({
    ...input,
    entities: selectActiveEntities(input.entities),
  });
}

function defaultSmallCardPropertyIds(
  structure: WorkspaceStructure,
): readonly string[] {
  const propertyIds = new Set(
    structure.propertyDefinitions.map((definition) => definition.id),
  );
  return ["title", "objectTypeId", "createdAt"].filter(
    (propertyId) =>
      propertyId === "objectTypeId" || propertyIds.has(propertyId),
  );
}

export function resolveStructureSmallCardPropertyIds(
  structure: WorkspaceStructure,
): readonly string[] {
  const configured = structure.presentation.smallCardVisiblePropertyIds;
  if (!configured) return defaultSmallCardPropertyIds(structure);
  const supportedIds = new Set([
    "objectTypeId",
    ...structure.propertyDefinitions.map((definition) => definition.id),
  ]);
  const visible = configured.filter((propertyId) =>
    supportedIds.has(propertyId),
  );
  return visible.length > 0 ? visible : defaultSmallCardPropertyIds(structure);
}

export function setStructureSmallCardPropertyIds(
  structure: WorkspaceStructure,
  propertyIds: readonly string[],
): ViewDomainResult<WorkspaceStructure> {
  const supportedIds = new Set([
    "objectTypeId",
    ...structure.propertyDefinitions.map((definition) => definition.id),
  ]);
  const valid =
    propertyIds.length > 0 &&
    propertyIds.every(isNonEmptyString) &&
    hasUniqueValues([...propertyIds]) &&
    propertyIds.every((propertyId) => supportedIds.has(propertyId));
  if (!valid) {
    return failure(
      "invalid-data-view",
      "Small-card property ids must be unique supported properties.",
    );
  }
  return success({
    ...structure,
    presentation: {
      ...structure.presentation,
      smallCardVisiblePropertyIds: [...propertyIds],
    },
  });
}

function findPropertyDefinition(
  structure: WorkspaceStructure,
  propertyId: string,
): PropertyDefinition | undefined {
  return structure.propertyDefinitions.find(
    (definition) => definition.id === propertyId,
  );
}

function isDirectCardEditSupported(
  definition: PropertyDefinition | undefined,
): boolean {
  if (!definition?.writable) return false;
  return (
    definition.valueType === "boolean" ||
    definition.valueType === "date" ||
    definition.valueType === "entity" ||
    definition.valueType === "label" ||
    definition.valueType === "media" ||
    definition.valueType === "title" ||
    definition.valueType === "url"
  );
}

function isEmptyCardPropertyValue(value: unknown): boolean {
  if (value == null || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function projectObjectCardProperties(
  entity: WorkspaceEntity,
  structure: WorkspaceStructure,
  surface: CardPropertySurface,
): readonly ObjectCardPropertyProjection[] {
  const includeEmpty = surface === "gallery";
  return resolveStructureSmallCardPropertyIds(structure).flatMap(
    (propertyId): ObjectCardPropertyProjection[] => {
      const definition = findPropertyDefinition(structure, propertyId);
      const value =
        propertyId === "objectTypeId"
          ? entity.objectTypeId
          : readWorkspaceEntityProperty(entity, propertyId);
      const empty = isEmptyCardPropertyValue(value);
      if (empty && !includeEmpty) return [];
      return [
        {
          directEdit: isDirectCardEditSupported(definition),
          empty,
          label: definition?.name ?? propertyId,
          propertyId,
          value,
        },
      ];
    },
  );
}

function requireTablePresentation(
  view: WorkspaceDataView,
): ViewDomainResult<TableDataViewPresentation> {
  return view.presentation.kind === "table"
    ? success(view.presentation)
    : failure("invalid-data-view", "Data View is not a table.");
}

function replaceTablePresentation(
  view: WorkspaceDataView,
  presentation: TableDataViewPresentation,
  nowFactory: () => string,
): WorkspaceDataView {
  return { ...view, presentation, updatedAt: nowFactory() };
}

export function projectTableViewColumns(
  view: WorkspaceDataView,
  structure: WorkspaceStructure,
): ViewDomainResult<readonly TableViewColumnProjection[]> {
  const presentation = requireTablePresentation(view);
  if (!presentation.ok) return presentation;
  const supportedIds = new Set([
    "objectTypeId",
    ...structure.propertyDefinitions.map((definition) => definition.id),
  ]);
  return success(
    presentation.value.columns.map((column) => ({
      ...column,
      missing: !supportedIds.has(column.propertyId),
    })),
  );
}

export function setTableViewColumnVisibility(
  view: WorkspaceDataView,
  columnId: string,
  visible: boolean,
  nowFactory: () => string = () => new Date().toISOString(),
): ViewDomainResult<WorkspaceDataView> {
  const presentation = requireTablePresentation(view);
  if (!presentation.ok) return presentation;
  if (!presentation.value.columns.some((column) => column.id === columnId)) {
    return failure(
      "invalid-data-view",
      `Table column "${columnId}" is missing.`,
    );
  }
  return success(
    replaceTablePresentation(
      view,
      {
        ...presentation.value,
        columns: presentation.value.columns.map((column) =>
          column.id === columnId ? { ...column, visible } : column,
        ),
      },
      nowFactory,
    ),
  );
}

export function setTableViewColumnWidth(
  view: WorkspaceDataView,
  columnId: string,
  width: number,
  nowFactory: () => string = () => new Date().toISOString(),
): ViewDomainResult<WorkspaceDataView> {
  const presentation = requireTablePresentation(view);
  if (!presentation.ok) return presentation;
  if (!Number.isFinite(width) || width <= 0) {
    return failure("invalid-data-view", "Table column width must be positive.");
  }
  if (!presentation.value.columns.some((column) => column.id === columnId)) {
    return failure(
      "invalid-data-view",
      `Table column "${columnId}" is missing.`,
    );
  }
  return success(
    replaceTablePresentation(
      view,
      {
        ...presentation.value,
        columns: presentation.value.columns.map((column) =>
          column.id === columnId ? { ...column, width } : column,
        ),
      },
      nowFactory,
    ),
  );
}

export function setTableViewColumnWrapping(
  view: WorkspaceDataView,
  columnId: string,
  wrap: boolean,
  nowFactory: () => string = () => new Date().toISOString(),
): ViewDomainResult<WorkspaceDataView> {
  const presentation = requireTablePresentation(view);
  if (!presentation.ok) return presentation;
  if (!presentation.value.columns.some((column) => column.id === columnId)) {
    return failure(
      "invalid-data-view",
      `Table column "${columnId}" is missing.`,
    );
  }
  return success(
    replaceTablePresentation(
      view,
      {
        ...presentation.value,
        columns: presentation.value.columns.map((column) =>
          column.id === columnId ? { ...column, wrap } : column,
        ),
      },
      nowFactory,
    ),
  );
}

export function reorderTableViewColumns(
  view: WorkspaceDataView,
  columnIds: readonly string[],
  nowFactory: () => string = () => new Date().toISOString(),
): ViewDomainResult<WorkspaceDataView> {
  const presentation = requireTablePresentation(view);
  if (!presentation.ok) return presentation;
  const currentIds = presentation.value.columns.map((column) => column.id);
  const sameMembership =
    columnIds.length === currentIds.length &&
    currentIds.every((columnId) => columnIds.includes(columnId));
  if (!sameMembership) {
    return failure(
      "invalid-data-view",
      "Table column reorder must include each column exactly once.",
    );
  }
  const byId = new Map(
    presentation.value.columns.map((column) => [column.id, column]),
  );
  return success(
    replaceTablePresentation(
      view,
      {
        ...presentation.value,
        columns: columnIds.flatMap((columnId) => {
          const column = byId.get(columnId);
          return column ? [column] : [];
        }),
      },
      nowFactory,
    ),
  );
}

export function switchDataViewKind(
  view: WorkspaceDataView,
  kind: DataViewKind,
  nowFactory: () => string = () => new Date().toISOString(),
): WorkspaceDataView {
  if (view.presentation.kind === kind) return view;
  return {
    ...view,
    presentation: createDefaultPresentation(kind),
    updatedAt: nowFactory(),
  };
}

export function executeQueryDefinition(
  entities:
    | Pick<WorkspaceObjectState, "entities" | "trashRecords">
    | readonly WorkspaceEntity[],
  query: QueryDefinition,
): WorkspaceEntity[] {
  const search = normalizeText(query.search?.trim() ?? "");
  const filtered = selectActiveEntities(entities).filter((entity) => {
    if (!query.filters.every((filter) => matchesQueryFilter(entity, filter))) {
      return false;
    }
    if (!search) return true;
    const searchable = [
      entity.title,
      entity.objectTypeId,
      entity.kind,
      ...readEntityTags(entity),
    ]
      .map((value) => normalizeText(String(value)))
      .join(" ");
    return searchable.includes(search);
  });

  const indexed = filtered.map((entity, index) => ({ entity, index }));
  indexed.sort((left, right) => {
    for (const sort of query.sorts) {
      const comparison = compareUnknownValues(
        readWorkspaceEntityProperty(left.entity, sort.field),
        readWorkspaceEntityProperty(right.entity, sort.field),
      );
      if (comparison !== 0) {
        return sort.direction === "ascending" ? comparison : -comparison;
      }
    }
    return left.index - right.index;
  });
  const results = indexed.map(({ entity }) => entity);
  return query.limit === undefined ? results : results.slice(0, query.limit);
}

export function resolveObjectView(
  entities:
    | Pick<WorkspaceObjectState, "entities" | "trashRecords">
    | readonly WorkspaceEntity[],
  entityId: string,
  config: ObjectViewConfig,
): ObjectViewProjection {
  const entity = selectActiveEntities(entities).find(
    (candidate) => candidate.id === entityId,
  );
  return entity
    ? { config, entity, status: "ready" }
    : { config, entityId, status: "missing" };
}

function groupProjectionItems(
  items: readonly WorkspaceEntity[],
  grouping: DataViewGrouping | undefined,
): readonly DataViewProjectionGroup[] {
  if (!grouping) return [];
  const groups = new Map<string, WorkspaceEntity[]>();
  for (const item of items) {
    const rawValue = readWorkspaceEntityProperty(item, grouping.propertyId);
    const label =
      rawValue == null || rawValue === ""
        ? (grouping.emptyLabel ?? "—")
        : String(rawValue);
    const current = groups.get(label) ?? [];
    current.push(item);
    groups.set(label, current);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => {
      const comparison = left.localeCompare(right, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return grouping.direction === "ascending" ? comparison : -comparison;
    })
    .map(([label, groupItems]) => ({ id: label, items: groupItems, label }));
}

export function projectDataView(
  view: WorkspaceDataView,
  entities:
    | Pick<WorkspaceObjectState, "entities" | "trashRecords">
    | readonly WorkspaceEntity[],
): DataViewProjection {
  const items = executeQueryDefinition(entities, view.query);
  return {
    groups: groupProjectionItems(items, view.presentation.groupBy),
    items,
    view,
  };
}

function cloneTemplateBlock(
  block: ObjectTemplateBlock,
  idFactory: () => string,
): ObjectTemplateBlock {
  const id = idFactory();
  return {
    ...structuredClone(block),
    children: block.children?.map((child) =>
      cloneTemplateBlock(child, idFactory),
    ),
    id,
  };
}

export function instantiateObjectTemplate(
  template: ObjectCreationTemplate,
  idFactory: () => string = () => crypto.randomUUID(),
): InstantiatedObjectTemplate {
  return {
    blocks: template.blocks.map((block) =>
      cloneTemplateBlock(block, idFactory),
    ),
    objectId: idFactory(),
    propertyValues: structuredClone(template.propertyValues),
    structureId: template.structureId,
    title: template.title,
  };
}

const textualTypes = new Set<PropertyValueType>([
  "richText",
  "text",
  "title",
  "url",
]);
const temporalTypes = new Set<PropertyValueType>([
  "createdAt",
  "date",
  "lastUpdatedAt",
]);

export function comparePropertyDefinitions(
  source: PropertyDefinition,
  target: PropertyDefinition,
): PropertyCompatibility {
  if (!target.writable) return "incompatible";
  if (
    source.valueType === target.valueType &&
    source.multiple === target.multiple
  ) {
    return "compatible";
  }
  if (
    source.multiple === target.multiple &&
    ((textualTypes.has(source.valueType) &&
      textualTypes.has(target.valueType)) ||
      (temporalTypes.has(source.valueType) &&
        temporalTypes.has(target.valueType)))
  ) {
    return "requires-confirmation";
  }
  return "incompatible";
}

function findSuggestedTarget(
  source: PropertyDefinition,
  targets: readonly PropertyDefinition[],
): PropertyDefinition | undefined {
  const sameId = targets.find((target) => target.id === source.id);
  if (sameId) return sameId;
  const sourceName = normalizeText(source.name);
  return targets.find((target) => normalizeText(target.name) === sourceName);
}

export function createObjectConversionPlan(
  source: WorkspaceStructure,
  target: WorkspaceStructure,
  propertyValues: Readonly<Record<string, unknown>>,
): ObjectConversionPlan {
  const fields = source.propertyDefinitions
    .filter((definition) => Object.hasOwn(propertyValues, definition.id))
    .map<ConversionFieldPlan>((definition) => {
      const suggestedTarget = findSuggestedTarget(
        definition,
        target.propertyDefinitions,
      );
      if (!suggestedTarget) {
        return {
          compatibility: "incompatible",
          reason: "No matching target property exists.",
          resolution: { kind: "unresolved" },
          sourcePropertyId: definition.id,
          sourceValue: propertyValues[definition.id],
        };
      }
      const compatibility = comparePropertyDefinitions(
        definition,
        suggestedTarget,
      );
      return {
        compatibility,
        reason:
          compatibility === "compatible"
            ? "Source and target properties are compatible."
            : compatibility === "requires-confirmation"
              ? "The value requires explicit confirmation before conversion."
              : "The source value is incompatible with the target property.",
        resolution:
          compatibility === "compatible"
            ? { kind: "map", targetPropertyId: suggestedTarget.id }
            : { kind: "unresolved" },
        sourcePropertyId: definition.id,
        sourceValue: propertyValues[definition.id],
        suggestedTargetPropertyId: suggestedTarget.id,
      };
    });

  return {
    fields,
    sourceStructureId: source.id,
    targetStructureId: target.id,
  };
}

export function resolveConversionField(
  plan: ObjectConversionPlan,
  sourcePropertyId: string,
  resolution: Exclude<ConversionResolution, { readonly kind: "unresolved" }>,
  target: WorkspaceStructure,
): ViewDomainResult<ObjectConversionPlan> {
  const field = plan.fields.find(
    (candidate) => candidate.sourcePropertyId === sourcePropertyId,
  );
  if (!field) {
    return failure(
      "invalid-conversion-plan",
      `Source property "${sourcePropertyId}" is not part of the plan.`,
    );
  }
  if (
    resolution.kind === "map" &&
    !target.propertyDefinitions.some(
      (definition) => definition.id === resolution.targetPropertyId,
    )
  ) {
    return failure(
      "invalid-conversion-plan",
      `Target property "${resolution.targetPropertyId}" does not exist.`,
    );
  }
  return success({
    ...plan,
    fields: plan.fields.map((candidate) =>
      candidate.sourcePropertyId === sourcePropertyId
        ? { ...candidate, resolution }
        : candidate,
    ),
  });
}

export function canCommitObjectConversion(plan: ObjectConversionPlan): boolean {
  return plan.fields.every((field) => field.resolution.kind !== "unresolved");
}

export function commitObjectConversion(
  plan: ObjectConversionPlan,
): ViewDomainResult<CommittedObjectConversion> {
  const unresolved = plan.fields.filter(
    (field) => field.resolution.kind === "unresolved",
  );
  if (unresolved.length > 0) {
    return failure(
      "invalid-conversion-plan",
      "All incompatible or unmapped values must be resolved before conversion.",
      {
        unresolvedPropertyIds: unresolved.map(
          (field) => field.sourcePropertyId,
        ),
      },
    );
  }
  const propertyValues: Record<string, unknown> = {};
  for (const field of plan.fields) {
    if (field.resolution.kind === "map") {
      propertyValues[field.resolution.targetPropertyId] = structuredClone(
        field.sourceValue,
      );
    }
  }
  return success({
    propertyValues,
    sourceStructureId: plan.sourceStructureId,
    targetStructureId: plan.targetStructureId,
  });
}

export function createInitialWorkspaceViewState(): WorkspaceViewState {
  return { dashboards: [], dataViews: [], templates: [], version: 1 };
}

function isDashboardSection(
  value: unknown,
): value is StructureDashboardSection {
  if (!value || typeof value !== "object") return false;
  const section = value as Partial<StructureDashboardSection>;
  return (
    isNonEmptyString(section.id) &&
    Number.isInteger(section.order) &&
    isDashboardSectionSource(section.source) &&
    isNonEmptyString(section.title) &&
    typeof section.visible === "boolean"
  );
}

function isDashboard(value: unknown): value is StructureDashboard {
  if (!value || typeof value !== "object") return false;
  const dashboard = value as Partial<StructureDashboard>;
  return (
    isNonEmptyString(dashboard.structureId) &&
    isIsoDate(dashboard.updatedAt ?? "") &&
    Array.isArray(dashboard.sections) &&
    dashboard.sections.every(isDashboardSection)
  );
}

function migrateLegacyDashboardSection(
  value: unknown,
  order: number,
): {
  readonly diagnostic: DashboardMigrationDiagnostic;
  readonly section: StructureDashboardSection;
} | null {
  if (!value || typeof value !== "object") return null;
  const legacy = value as {
    readonly dataViewId?: unknown;
    readonly id?: unknown;
    readonly kind?: unknown;
    readonly limit?: unknown;
    readonly title?: unknown;
  };
  if (!isNonEmptyString(legacy.id) || !isNonEmptyString(legacy.title)) {
    return null;
  }
  const diagnosticBase = {
    sectionId: legacy.id,
  };
  if (legacy.kind === "recent") {
    const source: DashboardSectionSource = {
      builtInId: "recently-opened",
      kind: "built-in",
    };
    return {
      diagnostic: {
        ...diagnosticBase,
        code: "legacy-section-migrated",
        message:
          "Legacy recent dashboard section migrated to a built-in source.",
      },
      section: {
        id: dashboardSectionId(source),
        order,
        source,
        title: legacy.title,
        visible: true,
      },
    };
  }
  if (legacy.kind === "data-view" && isNonEmptyString(legacy.dataViewId)) {
    const source: DashboardSectionSource = {
      kind: "query",
      queryId: legacy.dataViewId,
    };
    return {
      diagnostic: {
        ...diagnosticBase,
        code: "legacy-section-migrated",
        message:
          "Legacy data-view dashboard section migrated to a query source.",
      },
      section: {
        id: dashboardSectionId(source),
        order,
        source,
        title: legacy.title,
        visible: true,
      },
    };
  }
  return {
    diagnostic: {
      ...diagnosticBase,
      code: "unknown-section-hidden",
      message: "Unknown legacy dashboard section migrated as hidden.",
    },
    section: {
      id: `dashboard-section:unknown:${legacy.id}`,
      order,
      source: { builtInId: "collections", kind: "built-in" },
      title: legacy.title,
      visible: false,
    },
  };
}

export function migrateLegacyStructureDashboard(
  value: unknown,
): ViewDomainResult<DashboardMigrationResult> {
  if (!value || typeof value !== "object") {
    return failure("invalid-dashboard", "Dashboard must be an object.");
  }
  if (isDashboard(value)) {
    return success({ dashboard: value, diagnostics: [] });
  }
  const dashboard = value as Partial<StructureDashboard>;
  if (
    !isNonEmptyString(dashboard.structureId) ||
    !isIsoDate(dashboard.updatedAt ?? "") ||
    !Array.isArray(dashboard.sections)
  ) {
    return failure("invalid-dashboard", "Dashboard is invalid.");
  }
  const updatedAt = dashboard.updatedAt as string;
  const diagnostics: DashboardMigrationDiagnostic[] = [];
  const sections: StructureDashboardSection[] = [];
  for (const [order, section] of dashboard.sections.entries()) {
    const migrated = migrateLegacyDashboardSection(section, order);
    if (!migrated) {
      return failure("invalid-dashboard", "Dashboard section is invalid.");
    }
    diagnostics.push(migrated.diagnostic);
    sections.push(migrated.section);
  }
  return success({
    dashboard: {
      sections,
      structureId: dashboard.structureId,
      updatedAt,
    },
    diagnostics,
  });
}

function isTemplateBlock(value: unknown): value is ObjectTemplateBlock {
  if (!value || typeof value !== "object") return false;
  const block = value as Partial<ObjectTemplateBlock>;
  return (
    isNonEmptyString(block.id) &&
    isNonEmptyString(block.type) &&
    (block.children === undefined ||
      (Array.isArray(block.children) && block.children.every(isTemplateBlock)))
  );
}

function isTemplate(value: unknown): value is ObjectCreationTemplate {
  if (!value || typeof value !== "object") return false;
  const template = value as Partial<ObjectCreationTemplate>;
  return (
    isNonEmptyString(template.id) &&
    isNonEmptyString(template.structureId) &&
    isNonEmptyString(template.name) &&
    typeof template.title === "string" &&
    !!template.propertyValues &&
    typeof template.propertyValues === "object" &&
    Array.isArray(template.blocks) &&
    template.blocks.every(isTemplateBlock)
  );
}

function parseSnapshotInput(value: unknown): ViewDomainResult<unknown> {
  if (typeof value !== "string") return success(value);
  try {
    return success(JSON.parse(value));
  } catch {
    return failure("invalid-snapshot", "Workspace view snapshot is not JSON.");
  }
}

function hasValidSnapshotCollections(
  snapshot: Partial<WorkspaceViewState>,
): boolean {
  return (
    snapshot.version === 1 &&
    Array.isArray(snapshot.dataViews) &&
    Array.isArray(snapshot.dashboards) &&
    Array.isArray(snapshot.templates)
  );
}

function hasValidSnapshotRecords(snapshot: WorkspaceViewState): boolean {
  return (
    snapshot.dashboards.every(
      (dashboard) => migrateLegacyStructureDashboard(dashboard).ok,
    ) && snapshot.templates.every(isTemplate)
  );
}

function validateSnapshotDataViews(
  views: readonly WorkspaceDataView[],
): ViewDomainResult<readonly WorkspaceDataView[]> {
  for (const view of views) {
    const validated = validateDataView(view);
    if (!validated.ok) {
      return failure("invalid-snapshot", validated.error.message, {
        cause: validated.error.code,
      });
    }
  }
  return success(views);
}

export function parseWorkspaceViewState(
  value: unknown,
): ViewDomainResult<WorkspaceViewState> {
  const input = parseSnapshotInput(value);
  if (!input.ok) return input;
  if (!input.value || typeof input.value !== "object") {
    return failure(
      "invalid-snapshot",
      "Workspace view snapshot must be an object.",
    );
  }
  const candidate = input.value as Partial<WorkspaceViewState>;
  if (!hasValidSnapshotCollections(candidate)) {
    return failure("invalid-snapshot", "Workspace view snapshot is invalid.");
  }
  const snapshot = candidate as WorkspaceViewState;
  if (!hasValidSnapshotRecords(snapshot)) {
    return failure("invalid-snapshot", "Workspace view snapshot is invalid.");
  }
  const dataViews = validateSnapshotDataViews(snapshot.dataViews);
  if (!dataViews.ok) return dataViews;
  const dashboards = snapshot.dashboards.map((dashboard) => {
    const migrated = migrateLegacyStructureDashboard(dashboard);
    if (!migrated.ok) throw new TypeError(migrated.error.message);
    return migrated.value.dashboard;
  });
  return success({ ...snapshot, dashboards });
}

export function serializeWorkspaceViewState(state: WorkspaceViewState): string {
  const validated = parseWorkspaceViewState(state);
  if (!validated.ok) {
    throw new TypeError(validated.error.message);
  }
  return JSON.stringify(validated.value);
}
