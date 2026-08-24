"use client";

import { type Editor, Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import {
  exitSuggestion,
  Suggestion,
  type SuggestionKeyDownProps,
} from "@tiptap/suggestion";
import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
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
let activeSlashMenuCleanup: (() => void) | undefined;

type BlockEditorSlashMenuLabels = {
  cancel: string;
  empty: string;
  navigate: string;
  select: string;
  title: string;
} & BlockCommandCatalogLabels;

type SlashCommandOptions = {
  onCreatePageRequest?: (title: string) => void;
};

type SlashCommandMenuProps = {
  activeIndex: number;
  cancelLabel: string;
  emptyLabel: string;
  items: BlockCommandCatalogItem[];
  navigateLabel: string;
  onHighlight: (index: number) => void;
  onSelect: (item: BlockCommandCatalogItem) => void;
  selectLabel: string;
  title: string;
};

type SlashCommandMenuRenderer = {
  element: HTMLElement;
  props: SlashCommandMenuProps;
  destroy: () => void;
  updateProps: (props: Partial<SlashCommandMenuProps>) => void;
};

type RendererState = "active" | "destroy-pending" | "destroyed";

function getNextIndex(
  currentIndex: number,
  itemCount: number,
  direction: 1 | -1,
) {
  if (itemCount <= 0) return -1;
  if (currentIndex < 0) return direction > 0 ? 0 : itemCount - 1;
  return (currentIndex + direction + itemCount) % itemCount;
}

function SlashCommandMenu({
  activeIndex,
  cancelLabel,
  emptyLabel,
  items,
  navigateLabel,
  onHighlight,
  onSelect,
  selectLabel,
  title,
}: SlashCommandMenuProps) {
  const optionRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const listRef = React.useRef<HTMLDivElement>(null);
  const activeItem = items[activeIndex];

  React.useEffect(() => {
    if (!activeItem) return;
    const node = optionRefs.current.get(activeItem.id);
    const container = listRef.current;
    if (!node || !container) return;

    const itemTop = node.offsetTop;
    const itemBottom = itemTop + node.offsetHeight;
    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;
    if (itemTop < visibleTop) container.scrollTop = itemTop;
    else if (itemBottom > visibleBottom) {
      container.scrollTop = itemBottom - container.clientHeight;
    }
  }, [activeItem]);

  return (
    <div
      data-slot="block-editor-slash-menu"
      className={cn(
        compactMenuSurfaceClass,
        "box-content w-[22rem] min-w-0 max-w-[calc(100vw-1rem)] gap-0 rounded-[12px] border-[oklch(0.9163_0.0017_67.07)] p-0 shadow-[0_3px_5px_rgb(0_0_0/0.01),0_5px_10px_rgb(0_0_0/0.02),0_10px_14px_rgb(0_0_0/0.01)] ring-0",
      )}
    >
      <div className="px-1.5 pb-1 pt-1.5">
        <div className="mx-1 mb-1 mt-1 flex items-center gap-1 text-xs font-normal text-muted-foreground">
          <span>{title}</span>
        </div>
      </div>

      <div
        ref={listRef}
        role="listbox"
        aria-label={title}
        aria-activedescendant={
          activeItem ? `block-editor-slash-option-${activeItem.id}` : undefined
        }
        className="max-h-[min(24rem,80vh)] min-h-0 overflow-y-auto px-1.5 pb-1.5"
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
                data-menu-item-index={index}
                onPointerMove={() => {
                  if (index !== activeIndex) onHighlight(index);
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
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
                {item.badge ? (
                  <span className="ml-2 shrink-0 rounded-[7px] border border-blue-300 bg-blue-50 px-1.5 py-0.5 text-xs leading-4 text-blue-700">
                    {item.badge}
                  </span>
                ) : null}
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
}

function scheduleSlashMenuRootUnmount(
  root: Root,
  element: HTMLElement,
  onUnmounted: () => void,
) {
  const timerHost = element.ownerDocument.defaultView ?? window;
  timerHost.setTimeout(() => {
    try {
      root.unmount();
    } finally {
      onUnmounted();
    }
  }, 0);
}

function createSlashCommandMenuRenderer(
  initialProps: SlashCommandMenuProps,
): SlashCommandMenuRenderer {
  const element = document.createElement("div");
  const root = createRoot(element);
  let props = initialProps;
  let state: RendererState = "active";

  function renderMenu() {
    if (state !== "active") return;
    root.render(<SlashCommandMenu {...props} />);
  }

  renderMenu();

  return {
    element,
    get props() {
      return props;
    },
    destroy: () => {
      if (state !== "active") return;
      state = "destroy-pending";
      element.remove();
      scheduleSlashMenuRootUnmount(root, element, () => {
        state = "destroyed";
      });
    },
    updateProps: (nextProps) => {
      if (state !== "active") return;
      props = { ...props, ...nextProps };
      renderMenu();
    },
  };
}

function normalizeCommandQuery(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function commandTermMatches(term: string, query: string) {
  const normalizedTerm = normalizeCommandQuery(term);
  if (normalizedTerm.startsWith(query)) return true;
  return normalizedTerm
    .split(/[\s-]+/)
    .some((token) => token.startsWith(query));
}

function filterCommandItems(
  items: BlockCommandCatalogItem[],
  query: string,
  labels: BlockEditorSlashMenuLabels,
  options: SlashCommandOptions,
) {
  const normalizedQuery = normalizeCommandQuery(query);
  if (!normalizedQuery) return items;

  const filtered = items.filter((item) =>
    [item.title, ...item.searchTerms].some((term) =>
      commandTermMatches(term, normalizedQuery),
    ),
  );
  if (filtered.length > 0 || !options.onCreatePageRequest) return filtered;

  const title = query.trim();
  if (!title) return filtered;
  const createPageItem: BlockCommandCatalogItem = {
    id: `create-page:${title}`,
    icon: CreatePageIcon,
    title: `${labels.createPage} '${title}'`,
    badge: labels.page,
    searchTerms: [title],
    execute: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      options.onCreatePageRequest?.(title);
    },
  };
  return [createPageItem];
}

function CreatePageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8" />
    </svg>
  );
}

function createSlashCommandExtension(
  labels: BlockEditorSlashMenuLabels,
  options: SlashCommandOptions = {},
) {
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
          initialItems: commandItems,
          items: ({ query }) =>
            filterCommandItems(commandItems, query, labels, options),
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
            exitSuggestion(editor.view, slashCommandPluginKey);
          },
          render: () => {
            let menu: SlashCommandMenuRenderer | undefined;
            let unmountFloatingElement: (() => void) | undefined;
            let activeIndex = 0;
            let currentItems: BlockCommandCatalogItem[] = [];

            function cleanupMenu() {
              const currentMenu = menu;
              const currentUnmount = unmountFloatingElement;
              menu = undefined;
              unmountFloatingElement = undefined;
              currentUnmount?.();
              currentMenu?.destroy();
              if (activeSlashMenuCleanup === cleanupMenu) {
                activeSlashMenuCleanup = undefined;
              }
            }

            function selectItem(
              item: BlockCommandCatalogItem,
              command: (item: BlockCommandCatalogItem) => void,
            ) {
              queueMicrotask(() => {
                command(item);
                cleanupMenu();
              });
            }

            function updateMenuProps(
              nextProps: Partial<SlashCommandMenuProps>,
            ) {
              menu?.updateProps({
                activeIndex,
                items: currentItems,
                ...nextProps,
              });
            }

            return {
              onStart: (props) => {
                const previousCleanup = activeSlashMenuCleanup;
                if (previousCleanup && previousCleanup !== cleanupMenu) {
                  previousCleanup();
                }
                cleanupMenu();

                activeIndex = 0;
                currentItems = props.items;
                const onSelect = (item: BlockCommandCatalogItem) =>
                  selectItem(item, props.command);
                menu = createSlashCommandMenuRenderer({
                  activeIndex,
                  cancelLabel: labels.cancel,
                  emptyLabel: labels.empty,
                  items: currentItems,
                  navigateLabel: labels.navigate,
                  onHighlight: (index) => {
                    activeIndex = index;
                    updateMenuProps({ activeIndex });
                  },
                  onSelect,
                  selectLabel: labels.select,
                  title: labels.title,
                });
                menu.element.style.width = "max-content";
                menu.element.style.zIndex = "120";
                unmountFloatingElement = props.mount(menu.element);
                activeSlashMenuCleanup = cleanupMenu;
              },
              onUpdate: (props) => {
                currentItems = props.items;
                activeIndex = Math.min(
                  activeIndex,
                  Math.max(currentItems.length - 1, 0),
                );
                updateMenuProps({
                  onSelect: (item) => selectItem(item, props.command),
                });
              },
              onKeyDown: (props: SuggestionKeyDownProps) => {
                if (props.event.key === "Escape") {
                  props.event.preventDefault();
                  props.view.focus();
                  exitSuggestion(props.view, slashCommandPluginKey);
                  cleanupMenu();
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
                  const command = menu?.props.onSelect;
                  if (!item || !command) return false;
                  command(item);
                  return true;
                }

                return false;
              },
              onExit: cleanupMenu,
            };
          },
        }),
      ];
    },
  });
}

export type { BlockEditorSlashMenuLabels };
export { createSlashCommandExtension };
