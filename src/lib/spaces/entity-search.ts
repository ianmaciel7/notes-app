import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function scalarText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string").join(" ");
  return "";
}

export function searchWorkspaceEntities(entities: readonly SpaceEntityRecord[], query: string) {
  const needle = normalize(query.trim());
  if (!needle) return [...entities];
  return entities.filter((entity) => {
    const record = entity as SpaceEntityRecord & {
      front?: string;
      back?: string;
      extractedText?: string;
    };
    const text = [
      entity.id,
      entity.title,
      entity.type,
      entity.objectTypeId,
      ...entity.tags,
      ...entity.blocks.map((block) => block.content),
      ...Object.values(entity.properties).map(scalarText),
      record.front,
      record.back,
      record.extractedText,
    ]
      .filter(Boolean)
      .join(" ");
    return normalize(text).includes(needle);
  });
}
