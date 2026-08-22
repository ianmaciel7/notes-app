"use client";

import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import * as React from "react";
import {
  type BlockEditorDocument,
  createEmptyBlockEditorDocument,
  normalizeBlockEditorDocument,
} from "@/editor/document";
import { createSlashCommandExtension } from "@/editor/slash-command";
import { useBufferedTextCommit } from "@/hooks/use-buffered-text-commit";
import { cn } from "@/lib/utils";

type BlockEditorLabels = {
  bold: string;
  code: string;
  italic: string;
  slashMenu: {
    empty: string;
    cancel: string;
    createPage: string;
    text: string;
    page: string;
    heading1: string;
    heading2: string;
    heading3: string;
    heading4: string;
    navigate: string;
    bulletList: string;
    orderedList: string;
    taskList: string;
    select: string;
    blockquote: string;
    codeBlock: string;
    horizontalRule: string;
    title: string;
  };
};

function serializeBlockEditorDocument(document: BlockEditorDocument) {
  return JSON.stringify(document);
}

function parseBlockEditorDocument(serialized: string) {
  try {
    return (
      normalizeBlockEditorDocument(JSON.parse(serialized)) ??
      createEmptyBlockEditorDocument()
    );
  } catch {
    return createEmptyBlockEditorDocument();
  }
}

export function BlockEditor({
  value,
  onChange,
  onCreatePageRequest,
  placeholder,
  ariaLabel,
  className,
  labels,
}: {
  value: BlockEditorDocument;
  onChange: (document: BlockEditorDocument) => void;
  onCreatePageRequest?: (title: string) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
  labels: BlockEditorLabels;
}) {
  const { draft, inputProps, setDraft } =
    useBufferedTextCommit<BlockEditorDocument>({
      value,
      onCommit: onChange,
      format: serializeBlockEditorDocument,
      parse: parseBlockEditorDocument,
    });
  const draftDocument = React.useMemo(
    () => parseBlockEditorDocument(draft),
    [draft],
  );
  const slashCommandExtension = React.useMemo(
    () =>
      createSlashCommandExtension(labels.slashMenu, {
        onCreatePageRequest,
      }),
    [labels.slashMenu, onCreatePageRequest],
  );
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder }),
      Markdown,
      slashCommandExtension,
    ],
    content: draftDocument.doc,
    editorProps: {
      attributes: {
        "aria-label": ariaLabel,
        "aria-multiline": "true",
        class: "notes-block-editor focus:outline-none",
        lang: "pt-BR",
        role: "textbox",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setDraft(
        serializeBlockEditorDocument({
          schemaVersion: 1,
          doc: currentEditor.getJSON() as BlockEditorDocument["doc"],
        }),
      );
    },
  });

  React.useEffect(() => {
    if (
      !editor ||
      editor.isFocused ||
      JSON.stringify(editor.getJSON()) === JSON.stringify(draftDocument.doc)
    ) {
      return;
    }

    editor.commands.setContent(draftDocument.doc, {
      emitUpdate: false,
    });
  }, [draftDocument.doc, editor]);

  return (
    <div
      className={cn("editor-prose relative mt-2", className)}
      data-slot="block-editor"
    >
      {editor ? (
        <BubbleMenu editor={editor}>
          <div
            className="flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-md"
            data-slot="block-editor-selection-menu"
          >
            {(
              [
                [
                  "bold",
                  labels.bold,
                  () => editor.chain().focus().toggleBold().run(),
                ],
                [
                  "italic",
                  labels.italic,
                  () => editor.chain().focus().toggleItalic().run(),
                ],
                [
                  "code",
                  labels.code,
                  () => editor.chain().focus().toggleCode().run(),
                ],
              ] as const
            ).map(([mark, label, command]) => (
              <button
                key={mark}
                type="button"
                aria-label={label}
                aria-pressed={editor.isActive(mark)}
                onClick={command}
                className="h-7 rounded px-2 text-sm font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-accent"
              >
                {mark === "bold" ? "B" : mark === "italic" ? "I" : "<>"}
              </button>
            ))}
          </div>
        </BubbleMenu>
      ) : null}
      <EditorContent
        editor={editor}
        onBlur={inputProps.onBlur}
        onCompositionEnd={inputProps.onCompositionEnd}
        onCompositionStart={inputProps.onCompositionStart}
        onFocus={inputProps.onFocus}
      />
    </div>
  );
}
