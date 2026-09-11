import { ObjectTypeLabelChip } from "@/components/object-icons";
import { ObjectActions } from "@/components/objects/detail/object-actions";
import { getObjectTypeName } from "@/components/objects/detail/object-detail-model";
import type { ObjectTypeDetailProps } from "@/components/objects/object-view-types";
import { cn } from "@/lib/utils";

export function ObjectHeading({ entity, objectType }: ObjectTypeDetailProps) {
  return (
    <>
      <div
        data-slot="workspace-object-type-header-chip"
        className="flex min-w-0 items-center justify-between gap-2"
      >
        <ObjectTypeLabelChip
          id={objectType?.id ?? entity.objectTypeId}
          iconName={objectType?.iconName}
          label={getObjectTypeName(entity, objectType)}
          tone={objectType?.tone ?? "gray"}
        />
        <ObjectActions entity={entity} />
      </div>
      <h1 className="mt-3 break-words text-3xl font-semibold text-[var(--app-text-primary)]">
        {entity.title || "Sem título"}
      </h1>
      {entity.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {entity.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-md border border-[var(--app-border-el)] bg-[var(--app-bg-el)]",
                "px-2 py-1 text-xs text-[var(--app-text-secondary)]",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
