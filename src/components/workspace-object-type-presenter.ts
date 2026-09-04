import { objectTypeDefinitionById } from "@/components/object-icons";
import type { SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

export function presentWorkspaceObjectType(record: SpaceObjectTypeRecord, count: number) {
  const definition = objectTypeDefinitionById[record.iconName];
  if (!definition) throw new Error(`Unknown object icon: ${record.iconName}`);

  return {
    id: record.id,
    label: record.pluralName,
    singularLabel: record.singularName,
    icon: definition.icon,
    iconName: record.iconName,
    tone: record.tone,
    ownership: record.ownership,
    count,
  };
}
