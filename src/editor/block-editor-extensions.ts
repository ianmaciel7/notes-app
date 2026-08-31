import { Extension, Mark, mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { createBlockId, isReferenceableBlockType } from "./document.ts";
import {
  normalizeTableBlock,
  TABLE_BLOCK_TYPE,
  tableBlockToPlainText,
} from "./table-block.ts";
import { TableBlockNodeView } from "./table-block-node-view.tsx";

const referenceableBlockTypes = [
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
] as const;

function blockIdAttribute() {
  return {
    default: null,
    parseHTML: (element: HTMLElement) => element.getAttribute("data-block-id"),
    renderHTML: (attributes: Record<string, unknown>) =>
      typeof attributes.id === "string" && attributes.id.length > 0
        ? { "data-block-id": attributes.id }
        : {},
  };
}

function stringAttribute(name: string, dataName: string, fallback?: string) {
  return {
    default: fallback ?? null,
    parseHTML: (element: HTMLElement) => element.getAttribute(dataName),
    renderHTML: (attributes: Record<string, unknown>) =>
      typeof attributes[name] === "string" && attributes[name]
        ? { [dataName]: attributes[name] }
        : {},
  };
}

function withoutPastedBlockIds(html: string) {
  const pastedDocument = new DOMParser().parseFromString(html, "text/html");
  for (const node of pastedDocument.querySelectorAll("[data-block-id]")) {
    node.removeAttribute("data-block-id");
  }
  return pastedDocument.body.innerHTML;
}

const BlockIdExtension = Extension.create({
  name: "blockIdentity",

  addGlobalAttributes() {
    return [
      {
        types: [...referenceableBlockTypes],
        attributes: {
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-block-id"),
            renderHTML: (attributes) =>
              typeof attributes.id === "string" && attributes.id.length > 0
                ? { "data-block-id": attributes.id }
                : {},
          },
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        key: new PluginKey("blockIdentity"),
        props: {
          handlePaste: (_view, event) => {
            const html = event.clipboardData?.getData("text/html");
            if (!html) return false;
            editor.commands.insertContent(withoutPastedBlockIds(html));
            return true;
          },
        },
        appendTransaction: (transactions, _oldState, newState) => {
          if (!transactions.some((transaction) => transaction.docChanged)) {
            return null;
          }

          const seenIds = new Set<string>();
          const transaction = newState.tr;

          newState.doc.descendants((node, position) => {
            if (!isReferenceableBlockType(node.type.name)) return;

            const currentId =
              typeof node.attrs.id === "string" && node.attrs.id.length > 0
                ? node.attrs.id
                : null;
            if (currentId && !seenIds.has(currentId)) {
              seenIds.add(currentId);
              return;
            }

            let nextId = createBlockId();
            while (seenIds.has(nextId)) nextId = createBlockId();
            seenIds.add(nextId);
            transaction.setNodeMarkup(
              position,
              undefined,
              { ...node.attrs, id: nextId },
              node.marks,
            );
          });

          return transaction.docChanged ? transaction : null;
        },
      }),
    ];
  },
});

const ParagraphSizeExtension = Extension.create({
  name: "paragraphSize",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          size: {
            default: null,
            parseHTML: (element) =>
              element.getAttribute("data-text-size") === "small"
                ? "small"
                : null,
            renderHTML: (attributes) =>
              attributes.size === "small" ? { "data-text-size": "small" } : {},
          },
          emoji: {
            default: null,
            parseHTML: (element) => element.getAttribute("data-block-emoji"),
            renderHTML: (attributes) =>
              typeof attributes.emoji === "string" && attributes.emoji
                ? { "data-block-emoji": attributes.emoji }
                : {},
          },
          toggleCollapsed: {
            default: null,
            parseHTML: (element) =>
              element.getAttribute("data-toggle-collapsed") === "true",
            renderHTML: (attributes) =>
              typeof attributes.toggleCollapsed === "boolean"
                ? {
                    "data-toggle-collapsed": String(attributes.toggleCollapsed),
                    "data-block-interface": "toggle",
                  }
                : {},
          },
        },
      },
    ];
  },
});

const AdvancedCodeBlockAttributes = Extension.create({
  name: "advancedCodeBlockAttributes",

  addGlobalAttributes() {
    return [
      {
        types: ["codeBlock"],
        attributes: {
          renderMode: {
            default: "source",
            parseHTML: (element) =>
              element.getAttribute("data-render-mode") ?? "source",
            renderHTML: (attributes) =>
              attributes.renderMode === "mermaid"
                ? { "data-render-mode": "mermaid" }
                : {},
          },
          sourceStatus: {
            default: "valid",
            parseHTML: (element) =>
              element.getAttribute("data-source-status") ?? "valid",
            renderHTML: (attributes) =>
              attributes.sourceStatus === "invalid"
                ? { "data-source-status": "invalid" }
                : {},
          },
        },
      },
    ];
  },
});

const InlineMathMark = Mark.create({
  name: "inlineMath",

  addAttributes() {
    return {
      source: stringAttribute("source", "data-tex-source", ""),
      sourceStatus: stringAttribute(
        "sourceStatus",
        "data-source-status",
        "valid",
      ),
    };
  },

  parseHTML() {
    return [{ tag: "span[data-inline-math]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const source = HTMLAttributes["data-tex-source"] ?? "";
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "aria-label": `Inline math: ${source}`,
        "data-inline-math": "",
        role: "math",
      }),
      0,
    ];
  },
});

const HighlightBlockNode = Node.create({
  name: "highlightBlock",
  group: "block",
  content: "inline*",
  defining: true,

  addAttributes() {
    return {
      id: blockIdAttribute(),
      sourceObjectId: stringAttribute(
        "sourceObjectId",
        "data-source-object-id",
      ),
      sourceUrl: stringAttribute("sourceUrl", "data-source-url"),
      sourceLabel: stringAttribute("sourceLabel", "data-source-label"),
      color: stringAttribute("color", "data-highlight-color", "yellow"),
    };
  },

  parseHTML() {
    return [{ tag: "blockquote[data-highlight-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(HTMLAttributes, {
        "data-highlight-block": "",
        role: "figure",
      }),
      0,
    ];
  },
});

const MathBlockNode = Node.create({
  name: "mathBlock",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      id: blockIdAttribute(),
      source: stringAttribute("source", "data-tex-source", ""),
      displayMode: stringAttribute("displayMode", "data-display-mode", "block"),
      sourceStatus: stringAttribute(
        "sourceStatus",
        "data-source-status",
        "valid",
      ),
    };
  },

  parseHTML() {
    return [{ tag: "div[data-math-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const source = HTMLAttributes["data-tex-source"] ?? "";
    const sourceStatus = HTMLAttributes["data-source-status"] ?? "valid";
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "aria-label": "Math block",
        "data-math-block": "",
        role: "math",
      }),
      ["code", { "data-slot": "math-block-source" }, source],
      ...(sourceStatus === "invalid"
        ? [
            [
              "span",
              {
                "aria-live": "polite",
                "data-slot": "math-block-error",
                contenteditable: "false",
              },
              "Invalid TeX source",
            ],
          ]
        : []),
    ];
  },
});

const ColumnNode = Node.create({
  name: "column",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      id: blockIdAttribute(),
      width: {
        default: null,
        parseHTML: (element) => {
          const value = Number(element.getAttribute("data-column-width"));
          return Number.isFinite(value) ? value : null;
        },
        renderHTML: (attributes) =>
          typeof attributes.width === "number"
            ? { "data-column-width": String(attributes.width) }
            : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-column]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-column": "", role: "group" }),
      0,
    ];
  },
});

const ColumnLayoutNode = Node.create({
  name: "columnLayout",
  group: "block",
  content: "column{2,}",
  defining: true,

  addAttributes() {
    return {
      id: blockIdAttribute(),
      layoutMode: stringAttribute("layoutMode", "data-layout-mode", "columns"),
      width: stringAttribute("width", "data-layout-width", "content"),
      columnCount: {
        default: null,
        parseHTML: (element) => {
          const value = Number(element.getAttribute("data-column-count"));
          return Number.isInteger(value) && value >= 2 ? value : null;
        },
        renderHTML: (attributes) =>
          typeof attributes.columnCount === "number"
            ? { "data-column-count": String(attributes.columnCount) }
            : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "section[data-column-layout]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const columnCount = String(HTMLAttributes["data-column-count"] ?? "");
    return [
      "section",
      mergeAttributes(HTMLAttributes, {
        "data-column-layout": "",
        ...(columnCount ? { style: `--column-count: ${columnCount}` } : {}),
        "aria-label": "Column layout",
      }),
      0,
    ];
  },
});

const GroupBlockNode = Node.create({
  name: "groupBlock",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      id: blockIdAttribute(),
      width: stringAttribute("width", "data-group-width", "content"),
      appearance: stringAttribute(
        "appearance",
        "data-group-appearance",
        "card",
      ),
    };
  },

  parseHTML() {
    return [{ tag: "section[data-group-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "section",
      mergeAttributes(HTMLAttributes, {
        "data-group-block": "",
        role: "group",
      }),
      0,
    ];
  },
});

const ObjectBlockNode = Node.create({
  name: "objectBlock",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      id: blockIdAttribute(),
      targetId: stringAttribute("targetId", "data-object-id"),
      viewKind: stringAttribute("viewKind", "data-object-view", "small-card"),
      mediaDisplay: stringAttribute("mediaDisplay", "data-media-display"),
      state: stringAttribute("state", "data-object-state", "available"),
      title: stringAttribute("title", "data-object-title"),
    };
  },

  parseHTML() {
    return [{ tag: "article[data-object-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const viewKind = String(HTMLAttributes["data-object-view"] ?? "small-card");
    const state = String(HTMLAttributes["data-object-state"] ?? "available");
    const title = HTMLAttributes["data-object-title"];
    const editable =
      viewKind === "transclusion" && state === "available" ? "true" : "false";
    return [
      "article",
      mergeAttributes(HTMLAttributes, {
        "aria-label": `Object block: ${title ?? "Untitled object"}`,
        contenteditable: editable,
        "data-object-block": "",
        "data-reference-kind": "object-block",
      }),
      [
        "span",
        { "data-slot": "object-block-title", "data-object-block-title": "" },
        title ?? "Untitled object",
      ],
      ...(state === "available"
        ? []
        : [
            [
              "span",
              {
                "data-slot": "object-block-fallback",
                contenteditable: "false",
              },
              state,
            ],
          ]),
    ];
  },
});

const UnsupportedBlockNode = Node.create({
  name: "unsupportedBlock",
  group: "block",
  atom: true,
  selectable: false,

  addAttributes() {
    return {
      id: blockIdAttribute(),
      originalType: stringAttribute("originalType", "data-original-type"),
      reason: stringAttribute("reason", "data-unsupported-reason"),
      source: stringAttribute("source", "data-preserved-source"),
    };
  },

  parseHTML() {
    return [{ tag: "div[data-unsupported-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-unsupported-block": "",
        contenteditable: "false",
        role: "note",
      }),
      `Unsupported block: ${HTMLAttributes["data-original-type"] ?? "unknown"}`,
    ];
  },
});

const TableBlockNode = Node.create({
  name: TABLE_BLOCK_TYPE,
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      id: blockIdAttribute(),
      table: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const encoded = element.getAttribute("data-table-block");
          if (!encoded) return null;
          try {
            return normalizeTableBlock(JSON.parse(encoded));
          } catch {
            return null;
          }
        },
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-table-block-node]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const table = normalizeTableBlock(node.attrs.table);
    const encoded = table ? JSON.stringify(table) : "";
    const rows =
      table?.rows.map((row, rowIndex) => [
        "tr",
        { "data-table-row-id": row.id },
        ...table.columns.map((column, columnIndex) => {
          const cell = table.cells[`${row.id}\u0000${column.id}`];
          const Tag =
            (table.columnHeader && rowIndex === 0) ||
            (table.rowHeader && columnIndex === 0)
              ? "th"
              : "td";
          const text = cell
            ? tableBlockToPlainText({
                ...table,
                columns: [column],
                rows: [row],
              })
            : "";
          return [
            Tag,
            {
              "data-table-cell-id": cell?.id,
              style: column.width ? `width: ${column.width}px` : undefined,
            },
            text,
          ];
        }),
      ]) ?? [];

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-table-block": encoded,
        "data-table-block-node": "",
        contenteditable: "false",
      }),
      ["table", ["tbody", ...rows]],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TableBlockNodeView, {
      stopEvent: ({ event }) =>
        event.target instanceof HTMLElement &&
        Boolean(event.target.closest('[data-slot="table-block-editor"]')),
    });
  },
});

const ObjectLinkMark = Mark.create({
  name: "objectLink",

  addAttributes() {
    return {
      objectId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-object-id"),
        renderHTML: (attributes) =>
          typeof attributes.objectId === "string"
            ? { "data-object-id": attributes.objectId }
            : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-object-id]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-reference-kind": "object" }),
      0,
    ];
  },
});

const BlockLinkMark = Mark.create({
  name: "blockLink",

  addAttributes() {
    return {
      blockId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-block-reference-id"),
        renderHTML: (attributes) =>
          typeof attributes.blockId === "string"
            ? { "data-block-reference-id": attributes.blockId }
            : {},
      },
      objectId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-object-id"),
        renderHTML: (attributes) =>
          typeof attributes.objectId === "string"
            ? { "data-object-id": attributes.objectId }
            : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-object-id][data-block-reference-id]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-reference-kind": "block" }),
      0,
    ];
  },
});

const ObjectEmbedNode = Node.create({
  name: "objectEmbed",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      objectId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-object-id"),
        renderHTML: (attributes) =>
          typeof attributes.objectId === "string"
            ? { "data-object-id": attributes.objectId }
            : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-object-embed][data-object-id]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-object-embed": "",
        "data-reference-kind": "embed",
      }),
    ];
  },
});

export {
  AdvancedCodeBlockAttributes,
  BlockIdExtension,
  BlockLinkMark,
  ColumnLayoutNode,
  ColumnNode,
  GroupBlockNode,
  HighlightBlockNode,
  InlineMathMark,
  MathBlockNode,
  ObjectBlockNode,
  ObjectEmbedNode,
  ObjectLinkMark,
  ParagraphSizeExtension,
  TableBlockNode,
  UnsupportedBlockNode,
};
