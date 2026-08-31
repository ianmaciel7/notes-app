import type { Editor, Range } from "@tiptap/core";
import type { ComponentType, SVGProps } from "react";
import { createBlockId } from "./document.ts";
import { createTableBlockNode } from "./table-block.ts";

type BlockCommandIconProps = SVGProps<SVGSVGElement>;
type BlockCommandIcon = ComponentType<BlockCommandIconProps>;

type BlockCommandCatalogLabels = {
  empty: string;
  text: string;
  smallText: string;
  createPage: string;
  page: string;
  title: string;
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  bulletList: string;
  alphabeticalList: string;
  orderedList: string;
  romanList: string;
  taskList: string;
  tableBlock: string;
  blockquote: string;
  codeBlock: string;
  columns: string;
  emojiText: string;
  group: string;
  highlight: string;
  horizontalRule: string;
  math: string;
  mermaid: string;
  objectEmbed: string;
  objectInline: string;
  toggle: string;
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
const TableBlockIcon = createGlyphIcon("▦", 13);
const BlockquoteIcon = createGlyphIcon("❞", 14);
const CodeBlockIcon = createGlyphIcon("<>", 9);
const ColumnsIcon = createGlyphIcon("▥", 14);
const EmojiTextIcon = createGlyphIcon("☺", 13);
const GroupIcon = createGlyphIcon("□", 14);
const HighlightIcon = createGlyphIcon("≡", 14);
const HorizontalRuleIcon = createGlyphIcon("—", 15);
const MathIcon = createGlyphIcon("Σ", 14);
const MermaidIcon = createGlyphIcon("◇", 14);
const ObjectBlockIcon = createGlyphIcon("@", 14);
const ToggleIcon = createGlyphIcon("▸", 13);

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

function selectedTopLevelBlocks(editor: Editor, range: Range) {
  const blocks: {
    from: number;
    node: Record<string, unknown>;
    to: number;
  }[] = [];
  editor.state.doc.forEach((node, offset) => {
    const from = offset;
    const to = offset + node.nodeSize;
    if (to <= range.from || from >= range.to) return;
    blocks.push({ from, node: node.toJSON(), to });
  });
  return blocks;
}

function replaceTopLevelSelection(
  editor: Editor,
  range: Range,
  content: Record<string, unknown> | Record<string, unknown>[],
) {
  const blocks = selectedTopLevelBlocks(editor, range);
  if (blocks.length === 0) return false;
  editor
    .chain()
    .focus()
    .deleteRange({ from: blocks[0].from, to: blocks.at(-1)?.to ?? range.to })
    .insertContentAt(blocks[0].from, content, { updateSelection: true })
    .run();
  return true;
}

function groupSelectedBlocks(editor: Editor, range: Range) {
  const blocks = selectedTopLevelBlocks(editor, range);
  if (blocks.length === 1 && blocks[0].node.type === "groupBlock") {
    const content = Array.isArray(blocks[0].node.content)
      ? blocks[0].node.content
      : [{ type: "paragraph", attrs: { id: createBlockId() } }];
    return replaceTopLevelSelection(editor, range, content);
  }
  if (blocks.length > 0) {
    return replaceTopLevelSelection(editor, range, {
      type: "groupBlock",
      attrs: { appearance: "card", id: createBlockId(), width: "content" },
      content: blocks.map((block) => block.node),
    });
  }
  return false;
}

function columnizeSelectedBlocks(editor: Editor, range: Range) {
  const blocks = selectedTopLevelBlocks(editor, range);
  if (blocks.length === 0) return false;
  const columnCount = 2;
  const columns = Array.from({ length: columnCount }, (_, index) => {
    const content = blocks
      .slice(
        Math.ceil((blocks.length * index) / columnCount),
        Math.ceil((blocks.length * (index + 1)) / columnCount),
      )
      .map((block) => block.node);
    return {
      type: "column",
      attrs: { id: createBlockId(), width: 1 / columnCount },
      content:
        content.length > 0
          ? content
          : [{ type: "paragraph", attrs: { id: createBlockId() } }],
    };
  });
  return replaceTopLevelSelection(editor, range, {
    type: "columnLayout",
    attrs: {
      columnCount,
      id: createBlockId(),
      layoutMode: "columns",
      width: "content",
    },
    content: columns,
  });
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
      searchTerms: [
        "default",
        "padrao",
        "padrão",
        "text",
        "texto",
        "paragraph",
      ],
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
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.toggleBulletList(),
        ),
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
      searchTerms: [
        "numbered",
        "numerical",
        "numerada",
        "numerica",
        "numérica",
      ],
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
      id: "table-block",
      icon: TableBlockIcon,
      title: labels.tableBlock,
      searchTerms: ["table", "tabela", "grid", "spreadsheet"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.insertContent(createTableBlockNode()),
        ),
    },
    {
      id: "blockquote",
      icon: BlockquoteIcon,
      title: labels.blockquote,
      searchTerms: ["quote", "blockquote", "citation", "citacao", "citação"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.toggleBlockquote(),
        ),
    },
    {
      id: "code-block",
      icon: CodeBlockIcon,
      title: labels.codeBlock,
      searchTerms: ["code", "codigo", "código"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.toggleCodeBlock(),
        ),
    },
    {
      id: "mermaid",
      icon: MermaidIcon,
      title: labels.mermaid,
      searchTerms: ["mermaid", "diagram", "diagrama", "flowchart"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.toggleCodeBlock().updateAttributes("codeBlock", {
            language: "mermaid",
            renderMode: "mermaid",
            sourceStatus: "valid",
          }),
        ),
    },
    {
      id: "toggle",
      icon: ToggleIcon,
      title: labels.toggle,
      searchTerms: ["toggle", "collapsible", "alternar", "recolhivel"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setParagraph().updateAttributes("paragraph", {
            toggleCollapsed: false,
          }),
        ),
    },
    {
      id: "emoji-text",
      icon: EmojiTextIcon,
      title: labels.emojiText,
      searchTerms: ["emoji", "icon", "icone", "ícone"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setParagraph().updateAttributes("paragraph", { emoji: "✨" }),
        ),
    },
    {
      id: "highlight",
      icon: HighlightIcon,
      title: labels.highlight,
      searchTerms: ["highlight", "quote", "destaque", "marcacao", "marcação"],
      execute: (editor, range) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "highlightBlock",
            attrs: { color: "yellow" },
            content: [{ type: "text", text: "Highlight" }],
          })
          .run(),
    },
    {
      id: "math",
      icon: MathIcon,
      title: labels.math,
      searchTerms: ["math", "tex", "latex", "formula", "matematica"],
      execute: (editor, range) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "mathBlock",
            attrs: {
              displayMode: "block",
              source: "E = mc^2",
              sourceStatus: "valid",
            },
          })
          .run(),
    },
    {
      id: "columns",
      icon: ColumnsIcon,
      title: labels.columns,
      searchTerms: ["columns", "grid", "colunas", "grade"],
      execute: (editor, range) => {
        if (columnizeSelectedBlocks(editor, range)) return;
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "columnLayout",
            attrs: { columnCount: 2, layoutMode: "columns", width: "content" },
            content: [
              {
                type: "column",
                attrs: { width: 0.5 },
                content: [{ type: "paragraph" }],
              },
              {
                type: "column",
                attrs: { width: 0.5 },
                content: [{ type: "paragraph" }],
              },
            ],
          })
          .run();
      },
    },
    {
      id: "group",
      icon: GroupIcon,
      title: labels.group,
      searchTerms: ["group", "container", "grupo"],
      execute: (editor, range) => {
        if (groupSelectedBlocks(editor, range)) return;
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "groupBlock",
            attrs: { appearance: "card", width: "content" },
            content: [{ type: "paragraph" }],
          })
          .run();
      },
    },
    {
      id: "object-inline",
      icon: ObjectBlockIcon,
      title: labels.objectInline,
      searchTerms: ["object", "inline", "objeto"],
      execute: (editor, range) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "objectBlock",
            attrs: {
              targetId: "object:pending",
              title: "Object",
              viewKind: "inline",
            },
          })
          .run(),
    },
    {
      id: "object-embed",
      icon: ObjectBlockIcon,
      title: labels.objectEmbed,
      searchTerms: ["embed", "transclusion", "object card", "objeto"],
      execute: (editor, range) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "objectBlock",
            attrs: {
              state: "read-only",
              targetId: "object:pending",
              title: "Object",
              viewKind: "embed",
            },
          })
          .run(),
    },
    {
      id: "horizontal-rule",
      icon: HorizontalRuleIcon,
      title: labels.horizontalRule,
      searchTerms: ["divider", "rule", "separator", "linha", "separador"],
      execute: (editor, range) =>
        runWithDeletedTrigger(editor, range, (chain) =>
          chain.setHorizontalRule(),
        ),
    },
  ];
}

export type {
  BlockCommandCatalogItem,
  BlockCommandCatalogLabels,
  BlockCommandIcon,
};
export { createBlockCommandCatalog };
