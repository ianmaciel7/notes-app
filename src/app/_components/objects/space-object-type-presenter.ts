import { getObjectTypeIconAppearance } from "@/app/_components/objects/object-icons";
import type { SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

type WorkspaceObjectTypeLabels = {
  plurals?: Partial<Record<string, string>>;
  singulars?: Partial<Record<string, string>>;
};

export function presentWorkspaceObjectType(
  record: SpaceObjectTypeRecord,
  count: number,
  labels: WorkspaceObjectTypeLabels = {},
) {
  const appearance = getObjectTypeIconAppearance({
    id: record.id,
    iconName: record.iconName,
    tone: record.tone,
  });

  return {
    id: record.id,
    label: labels.plurals?.[record.id] ?? record.pluralName,
    singularLabel: labels.singulars?.[record.id] ?? record.singularName,
    icon: appearance.icon,
    iconName: appearance.iconName,
    tone: appearance.tone,
    ownership: record.ownership,
    count,
  };
}
