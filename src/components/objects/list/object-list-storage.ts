import {
  type ObjectListPreferences,
  parseObjectListPreferences,
} from "@/components/objects/list/object-list-model";

export type ObjectListStorage = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): ObjectListStorage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

export function readObjectListPreferences(
  key: string,
  storage: ObjectListStorage | undefined = browserStorage(),
): ObjectListPreferences {
  try {
    return parseObjectListPreferences(storage?.getItem(key) ?? null);
  } catch {
    return parseObjectListPreferences(null);
  }
}

export function writeObjectListPreferences(
  key: string,
  preferences: ObjectListPreferences,
  storage: ObjectListStorage | undefined = browserStorage(),
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(key, JSON.stringify(preferences));
    return true;
  } catch {
    // View preferences are optional; user objects are never persisted through this adapter.
    return false;
  }
}
