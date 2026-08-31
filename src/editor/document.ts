import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { MarkdownManager } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import {
  isTableBlockNode,
  TABLE_BLOCK_TYPE,
  tableBlockToMarkdown,
  tableBlockToPlainText,
} from "./table-block.ts";

const BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION = 3 as const;
const LEGACY_BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION = 1 as const;
const PREVIOUS_BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION = 2 as const;
const BLOCK_ID_PREFIX = "block:";
const MAX_BLOCK_DOCUMENT_DEPTH = 8;

type BlockId = string & { readonly __blockId: unique symbol };

type BlockEditorMark =
  | { type: "bold" | "italic" | "code" }
  | { type: "blockLink"; attrs: { blockId: string; objectId: string } }
  | { type: "link"; attrs: { href: string } }
  | { type: "objectLink"; attrs: { objectId: string } };

type BlockEditorNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: BlockEditorNode[];
  marks?: BlockEditorMark[];
  text?: string;
};

type BlockEditorDocument = {
  schemaVersion: typeof BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION;
  doc: {
    type: "doc";
    content: BlockEditorNode[];
  };
};

const blockTypes = new Set([
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "taskList",
  "taskItem",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  TABLE_BLOCK_TYPE,
  "highlightBlock",
  "mathBlock",
  "columnLayout",
  "column",
  "groupBlock",
  "objectBlock",
  "unsupportedBlock",
]);
const referenceableBlockTypes = new Set(blockTypes);
const inlineTypes = new Set(["text", "hardBreak", "objectEmbed"]);
const advancedBlockTypes = new Set([
  "highlightBlock",
  "mathBlock",
  "columnLayout",
  "column",
  "groupBlock",
  "objectBlock",
  "unsupportedBlock",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function isSafeBlockEditorHref(value: string): boolean {
  return /^(https?:|mailto:|\/|#|\.{1,2}\/|object:[A-Za-z0-9_.:-]+$|block:[A-Za-z0-9_.:-]+#[A-Za-z0-9_.:-]+$)/i.test(
    value,
  );
}

function isStableReferenceId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_.:-]+$/.test(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "string";
}

function isBlockWidth(value: unknown): boolean {
  return (
    value === undefined ||
    value === "content" ||
    value === "wide" ||
    value === "full"
  );
}

function isBlockAppearance(value: unknown): boolean {
  return (
    value === undefined ||
    value === "plain" ||
    value === "card" ||
    value === "callout"
  );
}

function isHighlightColor(value: unknown): boolean {
  return (
    value === undefined ||
    value === "yellow" ||
    value === "blue" ||
    value === "green" ||
    value === "pink" ||
    value === "purple"
  );
}

function isObjectBlockViewKind(value: unknown): boolean {
  return (
    value === "inline" ||
    value === "small-card" ||
    value === "wide-card" ||
    value === "embed" ||
    value === "transclusion"
  );
}

function isObjectBlockState(value: unknown): boolean {
  return (
    value === undefined ||
    value === "available" ||
    value === "missing" ||
    value === "permission-denied" ||
    value === "offline" ||
    value === "recursive" ||
    value === "read-only"
  );
}

function isMediaDisplayVariant(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === "preview" ||
    value === "thumbnail" ||
    value === "audio" ||
    value === "attachment"
  );
}

function isSafeSourceText(value: unknown): value is string {
  return typeof value === "string" && !/[<>]/.test(value);
}

function createBlockId(): BlockId {
  return `${BLOCK_ID_PREFIX}${crypto.randomUUID()}` as BlockId;
}

function copyBlockEditorNodeWithFreshIds(
  node: BlockEditorNode,
): BlockEditorNode {
  return {
    ...node,
    ...(isReferenceableBlockType(node.type)
      ? { attrs: { ...node.attrs, id: createBlockId() } }
      : node.attrs
        ? { attrs: { ...node.attrs } }
        : {}),
    ...(node.content
      ? {
          content: node.content.map(copyBlockEditorNodeWithFreshIds),
        }
      : {}),
    ...(node.marks ? { marks: structuredClone(node.marks) } : {}),
  };
}

function copyBlockEditorDocumentWithFreshIds(
  document: BlockEditorDocument,
): BlockEditorDocument {
  return {
    ...document,
    doc: {
      ...document.doc,
      content: document.doc.content.map(copyBlockEditorNodeWithFreshIds),
    },
  };
}

function sanitizeIdNamespace(namespace: string): string {
  const safe = namespace
    .replace(/[^A-Za-z0-9_.:-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return safe || "legacy";
}

function createMigratedBlockId(
  namespace: string,
  path: readonly number[],
): BlockId {
  return `${BLOCK_ID_PREFIX}${sanitizeIdNamespace(namespace)}:${path.join(".") || "0"}` as BlockId;
}

function isReferenceableBlockType(type: string): boolean {
  return referenceableBlockTypes.has(type);
}

function isAdvancedBlockType(type: string): boolean {
  return advancedBlockTypes.has(type);
}

function isOptionalLinkAttribute(value: unknown) {
  return value === undefined || value === null || typeof value === "string";
}

function hasCanonicalizableLinkAttrs(value: unknown) {
  if (!isRecord(value)) return false;
  if (!hasOnlyKeys(value, ["href", "target", "rel", "class", "title"])) {
    return false;
  }
  if (typeof value.href !== "string" || !isSafeBlockEditorHref(value.href)) {
    return false;
  }
  return [value.target, value.rel, value.class, value.title].every(
    isOptionalLinkAttribute,
  );
}

function isCanonicalizableLink(value: Record<string, unknown>) {
  if (value.type !== "link") return false;
  if (!hasOnlyKeys(value, ["type", "attrs"])) return false;
  return hasCanonicalizableLinkAttrs(value.attrs);
}

function shouldDropParagraphSizeDefault(value: Record<string, unknown>) {
  if (value.type !== "paragraph") return false;
  if (!isRecord(value.attrs)) return false;
  return value.attrs.size === null || value.attrs.size === undefined;
}

function shouldDropOrderedListDefaults(value: Record<string, unknown>) {
  if (value.type !== "orderedList") return false;
  if (!isRecord(value.attrs)) return false;
  if (value.attrs.id !== undefined) return false;
  if (value.attrs.start !== 1) return false;
  return value.attrs.type === null || value.attrs.type === undefined;
}

function canonicalizeKnownEditorDefaults(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalizeKnownEditorDefaults);
  if (!isRecord(value)) return value;

  const canonical: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) {
    canonical[key] = canonicalizeKnownEditorDefaults(nested);
  }

  if (isCanonicalizableLink(value) && isRecord(value.attrs)) {
    canonical.attrs = { href: value.attrs.href };
  }

  if (shouldDropParagraphSizeDefault(value) && isRecord(canonical.attrs)) {
    delete canonical.attrs.size;
    if (Object.keys(canonical.attrs).length === 0) delete canonical.attrs;
  }
  if (shouldDropOrderedListDefaults(value)) delete canonical.attrs;
  return canonical;
}

function migrateReferenceableBlockIds(
  value: unknown,
  namespace: string,
): unknown {
  if (
    !isRecord(value) ||
    !isRecord(value.doc) ||
    !Array.isArray(value.doc.content)
  ) {
    return value;
  }

  const seenIds = new Set<string>();
  const migrateNode = (node: unknown, path: readonly number[]): unknown => {
    if (!isRecord(node) || typeof node.type !== "string") return node;
    const migrated: Record<string, unknown> = { ...node };

    if (isReferenceableBlockType(node.type)) {
      const attrs = isRecord(node.attrs) ? { ...node.attrs } : {};
      const currentId = attrs.id;
      let nextId =
        isStableReferenceId(currentId) && !seenIds.has(currentId)
          ? currentId
          : createMigratedBlockId(namespace, path);
      let collision = 2;
      while (seenIds.has(nextId)) {
        nextId = `${createMigratedBlockId(namespace, path)}-${collision}`;
        collision += 1;
      }
      attrs.id = nextId;
      seenIds.add(nextId);
      migrated.attrs = attrs;
    }

    if (Array.isArray(node.content)) {
      migrated.content = node.content.map((child, index) =>
        migrateNode(child, [...path, index]),
      );
    }
    return migrated;
  };

  return {
    ...value,
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      ...value.doc,
      content: value.doc.content.map((node, index) =>
        migrateNode(node, [index]),
      ),
    },
  };
}

function createUnsupportedBlock(
  node: Record<string, unknown>,
  namespace: string,
  path: readonly number[],
): BlockEditorNode {
  return {
    type: "unsupportedBlock",
    attrs: {
      id: createMigratedBlockId(namespace, path),
      originalType: typeof node.type === "string" ? node.type : "unknown",
      reason: "unsupported-node",
      source: JSON.stringify(node),
    },
  };
}

function migrateAdvancedNodes(value: unknown, namespace: string): unknown {
  if (
    !isRecord(value) ||
    !isRecord(value.doc) ||
    !Array.isArray(value.doc.content)
  ) {
    return value;
  }

  const migrateNode = (node: unknown, path: readonly number[]): unknown => {
    if (!isRecord(node) || typeof node.type !== "string") return node;
    if (
      value.schemaVersion !== undefined &&
      value.schemaVersion !== LEGACY_BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION &&
      value.schemaVersion !== PREVIOUS_BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION &&
      value.schemaVersion !== BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION &&
      !blockTypes.has(node.type) &&
      !inlineTypes.has(node.type)
    ) {
      return createUnsupportedBlock(node, namespace, path);
    }

    const migrated: Record<string, unknown> = { ...node };
    if (Array.isArray(node.content)) {
      migrated.content = node.content.map((child, index) =>
        migrateNode(child, [...path, index]),
      );
    }
    return migrated;
  };

  return {
    ...value,
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      ...value.doc,
      content: value.doc.content.map((node, index) =>
        migrateNode(node, [index]),
      ),
    },
  };
}

function isSimpleMark(value: Record<string, unknown>) {
  return (
    ["bold", "italic", "code"].includes(value.type as string) &&
    hasOnlyKeys(value, ["type"])
  );
}

function isObjectLinkMark(value: Record<string, unknown>) {
  return (
    value.type === "objectLink" &&
    hasOnlyKeys(value, ["type", "attrs"]) &&
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["objectId"]) &&
    isStableReferenceId(value.attrs.objectId)
  );
}

function isBlockLinkMark(value: Record<string, unknown>) {
  return (
    value.type === "blockLink" &&
    hasOnlyKeys(value, ["type", "attrs"]) &&
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["blockId", "objectId"]) &&
    isStableReferenceId(value.attrs.blockId) &&
    isStableReferenceId(value.attrs.objectId)
  );
}

function isHrefLinkMark(value: Record<string, unknown>) {
  return (
    value.type === "link" &&
    hasOnlyKeys(value, ["type", "attrs"]) &&
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["href"]) &&
    typeof value.attrs.href === "string" &&
    isSafeBlockEditorHref(value.attrs.href)
  );
}

function isMark(value: unknown): value is BlockEditorMark {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  return (
    isSimpleMark(value) ||
    isObjectLinkMark(value) ||
    isBlockLinkMark(value) ||
    isHrefLinkMark(value)
  );
}

function isTextNode(value: Record<string, unknown>) {
  if (!hasOnlyKeys(value, ["type", "text", "marks"])) return false;
  if (typeof value.text !== "string" || value.text.length === 0) return false;
  if (value.marks === undefined) return true;
  return Array.isArray(value.marks) && value.marks.every(isMark);
}

function hasValidContent(value: Record<string, unknown>, depth: number) {
  if (value.content === undefined) return true;
  return (
    depth < MAX_BLOCK_DOCUMENT_DEPTH &&
    Array.isArray(value.content) &&
    value.content.every((child) => isNode(child, depth + 1))
  );
}

function hasStableBlockId(attrs: Record<string, unknown>): boolean {
  return isStableReferenceId(attrs.id);
}

function isParagraphNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["id", "size", "emoji", "toggleCollapsed"]) &&
    hasStableBlockId(value.attrs) &&
    (value.attrs.size === undefined || value.attrs.size === "small") &&
    isOptionalString(value.attrs.emoji) &&
    (value.attrs.toggleCollapsed === undefined ||
      typeof value.attrs.toggleCollapsed === "boolean")
  );
}

function isHeadingNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["id", "level"]) &&
    [1, 2, 3, 4].includes(value.attrs.level as number) &&
    hasStableBlockId(value.attrs)
  );
}

function isTaskItemNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["checked", "id"]) &&
    typeof value.attrs.checked === "boolean" &&
    hasStableBlockId(value.attrs)
  );
}

function isGenericReferenceableNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["id"]) &&
    hasStableBlockId(value.attrs)
  );
}

function isOrderedListNode(value: Record<string, unknown>) {
  if (
    !isRecord(value.attrs) ||
    !hasOnlyKeys(value.attrs, ["id", "start", "type"])
  ) {
    return false;
  }
  const startIsValid =
    value.attrs.start === undefined ||
    (Number.isInteger(value.attrs.start) && (value.attrs.start as number) >= 1);
  const typeIsValid =
    value.attrs.type === undefined ||
    value.attrs.type === null ||
    ["1", "a", "A", "i", "I"].includes(String(value.attrs.type));
  return hasStableBlockId(value.attrs) && startIsValid && typeIsValid;
}

function isCodeBlockNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, [
      "id",
      "language",
      "renderMode",
      "sourceStatus",
    ]) &&
    hasStableBlockId(value.attrs) &&
    (value.attrs.language === null ||
      value.attrs.language === undefined ||
      typeof value.attrs.language === "string") &&
    (value.attrs.renderMode === undefined ||
      value.attrs.renderMode === "source" ||
      value.attrs.renderMode === "mermaid") &&
    (value.attrs.sourceStatus === undefined ||
      value.attrs.sourceStatus === "valid" ||
      value.attrs.sourceStatus === "invalid")
  );
}

function isHorizontalRuleNode(value: Record<string, unknown>) {
  return value.content === undefined && isGenericReferenceableNode(value);
}

function isObjectEmbedNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["objectId"]) &&
    isStableReferenceId(value.attrs.objectId) &&
    value.content === undefined
  );
}

function hasTextContentOnly(value: Record<string, unknown>, depth: number) {
  return (
    value.content === undefined ||
    (Array.isArray(value.content) &&
      value.content.every(
        (child) =>
          isRecord(child) &&
          (child.type === "text" || child.type === "hardBreak") &&
          isNode(child, depth + 1),
      ))
  );
}

function isHighlightBlockNode(value: Record<string, unknown>, depth: number) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, [
      "id",
      "sourceObjectId",
      "sourceUrl",
      "sourceLabel",
      "color",
    ]) &&
    hasStableBlockId(value.attrs) &&
    isOptionalString(value.attrs.sourceObjectId) &&
    isOptionalString(value.attrs.sourceUrl) &&
    isOptionalString(value.attrs.sourceLabel) &&
    isHighlightColor(value.attrs.color) &&
    hasTextContentOnly(value, depth)
  );
}

function isMathBlockNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["id", "source", "displayMode", "sourceStatus"]) &&
    hasStableBlockId(value.attrs) &&
    isSafeSourceText(value.attrs.source) &&
    (value.attrs.displayMode === "inline" ||
      value.attrs.displayMode === "block") &&
    (value.attrs.sourceStatus === undefined ||
      value.attrs.sourceStatus === "valid" ||
      value.attrs.sourceStatus === "invalid") &&
    value.content === undefined
  );
}

function isColumnNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["id", "width"]) &&
    hasStableBlockId(value.attrs) &&
    (value.attrs.width === undefined ||
      (typeof value.attrs.width === "number" &&
        Number.isFinite(value.attrs.width) &&
        value.attrs.width > 0 &&
        value.attrs.width <= 1))
  );
}

function isColumnLayoutNode(value: Record<string, unknown>, depth: number) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["id", "layoutMode", "width"]) &&
    hasStableBlockId(value.attrs) &&
    (value.attrs.layoutMode === "columns" ||
      value.attrs.layoutMode === "grid") &&
    isBlockWidth(value.attrs.width) &&
    Array.isArray(value.content) &&
    value.content.length >= 2 &&
    value.content.every(
      (child) =>
        isRecord(child) && child.type === "column" && isNode(child, depth + 1),
    )
  );
}

function isGroupBlockNode(value: Record<string, unknown>, depth: number) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["id", "width", "appearance"]) &&
    hasStableBlockId(value.attrs) &&
    isBlockWidth(value.attrs.width) &&
    isBlockAppearance(value.attrs.appearance) &&
    Array.isArray(value.content) &&
    value.content.length > 0 &&
    value.content.every((child) => isNode(child, depth + 1))
  );
}

function isObjectBlockNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, [
      "id",
      "targetId",
      "viewKind",
      "mediaDisplay",
      "state",
      "title",
    ]) &&
    hasStableBlockId(value.attrs) &&
    isStableReferenceId(value.attrs.targetId) &&
    isObjectBlockViewKind(value.attrs.viewKind) &&
    isMediaDisplayVariant(value.attrs.mediaDisplay) &&
    isObjectBlockState(value.attrs.state) &&
    isOptionalString(value.attrs.title) &&
    value.content === undefined
  );
}

function isUnsupportedBlockNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["id", "originalType", "reason", "source"]) &&
    hasStableBlockId(value.attrs) &&
    isNonEmptyString(value.attrs.originalType) &&
    isNonEmptyString(value.attrs.reason) &&
    isSafeSourceText(value.attrs.source) &&
    value.content === undefined
  );
}

const attributeValidators: Record<
  string,
  (value: Record<string, unknown>, depth: number) => boolean
> = {
  paragraph: isParagraphNode,
  heading: isHeadingNode,
  bulletList: isGenericReferenceableNode,
  listItem: isGenericReferenceableNode,
  taskList: isGenericReferenceableNode,
  taskItem: isTaskItemNode,
  blockquote: isGenericReferenceableNode,
  orderedList: isOrderedListNode,
  codeBlock: isCodeBlockNode,
  column: isColumnNode,
  columnLayout: isColumnLayoutNode,
  groupBlock: isGroupBlockNode,
  horizontalRule: isHorizontalRuleNode,
  tableBlock: isTableBlockNode,
  highlightBlock: isHighlightBlockNode,
  mathBlock: isMathBlockNode,
  objectBlock: isObjectBlockNode,
  objectEmbed: isObjectEmbedNode,
  unsupportedBlock: isUnsupportedBlockNode,
};

function isNode(value: unknown, depth = 0): value is BlockEditorNode {
  if (depth > MAX_BLOCK_DOCUMENT_DEPTH) return false;
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (!blockTypes.has(value.type) && !inlineTypes.has(value.type)) return false;
  if (value.type === "text") return isTextNode(value);
  if (value.type === "hardBreak") return hasOnlyKeys(value, ["type"]);
  if (value.type === "objectEmbed") return isObjectEmbedNode(value);
  if (!hasOnlyKeys(value, ["type", "attrs", "content"])) return false;
  if (!hasValidContent(value, depth)) return false;
  const validateAttributes = attributeValidators[value.type];
  return validateAttributes
    ? validateAttributes(value, depth)
    : value.attrs === undefined;
}

function hasUniqueBlockIds(nodes: readonly BlockEditorNode[]): boolean {
  const seenIds = new Set<string>();
  const visit = (node: BlockEditorNode): boolean => {
    if (isReferenceableBlockType(node.type)) {
      const id = node.attrs?.id;
      if (!isStableReferenceId(id) || seenIds.has(id)) return false;
      seenIds.add(id);
    }
    return (node.content ?? []).every(visit);
  };
  return nodes.every(visit);
}

function isBlockEditorDocument(value: unknown): value is BlockEditorDocument {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ["schemaVersion", "doc"]) &&
    value.schemaVersion === BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION &&
    isRecord(value.doc) &&
    hasOnlyKeys(value.doc, ["type", "content"]) &&
    value.doc.type === "doc" &&
    Array.isArray(value.doc.content) &&
    value.doc.content.length > 0 &&
    value.doc.content.every(isNode) &&
    hasUniqueBlockIds(value.doc.content as BlockEditorNode[])
  );
}

function createEmptyBlockEditorDocument(): BlockEditorDocument {
  return {
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      type: "doc",
      content: [{ type: "paragraph", attrs: { id: createBlockId() } }],
    },
  };
}

function isEmptyDocumentRoot(value: unknown) {
  if (!isRecord(value)) return false;
  if (
    value.schemaVersion !== BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION &&
    value.schemaVersion !== PREVIOUS_BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION &&
    value.schemaVersion !== LEGACY_BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION
  ) {
    return false;
  }
  if (!isRecord(value.doc) || value.doc.type !== "doc") return false;
  return Array.isArray(value.doc.content) && value.doc.content.length === 0;
}

function normalizeBlockEditorDocument(
  value: unknown,
  migrationNamespace = "legacy",
): BlockEditorDocument | null {
  const canonicalValue = canonicalizeKnownEditorDefaults(value);
  if (isEmptyDocumentRoot(canonicalValue))
    return createEmptyBlockEditorDocument();
  if (!isRecord(canonicalValue)) return null;

  const candidate =
    canonicalValue.schemaVersion ===
      LEGACY_BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION ||
    canonicalValue.schemaVersion ===
      PREVIOUS_BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION ||
    canonicalValue.schemaVersion === BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION
      ? migrateReferenceableBlockIds(
          migrateAdvancedNodes(canonicalValue, migrationNamespace),
          migrationNamespace,
        )
      : typeof canonicalValue.schemaVersion === "number" &&
          canonicalValue.schemaVersion > BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION
        ? migrateReferenceableBlockIds(
            migrateAdvancedNodes(canonicalValue, migrationNamespace),
            migrationNamespace,
          )
        : canonicalValue;
  if (!isBlockEditorDocument(candidate)) return null;
  return structuredClone(candidate);
}

function blockEditorDocumentFromPlainText(text: string): BlockEditorDocument {
  return {
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      type: "doc",
      content: text.split(/\r\n?|\n/).map((line) => ({
        type: "paragraph",
        attrs: { id: createBlockId() },
        ...(line ? { content: [{ type: "text", text: line }] } : {}),
      })),
    },
  };
}

function inlineNodePlainText(node: BlockEditorNode): string | null {
  switch (node.type) {
    case "text":
      return node.text ?? "";
    case "hardBreak":
      return "\n";
    default:
      return null;
  }
}

function blockNodePlainText(node: BlockEditorNode): string | null {
  switch (node.type) {
    case TABLE_BLOCK_TYPE:
      return isTableBlockNode(node)
        ? tableBlockToPlainText(node.attrs.table)
        : "";
    case "mathBlock":
      return String(node.attrs?.source ?? "");
    case "objectBlock":
      return String(node.attrs?.title ?? node.attrs?.targetId ?? "");
    case "unsupportedBlock":
      return `[Unsupported block: ${String(node.attrs?.originalType ?? "unknown")}]`;
    default:
      return null;
  }
}

function nodeToPlainText(node: BlockEditorNode): string {
  const inlineText = inlineNodePlainText(node);
  if (inlineText !== null) return inlineText;
  const blockText = blockNodePlainText(node);
  if (blockText !== null) return blockText;
  return (node.content ?? []).map(nodeToPlainText).join("");
}

function blockEditorDocumentToPlainText(value: BlockEditorDocument): string {
  return value.doc.content.map(nodeToPlainText).join("\n");
}

function documentHasAdvancedMarkdownLossiness(
  document: BlockEditorDocument,
): boolean {
  let hasLossiness = false;
  const visit = (node: BlockEditorNode) => {
    if (
      node.type === TABLE_BLOCK_TYPE ||
      advancedBlockTypes.has(node.type) ||
      node.attrs?.renderMode === "mermaid"
    ) {
      hasLossiness = true;
      return;
    }
    for (const child of node.content ?? []) visit(child);
  };
  for (const node of document.doc.content) visit(node);
  return hasLossiness;
}

function textContentMarkdown(node: BlockEditorNode): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "  \n";
  return (node.content ?? []).map(textContentMarkdown).join("");
}

function fencedBlock(language: string, source: string): string {
  const fence = source.includes("```") ? "````" : "```";
  return `${fence}${language}\n${source}\n${fence}`;
}

function listNodeToMarkdown(node: BlockEditorNode, content: string[]) {
  switch (node.type) {
    case "bulletList":
      return content.join("\n");
    case "orderedList":
      return content
        .map(
          (item, index) => `${index + Number(node.attrs?.start ?? 1)}. ${item}`,
        )
        .join("\n");
    case "listItem":
      return content.join("\n").replace(/^/gm, "- ");
    case "taskList":
      return content.join("\n");
    case "taskItem":
      return `- [${node.attrs?.checked ? "x" : " "}] ${content.join("\n")}`;
    default:
      return null;
  }
}

function layoutNodeToMarkdown(node: BlockEditorNode, content: string[]) {
  switch (node.type) {
    case "column":
      return content.join("\n\n");
    case "columnLayout":
      return [
        "<!-- lossiness: column layout exported in accessible reading order -->",
        ...content,
      ].join("\n\n");
    case "groupBlock":
      return [
        "<!-- lossiness: group block appearance exported as plain content -->",
        ...content,
      ].join("\n\n");
    default:
      return null;
  }
}

function objectBlockToMarkdown(node: BlockEditorNode) {
  return `<!-- lossiness: object ${String(node.attrs?.viewKind)} view exported as link -->\n[${String(
    node.attrs?.title ?? node.attrs?.targetId,
  )}](object:${String(node.attrs?.targetId)})`;
}

function mediaBlockToMarkdown(node: BlockEditorNode) {
  switch (node.type) {
    case TABLE_BLOCK_TYPE:
      return isTableBlockNode(node)
        ? tableBlockToMarkdown(node.attrs.table)
        : "";
    case "codeBlock":
      return fencedBlock(
        node.attrs?.renderMode === "mermaid"
          ? "mermaid"
          : String(node.attrs?.language ?? ""),
        textContentMarkdown(node),
      );
    case "highlightBlock": {
      const source = node.attrs?.sourceLabel
        ? `\n\n_Source: ${String(node.attrs.sourceLabel)}_`
        : "";
      return `> ==${textContentMarkdown(node)}==${source}`;
    }
    case "mathBlock":
      return node.attrs?.displayMode === "inline"
        ? `$${String(node.attrs.source)}$`
        : `$$\n${String(node.attrs?.source ?? "")}\n$$`;
    default:
      return null;
  }
}

function leafBlockToMarkdown(node: BlockEditorNode) {
  switch (node.type) {
    case "objectBlock":
      return objectBlockToMarkdown(node);
    case "unsupportedBlock":
      return `<!-- unsupported block preserved: ${String(node.attrs?.originalType)} -->`;
    case "horizontalRule":
      return "---";
    default:
      return null;
  }
}

function textBlockToMarkdown(node: BlockEditorNode) {
  switch (node.type) {
    case "paragraph": {
      const prefix = node.attrs?.emoji ? `${node.attrs.emoji} ` : "";
      const marker =
        typeof node.attrs?.toggleCollapsed === "boolean"
          ? "<!-- toggle -->\n"
          : "";
      return `${marker}${prefix}${textContentMarkdown(node)}`.trimEnd();
    }
    case "heading":
      return `${"#".repeat(Number(node.attrs?.level ?? 1))} ${textContentMarkdown(node)}`;
    case "blockquote":
      return (node.content ?? [])
        .map(advancedNodeToMarkdown)
        .join("\n\n")
        .replace(/^/gm, "> ");
    default:
      return null;
  }
}

function advancedNodeToMarkdown(node: BlockEditorNode): string {
  const content = (node.content ?? []).map(advancedNodeToMarkdown);
  return (
    mediaBlockToMarkdown(node) ??
    leafBlockToMarkdown(node) ??
    textBlockToMarkdown(node) ??
    listNodeToMarkdown(node, content) ??
    layoutNodeToMarkdown(node, content) ??
    content.join("\n\n")
  );
}

const markdownManager = new MarkdownManager({
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
      link: { markdownLinks: true, isAllowedUri: isSafeBlockEditorHref },
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
  ],
});

function blockEditorDocumentFromMarkdown(text: string): BlockEditorDocument {
  const doc = markdownManager.parse(text);
  const migrated = normalizeBlockEditorDocument(
    { schemaVersion: LEGACY_BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION, doc },
    `import-${crypto.randomUUID()}`,
  );
  return migrated ?? blockEditorDocumentFromPlainText(text);
}

function blockEditorDocumentToMarkdown(value: BlockEditorDocument): string {
  if (documentHasAdvancedMarkdownLossiness(value)) {
    return value.doc.content.map(advancedNodeToMarkdown).join("\n\n").trimEnd();
  }
  return markdownManager.serialize(value.doc).trimEnd();
}

export type { BlockEditorDocument, BlockEditorMark, BlockEditorNode, BlockId };
export {
  BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  blockEditorDocumentFromMarkdown,
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToMarkdown,
  blockEditorDocumentToPlainText,
  copyBlockEditorDocumentWithFreshIds,
  copyBlockEditorNodeWithFreshIds,
  createBlockId,
  createEmptyBlockEditorDocument,
  documentHasAdvancedMarkdownLossiness,
  isAdvancedBlockType,
  isBlockEditorDocument,
  isReferenceableBlockType,
  isSafeBlockEditorHref,
  normalizeBlockEditorDocument,
};
