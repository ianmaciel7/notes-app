import type { Editor, Range } from "@tiptap/core";

type BlockCommandCatalogLabels = {
  text: string;
  heading1: string;
  heading2: string;
  heading3: string;
  bulletList: string;
  orderedList: string;
  blockquote: string;
  codeBlock: string;
};

type BlockCommandCatalogItem = {
  id: string;
  title: string;
  searchTerms: string[];
  execute: (editor: Editor, range: Range) => void;
};

function runWithDeletedTrigger(
  editor: Editor,
  range: Range,
  command: (chain: ReturnType<Editor["chain"]>) => ReturnType<Editor["chain"]>,
) {
  command(editor.chain().focus().deleteRange(range)).run();
}

function createBlockCommandCatalog(
  labels: BlockCommandCatalogLabels,
): BlockCommandCatalogItem[] {
  return [
    {
      id: "text",
      title: labels.text,
      searchTerms: ["text", "texto", "paragraph", "paragrafo", "paragrafo"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) => chain.setParagraph()),
    },
    {
      id: "heading-1",
      title: labels.heading1,
      searchTerms: ["h1", "heading 1", "title 1", "titulo 1", "titulo 1"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 1 }),
        ),
    },
    {
      id: "heading-2",
      title: labels.heading2,
      searchTerms: ["h2", "heading 2", "title 2", "titulo 2", "titulo 2"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 2 }),
        ),
    },
    {
      id: "heading-3",
      title: labels.heading3,
      searchTerms: ["h3", "heading 3", "title 3", "titulo 3", "titulo 3"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 3 }),
        ),
    },
    {
      id: "bullet-list",
      title: labels.bulletList,
      searchTerms: [
        "bullet",
        "bulleted list",
        "unordered list",
        "lista",
        "lista com marcadores",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) => chain.toggleBulletList()),
    },
    {
      id: "ordered-list",
      title: labels.orderedList,
      searchTerms: [
        "numbered",
        "numbered list",
        "ordered list",
        "lista numerada",
        "lista ordenada",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.toggleOrderedList(),
        ),
    },
    {
      id: "blockquote",
      title: labels.blockquote,
      searchTerms: ["quote", "blockquote", "citacao", "cita", "cita"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.toggleBlockquote(),
        ),
    },
    {
      id: "code-block",
      title: labels.codeBlock,
      searchTerms: ["code", "code block", "codigo", "codigo", "fenced code"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) => chain.toggleCodeBlock()),
    },
  ];
}

export { createBlockCommandCatalog };
export type { BlockCommandCatalogItem, BlockCommandCatalogLabels };
