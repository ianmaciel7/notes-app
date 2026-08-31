"use client";

import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CopyIcon, DownloadIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import { BlockHandle } from "@/components/block-editor-handle";
import { SelectionToolbar } from "@/components/block-editor-selection-toolbar";
import { createBlockCommandCatalog } from "@/editor/block-command-catalog";
import type {
  BlockEditorLabels,
  BlockEditorProps,
} from "@/editor/block-editor-contract";
import {
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
} from "@/editor/block-editor-extensions";
import {
  BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  type BlockEditorDocument,
  createEmptyBlockEditorDocument,
  isSafeBlockEditorHref,
  normalizeBlockEditorDocument,
} from "@/editor/document";
import { createQuickActionSuggestionExtensions } from "@/editor/quick-action-suggestions";
import { createReferenceSuggestionExtensions } from "@/editor/reference-suggestions";
import { createSlashCommandExtension } from "@/editor/slash-command";
import { useBufferedDocumentCommit } from "@/editor/use-buffered-document-commit";
import { cn } from "@/lib/utils";

function serializeDocument(document: BlockEditorDocument) {
  return JSON.stringify(document);
}

function normalizeSerializedDocument(serialized: string) {
  try {
    return (
      normalizeBlockEditorDocument(JSON.parse(serialized)) ??
      createEmptyBlockEditorDocument()
    );
  } catch {
    return createEmptyBlockEditorDocument();
  }
}

function setEditorContentSafely(
  editor: NonNullable<ReturnType<typeof useEditor>>,
  document: BlockEditorDocument,
) {
  try {
    editor.schema.nodeFromJSON(document.doc);
  } catch {
    const fallback = createEmptyBlockEditorDocument();
    editor.commands.setContent(fallback.doc, {
      emitUpdate: false,
      errorOnInvalidContent: false,
    });
    return fallback;
  }

  try {
    editor.commands.setContent(document.doc, {
      emitUpdate: false,
      errorOnInvalidContent: true,
    });
    return document;
  } catch {
    const fallback = createEmptyBlockEditorDocument();
    editor.commands.setContent(fallback.doc, {
      emitUpdate: false,
      errorOnInvalidContent: false,
    });
    return fallback;
  }
}

function editorAttributes(
  editable: boolean,
  ariaLabel: string,
  locale: string,
) {
  return editable
    ? {
        "aria-label": ariaLabel,
        "aria-multiline": "true",
        class:
          "notes-block-editor outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring/60 focus-visible:outline-solid",
        lang: locale,
        role: "textbox",
        spellcheck: "true",
      }
    : {
        "aria-label": ariaLabel,
        "aria-multiline": "false",
        class:
          "notes-block-editor notes-block-editor-readonly cursor-default outline-none",
        lang: locale,
        role: "document",
        spellcheck: "false",
      };
}

function selectedCodeBlock(editor: NonNullable<ReturnType<typeof useEditor>>) {
  const { $from } = editor.state.selection;
  for (let depth = $from.depth; depth >= 0; depth -= 1) {
    const node = $from.node(depth);
    if (node.type.name !== "codeBlock") continue;
    return {
      language:
        typeof node.attrs.language === "string" ? node.attrs.language : "txt",
      renderMode: node.attrs.renderMode === "mermaid" ? "mermaid" : "source",
      source: node.textContent,
    };
  }
  return null;
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function CodeBlockActionSurface({
  editor,
}: {
  editor: NonNullable<ReturnType<typeof useEditor>>;
}) {
  const [codeBlock, setCodeBlock] = React.useState(() =>
    selectedCodeBlock(editor),
  );

  React.useEffect(() => {
    const sync = () => setCodeBlock(selectedCodeBlock(editor));
    editor.on("selectionUpdate", sync);
    editor.on("update", sync);
    return () => {
      editor.off("selectionUpdate", sync);
      editor.off("update", sync);
    };
  }, [editor]);

  if (!codeBlock) return null;
  const extension = codeBlock.renderMode === "mermaid" ? "mmd" : "txt";
  const filename = `code-block.${extension}`;

  return (
    <div
      className="absolute right-0 top-0 z-10 flex gap-1 rounded-md border border-border bg-popover p-1 shadow-sm"
      contentEditable={false}
      data-slot="code-block-actions"
    >
      <button
        type="button"
        aria-label="Copy code block source"
        className="inline-flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        data-slot="code-block-copy"
        onClick={() => void navigator.clipboard?.writeText(codeBlock.source)}
      >
        <CopyIcon className="size-3.5" />
      </button>
      <button
        type="button"
        aria-label="Download code block source"
        className="inline-flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        data-code-language={codeBlock.language}
        data-slot="code-block-download"
        onClick={() => downloadTextFile(filename, codeBlock.source)}
      >
        <DownloadIcon className="size-3.5" />
      </button>
    </div>
  );
}

function BlockEditor({
  value,
  onChange,
  onCreatePageRequest,
  onCreateObjectReference,
  onCreateOrReuseTag,
  onTagReference,
  placeholder,
  ariaLabel,
  className,
  labels,
  editable = true,
  referenceEntities = [],
  referenceStructures = [],
}: BlockEditorProps) {
  const locale = useLocale();
  const t = useTranslations("workspace.editor");
  const taskCheckedLabel = t("taskChecked");
  const taskUncheckedLabel = t("taskUnchecked");
  const serializedValue = serializeDocument(value);
  const externalDocument = React.useMemo(
    () => normalizeSerializedDocument(serializedValue),
    [serializedValue],
  );
  const initialContentRef = React.useRef(externalDocument.doc);
  const createPageRequestRef = React.useRef(onCreatePageRequest);
  const createObjectReferenceRef = React.useRef(onCreateObjectReference);
  const createOrReuseTagRef = React.useRef(onCreateOrReuseTag);
  const tagReferenceRef = React.useRef(onTagReference);
  const referenceEntitiesRef = React.useRef(referenceEntities);
  const referenceStructuresRef = React.useRef(referenceStructures);

  React.useEffect(() => {
    createPageRequestRef.current = onCreatePageRequest;
  }, [onCreatePageRequest]);
  React.useEffect(() => {
    createObjectReferenceRef.current = onCreateObjectReference;
    createOrReuseTagRef.current = onCreateOrReuseTag;
    tagReferenceRef.current = onTagReference;
  }, [onCreateObjectReference, onCreateOrReuseTag, onTagReference]);
  React.useEffect(() => {
    referenceEntitiesRef.current = referenceEntities;
    referenceStructuresRef.current = referenceStructures;
  }, [referenceEntities, referenceStructures]);

  const {
    acceptExternalDocument,
    cancelPendingCommit,
    finishComposition,
    flushCommit,
    scheduleCommit,
    startComposition,
  } = useBufferedDocumentCommit({
    value: externalDocument,
    onCommit: onChange,
  });

  const slashLabelsKey = JSON.stringify(labels.slashMenu);
  const stableSlashLabels = React.useMemo<
    BlockEditorLabels["slashMenu"]
  >(() => {
    const parsedLabels = JSON.parse(slashLabelsKey) as Partial<
      BlockEditorLabels["slashMenu"]
    >;
    const fallbackLabels = {
      alphabeticalList: t("slashMenu.alphabeticalList"),
      columns: t("slashMenu.columns"),
      emojiText: t("slashMenu.emojiText"),
      group: t("slashMenu.group"),
      highlight: t("slashMenu.highlight"),
      math: t("slashMenu.math"),
      mermaid: t("slashMenu.mermaid"),
      objectEmbed: t("slashMenu.objectEmbed"),
      objectInline: t("slashMenu.objectInline"),
      romanList: t("slashMenu.romanList"),
      smallText: t("slashMenu.smallText"),
      tableBlock: t("slashMenu.tableBlock"),
      toggle: t("slashMenu.toggle"),
    } satisfies Partial<BlockEditorLabels["slashMenu"]>;

    return {
      ...fallbackLabels,
      ...Object.fromEntries(
        Object.entries(parsedLabels).filter(([, label]) => Boolean(label)),
      ),
    } as BlockEditorLabels["slashMenu"];
  }, [slashLabelsKey, t]);
  const handleCreatePageRequest = React.useCallback((title: string) => {
    createPageRequestRef.current?.(title);
  }, []);
  const slashCommandExtension = React.useMemo(
    () =>
      createSlashCommandExtension(stableSlashLabels, {
        onCreatePageRequest: handleCreatePageRequest,
      }),
    [handleCreatePageRequest, stableSlashLabels],
  );
  const referenceSuggestionExtensions = React.useMemo(
    () =>
      createReferenceSuggestionExtensions({
        entities: referenceEntities,
        getEntities: () => referenceEntitiesRef.current,
        getStructures: () => referenceStructuresRef.current,
        structures: referenceStructures,
      }),
    [referenceEntities, referenceStructures],
  );
  const quickActionSuggestionExtensions = React.useMemo(
    () =>
      createQuickActionSuggestionExtensions({
        blockLabels: stableSlashLabels,
        createTagLabel: "Create tag",
        getEntities: () => referenceEntitiesRef.current,
        getStructures: () => referenceStructuresRef.current,
        onCreateObjectReference: (objectTypeId, title) =>
          createObjectReferenceRef.current?.(objectTypeId, title) ?? null,
        onCreateOrReuseTag: (label) =>
          createOrReuseTagRef.current?.(label) ?? null,
        onTagReference: (tagId) => tagReferenceRef.current?.(tagId),
        tagTitle: "Tags",
      }),
    [stableSlashLabels],
  );
  const blockCommands = React.useMemo(
    () => createBlockCommandCatalog(stableSlashLabels),
    [stableSlashLabels],
  );
  const attributes = React.useMemo(
    () => editorAttributes(editable, ariaLabel, locale),
    [ariaLabel, editable, locale],
  );
  const editorProps = React.useMemo(() => ({ attributes }), [attributes]);
  const extensions = React.useMemo(
    () => [
      StarterKit.configure({
        dropcursor: {
          color: "#b8b3ad",
          width: 1,
          class: "block-editor-dropcursor",
        },
        heading: { levels: [1, 2, 3, 4] },
        link: {
          openOnClick: false,
          markdownLinks: true,
          isAllowedUri: isSafeBlockEditorHref,
        },
      }),
      ObjectLinkMark,
      BlockLinkMark,
      InlineMathMark,
      ObjectEmbedNode,
      HighlightBlockNode,
      MathBlockNode,
      ColumnNode,
      ColumnLayoutNode,
      GroupBlockNode,
      ObjectBlockNode,
      TableBlockNode,
      UnsupportedBlockNode,
      BlockIdExtension,
      ParagraphSizeExtension,
      AdvancedCodeBlockAttributes,
      TaskList,
      TaskItem.configure({
        nested: true,
        a11y: {
          checkboxLabel: (_node, checked) =>
            checked ? taskCheckedLabel : taskUncheckedLabel,
        },
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
      Markdown,
      slashCommandExtension,
      ...quickActionSuggestionExtensions,
      ...referenceSuggestionExtensions,
    ],
    [
      placeholder,
      quickActionSuggestionExtensions,
      referenceSuggestionExtensions,
      slashCommandExtension,
      taskCheckedLabel,
      taskUncheckedLabel,
    ],
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable,
    extensions,
    content: initialContentRef.current,
    editorProps,
    onUpdate: ({ editor: currentEditor }) => {
      if (!currentEditor.isEditable) return;
      scheduleCommit({
        schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
        doc: currentEditor.getJSON() as BlockEditorDocument["doc"],
      });
    },
  });

  React.useLayoutEffect(() => {
    if (!editor) return;
    const currentDocument = normalizeBlockEditorDocument({
      schemaVersion: BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
      doc: editor.getJSON(),
    });
    if (
      currentDocument &&
      serializeDocument(currentDocument) === serializeDocument(externalDocument)
    ) {
      acceptExternalDocument(externalDocument);
      return;
    }

    cancelPendingCommit();
    acceptExternalDocument(setEditorContentSafely(editor, externalDocument));
  }, [acceptExternalDocument, cancelPendingCommit, editor, externalDocument]);

  React.useEffect(() => {
    if (!editor) return;
    if (!editable) flushCommit();
    editor.setEditable(editable, false);
    editor.setOptions({ editorProps });
  }, [editable, editor, editorProps, flushCommit]);

  const interactions =
    editor && editable ? (
      <>
        <SelectionToolbar
          editor={editor}
          blockCommands={blockCommands}
          labels={labels}
        />
        <BlockHandle editor={editor} blockCommands={blockCommands} />
      </>
    ) : null;

  return (
    <div
      className={cn(
        "editor-prose relative mt-2 min-w-0 max-w-full [&_p[data-text-size=small]]:text-[14px] [&_p[data-text-size=small]]:leading-5",
        className,
      )}
      data-slot="block-editor"
      data-editable={editable}
    >
      {interactions}
      {editor && editable ? <CodeBlockActionSurface editor={editor} /> : null}
      <EditorContent
        editor={editor}
        onBlur={editable ? flushCommit : undefined}
        onCompositionEnd={editable ? finishComposition : undefined}
        onCompositionStart={editable ? startComposition : undefined}
      />
    </div>
  );
}

export type { BlockEditorLabels, BlockEditorProps };
export { BlockEditor };
