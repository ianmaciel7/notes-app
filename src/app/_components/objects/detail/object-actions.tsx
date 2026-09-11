import { ObjectEditor } from "@/app/_components/objects/detail/object-editor";
import { ObjectTrashButton } from "@/app/_components/objects/detail/object-trash-button";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

export function ObjectActions({ entity }: { entity: SpaceEntityRecord }) {
  return (
    <div data-slot="object-actions" className="flex flex-wrap items-center gap-2">
      <ObjectEditor entity={entity} />
      <ObjectTrashButton entity={entity} />
    </div>
  );
}
