"use client";

import { type Editor, Extension, type Range } from "@tiptap/core";
import { type EditorState, PluginKey } from "@tiptap/pm/state";
import {
  exitSuggestion,
  Suggestion,
  type SuggestionKeyDownProps,
  type SuggestionPositionData,
} from "@tiptap/suggestion";
import { createRoot, type Root } from "react-dom/client";
import {
  type BlockCommandCatalogLabels,
  createBlockCommandCatalog,
} from "@/editor/block-command-catalog";
import {
  type QuickActionSuggestionItem,
  type TagSuggestionItem,
  createPlusSuggestionItems,
  createTagSuggestionItems,
} from "@/editor/quick-action-suggestion-contracts";
import {
  computeSuggestionMenuPosition,
  getNextSuggestionIndex,
  isUsableSuggestionAnchorRect,
} from "@/editor/shared-suggestion-controller";
import type { WorkspaceStructure } from "@/lib/workspace-object-types";
import type { WorkspaceEntity } from "@/lib/workspace-objects";
import { cn } from "@/lib/utils";

type QuickCreateObjectResult = {
  readonly id: string;
  readonly label: string;
};

type QuickActionSuggestionOptions = {
  readonly blockLabels: BlockCommandCatalogLabels;
  readonly createTagLabel?: string;
  readonly getEntities?: () => readonly WorkspaceEntity[];
  readonly getStructures?: () => readonly WorkspaceStructure[];
  readonly onCreateObjectReference?: (
    objectTypeId: string,
    title: string,
  ) => QuickCreateObjectResult | null;
  readonly onCreateOrReuseTag?: (label: string) => QuickCreateObjectResult | null;
  readonly onTagReference?: (tagId: string) => void;
  readonly tagTitle?: string;
};

type SuggestionMenuItem = QuickActionSuggestionItem | TagSuggestionItem;

type SuggestionMenuProps<TItem extends SuggestionMenuItem> = {
  readonly activeIndex: number;
  readonly emptyLabel: string;
  readonly items: readonly TItem[];
  readonly onHighlight: (index: number) => void;
  readonly onSelect: (item: TItem) => void;
  readonly title: string;
};

type SuggestionMenuRenderer<TItem extends SuggestionMenuItem> = {
  readonly element: HTMLElement;
  readonly props: SuggestionMenuProps<TItem>;
  readonly destroy: () => void;
  readonly updateProps: (props: Partial<SuggestionMenuProps<TItem>>) => void;
};

type RendererState = "active" | "destroy-pending" | "destroyed";

function insertMarkedReference({
  editor,
  label,
  objectId,
  range,
  textPrefix = "",
}: {
  readonly editor: Editor;
  readonly label: string;
  readonly objectId: string;
  readonly range: Range;
  readonly textPrefix?: string;
}) {
  return editor
    .chain()
    .focus()
    .deleteRange(range)
    .setMark("objectLink", { objectId })
    .insertContent(`${textPrefix}${label}`)
    .unsetMark("objectLink")
    .run();
}

function canOpenQuickActionSuggestion({
  editor,
  state,
}: {
  readonly editor: Editor;
  readonly state: EditorState;
}) {
  const { $from, empty } = state.selection;
  return (
    editor.isEditable &&
    empty &&
    $from.parent.isTextblock &&
    $from.parent.type.name !== "codeBlock" &&
    !$from.marks().some((mark) => mark.type.name === "code")
  );
}

function renderSuggestionMenu<TItem extends SuggestionMenuItem>({
  activeIndex,
  emptyLabel,
  items,
  onHighlight,
  onSelect,
  title,
}: SuggestionMenuProps<TItem>) {
  return (
    <div
      data-slot="block-editor-quick-suggestion-menu"
      className="box-border flex w-[27.5rem] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-[14px] border border-[#dedbd7] bg-white text-[#292622] shadow-[0_10px_28px_rgb(47_42_36/0.10),0_2px_8px_rgb(47_42_36/0.06)]"
    >
      <div className="px-3 pb-1 pt-3 text-[14px] font-normal leading-5 text-[#8b857f]">
        {title}
      </div>
      <div
        role="listbox"
        aria-label={title}
        className="max-h-[21rem] min-h-0 overflow-y-auto px-2 pb-2"
      >
        {items.length > 0 ? (
          items.map((item, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={selected}
                data-active={selected || undefined}
                data-kind={item.kind}
                onPointerMove={() => onHighlight(index)}
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
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
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
    </div>
  );
}

function scheduleRootUnmount(
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

function createSuggestionMenuRenderer<TItem extends SuggestionMenuItem>(
  initialProps: SuggestionMenuProps<TItem>,
): SuggestionMenuRenderer<TItem> {
  const element = document.createElement("div");
  const root = createRoot(element);
  let props = initialProps;
  let state: RendererState = "active";

  function render() {
    if (state !== "active") return;
    root.render(renderSuggestionMenu(props));
  }

  render();

  return {
    element,
    get props() {
      return props;
    },
    destroy: () => {
      if (state !== "active") return;
      state = "destroy-pending";
      element.remove();
      scheduleRootUnmount(root, element, () => {
        state = "destroyed";
      });
    },
    updateProps: (nextProps) => {
      if (state !== "active") return;
      props = { ...props, ...nextProps };
      render();
    },
  };
}

function applySuggestionMenuPosition(
  element: HTMLElement,
  position: SuggestionPositionData,
  rect: DOMRect | null | undefined,
) {
  const ownerWindow = element.ownerDocument.defaultView ?? window;
  const menuRect = element.getBoundingClientRect();
  const { left, top } = computeSuggestionMenuPosition({
    anchor: isUsableSuggestionAnchorRect(rect) ? rect : null,
    fallbackPosition: position,
    menu: { height: menuRect.height, width: menuRect.width },
    viewport: {
      height: ownerWindow.innerHeight,
      width: ownerWindow.innerWidth,
    },
  });

  Object.assign(element.style, {
    left: `${left}px`,
    position: "fixed",
    top: `${top}px`,
    width: "max-content",
    zIndex: "120",
  });
}

function createSuggestionRender<TItem extends SuggestionMenuItem>(
  title: string,
  emptyLabel: string,
) {
  return () => {
    let menu: SuggestionMenuRenderer<TItem> | undefined;
    let cleanupMount: (() => void) | undefined;
    let activeIndex = 0;
    let currentItems: TItem[] = [];

    function cleanupMenu() {
      const currentMenu = menu;
      const currentCleanup = cleanupMount;
      menu = undefined;
      cleanupMount = undefined;
      currentCleanup?.();
      currentMenu?.destroy();
    }

    function updateMenuProps(nextProps: Partial<SuggestionMenuProps<TItem>>) {
      menu?.updateProps({
        activeIndex,
        items: currentItems,
        ...nextProps,
      });
    }

    return {
      onStart: (props: {
        clientRect?: (() => DOMRect | null | undefined) | null;
        command: (item: TItem) => void;
        editor: Editor;
        items: TItem[];
        mount: (
          element: HTMLElement,
          options: {
            readonly onPosition: (position: SuggestionPositionData) => void;
          },
        ) => () => void;
      }) => {
        cleanupMenu();
        activeIndex = 0;
        currentItems = props.items;
        menu = createSuggestionMenuRenderer({
          activeIndex,
          emptyLabel,
          items: currentItems,
          onHighlight: (index) => {
            activeIndex = index;
            updateMenuProps({ activeIndex });
          },
          onSelect: props.command,
          title,
        });
        cleanupMount = props.mount(menu.element, {
          onPosition: (position) =>
            menu
              ? applySuggestionMenuPosition(
                  menu.element,
                  position,
                  props.clientRect?.(),
                )
              : undefined,
        });
      },
      onUpdate: (props: { command: (item: TItem) => void; items: TItem[] }) => {
        currentItems = props.items;
        activeIndex = Math.min(activeIndex, Math.max(currentItems.length - 1, 0));
        updateMenuProps({ onSelect: props.command });
      },
      onKeyDown: (props: SuggestionKeyDownProps) => {
        if (props.event.key === "Escape") {
          props.event.preventDefault();
          cleanupMenu();
          return true;
        }
        if (props.event.key === "ArrowDown" || props.event.key === "ArrowUp") {
          props.event.preventDefault();
          activeIndex = getNextSuggestionIndex(
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
          if (!item || !menu) return false;
          menu.props.onSelect(item);
          cleanupMenu();
          return true;
        }
        return false;
      },
      onExit: cleanupMenu,
    };
  };
}

function createQuickActionSuggestionExtensions(
  options: QuickActionSuggestionOptions,
) {
  const readEntities = () => options.getEntities?.() ?? [];
  const readStructures = () => options.getStructures?.() ?? [];

  return [
    Extension.create({
      name: "blockEditorPlusQuickAction",
      addProseMirrorPlugins() {
        const pluginKey = new PluginKey("blockEditorPlusQuickAction");
        return [
          Suggestion<QuickActionSuggestionItem, QuickActionSuggestionItem>({
            editor: this.editor,
            char: "+",
            pluginKey,
            allowedPrefixes: [" "],
            startOfLine: false,
            items: ({ query }) =>
              createPlusSuggestionItems({
                blockItems: createBlockCommandCatalog(options.blockLabels),
                query,
                structures: readStructures(),
              }),
            allow: canOpenQuickActionSuggestion,
            render: createSuggestionRender(
              options.blockLabels.title,
              options.blockLabels.empty,
            ),
            command: ({ editor, range, props }) => {
              if (props.kind === "block") {
                props.execute(editor, range);
              } else {
                const created = options.onCreateObjectReference?.(
                  props.objectTypeId,
                  props.label,
                );
                if (created) {
                  insertMarkedReference({
                    editor,
                    label: created.label,
                    objectId: created.id,
                    range,
                  });
                }
              }
              exitSuggestion(editor.view, pluginKey);
            },
          }),
        ];
      },
    }),
    Extension.create({
      name: "blockEditorTagReference",
      addProseMirrorPlugins() {
        const pluginKey = new PluginKey("blockEditorTagReference");
        return [
          Suggestion<TagSuggestionItem, TagSuggestionItem>({
            editor: this.editor,
            char: "#",
            pluginKey,
            allowedPrefixes: [" "],
            startOfLine: false,
            items: ({ query }) =>
              createTagSuggestionItems({
                createTagLabel: options.createTagLabel,
                entities: readEntities(),
                query,
                tagTitle: options.tagTitle,
              }),
            allow: canOpenQuickActionSuggestion,
            render: createSuggestionRender(
              options.tagTitle ?? "Tags",
              options.blockLabels.empty,
            ),
            command: ({ editor, range, props }) => {
              const resolved = props.tagId
                ? { id: props.tagId, label: props.label }
                : options.onCreateOrReuseTag?.(
                    props.label.replace(/^.*?:\s*/, ""),
                  );
              if (resolved) {
                insertMarkedReference({
                  editor,
                  label: resolved.label,
                  objectId: resolved.id,
                  range,
                  textPrefix: "#",
                });
                options.onTagReference?.(resolved.id);
              }
              exitSuggestion(editor.view, pluginKey);
            },
          }),
        ];
      },
    }),
  ];
}

export type {
  QuickActionSuggestionOptions,
  QuickCreateObjectResult,
};
export {
  createQuickActionSuggestionExtensions,
};
