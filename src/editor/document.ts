import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { MarkdownManager } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";

type BlockEditorMark =
  | { type: "bold" | "italic" | "code" }
  | { type: "link"; attrs: { href: string } };

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
const inlineTypes = new Set(["text", "hardBreak"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function isSafeBlockEditorHref(value: string): boolean {
  return /^(https?:|mailto:|\/|#|\.{1,2}\/)/i.test(value);
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

  if (
    value.type === "paragraph" &&
    isRecord(value.attrs) &&
    (value.attrs.size === null || value.attrs.size === undefined)
  ) {
    delete canonical.attrs;
  }

  if (
    value.type === "orderedList" &&
    isRecord(value.attrs) &&
    value.attrs.start === 1 &&
    (value.attrs.type === null || value.attrs.type === undefined)
  ) {
    delete canonical.attrs;
  }

  return canonical;
}

function isMark(value: unknown): value is BlockEditorMark {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (["bold", "italic", "code"].includes(value.type)) {
    return hasOnlyKeys(value, ["type"]);
  }
  if (value.type !== "link" || !hasOnlyKeys(value, ["type", "attrs"])) {
    return false;
  }
  if (!isRecord(value.attrs) || !hasOnlyKeys(value.attrs, ["href"])) {
    return false;
  }
  return typeof value.attrs.href === "string" && isSafeBlockEditorHref(value.attrs.href);
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
  if (!isRecord(value.attrs) || !hasOnlyKeys(value.attrs, ["size"])) return false;
  return value.attrs.size === "small";
}

function isHeadingNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["level"]) &&
    [1, 2, 3, 4].includes(value.attrs.level as number)
  );
}

function isTaskItemNode(value: Record<string, unknown>) {
  return (
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["checked"]) &&
    typeof value.attrs.checked === "boolean"
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

const attributeValidators: Record<
  string,
  (value: Record<string, unknown>) => boolean
> = {
  paragraph: isParagraphNode,
  heading: isHeadingNode,
  taskItem: isTaskItemNode,
  orderedList: isOrderedListNode,
  codeBlock: isCodeBlockNode,
  horizontalRule: isHorizontalRuleNode,
};

function isNode(value: unknown): value is BlockEditorNode {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (!blockTypes.has(value.type) && !inlineTypes.has(value.type)) return false;
  if (value.type === "text") return isTextNode(value);
  if (value.type === "hardBreak") return hasOnlyKeys(value, ["type"]);
  if (!hasOnlyKeys(value, ["type", "attrs", "content"])) return false;
  if (!hasValidContent(value)) return false;
  const validateAttributes = attributeValidators[value.type];
  return validateAttributes ? validateAttributes(value) : value.attrs === undefined;
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
  if (isEmptyDocumentRoot(canonicalValue)) return createEmptyBlockEditorDocument();
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
