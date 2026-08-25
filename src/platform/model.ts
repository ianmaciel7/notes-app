import {
  type BlockId,
  type Clock,
  DomainError,
  type IdFactory,
  type IsoDateTime,
  type ObjectId,
  type PropertyId,
  type SpaceId,
  type StructureId,
  deepClone,
  systemClock,
  systemIdFactory,
} from "./types";

export type BlockKind =
  | "paragraph"
  | "heading"
  | "bullet-list"
  | "numbered-list"
  | "task-list"
  | "blockquote"
  | "code"
  | "divider"
  | "object-reference"
  | "block-reference"
  | "media";

export type TextMark =
  | { readonly kind: "bold" }
  | { readonly kind: "italic" }
  | { readonly kind: "code" }
  | { readonly kind: "link"; readonly href: string };

export type InlineText = {
  readonly text: string;
  readonly marks?: readonly TextMark[];
};

export type BlockNode = {
  readonly id: BlockId;
  readonly kind: BlockKind;
  readonly content: readonly InlineText[];
  readonly children: readonly BlockNode[];
  readonly attrs?: Readonly<Record<string, unknown>>;
};

export type BlockDocument = {
  readonly schemaVersion: 1;
  readonly blocks: readonly BlockNode[];
};

export type WorkspaceObject = {
  readonly id: ObjectId;
  readonly spaceId: SpaceId;
  readonly structureId: StructureId;
  readonly title: string;
  readonly aliases: readonly string[];
  readonly description: string;
  readonly properties: Readonly<Record<PropertyId, unknown>>;
  readonly document: BlockDocument;
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
  readonly revision: number;
  readonly deletedAt?: IsoDateTime;
};

export type CreateWorkspaceObjectInput = {
  readonly spaceId: SpaceId;
  readonly structureId: StructureId;
  readonly title?: string;
  readonly aliases?: readonly string[];
  readonly description?: string;
  readonly properties?: Readonly<Record<PropertyId, unknown>>;
  readonly document?: BlockDocument;
};

export function createEmptyDocument(): BlockDocument {
  return { schemaVersion: 1, blocks: [] };
}

export function createWorkspaceObject(
  input: CreateWorkspaceObjectInput,
  options: { readonly idFactory?: IdFactory; readonly clock?: Clock } = {},
): WorkspaceObject {
  const idFactory = options.idFactory ?? systemIdFactory;
  const clock = options.clock ?? systemClock;
  const now = clock();
  const document = normalizeBlockDocument(
    input.document ?? createEmptyDocument(),
    idFactory,
  );

  return {
    id: idFactory("obj") as ObjectId,
    spaceId: input.spaceId,
    structureId: input.structureId,
    title: input.title?.trim() ?? "",
    aliases: normalizeAliases(input.aliases ?? []),
    description: input.description?.trim() ?? "",
    properties: deepClone(input.properties ?? {}),
    document,
    createdAt: now,
    updatedAt: now,
    revision: 1,
  };
}

export function updateWorkspaceObject(
  object: WorkspaceObject,
  patch: Partial<
    Pick<
      WorkspaceObject,
      "title" | "aliases" | "description" | "properties" | "document"
    >
  >,
  clock: Clock = systemClock,
): WorkspaceObject {
  if (object.deletedAt) {
    throw new DomainError("invalid-state", "Deleted objects cannot be updated.", {
      objectId: object.id,
    });
  }

  return {
    ...object,
    title: patch.title === undefined ? object.title : patch.title.trim(),
    aliases:
      patch.aliases === undefined
        ? object.aliases
        : normalizeAliases(patch.aliases),
    description:
      patch.description === undefined
        ? object.description
        : patch.description.trim(),
    properties:
      patch.properties === undefined
        ? object.properties
        : deepClone(patch.properties),
    document:
      patch.document === undefined
        ? object.document
        : normalizeBlockDocument(patch.document),
    updatedAt: clock(),
    revision: object.revision + 1,
  };
}

export function tombstoneWorkspaceObject(
  object: WorkspaceObject,
  clock: Clock = systemClock,
): WorkspaceObject {
  if (object.deletedAt) return object;
  const now = clock();
  return {
    ...object,
    deletedAt: now,
    updatedAt: now,
    revision: object.revision + 1,
  };
}

export function createBlock(
  kind: BlockKind,
  input: {
    readonly text?: string;
    readonly content?: readonly InlineText[];
    readonly children?: readonly BlockNode[];
    readonly attrs?: Readonly<Record<string, unknown>>;
  } = {},
  idFactory: IdFactory = systemIdFactory,
): BlockNode {
  return {
    id: idFactory("blk") as BlockId,
    kind,
    content: deepClone(
      input.content ?? (input.text ? [{ text: input.text }] : []),
    ),
    children: deepClone(input.children ?? []),
    attrs: input.attrs ? deepClone(input.attrs) : undefined,
  };
}

export function normalizeBlockDocument(
  document: BlockDocument,
  idFactory: IdFactory = systemIdFactory,
): BlockDocument {
  if (document.schemaVersion !== 1 || !Array.isArray(document.blocks)) {
    throw new DomainError("invalid-input", "Unsupported block document schema.");
  }

  const seen = new Set<string>();
  return {
    schemaVersion: 1,
    blocks: document.blocks.map((block) => normalizeBlock(block, seen, idFactory)),
  };
}

function normalizeBlock(
  block: BlockNode,
  seen: Set<string>,
  idFactory: IdFactory,
): BlockNode {
  if (!isBlockKind(block.kind)) {
    throw new DomainError("invalid-input", "Unknown block kind.", {
      kind: block.kind,
    });
  }

  let id = typeof block.id === "string" ? block.id.trim() : "";
  if (!id || seen.has(id)) id = idFactory("blk");
  seen.add(id);

  return {
    id: id as BlockId,
    kind: block.kind,
    content: normalizeInlineContent(block.content),
    children: (block.children ?? []).map((child) =>
      normalizeBlock(child, seen, idFactory),
    ),
    attrs:
      block.attrs && typeof block.attrs === "object"
        ? deepClone(block.attrs)
        : undefined,
  };
}

function normalizeInlineContent(content: readonly InlineText[]): InlineText[] {
  if (!Array.isArray(content)) return [];
  return content.map((item) => ({
    text: typeof item.text === "string" ? item.text : "",
    marks: item.marks ? deepClone(item.marks) : undefined,
  }));
}

function isBlockKind(value: string): value is BlockKind {
  return new Set<BlockKind>([
    "paragraph",
    "heading",
    "bullet-list",
    "numbered-list",
    "task-list",
    "blockquote",
    "code",
    "divider",
    "object-reference",
    "block-reference",
    "media",
  ]).has(value as BlockKind);
}

function normalizeAliases(values: readonly string[]): string[] {
  const normalized = values.map((value) => value.trim()).filter(Boolean);
  return [...new Set(normalized)];
}

export function findBlock(
  document: BlockDocument,
  blockId: BlockId,
): BlockNode | null {
  const queue = [...document.blocks];
  while (queue.length > 0) {
    const block = queue.shift();
    if (!block) continue;
    if (block.id === blockId) return block;
    queue.unshift(...block.children);
  }
  return null;
}

export function insertBlock(
  document: BlockDocument,
  block: BlockNode,
  index = document.blocks.length,
  idFactory: IdFactory = systemIdFactory,
): BlockDocument {
  const normalized = normalizeBlockDocument(
    { schemaVersion: 1, blocks: [block] },
    idFactory,
  ).blocks[0];
  if (!normalized) return document;

  const existingIds = collectBlockIds(document);
  const safeBlock = existingIds.has(normalized.id)
    ? cloneBlockWithFreshIds(normalized, idFactory)
    : normalized;
  const target = Math.max(0, Math.min(index, document.blocks.length));
  const blocks = [...document.blocks];
  blocks.splice(target, 0, safeBlock);
  return { schemaVersion: 1, blocks };
}

export function reorderBlock(
  document: BlockDocument,
  fromIndex: number,
  toIndex: number,
): BlockDocument {
  if (
    fromIndex < 0 ||
    fromIndex >= document.blocks.length ||
    toIndex < 0 ||
    toIndex >= document.blocks.length
  ) {
    throw new DomainError("invalid-input", "Block index is out of range.", {
      fromIndex,
      toIndex,
    });
  }

  const blocks = [...document.blocks];
  const [block] = blocks.splice(fromIndex, 1);
  if (!block) return document;
  blocks.splice(toIndex, 0, block);
  return { schemaVersion: 1, blocks };
}

export function duplicateBlock(
  document: BlockDocument,
  blockId: BlockId,
  idFactory: IdFactory = systemIdFactory,
): BlockDocument {
  const index = document.blocks.findIndex((block) => block.id === blockId);
  if (index < 0) {
    throw new DomainError("not-found", "Block was not found.", { blockId });
  }
  const source = document.blocks[index];
  if (!source) return document;
  return insertBlock(
    document,
    cloneBlockWithFreshIds(source, idFactory),
    index + 1,
    idFactory,
  );
}

export function splitTextBlock(
  document: BlockDocument,
  blockId: BlockId,
  offset: number,
  idFactory: IdFactory = systemIdFactory,
): BlockDocument {
  const index = document.blocks.findIndex((block) => block.id === blockId);
  const source = document.blocks[index];
  if (!source) {
    throw new DomainError("not-found", "Block was not found.", { blockId });
  }
  const text = source.content.map((item) => item.text).join("");
  const safeOffset = Math.max(0, Math.min(offset, text.length));
  const left: BlockNode = {
    ...source,
    content: [{ text: text.slice(0, safeOffset) }],
  };
  const right = createBlock(
    source.kind,
    { text: text.slice(safeOffset), attrs: source.attrs },
    idFactory,
  );
  const blocks = [...document.blocks];
  blocks.splice(index, 1, left, right);
  return { schemaVersion: 1, blocks };
}

export function mergeAdjacentTextBlocks(
  document: BlockDocument,
  firstBlockId: BlockId,
): BlockDocument {
  const index = document.blocks.findIndex((block) => block.id === firstBlockId);
  const first = document.blocks[index];
  const second = document.blocks[index + 1];
  if (!first || !second) {
    throw new DomainError("invalid-state", "Adjacent blocks are required.", {
      firstBlockId,
    });
  }
  const merged: BlockNode = {
    ...first,
    content: [...first.content, ...second.content],
  };
  const blocks = [...document.blocks];
  blocks.splice(index, 2, merged);
  return { schemaVersion: 1, blocks };
}

export function cloneBlockWithFreshIds(
  block: BlockNode,
  idFactory: IdFactory = systemIdFactory,
): BlockNode {
  return {
    ...deepClone(block),
    id: idFactory("blk") as BlockId,
    children: block.children.map((child) =>
      cloneBlockWithFreshIds(child, idFactory),
    ),
  };
}

export function collectBlockIds(document: BlockDocument): Set<BlockId> {
  const ids = new Set<BlockId>();
  const queue = [...document.blocks];
  while (queue.length > 0) {
    const block = queue.shift();
    if (!block) continue;
    ids.add(block.id);
    queue.unshift(...block.children);
  }
  return ids;
}

export function documentText(document: BlockDocument): string {
  const lines: string[] = [];
  const queue = [...document.blocks];
  while (queue.length > 0) {
    const block = queue.shift();
    if (!block) continue;
    lines.push(block.content.map((item) => item.text).join(""));
    queue.unshift(...block.children);
  }
  return lines.filter(Boolean).join("\n");
}
