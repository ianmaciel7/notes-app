export const SUGGESTION_MENU_VIEWPORT_GUTTER = 8;
export const SUGGESTION_MENU_CURSOR_GAP = 4;
export const SUGGESTION_MENU_MOTION_CLASS =
  "transition-[opacity,transform] duration-100 motion-reduce:transition-none";

export type SuggestionTriggerOwner =
  | "slash-command"
  | "plus-quick-action"
  | "tag-reference"
  | "object-reference"
  | "block-reference";

export type SuggestionTriggerDefinition = {
  readonly owner: SuggestionTriggerOwner;
  readonly priority: number;
  readonly token: "/" | "+" | "#" | "@" | "[[" | "((";
};

export type ResolvedSuggestionTrigger = {
  readonly owner: SuggestionTriggerOwner;
  readonly query: string;
  readonly range: { readonly from: number; readonly to: number };
  readonly token: SuggestionTriggerDefinition["token"];
};

export const SUGGESTION_TRIGGER_DEFINITIONS: SuggestionTriggerDefinition[] = [
  { token: "[[", owner: "object-reference", priority: 40 },
  { token: "((", owner: "block-reference", priority: 40 },
  { token: "/", owner: "slash-command", priority: 20 },
  { token: "+", owner: "plus-quick-action", priority: 20 },
  { token: "#", owner: "tag-reference", priority: 20 },
  { token: "@", owner: "object-reference", priority: 20 },
];

export type SuggestionRect = {
  readonly bottom: number;
  readonly height?: number;
  readonly left: number;
  readonly top: number;
  readonly width: number;
};

export type SuggestionFallbackPosition = {
  readonly x: number;
  readonly y: number;
};

export function canOpenSuggestionTrigger({
  composing = false,
  markNames = [],
  nodeName,
  selectionEmpty,
  textblock,
}: {
  readonly composing?: boolean;
  readonly markNames?: readonly string[];
  readonly nodeName?: string;
  readonly selectionEmpty: boolean;
  readonly textblock: boolean;
}) {
  if (composing || !selectionEmpty || !textblock) return false;
  if (nodeName === "codeBlock") return false;
  return !markNames.includes("code");
}

function hasValidTriggerBoundary(
  textBeforeCursor: string,
  triggerStart: number,
) {
  if (triggerStart === 0) return true;
  return /\s/.test(textBeforeCursor.at(triggerStart - 1) ?? "");
}

function hasTriggerLeakage(query: string) {
  return /[/+#@[\]()]/.test(query);
}

export function resolveSuggestionTrigger({
  textBeforeCursor,
}: {
  readonly textBeforeCursor: string;
}): ResolvedSuggestionTrigger | null {
  const sortedTriggers = [...SUGGESTION_TRIGGER_DEFINITIONS].sort(
    (first, second) =>
      second.priority - first.priority ||
      second.token.length - first.token.length,
  );

  for (const trigger of sortedTriggers) {
    const from = textBeforeCursor.lastIndexOf(trigger.token);
    if (from < 0) continue;
    const to = textBeforeCursor.length;
    const query = textBeforeCursor.slice(from + trigger.token.length);
    if (!hasValidTriggerBoundary(textBeforeCursor, from)) continue;
    if (/\s/.test(query) || hasTriggerLeakage(query)) continue;
    return {
      owner: trigger.owner,
      query,
      range: { from, to },
      token: trigger.token,
    };
  }

  return null;
}

export function deleteSuggestionTriggerRange(
  value: string,
  range: { readonly from: number; readonly to: number },
  replacement: string,
) {
  return `${value.slice(0, range.from)}${replacement}${value.slice(range.to)}`;
}

export function getNextSuggestionIndex(
  currentIndex: number,
  itemCount: number,
  direction: 1 | -1,
) {
  if (itemCount <= 0) return -1;
  if (currentIndex < 0) return direction > 0 ? 0 : itemCount - 1;
  return (currentIndex + direction + itemCount) % itemCount;
}

export function isUsableSuggestionAnchorRect(
  rect: SuggestionRect | null | undefined,
): rect is SuggestionRect {
  const collapsedAtViewportEdge = Boolean(
    rect &&
      rect.left <= SUGGESTION_MENU_VIEWPORT_GUTTER &&
      rect.width === 0,
  );
  return Boolean(
    rect &&
      Number.isFinite(rect.left) &&
      Number.isFinite(rect.top) &&
      Number.isFinite(rect.bottom) &&
      !collapsedAtViewportEdge &&
      (rect.left !== 0 ||
        rect.top !== 0 ||
        rect.width !== 0 ||
        (rect.height ?? 0) !== 0),
  );
}

export function installSuggestionOutsideDismissal({
  menuContainsTarget,
  onDismiss,
  ownerDocument,
}: {
  readonly menuContainsTarget: (target: EventTarget | null) => boolean;
  readonly onDismiss: () => void;
  readonly ownerDocument: Pick<
    Document,
    "addEventListener" | "removeEventListener"
  >;
}) {
  const onPointerDown = ((event: PointerEvent) => {
    if (menuContainsTarget(event.target)) return;
    onDismiss();
  }) as EventListener;
  const options = { capture: true } as const;
  ownerDocument.addEventListener("pointerdown", onPointerDown, options);
  return () => {
    ownerDocument.removeEventListener("pointerdown", onPointerDown, options);
  };
}

export function resolveSuggestionAnchorRect({
  decorationRect,
  documentPositionRect,
  selectionRect,
}: {
  readonly decorationRect: SuggestionRect | null | undefined;
  readonly documentPositionRect: SuggestionRect | null | undefined;
  readonly selectionRect: SuggestionRect | null | undefined;
}) {
  if (isUsableSuggestionAnchorRect(decorationRect)) return decorationRect;
  if (isUsableSuggestionAnchorRect(selectionRect)) return selectionRect;
  if (isUsableSuggestionAnchorRect(documentPositionRect)) {
    return documentPositionRect;
  }
  return null;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

export function computeSuggestionMenuPosition({
  anchor,
  fallbackPosition,
  menu,
  viewport,
}: {
  readonly anchor: SuggestionRect | null;
  readonly fallbackPosition: SuggestionFallbackPosition;
  readonly menu: { readonly height: number; readonly width: number };
  readonly viewport: { readonly height: number; readonly width: number };
}) {
  const menuWidth = menu.width || 440;
  const preferredLeft = anchor?.left ?? fallbackPosition.x;
  const preferredBelow = anchor
    ? anchor.bottom + SUGGESTION_MENU_CURSOR_GAP
    : fallbackPosition.y;
  const maximumLeft =
    viewport.width - menuWidth - SUGGESTION_MENU_VIEWPORT_GUTTER;
  const left = clamp(
    preferredLeft,
    SUGGESTION_MENU_VIEWPORT_GUTTER,
    maximumLeft,
  );

  let top = preferredBelow;
  if (
    anchor &&
    menu.height > 0 &&
    preferredBelow + menu.height + SUGGESTION_MENU_VIEWPORT_GUTTER >
      viewport.height
  ) {
    const above = anchor.top - menu.height - SUGGESTION_MENU_CURSOR_GAP;
    if (above >= SUGGESTION_MENU_VIEWPORT_GUTTER) top = above;
  }

  if (menu.height > 0) {
    top = clamp(
      top,
      SUGGESTION_MENU_VIEWPORT_GUTTER,
      viewport.height - menu.height - SUGGESTION_MENU_VIEWPORT_GUTTER,
    );
  } else {
    top = Math.max(SUGGESTION_MENU_VIEWPORT_GUTTER, top);
  }

  return { left: Math.round(left), top: Math.round(top) };
}
