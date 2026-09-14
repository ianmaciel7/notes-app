/**
 * Capacities Block Editor Domain - Document Schema (v3)
 */

export const BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION = 3 as const;
export const MAX_BLOCK_DOCUMENT_DEPTH = 8;
export const BLOCK_ID_PREFIX = "block:";

export interface BlockEditorMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface BlockEditorNode {
  type: string;
  attrs?: Record<string, unknown> & { id?: string };
  content?: BlockEditorNode[];
  marks?: BlockEditorMark[];
  text?: string;
}

export interface BlockEditorDocument {
  schemaVersion: typeof BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION;
  doc: {
    type: "doc";
    content: BlockEditorNode[];
  };
}

export function createBlockId(): string {
  return `${BLOCK_ID_PREFIX}${crypto.randomUUID()}`;
}

export function isBlockId(id: unknown): id is string {
  return typeof id === "string" && id.startsWith(BLOCK_ID_PREFIX);
}

export function createEmptyBlockDocument(): BlockEditorDocument {
  return {
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { id: createBlockId() },
          content: [{ type: "text", text: "" }],
        },
      ],
    },
  };
}

export function ensureBlockIds(nodes: BlockEditorNode[]): BlockEditorNode[] {
  return nodes.map((node) => {
    const existingId = node.attrs?.id;
    const validId = isBlockId(existingId) ? existingId : createBlockId();
    const attrs = { ...(node.attrs || {}), id: validId };

    const content = node.content ? ensureBlockIds(node.content) : undefined;
    return { ...node, attrs, ...(content ? { content } : {}) };
  });
}

export function validateBlockDocument(doc: unknown): doc is BlockEditorDocument {
  if (!doc || typeof doc !== "object") return false;
  const record = doc as Record<string, unknown>;
  if (record.schemaVersion !== BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION) return false;
  if (!record.doc || typeof record.doc !== "object") return false;
  const innerDoc = record.doc as Record<string, unknown>;
  if (innerDoc.type !== "doc" || !Array.isArray(innerDoc.content)) return false;

  const validateNode = (node: unknown, depth: number): node is BlockEditorNode => {
    if (!node || typeof node !== "object" || depth > MAX_BLOCK_DOCUMENT_DEPTH) return false;
    const record = node as Record<string, unknown>;
    if (typeof record.type !== "string" || record.type.length === 0) return false;
    if (record.type === "text") {
      return typeof record.text === "string";
    }
    if (record.attrs !== undefined && (!record.attrs || typeof record.attrs !== "object")) {
      return false;
    }
    if (record.marks !== undefined && !Array.isArray(record.marks)) return false;
    if (Array.isArray(record.marks)) {
      for (const mark of record.marks) {
        if (!mark || typeof mark !== "object" || typeof (mark as Record<string, unknown>).type !== "string") {
          return false;
        }
      }
    }
    if (record.content !== undefined && !Array.isArray(record.content)) return false;
    return !Array.isArray(record.content) || record.content.every((child) => validateNode(child, depth + 1));
  };

  return innerDoc.content.every((node) => validateNode(node, 1));
}

export function capacitiesDocToSlate(document: BlockEditorDocument): unknown[] {
  const convertNode = (node: BlockEditorNode): unknown => {
    if (node.type === "text") {
      const slateText: Record<string, unknown> = { text: node.text ?? "" };
      if (node.marks?.length) {
        slateText.__marks = node.marks;
        for (const mark of node.marks) {
          slateText[mark.type] = true;
        }
      }
      return slateText;
    }
    return {
      type: node.type === "paragraph" ? "p" : node.type,
      ...node.attrs,
      id: node.attrs?.id || createBlockId(),
      children: node.content ? node.content.map(convertNode) : [{ text: "" }],
    };
  };
  return document.doc.content.map(convertNode);
}

export function slateToCapacitiesDoc(slateNodes: unknown[]): BlockEditorDocument {
  const convertSlateNode = (node: Record<string, unknown>): BlockEditorNode => {
    if (typeof node.text === "string") {
      const marks = Array.isArray(node.__marks)
        ? (node.__marks as BlockEditorMark[])
        : Object.entries(node)
            .filter(([key, value]) => key !== "text" && value === true)
            .map(([type]) => ({ type }));
      return { type: "text", text: node.text, ...(marks.length ? { marks } : {}) };
    }
    const { type, id, children, ...restAttrs } = node;
    const childrenArray = Array.isArray(children) ? (children as Record<string, unknown>[]) : [];
    return {
      type: type === "p" ? "paragraph" : (type as string) || "paragraph",
      attrs: { id: (id as string) || createBlockId(), ...restAttrs },
      content:
        childrenArray.length > 0
          ? childrenArray.map(convertSlateNode)
          : [{ type: "text", text: "" }],
    };
  };

  const nodes = Array.isArray(slateNodes) ? (slateNodes as Record<string, unknown>[]) : [];
  const content = ensureBlockIds(nodes.map(convertSlateNode));
  return {
    schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
    doc: {
      type: "doc",
      content,
    },
  };
}
