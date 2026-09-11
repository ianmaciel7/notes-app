import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

export function entityToMarkdown(entity: SpaceEntityRecord) {
  const lines = [`# ${entity.title}`, ""];
  for (const key of ["front", "back"]) {
    const value: unknown = Reflect.get(entity, key);
    if (typeof value === "string" && value) lines.push(value, "");
  }
  lines.push(...entity.blocks.map((block) => (block.type === "divider" ? "---" : block.content)));
  if (entity.tags.length) lines.push("", entity.tags.map((tag) => `#${tag}`).join(" "));
  return lines.join("\n\n");
}

export async function copyWorkspaceText(text: string) {
  if (!globalThis.navigator?.clipboard?.writeText) {
    throw new Error("A área de transferência não está disponível neste navegador.");
  }
  await navigator.clipboard.writeText(text);
}

export function exportWorkspaceObjects(name: string, entities: readonly SpaceEntityRecord[]) {
  const payload = JSON.stringify(
    { format: "notes-app-objects", version: 1, objects: entities },
    null,
    2,
  );
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${name.replace(/[^\p{L}\p{N}_.-]+/gu, "-").slice(0, 80) || "objects"}.json`;
  try {
    document.body.append(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
