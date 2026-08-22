import {
  type BlockEditorDocument,
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToPlainText,
  createEmptyBlockEditorDocument,
  normalizeBlockEditorDocument,
} from "../editor/document.ts";

type ObjectTypeId =
  | "book"
  | "person"
  | "area"
  | "meeting"
  | "definition"
  | "idea"
  | "place"
  | "project"
  | "organization"
  | "atomic-note"
  | "media"
  | "travel"
  | "quote"
  | "page"
  | "ai-chat"
  | "table"
  | "task"
  | "image"
  | "weblink"
  | "tweet"
  | "pdf"
  | "audio"
  | "file"
  | "tag"
  | "query";

type CreationFlow =
  | "document"
  | "table"
  | "task"
  | "url"
  | "tag"
  | "query"
  | "file";

type WorkspaceEntityBase = {
  id: string;
  objectTypeId: ObjectTypeId;
  title: string;
  createdAt: string;
};

type DocumentEntity = WorkspaceEntityBase & {
  kind: "document";
  objectTypeId:
    | "book"
    | "person"
    | "area"
    | "meeting"
    | "definition"
    | "idea"
    | "place"
    | "project"
    | "organization"
    | "atomic-note"
    | "media"
    | "travel"
    | "page"
    | "ai-chat";
  body: BlockEditorDocument;
  collections: string[];
  tags: string[];
  description?: string;
  aliases?: string[];
  customIcon?: string;
  coverImage?: string;
};

type QuoteEntity = WorkspaceEntityBase & {
  kind: "quote";
  objectTypeId: "quote";
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
  objectTypeId: "table";
  cells: TableCell[];
  notes: string;
};

type TaskEntity = WorkspaceEntityBase & {
  kind: "task";
  objectTypeId: "task";
  body: string;
  completed: boolean;
  dueDate: string | null;
};

type UrlEntity = WorkspaceEntityBase & {
  kind: "url";
  objectTypeId: "tweet" | "weblink";
  body: string;
  url: string;
};

type TagEntity = WorkspaceEntityBase & {
  kind: "tag";
  objectTypeId: "tag";
};

type QueryFilters = {
  created?: "today";
  objectTypeId?: ObjectTypeId;
  tags: string[];
};

type QueryEntity = WorkspaceEntityBase & {
  kind: "query";
  objectTypeId: "query";
  description: string;
  filters: QueryFilters;
};

type FileEntity = WorkspaceEntityBase & {
  kind: "file";
  objectTypeId: "audio" | "file" | "image" | "pdf";
  fileName: string;
  mimeType: string;
  previewUrl?: string;
  size: number;
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
  | { kind: "file"; objectTypeId: FileEntity["objectTypeId"] }
  | { kind: "task"; objectTypeId: "task" }
  | { kind: "url"; objectTypeId: UrlEntity["objectTypeId"] };

type WorkspaceObjectError =
  | "incompatible-file"
  | "invalid-url"
  | "required-title"
  | "unsupported-object-type";

type WorkspaceObjectState = {
  activeEntityId: string | null;
  draft: WorkspaceDraft | null;
  entities: WorkspaceEntity[];
  error: WorkspaceObjectError | null;
  hydrationStatus: "ready" | "recovered" | "seed";
  nextId: number;
};

type WorkspaceObjectAction =
  | { type: "beginCreate"; objectTypeId: string }
  | { type: "cancelDraft" }
  | { type: "createDocument"; objectTypeId: "page"; title: string }
  | {
      type: "importFile";
      fileName: string;
      mimeType: string;
      objectTypeId: string;
      previewUrl?: string;
      size: number;
      text: string;
    }
  | {
      type: "commitFile";
      fileName: string;
      mimeType: string;
      previewUrl?: string;
      size: number;
    }
  | { type: "commitTask"; title: string }
  | { type: "commitUrl"; url: string }
  | { type: "hydrate"; state: WorkspaceObjectState }
  | { type: "recover" }
  | { type: "selectEntity"; id: string | null }
  | { type: "changeEntityType"; id: string; objectTypeId: "tag" | "task" }
  | { type: "deleteEntity"; id: string }
  | { type: "duplicateEntity"; id: string }
  | {
      type: "updateEntity";
      id: string;
      patch: Record<string, unknown>;
    };

const WORKSPACE_OBJECT_SCHEMA_VERSION = 2;

const objectTypeIds: ObjectTypeId[] = [
  "book",
  "person",
  "area",
  "meeting",
  "definition",
  "idea",
  "place",
  "project",
  "organization",
  "atomic-note",
  "media",
  "travel",
  "quote",
  "page",
  "ai-chat",
  "table",
  "task",
  "image",
  "weblink",
  "tweet",
  "pdf",
  "audio",
  "file",
  "tag",
  "query",
];

const creationFlowByType: Record<ObjectTypeId, CreationFlow> = {
  book: "document",
  person: "document",
  area: "document",
  meeting: "document",
  definition: "document",
  idea: "document",
  place: "document",
  project: "document",
  organization: "document",
  "atomic-note": "document",
  media: "document",
  travel: "document",
  quote: "document",
  page: "document",
  "ai-chat": "document",
  table: "table",
  task: "task",
  image: "file",
  weblink: "url",
  tweet: "url",
  pdf: "file",
  audio: "file",
  file: "file",
  tag: "tag",
  query: "query",
};

function isObjectTypeId(value: string): value is ObjectTypeId {
  return objectTypeIds.includes(value as ObjectTypeId);
}

function getCreationFlow(value: string): CreationFlow | null {
  return isObjectTypeId(value) ? creationFlowByType[value] : null;
}

function createInitialWorkspaceObjectState(): WorkspaceObjectState {
  return {
    activeEntityId: null,
    draft: null,
    entities: [],
    error: null,
    hydrationStatus: "seed",
    nextId: 1,
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
  objectTypeId: ObjectTypeId,
  fields: Record<string, unknown> = {},
  activate = true,
): WorkspaceObjectState {
  const id = `created-${objectTypeId}-${state.nextId}`;
  const base = {
    createdAt: new Date().toISOString(),
    id,
    objectTypeId,
    title: "",
  };
  const flow = creationFlowByType[objectTypeId];
  let entity: WorkspaceEntity;

  if (objectTypeId === "quote") {
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
    entities: [...state.entities, entity],
    error: null,
    nextId: state.nextId + 1,
  };
}

function deriveUrlMetadata(
  objectTypeId: UrlEntity["objectTypeId"],
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
  objectTypeId: FileEntity["objectTypeId"],
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
): WorkspaceObjectError | null {
  if (!isObjectTypeId(objectTypeId)) return "unsupported-object-type";
  const flow = creationFlowByType[objectTypeId];
  if (
    flow === "file" &&
    !acceptsFileForType(
      objectTypeId as FileEntity["objectTypeId"],
      mimeType,
      fileName,
    )
  ) {
    return "incompatible-file";
  }
  if (
    flow === "url" &&
    !deriveUrlMetadata(objectTypeId as UrlEntity["objectTypeId"], text).ok
  ) {
    return "invalid-url";
  }
  return null;
}

function beginWorkspaceObjectCreation(
  state: WorkspaceObjectState,
  objectTypeId: string,
): WorkspaceObjectState {
  const flow = getCreationFlow(objectTypeId);
  if (!flow || !isObjectTypeId(objectTypeId)) {
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
  );
  if (importError || !isObjectTypeId(action.objectTypeId)) {
    return { ...state, error: importError ?? "unsupported-object-type" };
  }
  const objectTypeId = action.objectTypeId;
  const flow = creationFlowByType[objectTypeId];
  const title = action.fileName.replace(/\.[^.]+$/, "").trim();
  if (flow === "file") {
    return createEntity(state, objectTypeId, {
      fileName: action.fileName,
      mimeType: action.mimeType,
      previewUrl: action.previewUrl,
      size: action.size,
      title,
    });
  }
  if (flow === "url") {
    const metadata = deriveUrlMetadata(
      objectTypeId as UrlEntity["objectTypeId"],
      action.text,
    );
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
  objectTypeId: ObjectTypeId,
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
    fileName: action.fileName,
    mimeType: action.mimeType,
    previewUrl: action.previewUrl,
    size: action.size,
    title: action.fileName.replace(/\.[^.]+$/, ""),
  });
}

type EntityMenuAction = Extract<
  WorkspaceObjectAction,
  { type: "changeEntityType" | "deleteEntity" | "duplicateEntity" }
>;

const entityMenuActionTypes = new Set<EntityMenuAction["type"]>([
  "changeEntityType",
  "deleteEntity",
  "duplicateEntity",
]);

function isEntityMenuAction(
  action: WorkspaceObjectAction,
): action is EntityMenuAction {
  return entityMenuActionTypes.has(action.type as EntityMenuAction["type"]);
}

function reduceEntityMenuAction(
  state: WorkspaceObjectState,
  action: EntityMenuAction,
): WorkspaceObjectState {
  if (action.type === "changeEntityType") {
    const source = state.entities.find((entity) => entity.id === action.id);
    if (!source) return state;
    const base = {
      createdAt: source.createdAt,
      id: source.id,
      objectTypeId: action.objectTypeId,
      title: source.title,
    };
    const entity: WorkspaceEntity =
      action.objectTypeId === "task"
        ? {
            ...base,
            body:
              "body" in source
                ? typeof source.body === "string"
                  ? source.body
                  : blockEditorDocumentToPlainText(source.body)
                : "",
            completed: false,
            dueDate: null,
            kind: "task",
            objectTypeId: "task",
          }
        : { ...base, kind: "tag", objectTypeId: "tag" };
    return {
      ...state,
      activeEntityId: entity.id,
      entities: state.entities.map((item) =>
        item.id === action.id ? entity : item,
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
    return {
      ...state,
      activeEntityId: id,
      entities: [...state.entities, duplicate],
      error: null,
      nextId: state.nextId + 1,
    };
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

function workspaceObjectReducer(
  state: WorkspaceObjectState,
  action: WorkspaceObjectAction,
): WorkspaceObjectState {
  if (action.type === "beginCreate") {
    return beginWorkspaceObjectCreation(state, action.objectTypeId);
  }

  if (action.type === "cancelDraft") {
    return { ...state, draft: null, error: null };
  }

  if (action.type === "createDocument") {
    const title = action.title.trim();
    if (!title) return { ...state, error: "required-title" };
    return createEntity(state, action.objectTypeId, { title });
  }

  if (action.type === "importFile") {
    return importWorkspaceObject(state, action);
  }

  if (action.type === "commitTask") {
    return commitTaskDraft(state, action.title);
  }

  if (action.type === "commitUrl") {
    return commitUrlDraft(state, action.url);
  }

  if (action.type === "commitFile") {
    return commitFileDraft(state, action);
  }

  if (action.type === "updateEntity") {
    return {
      ...state,
      entities: state.entities.map((entity) => {
        if (entity.id !== action.id) return entity;
        let patch = action.patch;
        if (
          (entity.kind === "document" || entity.kind === "quote") &&
          Object.hasOwn(action.patch, "body")
        ) {
          const { body: proposedBody, ...rest } = action.patch;
          const body = normalizeBlockEditorDocument(proposedBody);
          patch = body ? { ...rest, body } : rest;
        }
        return {
          ...entity,
          ...patch,
          createdAt: entity.createdAt,
          id: entity.id,
          kind: entity.kind,
          objectTypeId: entity.objectTypeId,
        } as WorkspaceEntity;
      }),
      error: null,
    };
  }

  if (isEntityMenuAction(action)) {
    return reduceEntityMenuAction(state, action);
  }

  if (action.type === "selectEntity") {
    return { ...state, activeEntityId: action.id, error: null };
  }

  if (action.type === "hydrate") {
    return {
      ...action.state,
      draft: null,
      error: null,
      hydrationStatus: "ready",
    };
  }

  if (action.type === "recover") {
    return { ...state, hydrationStatus: "recovered" };
  }

  return state;
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
