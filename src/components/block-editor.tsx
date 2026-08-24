"use client";

import type { Editor } from "@tiptap/core";
import DragHandle from "@tiptap/extension-drag-handle-react";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  ChevronDownIcon,
  Code2Icon,
  GripVerticalIcon,
  ItalicIcon,
  LinkIcon,
  PlusIcon,
  Redo2Icon,
  Undo2Icon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  type BlockEditorDocument,
  type BlockEditorNode,
  createEmptyBlockEditorDocument,
  normalizeBlockEditorDocument,
} from "@/editor/document";
import { createBlockCommandCatalog } from "@/editor/block-command-catalog";
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

type BlockEditorProps = {
  value: BlockEditorDocument;
  onChange?: (document: BlockEditorDocument) => void;
  onCreatePageRequest?: (title: string) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
  labels: BlockEditorLabels;
  editable?: boolean;
};

type SelectionRange = { from: number; to: number };

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

function normalizeLinkHref(input: string) {
  const value = input.trim();
  if (!value) return null;
  if (/^(https?:|mailto:|\/|#)/i.test(value)) return value;
  return /^[\w.-]+\.[a-z]{2,}(?:[/?#].*)?$/i.test(value)
    ? `https://${value}`
    : null;
}

function insertableBlock(itemId: string): BlockEditorNode | null {
  if (itemId === "text") return { type: "paragraph" };
  if (itemId.startsWith("heading-")) {
    return { type: "heading", attrs: { level: Number(itemId.slice(-1)) } };
  }
  if (itemId === "bullet-list" || itemId === "ordered-list") {
    return {
      type: itemId === "bullet-list" ? "bulletList" : "orderedList",
      content: [{ type: "listItem", content: [{ type: "paragraph" }] }],
    };
  }
  if (itemId === "task-list") {
    return {
      type: "taskList",
      content: [
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [{ type: "paragraph" }],
        },
      ],
    };
  }
  if (itemId === "blockquote") {
    return { type: "blockquote", content: [{ type: "paragraph" }] };
  }
  if (itemId === "code-block") return { type: "codeBlock" };
  if (itemId === "horizontal-rule") return { type: "horizontalRule" };
  return null;
}

type EditorCommandCatalog = ReturnType<typeof createBlockCommandCatalog>;

function editorAttributes(editable: boolean, ariaLabel: string, locale: string) {
  return editable
    ? {
        "aria-label": ariaLabel,
        "aria-multiline": "true",
        class: "notes-block-editor focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring/60",
        lang: locale,
        role: "textbox",
        spellcheck: "true",
      }
    : {
        "aria-label": ariaLabel,
        "aria-multiline": "false",
        class: "notes-block-editor notes-block-editor-readonly cursor-default outline-none",
        lang: locale,
        role: "document",
        spellcheck: "false",
      };
}

function SelectionToolbar({
  editor,
  blockCommands,
  labels,
}: {
  editor: Editor;
  blockCommands: EditorCommandCatalog;
  labels: BlockEditorLabels;
}) {
  const t = useTranslations("workspace.editor");
  const selectionRef = React.useRef<SelectionRange | null>(null);
  const linkWasActiveRef = React.useRef(false);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkHref, setLinkHref] = React.useState("");
  const [linkError, setLinkError] = React.useState(false);

  function rememberSelection() {
    selectionRef.current = {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };
  }

  function restoreSelection() {
    if (!selectionRef.current) return editor.chain().focus();
    return editor.chain().focus().setTextSelection(selectionRef.current);
  }

  function toggleMark(mark: "bold" | "italic" | "code") {
    const chain = restoreSelection();
    if (mark === "bold") chain.toggleBold().run();
    else if (mark === "italic") chain.toggleItalic().run();
    else chain.toggleCode().run();
  }

  function transformBlock(id: string) {
    const chain = restoreSelection();
    if (id === "text") chain.setParagraph().run();
    else if (id.startsWith("heading-")) {
      chain.setHeading({ level: Number(id.slice(-1)) as 1 | 2 | 3 | 4 }).run();
    } else if (id === "bullet-list") chain.toggleBulletList().run();
    else if (id === "ordered-list") chain.toggleOrderedList().run();
    else if (id === "task-list") chain.toggleTaskList().run();
    else if (id === "blockquote") chain.toggleBlockquote().run();
    else if (id === "code-block") chain.toggleCodeBlock().run();
  }

  function setLinkPopover(open: boolean) {
    if (open) {
      rememberSelection();
      linkWasActiveRef.current = editor.isActive("link");
      setLinkHref(String(editor.getAttributes("link").href ?? ""));
      setLinkError(false);
    }
    setLinkOpen(open);
  }

  function applyLink() {
    const href = normalizeLinkHref(linkHref);
    if (!href) {
      setLinkError(true);
      return;
    }
    const chain = restoreSelection();
    if (linkWasActiveRef.current) chain.extendMarkRange("link");
    chain.setLink({ href }).run();
    setLinkOpen(false);
  }

  function removeLink() {
    const chain = restoreSelection();
    if (linkWasActiveRef.current) chain.extendMarkRange("link");
    chain.unsetLink().run();
    setLinkOpen(false);
  }

  return (
    <BubbleMenu editor={editor}>
      <div
        role="toolbar"
        aria-label={t("selectionToolbar")}
        data-slot="block-editor-selection-menu"
        className="flex max-w-[calc(100vw-1rem)] items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-md"
        onPointerDown={rememberSelection}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm" aria-label={t("blockType")} className="h-7 gap-1 px-1.5">
                <span aria-hidden="true">¶</span>
                <ChevronDownIcon className="size-3" />
              </Button>
            }
          />
          <DropdownMenuContent className="min-w-44" sideOffset={6}>
            {blockCommands.filter((item) => item.id !== "horizontal-rule").map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem key={item.id} onClick={() => transformBlock(item.id)}>
                  <Icon className="size-4" />
                  {item.title}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <ToggleGroup spacing={0} variant="ghost" size="sm">
          <ToggleGroupItem aria-label={labels.bold} pressed={editor.isActive("bold")} onMouseDown={(e) => e.preventDefault()} onPressedChange={() => toggleMark("bold")}>
            <BoldIcon className="size-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem aria-label={labels.italic} pressed={editor.isActive("italic")} onMouseDown={(e) => e.preventDefault()} onPressedChange={() => toggleMark("italic")}>
            <ItalicIcon className="size-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem aria-label={labels.code} pressed={editor.isActive("code")} onMouseDown={(e) => e.preventDefault()} onPressedChange={() => toggleMark("code")}>
            <Code2Icon className="size-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Popover open={linkOpen} onOpenChange={setLinkPopover}>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label={t("link")} aria-pressed={editor.isActive("link")} className="h-7 w-7 aria-pressed:bg-muted" onPointerDown={rememberSelection}>
                <LinkIcon className="size-3.5" />
              </Button>
            }
          />
          <PopoverContent side="top" sideOffset={8} className="w-72 gap-2 p-2" data-slot="block-editor-link-popover">
            <form onSubmit={(e) => { e.preventDefault(); applyLink(); }} className="space-y-2">
              <Input autoFocus value={linkHref} onChange={(e) => { setLinkHref(e.target.value); setLinkError(false); }} aria-label={t("linkUrl")} aria-invalid={linkError || undefined} placeholder="https://example.com" />
              {linkError ? <p role="alert" className="text-xs text-destructive">{t("invalidLink")}</p> : null}
              <div className="flex justify-end gap-1">
                {linkWasActiveRef.current ? <Button type="button" variant="ghost" size="sm" onClick={removeLink}>{t("removeLink")}</Button> : null}
                <Button type="submit" size="sm">{t("applyLink")}</Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon-sm" aria-label={t("undo")} disabled={!editor.can().chain().focus().undo().run()} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2Icon className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label={t("redo")} disabled={!editor.can().chain().focus().redo().run()} onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2Icon className="size-3.5" />
        </Button>
      </div>
    </BubbleMenu>
  );
}

function useDesktopDragHandle() {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px)",
    );
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return enabled;
}

function BlockHandle({
  editor,
  blockCommands,
}: {
  editor: Editor;
  blockCommands: EditorCommandCatalog;
}) {
  const t = useTranslations("workspace.editor");
  const enabled = useDesktopDragHandle();
  const [handlePosition, setHandlePosition] = React.useState<number | null>(null);

  function insertBlock(id: string) {
    if (handlePosition === null) return;
    const block = insertableBlock(id);
    if (block) editor.chain().focus().insertContentAt(handlePosition, block).run();
    editor.commands.unlockDragHandle();
  }

  if (!enabled) return null;

  return (
    <DragHandle editor={editor} nested={false} onNodeChange={({ pos }) => setHandlePosition(typeof pos === "number" ? pos : null)}>
      <div data-slot="block-editor-block-handle" className="flex items-center gap-0.5 opacity-100 transition-opacity duration-100 motion-reduce:transition-none">
        <DropdownMenu onOpenChange={(open) => open ? editor.commands.lockDragHandle() : editor.commands.unlockDragHandle()}>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" aria-label={t("insertBlock")} className="h-[22px] w-[18px] min-w-0 rounded px-0" disabled={handlePosition === null} onPointerDown={(e) => e.stopPropagation()}>
                <PlusIcon className="size-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent side="left" align="start" sideOffset={6} className="min-w-52">
            {blockCommands.map((item) => {
              const Icon = item.icon;
              return <DropdownMenuItem key={item.id} onClick={() => insertBlock(item.id)}><Icon className="size-4" />{item.title}</DropdownMenuItem>;
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <span role="img" aria-label={t("dragBlock")} className="flex h-[22px] w-[18px] cursor-grab items-center justify-center rounded text-muted-foreground active:cursor-grabbing">
          <GripVerticalIcon className="size-3.5" />
        </span>
      </div>
    </DragHandle>
  );
}

export function BlockEditor({
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
  const { draft, inputProps, setDraft } = useBufferedTextCommit<BlockEditorDocument>({
    value,
    onCommit: onChange ?? (() => undefined),
    format: serializeBlockEditorDocument,
    parse: parseBlockEditorDocument,
  });
  const draftDocument = React.useMemo(() => parseBlockEditorDocument(draft), [draft]);
  const slashCommandExtension = React.useMemo(
    () => createSlashCommandExtension(labels.slashMenu, { onCreatePageRequest }),
    [labels.slashMenu, onCreatePageRequest],
  );
  const blockCommands = React.useMemo(
    () => createBlockCommandCatalog(labels.slashMenu),
    [labels.slashMenu],
  );
  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: { openOnClick: false },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder }),
      Markdown,
      slashCommandExtension,
    ],
    content: draftDocument.doc,
    editorProps: { attributes: editorAttributes(editable, ariaLabel, locale) },
    onUpdate: ({ editor: currentEditor }) => {
      if (!editable) return;
      const document = {
        schemaVersion: 1 as const,
        doc: currentEditor.getJSON() as BlockEditorDocument["doc"],
      };
      if (normalizeBlockEditorDocument(document)) {
        setDraft(serializeBlockEditorDocument(document));
      }
    },
  });

  React.useEffect(() => {
    if (!editor || editor.isFocused || JSON.stringify(editor.getJSON()) === JSON.stringify(draftDocument.doc)) return;
    editor.commands.setContent(draftDocument.doc, { emitUpdate: false });
  }, [draftDocument.doc, editor]);

  React.useEffect(() => {
    editor?.setEditable(editable, false);
  }, [editable, editor]);

  const interactions = editor && editable ? (
    <>
      <SelectionToolbar editor={editor} blockCommands={blockCommands} labels={labels} />
      <BlockHandle editor={editor} blockCommands={blockCommands} />
    </>
  ) : null;
  const editorEvents = editable
    ? {
        onBlur: inputProps.onBlur,
        onCompositionEnd: inputProps.onCompositionEnd,
        onCompositionStart: inputProps.onCompositionStart,
        onFocus: inputProps.onFocus,
      }
    : {};

  return (
    <div className={cn("editor-prose relative mt-2 min-w-0 max-w-full", className)} data-slot="block-editor" data-editable={editable}>
      {interactions}
      <EditorContent editor={editor} {...editorEvents} />
    </div>
  );
}

export type { BlockEditorLabels, BlockEditorProps };
