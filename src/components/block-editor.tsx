"use client";

import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
  BlockIdExtension,
  ParagraphSizeExtension,
} from "@/editor/block-editor-extensions";
import {
  BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  type BlockEditorDocument,
  createEmptyBlockEditorDocument,
  isSafeBlockEditorHref,
  normalizeBlockEditorDocument,
} from "@/editor/document";
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

function BlockEditor({
  value,
  onChange,
  onCreatePageRequest,
  placeholder,
  ariaLabel,
  className,
  labels,
  editable = true,
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

  React.useEffect(() => {
    createPageRequestRef.current = onCreatePageRequest;
  }, [onCreatePageRequest]);

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

    return {
      ...parsedLabels,
      smallText: parsedLabels.smallText || t("slashMenu.smallText"),
      alphabeticalList:
        parsedLabels.alphabeticalList || t("slashMenu.alphabeticalList"),
      romanList: parsedLabels.romanList || t("slashMenu.romanList"),
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
      BlockIdExtension,
      ParagraphSizeExtension,
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
    ],
    [placeholder, slashCommandExtension, taskCheckedLabel, taskUncheckedLabel],
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
    acceptExternalDocument(externalDocument);
    editor.commands.setContent(externalDocument.doc, {
      emitUpdate: false,
      errorOnInvalidContent: true,
    });
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
