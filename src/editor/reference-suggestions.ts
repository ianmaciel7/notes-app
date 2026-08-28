import { type Editor, Extension, type Range } from "@tiptap/core";
import { type EditorState, PluginKey } from "@tiptap/pm/state";
import {
  exitSuggestion,
  Suggestion,
  type SuggestionKeyDownProps,
  type SuggestionPositionData,
} from "@tiptap/suggestion";
import type { BlockEditorMark } from "./document.ts";
import {
  createBlockReferenceMark,
  createObjectReferenceMark,
} from "../lib/workspace-object-links.ts";
import type { WorkspaceEntity } from "../lib/workspace-objects.ts";
import type { WorkspaceStructure } from "../lib/workspace-object-types.ts";
import {
  buildWorkspaceSearchIndex,
  searchWorkspaceIndex,
  type WorkspaceSearchIndex,
} from "../lib/workspace-query-engine.ts";
import {
  canOpenSuggestionTrigger,
  computeSuggestionMenuPosition,
  deleteSuggestionTriggerRange,
  getNextSuggestionIndex,
  isUsableSuggestionAnchorRect,
} from "./shared-suggestion-controller.ts";

type ObjectReferenceTrigger = "@" | "[[";

type ObjectReferenceSuggestionItem = {
  readonly context: string;
  readonly id: string;
  readonly label: string;
  readonly objectId: string;
};

type BlockReferenceSuggestionItem = {
  readonly blockId: string;
  readonly context: string;
  readonly id: string;
  readonly label: string;
  readonly objectId: string;
};

type ReferenceReplacementTarget =
  | {
      readonly kind: "object";
      readonly objectId: string;
    }
  | {
      readonly blockId: string;
      readonly kind: "block";
      readonly objectId: string;
    };

type ReferenceSuggestionItem =
  | (ObjectReferenceSuggestionItem & {
      readonly kind: "object";
      readonly mark: BlockEditorMark;
    })
  | (BlockReferenceSuggestionItem & {
      readonly kind: "block";
      readonly mark: BlockEditorMark;
    });

type ReferenceSuggestionOptions = {
  readonly entities: readonly WorkspaceEntity[];
  readonly getEntities?: () => readonly WorkspaceEntity[];
  readonly getStructures?: () => readonly WorkspaceStructure[];
  readonly structures: readonly WorkspaceStructure[];
};

type ReferenceSuggestionMenuProps = {
  readonly activeIndex: number;
  readonly items: readonly ReferenceSuggestionItem[];
  readonly onHighlight: (index: number) => void;
  readonly onSelect: (item: ReferenceSuggestionItem) => void;
  readonly title: string;
};

type ReferenceSuggestionMenuRenderer = {
  readonly element: HTMLElement;
  readonly props: ReferenceSuggestionMenuProps;
  readonly destroy: () => void;
  readonly updateProps: (props: Partial<ReferenceSuggestionMenuProps>) => void;
};

type ReferenceSuggestionRenderStartProps = {
  readonly clientRect?: (() => DOMRect | null | undefined) | null;
  readonly command: (item: ReferenceSuggestionItem) => void;
  readonly editor: Editor;
  readonly items: ReferenceSuggestionItem[];
  readonly range: Range;
  readonly mount: (
    element: HTMLElement,
    options: {
      readonly onPosition: (position: SuggestionPositionData) => void;
    },
  ) => () => void;
};

type ReferenceSuggestionRenderUpdateProps = {
  readonly command: (item: ReferenceSuggestionItem) => void;
  readonly items: ReferenceSuggestionItem[];
};

let activeReferenceMenuCleanup: (() => void) | undefined;

function entityById(entities: readonly WorkspaceEntity[]) {
  return new Map(entities.map((entity) => [entity.id, entity]));
}

function structureById(structures: readonly Pick<WorkspaceStructure, "id" | "singularName">[]) {
  return new Map(structures.map((structure) => [structure.id, structure]));
}

function fallbackStructureLabel(entity: WorkspaceEntity) {
  return entity.objectTypeId
    .split("-")
    .filter(Boolean)
    .map((token) => `${token[0]?.toLocaleUpperCase() ?? ""}${token.slice(1)}`)
    .join(" ");
}

function createObjectReferenceSuggestionItems({
  entities,
  index,
  query,
  structures,
}: {
  readonly entities: readonly WorkspaceEntity[];
  readonly index: WorkspaceSearchIndex;
  readonly query: string;
  readonly structures: readonly Pick<WorkspaceStructure, "id" | "singularName">[];
  readonly trigger: ObjectReferenceTrigger;
}): ObjectReferenceSuggestionItem[] {
  const entitiesById = entityById(entities);
  const structuresById = structureById(structures);
  const seen = new Set<string>();

  return searchWorkspaceIndex(index, query, "object").flatMap((result) => {
    if (seen.has(result.entityId)) return [];
    const entity = entitiesById.get(result.entityId);
    if (!entity) return [];
    seen.add(result.entityId);
    return [
      {
        context:
          structuresById.get(entity.objectTypeId)?.singularName ??
          fallbackStructureLabel(entity),
        id: `object:${entity.id}`,
        label: entity.title,
        objectId: entity.id,
      },
    ];
  });
}

function createBlockReferenceSuggestionItems({
  index,
  query,
}: {
  readonly entities: readonly WorkspaceEntity[];
  readonly index: WorkspaceSearchIndex;
  readonly query: string;
}): BlockReferenceSuggestionItem[] {
  return searchWorkspaceIndex(index, query, "block")
    .filter((result) => result.kind === "block")
    .map((result) => ({
      blockId: result.blockId,
      context: result.ownerTitle,
      id: `block:${result.entityId}:${result.blockId}`,
      label: result.text,
      objectId: result.entityId,
    }));
}

function createReferenceReplacement({
  label,
  range,
  target,
  text,
}: {
  readonly label: string;
  readonly range: { readonly from: number; readonly to: number };
  readonly target: ReferenceReplacementTarget;
  readonly text: string;
}): { readonly mark: BlockEditorMark; readonly text: string } {
  return {
    mark:
      target.kind === "object"
        ? createObjectReferenceMark(target.objectId)
        : createBlockReferenceMark(target.objectId, target.blockId),
    text: deleteSuggestionTriggerRange(text, range, label),
  };
}

function canOpenReferenceSuggestion({
  editor,
  state,
}: {
  readonly editor: Editor;
  readonly state: EditorState;
}) {
  const { $from, empty } = state.selection;
  return (
    editor.isEditable &&
    canOpenSuggestionTrigger({
      markNames: $from.marks().map((mark) => mark.type.name),
      nodeName: $from.parent.type.name,
      selectionEmpty: empty,
      textblock: $from.parent.isTextblock,
    })
  );
}

function insertReferenceSuggestion(
  editor: Editor,
  range: Range,
  item: ReferenceSuggestionItem,
) {
  if (item.kind === "object") {
    return editor
      .chain()
      .focus()
      .deleteRange(range)
      .setMark("objectLink", { objectId: item.objectId })
      .insertContent(item.label)
      .unsetMark("objectLink")
      .run();
  }

  return editor
    .chain()
    .focus()
    .deleteRange(range)
    .setMark("blockLink", { blockId: item.blockId, objectId: item.objectId })
    .insertContent(item.label)
    .unsetMark("blockLink")
    .run();
}

function renderReferenceSuggestionMenu(
  element: HTMLElement,
  props: ReferenceSuggestionMenuProps,
) {
  element.replaceChildren();
  element.dataset.slot = "block-editor-reference-menu";
  element.setAttribute("role", "listbox");
  element.setAttribute("aria-label", props.title);
  element.style.boxSizing = "border-box";
  element.style.width = "min(27.5rem, calc(100vw - 1rem))";
  element.style.maxHeight = "21rem";
  element.style.overflowY = "auto";
  element.style.border = "1px solid #dedbd7";
  element.style.borderRadius = "14px";
  element.style.background = "#ffffff";
  element.style.boxShadow =
    "0 10px 28px rgb(47 42 36 / 0.10), 0 2px 8px rgb(47 42 36 / 0.06)";
  element.style.padding = "0.5rem";
  element.style.color = "#292622";

  for (const [index, item] of props.items.entries()) {
    const selected = index === props.activeIndex;
    const button = element.ownerDocument.createElement("button");
    button.id = `block-editor-reference-option-${item.id}`;
    button.type = "button";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", selected ? "true" : "false");
    button.dataset.active = selected ? "true" : "";
    button.dataset.referenceKind = item.kind;
    button.style.display = "flex";
    button.style.width = "100%";
    button.style.alignItems = "center";
    button.style.gap = "0.75rem";
    button.style.border = "0";
    button.style.borderRadius = "10px";
    button.style.background = selected ? "#f3f1ee" : "transparent";
    button.style.padding = "0.5rem";
    button.style.textAlign = "left";
    button.style.font = "inherit";
    button.style.cursor = "default";
    button.addEventListener("pointermove", () => props.onHighlight(index));
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
      props.onSelect(item);
    });

    const label = element.ownerDocument.createElement("span");
    label.textContent = item.label;
    label.style.minWidth = "0";
    label.style.flex = "1";
    label.style.overflow = "hidden";
    label.style.textOverflow = "ellipsis";
    label.style.whiteSpace = "nowrap";
    button.append(label);

    const context = element.ownerDocument.createElement("span");
    context.textContent = item.context;
    context.style.flexShrink = "0";
    context.style.border = "1px solid #d9d5d1";
    context.style.borderRadius = "0.375rem";
    context.style.background = "#fbfaf9";
    context.style.padding = "0.125rem 0.375rem";
    context.style.fontSize = "0.75rem";
    context.style.color = "#77716b";
    button.append(context);

    element.append(button);
  }
}

function createReferenceSuggestionMenuRenderer(
  props: ReferenceSuggestionMenuProps,
): ReferenceSuggestionMenuRenderer {
  const element = document.createElement("div");
  let currentProps = props;
  renderReferenceSuggestionMenu(element, currentProps);

  return {
    element,
    get props() {
      return currentProps;
    },
    destroy: () => element.remove(),
    updateProps: (nextProps) => {
      currentProps = { ...currentProps, ...nextProps };
      renderReferenceSuggestionMenu(element, currentProps);
    },
  };
}

function applyReferenceSuggestionMenuPosition(
  element: HTMLElement,
  position: SuggestionPositionData,
  rect: DOMRect | null | undefined,
) {
  const ownerWindow = element.ownerDocument.defaultView ?? window;
  const menuRect = element.getBoundingClientRect();
  const anchor = isUsableSuggestionAnchorRect(rect) ? rect : null;
  const { left, top } = computeSuggestionMenuPosition({
    anchor,
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
    zIndex: "120",
  });
}

function getReferenceCursorRect(editor: Editor, position: number) {
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

function getReferenceSelectionRect(editor: Editor) {
  const ownerWindow = editor.view.dom.ownerDocument.defaultView;
  const selection = ownerWindow?.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return selection.getRangeAt(0).getBoundingClientRect();
}

function resolveReferenceMenuAnchor(props: ReferenceSuggestionRenderStartProps) {
  const suggestionRect = props.clientRect?.();
  if (isUsableSuggestionAnchorRect(suggestionRect)) return suggestionRect;
  const selectionRect = getReferenceSelectionRect(props.editor);
  if (isUsableSuggestionAnchorRect(selectionRect)) return selectionRect;
  return getReferenceCursorRect(props.editor, props.range.to);
}

function createReferenceSuggestionRender(title: string, pluginKey: PluginKey) {
  return () => {
    let menu: ReferenceSuggestionMenuRenderer | undefined;
    let cleanupMount: (() => void) | undefined;
    let cleanupKeydown: (() => void) | undefined;
    let activeIndex = 0;
    let currentItems: ReferenceSuggestionItem[] = [];

    function cleanupMenu() {
      const currentMenu = menu;
      const currentCleanup = cleanupMount;
      const currentKeydownCleanup = cleanupKeydown;
      menu = undefined;
      cleanupMount = undefined;
      cleanupKeydown = undefined;
      currentKeydownCleanup?.();
      currentCleanup?.();
      currentMenu?.destroy();
      if (activeReferenceMenuCleanup === cleanupMenu) {
        activeReferenceMenuCleanup = undefined;
      }
    }

    function updateMenuProps(nextProps: Partial<ReferenceSuggestionMenuProps>) {
      menu?.updateProps({
        activeIndex,
        items: currentItems,
        ...nextProps,
      });
    }

    return {
      onStart: (props: ReferenceSuggestionRenderStartProps) => {
        const previousCleanup = activeReferenceMenuCleanup;
        if (previousCleanup && previousCleanup !== cleanupMenu) {
          previousCleanup();
        }
        cleanupMenu();

        activeIndex = 0;
        currentItems = props.items;
        menu = createReferenceSuggestionMenuRenderer({
          activeIndex,
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
              ? applyReferenceSuggestionMenuPosition(
                  menu.element,
                  position,
                  resolveReferenceMenuAnchor(props),
                )
              : undefined,
        });
        const ownerDocument = props.editor.view.dom.ownerDocument;
        const ownerWindow = ownerDocument.defaultView;
        const onReferenceKeyDown = (event: KeyboardEvent) => {
          if (!menu) return;
          if (event.key === "Escape") {
            event.preventDefault();
            exitSuggestion(props.editor.view, pluginKey);
            cleanupMenu();
            return;
          }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            activeIndex = getNextSuggestionIndex(
              activeIndex,
              currentItems.length,
              event.key === "ArrowDown" ? 1 : -1,
            );
            updateMenuProps({ activeIndex });
            return;
          }
          if (event.key === "Enter") {
            const item = currentItems[activeIndex];
            if (!item) return;
            event.preventDefault();
            menu.props.onSelect(item);
            cleanupMenu();
          }
        };
        ownerDocument.addEventListener("keydown", onReferenceKeyDown, {
          capture: true,
        });
        ownerWindow?.addEventListener("keydown", onReferenceKeyDown, {
          capture: true,
        });
        props.editor.view.dom.addEventListener("keydown", onReferenceKeyDown, {
          capture: true,
        });
        cleanupKeydown = () => {
          ownerDocument.removeEventListener("keydown", onReferenceKeyDown, {
            capture: true,
          });
          ownerWindow?.removeEventListener("keydown", onReferenceKeyDown, {
            capture: true,
          });
          props.editor.view.dom.removeEventListener(
            "keydown",
            onReferenceKeyDown,
            { capture: true },
          );
        };
        activeReferenceMenuCleanup = cleanupMenu;
      },
      onUpdate: (props: ReferenceSuggestionRenderUpdateProps) => {
        currentItems = props.items;
        activeIndex = Math.min(activeIndex, Math.max(currentItems.length - 1, 0));
        updateMenuProps({ onSelect: props.command });
      },
      onKeyDown: (props: SuggestionKeyDownProps) => {
        if (props.event.key === "Escape") {
          props.event.preventDefault();
          cleanupMenu();
          return false;
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
          const item = currentItems[activeIndex];
          if (!item || !menu) return false;
          props.event.preventDefault();
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

function createReferenceSuggestionExtensions({
  entities,
  getEntities,
  getStructures,
  structures,
}: ReferenceSuggestionOptions) {
  const readEntities = () => getEntities?.() ?? entities;
  const readStructures = () => getStructures?.() ?? structures;
  const objectItems = (query: string) =>
    createObjectReferenceSuggestionItems({
      entities: readEntities(),
      index: buildWorkspaceSearchIndex(readEntities()),
      query,
      structures: readStructures(),
      trigger: "@",
    }).map(
      (item): ReferenceSuggestionItem => ({
        ...item,
        kind: "object",
        mark: createObjectReferenceMark(item.objectId),
      }),
    );
  const blockItems = (query: string) =>
    createBlockReferenceSuggestionItems({
      entities: readEntities(),
      index: buildWorkspaceSearchIndex(readEntities()),
      query,
    }).map(
      (item): ReferenceSuggestionItem => ({
        ...item,
        kind: "block",
        mark: createBlockReferenceMark(item.objectId, item.blockId),
      }),
    );

  return [
    Extension.create({
      name: "blockEditorObjectAtReference",
      addProseMirrorPlugins() {
        const pluginKey = new PluginKey("blockEditorObjectAtReference");
        return [
          Suggestion<ReferenceSuggestionItem, ReferenceSuggestionItem>({
            editor: this.editor,
            char: "@",
            pluginKey,
            allowedPrefixes: [" "],
            startOfLine: false,
            items: ({ query }) => objectItems(query),
            allow: canOpenReferenceSuggestion,
            render: createReferenceSuggestionRender("References", pluginKey),
            command: ({ editor, range, props }) => {
              insertReferenceSuggestion(editor, range, props);
              exitSuggestion(editor.view, pluginKey);
            },
          }),
        ];
      },
    }),
    Extension.create({
      name: "blockEditorObjectBracketReference",
      addProseMirrorPlugins() {
        const pluginKey = new PluginKey("blockEditorObjectBracketReference");
        return [
          Suggestion<ReferenceSuggestionItem, ReferenceSuggestionItem>({
            editor: this.editor,
            char: "[[",
            pluginKey,
            allowedPrefixes: [" "],
            startOfLine: false,
            items: ({ query }) => objectItems(query),
            allow: canOpenReferenceSuggestion,
            render: createReferenceSuggestionRender("References", pluginKey),
            command: ({ editor, range, props }) => {
              insertReferenceSuggestion(editor, range, props);
              exitSuggestion(editor.view, pluginKey);
            },
          }),
        ];
      },
    }),
    Extension.create({
      name: "blockEditorBlockReference",
      addProseMirrorPlugins() {
        const pluginKey = new PluginKey("blockEditorBlockReference");
        return [
          Suggestion<ReferenceSuggestionItem, ReferenceSuggestionItem>({
            editor: this.editor,
            char: "((",
            pluginKey,
            allowedPrefixes: [" "],
            startOfLine: false,
            items: ({ query }) => blockItems(query),
            allow: canOpenReferenceSuggestion,
            render: createReferenceSuggestionRender("Block references", pluginKey),
            command: ({ editor, range, props }) => {
              insertReferenceSuggestion(editor, range, props);
              exitSuggestion(editor.view, pluginKey);
            },
          }),
        ];
      },
    }),
  ];
}

export type {
  BlockReferenceSuggestionItem,
  ObjectReferenceSuggestionItem,
  ObjectReferenceTrigger,
  ReferenceSuggestionItem,
  ReferenceSuggestionOptions,
  ReferenceReplacementTarget,
};
export {
  createBlockReferenceSuggestionItems,
  createObjectReferenceSuggestionItems,
  createReferenceSuggestionExtensions,
  createReferenceReplacement,
};
