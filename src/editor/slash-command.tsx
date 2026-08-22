"use client";

import { Extension } from "@tiptap/core";
import { ReactRenderer, type Editor } from "@tiptap/react";
import { PluginKey } from "@tiptap/pm/state";
import {
  Suggestion,
  exitSuggestion,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion";
import * as React from "react";

import {
  createBlockCommandCatalog,
  type BlockCommandCatalogItem,
  type BlockCommandCatalogLabels,
} from "@/editor/block-command-catalog";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const slashCommandPluginKey = new PluginKey("block-editor-slash-command");

type BlockEditorSlashMenuLabels = {
  empty: string;
} & BlockCommandCatalogLabels;

type SlashCommandMenuProps = {
  emptyLabel: string;
  items: BlockCommandCatalogItem[];
  onSelect: (item: BlockCommandCatalogItem) => void;
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
>(function SlashCommandMenu({ emptyLabel, items, onSelect }, ref) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  React.useImperativeHandle(
    ref,
    () => ({
      onKeyDown: (event) => {
        if (event.key === "ArrowDown") {
          setSelectedIndex((current) => getNextIndex(current, items.length, 1));
          return true;
        }
        if (event.key === "ArrowUp") {
          setSelectedIndex((current) =>
            getNextIndex(current, items.length, -1),
          );
          return true;
        }
        if (event.key === "Enter") {
          const item = items[selectedIndex];
          if (!item) return false;
          onSelect(item);
          return true;
        }
        return false;
      },
    }),
    [items, onSelect, selectedIndex],
  );

  return (
    <div data-slot="block-editor-slash-menu">
      <Command
        className="w-[256px] p-1"
        shouldFilter={false}
        loop
      >
        <CommandList>
          {items.length > 0 ? (
            items.map((item, index) => {
              const selected = index === selectedIndex;
              return (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  aria-selected={selected}
                  data-selected={selected ? true : undefined}
                  className={cn("px-2", selected && "data-[selected=true]:bg-[#ebe8e3]")}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onSelect(item);
                  }}
                >
                  {item.title}
                </CommandItem>
              );
            })
          ) : (
            <CommandEmpty className="py-3 text-sm text-muted-foreground">
              {emptyLabel}
            </CommandEmpty>
          )}
        </CommandList>
      </Command>
    </div>
  );
});

function filterCommandItems(
  items: BlockCommandCatalogItem[],
  query: string,
) {
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

            return {
              onStart: (props) => {
                menu = new ReactRenderer(SlashCommandMenu, {
                  editor: props.editor as Editor,
                  props: {
                    emptyLabel: labels.empty,
                    items: props.items,
                    onSelect: props.command,
                  },
                });
                unmount = props.mount(menu.element);
              },
              onUpdate: (props) => {
                menu?.updateProps({
                  emptyLabel: labels.empty,
                  items: props.items,
                  onSelect: props.command,
                });
              },
              onKeyDown: (props: SuggestionKeyDownProps) => {
                if (props.event.key === "Escape") {
                  props.view.focus();
                  exitSuggestion(props.view, slashCommandPluginKey);
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

export { createSlashCommandExtension };
export type { BlockEditorSlashMenuLabels };
