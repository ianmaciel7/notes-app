export type ShortcutPlatform = "mac" | "windows" | "linux";

export type ShortcutModifier = "Mod" | "Ctrl" | "Alt" | "Shift";

export type ParsedShortcutChord = {
  readonly modifiers: readonly ShortcutModifier[];
  readonly key: string;
};

type KeyboardLikeEvent = {
  readonly key: string;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly altKey?: boolean;
  readonly shiftKey?: boolean;
};

const MODIFIER_ORDER: readonly ShortcutModifier[] = ["Mod", "Ctrl", "Alt", "Shift"];

const MODIFIER_ALIASES = new Map<string, ShortcutModifier>([
  ["mod", "Mod"],
  ["cmd", "Mod"],
  ["command", "Mod"],
  ["meta", "Mod"],
  ["ctrl", "Ctrl"],
  ["control", "Ctrl"],
  ["alt", "Alt"],
  ["option", "Alt"],
  ["shift", "Shift"],
]);

const KEY_LABELS = new Map<string, string>([
  ["ArrowUp", "↑"],
  ["ArrowDown", "↓"],
  ["ArrowLeft", "←"],
  ["ArrowRight", "→"],
  ["Enter", "Enter"],
  ["Escape", "Esc"],
  ["Delete", "Delete"],
  ["Backspace", "Backspace"],
  ["Space", "Space"],
]);

const KEY_ALIASES = new Map<string, string>([
  ["esc", "Escape"],
  ["space", "Space"],
  ["spacebar", "Space"],
  ["up", "ArrowUp"],
  ["arrowup", "ArrowUp"],
  ["down", "ArrowDown"],
  ["arrowdown", "ArrowDown"],
  ["left", "ArrowLeft"],
  ["arrowleft", "ArrowLeft"],
  ["right", "ArrowRight"],
  ["arrowright", "ArrowRight"],
]);

function normalizeKey(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed === "+") return null;
  if (trimmed.length === 1) return trimmed.toUpperCase();

  const lower = trimmed.toLowerCase();
  const alias = KEY_ALIASES.get(lower);
  if (alias) return alias;

  return trimmed[0]?.toUpperCase() + trimmed.slice(1);
}

export function parseShortcutChord(chord: string): ParsedShortcutChord {
  const parts = chord.split("+").map((part) => part.trim());
  if (parts.length === 0 || parts.some((part) => part.length === 0)) {
    throw new Error(`Invalid shortcut chord: ${chord}`);
  }

  const rawKey = parts.at(-1);
  const key = rawKey ? normalizeKey(rawKey) : null;
  if (!key) throw new Error(`Invalid shortcut chord: ${chord}`);

  const seen = new Set<ShortcutModifier>();
  const modifiers: ShortcutModifier[] = [];

  for (const part of parts.slice(0, -1)) {
    const modifier = MODIFIER_ALIASES.get(part.toLowerCase());
    if (!modifier || seen.has(modifier)) {
      throw new Error(`Invalid shortcut chord: ${chord}`);
    }
    seen.add(modifier);
    modifiers.push(modifier);
  }

  modifiers.sort((left, right) => MODIFIER_ORDER.indexOf(left) - MODIFIER_ORDER.indexOf(right));

  return { modifiers, key };
}

export function isShortcutChord(chord: string): boolean {
  try {
    parseShortcutChord(chord);
    return true;
  } catch {
    return false;
  }
}

export function serializeShortcutChord(chord: ParsedShortcutChord): string {
  return [...chord.modifiers, chord.key].join("+");
}

export function formatShortcutChord(chord: string, platform: ShortcutPlatform): string {
  const parsed = parseShortcutChord(chord);
  const formattedModifiers = parsed.modifiers.map((modifier) => {
    if (modifier === "Mod") return platform === "mac" ? "⌘" : "Ctrl";
    if (modifier === "Shift") return platform === "mac" ? "⇧" : "Shift";
    if (modifier === "Alt") return platform === "mac" ? "⌥" : "Alt";
    return "Ctrl";
  });
  const key = KEY_LABELS.get(parsed.key) ?? parsed.key;

  return platform === "mac"
    ? `${formattedModifiers.join("")}${key}`
    : [...formattedModifiers, key].join("+");
}

export function formatShortcutAriaChord(chord: string, platform: ShortcutPlatform): string {
  const parsed = parseShortcutChord(chord);
  const formattedModifiers = parsed.modifiers.map((modifier) => {
    if (modifier === "Mod") return platform === "mac" ? "Meta" : "Control";
    if (modifier === "Ctrl") return "Control";
    return modifier;
  });

  return [...formattedModifiers, parsed.key].join("+");
}

export function resolveShortcutChord(
  event: KeyboardLikeEvent,
  platform: ShortcutPlatform,
): string | null {
  const key = normalizeKey(event.key);
  if (!key) return null;

  const modifiers: ShortcutModifier[] = [];
  const hasMod = platform === "mac" ? Boolean(event.metaKey) : Boolean(event.ctrlKey);

  if (hasMod) modifiers.push("Mod");
  if (event.ctrlKey && !hasMod) modifiers.push("Ctrl");
  if (event.altKey) modifiers.push("Alt");
  if (event.shiftKey) modifiers.push("Shift");
  if (modifiers.length === 0) return null;

  modifiers.sort((left, right) => MODIFIER_ORDER.indexOf(left) - MODIFIER_ORDER.indexOf(right));

  return serializeShortcutChord({ modifiers, key });
}
