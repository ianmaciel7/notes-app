"use client";

import { Plus } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { getReadableProperties } from "@/app/_components/objects/detail/object-detail-model";
import { useObjectMutation } from "@/app/_components/objects/use-object-mutation";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";
import { cn } from "@/lib/utils";

type PropertyProps = {
  entity: SpaceEntityRecord;
  hiddenKeys?: readonly string[];
};

export function ObjectPropertyValues({
  entity,
  hiddenKeys,
  className,
  ...props
}: PropertyProps & Omit<ComponentProps<"dl">, "children">) {
  const properties = getReadableProperties(entity, hiddenKeys);
  if (!properties.length) return null;
  return (
    <dl
      data-slot="object-property-values"
      className={cn("grid gap-2 text-sm sm:grid-cols-2", className)}
      {...props}
    >
      {properties.map(([key, value]) => (
        <div
          key={key}
          className={cn(
            "rounded-lg border border-[var(--app-border-el)] bg-[var(--app-bg-el)] p-3",
          )}
        >
          <dt className="text-xs font-medium uppercase text-[var(--app-text-secondary)]">{key}</dt>
          <dd className="mt-1 break-words text-[var(--app-text-primary)]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ObjectProperties(props: PropertyProps) {
  const mutation = useObjectMutation(props.entity);
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleSaveProperty = () => {
    const key = newKey.trim();
    if (key) {
      void mutation.save({
        properties: { ...props.entity.properties, [key]: newValue.trim() },
      });
      setNewKey("");
      setNewValue("");
      setIsAdding(false);
    }
  };

  return (
    <section
      data-slot="object-properties"
      className="mt-4 border-t border-[var(--app-border-front)] pt-3 group/properties flex flex-col"
    >
      <h2 className="text-sm font-medium text-[var(--app-text-primary)]">Propriedades</h2>
      <ObjectPropertyValues {...props} className="mt-3" />

      {isAdding ? (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Nome da propriedade"
            className="rounded border border-[var(--app-border-el)] bg-[var(--app-bg-el)] px-2 py-1 text-sm text-[var(--app-text-primary)] outline-none"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <input
            type="text"
            placeholder="Valor"
            className="rounded border border-[var(--app-border-el)] bg-[var(--app-bg-el)] px-2 py-1 text-sm text-[var(--app-text-primary)] outline-none"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <button
            type="button"
            className="rounded bg-[var(--app-button-primary-bg)] px-3 py-1 text-xs text-primary-foreground"
            onClick={handleSaveProperty}
          >
            Salvar
          </button>
          <button
            type="button"
            className="text-xs text-[var(--app-text-subtle)] hover:text-[var(--app-text-primary)]"
            onClick={() => setIsAdding(false)}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="opacity-0 group-hover/properties:opacity-100 transition-opacity duration-300 ease-out flex shrink-0 flex-wrap pt-2">
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="border-transparent text-[var(--app-text-subtle)] hover:text-[var(--app-text-secondary)] w-auto px-2 h-7 text-sm justify-center flex items-center gap-x-1.5 rounded-base cursor-pointer transition-colors"
          >
            <Plus className="size-3.5" />
            <span className="truncate">Adicionar propriedade</span>
          </button>
        </div>
      )}
    </section>
  );
}
