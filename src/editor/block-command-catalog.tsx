import type { Editor, Range } from "@tiptap/core";
import type { ComponentType, SVGProps } from "react";

type BlockCommandIconProps = SVGProps<SVGSVGElement>;
type BlockCommandIcon = ComponentType<BlockCommandIconProps>;

type BlockCommandCatalogLabels = {
  text: string;
  createPage: string;
  page: string;
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  bulletList: string;
  orderedList: string;
  taskList: string;
  blockquote: string;
  codeBlock: string;
  horizontalRule: string;
};

type BlockCommandCatalogItem = {
  id: string;
  icon: BlockCommandIcon;
  title: string;
  badge?: string;
  searchTerms: string[];
  execute: (editor: Editor, range: Range) => void;
};

function TextBlockIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M208 56v32a8 8 0 0 1-16 0V64h-56v128h24a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16h24V64H64v24a8 8 0 0 1-16 0V56a8 8 0 0 1 8-8h144a8 8 0 0 1 8 8" />
    </svg>
  );
}

function HeadingOneIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M208 56v144a8 8 0 0 1-16 0v-64H64v64a8 8 0 0 1-16 0V56a8 8 0 0 1 16 0v64h128V56a8 8 0 0 1 16 0" />
    </svg>
  );
}

function HeadingTwoIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M152 56v120a8 8 0 0 1-16 0v-52H48v52a8 8 0 0 1-16 0V56a8 8 0 0 1 16 0v52h88V56a8 8 0 0 1 16 0m88 144h-32l33.55-44.74a32 32 0 1 0-55.73-29.93a8 8 0 1 0 15.08 5.34a16.3 16.3 0 0 1 2.32-4.3a16 16 0 1 1 25.54 19.27L185.6 203.2A8 8 0 0 0 192 216h48a8 8 0 0 0 0-16" />
    </svg>
  );
}

function HeadingThreeIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M152 56v120a8 8 0 0 1-16 0v-52H48v52a8 8 0 0 1-16 0V56a8 8 0 0 1 16 0v52h88V56a8 8 0 0 1 16 0m73.52 90.63l21-30A8 8 0 0 0 240 104h-48a8 8 0 0 0 0 16h32.63l-19.18 27.41A8 8 0 0 0 212 160a20 20 0 1 1-14.29 34a8 8 0 1 0-11.42 11.19A36 36 0 0 0 248 180a36.07 36.07 0 0 0-22.48-33.37" />
    </svg>
  );
}

function HeadingFourIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M152 56v120a8 8 0 0 1-16 0v-52H48v52a8 8 0 0 1-16 0V56a8 8 0 0 1 16 0v52h88V56a8 8 0 0 1 16 0m94.7 116.46A8 8 0 0 0 240 168h-8v-56a8 8 0 0 0-14.66-4.44l-40 60A8 8 0 0 0 184 180h32v20a8 8 0 0 0 16 0v-20h8a8 8 0 0 0 6.7-12.46M216 168h-17.05L216 142.42Z" />
    </svg>
  );
}

function BulletListIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M80 64a8 8 0 0 1 8-8h128a8 8 0 0 1 0 16H88a8 8 0 0 1-8-8m136 56H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16m0 64H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16M44 68a12 12 0 1 0-12-12a12 12 0 0 0 12 12m0 64a12 12 0 1 0-12-12a12 12 0 0 0 12 12m0 64a12 12 0 1 0-12-12a12 12 0 0 0 12 12" />
    </svg>
  );
}

function OrderedListIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M88 64a8 8 0 0 1 8-8h120a8 8 0 0 1 0 16H96a8 8 0 0 1-8-8m128 56H96a8 8 0 0 0 0 16h120a8 8 0 0 0 0-16m0 64H96a8 8 0 0 0 0 16h120a8 8 0 0 0 0-16M43.58 55.16L32 63.89a8 8 0 1 0 9.64 12.78L44 74.89V112a8 8 0 0 0 16 0V64a8 8 0 0 0-12.42-8.84m17.23 100.3A8 8 0 0 0 53.66 152H40a8 8 0 0 0 0 16h2.69l-8.35 9.74A8 8 0 0 0 40.41 192H56a8 8 0 0 0 0-16H49.11l10.48-12.23a8 8 0 0 0 1.22-8.31" />
    </svg>
  );
}

function TaskListIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32M104 80h104a8 8 0 0 0 0-16H104a8 8 0 0 0 0 16m104 40h-72a8 8 0 0 0 0 16h72a8 8 0 0 0 0-16" />
    </svg>
  );
}

function BlockquoteIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M100 80H48a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h40a16 16 0 0 0 16-16V96a16 16 0 0 0-4-10.58l24.91-29.06a8 8 0 0 0-12.14-10.36l-32 37.34A16 16 0 0 0 72 96v64H48V96h52a8 8 0 0 0 0-16m108 0h-52a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h40a16 16 0 0 0 16-16V96a16 16 0 0 0-4-10.58l24.91-29.06a8 8 0 1 0-12.14-10.36l-32 37.34A16 16 0 0 0 180 96v64h-24V96h52a8 8 0 0 0 0-16" />
    </svg>
  );
}

function CodeBlockIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M96.62 57.37a8 8 0 0 1 0 11.31L69.25 96l27.37 27.31a8 8 0 0 1-11.31 11.32l-33-32.69a8 8 0 0 1 0-11.32l33-32.69a8 8 0 0 1 11.31 0m74.07.06a8 8 0 0 0-11.32 0l-33 32.69a8 8 0 0 0 0 11.32l33 32.69a8 8 0 0 0 11.31-11.32L143.31 96l27.37-27.32a8 8 0 0 0 .01-11.31" />
    </svg>
  );
}

function HorizontalRuleIcon(props: BlockCommandIconProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8" />
    </svg>
  );
}

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
      icon: TextBlockIcon,
      title: labels.text,
      searchTerms: [
        "default",
        "padrao",
        "padrão",
        "text",
        "texto",
        "paragraph",
        "paragrafo",
        "parágrafo",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) => chain.setParagraph()),
    },
    {
      id: "heading-1",
      icon: HeadingOneIcon,
      title: labels.heading1,
      searchTerms: [
        "h1",
        "heading 1",
        "header 1",
        "cabecalho 1",
        "cabeçalho 1",
        "title 1",
        "titulo 1",
        "título 1",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 1 }),
        ),
    },
    {
      id: "heading-2",
      icon: HeadingTwoIcon,
      title: labels.heading2,
      searchTerms: [
        "h2",
        "heading 2",
        "header 2",
        "cabecalho 2",
        "cabeçalho 2",
        "title 2",
        "titulo 2",
        "título 2",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 2 }),
        ),
    },
    {
      id: "heading-3",
      icon: HeadingThreeIcon,
      title: labels.heading3,
      searchTerms: [
        "h3",
        "heading 3",
        "header 3",
        "cabecalho 3",
        "cabeçalho 3",
        "title 3",
        "titulo 3",
        "título 3",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 3 }),
        ),
    },
    {
      id: "heading-4",
      icon: HeadingFourIcon,
      title: labels.heading4,
      searchTerms: [
        "h4",
        "heading 4",
        "header 4",
        "cabecalho 4",
        "cabeçalho 4",
        "title 4",
        "titulo 4",
        "título 4",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 4 }),
        ),
    },
    {
      id: "bullet-list",
      icon: BulletListIcon,
      title: labels.bulletList,
      searchTerms: [
        "bullet",
        "bulleted list",
        "unordered list",
        "lista",
        "lista de marcadores",
        "lista com marcadores",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.toggleBulletList(),
        ),
    },
    {
      id: "ordered-list",
      icon: OrderedListIcon,
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
      id: "task-list",
      icon: TaskListIcon,
      title: labels.taskList,
      searchTerms: [
        "task",
        "tasks",
        "task list",
        "todo",
        "checkbox",
        "tarefa",
        "tarefas",
        "lista de tarefas",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) => chain.toggleTaskList()),
    },
    {
      id: "blockquote",
      icon: BlockquoteIcon,
      title: labels.blockquote,
      searchTerms: [
        "quote",
        "blockquote",
        "block quote",
        "bloco de citacao",
        "bloco de citação",
        "citacao",
        "citação",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.toggleBlockquote(),
        ),
    },
    {
      id: "code-block",
      icon: CodeBlockIcon,
      title: labels.codeBlock,
      searchTerms: ["code", "code block", "codigo", "código", "fenced code"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.toggleCodeBlock(),
        ),
    },
    {
      id: "horizontal-rule",
      icon: HorizontalRuleIcon,
      title: labels.horizontalRule,
      searchTerms: [
        "divider",
        "rule",
        "horizontal line",
        "horizontal rule",
        "linha",
        "linha horizontal",
        "separador",
      ],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHorizontalRule(),
        ),
    },
  ];
}

export type { BlockCommandCatalogItem, BlockCommandCatalogLabels };
export { createBlockCommandCatalog };
