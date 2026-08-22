"use client";

import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { type Editor, ReactRenderer } from "@tiptap/react";
import {
  exitSuggestion,
  Suggestion,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion";
import * as React from "react";
import {
  CompactMenuIconFrame,
  CompactMenuItemText,
  compactMenuItemClass,
  compactMenuSurfaceClass,
} from "@/components/ui/compact-menu";
import {
  type BlockCommandCatalogItem,
  type BlockCommandCatalogLabels,
  createBlockCommandCatalog,
} from "@/editor/block-command-catalog";
import { cn } from "@/lib/utils";

const slashCommandPluginKey = new PluginKey("block-editor-slash-command");

type BlockEditorSlashMenuLabels = {
  cancel: string;
  empty: string;
  navigate: string;
  select: string;
  title: string;
} & BlockCommandCatalogLabels;

type SlashCommandMenuProps = {
  activeIndex: number;
  emptyLabel: string;
  items: BlockCommandCatalogItem[];
  navigateLabel: string;
  onHighlight: (index: number) => void;
  onSelect: (item: BlockCommandCatalogItem) => void;
  cancelLabel: string;
  selectLabel: string;
  title: string;
};

type SlashCommandMenuHandle = {
  onKeyDown: (event: KeyboardEvent) => boolean;
};

function getNextIndex(
  currentIndex: number,
  itemCount: number,
  direction: 1 | -1,
) {
  if (itemCount <= 0) return -1;
  if (currentIndex < 0) return direction > 0 ? 0 : itemCount - 1;
  return (currentIndex + direction + itemCount) % itemCount;
}

const SlashCommandMenu = React.forwardRef<
  SlashCommandMenuHandle,
  SlashCommandMenuProps
>(function SlashCommandMenu(
  {
    activeIndex,
    cancelLabel,
    emptyLabel,
    items,
    navigateLabel,
    onHighlight,
    onSelect,
    selectLabel,
    title,
  },
  ref,
) {
  const optionRefs = React.useRef(new Map<string, HTMLButtonElement>());

  React.useEffect(() => {
    const activeItem = items[activeIndex];
    if (!activeItem) return;
    optionRefs.current.get(activeItem.id)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, items]);

  React.useImperativeHandle(
    ref,
    () => ({
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          const item = items[activeIndex];
          if (!item) return false;
          onSelect(item);
          return true;
        }
        return false;
      },
    }),
    [activeIndex, items, onSelect],
  );

  return (
    <div
      data-slot="block-editor-slash-menu"
      className={cn(
        compactMenuSurfaceClass,
        "box-content w-[22rem] min-w-0 max-w-[calc(100vw-1rem)] gap-0 rounded-[12px] border-[oklch(0.9163_0.0017_67.07)] p-0 shadow-[0_3px_5px_rgb(0_0_0/0.01),0_5px_10px_rgb(0_0_0/0.02),0_10px_14px_rgb(0_0_0/0.01)] ring-0",
      )}
    >
      <div className="px-1.5 pb-1 pt-1.5">
        <div className="mx-1 mb-1 mt-1 flex flex-row items-center gap-1 text-xs font-normal text-muted-foreground">
          <span>{title}</span>
        </div>
      </div>

      <div
        role="listbox"
        aria-label={title}
        className="max-h-72 min-h-0 overflow-y-auto px-1.5 pb-1.5"
      >
        {items.length > 0 ? (
          items.map((item, index) => {
            const selected = index === activeIndex;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                ref={(node) => {
                  if (node) optionRefs.current.set(item.id, node);
                  else optionRefs.current.delete(item.id);
                }}
                id={`block-editor-slash-option-${item.id}`}
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                data-active={selected || undefined}
                onPointerMove={() => onHighlight(index)}
                onMouseEnter={() => onHighlight(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  onSelect(item);
                }}
                className={cn(
                  compactMenuItemClass,
                  "flex h-8 min-h-8 items-center justify-between gap-2 rounded-[8px] px-1 text-left font-normal outline-none hover:bg-[#f3f1ee] data-[active=true]:bg-[#f3f1ee]",
                )}
              >
                <CompactMenuIconFrame variant="ghost">
                  <Icon />
                </CompactMenuIconFrame>
                <CompactMenuItemText>{item.title}</CompactMenuItemText>
              </button>
            );
          })
        ) : (
          <div className="px-1 py-3 text-sm text-muted-foreground">
            {emptyLabel}
          </div>
        )}
      </div>

      <div className="mx-1 flex h-[29px] shrink-0 items-center gap-x-3 border-t border-border px-1 py-1.5 text-xs leading-4 text-muted-foreground">
        <span className="whitespace-nowrap">
          <span className="font-medium text-muted-foreground">↑↓</span>{" "}
          {navigateLabel}
        </span>
        <span className="whitespace-nowrap">
          <span className="font-medium text-muted-foreground">Esc</span>{" "}
          {cancelLabel}
        </span>
        <span className="whitespace-nowrap">
          <span className="font-medium text-muted-foreground">↵</span>{" "}
          {selectLabel}
        </span>
      </div>
    </div>
  );
});

function filterCommandItems(items: BlockCommandCatalogItem[], query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) => {
    const haystack = [item.title, ...item.searchTerms]
      .join(" ")
      .toLocaleLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

function createSlashCommandExtension(labels: BlockEditorSlashMenuLabels) {
  return Extension.create({
    name: "blockEditorSlashCommand",
    addProseMirrorPlugins() {
      const commandItems = createBlockCommandCatalog(labels);

      return [
        Suggestion<BlockCommandCatalogItem, BlockCommandCatalogItem>({
          editor: this.editor,
          char: "/",
          pluginKey: slashCommandPluginKey,
          startOfLine: true,
          allowedPrefixes: null,
          items: ({ query }) => filterCommandItems(commandItems, query),
          allow: ({ editor, state }) => {
            const { empty, $from } = state.selection;
            return (
              editor.isEditable &&
              empty &&
              $from.parent.isTextblock &&
              $from.parent.type.name !== "codeBlock"
            );
          },
          command: ({ editor, range, props }) => {
            props.execute(editor, range);
          },
          render: () => {
            let menu:
              | ReactRenderer<SlashCommandMenuHandle, SlashCommandMenuProps>
              | undefined;
            let unmount: (() => void) | undefined;
            let activeIndex = 0;
            let currentItems: BlockCommandCatalogItem[] = [];

            function updateMenuProps(props: Partial<SlashCommandMenuProps>) {
              menu?.updateProps({
                activeIndex,
                cancelLabel: labels.cancel,
                emptyLabel: labels.empty,
                items: currentItems,
                navigateLabel: labels.navigate,
                onHighlight: (index: number) => {
                  activeIndex = index;
                  updateMenuProps({ activeIndex });
                },
                onSelect: props.onSelect ?? menu.props.onSelect,
                selectLabel: labels.select,
                title: labels.title,
                ...props,
              });
            }

            return {
              onStart: (props) => {
                activeIndex = 0;
                currentItems = props.items;
                menu = new ReactRenderer(SlashCommandMenu, {
                  editor: props.editor as Editor,
                  props: {
                    activeIndex,
                    cancelLabel: labels.cancel,
                    emptyLabel: labels.empty,
                    items: props.items,
                    navigateLabel: labels.navigate,
                    onHighlight: (index: number) => {
                      activeIndex = index;
                      menu?.updateProps({ activeIndex });
                    },
                    onSelect: props.command,
                    selectLabel: labels.select,
                    title: labels.title,
                  },
                });
                unmount = props.mount(menu.element);
              },
              onUpdate: (props) => {
                currentItems = props.items;
                activeIndex = Math.min(
                  activeIndex,
                  Math.max(currentItems.length - 1, 0),
                );
                updateMenuProps({ onSelect: props.command });
              },
              onKeyDown: (props: SuggestionKeyDownProps) => {
                if (props.event.key === "Escape") {
                  props.view.focus();
                  exitSuggestion(props.view, slashCommandPluginKey);
                  return true;
                }
                if (
                  props.event.key === "ArrowDown" ||
                  props.event.key === "ArrowUp"
                ) {
                  props.event.preventDefault();
                  activeIndex = getNextIndex(
                    activeIndex,
                    currentItems.length,
                    props.event.key === "ArrowDown" ? 1 : -1,
                  );
                  updateMenuProps({ activeIndex });
                  return true;
                }
                if (props.event.key === "Enter") {
                  props.event.preventDefault();
                  const item = currentItems[activeIndex];
                  if (!item) return false;
                  menu?.props.onSelect(item);
                  return true;
                }
                return menu?.ref?.onKeyDown(props.event) ?? false;
              },
              onExit: () => {
                unmount?.();
                menu?.destroy();
              },
            };
          },
        }),
      ];
    },
  });
}

export type { BlockEditorSlashMenuLabels };
export { createSlashCommandExtension };
