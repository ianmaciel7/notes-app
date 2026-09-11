import type { ComponentProps } from "react";
import { getReadableProperties } from "@/components/objects/detail/object-detail-model";
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
          <dt className="text-xs font-medium uppercase text-[var(--app-text-secondary)]">
            {key}
          </dt>
          <dd className="mt-1 break-words text-[var(--app-text-primary)]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ObjectProperties(props: PropertyProps) {
  if (!getReadableProperties(props.entity, props.hiddenKeys).length) return null;
  return (
    <section
      data-slot="object-properties"
      className="mt-4 border-t border-[var(--app-border-front)] pt-4"
    >
      <h2 className="text-sm font-medium text-[var(--app-text-primary)]">Propriedades</h2>
      <ObjectPropertyValues {...props} className="mt-3" />
    </section>
  );
}
