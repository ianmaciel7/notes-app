import type { Editor, Range } from "@tiptap/core";
import type { ComponentType, SVGProps } from "react";

type BlockCommandIconProps = SVGProps<SVGSVGElement>;
type BlockCommandIcon = ComponentType<BlockCommandIconProps>;

type BlockCommandCatalogLabels = {
  text: string;
  smallText: string;
  createPage: string;
  page: string;
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  bulletList: string;
  alphabeticalList: string;
  orderedList: string;
  romanList: string;
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

function createGlyphIcon(glyph: string, fontSize = 13): BlockCommandIcon {
  return function GlyphIcon(props: BlockCommandIconProps) {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
        <text
          x="10"
          y="10.5"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
          fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
          fontSize={fontSize}
          fontWeight="400"
        >
          {glyph}
        </text>
      </svg>
    );
  };
}

const TextBlockIcon = createGlyphIcon("T", 14);
const SmallTextIcon = createGlyphIcon("Aa", 10.5);
const HeadingOneIcon = createGlyphIcon("H", 14);
const HeadingTwoIcon = createGlyphIcon("H₂", 13);
const HeadingThreeIcon = createGlyphIcon("H₃", 13);
const HeadingFourIcon = createGlyphIcon("H₄", 13);
const AlphabeticalListIcon = createGlyphIcon("a)", 10.5);
const NumericalListIcon = createGlyphIcon("1.", 11);
const RomanListIcon = createGlyphIcon("i)", 11);
const TaskListIcon = createGlyphIcon("☑", 13);
const BlockquoteIcon = createGlyphIcon("❞", 14);
const CodeBlockIcon = createGlyphIcon("<>", 9);
const HorizontalRuleIcon = createGlyphIcon("—", 15);

function BulletListIcon(props: BlockCommandIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="4.5" cy="6" r="1" fill="currentColor" />
      <circle cx="4.5" cy="10" r="1" fill="currentColor" />
      <circle cx="4.5" cy="14" r="1" fill="currentColor" />
      <path
        d="M8 6h7M8 10h7M8 14h7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
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

function setOrderedListType(
  editor: Editor,
  range: Range,
  type: "a" | "i" | null,
) {
  const chain = editor.chain().focus().deleteRange(range);
  if (editor.isActive("orderedList")) {
    chain.updateAttributes("orderedList", { type }).run();
    return;
  }
  chain.toggleOrderedList().updateAttributes("orderedList", { type }).run();
}

function createBlockCommandCatalog(
  labels: BlockCommandCatalogLabels,
): BlockCommandCatalogItem[] {
  return [
    {
      id: "text",
      icon: TextBlockIcon,
      title: labels.text,
      searchTerms: ["default", "padrao", "padrão", "text", "texto", "paragraph"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setParagraph().updateAttributes("paragraph", { size: null }),
        ),
    },
    {
      id: "small-text",
      icon: SmallTextIcon,
      title: labels.smallText,
      searchTerms: ["small", "small text", "pequeno", "texto pequeno"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setParagraph().updateAttributes("paragraph", { size: "small" }),
        ),
    },
    {
      id: "heading-1",
      icon: HeadingOneIcon,
      title: labels.heading1,
      searchTerms: ["h1", "heading 1", "cabecalho 1", "cabeçalho 1"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 1 }),
        ),
    },
    {
      id: "heading-2",
      icon: HeadingTwoIcon,
      title: labels.heading2,
      searchTerms: ["h2", "heading 2", "cabecalho 2", "cabeçalho 2"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 2 }),
        ),
    },
    {
      id: "heading-3",
      icon: HeadingThreeIcon,
      title: labels.heading3,
      searchTerms: ["h3", "heading 3", "cabecalho 3", "cabeçalho 3"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 3 }),
        ),
    },
    {
      id: "heading-4",
      icon: HeadingFourIcon,
      title: labels.heading4,
      searchTerms: ["h4", "heading 4", "cabecalho 4", "cabeçalho 4"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHeading({ level: 4 }),
        ),
    },
    {
      id: "bullet-list",
      icon: BulletListIcon,
      title: labels.bulletList,
      searchTerms: ["bullet", "bulleted list", "lista", "lista de marcadores"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) => chain.toggleBulletList()),
    },
    {
      id: "alphabetical-list",
      icon: AlphabeticalListIcon,
      title: labels.alphabeticalList,
      searchTerms: ["alphabetical", "alphabetic", "alfabetica", "alfabética"],
      execute: (editor, range) => setOrderedListType(editor, range, "a"),
    },
    {
      id: "ordered-list",
      icon: NumericalListIcon,
      title: labels.orderedList,
      searchTerms: ["numbered", "numerical", "numerada", "numerica", "numérica"],
      execute: (editor, range) => setOrderedListType(editor, range, null),
    },
    {
      id: "roman-list",
      icon: RomanListIcon,
      title: labels.romanList,
      searchTerms: ["roman", "romana", "romano"],
      execute: (editor, range) => setOrderedListType(editor, range, "i"),
    },
    {
      id: "task-list",
      icon: TaskListIcon,
      title: labels.taskList,
      searchTerms: ["task", "todo", "to-do", "tarefas", "checklist"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) => chain.toggleTaskList()),
    },
    {
      id: "blockquote",
      icon: BlockquoteIcon,
      title: labels.blockquote,
      searchTerms: ["quote", "blockquote", "citation", "citacao", "citação"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) => chain.toggleBlockquote()),
    },
    {
      id: "code-block",
      icon: CodeBlockIcon,
      title: labels.codeBlock,
      searchTerms: ["code", "codigo", "código"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) => chain.toggleCodeBlock()),
    },
    {
      id: "horizontal-rule",
      icon: HorizontalRuleIcon,
      title: labels.horizontalRule,
      searchTerms: ["divider", "rule", "separator", "linha", "separador"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) => chain.setHorizontalRule()),
    },
  ];
}

export type {
  BlockCommandCatalogItem,
  BlockCommandCatalogLabels,
  BlockCommandIcon,
};
export { createBlockCommandCatalog };
