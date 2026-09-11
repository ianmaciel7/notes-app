"use client";

import { useId } from "react";
import { readEntityField } from "@/components/objects/detail/object-edit-model";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

type EditFieldProps = {
  label: string;
  name: string;
  value: string;
  multiline?: boolean;
  type?: string;
};
export function ObjectEditField({ label, name, value, multiline, type = "text" }: EditFieldProps) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea id={id} name={name} defaultValue={value} />
      ) : (
        <Input id={id} name={name} defaultValue={value} type={type} />
      )}
    </div>
  );
}

export function ObjectEditFields({ entity }: { entity: SpaceEntityRecord }) {
  return (
    <>
      <ObjectEditField label="Título" name="title" value={entity.title} />
      <ObjectEditField
        label="Tags (separadas por vírgulas)"
        name="tags"
        value={entity.tags.join(", ")}
      />
      {entity.type === "weblink" && (
        <ObjectEditField
          label="URL"
          name="url"
          type="url"
          value={String(entity.properties.url ?? "")}
        />
      )}
      {entity.type === "flashcard" && (
        <>
          <ObjectEditField
            label="Pergunta"
            name="front"
            multiline
            value={readEntityField(entity, "front")}
          />
          <ObjectEditField
            label="Resposta"
            name="back"
            multiline
            value={readEntityField(entity, "back")}
          />
        </>
      )}
      {entity.type === "study_goal" && (
        <>
          <ObjectEditField
            label="Data da prova"
            name="targetExamDate"
            type="date"
            value={readEntityField(entity, "targetExamDate").slice(0, 10)}
          />
          <ObjectEditField
            label="Retenção desejada (%)"
            name="targetRetentionRate"
            type="number"
            value={String(Number(readEntityField(entity, "targetRetentionRate")) * 100)}
          />
        </>
      )}
      {entity.blocks
        .filter((block) => block.type !== "divider")
        .map((block, index) => (
          <ObjectEditField
            key={block.id}
            label={`Bloco ${index + 1} (${block.type})`}
            name={`block:${block.id}`}
            value={block.content}
            multiline
          />
        ))}
      <ObjectEditField label="Adicionar conteúdo" name="new-content" value="" multiline />
      {Object.entries(entity.properties)
        .filter(
          ([key, value]) =>
            key !== "url" && (typeof value === "string" || typeof value === "number"),
        )
        .map(([key, value]) => (
          <ObjectEditField
            key={key}
            label={`Propriedade: ${key}`}
            name={`property:${key}`}
            value={String(value)}
            type={typeof value === "number" ? "number" : "text"}
          />
        ))}
    </>
  );
}
