"use client";

import { type Editor, Extension, type Range } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import {
  exitSuggestion,
  Suggestion,
  type SuggestionKeyDownProps,
  type SuggestionPositionData,
} from "@tiptap/suggestion";
import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  type BlockCommandCatalogItem,
  type BlockCommandCatalogLabels,
  createBlockCommandCatalog,
} from "@/editor/block-command-catalog";
import { cn } from "@/lib/utils";

const slashCommandPluginKey = new PluginKey("block-editor-slash-command");
const SLASH_MENU_VIEWPORT_GUTTER = 8;
const SLASH_MENU_CURSOR_GAP = 4;
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

type SlashMenuAnchorState = {
  editor: Editor;
  position: number;
  clientRect?: (() => DOMRect | null | undefined) | null;
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
      className="box-border flex w-[27.5rem] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-[14px] border border-[#dedbd7] bg-white text-[#292622] shadow-[0_10px_28px_rgb(47_42_36/0.10),0_2px_8px_rgb(47_42_36/0.06)]"
    >
      <div className="px-3 pb-1 pt-3 text-[14px] font-normal leading-5 text-[#8b857f]">
        {title}
      </div>

      <div
        ref={listRef}
        role="listbox"
        aria-label={title}
        aria-activedescendant={
          activeItem ? `block-editor-slash-option-${activeItem.id}` : undefined
        }
        className="max-h-[21rem] min-h-0 overflow-y-auto px-2 pb-2"
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
                  "flex h-10 w-full items-center gap-3 rounded-[10px] px-2 text-left text-[16px] font-normal leading-5 outline-none transition-colors",
                  selected ? "bg-[#f3f1ee]" : "hover:bg-[#f7f5f2]",
                )}
              >
                <Icon className="size-5 shrink-0 text-[#8d8781]" />
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                {item.badge ? (
                  <span className="shrink-0 rounded-md border border-[#d9d5d1] bg-[#fbfaf9] px-1.5 py-0.5 text-xs text-[#77716b]">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })
        ) : (
          <div className="px-2 py-4 text-[14px] text-[#8b857f]">
            {emptyLabel}
          </div>
        )}
      </div>

      <div className="flex h-9 shrink-0 items-center gap-4 border-t border-[#e5e1dd] px-3 text-[13px] leading-4 text-[#383430]">
        <span className="whitespace-nowrap">
          <span className="font-medium">↑↓</span> {navigateLabel}
        </span>
        <span className="whitespace-nowrap">
          <span className="font-medium">Esc</span> {cancelLabel}
        </span>
        <span className="whitespace-nowrap">
          <span className="font-medium">↵</span> {selectLabel}
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
  return [
    {
      id: `create-page:${title}`,
      icon: createBlockCommandCatalog(labels)[0].icon,
      title: `${labels.createPage} '${title}'`,
      badge: labels.page,
      searchTerms: [title],
      execute: (editor: Editor, range: Range) => {
        editor.chain().focus().deleteRange(range).run();
        options.onCreatePageRequest?.(title);
      },
    },
  ];
}

function isUsableAnchorRect(
  rect: DOMRect | null | undefined,
): rect is DOMRect {
  return Boolean(
    rect &&
      Number.isFinite(rect.left) &&
      Number.isFinite(rect.top) &&
      Number.isFinite(rect.bottom) &&
      (rect.left !== 0 || rect.top !== 0 || rect.width !== 0 || rect.height !== 0),
  );
}

function getCursorRect(editor: Editor, position: number) {
  try {
    const coords = editor.view.coordsAtPos(position);
    return new DOMRect(
      coords.left,
      coords.top,
      Math.max(0, coords.right - coords.left),
      Math.max(0, coords.bottom - coords.top),
    );
  } catch {
    return null;
  }
}

function resolveSlashMenuAnchor(anchor: SlashMenuAnchorState) {
  const suggestionRect = anchor.clientRect?.();
  if (isUsableAnchorRect(suggestionRect)) return suggestionRect;
  return getCursorRect(anchor.editor, anchor.position);
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function applySlashMenuPosition(
  element: HTMLElement,
  position: SuggestionPositionData,
  anchor: DOMRect | null,
) {
  const ownerWindow = element.ownerDocument.defaultView ?? window;
  const menuRect = element.getBoundingClientRect();
  const menuWidth = menuRect.width || 440;
  const menuHeight = menuRect.height;
  const preferredLeft = anchor?.left ?? position.x;
  const preferredBelow = anchor ? anchor.bottom + SLASH_MENU_CURSOR_GAP : position.y;
  const maximumLeft = ownerWindow.innerWidth - menuWidth - SLASH_MENU_VIEWPORT_GUTTER;
  const left = clamp(preferredLeft, SLASH_MENU_VIEWPORT_GUTTER, maximumLeft);

  let top = preferredBelow;
  if (
    anchor &&
    menuHeight > 0 &&
    preferredBelow + menuHeight + SLASH_MENU_VIEWPORT_GUTTER > ownerWindow.innerHeight
  ) {
    const above = anchor.top - menuHeight - SLASH_MENU_CURSOR_GAP;
    if (above >= SLASH_MENU_VIEWPORT_GUTTER) top = above;
  }
  if (menuHeight > 0) {
    top = clamp(
      top,
      SLASH_MENU_VIEWPORT_GUTTER,
      ownerWindow.innerHeight - menuHeight - SLASH_MENU_VIEWPORT_GUTTER,
    );
  } else {
    top = Math.max(SLASH_MENU_VIEWPORT_GUTTER, top);
  }

  Object.assign(element.style, {
    left: `${Math.round(left)}px`,
    position: "fixed",
    top: `${Math.round(top)}px`,
    width: "max-content",
    zIndex: "120",
  });
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
          startOfLine: false,
          allowedPrefixes: [" "],
          initialItems: commandItems,
          floatingUi: { strategy: "fixed" },
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
            let anchorState: SlashMenuAnchorState | undefined;

            function cleanupMenu() {
              const currentMenu = menu;
              const currentUnmount = unmountFloatingElement;
              menu = undefined;
              unmountFloatingElement = undefined;
              anchorState = undefined;
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

            function updateMenuProps(nextProps: Partial<SlashCommandMenuProps>) {
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
                anchorState = {
                  editor: props.editor,
                  position: props.range.to,
                  clientRect: props.clientRect,
                };
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
                unmountFloatingElement = props.mount(menu.element, {
                  onPosition: (position) => {
                    if (!menu || !anchorState) return;
                    applySlashMenuPosition(
                      menu.element,
                      position,
                      resolveSlashMenuAnchor(anchorState),
                    );
                  },
                });
                activeSlashMenuCleanup = cleanupMenu;
              },
              onUpdate: (props) => {
                currentItems = props.items;
                activeIndex = Math.min(
                  activeIndex,
                  Math.max(currentItems.length - 1, 0),
                );
                anchorState = {
                  editor: props.editor,
                  position: props.range.to,
                  clientRect: props.clientRect,
                };
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
