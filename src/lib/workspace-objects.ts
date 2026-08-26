import {
  type BlockEditorDocument,
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToPlainText,
  createEmptyBlockEditorDocument,
  normalizeBlockEditorDocument,
} from "../editor/document.ts";
import {
  type CreateStructureInput,
  createCustomStructure,
  createInitialStructureRegistry,
  type DomainResult,
  deleteStructure,
  instantiateObjectTypePreset,
  type ObjectIconName,
  type ObjectIconTone,
  type PropertyDefinition,
  renameStructure,
  replaceStructureSchema,
  type StructureDomainError,
  type StructureId,
  selectCreatableStructures,
  selectStructureById,
  updateStructureAppearance,
  validateStructureRegistry,
  type WorkspaceStructure,
} from "./workspace-object-types.ts";
import {
  createWorkspaceEntityPropertyValues,
  normalizeWorkspacePropertyValueMap,
  removeWorkspaceEntityPropertyValue,
  setWorkspaceEntityPropertyValue,
  type WorkspacePropertyValueMap,
} from "./workspace-property-values.ts";

type ObjectTypeId = StructureId;

type CreationFlow =
  | "document"
  | "quote"
  | "table"
  | "task"
  | "url"
  | "tag"
  | "query"
  | "file";

type WorkspaceEntityBase = {
  id: string;
  objectTypeId: StructureId;
  title: string;
  createdAt: string;
  propertyValues: WorkspacePropertyValueMap;
};

type DocumentEntity = WorkspaceEntityBase & {
  kind: "document";
  body: BlockEditorDocument;
  collections: string[];
  tags: string[];
  dailyNote?: { readonly date: string; readonly spaceId: string };
  description?: string;
  aliases?: string[];
  customIcon?: string;
  coverImage?: string;
};

type QuoteEntity = WorkspaceEntityBase & {
  kind: "quote";
  body: BlockEditorDocument;
  collections: string[];
  tags: string[];
  description?: string;
  aliases?: string[];
  customIcon?: string;
  coverImage?: string;
};

type TableCell = {
  id: string;
  column: number;
  row: number;
  value: string;
};

type TableEntity = WorkspaceEntityBase & {
  kind: "table";
  cells: TableCell[];
  notes: string;
};

type TaskEntity = WorkspaceEntityBase & {
  kind: "task";
  body: string;
  completed: boolean;
  dueDate: string | null;
};

type UrlEntity = WorkspaceEntityBase & {
  kind: "url";
  body: string;
  url: string;
};

type TagEntity = WorkspaceEntityBase & {
  kind: "tag";
};

type QueryFilters = {
  created?: "today";
  objectTypeId?: ObjectTypeId;
  tags: string[];
};

type QueryEntity = WorkspaceEntityBase & {
  kind: "query";
  description: string;
  filters: QueryFilters;
};

type FileEntity = WorkspaceEntityBase & {
  kind: "file";
  assetId?: string;
  contentHash?: string;
  fileName: string;
  mimeType: string;
  previewUrl?: string;
  size: number;
  storageState?: "missing" | "stored";
};

type WorkspaceEntity =
  | DocumentEntity
  | FileEntity
  | QueryEntity
  | QuoteEntity
  | TableEntity
  | TagEntity
  | TaskEntity
  | UrlEntity;

type WorkspaceDraft =
  | { kind: "file"; objectTypeId: StructureId }
  | { kind: "task"; objectTypeId: StructureId }
  | { kind: "url"; objectTypeId: StructureId };

type WorkspaceObjectError =
  | "incompatible-file"
  | "invalid-url"
  | "media-storage-failed"
  | "referenced-object"
  | "required-title"
  | "unsupported-object-type";

type WorkspaceObjectState = {
  activeEntityId: string | null;
  draft: WorkspaceDraft | null;
  entities: WorkspaceEntity[];
  error: WorkspaceObjectError | null;
  hydrationStatus: "ready" | "recovered" | "seed";
  nextId: number;
  structureError: StructureDomainError | null;
  structures: readonly WorkspaceStructure[];
};

type WorkspaceObjectAction =
  | { type: "beginCreate"; objectTypeId: string }
  | { type: "cancelDraft" }
  | { type: "createDocument"; objectTypeId: "page"; title: string }
  | {
      type: "importFile";
      assetId?: string;
      contentHash?: string;
      fileName: string;
      mimeType: string;
      objectTypeId: string;
      previewUrl?: string;
      size: number;
      storageState?: "missing" | "stored";
      text: string;
    }
  | {
      type: "commitFile";
      assetId?: string;
      contentHash?: string;
      fileName: string;
      mimeType: string;
      previewUrl?: string;
      size: number;
      storageState?: "missing" | "stored";
    }
  | { type: "commitTask"; title: string }
  | { type: "commitUrl"; url: string }
  | {
      type: "createOrAppendDailyNote";
      appendText?: string;
      date: string;
      spaceId: string;
      template?: string;
    }
  | { type: "hydrate"; state: WorkspaceObjectState }
  | { type: "recover" }
  | { type: "selectEntity"; id: string | null }
  | {
      type: "changeEntityType";
      id: string;
      objectTypeId: string;
      propertyValues?: Readonly<Record<string, unknown>>;
    }
  | { type: "deleteEntity"; id: string }
  | { type: "duplicateEntity"; id: string }
  | { type: "createStructure"; input: CreateStructureInput; id?: string }
  | { type: "createStructureFromPreset"; presetId: string; id?: string }
  | {
      type: "renameStructure";
      id: StructureId;
      singularName: string;
      pluralName: string;
    }
  | {
      type: "updateStructureAppearance";
      id: StructureId;
      iconName?: ObjectIconName;
      tone?: ObjectIconTone;
    }
  | {
      type: "replaceStructureSchema";
      id: StructureId;
      propertyDefinitions: readonly PropertyDefinition[];
      unsafePropertyDefinitionIds?: readonly string[];
    }
  | {
      type: "setPropertyValue";
      id: string;
      propertyId: string;
      value: unknown;
    }
  | {
      type: "setLinkedEntityPropertyValue";
      id: string;
      propertyId: string;
      value: unknown;
    }
  | { type: "removePropertyValue"; id: string; propertyId: string }
  | { type: "deleteStructure"; id: StructureId }
  | {
      type: "updateEntity";
      id: string;
      patch: Record<string, unknown>;
    };

type WorkspaceObjectActionReducer<TAction extends WorkspaceObjectAction> = (
  state: WorkspaceObjectState,
  action: TAction,
) => WorkspaceObjectState;

const WORKSPACE_OBJECT_SCHEMA_VERSION = 5;

const initialStructures = createInitialStructureRegistry();
const objectTypeIds: ObjectTypeId[] = selectCreatableStructures(
  initialStructures,
).map((structure) => structure.id);

function isObjectTypeId(value: string): value is ObjectTypeId {
  return objectTypeIds.includes(value);
}

function getCreationFlow(
  value: string,
  structures: readonly WorkspaceStructure[] = initialStructures,
): CreationFlow | null {
  const structure = selectStructureById(structures, value);
  return structure?.ownership === "reserved"
    ? null
    : (structure?.lifecycleKind ?? null);
}

function createInitialWorkspaceObjectState(): WorkspaceObjectState {
  return {
    activeEntityId: null,
    draft: null,
    entities: [],
    error: null,
    hydrationStatus: "seed",
    nextId: 1,
    structureError: null,
    structures: createInitialStructureRegistry(),
  };
}

function createTableCells(): TableCell[] {
  return Array.from({ length: 6 }, (_, index) => ({
    id: `r${Math.floor(index / 2)}c${index % 2}`,
    column: index % 2,
    row: Math.floor(index / 2),
    value: "",
  }));
}

function createEntity(
  state: WorkspaceObjectState,
  objectTypeId: StructureId,
  fields: Record<string, unknown> = {},
  activate = true,
): WorkspaceObjectState {
  const id = `created-${objectTypeId}-${state.nextId}`;
  const base = {
    createdAt: new Date().toISOString(),
    id,
    objectTypeId,
    propertyValues: {},
    title: "",
  };
  const flow = getCreationFlow(objectTypeId, state.structures);
  if (!flow) {
    return { ...state, error: "unsupported-object-type" };
  }
  let entity: WorkspaceEntity;

  if (flow === "quote") {
    entity = {
      ...base,
      body: createEmptyBlockEditorDocument(),
      collections: [],
      kind: "quote",
      objectTypeId,
      tags: [],
      ...fields,
    } as QuoteEntity;
  } else if (flow === "document") {
    entity = {
      ...base,
      body: createEmptyBlockEditorDocument(),
      collections: [],
      kind: "document",
      objectTypeId,
      tags: [],
      ...fields,
    } as DocumentEntity;
  } else if (flow === "table") {
    entity = {
      ...base,
      cells: createTableCells(),
      kind: "table",
      notes: "",
      objectTypeId,
      ...fields,
    } as TableEntity;
  } else if (flow === "task") {
    entity = {
      ...base,
      body: "",
      completed: false,
      dueDate: null,
      kind: "task",
      objectTypeId,
      ...fields,
    } as TaskEntity;
  } else if (flow === "url") {
    entity = {
      ...base,
      body: "",
      kind: "url",
      objectTypeId,
      url: "",
      ...fields,
    } as UrlEntity;
  } else if (flow === "tag") {
    entity = { ...base, kind: "tag", objectTypeId, ...fields } as TagEntity;
  } else if (flow === "query") {
    entity = {
      ...base,
      description: "",
      filters: { tags: [] },
      kind: "query",
      objectTypeId,
      ...fields,
    } as QueryEntity;
  } else {
    entity = {
      ...base,
      fileName: "",
      kind: "file",
      mimeType: "",
      objectTypeId,
      size: 0,
      ...fields,
    } as FileEntity;
  }

  return {
    ...state,
    activeEntityId: activate ? id : state.activeEntityId,
    draft: null,
    entities: [
      ...state.entities,
      {
        ...entity,
        propertyValues: createWorkspaceEntityPropertyValues(entity),
      },
    ],
    error: null,
    nextId: state.nextId + 1,
  };
}

function deriveUrlMetadata(
  objectTypeId: StructureId,
  input: string,
): { ok: false } | { ok: true; title: string; url: string } {
  try {
    const parsed = new URL(input.trim());
    if (!["http:", "https:"].includes(parsed.protocol)) return { ok: false };
    if (
      objectTypeId === "tweet" &&
      (!["twitter.com", "www.twitter.com", "x.com", "www.x.com"].includes(
        parsed.hostname.toLocaleLowerCase(),
      ) ||
        !/\/status\/\d+/.test(parsed.pathname))
    ) {
      return { ok: false };
    }

    const path =
      parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
    return {
      ok: true,
      title:
        objectTypeId === "tweet"
          ? ""
          : `${parsed.hostname.replace(/^www\./, "")}${path}`,
      url: parsed.toString(),
    };
  } catch {
    return { ok: false };
  }
}

function acceptsFileForType(
  objectTypeId: StructureId,
  mimeType: string,
  fileName: string,
): boolean {
  const normalizedMime = mimeType.toLocaleLowerCase();
  const normalizedName = fileName.toLocaleLowerCase();
  if (!fileName.trim()) return false;
  if (objectTypeId === "image") return normalizedMime.startsWith("image/");
  if (objectTypeId === "audio") return normalizedMime.startsWith("audio/");
  if (objectTypeId === "pdf") {
    return (
      normalizedMime === "application/pdf" || normalizedName.endsWith(".pdf")
    );
  }
  return true;
}

function getWorkspaceImportError(
  objectTypeId: string,
  mimeType: string,
  fileName: string,
  text: string,
  structures: readonly WorkspaceStructure[] = initialStructures,
): WorkspaceObjectError | null {
  const flow = getCreationFlow(objectTypeId, structures);
  if (!flow) return "unsupported-object-type";
  if (
    flow === "file" &&
    !acceptsFileForType(objectTypeId, mimeType, fileName)
  ) {
    return "incompatible-file";
  }
  if (flow === "url" && !deriveUrlMetadata(objectTypeId, text).ok) {
    return "invalid-url";
  }
  return null;
}

function beginWorkspaceObjectCreation(
  state: WorkspaceObjectState,
  objectTypeId: string,
): WorkspaceObjectState {
  const flow = getCreationFlow(objectTypeId, state.structures);
  if (!flow) {
    return { ...state, error: "unsupported-object-type" };
  }
  if (!(["task", "url", "file"] as CreationFlow[]).includes(flow)) {
    return createEntity(state, objectTypeId);
  }
  return {
    ...state,
    draft: { kind: flow, objectTypeId } as WorkspaceDraft,
    error: null,
  };
}

function importWorkspaceObject(
  state: WorkspaceObjectState,
  action: Extract<WorkspaceObjectAction, { type: "importFile" }>,
): WorkspaceObjectState {
  const importError = getWorkspaceImportError(
    action.objectTypeId,
    action.mimeType,
    action.fileName,
    action.text,
    state.structures,
  );
  if (importError) {
    return { ...state, error: importError };
  }
  const objectTypeId = action.objectTypeId;
  const flow = getCreationFlow(objectTypeId, state.structures);
  if (!flow) return { ...state, error: "unsupported-object-type" };
  const title = action.fileName.replace(/\.[^.]+$/, "").trim();
  if (flow === "file") {
    return createEntity(state, objectTypeId, {
      assetId: action.assetId,
      contentHash: action.contentHash,
      fileName: action.fileName,
      mimeType: action.mimeType,
      previewUrl: action.previewUrl,
      size: action.size,
      storageState: action.storageState,
      title,
    });
  }
  if (flow === "url") {
    const metadata = deriveUrlMetadata(objectTypeId, action.text);
    return metadata.ok ? createEntity(state, objectTypeId, metadata) : state;
  }
  return importTextWorkspaceObject(
    state,
    objectTypeId,
    flow,
    action.text,
    title,
  );
}

function importTextWorkspaceObject(
  state: WorkspaceObjectState,
  objectTypeId: StructureId,
  flow: CreationFlow,
  text: string,
  title: string,
): WorkspaceObjectState {
  if (flow === "task") {
    const importedTitle =
      text
        .split(/\r?\n/)
        .find((line) => line.trim())
        ?.trim() || title;
    return createEntity(state, objectTypeId, { title: importedTitle });
  }
  if (flow === "table")
    return createEntity(state, objectTypeId, { notes: text, title });
  if (flow === "tag") return createEntity(state, objectTypeId, { title });
  if (flow === "query") {
    const description = text.trim();
    return createEntity(state, objectTypeId, {
      description,
      title: description || title,
    });
  }
  return createEntity(state, objectTypeId, {
    body: flow === "document" ? blockEditorDocumentFromPlainText(text) : text,
    title,
  });
}

function commitTaskDraft(
  state: WorkspaceObjectState,
  titleValue: string,
): WorkspaceObjectState {
  if (state.draft?.kind !== "task") return state;
  const title = titleValue.trim();
  if (!title) return { ...state, error: "required-title" };
  return createEntity(state, "task", { title }, false);
}

function commitUrlDraft(
  state: WorkspaceObjectState,
  url: string,
): WorkspaceObjectState {
  if (state.draft?.kind !== "url") return state;
  const result = deriveUrlMetadata(state.draft.objectTypeId, url);
  if (!result.ok) return { ...state, error: "invalid-url" };
  return createEntity(state, state.draft.objectTypeId, result);
}

function commitFileDraft(
  state: WorkspaceObjectState,
  action: Extract<WorkspaceObjectAction, { type: "commitFile" }>,
): WorkspaceObjectState {
  if (state.draft?.kind !== "file") return state;
  if (
    !acceptsFileForType(
      state.draft.objectTypeId,
      action.mimeType,
      action.fileName,
    )
  ) {
    return { ...state, error: "incompatible-file" };
  }
  return createEntity(state, state.draft.objectTypeId, {
    assetId: action.assetId,
    contentHash: action.contentHash,
    fileName: action.fileName,
    mimeType: action.mimeType,
    previewUrl: action.previewUrl,
    size: action.size,
    storageState: action.storageState,
    title: action.fileName.replace(/\.[^.]+$/, ""),
  });
}

function appendPlainTextToDocument(
  document: BlockEditorDocument,
  text: string,
): BlockEditorDocument {
  const append = text.trim();
  if (!append) return document;
  const current = blockEditorDocumentToPlainText(document);
  return blockEditorDocumentFromPlainText(
    current.trim() ? `${current}\n${append}` : append,
  );
}

function reduceCreateOrAppendDailyNote(
  state: WorkspaceObjectState,
  action: Extract<WorkspaceObjectAction, { type: "createOrAppendDailyNote" }>,
): WorkspaceObjectState {
  const existing = state.entities.find(
    (entity) =>
      entity.kind === "document" &&
      entity.dailyNote?.spaceId === action.spaceId &&
      entity.dailyNote.date === action.date,
  );
  if (existing) {
    return {
      ...state,
      activeEntityId: existing.id,
      entities: state.entities.map((entity) =>
        entity.id === existing.id && entity.kind === "document"
          ? {
              ...entity,
              body: appendPlainTextToDocument(
                entity.body,
                action.appendText ?? "",
              ),
            }
          : entity,
      ),
      error: null,
    };
  }
  return createEntity(state, "page", {
    body: blockEditorDocumentFromPlainText(
      action.appendText ?? action.template ?? "",
    ),
    dailyNote: { date: action.date, spaceId: action.spaceId },
    title: action.date,
  });
}

type EntityMenuAction = Extract<
  WorkspaceObjectAction,
  { type: "changeEntityType" | "deleteEntity" | "duplicateEntity" }
>;

function reduceEntityMenuAction(
  state: WorkspaceObjectState,
  action: EntityMenuAction,
): WorkspaceObjectState {
  if (action.type === "changeEntityType") {
    const source = state.entities.find((entity) => entity.id === action.id);
    if (!source) return state;
    const targetStructure = selectStructureById(
      state.structures,
      action.objectTypeId,
    );
    const targetFlow = getCreationFlow(action.objectTypeId, state.structures);
    if (!targetStructure || !targetFlow) {
      return { ...state, error: "unsupported-object-type" };
    }
    const base = {
      createdAt: source.createdAt,
      id: source.id,
      objectTypeId: action.objectTypeId,
      propertyValues: source.propertyValues,
      title: source.title,
    };
    const entity = convertEntityToFlow(source, base, targetFlow);
    const propertyValues = normalizeWorkspacePropertyValueMap(targetStructure, {
      ...createWorkspaceEntityPropertyValues(entity),
      ...(action.propertyValues ?? {}),
    });
    if (!propertyValues.ok) return state;
    const convertedEntity = touchWorkspaceEntity({
      ...entity,
      propertyValues: propertyValues.value,
    });
    return {
      ...state,
      activeEntityId: convertedEntity.id,
      entities: state.entities.map((item) =>
        item.id === action.id ? convertedEntity : item,
      ),
      error: null,
    };
  }

  if (action.type === "duplicateEntity") {
    const source = state.entities.find((entity) => entity.id === action.id);
    if (!source) return state;
    const id = `created-${source.objectTypeId}-${state.nextId}`;
    const duplicate = {
      ...structuredClone(source),
      createdAt: new Date().toISOString(),
      id,
      title: source.title,
    } as WorkspaceEntity;
    const canonicalDuplicate = {
      ...duplicate,
      propertyValues: createWorkspaceEntityPropertyValues(duplicate),
    };
    return {
      ...state,
      activeEntityId: id,
      entities: [...state.entities, canonicalDuplicate],
      error: null,
      nextId: state.nextId + 1,
    };
  }

  if (entityHasIncomingReferences(state.entities, action.id)) {
    return { ...state, error: "referenced-object" };
  }
  const entities = state.entities.filter((entity) => entity.id !== action.id);
  return {
    ...state,
    activeEntityId:
      state.activeEntityId === action.id
        ? (entities.at(-1)?.id ?? null)
        : state.activeEntityId,
    entities,
    error: null,
  };
}

function legacyTextBody(source: WorkspaceEntity): string {
  if (!("body" in source)) return "";
  return typeof source.body === "string"
    ? source.body
    : blockEditorDocumentToPlainText(source.body);
}

function convertEntityToFlow(
  source: WorkspaceEntity,
  base: WorkspaceEntityBase,
  flow: CreationFlow,
): WorkspaceEntity {
  return entityConversionFactories[flow](source, base);
}

type EntityConversionFactory = (
  source: WorkspaceEntity,
  base: WorkspaceEntityBase,
) => WorkspaceEntity;

function convertEntityToDocumentLike(
  source: WorkspaceEntity,
  base: WorkspaceEntityBase,
  kind: "document" | "quote",
): DocumentEntity | QuoteEntity {
  return {
    ...base,
    body:
      "body" in source && typeof source.body !== "string"
        ? source.body
        : blockEditorDocumentFromPlainText(legacyTextBody(source)),
    collections:
      "collections" in source && Array.isArray(source.collections)
        ? source.collections
        : [],
    kind,
    tags: "tags" in source && Array.isArray(source.tags) ? source.tags : [],
  };
}

const entityConversionFactories: Record<CreationFlow, EntityConversionFactory> =
  {
    document: (source, base) =>
      convertEntityToDocumentLike(source, base, "document"),
    file: (source, base) => ({
      ...base,
      assetId: source.kind === "file" ? source.assetId : undefined,
      contentHash: source.kind === "file" ? source.contentHash : undefined,
      fileName: source.kind === "file" ? source.fileName : "",
      kind: "file",
      mimeType: source.kind === "file" ? source.mimeType : "",
      previewUrl: source.kind === "file" ? source.previewUrl : undefined,
      size: source.kind === "file" ? source.size : 0,
      storageState: source.kind === "file" ? source.storageState : undefined,
    }),
    query: (_source, base) => ({
      ...base,
      description: "",
      filters: { tags: [] },
      kind: "query",
    }),
    quote: (source, base) => convertEntityToDocumentLike(source, base, "quote"),
    table: (source, base) => ({
      ...base,
      cells:
        source.kind === "table" && Array.isArray(source.cells)
          ? source.cells
          : createTableCells(),
      kind: "table",
      notes: source.kind === "table" ? source.notes : legacyTextBody(source),
    }),
    tag: (_source, base) => ({ ...base, kind: "tag" }),
    task: (source, base) => ({
      ...base,
      body: legacyTextBody(source),
      completed: source.kind === "task" ? source.completed : false,
      dueDate: source.kind === "task" ? source.dueDate : null,
      kind: "task",
    }),
    url: (source, base) => ({
      ...base,
      body: source.kind === "url" ? source.body : legacyTextBody(source),
      kind: "url",
      url: source.kind === "url" ? source.url : "",
    }),
  };

function reduceStructureAction(
  state: WorkspaceObjectState,
  action: Extract<
    WorkspaceObjectAction,
    {
      type:
        | "createStructure"
        | "createStructureFromPreset"
        | "deleteStructure"
        | "renameStructure"
        | "replaceStructureSchema"
        | "updateStructureAppearance";
    }
  >,
): WorkspaceObjectState {
  let result: DomainResult<readonly WorkspaceStructure[]>;
  if (action.type === "createStructure") {
    result = createCustomStructure(
      state.structures,
      action.input,
      action.id ? () => action.id as string : undefined,
    );
  } else if (action.type === "createStructureFromPreset") {
    result = instantiateObjectTypePreset(
      state.structures,
      action.presetId,
      action.id ? () => action.id as string : undefined,
    );
  } else if (action.type === "renameStructure") {
    result = renameStructure(
      state.structures,
      action.id,
      action.singularName,
      action.pluralName,
    );
  } else if (action.type === "updateStructureAppearance") {
    result = updateStructureAppearance(state.structures, action.id, {
      iconName: action.iconName,
      tone: action.tone,
    });
  } else if (action.type === "replaceStructureSchema") {
    result = replaceStructureSchema(
      state.structures,
      action.id,
      action.propertyDefinitions,
      { unsafePropertyDefinitionIds: action.unsafePropertyDefinitionIds },
    );
  } else {
    const structure = selectStructureById(state.structures, action.id);
    result = deleteStructure(state.structures, action.id, {
      dependentCollectionIds: structure?.collectionIds ?? [],
      instanceCount: state.entities.filter(
        (entity) => entity.objectTypeId === action.id,
      ).length,
    });
  }
  return result.ok
    ? { ...state, structureError: null, structures: result.value }
    : { ...state, structureError: result.error };
}

function targetStructureIdByEntityId(
  entities: readonly WorkspaceEntity[],
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    entities.map((entity) => [entity.id, entity.objectTypeId]),
  );
}

function readEntityRelationIds(
  entity: WorkspaceEntity,
  propertyId: string,
): readonly string[] {
  const value = entity.propertyValues[propertyId];
  return value?.type === "entity" ? value.entity.map((item) => item.id) : [];
}

function updateEntityRelationIds(
  entity: WorkspaceEntity,
  structure: WorkspaceStructure,
  propertyId: string,
  ids: readonly string[],
  context: Readonly<Record<string, string>>,
): DomainResult<WorkspaceEntity> {
  return setWorkspaceEntityPropertyValue(entity, structure, propertyId, ids, {
    targetStructureIdByEntityId: context,
  });
}

type LinkedEntitySourceUpdate = {
  readonly context: Readonly<Record<string, string>>;
  readonly inversePropertyId?: string;
  readonly source: WorkspaceEntity;
  readonly sourceUpdate: WorkspaceEntity;
};

function findEntityPropertyDefinition(
  structure: WorkspaceStructure | null | undefined,
  propertyId: string,
): PropertyDefinition | undefined {
  return structure?.propertyDefinitions.find(
    (definition) => definition.id === propertyId,
  );
}

function createLinkedEntitySourceUpdate(
  state: WorkspaceObjectState,
  action: Extract<
    WorkspaceObjectAction,
    { type: "setLinkedEntityPropertyValue" }
  >,
): LinkedEntitySourceUpdate | null {
  const source = state.entities.find((entity) => entity.id === action.id);
  if (!source) return null;
  const sourceStructure = selectStructureById(
    state.structures,
    source.objectTypeId,
  );
  const sourceDefinition = findEntityPropertyDefinition(
    sourceStructure,
    action.propertyId,
  );
  if (
    !sourceStructure ||
    !sourceDefinition ||
    sourceDefinition.valueType !== "entity"
  ) {
    return null;
  }

  const context = targetStructureIdByEntityId(state.entities);
  const sourceUpdate = updateEntityRelationIds(
    source,
    sourceStructure,
    action.propertyId,
    Array.isArray(action.value) ? action.value : [action.value],
    context,
  );
  return sourceUpdate.ok
    ? {
        context,
        inversePropertyId: sourceDefinition.inversePropertyDefinitionId,
        source,
        sourceUpdate: touchWorkspaceEntity(sourceUpdate.value),
      }
    : null;
}

function changedRelationTargetIds(
  before: WorkspaceEntity,
  after: WorkspaceEntity,
  propertyId: string,
): ReadonlySet<string> {
  return new Set([
    ...readEntityRelationIds(before, propertyId),
    ...readEntityRelationIds(after, propertyId),
  ]);
}

function nextInverseRelationIds(
  current: readonly string[],
  inverseDefinition: PropertyDefinition,
  sourceId: string,
  shouldIncludeSource: boolean,
): readonly string[] {
  if (!shouldIncludeSource) return current.filter((id) => id !== sourceId);
  return inverseDefinition.multiple
    ? Array.from(new Set([...current, sourceId]))
    : [sourceId];
}

function updateInverseRelationTarget(
  state: WorkspaceObjectState,
  nextById: Map<string, WorkspaceEntity>,
  targetId: string,
  update: LinkedEntitySourceUpdate,
  action: Extract<
    WorkspaceObjectAction,
    { type: "setLinkedEntityPropertyValue" }
  >,
): boolean {
  const target = nextById.get(targetId);
  const targetStructure = target
    ? selectStructureById(state.structures, target.objectTypeId)
    : undefined;
  const inverseDefinition = findEntityPropertyDefinition(
    targetStructure,
    update.inversePropertyId ?? "",
  );
  if (!target || !targetStructure || !inverseDefinition) return false;
  const targetUpdate = updateEntityRelationIds(
    target,
    targetStructure,
    update.inversePropertyId ?? "",
    nextInverseRelationIds(
      readEntityRelationIds(target, update.inversePropertyId ?? ""),
      inverseDefinition,
      update.source.id,
      readEntityRelationIds(update.sourceUpdate, action.propertyId).includes(
        targetId,
      ),
    ),
    update.context,
  );
  if (!targetUpdate.ok) return false;
  nextById.set(targetId, touchWorkspaceEntity(targetUpdate.value));
  return true;
}

function applyLinkedEntityInverseUpdates(
  state: WorkspaceObjectState,
  action: Extract<
    WorkspaceObjectAction,
    { type: "setLinkedEntityPropertyValue" }
  >,
  update: LinkedEntitySourceUpdate,
): Map<string, WorkspaceEntity> | null {
  const nextById = new Map(
    state.entities.map((entity) => [
      entity.id,
      entity.id === update.source.id ? update.sourceUpdate : entity,
    ]),
  );
  for (const targetId of changedRelationTargetIds(
    update.source,
    update.sourceUpdate,
    action.propertyId,
  )) {
    if (!updateInverseRelationTarget(state, nextById, targetId, update, action))
      return null;
  }
  return nextById;
}

function reduceSetLinkedEntityPropertyValue(
  state: WorkspaceObjectState,
  action: Extract<
    WorkspaceObjectAction,
    { type: "setLinkedEntityPropertyValue" }
  >,
): WorkspaceObjectState {
  const update = createLinkedEntitySourceUpdate(state, action);
  if (!update) return state;
  if (!update.inversePropertyId) {
    return {
      ...state,
      entities: state.entities.map((entity) =>
        entity.id === update.source.id ? update.sourceUpdate : entity,
      ),
      error: null,
    };
  }

  const registryValidation = validateStructureRegistry(state.structures);
  if (!registryValidation.ok) {
    return { ...state, structureError: registryValidation.error };
  }

  const nextById = applyLinkedEntityInverseUpdates(state, action, update);
  if (!nextById) return state;

  return {
    ...state,
    entities: state.entities.map((entity) => nextById.get(entity.id) ?? entity),
    error: null,
  };
}

function entityHasIncomingReferences(
  entities: readonly WorkspaceEntity[],
  id: string,
): boolean {
  return entities.some((entity) => {
    if (entity.id === id) return false;
    if ("tags" in entity && entity.tags.includes(id)) return true;
    if ("collections" in entity && entity.collections.includes(id)) return true;
    return Object.values(entity.propertyValues).some(
      (value) =>
        value.type === "entity" &&
        value.entity.some((reference) => reference.id === id),
    );
  });
}

function reduceCreateDocument(
  state: WorkspaceObjectState,
  action: Extract<WorkspaceObjectAction, { type: "createDocument" }>,
): WorkspaceObjectState {
  const title = action.title.trim();
  return title
    ? createEntity(state, action.objectTypeId, { title })
    : { ...state, error: "required-title" };
}

function normalizeEntityPatch(
  entity: WorkspaceEntity,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  if (
    (entity.kind === "document" || entity.kind === "quote") &&
    Object.hasOwn(patch, "body")
  ) {
    const { body: proposedBody, ...rest } = patch;
    const body = normalizeBlockEditorDocument(proposedBody);
    return body ? { ...rest, body } : rest;
  }
  return patch;
}

function applyEntityPatch(
  entity: WorkspaceEntity,
  patch: Record<string, unknown>,
): WorkspaceEntity {
  const updated = {
    ...entity,
    ...normalizeEntityPatch(entity, patch),
    createdAt: entity.createdAt,
    id: entity.id,
    kind: entity.kind,
    objectTypeId: entity.objectTypeId,
  } as WorkspaceEntity;
  return touchWorkspaceEntity({
    ...updated,
    propertyValues: {
      ...updated.propertyValues,
      ...createWorkspaceEntityPropertyValues(updated),
    },
  });
}

function reduceUpdateEntity(
  state: WorkspaceObjectState,
  action: Extract<WorkspaceObjectAction, { type: "updateEntity" }>,
): WorkspaceObjectState {
  return {
    ...state,
    entities: state.entities.map((entity) =>
      entity.id === action.id ? applyEntityPatch(entity, action.patch) : entity,
    ),
    error: null,
  };
}

function reducePropertyValueAction(
  state: WorkspaceObjectState,
  action: Extract<
    WorkspaceObjectAction,
    { type: "removePropertyValue" | "setPropertyValue" }
  >,
): WorkspaceObjectState {
  const context = targetStructureIdByEntityId(state.entities);
  return {
    ...state,
    entities: state.entities.map((entity) =>
      entity.id === action.id
        ? reduceEntityPropertyValue(entity, state, action, context)
        : entity,
    ),
    error: null,
  };
}

function reduceEntityPropertyValue(
  entity: WorkspaceEntity,
  state: WorkspaceObjectState,
  action: Extract<
    WorkspaceObjectAction,
    { type: "removePropertyValue" | "setPropertyValue" }
  >,
  context: Readonly<Record<string, string>>,
): WorkspaceEntity {
  const structure = selectStructureById(state.structures, entity.objectTypeId);
  if (!structure) return entity;
  const result =
    action.type === "setPropertyValue"
      ? setWorkspaceEntityPropertyValue(
          entity,
          structure,
          action.propertyId,
          action.value,
          { targetStructureIdByEntityId: context },
        )
      : removeWorkspaceEntityPropertyValue(
          entity,
          structure,
          action.propertyId,
        );
  return result.ok ? touchWorkspaceEntity(result.value) : entity;
}

function readLastUpdatedAt(entity: WorkspaceEntity): string {
  const value = entity.propertyValues.lastUpdatedAt;
  return value?.type === "lastUpdatedAt"
    ? value.lastUpdatedAt.value
    : entity.createdAt;
}

function nextLastUpdatedAt(entity: WorkspaceEntity): string {
  const currentTime = Date.parse(readLastUpdatedAt(entity));
  const nowTime = Date.now();
  const nextTime =
    Number.isFinite(currentTime) && nowTime <= currentTime
      ? currentTime + 1
      : nowTime;
  return new Date(nextTime).toISOString();
}

function touchWorkspaceEntity(entity: WorkspaceEntity): WorkspaceEntity {
  return {
    ...entity,
    propertyValues: {
      ...entity.propertyValues,
      lastUpdatedAt: {
        lastUpdatedAt: { value: nextLastUpdatedAt(entity) },
        type: "lastUpdatedAt",
      },
    },
  };
}

type WorkspaceObjectActionHandlers = {
  readonly [K in WorkspaceObjectAction["type"]]: WorkspaceObjectActionReducer<
    Extract<WorkspaceObjectAction, { type: K }>
  >;
};

const workspaceObjectActionHandlers: WorkspaceObjectActionHandlers = {
  beginCreate: (state, action) =>
    beginWorkspaceObjectCreation(state, action.objectTypeId),
  cancelDraft: (state) => ({ ...state, draft: null, error: null }),
  changeEntityType: reduceEntityMenuAction,
  commitFile: commitFileDraft,
  commitTask: (state, action) => commitTaskDraft(state, action.title),
  commitUrl: (state, action) => commitUrlDraft(state, action.url),
  createDocument: reduceCreateDocument,
  createOrAppendDailyNote: reduceCreateOrAppendDailyNote,
  createStructure: reduceStructureAction,
  createStructureFromPreset: reduceStructureAction,
  deleteEntity: reduceEntityMenuAction,
  deleteStructure: reduceStructureAction,
  duplicateEntity: reduceEntityMenuAction,
  hydrate: (_state, action) => ({
    ...action.state,
    draft: null,
    error: null,
    hydrationStatus: "ready",
    structureError: null,
  }),
  importFile: importWorkspaceObject,
  recover: (state) => ({ ...state, hydrationStatus: "recovered" }),
  removePropertyValue: reducePropertyValueAction,
  renameStructure: reduceStructureAction,
  replaceStructureSchema: reduceStructureAction,
  selectEntity: (state, action) => ({
    ...state,
    activeEntityId: action.id,
    error: null,
  }),
  setLinkedEntityPropertyValue: reduceSetLinkedEntityPropertyValue,
  setPropertyValue: reducePropertyValueAction,
  updateEntity: reduceUpdateEntity,
  updateStructureAppearance: reduceStructureAction,
};

function workspaceObjectReducer(
  state: WorkspaceObjectState,
  action: WorkspaceObjectAction,
): WorkspaceObjectState {
  const reducer = workspaceObjectActionHandlers[action.type] as
    | WorkspaceObjectActionReducer<typeof action>
    | undefined;

  return reducer ? reducer(state, action) : state;
}

function countEntitiesByType(
  entities: WorkspaceEntity[],
): Partial<Record<ObjectTypeId, number>> {
  return entities.reduce<Partial<Record<ObjectTypeId, number>>>(
    (counts, entity) => {
      counts[entity.objectTypeId] = (counts[entity.objectTypeId] ?? 0) + 1;
      return counts;
    },
    {},
  );
}

function applyQueryDescription(
  entity: QueryEntity,
  description: string,
): QueryEntity {
  const trimmed = description.trim();
  const normalized = trimmed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
  const filters: QueryFilters = { tags: [] };
  if (/\b(page|pages|pagina|paginas)\b/.test(normalized)) {
    filters.objectTypeId = "page";
  } else if (/\b(quote|quotes|citacao|citacoes)\b/.test(normalized)) {
    filters.objectTypeId = "quote";
  } else if (/\b(table|tables|tabela|tabelas)\b/.test(normalized)) {
    filters.objectTypeId = "table";
  } else if (/\b(task|tasks|tarefa|tarefas)\b/.test(normalized)) {
    filters.objectTypeId = "task";
  }
  if (/\b(today|hoje)\b/.test(normalized)) filters.created = "today";
  return {
    ...entity,
    description: trimmed,
    filters,
    title: entity.title.trim() ? entity.title : trimmed,
  };
}

function isToday(value: string): boolean {
  const date = new Date(value);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function selectQueryResults(
  entities: WorkspaceEntity[],
  query: QueryEntity,
): WorkspaceEntity[] {
  return entities.filter((entity) => {
    if (entity.id === query.id) return false;
    if (
      query.filters.objectTypeId &&
      entity.objectTypeId !== query.filters.objectTypeId
    ) {
      return false;
    }
    if (query.filters.created === "today" && !isToday(entity.createdAt)) {
      return false;
    }
    if (query.filters.tags.length > 0) {
      if (!("tags" in entity)) return false;
      if (!query.filters.tags.every((tag) => entity.tags.includes(tag)))
        return false;
    }
    return true;
  });
}

export type {
  BlockEditorDocument,
  CreationFlow,
  FileEntity,
  ObjectTypeId,
  QueryEntity,
  QueryFilters,
  TableCell,
  TableEntity,
  TaskEntity,
  UrlEntity,
  WorkspaceDraft,
  WorkspaceEntity,
  WorkspaceObjectAction,
  WorkspaceObjectError,
  WorkspaceObjectState,
};
export {
  acceptsFileForType,
  applyQueryDescription,
  countEntitiesByType,
  createInitialWorkspaceObjectState,
  deriveUrlMetadata,
  getCreationFlow,
  getWorkspaceImportError,
  isObjectTypeId,
  objectTypeIds,
  selectQueryResults,
  WORKSPACE_OBJECT_SCHEMA_VERSION,
  workspaceObjectReducer,
};
