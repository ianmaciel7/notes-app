import type { BlockEditorNode } from "../editor/document.ts";
import type { WorkspaceObjectLinkIndex } from "./workspace-object-links.ts";
import type { WorkspaceEntity } from "./workspace-objects.ts";
import { readWorkspacePropertyValue } from "./workspace-property-values.ts";

type QuerySourceKind = "object-type" | "search" | "tag" | "variable";
type QueryResultKind = "block" | "object";
type QuerySortDirection = "ascending" | "descending";
type QueryGroupOperator = "all" | "any";
type QueryScalar = boolean | number | string | null;

type QueryVariableReference = {
  readonly kind: "variable";
  readonly name: string;
};

type QueryValue = QueryScalar | readonly QueryScalar[] | QueryVariableReference;

type QueryPropertyOperator =
  | "after"
  | "before"
  | "contains"
  | "equals"
  | "exists"
  | "greater-than"
  | "in"
  | "less-than"
  | "not-equals"
  | "starts-with";

type QueryPropertyFilter = {
  readonly kind: "property";
  readonly operator: QueryPropertyOperator;
  readonly propertyId: string;
  readonly value?: QueryValue;
};

type QueryStructureFilter = {
  readonly kind: "structure";
  readonly operator: "is-any-of" | "is-none-of";
  readonly structureIds: readonly string[];
};

type QueryRelationFilter = {
  readonly kind: "relation";
  readonly operator: "contains" | "does-not-contain";
  readonly propertyId: string;
  readonly target: QueryValue;
};

type QueryBacklinkFilter = {
  readonly kind: "backlink";
  readonly operator: "contains" | "does-not-contain";
  readonly target: QueryValue;
};

type QueryContentLinkFilter = {
  readonly kind: "content-link";
  readonly operator: "contains" | "does-not-contain";
  readonly target: QueryValue;
};

type QueryTextFilter = {
  readonly kind: "text";
  readonly operator: "contains" | "equals" | "starts-with";
  readonly value: QueryValue;
};

type QueryFilter =
  | QueryBacklinkFilter
  | QueryContentLinkFilter
  | QueryPropertyFilter
  | QueryRelationFilter
  | QueryStructureFilter
  | QueryTextFilter;

type QueryFilterGroup = {
  readonly filters: readonly (QueryFilter | QueryFilterGroup)[];
  readonly operator: QueryGroupOperator;
};

type QuerySort = {
  readonly direction: QuerySortDirection;
  readonly propertyId: string;
};

type QueryGrouping = {
  readonly propertyId: string;
};

type QuerySelectionMode =
  | { readonly mode: "all" }
  | { readonly count: number; readonly mode: "random"; readonly seed: string };

type QueryVariableDefinition =
  | { readonly kind: "host-object" }
  | { readonly kind: "host-property"; readonly propertyId: string }
  | {
      readonly kind: "literal";
      readonly value: QueryScalar | readonly QueryScalar[];
    };

type QueryDefinition = {
  readonly filters: QueryFilterGroup;
  readonly grouping?: QueryGrouping;
  readonly limit?: number;
  readonly resultKind: QueryResultKind;
  readonly selection: QuerySelectionMode;
  readonly sorts: readonly QuerySort[];
  readonly source: QuerySourceKind;
  readonly sourceValue?: string;
  readonly variables: Readonly<Record<string, QueryVariableDefinition>>;
  readonly version: 1;
};

type QueryEvaluationContext = {
  readonly hostObjectId?: string;
  readonly linkIndex?: WorkspaceObjectLinkIndex;
};

type ResolvedQueryVariables = Readonly<
  Record<string, QueryScalar | readonly QueryScalar[]>
>;

type QueryEvaluationResult =
  | {
      readonly groups: ReadonlyMap<string, readonly WorkspaceEntity[]>;
      readonly items: readonly WorkspaceEntity[];
      readonly status: "ready";
      readonly variables: ResolvedQueryVariables;
    }
  | {
      readonly missingVariables: readonly string[];
      readonly status: "unresolved";
    };

type QueryDependencies = {
  readonly needsBacklinks: boolean;
  readonly needsContentLinks: boolean;
  readonly propertyIds: readonly string[];
  readonly structureIds: readonly string[];
  readonly variableNames: readonly string[];
};

type QueryValidationResult =
  | { readonly ok: true; readonly value: QueryDefinition }
  | { readonly error: string; readonly ok: false };

type SearchIndexObjectEntry = {
  readonly aliases: readonly string[];
  readonly entityId: string;
  readonly searchableText: string;
  readonly title: string;
};

type SearchIndexBlockEntry = {
  readonly blockId: string;
  readonly entityId: string;
  readonly text: string;
};

type WorkspaceSearchIndex = {
  readonly blocks: readonly SearchIndexBlockEntry[];
  readonly objects: readonly SearchIndexObjectEntry[];
};

type WorkspaceSearchResult =
  | {
      readonly blockId: string;
      readonly entityId: string;
      readonly kind: "block";
      readonly score: number;
      readonly text: string;
    }
  | {
      readonly entityId: string;
      readonly kind: "object";
      readonly score: number;
      readonly title: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();
}

function isVariableReference(
  value: QueryValue | undefined,
): value is QueryVariableReference {
  return (
    isRecord(value) && value.kind === "variable" && isNonEmptyString(value.name)
  );
}

function readEntityProperty(
  entity: WorkspaceEntity,
  propertyId: string,
): unknown {
  if (propertyId === "id") return entity.id;
  if (propertyId === "title") return entity.title;
  if (propertyId === "createdAt") return entity.createdAt;
  if (propertyId === "kind") return entity.kind;
  if (propertyId === "objectTypeId") return entity.objectTypeId;
  if (propertyId === "tags" && "tags" in entity) return entity.tags;
  if (propertyId === "collections" && "collections" in entity) {
    return entity.collections;
  }
  const value = entity.propertyValues[propertyId];
  return value ? readWorkspacePropertyValue(value) : undefined;
}

function resolveQueryValue(
  value: QueryValue | undefined,
  variables: ResolvedQueryVariables,
): QueryScalar | readonly QueryScalar[] | undefined {
  return isVariableReference(value) ? variables[value.name] : value;
}

function toComparable(
  value: unknown,
): string | number | boolean | null | undefined {
  if (value === null || value === undefined) return value;
  if (typeof value === "number" || typeof value === "boolean") return value;
  return typeof value === "string" ? value : undefined;
}

function valuesEqual(left: unknown, right: unknown): boolean {
  const leftComparable = toComparable(left);
  const rightComparable = toComparable(right);
  if (
    typeof leftComparable === "string" &&
    typeof rightComparable === "string"
  ) {
    return normalizeSearchText(leftComparable) === normalizeSearchText(rightComparable);
  }
  return leftComparable === rightComparable;
}

function valueContains(actual: unknown, expected: unknown): boolean {
  if (Array.isArray(actual)) {
    return actual.some((item) => valuesEqual(item, expected));
  }
  if (typeof actual !== "string" || typeof expected !== "string") {
    return false;
  }
  return normalizeSearchText(actual).includes(normalizeSearchText(expected));
}

function matchesTextOperation(
  actual: unknown,
  expected: unknown,
  operator: "contains" | "equals" | "starts-with",
): boolean {
  if (operator === "equals") return valuesEqual(actual, expected);
  if (operator === "contains") return valueContains(actual, expected);
  return typeof actual === "string" && typeof expected === "string"
    ? normalizeSearchText(actual).startsWith(normalizeSearchText(expected))
    : false;
}

function matchesDateOperation(
  actual: unknown,
  expected: unknown,
  operator: "after" | "before",
): boolean {
  const left = typeof actual === "string" ? Date.parse(actual) : Number.NaN;
  const right =
    typeof expected === "string" ? Date.parse(expected) : Number.NaN;
  if (!Number.isFinite(left) || !Number.isFinite(right)) return false;
  return operator === "before" ? left < right : left > right;
}

function matchesNumberOperation(
  actual: unknown,
  expected: unknown,
  operator: "greater-than" | "less-than",
): boolean {
  if (typeof actual !== "number" || typeof expected !== "number") return false;
  return operator === "less-than" ? actual < expected : actual > expected;
}

function matchesPropertyFilter(
  entity: WorkspaceEntity,
  filter: QueryPropertyFilter,
  variables: ResolvedQueryVariables,
): boolean {
  const actual = readEntityProperty(entity, filter.propertyId);
  const expected = resolveQueryValue(filter.value, variables);
  switch (filter.operator) {
    case "exists":
      return actual !== undefined && actual !== null;
    case "equals":
    case "contains":
    case "starts-with":
      return matchesTextOperation(actual, expected, filter.operator);
    case "not-equals":
      return !valuesEqual(actual, expected);
    case "in":
      return (
        Array.isArray(expected) &&
        expected.some((item) => valuesEqual(actual, item))
      );
    case "before":
    case "after":
      return matchesDateOperation(actual, expected, filter.operator);
    case "less-than":
    case "greater-than":
      return matchesNumberOperation(actual, expected, filter.operator);
  }
}

function matchesStructureFilter(
  entity: WorkspaceEntity,
  filter: QueryStructureFilter,
): boolean {
  const contains = filter.structureIds.includes(entity.objectTypeId);
  return filter.operator === "is-any-of" ? contains : !contains;
}

function relationTargets(
  entity: WorkspaceEntity,
  propertyId: string,
): readonly string[] {
  const record = entity.propertyValues[propertyId];
  if (record?.type !== "entity") return [];
  return record.entity.map((target) => target.id);
}

function expectedTargetIds(
  value: QueryValue,
  variables: ResolvedQueryVariables,
): readonly string[] {
  const resolved = resolveQueryValue(value, variables);
  if (Array.isArray(resolved)) {
    return resolved.filter((item): item is string => typeof item === "string");
  }
  return typeof resolved === "string" ? [resolved] : [];
}

function matchesRelationFilter(
  entity: WorkspaceEntity,
  filter: QueryRelationFilter,
  variables: ResolvedQueryVariables,
): boolean {
  const targets = relationTargets(entity, filter.propertyId);
  const expected = expectedTargetIds(filter.target, variables);
  const contains = expected.some((target) => targets.includes(target));
  return filter.operator === "contains" ? contains : !contains;
}

function contentTargets(
  linkIndex: WorkspaceObjectLinkIndex | undefined,
  sourceId: string,
): readonly string[] {
  return (linkIndex?.forwardBySourceId.get(sourceId) ?? []).map(
    (link) => link.targetId,
  );
}

function backlinkSources(
  linkIndex: WorkspaceObjectLinkIndex | undefined,
  targetId: string,
): readonly string[] {
  return (linkIndex?.backlinksByTargetId.get(targetId) ?? []).map(
    (link) => link.sourceId,
  );
}

function matchesReferenceFilter(
  entity: WorkspaceEntity,
  filter: QueryBacklinkFilter | QueryContentLinkFilter,
  variables: ResolvedQueryVariables,
  linkIndex: WorkspaceObjectLinkIndex | undefined,
): boolean {
  const expected = expectedTargetIds(filter.target, variables);
  const references =
    filter.kind === "backlink"
      ? backlinkSources(linkIndex, entity.id)
      : contentTargets(linkIndex, entity.id);
  const contains = expected.some((target) => references.includes(target));
  return filter.operator === "contains" ? contains : !contains;
}

function matchesTextFilter(
  entity: WorkspaceEntity,
  filter: QueryTextFilter,
  variables: ResolvedQueryVariables,
): boolean {
  return matchesTextOperation(
    entity.title,
    resolveQueryValue(filter.value, variables),
    filter.operator,
  );
}

function matchesFilter(
  entity: WorkspaceEntity,
  filter: QueryFilter,
  variables: ResolvedQueryVariables,
  linkIndex: WorkspaceObjectLinkIndex | undefined,
): boolean {
  if (filter.kind === "property") {
    return matchesPropertyFilter(entity, filter, variables);
  }
  if (filter.kind === "structure") return matchesStructureFilter(entity, filter);
  if (filter.kind === "relation") {
    return matchesRelationFilter(entity, filter, variables);
  }
  if (filter.kind === "backlink" || filter.kind === "content-link") {
    return matchesReferenceFilter(entity, filter, variables, linkIndex);
  }
  return matchesTextFilter(entity, filter, variables);
}

function matchesFilterGroup(
  entity: WorkspaceEntity,
  group: QueryFilterGroup,
  variables: ResolvedQueryVariables,
  linkIndex: WorkspaceObjectLinkIndex | undefined,
): boolean {
  const matches = (filter: QueryFilter | QueryFilterGroup) =>
    "filters" in filter
      ? matchesFilterGroup(entity, filter, variables, linkIndex)
      : matchesFilter(entity, filter, variables, linkIndex);
  return group.operator === "all"
    ? group.filters.every(matches)
    : group.filters.some(matches);
}

function resolveVariable(
  definition: QueryVariableDefinition,
  entitiesById: ReadonlyMap<string, WorkspaceEntity>,
  context: QueryEvaluationContext,
): QueryScalar | readonly QueryScalar[] | undefined {
  if (definition.kind === "literal") return definition.value;
  if (!context.hostObjectId) return undefined;
  if (definition.kind === "host-object") return context.hostObjectId;
  const host = entitiesById.get(context.hostObjectId);
  const value = host
    ? readEntityProperty(host, definition.propertyId)
    : undefined;
  if (Array.isArray(value)) {
    return value.filter((item): item is QueryScalar =>
      item === null || ["boolean", "number", "string"].includes(typeof item),
    );
  }
  return toComparable(value);
}

function resolveVariables(
  query: QueryDefinition,
  entities: readonly WorkspaceEntity[],
  context: QueryEvaluationContext,
): { missing: string[]; values: ResolvedQueryVariables } {
  const entitiesById = new Map(entities.map((entity) => [entity.id, entity]));
  const values: Record<string, QueryScalar | readonly QueryScalar[]> = {};
  const missing: string[] = [];
  for (const [name, definition] of Object.entries(query.variables)) {
    const value = resolveVariable(definition, entitiesById, context);
    if (value === undefined) missing.push(name);
    else values[name] = value;
  }
  return { missing, values };
}

function applySourceFamily(
  entities: readonly WorkspaceEntity[],
  query: QueryDefinition,
  variables: ResolvedQueryVariables,
): WorkspaceEntity[] {
  if (!query.sourceValue) return [...entities];
  if (query.source === "object-type") {
    return entities.filter((entity) => entity.objectTypeId === query.sourceValue);
  }
  if (query.source === "tag") {
    return entities.filter(
      (entity) => "tags" in entity && entity.tags.includes(query.sourceValue as string),
    );
  }
  const requestedValue =
    query.source === "variable"
      ? ({ kind: "variable", name: query.sourceValue } as const)
      : query.sourceValue;
  const sourceValue = resolveQueryValue(requestedValue, variables);
  if (typeof sourceValue !== "string") return [];
  const normalized = normalizeSearchText(sourceValue);
  return entities.filter((entity) =>
    normalizeSearchText(entity.title).includes(normalized),
  );
}

function compareQuerySort(
  left: WorkspaceEntity,
  right: WorkspaceEntity,
  sort: QuerySort,
): number {
  const leftValue = readEntityProperty(left, sort.propertyId);
  const rightValue = readEntityProperty(right, sort.propertyId);
  const direction = sort.direction === "ascending" ? 1 : -1;
  if (leftValue == null && rightValue == null) return 0;
  if (leftValue == null) return direction;
  if (rightValue == null) return -direction;
  if (typeof leftValue === "number" && typeof rightValue === "number") {
    return (leftValue - rightValue) * direction;
  }
  return (
    String(leftValue).localeCompare(String(rightValue), undefined, {
      numeric: true,
      sensitivity: "base",
    }) * direction
  );
}

function sortQueryItems(
  items: readonly WorkspaceEntity[],
  sorts: readonly QuerySort[],
): WorkspaceEntity[] {
  if (sorts.length === 0) return [...items];
  return [...items].sort((left, right) => {
    for (const sort of sorts) {
      const comparison = compareQuerySort(left, right, sort);
      if (comparison !== 0) return comparison;
    }
    return left.id.localeCompare(right.id);
  });
}

function seededNumber(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function applySelection(
  items: readonly WorkspaceEntity[],
  selection: QuerySelectionMode,
): WorkspaceEntity[] {
  if (selection.mode === "all") return [...items];
  return [...items]
    .map((item) => ({
      item,
      score: seededNumber(`${selection.seed}:${item.id}`),
    }))
    .sort(
      (left, right) =>
        left.score - right.score || left.item.id.localeCompare(right.item.id),
    )
    .slice(0, selection.count)
    .map(({ item }) => item);
}

function groupQueryItems(
  items: readonly WorkspaceEntity[],
  grouping: QueryGrouping | undefined,
): ReadonlyMap<string, readonly WorkspaceEntity[]> {
  const groups = new Map<string, WorkspaceEntity[]>();
  if (!grouping) return groups;
  for (const item of items) {
    const value = readEntityProperty(item, grouping.propertyId);
    const key = value == null ? "" : String(value);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return groups;
}

function evaluateQuery(
  query: QueryDefinition,
  entities: readonly WorkspaceEntity[],
  context: QueryEvaluationContext = {},
): QueryEvaluationResult {
  const resolved = resolveVariables(query, entities, context);
  if (resolved.missing.length > 0) {
    return { missingVariables: resolved.missing, status: "unresolved" };
  }
  const sourced = applySourceFamily(entities, query, resolved.values);
  const filtered = sourced.filter((entity) =>
    matchesFilterGroup(
      entity,
      query.filters,
      resolved.values,
      context.linkIndex,
    ),
  );
  const sorted = sortQueryItems(filtered, query.sorts);
  const selected = applySelection(sorted, query.selection);
  const items =
    query.limit === undefined ? selected : selected.slice(0, query.limit);
  return {
    groups: groupQueryItems(items, query.grouping),
    items,
    status: "ready",
    variables: resolved.values,
  };
}

function textFromNode(node: BlockEditorNode): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  return (node.content ?? []).map(textFromNode).join("");
}

function collectBlockEntries(
  entityId: string,
  nodes: readonly BlockEditorNode[],
  output: SearchIndexBlockEntry[],
): void {
  for (const node of nodes) {
    const blockId = typeof node.attrs?.id === "string" ? node.attrs.id : null;
    if (blockId) {
      const text = textFromNode(node).trim();
      if (text) output.push({ blockId, entityId, text });
    }
    if (node.content) collectBlockEntries(entityId, node.content, output);
  }
}

function searchablePropertyText(entity: WorkspaceEntity): string {
  const values: string[] = [];
  for (const value of Object.values(entity.propertyValues)) {
    const readable = readWorkspacePropertyValue(value);
    if (typeof readable === "string") values.push(readable);
    if (Array.isArray(readable)) {
      values.push(
        ...readable.filter((item): item is string => typeof item === "string"),
      );
    }
  }
  return values.join(" ");
}

function buildWorkspaceSearchIndex(
  entities: readonly WorkspaceEntity[],
): WorkspaceSearchIndex {
  const blocks: SearchIndexBlockEntry[] = [];
  const objects = entities.map((entity): SearchIndexObjectEntry => {
    const aliases =
      "aliases" in entity && Array.isArray(entity.aliases) ? entity.aliases : [];
    if (entity.kind === "document" || entity.kind === "quote") {
      collectBlockEntries(entity.id, entity.body.doc.content, blocks);
    }
    return {
      aliases,
      entityId: entity.id,
      searchableText: [
        entity.title,
        ...aliases,
        searchablePropertyText(entity),
      ].join(" "),
      title: entity.title,
    };
  });
  return { blocks, objects };
}

function scoreSearchText(text: string, query: string): number {
  const normalizedText = normalizeSearchText(text);
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery || !normalizedText.includes(normalizedQuery)) return 0;
  if (normalizedText === normalizedQuery) return 100;
  return normalizedText.startsWith(normalizedQuery) ? 75 : 50;
}

function searchWorkspaceIndex(
  index: WorkspaceSearchIndex,
  query: string,
  resultKind: "all" | QueryResultKind = "all",
): WorkspaceSearchResult[] {
  const results: WorkspaceSearchResult[] = [];
  if (resultKind !== "block") {
    for (const object of index.objects) {
      const score = scoreSearchText(object.searchableText, query);
      if (score > 0) {
        results.push({
          entityId: object.entityId,
          kind: "object",
          score,
          title: object.title,
        });
      }
    }
  }
  if (resultKind !== "object") {
    for (const block of index.blocks) {
      const score = scoreSearchText(block.text, query);
      if (score > 0) results.push({ ...block, kind: "block", score });
    }
  }
  return results.sort(
    (left, right) =>
      right.score - left.score || left.entityId.localeCompare(right.entityId),
  );
}

function updateWorkspaceSearchIndex(
  index: WorkspaceSearchIndex,
  entity: WorkspaceEntity,
): WorkspaceSearchIndex {
  const rebuilt = buildWorkspaceSearchIndex([entity]);
  return {
    blocks: [
      ...index.blocks.filter((item) => item.entityId !== entity.id),
      ...rebuilt.blocks,
    ],
    objects: [
      ...index.objects.filter((item) => item.entityId !== entity.id),
      ...rebuilt.objects,
    ],
  };
}

function queryDefinitionFromLegacy(legacy: {
  readonly filters?: { readonly tags?: readonly string[] };
  readonly objectTypeId?: string | null;
  readonly search?: string;
}): QueryDefinition {
  const filters: QueryFilter[] = [];
  if (legacy.objectTypeId) {
    filters.push({
      kind: "structure",
      operator: "is-any-of",
      structureIds: [legacy.objectTypeId],
    });
  }
  for (const tag of legacy.filters?.tags ?? []) {
    filters.push({
      kind: "property",
      operator: "contains",
      propertyId: "tags",
      value: tag,
    });
  }
  if (legacy.search) {
    filters.push({ kind: "text", operator: "contains", value: legacy.search });
  }
  return {
    filters: { filters, operator: "all" },
    resultKind: "object",
    selection: { mode: "all" },
    sorts: [{ direction: "descending", propertyId: "createdAt" }],
    source: "search",
    variables: {},
    version: 1,
  };
}

const sourceKinds = new Set<QuerySourceKind>([
  "object-type",
  "search",
  "tag",
  "variable",
]);
const resultKinds = new Set<QueryResultKind>(["block", "object"]);

function isFilterGroup(value: unknown): value is QueryFilterGroup {
  if (!isRecord(value)) return false;
  if (value.operator !== "all" && value.operator !== "any") return false;
  if (!Array.isArray(value.filters)) return false;
  return value.filters.every((filter) => {
    if (!isRecord(filter)) return false;
    return "filters" in filter ? isFilterGroup(filter) : isNonEmptyString(filter.kind);
  });
}

function hasValidSelection(value: unknown): value is QuerySelectionMode {
  if (!isRecord(value)) return false;
  if (value.mode === "all") return true;
  return (
    value.mode === "random" &&
    Number.isInteger(value.count) &&
    Number(value.count) > 0 &&
    isNonEmptyString(value.seed)
  );
}

function hasValidSorts(value: unknown): value is readonly QuerySort[] {
  return (
    Array.isArray(value) &&
    value.every(
      (sort) =>
        isRecord(sort) &&
        isNonEmptyString(sort.propertyId) &&
        (sort.direction === "ascending" || sort.direction === "descending"),
    )
  );
}

function validateQueryDefinition(value: unknown): QueryValidationResult {
  if (!isRecord(value) || value.version !== 1) {
    return { error: "QueryDefinition must use version 1.", ok: false };
  }
  if (!sourceKinds.has(value.source as QuerySourceKind)) {
    return { error: "Query source is invalid.", ok: false };
  }
  if (!resultKinds.has(value.resultKind as QueryResultKind)) {
    return { error: "Query result kind is invalid.", ok: false };
  }
  if (!isFilterGroup(value.filters) || !hasValidSorts(value.sorts)) {
    return { error: "Query filters or sorts are invalid.", ok: false };
  }
  if (!hasValidSelection(value.selection) || !isRecord(value.variables)) {
    return { error: "Query selection or variables are invalid.", ok: false };
  }
  if (
    value.limit !== undefined &&
    (!Number.isInteger(value.limit) || Number(value.limit) <= 0)
  ) {
    return { error: "Query limit must be a positive integer.", ok: false };
  }
  return { ok: true, value: value as QueryDefinition };
}

function collectFilterDependencies(
  group: QueryFilterGroup,
  properties: Set<string>,
  variableNames: Set<string>,
): { needsBacklinks: boolean; needsContentLinks: boolean } {
  let needsBacklinks = false;
  let needsContentLinks = false;
  for (const filter of group.filters) {
    if ("filters" in filter) {
      const nested = collectFilterDependencies(filter, properties, variableNames);
      needsBacklinks ||= nested.needsBacklinks;
      needsContentLinks ||= nested.needsContentLinks;
      continue;
    }
    if (filter.kind === "property" || filter.kind === "relation") {
      properties.add(filter.propertyId);
    }
    if (filter.kind === "backlink") needsBacklinks = true;
    if (filter.kind === "content-link") needsContentLinks = true;
    const value = "target" in filter ? filter.target : "value" in filter ? filter.value : undefined;
    if (isVariableReference(value)) variableNames.add(value.name);
  }
  return { needsBacklinks, needsContentLinks };
}

function collectQueryDependencies(query: QueryDefinition): QueryDependencies {
  const propertyIds = new Set<string>();
  const variableNames = new Set(Object.keys(query.variables));
  const structureIds = new Set<string>();
  for (const sort of query.sorts) propertyIds.add(sort.propertyId);
  if (query.grouping) propertyIds.add(query.grouping.propertyId);
  if (query.source === "object-type" && query.sourceValue) {
    structureIds.add(query.sourceValue);
  }
  const references = collectFilterDependencies(
    query.filters,
    propertyIds,
    variableNames,
  );
  const collectStructures = (group: QueryFilterGroup): void => {
    for (const filter of group.filters) {
      if ("filters" in filter) collectStructures(filter);
      else if (filter.kind === "structure") {
        for (const id of filter.structureIds) structureIds.add(id);
      }
    }
  };
  collectStructures(query.filters);
  return {
    ...references,
    propertyIds: [...propertyIds].sort(),
    structureIds: [...structureIds].sort(),
    variableNames: [...variableNames].sort(),
  };
}

export type {
  QueryDefinition,
  QueryDependencies,
  QueryEvaluationContext,
  QueryEvaluationResult,
  QueryFilter,
  QueryFilterGroup,
  QueryGrouping,
  QueryResultKind,
  QuerySelectionMode,
  QuerySort,
  QuerySourceKind,
  QueryVariableDefinition,
  WorkspaceSearchIndex,
  WorkspaceSearchResult,
};
export {
  buildWorkspaceSearchIndex,
  collectQueryDependencies,
  evaluateQuery,
  queryDefinitionFromLegacy,
  searchWorkspaceIndex,
  updateWorkspaceSearchIndex,
  validateQueryDefinition,
};
