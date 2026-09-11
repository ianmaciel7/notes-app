import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

export function readStringProperty(entity: SpaceEntityRecord, keys: readonly string[]) {
  for (const key of keys) {
    const value = entity.properties[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function getWeblinkUrl(entity: SpaceEntityRecord): string | undefined {
  const value = readStringProperty(entity, ["url", "URL", "href", "sourceUrl"]);
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return url.href.replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

export function getObjectTypeName(
  entity: SpaceEntityRecord,
  objectType?: SpaceObjectTypeRecord | { singularName?: string; label?: string },
): string {
  const name = objectType?.singularName ?? ("label" in (objectType ?? {}) ? (objectType as { label?: string }).label : undefined) ?? entity.objectTypeId.replace(/[-_]/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getReadablePropertyValue(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const items = value.map(getReadablePropertyValue).filter(Boolean);
    return items.length ? items.join(", ") : undefined;
  }
  if (typeof value === "object") return JSON.stringify(value);
  return undefined;
}

export function getReadableProperties(
  entity: SpaceEntityRecord,
  hiddenKeys: readonly string[] = [],
) {
  const hidden = new Set(hiddenKeys.map((key) => key.toLocaleLowerCase()));
  return Object.entries(entity.properties)
    .filter(([key]) => !hidden.has(key.toLocaleLowerCase()))
    .map(([key, value]) => [key, getReadablePropertyValue(value)] as const)
    .filter(([, value]) => value);
}

export function hasObjectBody(entity: SpaceEntityRecord): boolean {
  return entity.blocks.some((block) => block.type === "divider" || block.content.trim());
}
