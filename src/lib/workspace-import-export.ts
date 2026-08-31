import {
  BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  type BlockEditorDocument,
  type BlockEditorNode,
  blockEditorDocumentFromMarkdown,
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToMarkdown,
  blockEditorDocumentToPlainText,
  documentHasAdvancedMarkdownLossiness,
} from "../editor/document.ts";
import {
  DEFAULT_MAX_MEDIA_BYTES,
  type MediaAsset,
} from "./workspace-media-storage.ts";
import {
  parseWorkspaceObjectSnapshot,
  toWorkspaceObjectSnapshot,
  type WorkspaceObjectSnapshot,
} from "./workspace-object-storage.ts";
import type { WorkspaceStructure } from "./workspace-object-types.ts";
import {
  createInitialWorkspaceObjectState,
  selectActiveEntities,
  type WorkspaceEntity,
  type WorkspaceObjectState,
} from "./workspace-objects.ts";
import type { WorkspacePropertyValueMap } from "./workspace-property-values.ts";

type ImportExportStage = "parse" | "validate" | "map" | "preview" | "commit";

type ImportJobState =
  | "blocked"
  | "committed"
  | "mapped"
  | "parsed"
  | "previewed"
  | "resumable";

type ImportSourceKind =
  | "archive-entry"
  | "csv"
  | "folder-file"
  | "html"
  | "markdown"
  | "media"
  | "native-json"
  | "text";

type ImportExportErrorCode =
  | "ambiguous-mapping"
  | "blocked-file-type"
  | "invalid-archive-entry"
  | "invalid-csv"
  | "invalid-native-export"
  | "job-limit-exceeded"
  | "missing-source"
  | "unresolved-link";

type ImportExportError = {
  readonly code: ImportExportErrorCode;
  readonly message: string;
  readonly path?: string;
  readonly stage: ImportExportStage;
};

type ImportSourceFile = {
  readonly bytes?: number;
  readonly externalId?: string;
  readonly mimeType?: string;
  readonly path: string;
  readonly text?: string;
};

type ImportExportSecurityLimits = {
  readonly allowedMediaMimePrefixes: readonly string[];
  readonly blockedExtensions: readonly string[];
  readonly maxArchiveDepth: number;
  readonly maxFileBytes: number;
  readonly maxFiles: number;
  readonly maxJobBytes: number;
};

type ImportFieldMapping = Readonly<Record<string, string>>;

type ImportObjectPlan = {
  readonly body?: BlockEditorDocument;
  readonly createdAt: string;
  readonly externalId: string;
  readonly id: string;
  readonly kind: WorkspaceEntity["kind"];
  readonly objectTypeId: string;
  readonly path: string;
  readonly propertyValues: WorkspacePropertyValueMap;
  readonly sourceKind: ImportSourceKind;
  readonly title: string;
};

type ImportMediaPlan = {
  readonly asset: MediaAsset;
  readonly externalId: string;
  readonly path: string;
};

type ImportCheckpoint = {
  readonly completedPaths: readonly string[];
  readonly failedPaths: readonly string[];
  readonly nextSourceIndex: number;
  readonly stage: ImportExportStage;
};

type ImportJob = {
  readonly checkpoint: ImportCheckpoint;
  readonly errors: readonly ImportExportError[];
  readonly id: string;
  readonly idMap: Readonly<Record<string, string>>;
  readonly mappings: ImportFieldMapping;
  readonly media: readonly ImportMediaPlan[];
  readonly objects: readonly ImportObjectPlan[];
  readonly state: ImportJobState;
};

type NativeWorkspaceExport = {
  readonly createdAt: string;
  readonly manifest: {
    readonly checksum: string;
    readonly media: readonly {
      readonly byteLength: number;
      readonly hash: string;
      readonly id: string;
      readonly state: MediaAsset["state"];
    }[];
    readonly records: {
      readonly entities: number;
      readonly structures: number;
    };
  };
  readonly snapshot: WorkspaceObjectSnapshot;
  readonly version: 1;
};

type ReducedExportFile = {
  readonly content: string;
  readonly lossiness: readonly string[];
  readonly mimeType: string;
  readonly path: string;
};

type WorkspaceExportBundle = {
  readonly csv: ReducedExportFile;
  readonly markdown: readonly ReducedExportFile[];
  readonly mediaManifest: ReducedExportFile;
  readonly native: NativeWorkspaceExport;
};

type ImportJobOptions = {
  readonly checkpoint?: ImportCheckpoint;
  readonly fieldMapping?: ImportFieldMapping;
  readonly id?: string;
  readonly limits?: Partial<ImportExportSecurityLimits>;
  readonly now?: () => Date;
  readonly sources: readonly ImportSourceFile[];
  readonly state?: WorkspaceObjectState;
};

const NATIVE_EXPORT_VERSION = 1;

const defaultImportExportSecurityLimits: ImportExportSecurityLimits = {
  allowedMediaMimePrefixes: [
    "application/octet-stream",
    "application/pdf",
    "audio/",
    "image/",
    "text/",
  ],
  blockedExtensions: [
    ".bat",
    ".cmd",
    ".com",
    ".exe",
    ".js",
    ".mjs",
    ".msi",
    ".ps1",
    ".scr",
    ".sh",
    ".vbs",
  ],
  maxArchiveDepth: 8,
  maxFileBytes: DEFAULT_MAX_MEDIA_BYTES,
  maxFiles: 1000,
  maxJobBytes: 250 * 1024 * 1024,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fileNameFromPath(path: string): string {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? path;
}

function extensionFor(path: string): string {
  const name = fileNameFromPath(path).toLocaleLowerCase();
  const index = name.lastIndexOf(".");
  return index >= 0 ? name.slice(index) : "";
}

function titleFromPath(path: string): string {
  return (
    fileNameFromPath(path)
      .replace(/\.[^.]+$/, "")
      .trim() || "Untitled"
  );
}

function sourceKindFor(source: ImportSourceFile): ImportSourceKind {
  const extension = extensionFor(source.path);
  const mimeType = source.mimeType?.toLocaleLowerCase() ?? "";
  const extensionKind = extensionSourceKind(extension);
  if (extensionKind) return extensionKind;
  const exactMimeKind = exactMimeSourceKind(mimeType);
  if (exactMimeKind) return exactMimeKind;
  if (isMediaMimeType(mimeType)) return "media";
  return "text";
}

function extensionSourceKind(extension: string): ImportSourceKind | null {
  const extensionKinds: Readonly<Record<string, ImportSourceKind>> = {
    ".csv": "csv",
    ".htm": "html",
    ".html": "html",
    ".json": "native-json",
    ".markdown": "markdown",
    ".md": "markdown",
  };
  return extensionKinds[extension] ?? null;
}

function exactMimeSourceKind(mimeType: string): ImportSourceKind | null {
  const mimeKinds: Readonly<Record<string, ImportSourceKind>> = {
    "application/json": "native-json",
    "application/pdf": "media",
    "text/csv": "csv",
    "text/html": "html",
  };
  return mimeKinds[mimeType] ?? null;
}

function isMediaMimeType(mimeType: string): boolean {
  return mimeType.startsWith("image/") || mimeType.startsWith("audio/");
}

function mergeLimits(
  limits: Partial<ImportExportSecurityLimits> = {},
): ImportExportSecurityLimits {
  return { ...defaultImportExportSecurityLimits, ...limits };
}

function simpleChecksum(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function validateSourceSecurity(
  source: ImportSourceFile,
  limits: ImportExportSecurityLimits,
): ImportExportError | null {
  if (!source.path.trim()) {
    return {
      code: "missing-source",
      message: "Import source must include a stable path.",
      stage: "parse",
    };
  }
  if (source.path.includes("\0")) {
    return {
      code: "invalid-archive-entry",
      message: "Archive entries cannot contain null bytes.",
      path: source.path,
      stage: "parse",
    };
  }
  if (/^[A-Za-z]:[\\/]/.test(source.path) || source.path.startsWith("/")) {
    return {
      code: "invalid-archive-entry",
      message: "Archive entries must be relative paths.",
      path: source.path,
      stage: "parse",
    };
  }
  const parts = source.path.split(/[\\/]+/).filter(Boolean);
  if (parts.includes("..") || parts.length > limits.maxArchiveDepth) {
    return {
      code: "invalid-archive-entry",
      message: "Archive entries cannot escape the import root.",
      path: source.path,
      stage: "parse",
    };
  }
  if (limits.blockedExtensions.includes(extensionFor(source.path))) {
    return {
      code: "blocked-file-type",
      message: "Executable files are blocked during import.",
      path: source.path,
      stage: "validate",
    };
  }
  if ((source.bytes ?? source.text?.length ?? 0) > limits.maxFileBytes) {
    return {
      code: "job-limit-exceeded",
      message: "Import source exceeds the per-file limit.",
      path: source.path,
      stage: "validate",
    };
  }
  return null;
}

function validateJobLimits(
  sources: readonly ImportSourceFile[],
  limits: ImportExportSecurityLimits,
): readonly ImportExportError[] {
  const errors: ImportExportError[] = [];
  if (sources.length > limits.maxFiles) {
    errors.push({
      code: "job-limit-exceeded",
      message: "Import contains more files than allowed.",
      stage: "parse",
    });
  }
  const totalBytes = sources.reduce(
    (total, source) => total + (source.bytes ?? source.text?.length ?? 0),
    0,
  );
  if (totalBytes > limits.maxJobBytes) {
    errors.push({
      code: "job-limit-exceeded",
      message: "Import exceeds the total job size limit.",
      stage: "parse",
    });
  }
  return errors;
}

function stripHtmlToText(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCsvRows(value: string): readonly Record<string, string>[] | null {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return null;
  const headers = lines[0].split(",").map((header) => header.trim());
  if (headers.some((header) => !header)) return null;
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((cell) => cell.trim());
    return Object.fromEntries(
      headers.map((header, index) => [header, cells[index] ?? ""]),
    );
  });
}

function documentWithResolvedLinks(
  text: string,
  idMap: Readonly<Record<string, string>>,
): {
  readonly document: BlockEditorDocument;
  readonly missingExternalIds: readonly string[];
} {
  const missing = new Set<string>();
  const content: BlockEditorNode[] = text.split(/\r?\n/).map((line) => {
    const nodes: BlockEditorNode[] = [];
    let lastIndex = 0;
    const matcher = /\[\[id:([A-Za-z0-9_.:-]+)\]\]/g;
    for (const match of line.matchAll(matcher)) {
      if (match.index > lastIndex) {
        nodes.push({ type: "text", text: line.slice(lastIndex, match.index) });
      }
      const externalId = match[1];
      const objectId = idMap[externalId];
      if (objectId) {
        nodes.push({
          marks: [{ attrs: { objectId }, type: "objectLink" }],
          text: externalId,
          type: "text",
        });
      } else {
        missing.add(externalId);
        nodes.push({ type: "text", text: match[0] });
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      nodes.push({ type: "text", text: line.slice(lastIndex) });
    }
    return {
      type: "paragraph",
      ...(nodes.length > 0 ? { content: nodes } : {}),
    };
  });
  return {
    document: {
      doc: { content, type: "doc" },
      schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    },
    missingExternalIds: Array.from(missing),
  };
}

function objectPlanFromText(
  source: ImportSourceFile,
  id: string,
  idMap: Readonly<Record<string, string>>,
  createdAt: string,
): {
  readonly errors: readonly ImportExportError[];
  readonly plan: ImportObjectPlan;
} {
  const kind = sourceKindFor(source);
  const rawText = source.text ?? "";
  const text = kind === "html" ? stripHtmlToText(rawText) : rawText;
  const linked = documentWithResolvedLinks(text, idMap);
  const body =
    kind === "markdown"
      ? blockEditorDocumentFromMarkdown(text)
      : linked.document;
  return {
    errors: linked.missingExternalIds.map((externalId) => ({
      code: "unresolved-link",
      message: `Cannot resolve imported link target: ${externalId}.`,
      path: source.path,
      stage: "map",
    })),
    plan: {
      body,
      createdAt,
      externalId: source.externalId ?? source.path,
      id,
      kind: "document",
      objectTypeId: "page",
      path: source.path,
      propertyValues: {
        createdAt: { createdAt: { value: createdAt }, type: "createdAt" },
        title: { title: { value: titleFromPath(source.path) }, type: "title" },
      },
      sourceKind: kind,
      title: titleFromPath(source.path),
    },
  };
}

function mediaPlanFromSource(
  source: ImportSourceFile,
  id: string,
  createdAt: string,
): ImportMediaPlan {
  const byteLength = source.bytes ?? source.text?.length ?? 0;
  const hash = simpleChecksum(
    `${source.path}:${byteLength}:${source.text ?? ""}`,
  );
  return {
    asset: {
      byteLength,
      createdAt,
      fileName: fileNameFromPath(source.path),
      hash,
      id,
      mimeType: source.mimeType ?? "application/octet-stream",
      state: "missing",
      storageKey: `media:${hash}`,
      updatedAt: createdAt,
    },
    externalId: source.externalId ?? source.path,
    path: source.path,
  };
}

function stableImportObjectId(index: number, source: ImportSourceFile): string {
  return `imported-page-${index + 1}-${simpleChecksum(source.externalId ?? source.path).slice(-6)}`;
}

function stableImportMediaId(index: number, source: ImportSourceFile): string {
  return `imported-media-${index + 1}-${simpleChecksum(source.externalId ?? source.path).slice(-6)}`;
}

function createImportJob(options: ImportJobOptions): ImportJob {
  const limits = mergeLimits(options.limits);
  const sources = options.checkpoint
    ? options.sources.slice(options.checkpoint.nextSourceIndex)
    : options.sources;
  const errors = createInitialImportErrors(options.sources, sources, limits);
  const createdAt = (options.now ?? (() => new Date()))().toISOString();
  const parseableSources = sources.filter(
    (source) => !errors.some((error) => error.path === source.path),
  );
  const idMap = createImportIdMap(parseableSources);
  const objects: ImportObjectPlan[] = [];
  const media: ImportMediaPlan[] = [];
  const completedPaths: string[] = [];
  const failedPaths = errors.flatMap((error) =>
    error.path ? [error.path] : [],
  );
  const mapping = options.fieldMapping ?? {};

  for (const source of parseableSources) {
    importSourceIntoJob(source, {
      completedPaths,
      createdAt,
      errors,
      failedPaths,
      idMap,
      mapping,
      media,
      objects,
    });
  }

  const hasBlockingErrors = errors.some(
    (error) => error.code !== "unresolved-link",
  );
  return {
    checkpoint: {
      completedPaths,
      failedPaths: Array.from(new Set(failedPaths)),
      nextSourceIndex:
        (options.checkpoint?.nextSourceIndex ?? 0) + completedPaths.length,
      stage: hasBlockingErrors ? "map" : "preview",
    },
    errors,
    id:
      options.id ??
      `import-job-${simpleChecksum(sources.map((source) => source.path).join("|"))}`,
    idMap,
    mappings: mapping,
    media,
    objects,
    state: importJobState(hasBlockingErrors, errors),
  };
}

function createInitialImportErrors(
  allSources: readonly ImportSourceFile[],
  sources: readonly ImportSourceFile[],
  limits: ImportExportSecurityLimits,
): ImportExportError[] {
  return [
    ...validateJobLimits(allSources, limits),
    ...sources.flatMap((source) => {
      const error = validateSourceSecurity(source, limits);
      return error ? [error] : [];
    }),
  ];
}

function createImportIdMap(
  sources: readonly ImportSourceFile[],
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    sources.map((source, index) => {
      const externalId = source.externalId ?? source.path;
      const id =
        sourceKindFor(source) === "media"
          ? stableImportMediaId(index, source)
          : stableImportObjectId(index, source);
      return [externalId, id];
    }),
  );
}

type ImportJobAssembly = {
  readonly completedPaths: string[];
  readonly createdAt: string;
  readonly errors: ImportExportError[];
  readonly failedPaths: string[];
  readonly idMap: Readonly<Record<string, string>>;
  readonly mapping: ImportFieldMapping;
  readonly media: ImportMediaPlan[];
  readonly objects: ImportObjectPlan[];
};

function importSourceIntoJob(
  source: ImportSourceFile,
  job: ImportJobAssembly,
): void {
  const kind = sourceKindFor(source);
  if (kind === "native-json") {
    importNativeJsonSource(source, job);
    return;
  }
  if (kind === "csv") {
    importCsvSource(source, job);
    return;
  }
  importFileSource(source, kind, job);
}

function importNativeJsonSource(
  source: ImportSourceFile,
  job: ImportJobAssembly,
): void {
  const parsed = parseWorkspaceObjectSnapshot(source.text ?? "");
  if (!parsed.ok) {
    job.errors.push({
      code: "invalid-native-export",
      message: "Native workspace export could not be parsed.",
      path: source.path,
      stage: "parse",
    });
    job.failedPaths.push(source.path);
    return;
  }
  job.objects.push(
    ...parsed.state.entities.map((entity) => ({
      createdAt: entity.createdAt,
      externalId: entity.id,
      id: entity.id,
      kind: entity.kind,
      objectTypeId: entity.objectTypeId,
      path: source.path,
      propertyValues: entity.propertyValues,
      sourceKind: "native-json" as const,
      title: entity.title,
    })),
  );
  job.completedPaths.push(source.path);
}

function importCsvSource(
  source: ImportSourceFile,
  job: ImportJobAssembly,
): void {
  const rows = parseCsvRows(source.text ?? "");
  const titleField = job.mapping.title ?? "title";
  if (!rows) {
    job.errors.push({
      code: "invalid-csv",
      message: "CSV import requires a header row and at least one data row.",
      path: source.path,
      stage: "parse",
    });
    job.failedPaths.push(source.path);
    return;
  }
  if (!Object.hasOwn(rows[0], titleField)) {
    job.errors.push({
      code: "ambiguous-mapping",
      message: "CSV import requires an explicit title field mapping.",
      path: source.path,
      stage: "map",
    });
    job.failedPaths.push(source.path);
    return;
  }
  job.objects.push(
    ...rows.map((row, rowIndex) =>
      objectPlanFromCsvRow(row, {
        createdAt: job.createdAt,
        idIndex: job.objects.length + rowIndex + 1,
        rowNumber: rowIndex + 1,
        source,
        titleField,
      }),
    ),
  );
  job.completedPaths.push(source.path);
}

function objectPlanFromCsvRow(
  row: Record<string, string>,
  options: {
    readonly createdAt: string;
    readonly idIndex: number;
    readonly rowNumber: number;
    readonly source: ImportSourceFile;
    readonly titleField: string;
  },
): ImportObjectPlan {
  const externalId = `${options.source.externalId ?? options.source.path}#${
    options.rowNumber
  }`;
  const title = row[options.titleField] || "Untitled";
  return {
    body: blockEditorDocumentFromPlainText(row.body ?? row.content ?? ""),
    createdAt: options.createdAt,
    externalId,
    id: `imported-page-${options.idIndex}-${simpleChecksum(externalId).slice(-6)}`,
    kind: "document",
    objectTypeId: "page",
    path: options.source.path,
    propertyValues: {
      createdAt: {
        createdAt: { value: options.createdAt },
        type: "createdAt",
      },
      title: { title: { value: title }, type: "title" },
    },
    sourceKind: "csv",
    title,
  };
}

function importFileSource(
  source: ImportSourceFile,
  kind: ImportSourceKind,
  job: ImportJobAssembly,
): void {
  const id = job.idMap[source.externalId ?? source.path];
  if (kind === "media") {
    job.media.push(mediaPlanFromSource(source, id, job.createdAt));
  } else {
    const parsed = objectPlanFromText(source, id, job.idMap, job.createdAt);
    job.objects.push(parsed.plan);
    job.errors.push(...parsed.errors);
  }
  job.completedPaths.push(source.path);
}

function importJobState(
  hasBlockingErrors: boolean,
  errors: readonly ImportExportError[],
): ImportJobState {
  if (hasBlockingErrors) return "blocked";
  return errors.length > 0 ? "resumable" : "previewed";
}

function entityFromPlan(plan: ImportObjectPlan): WorkspaceEntity {
  const base = {
    createdAt: plan.createdAt,
    id: plan.id,
    objectTypeId: plan.objectTypeId,
    propertyValues: plan.propertyValues,
    title: plan.title,
  };
  if (plan.kind === "document") {
    return {
      ...base,
      body: plan.body ?? blockEditorDocumentFromPlainText(""),
      collections: [],
      kind: "document",
      tags: [],
    };
  }
  return {
    ...base,
    body: plan.body ?? blockEditorDocumentFromPlainText(""),
    collections: [],
    kind: "quote",
    tags: [],
  };
}

function commitImportJob(
  state: WorkspaceObjectState,
  job: ImportJob,
): { readonly job: ImportJob; readonly state: WorkspaceObjectState } {
  if (job.state === "blocked") return { job, state };
  const entities = job.objects.map(entityFromPlan);
  const nextState = {
    ...state,
    activeEntityId: entities.at(-1)?.id ?? state.activeEntityId,
    entities: [...state.entities, ...entities],
    nextId: state.nextId + entities.length,
  };
  return {
    job: {
      ...job,
      checkpoint: { ...job.checkpoint, stage: "commit" },
      state: "committed",
    },
    state: nextState,
  };
}

function createNativeWorkspaceExport(
  state: WorkspaceObjectState,
  mediaAssets: readonly MediaAsset[] = [],
  now: () => Date = () => new Date(),
): NativeWorkspaceExport {
  const snapshot = toWorkspaceObjectSnapshot(state);
  const media = mediaAssets.map((asset) => ({
    byteLength: asset.byteLength,
    hash: asset.hash,
    id: asset.id,
    state: asset.state,
  }));
  return {
    createdAt: now().toISOString(),
    manifest: {
      checksum: simpleChecksum(JSON.stringify({ media, snapshot })),
      media,
      records: {
        entities: snapshot.entities.length,
        structures: snapshot.structures.length,
      },
    },
    snapshot,
    version: NATIVE_EXPORT_VERSION,
  };
}

function parseNativeWorkspaceExport(value: unknown):
  | { readonly ok: false; readonly error: ImportExportError }
  | {
      readonly ok: true;
      readonly state: WorkspaceObjectState;
    } {
  if (
    !isRecord(value) ||
    value.version !== NATIVE_EXPORT_VERSION ||
    !isRecord(value.snapshot)
  ) {
    return {
      error: {
        code: "invalid-native-export",
        message: "Native export version is not supported.",
        stage: "parse",
      },
      ok: false,
    };
  }
  const parsed = parseWorkspaceObjectSnapshot(JSON.stringify(value.snapshot));
  return parsed.ok
    ? { ok: true, state: parsed.state }
    : {
        error: {
          code: "invalid-native-export",
          message: "Native export snapshot is invalid.",
          stage: "parse",
        },
        ok: false,
      };
}

function reducedMarkdownForEntity(entity: WorkspaceEntity): ReducedExportFile {
  const documentBody =
    entity.kind === "document" || entity.kind === "quote" ? entity.body : null;
  const body = documentBody
    ? blockEditorDocumentToMarkdown(documentBody)
    : "body" in entity && typeof entity.body === "string"
      ? entity.body
      : "";
  const metadata = [
    "---",
    `id: ${entity.id}`,
    `type: ${entity.objectTypeId}`,
    `createdAt: ${entity.createdAt}`,
    "---",
    "",
  ].join("\n");
  return {
    content: `${metadata}# ${entity.title}\n\n${body}`.trimEnd(),
    lossiness: [
      "Markdown export is readable but does not preserve all workspace views, typed value semantics, or media bytes.",
      ...(documentBody && documentHasAdvancedMarkdownLossiness(documentBody)
        ? [
            "Advanced block layouts, groups, interactive embeds, and transclusions are exported in a reduced readable form.",
          ]
        : []),
    ],
    mimeType: "text/markdown",
    path: `${entity.id}.md`,
  };
}

function csvEscape(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function createWorkspaceExportBundle(
  state: WorkspaceObjectState,
  mediaAssets: readonly MediaAsset[] = [],
  now: () => Date = () => new Date(),
): WorkspaceExportBundle {
  const native = createNativeWorkspaceExport(state, mediaAssets, now);
  const activeEntities = selectActiveEntities(state);
  const markdown = activeEntities.map(reducedMarkdownForEntity);
  const csvRows = [
    ["id", "type", "title", "createdAt", "text"],
    ...activeEntities.map((entity) => [
      entity.id,
      entity.objectTypeId,
      entity.title,
      entity.createdAt,
      entity.kind === "document" || entity.kind === "quote"
        ? blockEditorDocumentToPlainText(entity.body)
        : "",
    ]),
  ];
  return {
    csv: {
      content: csvRows
        .map((row) => row.map((cell) => csvEscape(cell)).join(","))
        .join("\n"),
      lossiness: [
        "CSV export flattens objects and omits non-tabular layout details.",
      ],
      mimeType: "text/csv",
      path: "objects.csv",
    },
    markdown,
    mediaManifest: {
      content: JSON.stringify(native.manifest.media, null, 2),
      lossiness: [
        "Media manifest records integrity metadata; media bytes travel as separate files.",
      ],
      mimeType: "application/json",
      path: "media-manifest.json",
    },
    native,
  };
}

function emptyWorkspaceForImport(
  structures?: readonly WorkspaceStructure[],
): WorkspaceObjectState {
  return structures
    ? { ...createInitialWorkspaceObjectState(), structures }
    : createInitialWorkspaceObjectState();
}

export type {
  ImportCheckpoint,
  ImportExportError,
  ImportExportErrorCode,
  ImportExportSecurityLimits,
  ImportFieldMapping,
  ImportJob,
  ImportJobState,
  ImportObjectPlan,
  ImportSourceFile,
  ImportSourceKind,
  NativeWorkspaceExport,
  ReducedExportFile,
  WorkspaceExportBundle,
};
export {
  commitImportJob,
  createImportJob,
  createNativeWorkspaceExport,
  createWorkspaceExportBundle,
  defaultImportExportSecurityLimits,
  emptyWorkspaceForImport,
  NATIVE_EXPORT_VERSION,
  parseNativeWorkspaceExport,
};
