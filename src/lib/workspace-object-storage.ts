import {
  blockEditorDocumentFromPlainText,
  isBlockEditorDocument,
} from "../editor/document.ts";
import {
  WORKSPACE_OBJECT_SCHEMA_VERSION,
  createInitialWorkspaceObjectState,
  type WorkspaceEntity,
  type WorkspaceObjectState,
} from "./workspace-objects.ts";
import {
  createInitialStructureRegistry,
  validateStructureRegistry,
  type WorkspaceStructure,
} from "./workspace-object-types.ts";

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

function parseWorkspaceObjectSnapshot(raw: string): SnapshotParseResult {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "invalid-json" };
  }
  if (!isRecord(value)) return { ok: false, reason: "invalid-record" };
  if (value.version === 1) {
    if (!Array.isArray(value.entities)) {
      return { ok: false, reason: "invalid-record" };
    }
    const migratedEntities: unknown[] = [];
    for (const entity of value.entities) {
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
    value = {
      ...value,
      entities: migratedEntities,
      version: 2,
    };
  }
  if (isRecord(value) && value.version === 2) {
    value = {
      ...value,
      structures: createInitialStructureRegistry(),
      version: WORKSPACE_OBJECT_SCHEMA_VERSION,
    };
  } else if (
    !isRecord(value) ||
    value.version !== WORKSPACE_OBJECT_SCHEMA_VERSION
  ) {
    return { ok: false, reason: "unsupported-version" };
  }
  if (!isRecord(value)) return { ok: false, reason: "invalid-record" };
  const structureValidation = validateStructureRegistry(value.structures);
  if (
    !structureValidation.ok ||
    !Array.isArray(value.entities) ||
    !value.entities.every(isWorkspaceEntity) ||
    typeof value.nextId !== "number" ||
    !Number.isInteger(value.nextId) ||
    value.nextId < 1 ||
    !(value.activeEntityId === null || typeof value.activeEntityId === "string")
  ) {
    return { ok: false, reason: "invalid-record" };
  }

  const entities = value.entities.map((entity) => {
    if (entity.kind !== "file") return entity;
    const { previewUrl: _previewUrl, ...persisted } = entity;
    return persisted;
  }) as WorkspaceEntity[];
  const structures = structureValidation.value;
  if (!entitiesReferenceValidStructures(entities, structures)) {
    return { ok: false, reason: "invalid-record" };
  }
  const activeEntityId = entities.some(
    (entity) => entity.id === value.activeEntityId,
  )
    ? value.activeEntityId
    : null;

  return {
    ok: true,
    state: {
      ...createInitialWorkspaceObjectState(),
      activeEntityId,
      entities,
      hydrationStatus: "ready",
      nextId: value.nextId,
      structures,
    },
  };
}

export {
  WORKSPACE_OBJECT_STORAGE_KEY,
  parseWorkspaceObjectSnapshot,
  serializeWorkspaceObjectState,
  toWorkspaceObjectSnapshot,
};

export type { SnapshotParseResult, WorkspaceObjectSnapshot };
