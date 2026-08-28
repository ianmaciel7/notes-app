import type {
  BlockEditorDocument,
  BlockEditorNode,
} from "../editor/document.ts";

type EditorOutlineItem = {
  readonly id: string;
  readonly level: number;
  readonly title: string;
};

type EditorStatistics = {
  readonly characters: number;
  readonly paragraphs: number;
  readonly sentences: number;
  readonly words: number;
};

type EditorUtilityTimestamps = {
  readonly createdAt: string;
  readonly updatedAt?: string;
};

type EditorUtilities = EditorUtilityTimestamps & {
  readonly outline: readonly EditorOutlineItem[];
  readonly statistics: EditorStatistics;
};

function editorNodeText(node: BlockEditorNode): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  return (node.content ?? []).map(editorNodeText).join("");
}

function countSentences(nodes: readonly BlockEditorNode[]): number {
  return nodes
    .filter((node) => node.type !== "heading")
    .reduce((count, node) => {
      const text = editorNodeText(node).trim();
      if (!text) return count;
      const terminated = text.match(/[.!?]+(?=\s|$)/gu)?.length ?? 0;
      return count + Math.max(terminated, 1);
    }, 0);
}

function selectEditorUtilities(
  document: BlockEditorDocument,
  timestamps: EditorUtilityTimestamps,
): EditorUtilities {
  const nodes = document.doc.content;
  const texts = nodes.map(editorNodeText);
  const plainText = texts.join("\n");
  const words = plainText.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu);
  const outline = nodes.flatMap<EditorOutlineItem>((node) => {
    if (node.type !== "heading") return [];
    const title = editorNodeText(node).trim();
    if (!title) return [];
    return [
      {
        id: typeof node.attrs?.id === "string" ? node.attrs.id : node.type,
        level:
          typeof node.attrs?.level === "number" ? node.attrs.level : 1,
        title,
      },
    ];
  });

  return {
    ...timestamps,
    outline,
    statistics: {
      characters: plainText.length,
      paragraphs: nodes.filter((node) => node.type !== "horizontalRule").length,
      sentences: countSentences(nodes),
      words: words?.length ?? 0,
    },
  };
}

export type {
  EditorOutlineItem,
  EditorStatistics,
  EditorUtilities,
  EditorUtilityTimestamps,
};
export { selectEditorUtilities };
