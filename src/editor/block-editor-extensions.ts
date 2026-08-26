import { Extension } from "@tiptap/core";
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
    return [
      new Plugin({
        key: new PluginKey("blockIdentity"),
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
              element.getAttribute("data-text-size") === "small" ? "small" : null,
            renderHTML: (attributes) =>
              attributes.size === "small"
                ? { "data-text-size": "small" }
                : {},
          },
        },
      },
    ];
  },
});

export { BlockIdExtension, ParagraphSizeExtension };
