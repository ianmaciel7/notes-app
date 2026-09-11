import { db } from "@/lib/db";
import {
  copyWorkspaceText,
  entityToMarkdown,
  exportWorkspaceObjects,
} from "@/lib/spaces/object-transfer";
import { duplicateSpaceCollection } from "@/lib/spaces/space-collection-mutations";
import { createSpaceRepository } from "@/lib/spaces/space-repository";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

export function workspaceActionError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function copySidebarText(text: string, showMessage: (text: string) => void, copied: string) {
  void copyWorkspaceText(text)
    .then(() => showMessage(copied))
    .catch((error: unknown) => showMessage(workspaceActionError(error)));
}

export function collectionMembers(
  entities: readonly SpaceEntityRecord[],
  scope: { spaceId: string; id: string },
) {
  return entities.filter(
    (entity) => entity.spaceId === scope.spaceId && entity.collections?.includes(scope.id),
  );
}

export async function runObjectMenuAction(action: string, entity: SpaceEntityRecord) {
  switch (action) {
    case "copy-markdown":
      await copyWorkspaceText(entityToMarkdown(entity));
      return "copied";
    case "copy-reference":
      await copyWorkspaceText(`[[${entity.title}]]`);
      return "copied";
    case "export":
      exportWorkspaceObjects(entity.title, [entity]);
      return "exported";
    case "open":
      return "open";
    case "delete":
      await createSpaceRepository(db).trashEntity(entity.spaceId, entity.id);
      return "deleted";
    default:
      return "unhandled";
  }
}

export function duplicateWorkspaceCollection(spaceId: string, id: string) {
  return duplicateSpaceCollection(db, spaceId, id);
}
