"use client";

import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  BoldIcon,
  ChevronDownIcon,
  Code2Icon,
  ItalicIcon,
  LinkIcon,
  Redo2Icon,
  Undo2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { createBlockCommandCatalog } from "@/editor/block-command-catalog";
import type { BlockEditorLabels } from "@/editor/block-editor-contract";
import { isSafeBlockEditorHref } from "@/editor/document";

type SelectionRange = { from: number; to: number };
type EditorCommandCatalog = ReturnType<typeof createBlockCommandCatalog>;

const BUBBLE_MENU_OPTIONS = {
  placement: "top",
  offset: 8,
} as const;

function normalizeLinkHref(input: string) {
  const value = input.trim();
  if (!value) return null;
  if (isSafeBlockEditorHref(value)) return value;
  return /^[\w.-]+\.[a-z]{2,}(?:[/?#].*)?$/i.test(value)
    ? `https://${value}`
    : null;
}

function clampSelection(editor: Editor, selection: SelectionRange) {
  const maximum = editor.state.doc.content.size;
  const from = Math.max(0, Math.min(selection.from, maximum));
  const to = Math.max(from, Math.min(selection.to, maximum));
  return { from, to };
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
  const [blockMenuOpen, setBlockMenuOpen] = React.useState(false);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkHref, setLinkHref] = React.useState("");
  const [linkError, setLinkError] = React.useState(false);
  const toolbarState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      canRedo: currentEditor.can().chain().redo().run(),
      canUndo: currentEditor.can().chain().undo().run(),
      isBold: currentEditor.isActive("bold"),
      isCode: currentEditor.isActive("code"),
      isItalic: currentEditor.isActive("italic"),
      isLink: currentEditor.isActive("link"),
    }),
  });

  function rememberSelection() {
    selectionRef.current = {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };
  }

  function rememberSelectionIfNeeded() {
    if (!editor.state.selection.empty || !selectionRef.current) {
      rememberSelection();
    }
  }

  function restoreSelection() {
    if (!selectionRef.current) return editor.chain().focus();
    return editor
      .chain()
      .focus()
      .setTextSelection(clampSelection(editor, selectionRef.current));
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
    else {
      const command = blockCommands.find((item) => item.id === id);
      if (!command) return;
      command.execute(
        editor,
        clampSelection(editor, selectionRef.current ?? editor.state.selection),
      );
    }
    setBlockMenuOpen(false);
  }

  function handleBlockMenuOpenChange(open: boolean) {
    if (open) rememberSelectionIfNeeded();
    setBlockMenuOpen(open);
  }

  function handleLinkOpenChange(open: boolean) {
    if (open) {
      rememberSelectionIfNeeded();
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

  const shouldShow = React.useCallback(
    ({
      editor: currentEditor,
      from,
      to,
    }: {
      editor: Editor;
      from: number;
      to: number;
    }) =>
      currentEditor.isEditable &&
      (from !== to ||
        blockMenuOpen ||
        linkOpen ||
        currentEditor.isActive("link")),
    [blockMenuOpen, linkOpen],
  );

  return (
    <BubbleMenu
      editor={editor}
      updateDelay={0}
      resizeDelay={0}
      shouldShow={shouldShow}
      options={BUBBLE_MENU_OPTIONS}
    >
      <div
        role="toolbar"
        aria-label={t("selectionToolbar")}
        data-slot="block-editor-selection-menu"
        className="flex max-w-[calc(100vw-1rem)] items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-md"
        onPointerDownCapture={rememberSelection}
      >
        <DropdownMenu
          open={blockMenuOpen}
          onOpenChange={handleBlockMenuOpenChange}
        >
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                aria-label={t("blockType")}
                className="h-7 gap-1 px-1.5"
                onMouseDown={(event) => event.preventDefault()}
              >
                <span aria-hidden="true">¶</span>
                <ChevronDownIcon className="size-3" />
              </Button>
            }
          />
          <DropdownMenuContent className="min-w-44" sideOffset={6}>
            {blockCommands
              .filter((item) => item.id !== "horizontal-rule")
              .map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => transformBlock(item.id)}
                  >
                    <Icon className="size-4" />
                    {item.title}
                  </DropdownMenuItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <ToggleGroup spacing={0} variant="default" size="sm">
          <ToggleGroupItem
            aria-label={labels.bold}
            pressed={toolbarState?.isBold ?? false}
            onMouseDown={(event) => event.preventDefault()}
            onPressedChange={() => toggleMark("bold")}
          >
            <BoldIcon className="size-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem
            aria-label={labels.italic}
            pressed={toolbarState?.isItalic ?? false}
            onMouseDown={(event) => event.preventDefault()}
            onPressedChange={() => toggleMark("italic")}
          >
            <ItalicIcon className="size-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem
            aria-label={labels.code}
            pressed={toolbarState?.isCode ?? false}
            onMouseDown={(event) => event.preventDefault()}
            onPressedChange={() => toggleMark("code")}
          >
            <Code2Icon className="size-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Popover open={linkOpen} onOpenChange={handleLinkOpenChange}>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t("link")}
                aria-pressed={toolbarState?.isLink ?? false}
                className="h-7 w-7 aria-pressed:bg-muted"
                onMouseDown={(event) => event.preventDefault()}
              >
                <LinkIcon className="size-3.5" />
              </Button>
            }
          />
          <PopoverContent
            side="top"
            sideOffset={8}
            className="w-72 gap-2 p-2"
            data-slot="block-editor-link-popover"
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                applyLink();
              }}
              className="space-y-2"
            >
              <Input
                autoFocus
                value={linkHref}
                onChange={(event) => {
                  setLinkHref(event.target.value);
                  setLinkError(false);
                }}
                aria-label={t("linkUrl")}
                aria-invalid={linkError || undefined}
                placeholder="https://example.com"
              />
              {linkError ? (
                <p role="alert" className="text-xs text-destructive">
                  {t("invalidLink")}
                </p>
              ) : null}
              <div className="flex justify-end gap-1">
                {linkWasActiveRef.current ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeLink}
                  >
                    {t("removeLink")}
                  </Button>
                ) : null}
                <Button type="submit" size="sm">
                  {t("applyLink")}
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("undo")}
          disabled={!(toolbarState?.canUndo ?? false)}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2Icon className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("redo")}
          disabled={!(toolbarState?.canRedo ?? false)}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2Icon className="size-3.5" />
        </Button>
      </div>
    </BubbleMenu>
  );
}

export { SelectionToolbar };
