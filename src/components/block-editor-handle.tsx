"use client";

import { offset, type VirtualElement } from "@floating-ui/dom";
import type { Editor } from "@tiptap/core";
import DragHandle from "@tiptap/extension-drag-handle-react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CopyIcon,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createBlockCommandCatalog } from "@/editor/block-command-catalog";
import { cn } from "@/lib/utils";

type EditorCommandCatalog = ReturnType<typeof createBlockCommandCatalog>;
type HandleTarget = { pos: number; nodeSize: number };
type InsertDirection = "above" | "below";

const POST_DRAG_MENU_SUPPRESSION_MS = 160;
const HANDLE_POSITION_CONFIG = {
  placement: "left-start" as const,
  strategy: "fixed" as const,
  middleware: [offset(2)],
};

function DotsSixVerticalIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      data-slot="block-editor-six-dot-icon"
      {...props}
    >
      <circle cx="5" cy="3.5" r="1.15" />
      <circle cx="11" cy="3.5" r="1.15" />
      <circle cx="5" cy="8" r="1.15" />
      <circle cx="11" cy="8" r="1.15" />
      <circle cx="5" cy="12.5" r="1.15" />
      <circle cx="11" cy="12.5" r="1.15" />
    </svg>
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

function createTargetVirtualElement(
  editor: Editor,
  target: HandleTarget | null,
): VirtualElement | null {
  if (!target || editor.isDestroyed) return null;
  const dom = editor.view.nodeDOM(target.pos);
  if (!(dom instanceof Element)) return null;
  return {
    contextElement: dom,
    getBoundingClientRect: () => dom.getBoundingClientRect(),
  };
}

function suppressParentDragForPointer(
  event: React.PointerEvent<HTMLButtonElement>,
  onRelease: () => void,
) {
  const dragElement = event.currentTarget.closest(".block-editor-drag-handle");
  const ownerDocument = event.currentTarget.ownerDocument;

  if (dragElement instanceof HTMLElement) dragElement.draggable = false;

  const release = () => {
    ownerDocument.removeEventListener("pointerup", release, true);
    ownerDocument.removeEventListener("pointercancel", release, true);
    if (dragElement instanceof HTMLElement && dragElement.isConnected) {
      dragElement.draggable = true;
    }
    onRelease();
  };

  ownerDocument.addEventListener("pointerup", release, true);
  ownerDocument.addEventListener("pointercancel", release, true);
}

function BlockHandleTooltip({
  action,
  detail,
}: {
  action: string;
  detail: string;
}) {
  return (
    <div className="flex items-baseline gap-1 whitespace-nowrap">
      <strong className="font-semibold text-foreground">{action}</strong>
      <span>{detail}</span>
    </div>
  );
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
  const insertPointerActiveRef = React.useRef(false);
  const dragInProgressRef = React.useRef(false);
  const suppressMenuUntilRef = React.useRef(0);
  const [targetAvailable, setTargetAvailable] = React.useState(false);
  const [optionsOpen, setOptionsOpen] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const handleNodeChange = React.useCallback(
    ({ node, pos }: { node: { nodeSize: number } | null; pos: number }) => {
      if (optionsOpenRef.current || dragInProgressRef.current) return;
      const target = node && pos >= 0 ? { pos, nodeSize: node.nodeSize } : null;
      targetRef.current = target;
      const available = target !== null;
      if (targetAvailableRef.current === available) return;
      targetAvailableRef.current = available;
      setTargetAvailable(available);
    },
    [],
  );

  const getReferencedVirtualElement = React.useCallback(
    () => createTargetVirtualElement(editor, targetRef.current),
    [editor],
  );

  const setBlockOptionsOpen = React.useCallback(
    (open: boolean) => {
      if (
        open &&
        (!targetRef.current ||
          dragInProgressRef.current ||
          Date.now() < suppressMenuUntilRef.current)
      ) {
        return;
      }
      optionsOpenRef.current = open;
      setOptionsOpen(open);
      setDragHandleLocked(editor, open);
    },
    [editor],
  );

  const handleElementDragStart = React.useCallback(
    (event: DragEvent) => {
      if (insertPointerActiveRef.current) {
        event.preventDefault();
        return;
      }

      dragInProgressRef.current = true;
      suppressMenuUntilRef.current = Number.POSITIVE_INFINITY;
      setDragging(true);
      editor.view.dom.style.cursor = "grabbing";
      if (optionsOpenRef.current) setBlockOptionsOpen(false);
    },
    [editor, setBlockOptionsOpen],
  );

  const handleElementDragEnd = React.useCallback(() => {
    dragInProgressRef.current = false;
    suppressMenuUntilRef.current = Date.now() + POST_DRAG_MENU_SUPPRESSION_MS;
    setDragging(false);
    editor.view.dom.style.removeProperty("cursor");
    setDragHandleLocked(editor, false);
  }, [editor]);

  React.useEffect(
    () => () => {
      editor.view.dom.style.removeProperty("cursor");
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
      .insertContentAt(
        position,
        { type: "paragraph" },
        { updateSelection: false },
      )
      .setTextSelection(position + 1)
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
      computePositionConfig={HANDLE_POSITION_CONFIG}
      getReferencedVirtualElement={getReferencedVirtualElement}
      onNodeChange={handleNodeChange}
      onElementDragStart={handleElementDragStart}
      onElementDragEnd={handleElementDragEnd}
      className="block-editor-drag-handle"
    >
      <TooltipProvider delay={300}>
        <div
          data-slot="block-editor-block-handle"
          data-menu-open={optionsOpen || undefined}
          data-dragging={dragging || undefined}
          className={cn(
            "flex h-[22px] w-[36px] translate-y-px items-center gap-0 text-muted-foreground opacity-50 transition-opacity duration-100 ease-linear hover:opacity-100 motion-reduce:transition-none",
            (optionsOpen || dragging) && "opacity-100",
          )}
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  aria-label={t("insertBlock")}
                  data-slot="block-editor-insert-control"
                  className="h-[22px] w-[18px] min-w-0 rounded px-0"
                  disabled={!targetAvailable}
                  draggable={false}
                  onDragStart={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onPointerDown={(event) => {
                    insertPointerActiveRef.current = true;
                    suppressParentDragForPointer(event, () => {
                      insertPointerActiveRef.current = false;
                    });
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    insertParagraph(event.shiftKey ? "above" : "below");
                  }}
                >
                  <PlusIcon className="size-3.5 stroke-[1.35]" />
                </Button>
              }
            />
            <TooltipContent
              side="left"
              sideOffset={8}
              className="flex-col items-start gap-1.5 px-3 py-2 text-[13px] leading-5"
              data-slot="block-editor-insert-tooltip"
            >
              <BlockHandleTooltip
                action={t("clickAction")}
                detail={t("insertBelowHint")}
              />
              <BlockHandleTooltip
                action={t("shiftClickAction")}
                detail={t("insertAboveHint")}
              />
            </TooltipContent>
          </Tooltip>

          <DropdownMenu open={optionsOpen} onOpenChange={setBlockOptionsOpen}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        aria-label={t("blockOptions")}
                        data-slot="block-editor-drag-control"
                        className="h-[22px] w-[18px] min-w-0 cursor-grab rounded px-0 active:cursor-grabbing"
                        disabled={!targetAvailable}
                        draggable={false}
                        onClick={(event) => {
                          if (
                            dragInProgressRef.current ||
                            Date.now() < suppressMenuUntilRef.current
                          ) {
                            event.preventDefault();
                            event.stopPropagation();
                          }
                        }}
                      >
                        <DotsSixVerticalIcon className="size-3.5" />
                      </Button>
                    }
                  />
                }
              />
              <TooltipContent
                side="left"
                sideOffset={8}
                className="flex-col items-start gap-1.5 px-3 py-2 text-[13px] leading-5"
                data-slot="block-editor-drag-tooltip"
              >
                <BlockHandleTooltip
                  action={t("dragAction")}
                  detail={t("moveBlockHint")}
                />
                <BlockHandleTooltip
                  action={t("clickAction")}
                  detail={t("showBlockOptionsHint")}
                />
              </TooltipContent>
            </Tooltip>

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
      </TooltipProvider>
    </DragHandle>
  );
}

export { BlockHandle, DotsSixVerticalIcon, setDragHandleLocked };
