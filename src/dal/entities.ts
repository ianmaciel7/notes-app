import "server-only";
import { cache } from "react";
import { assertSpaceAccess, requireCurrentUser } from "./auth";
import type { EntityDTO } from "./dtos";
import { toEntityDTO } from "./dtos";
import { NotFoundError } from "./errors";
import { getServerStorage } from "./storage-adapter";

/**
 * Server-only DAL query to list entities in a given space.
 * Enforces tenant ownership checks before querying.
 */
export const listEntitiesDTO = cache(async (spaceId: string): Promise<readonly EntityDTO[]> => {
  const viewer = await requireCurrentUser();
  const storage = getServerStorage();
  const space = await storage.getSpace(spaceId);

  if (!space) {
    throw new NotFoundError(`Space "${spaceId}" does not exist.`);
  }

  assertSpaceAccess(viewer, space.accountId);
  const entities = await storage.listEntities(spaceId);
  return entities.map(toEntityDTO);
});

/**
 * Server-only DAL query to get a single entity by spaceId + entityId.
 */
export const getEntityDTO = cache(async (spaceId: string, entityId: string): Promise<EntityDTO> => {
  const viewer = await requireCurrentUser();
  const storage = getServerStorage();
  const space = await storage.getSpace(spaceId);

  if (!space) {
    throw new NotFoundError(`Space "${spaceId}" does not exist.`);
  }

  assertSpaceAccess(viewer, space.accountId);
  const entity = await storage.getEntity(spaceId, entityId);

  if (!entity) {
    throw new NotFoundError(`Entity "${entityId}" not found in space "${spaceId}".`);
  }

  return toEntityDTO(entity);
});
