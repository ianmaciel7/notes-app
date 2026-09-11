import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

function text(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}
export function readEntityField(entity: SpaceEntityRecord, key: string) {
  const value: unknown = Reflect.get(entity, key);
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}
function studyGoalEdit(form: FormData) {
  const date = text(form, "targetExamDate");
  const retention = Number(text(form, "targetRetentionRate"));
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date ||
    retention < 1 ||
    retention > 99 ||
    !Number.isFinite(retention)
  ) {
    throw new Error("Informe uma data válida e retenção entre 1 e 99%.");
  }
  return { targetExamDate: `${date}T00:00:00.000Z`, targetRetentionRate: retention / 100 };
}
function editedProperties(entity: SpaceEntityRecord, form: FormData) {
  const properties = { ...entity.properties };
  for (const [key, value] of Object.entries(properties)) {
    if (!form.has(`property:${key}`)) continue;
    const next = text(form, `property:${key}`);
    if (typeof value === "string") properties[key] = next;
    if (typeof value === "number") {
      const parsed = Number(next);
      if (!next.trim() || !Number.isFinite(parsed)) throw new Error(`Valor inválido: ${key}`);
      properties[key] = parsed;
    }
  }
  if (entity.type === "weblink") {
    const url = new URL(text(form, "url"));
    if (!["https:", "http:"].includes(url.protocol)) throw new Error("Use uma URL HTTP ou HTTPS.");
    properties.url = url.href;
  }
  return properties;
}
export function buildObjectEdit(entity: SpaceEntityRecord, form: FormData) {
  const title = text(form, "title").trim();
  if (!title) throw new Error("O título é obrigatório.");
  const blocks = entity.blocks.map((block) => ({
    ...block,
    content: form.has(`block:${block.id}`) ? text(form, `block:${block.id}`) : block.content,
  }));
  const newContent = text(form, "new-content").trim();
  if (newContent) blocks.push({ id: crypto.randomUUID(), type: "paragraph", content: newContent });
  const edit: Partial<SpaceEntityRecord> & Record<string, unknown> = {
    title,
    blocks,
    properties: editedProperties(entity, form),
    tags: [
      ...new Set(
        text(form, "tags")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ],
  };
  if (entity.type === "flashcard") {
    const front = text(form, "front").trim();
    const back = text(form, "back").trim();
    if (!front || !back) throw new Error("Preencha a pergunta e a resposta do flashcard.");
    Object.assign(edit, { front, back });
  }
  if (entity.type === "study_goal") Object.assign(edit, studyGoalEdit(form));
  return edit;
}
