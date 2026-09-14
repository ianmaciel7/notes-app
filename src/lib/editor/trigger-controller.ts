export const SUGGESTION_MENU_VIEWPORT_GUTTER = 8;
export const SUGGESTION_MENU_CURSOR_GAP = 4;

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

export function resolveSuggestionTrigger({
  textBeforeCursor,
}: {
  readonly textBeforeCursor: string;
}): ResolvedSuggestionTrigger | null {
  const sortedTriggers = [...SUGGESTION_TRIGGER_DEFINITIONS].sort(
    (first, second) => second.priority - first.priority || second.token.length - first.token.length,
  );

  for (const trigger of sortedTriggers) {
    const from = textBeforeCursor.lastIndexOf(trigger.token);
    if (from < 0) continue;
    const to = textBeforeCursor.length;
    const query = textBeforeCursor.slice(from + trigger.token.length);
    if (from > 0 && !/\s/.test(textBeforeCursor.at(from - 1) ?? "")) continue;
    if (/\s/.test(query)) continue;
    return {
      owner: trigger.owner,
      query,
      range: { from, to },
      token: trigger.token,
    };
  }

  return null;
}
