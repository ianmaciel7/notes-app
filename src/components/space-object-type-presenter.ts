import { getObjectTypeIconAppearance } from "@/components/object-icons";
import type { SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

export function presentWorkspaceObjectType(record: SpaceObjectTypeRecord, count: number) {
  const appearance = getObjectTypeIconAppearance({
    id: record.id,
    iconName: record.iconName,
    tone: record.tone,
  });

  return {
    id: record.id,
    label: record.pluralName,
    singularLabel: record.singularName,
    icon: appearance.icon,
    iconName: appearance.iconName,
    tone: appearance.tone,
    ownership: record.ownership,
    count,
  };
}
