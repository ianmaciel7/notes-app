"use client";

import { computePosition, offset, type VirtualElement } from "@floating-ui/dom";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/csr/ArrowDown";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { DotsSixVerticalIcon as PhosphorDotsSixVerticalIcon } from "@phosphor-icons/react/dist/csr/DotsSixVertical";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { TrashIcon as Trash2Icon } from "@phosphor-icons/react/dist/csr/Trash";
import type { Editor } from "@tiptap/core";
import DragHandle from "@tiptap/extension-drag-handle-react";
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
import type { createBlockCommandCatalog } from "@/editor/block-command-catalog";
import { copyBlockEditorNodeWithFreshIds } from "@/editor/document";
import { cn } from "@/lib/utils";

type EditorCommandCatalog = ReturnType<typeof createBlockCommandCatalog>;
type HandleTarget = { pos: number; nodeSize: number };
type InsertDirection = "above" | "below";

const POST_DRAG_MENU_SUPPRESSION_MS = 160;
const HANDLE_POSITION_CONFIG = {
  placement: "left-start" as const,
  strategy: "fixed" as const,
  middleware: [offset(0)],
};

function DotsSixVerticalIcon(props: React.ComponentProps<"svg">) {
  return (
    <PhosphorDotsSixVerticalIcon
      data-slot="block-editor-six-dot-icon"
      weight="regular"
      {...props}
    />
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

function findTopLevelTargetForDom(
  editor: Editor,
  blockElement: Element,
): HandleTarget | null {
  let target: HandleTarget | null = null;
  editor.state.doc.forEach((node, offset) => {
    if (target) return;
    if (editor.view.nodeDOM(offset) === blockElement) {
      target = { pos: offset, nodeSize: node.nodeSize };
    }
  });
  if (target) return target;

  const domPosition = editor.view.posAtDOM(blockElement, 0);
  for (const pos of [domPosition, domPosition - 1]) {
    if (pos < 0) continue;
    const node = editor.state.doc.nodeAt(pos);
    if (!node) continue;
    const dom = editor.view.nodeDOM(pos);
    if (dom === blockElement) return { pos, nodeSize: node.nodeSize };
  }
  return target;
}

function isGripDragOrigin(event: DragEvent) {
  const target = event.target;
  return (
    target instanceof Element &&
    target.closest('[data-slot="block-editor-drag-control"]') !== null
  );
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
  const menuTriggerId = React.useId();
  const handleSurfaceRef = React.useRef<HTMLDivElement>(null);
  const targetRef = React.useRef<HandleTarget | null>(null);
  const dragSourceRef = React.useRef<HandleTarget | null>(null);
  const targetAvailableRef = React.useRef(false);
  const optionsOpenRef = React.useRef(false);
  const insertPointerActiveRef = React.useRef(false);
  const dragInProgressRef = React.useRef(false);
  const suppressMenuUntilRef = React.useRef(0);
  const positionRequestRef = React.useRef(0);
  const [targetAvailable, setTargetAvailable] = React.useState(false);
  const [optionsOpen, setOptionsOpen] = React.useState(false);

  const positionHandleForTarget = React.useCallback(
    (target: HandleTarget | null) => {
      const handleSurface = handleSurfaceRef.current;
      const virtualElement = createTargetVirtualElement(editor, target);
      if (!(handleSurface instanceof HTMLElement) || !virtualElement) return;

      const request = ++positionRequestRef.current;
      // Override stale startup calculations after the hovered block and portal are laid out.
      requestAnimationFrame(() => {
        void computePosition(
          virtualElement,
          handleSurface,
          HANDLE_POSITION_CONFIG,
        ).then((position) => {
          if (
            request !== positionRequestRef.current ||
            !handleSurface.isConnected
          ) {
            return;
          }
          Object.assign(handleSurface.style, {
            left: `${Math.round(position.x)}px`,
            position: position.strategy,
            top: `${Math.round(position.y)}px`,
          });
        });
      });
    },
    [editor],
  );

  const handleNodeChange = React.useCallback(
    ({ node, pos }: { node: { nodeSize: number } | null; pos: number }) => {
      if (optionsOpenRef.current || dragInProgressRef.current) return;
      const target = node && pos >= 0 ? { pos, nodeSize: node.nodeSize } : null;
      targetRef.current = target;
      const available = target !== null;
      if (targetAvailableRef.current !== available) {
        targetAvailableRef.current = available;
        setTargetAvailable(available);
      }

      positionHandleForTarget(target);
    },
    [positionHandleForTarget],
  );

  React.useLayoutEffect(() => {
    if (targetAvailable) positionHandleForTarget(targetRef.current);
  }, [positionHandleForTarget, targetAvailable]);

  React.useEffect(() => {
    if (!enabled) return;
    const editorElement = editor.view.dom;
    const syncTargetFromPointer = (event: PointerEvent) => {
      if (optionsOpenRef.current || dragInProgressRef.current) return;
      let element = event.target instanceof Element ? event.target : null;
      while (element && element.parentElement !== editorElement) {
        element = element.parentElement;
      }
      if (!element) return;

      const target = findTopLevelTargetForDom(editor, element);
      if (!target) return;
      targetRef.current = target;
      if (!targetAvailableRef.current) {
        targetAvailableRef.current = true;
        setTargetAvailable(true);
      }
      positionHandleForTarget(target);
    };

    editorElement.addEventListener("pointermove", syncTargetFromPointer, true);
    return () =>
      editorElement.removeEventListener(
        "pointermove",
        syncTargetFromPointer,
        true,
      );
  }, [editor, enabled, positionHandleForTarget]);

  const getReferencedVirtualElement = React.useCallback(
    () =>
      createTargetVirtualElement(
        editor,
        dragSourceRef.current ?? targetRef.current,
      ),
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
      if (
        insertPointerActiveRef.current ||
        optionsOpenRef.current ||
        !targetRef.current ||
        !isGripDragOrigin(event)
      ) {
        event.preventDefault();
        return;
      }

      dragSourceRef.current = targetRef.current;
      dragInProgressRef.current = true;
      suppressMenuUntilRef.current = Number.POSITIVE_INFINITY;
      handleSurfaceRef.current?.setAttribute("data-dragging", "true");
      editor.view.dom.style.cursor = "grabbing";
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    },
    [editor],
  );

  const handleElementDragEnd = React.useCallback(() => {
    dragInProgressRef.current = false;
    dragSourceRef.current = null;
    suppressMenuUntilRef.current = Date.now() + POST_DRAG_MENU_SUPPRESSION_MS;
    handleSurfaceRef.current?.removeAttribute("data-dragging");
    editor.view.dom.style.removeProperty("cursor");
    setDragHandleLocked(editor, false);
  }, [editor]);

  React.useEffect(
    () => () => {
      dragSourceRef.current = null;
      handleSurfaceRef.current?.removeAttribute("data-dragging");
      editor.view.dom.style.removeProperty("cursor");
      setDragHandleLocked(editor, false);
    },
    [editor],
  );

  React.useEffect(() => {
    const editorElement = editor.view.dom;
    const preserveHandleForModifierClick = (event: KeyboardEvent) => {
      if (
        targetRef.current &&
        ["Alt", "Control", "Meta", "Shift"].includes(event.key)
      ) {
        event.stopImmediatePropagation();
      }
    };

    // Tiptap hides the handle on keydown; modifier-only keys must not cancel Shift-click.
    editorElement.addEventListener(
      "keydown",
      preserveHandleForModifierClick,
      true,
    );
    return () =>
      editorElement.removeEventListener(
        "keydown",
        preserveHandleForModifierClick,
        true,
      );
  }, [editor]);

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
      chain.setHeading({ level: Number(id.slice(-1)) as 1 | 2 | 3 | 4 }).run();
    } else if (id === "bullet-list") chain.toggleBulletList().run();
    else if (id === "ordered-list") chain.toggleOrderedList().run();
    else if (id === "task-list") chain.toggleTaskList().run();
    else if (id === "blockquote") chain.toggleBlockquote().run();
    else if (id === "code-block") chain.toggleCodeBlock().run();
    else {
      const command = blockCommands.find((item) => item.id === id);
      if (!command) return;
      command.execute(editor, {
        from: target.pos,
        to: target.pos + target.nodeSize,
      });
    }
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
      .insertContentAt(
        target.pos + target.nodeSize,
        copyBlockEditorNodeWithFreshIds(node.toJSON()),
        { updateSelection: true },
      )
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
      className="block-editor-drag-handle z-20"
    >
      <TooltipProvider delay={300}>
        <div
          ref={handleSurfaceRef}
          data-slot="block-editor-block-handle"
          data-menu-open={optionsOpen || undefined}
          className={cn(
            "relative flex h-[22px] w-[36px] items-center gap-0 overflow-hidden text-muted-foreground opacity-50 transition-opacity duration-100 ease-linear hover:opacity-100 data-[dragging=true]:opacity-100 motion-reduce:transition-none",
            optionsOpen && "opacity-100",
          )}
        >
          <Tooltip disableHoverablePopup>
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
              className="pointer-events-none flex-col items-start gap-1.5 px-3 py-2 text-[13px] leading-5"
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

          <Tooltip disableHoverablePopup>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  aria-label={t("blockOptions")}
                  aria-expanded={optionsOpen}
                  aria-haspopup="menu"
                  data-slot="block-editor-drag-control"
                  className="h-[22px] w-[18px] min-w-0 cursor-grab rounded px-0 active:cursor-grabbing"
                  disabled={!targetAvailable}
                  draggable={targetAvailable}
                  onDragStart={(event) => {
                    if (!targetAvailable || optionsOpenRef.current) {
                      event.preventDefault();
                      return;
                    }
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (
                      dragInProgressRef.current ||
                      Date.now() < suppressMenuUntilRef.current
                    ) {
                      event.preventDefault();
                      return;
                    }
                    setBlockOptionsOpen(!optionsOpenRef.current);
                  }}
                >
                  <DotsSixVerticalIcon className="size-3.5" />
                </Button>
              }
            />
            <TooltipContent
              side="left"
              sideOffset={8}
              className="pointer-events-none flex-col items-start gap-1.5 px-3 py-2 text-[13px] leading-5"
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

          <DropdownMenu
            open={optionsOpen}
            onOpenChange={setBlockOptionsOpen}
            triggerId={menuTriggerId}
          >
            <DropdownMenuTrigger
              id={menuTriggerId}
              nativeButton={false}
              tabIndex={-1}
              aria-hidden="true"
              render={
                <span
                  data-slot="block-editor-menu-anchor"
                  className="pointer-events-none absolute right-0 top-0 h-[22px] w-[18px] opacity-0"
                />
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
      </TooltipProvider>
    </DragHandle>
  );
}

export {
  BlockHandle,
  DotsSixVerticalIcon,
  isGripDragOrigin,
  setDragHandleLocked,
};
