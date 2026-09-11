"use client";

import { ObjectDetailResolver } from "@/app/_components/objects/object-detail-resolver";
import { PendingImplementation } from "@/app/_components/shared/pending-implementation";
import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";
import { cn } from "@/lib/utils";

export type EmbeddedObjectListProps = {
  entities: readonly SpaceEntityRecord[];
  objectTypes?: readonly SpaceObjectTypeRecord[];
  tabName: string;
};

export function EmbeddedObjectList({
  entities,
  objectTypes = [],
  tabName,
}: EmbeddedObjectListProps) {
  if (!entities.length) {
    return (
      <PendingImplementation
        area={tabName}
        description={`${tabName} does not have objects to render yet.`}
        name="Object list"
        variant="workspace"
      />
    );
  }
  return (
    <div className="h-full min-h-0 w-full overflow-auto bg-[var(--app-bg-base)] p-6">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
        {entities.map((entity) => (
          <section
            className={cn(
              "min-h-[22rem] overflow-hidden rounded-lg border",
              "border-[var(--app-border-front)] bg-[var(--app-bg-front)]",
            )}
            key={JSON.stringify([entity.spaceId, entity.id])}
          >
            <ObjectDetailResolver
              entity={entity}
              objectType={objectTypes.find(
                (type) => type.id === entity.objectTypeId && type.spaceId === entity.spaceId,
              )}
              tabName={entity.title || tabName}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
