import { Extension, Mark, Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

import { createBlockId, isReferenceableBlockType } from "./document.ts";

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
] as const;

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
        },
      },
    ];
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
  BlockIdExtension,
  BlockLinkMark,
  ObjectEmbedNode,
  ObjectLinkMark,
  ParagraphSizeExtension,
};
