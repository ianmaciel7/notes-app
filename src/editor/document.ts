import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { MarkdownManager } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";

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
  schemaVersion: 1;
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
]);
const inlineTypes = new Set(["text", "hardBreak", "objectEmbed"]);

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

function shouldDropParagraphDefaults(value: Record<string, unknown>) {
  if (value.type !== "paragraph") return false;
  if (!isRecord(value.attrs)) return false;
  if (value.attrs.id !== undefined) return false;
  return value.attrs.size === null || value.attrs.size === undefined;
}

function shouldDropOrderedListDefaults(value: Record<string, unknown>) {
  if (value.type !== "orderedList") return false;
  if (!isRecord(value.attrs)) return false;
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

  if (shouldDropParagraphDefaults(value)) {
    delete canonical.attrs;
  }

  if (shouldDropOrderedListDefaults(value)) {
    delete canonical.attrs;
  }

  return canonical;
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

function hasValidContent(value: Record<string, unknown>) {
  if (value.content === undefined) return true;
  return Array.isArray(value.content) && value.content.every(isNode);
}

function isParagraphNode(value: Record<string, unknown>) {
  if (value.attrs === undefined) return true;
  if (!isRecord(value.attrs) || !hasOnlyKeys(value.attrs, ["id", "size"]))
    return false;
  return (
    (value.attrs.id === undefined || isStableReferenceId(value.attrs.id)) &&
    (value.attrs.size === undefined || value.attrs.size === "small")
  );
}

function isHeadingNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["id", "level"]) &&
    [1, 2, 3, 4].includes(value.attrs.level as number) &&
    (value.attrs.id === undefined || isStableReferenceId(value.attrs.id))
  );
}

function isTaskItemNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["checked", "id"]) &&
    typeof value.attrs.checked === "boolean" &&
    (value.attrs.id === undefined || isStableReferenceId(value.attrs.id))
  );
}

function isGenericReferenceableNode(value: Record<string, unknown>) {
  if (value.attrs === undefined) return true;
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["id"]) &&
    (value.attrs.id === undefined || isStableReferenceId(value.attrs.id))
  );
}

function isOrderedListNode(value: Record<string, unknown>) {
  if (value.attrs === undefined) return true;
  if (!isRecord(value.attrs) || !hasOnlyKeys(value.attrs, ["start", "type"])) {
    return false;
  }
  const startIsValid =
    value.attrs.start === undefined ||
    (Number.isInteger(value.attrs.start) && (value.attrs.start as number) >= 1);
  const typeIsValid =
    value.attrs.type === undefined ||
    value.attrs.type === null ||
    ["1", "a", "A", "i", "I"].includes(String(value.attrs.type));
  return startIsValid && typeIsValid;
}

function isCodeBlockNode(value: Record<string, unknown>) {
  if (value.attrs === undefined) return true;
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["language"]) &&
    (value.attrs.language === null || typeof value.attrs.language === "string")
  );
}

function isHorizontalRuleNode(value: Record<string, unknown>) {
  return value.attrs === undefined && value.content === undefined;
}

function isObjectEmbedNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["objectId"]) &&
    isStableReferenceId(value.attrs.objectId) &&
    value.content === undefined
  );
}

const attributeValidators: Record<
  string,
  (value: Record<string, unknown>) => boolean
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
  horizontalRule: isHorizontalRuleNode,
  objectEmbed: isObjectEmbedNode,
};

function isNode(value: unknown): value is BlockEditorNode {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (!blockTypes.has(value.type) && !inlineTypes.has(value.type)) return false;
  if (value.type === "text") return isTextNode(value);
  if (value.type === "hardBreak") return hasOnlyKeys(value, ["type"]);
  if (value.type === "objectEmbed") return isObjectEmbedNode(value);
  if (!hasOnlyKeys(value, ["type", "attrs", "content"])) return false;
  if (!hasValidContent(value)) return false;
  const validateAttributes = attributeValidators[value.type];
  return validateAttributes
    ? validateAttributes(value)
    : value.attrs === undefined;
}

function isBlockEditorDocument(value: unknown): value is BlockEditorDocument {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ["schemaVersion", "doc"]) &&
    value.schemaVersion === 1 &&
    isRecord(value.doc) &&
    hasOnlyKeys(value.doc, ["type", "content"]) &&
    value.doc.type === "doc" &&
    Array.isArray(value.doc.content) &&
    value.doc.content.length > 0 &&
    value.doc.content.every(isNode)
  );
}

function createEmptyBlockEditorDocument(): BlockEditorDocument {
  return {
    schemaVersion: 1,
    doc: { type: "doc", content: [{ type: "paragraph" }] },
  };
}

function isEmptyDocumentRoot(value: unknown) {
  if (!isRecord(value) || value.schemaVersion !== 1) return false;
  if (!isRecord(value.doc) || value.doc.type !== "doc") return false;
  return Array.isArray(value.doc.content) && value.doc.content.length === 0;
}

function normalizeBlockEditorDocument(
  value: unknown,
): BlockEditorDocument | null {
  const canonicalValue = canonicalizeKnownEditorDefaults(value);
  if (isEmptyDocumentRoot(canonicalValue))
    return createEmptyBlockEditorDocument();
  if (!isBlockEditorDocument(canonicalValue)) return null;
  return structuredClone(canonicalValue);
}

function blockEditorDocumentFromPlainText(text: string): BlockEditorDocument {
  return {
    schemaVersion: 1,
    doc: {
      type: "doc",
      content: text.split(/\r\n?|\n/).map((line) => ({
        type: "paragraph",
        ...(line ? { content: [{ type: "text", text: line }] } : {}),
      })),
    },
  };
}

function nodeToPlainText(node: BlockEditorNode): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  return (node.content ?? []).map(nodeToPlainText).join("");
}

function blockEditorDocumentToPlainText(value: BlockEditorDocument): string {
  return value.doc.content.map(nodeToPlainText).join("\n");
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
  return (
    normalizeBlockEditorDocument({ schemaVersion: 1, doc }) ??
    blockEditorDocumentFromPlainText(text)
  );
}

function blockEditorDocumentToMarkdown(value: BlockEditorDocument): string {
  return markdownManager.serialize(value.doc).trimEnd();
}

export type { BlockEditorDocument, BlockEditorMark, BlockEditorNode };
export {
  blockEditorDocumentFromMarkdown,
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToMarkdown,
  blockEditorDocumentToPlainText,
  createEmptyBlockEditorDocument,
  isBlockEditorDocument,
  isSafeBlockEditorHref,
  normalizeBlockEditorDocument,
};
