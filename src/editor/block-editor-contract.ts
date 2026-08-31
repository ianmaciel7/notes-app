import type { BlockEditorDocument } from "@/editor/document";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import type { WorkspaceEntity } from "@/lib/workspace-objects";

type BlockEditorLabels = {
  bold: string;
  code: string;
  italic: string;
  slashMenu: {
    empty: string;
    cancel: string;
    createPage: string;
    text: string;
    smallText: string;
    page: string;
    heading1: string;
    heading2: string;
    heading3: string;
    heading4: string;
    navigate: string;
    bulletList: string;
    alphabeticalList: string;
    orderedList: string;
    romanList: string;
    taskList: string;
    tableBlock: string;
    select: string;
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
    title: string;
    toggle: string;
  };
};

type BlockEditorProps = {
  value: BlockEditorDocument;
  onChange?: (document: BlockEditorDocument) => void;
  onCreatePageRequest?: (title: string) => void;
  onCreateObjectReference?: (
    objectTypeId: string,
    title: string,
  ) => { readonly id: string; readonly label: string } | null;
  onCreateOrReuseTag?: (
    label: string,
  ) => { readonly id: string; readonly label: string } | null;
  onTagReference?: (tagId: string) => void;
  referenceEntities?: readonly WorkspaceEntity[];
  referenceStructures?: readonly WorkspaceStructure[];
  placeholder: string;
  ariaLabel: string;
  className?: string;
  labels: BlockEditorLabels;
  editable?: boolean;
};

export type { BlockEditorLabels, BlockEditorProps };
