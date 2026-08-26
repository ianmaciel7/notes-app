import type {
  StructureLifecycleKind,
  WorkspaceStructure,
} from "./workspace-object-types.ts";

export type WorkspaceObjectCreationSurface =
  | "instant"
  | "file-capture"
  | "task-capture"
  | "url-capture";

export type WorkspaceObjectWriteSurface =
  | "block-document"
  | "file"
  | "query"
  | "quote-document"
  | "table"
  | "tag-title"
  | "task"
  | "url";

export type WorkspaceObjectLifecycleScenario = {
  readonly creationSurface: WorkspaceObjectCreationSurface;
  readonly lifecycleKind: StructureLifecycleKind;
  readonly opensCreatedEntity: boolean;
  readonly projection: "entity";
  readonly writeSurface: WorkspaceObjectWriteSurface;
};

const lifecycleScenarioByKind = {
  document: {
    creationSurface: "instant",
    lifecycleKind: "document",
    opensCreatedEntity: true,
    projection: "entity",
    writeSurface: "block-document",
  },
  file: {
    creationSurface: "file-capture",
    lifecycleKind: "file",
    opensCreatedEntity: true,
    projection: "entity",
    writeSurface: "file",
  },
  query: {
    creationSurface: "instant",
    lifecycleKind: "query",
    opensCreatedEntity: true,
    projection: "entity",
    writeSurface: "query",
  },
  quote: {
    creationSurface: "instant",
    lifecycleKind: "quote",
    opensCreatedEntity: true,
    projection: "entity",
    writeSurface: "quote-document",
  },
  table: {
    creationSurface: "instant",
    lifecycleKind: "table",
    opensCreatedEntity: true,
    projection: "entity",
    writeSurface: "table",
  },
  tag: {
    creationSurface: "instant",
    lifecycleKind: "tag",
    opensCreatedEntity: true,
    projection: "entity",
    writeSurface: "tag-title",
  },
  task: {
    creationSurface: "task-capture",
    lifecycleKind: "task",
    opensCreatedEntity: true,
    projection: "entity",
    writeSurface: "task",
  },
  url: {
    creationSurface: "url-capture",
    lifecycleKind: "url",
    opensCreatedEntity: true,
    projection: "entity",
    writeSurface: "url",
  },
} as const satisfies Record<
  StructureLifecycleKind,
  WorkspaceObjectLifecycleScenario
>;

/**
 * Evidence matrix for the object families explicitly required by the P0
 * workspace-parity OpenSpec. Presets are templates: after instantiation they
 * still derive behavior from the Structure lifecycle kind instead of becoming
 * a second mutable object-type registry.
 */
export const PROTOTYPE_OBJECT_LIFECYCLE_EVIDENCE = {
  "ai-chat": "document",
  "atomic-note": "document",
  area: "document",
  audio: "file",
  book: "document",
  definition: "document",
  file: "file",
  idea: "document",
  image: "file",
  media: "document",
  meeting: "document",
  organization: "document",
  page: "document",
  pdf: "file",
  person: "document",
  place: "document",
  project: "document",
  query: "query",
  quote: "quote",
  table: "table",
  tag: "tag",
  task: "task",
  travel: "document",
  tweet: "url",
  weblink: "url",
} as const satisfies Record<string, StructureLifecycleKind>;

export function getWorkspaceObjectLifecycleScenario(
  structure: WorkspaceStructure,
): WorkspaceObjectLifecycleScenario | null {
  if (structure.ownership === "reserved") return null;
  return lifecycleScenarioByKind[structure.lifecycleKind];
}

export function isDeferredWorkspaceObjectCreation(
  scenario: WorkspaceObjectLifecycleScenario,
): boolean {
  return scenario.creationSurface !== "instant";
}
