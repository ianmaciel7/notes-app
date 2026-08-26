import {
  blockEditorDocumentFromPlainText,
  isBlockEditorDocument,
  normalizeBlockEditorDocument,
} from "../editor/document.ts";
import {
  createCollectionId,
  createTagId,
} from "./workspace-domain-identities.ts";
import {
  createLegacyStructureDefinitions,
  createInitialStructureRegistry,
  validateStructureRegistry,
  type WorkspaceStructure,
} from "./workspace-object-types.ts";
import {
  createInitialWorkspaceObjectState,
  WORKSPACE_OBJECT_SCHEMA_VERSION,
  type WorkspaceEntity,
  type WorkspaceObjectState,
} from "./workspace-objects.ts";
import {
  createWorkspaceEntityPropertyValues,
  normalizeWorkspacePropertyValueMap,
} from "./workspace-property-values.ts";
import { reconcileRequiredStructures } from "./workspace-structure-reconciliation.ts";

const WORKSPACE_OBJECT_STORAGE_KEY = "notes-app:workspace-objects:v1";

type WorkspaceObjectSnapshot = {
  activeEntityId: string | null;
  entities: WorkspaceEntity[];
  nextId: number;
  structures: readonly WorkspaceStructure[];
  version: typeof WORKSPACE_OBJECT_SCHEMA_VERSION;
};

type SnapshotParseResult =
  | {
      ok: false;
      reason: "invalid-json" | "invalid-record" | "unsupported-version";
    }
  | { ok: true; state: WorkspaceObjectState };
type SnapshotParseFailure = Extract<SnapshotParseResult, { ok: false }>;
type EntityMigrationResult<T> = SnapshotParseFailure | { ok: true; entities: T };
type SnapshotMigrationResult =
  | SnapshotParseFailure
  | { ok: true; value: Record<string, unknown> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function hasEntityBase(value: Record<string, unknown>): boolean {
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.objectTypeId === "string" &&
    value.objectTypeId.trim().length > 0 &&
    typeof value.kind === "string"
  );
}

function isTableCell(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.column === "number" &&
    typeof value.row === "number" &&
    typeof value.value === "string"
  );
}

const entityValidators: Record<
  string,
  (value: Record<string, unknown>) => boolean
> = {
  document: (value) =>
    isBlockEditorDocument(value.body) &&
    isStringArray(value.collections) &&
    isStringArray(value.tags),
  quote: (value) =>
    isBlockEditorDocument(value.body) &&
    isStringArray(value.collections) &&
    isStringArray(value.tags),
  table: (value) =>
    typeof value.notes === "string" &&
    Array.isArray(value.cells) &&
    value.cells.every(isTableCell),
  task: (value) =>
    typeof value.body === "string" &&
    typeof value.completed === "boolean" &&
    (value.dueDate === null || typeof value.dueDate === "string"),
  url: (value) =>
    typeof value.body === "string" && typeof value.url === "string",
  tag: (value) => value.objectTypeId === "tag",
  query: (value) =>
    typeof value.description === "string" &&
    isRecord(value.filters) &&
    isStringArray(value.filters.tags),
  file: (value) =>
    typeof value.fileName === "string" &&
    typeof value.mimeType === "string" &&
    typeof value.size === "number",
};

function isWorkspaceEntity(value: unknown): value is WorkspaceEntity {
  if (!isRecord(value) || !hasEntityBase(value)) return false;
  return entityValidators[value.kind as string]?.(value) ?? false;
}

function migrateLegacyIdentityMemberships(
  entities: readonly WorkspaceEntity[],
): WorkspaceEntity[] {
  const usedTagIds = new Set(
    entities
      .filter((entity) => entity.kind === "tag")
      .map((entity) => entity.id),
  );
  const tagIdByName = new Map(
    entities
      .filter((entity) => entity.kind === "tag")
      .map((entity) => [entity.title.trim(), entity.id]),
  );
  return entities.map((entity) => {
    if (
      (entity.kind === "document" || entity.kind === "quote") &&
      "tags" in entity &&
      "collections" in entity
    ) {
      return {
        ...entity,
        collections: entity.collections.map((collection) =>
          createCollectionId(entity.objectTypeId, collection),
        ),
        tags: entity.tags.map(
          (tag) => tagIdByName.get(tag.trim()) ?? createTagId(tag, usedTagIds),
        ),
      };
    }
    return entity;
  });
}

function migrateStructuredEntityBodies(
  entities: readonly unknown[],
): EntityMigrationResult<unknown[]> {
  const migratedEntities: unknown[] = [];
  for (const entity of entities) {
    if (!isRecord(entity)) return { ok: false, reason: "invalid-record" };
    if (entity.kind !== "document" && entity.kind !== "quote") {
      migratedEntities.push(entity);
      continue;
    }
    if (typeof entity.id !== "string") {
      return { ok: false, reason: "invalid-record" };
    }
    const body = normalizeBlockEditorDocument(entity.body, entity.id);
    if (!body) return { ok: false, reason: "invalid-record" };
    migratedEntities.push({ ...entity, body });
  }
  return { entities: migratedEntities, ok: true };
}

const entityKindByLifecycle = {
  document: "document",
  file: "file",
  query: "query",
  quote: "quote",
  table: "table",
  tag: "tag",
  task: "task",
  url: "url",
} as const;

function entitiesReferenceValidStructures(
  entities: readonly WorkspaceEntity[],
  structures: readonly WorkspaceStructure[],
): boolean {
  const structuresById = new Map(
    structures.map((structure) => [structure.id, structure]),
  );
  return entities.every((entity) => {
    const structure = structuresById.get(entity.objectTypeId);
    return (
      structure !== undefined &&
      entityKindByLifecycle[structure.lifecycleKind] === entity.kind
    );
  });
}

function toWorkspaceObjectSnapshot(
  state: WorkspaceObjectState,
): WorkspaceObjectSnapshot {
  return {
    activeEntityId: state.activeEntityId,
    entities: state.entities.map((entity) => {
      if (entity.kind !== "file") return entity;
      const { previewUrl: _previewUrl, ...persisted } = entity;
      return persisted;
    }) as WorkspaceEntity[],
    nextId: state.nextId,
    structures: structuredClone(state.structures),
    version: WORKSPACE_OBJECT_SCHEMA_VERSION,
  };
}

function serializeWorkspaceObjectState(state: WorkspaceObjectState): string {
  return JSON.stringify(toWorkspaceObjectSnapshot(state));
}

function parseSnapshotJson(raw: string): SnapshotMigrationResult {
  try {
    const value: unknown = JSON.parse(raw);
    return isRecord(value)
      ? { ok: true, value }
      : { ok: false, reason: "invalid-record" };
  } catch {
    return { ok: false, reason: "invalid-json" };
  }
}

function migratePlainTextEntityBodies(
  entities: readonly unknown[],
): EntityMigrationResult<unknown[]> {
  const migratedEntities: unknown[] = [];
  for (const entity of entities) {
    if (!isRecord(entity)) return { ok: false, reason: "invalid-record" };
    if (entity.kind === "document" || entity.kind === "quote") {
      if (typeof entity.body !== "string") {
        return { ok: false, reason: "invalid-record" };
      }
      migratedEntities.push({
        ...entity,
        body: blockEditorDocumentFromPlainText(entity.body),
      });
    } else {
      migratedEntities.push(entity);
    }
  }
  return { entities: migratedEntities, ok: true };
}

function createStructureRegistryForEntityReferences(
  entities: readonly unknown[],
): EntityMigrationResult<readonly WorkspaceStructure[]> {
  const referencedStructureIds: string[] = [];
  for (const entity of entities) {
    if (
      !isRecord(entity) ||
      typeof entity.objectTypeId !== "string" ||
      entity.objectTypeId.trim().length === 0
    ) {
      return { ok: false, reason: "invalid-record" };
    }
    const structureId = entity.objectTypeId.trim();
    if (!referencedStructureIds.includes(structureId)) {
      referencedStructureIds.push(structureId);
    }
  }

  const base = createInitialStructureRegistry();
  const baseIds = new Set(base.map((structure) => structure.id));
  const legacy = createLegacyStructureDefinitions(referencedStructureIds);
  if (!legacy.ok) return { ok: false, reason: "invalid-record" };

  return {
    entities: [
      ...base,
      ...legacy.value.filter((structure) => !baseIds.has(structure.id)),
    ],
    ok: true,
  };
}

function migrateVersionOneSnapshot(
  value: Record<string, unknown>,
): SnapshotMigrationResult {
  if (!Array.isArray(value.entities)) {
    return { ok: false, reason: "invalid-record" };
  }
  const migration = migratePlainTextEntityBodies(value.entities);
  if (!migration.ok) return migration;
  const structures = createStructureRegistryForEntityReferences(
    migration.entities,
  );
  if (!structures.ok) return structures;
  return {
    ok: true,
    value: {
      ...value,
      entities: migration.entities,
      structures: structures.entities,
      version: 3,
    },
  };
}

function migrateVersionTwoSnapshot(
  value: Record<string, unknown>,
): SnapshotMigrationResult {
  if (!Array.isArray(value.entities)) {
    return { ok: false, reason: "invalid-record" };
  }
  const structures = createStructureRegistryForEntityReferences(value.entities);
  if (!structures.ok) return structures;
  return {
    ok: true,
    value: {
      ...value,
      structures: structures.entities,
      version: 3,
    },
  };
}

function migrateSnapshotVersion(
  value: Record<string, unknown>,
): SnapshotMigrationResult {
  if (value.version === 1) return migrateVersionOneSnapshot(value);
  if (value.version === 2) return migrateVersionTwoSnapshot(value);
  if (value.version === 3) {
    return { ok: true, value: { ...value, version: 4 } };
  }
  if (value.version === 4) return migrateVersionFourSnapshot(value);
  return value.version === WORKSPACE_OBJECT_SCHEMA_VERSION
    ? { ok: true, value }
    : { ok: false, reason: "unsupported-version" };
}

function migrateVersionFourSnapshot(
  value: Record<string, unknown>,
): SnapshotMigrationResult {
  if (!Array.isArray(value.entities)) {
    return { ok: false, reason: "invalid-record" };
  }
  return {
    ok: true,
    value: {
      ...value,
      entities: migrateLegacyIdentityMemberships(
        value.entities as WorkspaceEntity[],
      ),
      version: WORKSPACE_OBJECT_SCHEMA_VERSION,
    },
  };
}

function validateSnapshotEnvelope(
  value: Record<string, unknown>,
  structureValidation: ReturnType<typeof validateStructureRegistry>,
): boolean {
  return (
    structureValidation.ok &&
    Array.isArray(value.entities) &&
    value.entities.every(isWorkspaceEntity) &&
    typeof value.nextId === "number" &&
    Number.isInteger(value.nextId) &&
    value.nextId >= 1 &&
    (value.activeEntityId === null || typeof value.activeEntityId === "string")
  );
}

function stripTemporaryFilePreviewUrls(
  entities: readonly WorkspaceEntity[],
): WorkspaceEntity[] {
  return entities.map((entity) => {
    if (entity.kind !== "file") return entity;
    const { previewUrl: _previewUrl, ...persisted } = entity;
    return persisted;
  }) as WorkspaceEntity[];
}

function pruneUnreferencedLegacyStructures(
  structures: readonly WorkspaceStructure[],
  entities: readonly WorkspaceEntity[],
): readonly WorkspaceStructure[] {
  const referencedStructureIds = new Set(
    entities.map((entity) => entity.objectTypeId),
  );
  return structures.filter(
    (structure) =>
      structure.ownership !== "legacy" ||
      referencedStructureIds.has(structure.id),
  );
}

function hydrateEntityPropertyValues(
  entities: readonly WorkspaceEntity[],
  structures: readonly WorkspaceStructure[],
): EntityMigrationResult<WorkspaceEntity[]> {
  const structuresById = new Map(
    structures.map((structure) => [structure.id, structure]),
  );
  const hydratedEntities: WorkspaceEntity[] = [];
  for (const entity of entities) {
    const structure = structuresById.get(entity.objectTypeId);
    if (!structure) return { ok: false, reason: "invalid-record" };
    const candidateValues = isRecord(entity.propertyValues)
      ? entity.propertyValues
      : createWorkspaceEntityPropertyValues(entity);
    const propertyValues = normalizeWorkspacePropertyValueMap(
      structure,
      candidateValues,
    );
    if (!propertyValues.ok) return { ok: false, reason: "invalid-record" };
    hydratedEntities.push({
      ...entity,
      propertyValues: propertyValues.value,
    });
  }
  return { entities: hydratedEntities, ok: true };
}

function parseCurrentWorkspaceObjectSnapshot(
  value: Record<string, unknown>,
): SnapshotParseResult {
  if (!Array.isArray(value.entities)) {
    return { ok: false, reason: "invalid-record" };
  }
  const blockMigration = migrateStructuredEntityBodies(value.entities);
  if (!blockMigration.ok) return blockMigration;
  const normalizedValue: Record<string, unknown> = {
    ...value,
    entities: blockMigration.entities,
  };
  const structureValidation = validateStructureRegistry(normalizedValue.structures);
  if (
    !structureValidation.ok ||
    !validateSnapshotEnvelope(normalizedValue, structureValidation)
  ) {
    return { ok: false, reason: "invalid-record" };
  }

  const entities = stripTemporaryFilePreviewUrls(
    normalizedValue.entities as WorkspaceEntity[],
  );
  const structures = reconcileRequiredStructures(
    createInitialStructureRegistry(),
    pruneUnreferencedLegacyStructures(structureValidation.value, entities),
  );
  if (!entitiesReferenceValidStructures(entities, structures)) {
    return { ok: false, reason: "invalid-record" };
  }
  const hydrated = hydrateEntityPropertyValues(entities, structures);
  if (!hydrated.ok) return hydrated;
  const activeEntityId = entities.some(
    (entity) => entity.id === normalizedValue.activeEntityId,
  )
    ? (normalizedValue.activeEntityId as string)
    : null;

  return {
    ok: true,
    state: {
      ...createInitialWorkspaceObjectState(),
      activeEntityId,
      entities: hydrated.entities,
      hydrationStatus: "ready",
      nextId: normalizedValue.nextId as number,
      structures,
    },
  };
}

function parseWorkspaceObjectSnapshot(raw: string): SnapshotParseResult {
  const parsed = parseSnapshotJson(raw);
  if (!parsed.ok) return parsed;
  const migrated = migrateSnapshotVersion(parsed.value);
  if (!migrated.ok) return migrated;
  return parseCurrentWorkspaceObjectSnapshot(migrated.value);
}

export type { SnapshotParseResult, WorkspaceObjectSnapshot };
export {
  parseWorkspaceObjectSnapshot,
  serializeWorkspaceObjectState,
  toWorkspaceObjectSnapshot,
  WORKSPACE_OBJECT_STORAGE_KEY,
};
