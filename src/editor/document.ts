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
]);
const inlineTypes = new Set(["text", "hardBreak"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function isSafeHref(value: string): boolean {
  return /^(https?:|mailto:|\/|#)/i.test(value);
}

function isMark(value: unknown): value is BlockEditorMark {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (["bold", "italic", "code"].includes(value.type)) {
    return hasOnlyKeys(value, ["type"]);
  }
  return (
    value.type === "link" &&
    hasOnlyKeys(value, ["type", "attrs"]) &&
    isRecord(value.attrs) &&
    hasOnlyKeys(value.attrs, ["href"]) &&
    typeof value.attrs.href === "string" &&
    isSafeHref(value.attrs.href)
  );
}

function isNode(value: unknown): value is BlockEditorNode {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (!blockTypes.has(value.type) && !inlineTypes.has(value.type)) return false;

  if (value.type === "text") {
    return (
      hasOnlyKeys(value, ["type", "text", "marks"]) &&
      typeof value.text === "string" &&
      value.text.length > 0 &&
      (value.marks === undefined ||
        (Array.isArray(value.marks) && value.marks.every(isMark)))
    );
  }
  if (value.type === "hardBreak") return hasOnlyKeys(value, ["type"]);

  if (!hasOnlyKeys(value, ["type", "attrs", "content"])) return false;
  if (
    value.content !== undefined &&
    (!Array.isArray(value.content) || !value.content.every(isNode))
  ) {
    return false;
  }
  if (value.type === "heading") {
    return (
      isRecord(value.attrs) &&
      hasOnlyKeys(value.attrs, ["level"]) &&
      [1, 2, 3].includes(value.attrs.level as number)
    );
  }
  if (value.type === "taskItem") {
    return (
      isRecord(value.attrs) &&
      hasOnlyKeys(value.attrs, ["checked"]) &&
      typeof value.attrs.checked === "boolean"
    );
  }
  if (value.type === "orderedList") {
    return (
      value.attrs === undefined ||
      (isRecord(value.attrs) &&
        hasOnlyKeys(value.attrs, ["start"]) &&
        Number.isInteger(value.attrs.start) &&
        (value.attrs.start as number) >= 1)
    );
  }
  if (value.type === "codeBlock") {
    return (
      value.attrs === undefined ||
      (isRecord(value.attrs) &&
        hasOnlyKeys(value.attrs, ["language"]) &&
        (value.attrs.language === null ||
          typeof value.attrs.language === "string"))
    );
  }
  return value.attrs === undefined;
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

function normalizeBlockEditorDocument(
  value: unknown,
): BlockEditorDocument | null {
  if (
    isRecord(value) &&
    value.schemaVersion === 1 &&
    isRecord(value.doc) &&
    value.doc.type === "doc" &&
    Array.isArray(value.doc.content) &&
    value.doc.content.length === 0
  ) {
    return createEmptyBlockEditorDocument();
  }
  if (!isBlockEditorDocument(value)) return null;
  return structuredClone(value);
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

const markdownManager = new MarkdownManager({ extensions: [StarterKit] });

function blockEditorDocumentFromMarkdown(text: string): BlockEditorDocument {
  const doc = markdownManager.parse(text);
  const stripDefaultMarkdownAttrs = (
    node: BlockEditorNode,
  ): BlockEditorNode => ({
    ...node,
    ...(node.marks
      ? {
          marks: node.marks.map((mark) =>
            mark.type === "link"
              ? { type: "link" as const, attrs: { href: mark.attrs.href } }
              : mark,
          ),
        }
      : {}),
    ...(node.content
      ? { content: node.content.map(stripDefaultMarkdownAttrs) }
      : {}),
  });
  const value = {
    schemaVersion: 1,
    doc: {
      ...doc,
      content:
        (doc.content as BlockEditorNode[] | undefined)?.map(
          stripDefaultMarkdownAttrs,
        ) ?? [],
    },
  };
  return (
    normalizeBlockEditorDocument(value) ??
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
  normalizeBlockEditorDocument,
};

import { MarkdownManager } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
