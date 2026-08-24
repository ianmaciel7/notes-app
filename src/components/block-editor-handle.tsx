"use client";

import type { Editor } from "@tiptap/core";
import DragHandle from "@tiptap/extension-drag-handle-react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CopyIcon,
  GripVerticalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createBlockCommandCatalog } from "@/editor/block-command-catalog";
import { cn } from "@/lib/utils";

type EditorCommandCatalog = ReturnType<typeof createBlockCommandCatalog>;
type HandleTarget = { pos: number; nodeSize: number };
type InsertDirection = "above" | "below";

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

function targetSelectionPosition(editor: Editor, target: HandleTarget) {
  const node = editor.state.doc.nodeAt(target.pos);
  if (!node) return null;
  if (node.isTextblock) return target.pos + 1;

  let position: number | null = null;
  node.descendants((child, relativePos) => {
    if (position !== null) return false;
    if (!child.isTextblock) return true;
    position = target.pos + relativePos + 2;
    return false;
  });
  return position;
}

function setDragHandleLocked(editor: Editor, locked: boolean) {
  if (editor.isDestroyed) return;
  editor.commands.setMeta("lockDragHandle", locked);
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
  const targetRef = React.useRef<HandleTarget | null>(null);
  const targetAvailableRef = React.useRef(false);
  const optionsOpenRef = React.useRef(false);
  const [targetAvailable, setTargetAvailable] = React.useState(false);
  const [optionsOpen, setOptionsOpen] = React.useState(false);

  const handleNodeChange = React.useCallback(
    ({ node, pos }: { node: { nodeSize: number } | null; pos: number }) => {
      if (optionsOpenRef.current) return;
      const target = node && pos >= 0 ? { pos, nodeSize: node.nodeSize } : null;
      targetRef.current = target;
      const available = target !== null;
      if (targetAvailableRef.current === available) return;
      targetAvailableRef.current = available;
      setTargetAvailable(available);
    },
    [],
  );

  const setBlockOptionsOpen = React.useCallback(
    (open: boolean) => {
      if (open && !targetRef.current) return;
      optionsOpenRef.current = open;
      setOptionsOpen(open);
      setDragHandleLocked(editor, open);
    },
    [editor],
  );

  React.useEffect(
    () => () => {
      setDragHandleLocked(editor, false);
    },
    [editor],
  );

  function insertParagraph(direction: InsertDirection) {
    const target = targetRef.current;
    if (!target) return;
    const position =
      direction === "above" ? target.pos : target.pos + target.nodeSize;
    editor
      .chain()
      .focus()
      .insertContentAt(position, { type: "paragraph" }, { updateSelection: true })
      .run();
    if (optionsOpenRef.current) setBlockOptionsOpen(false);
  }

  function transformTarget(id: string) {
    const target = targetRef.current;
    if (!target) return;
    const position = targetSelectionPosition(editor, target);
    if (position === null) return;

    const chain = editor.chain().focus().setTextSelection(position);
    if (id === "text") chain.setParagraph().run();
    else if (id.startsWith("heading-")) {
      chain
        .setHeading({ level: Number(id.slice(-1)) as 1 | 2 | 3 | 4 })
        .run();
    } else if (id === "bullet-list") chain.toggleBulletList().run();
    else if (id === "ordered-list") chain.toggleOrderedList().run();
    else if (id === "task-list") chain.toggleTaskList().run();
    else if (id === "blockquote") chain.toggleBlockquote().run();
    else if (id === "code-block") chain.toggleCodeBlock().run();
    setBlockOptionsOpen(false);
  }

  function duplicateTarget() {
    const target = targetRef.current;
    if (!target) return;
    const node = editor.state.doc.nodeAt(target.pos);
    if (!node) return;

    editor
      .chain()
      .focus()
      .insertContentAt(target.pos + target.nodeSize, node.toJSON(), {
        updateSelection: true,
      })
      .run();
    setBlockOptionsOpen(false);
  }

  function deleteTarget() {
    const target = targetRef.current;
    if (!target) return;
    editor
      .chain()
      .focus()
      .deleteRange({ from: target.pos, to: target.pos + target.nodeSize })
      .run();
    setBlockOptionsOpen(false);
  }

  if (!enabled) return null;

  return (
    <DragHandle
      editor={editor}
      nested={false}
      onNodeChange={handleNodeChange}
      className="block-editor-drag-handle"
    >
      <div
        data-slot="block-editor-block-handle"
        data-menu-open={optionsOpen || undefined}
        className={cn(
          "-mr-1 mt-[3px] flex items-center gap-0.5 text-muted-foreground opacity-50 transition-opacity duration-100 ease-linear hover:opacity-100 motion-reduce:transition-none",
          optionsOpen && "opacity-100",
        )}
      >
        <Button
          variant="ghost"
          aria-label={t("insertBlock")}
          title={`${t("insertBlockBelow")} · Shift: ${t("insertBlockAbove")}`}
          data-slot="block-editor-insert-control"
          className="h-[22px] w-[18px] min-w-0 rounded px-0"
          disabled={!targetAvailable}
          draggable={false}
          onDragStart={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) =>
            insertParagraph(event.shiftKey ? "above" : "below")
          }
        >
          <PlusIcon className="size-3.5" />
        </Button>

        <DropdownMenu open={optionsOpen} onOpenChange={setBlockOptionsOpen}>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                aria-label={t("blockOptions")}
                title={t("dragBlock")}
                data-slot="block-editor-drag-control"
                className="h-[22px] w-[18px] min-w-0 cursor-grab rounded px-0 active:cursor-grabbing"
                disabled={!targetAvailable}
              >
                <GripVerticalIcon className="size-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent
            side="left"
            align="start"
            sideOffset={6}
            className="min-w-52"
            data-slot="block-editor-block-menu"
          >
            <DropdownMenuItem onClick={() => insertParagraph("above")}>
              <ArrowUpIcon className="size-4" />
              {t("insertBlockAbove")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertParagraph("below")}>
              <ArrowDownIcon className="size-4" />
              {t("insertBlockBelow")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {blockCommands
              .filter((item) => item.id !== "horizontal-rule")
              .map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => transformTarget(item.id)}
                  >
                    <Icon className="size-4" />
                    {item.title}
                  </DropdownMenuItem>
                );
              })}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={duplicateTarget}>
              <CopyIcon className="size-4" />
              {t("duplicateBlock")}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={deleteTarget}>
              <Trash2Icon className="size-4" />
              {t("deleteBlock")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </DragHandle>
  );
}

export { BlockHandle, setDragHandleLocked };
