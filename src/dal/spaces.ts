import "server-only";
import { cache } from "react";
import { validateCreateSpaceInput } from "@/lib/validations/space";
import type { CreateSpaceInput } from "@/types/space";
import { assertSpaceAccess, requireCurrentUser } from "./auth";
import type { SpaceDTO } from "./dtos";
import { toSpaceDTO } from "./dtos";
import { NotFoundError, ValidationError } from "./errors";
import { getServerStorage } from "./storage-adapter";

/**
 * Server-only DAL function to retrieve all spaces accessible by current session.
 * Memoized per request using React cache().
 */
export const getSpacesDTO = cache(async (): Promise<readonly SpaceDTO[]> => {
  const viewer = await requireCurrentUser();
  const storage = getServerStorage();
  const records = await storage.listSpaces(viewer.accountId);
  return records.map((record) => toSpaceDTO(record, viewer.accountId));
});

/**
 * Server-only DAL function to retrieve a single space by ID with IDOR protection.
 * Memoized per request using React cache().
 */
export const getSpaceDTO = cache(async (spaceId: string): Promise<SpaceDTO> => {
  const viewer = await requireCurrentUser();
  const storage = getServerStorage();
  const record = await storage.getSpace(spaceId);

  if (!record) {
    throw new NotFoundError(`Space "${spaceId}" does not exist.`);
  }

  assertSpaceAccess(viewer, record.accountId);
  return toSpaceDTO(record, viewer.accountId);
});

/**
 * Server-only DAL mutation to create a new space for the authenticated user.
 */
export async function createSpace(input: CreateSpaceInput): Promise<SpaceDTO> {
  const viewer = await requireCurrentUser();
  const validation = validateCreateSpaceInput(input);
  if (!validation.success || !validation.data) {
    throw new ValidationError(validation.error ?? "Invalid space payload.");
  }

  const storage = getServerStorage();
  const record = await storage.createSpace(viewer.accountId, validation.data);
  return toSpaceDTO(record, viewer.accountId);
}

/**
 * Server-only DAL mutation to delete a space with authorization checks.
 */
export async function deleteSpace(spaceId: string): Promise<{ fallbackSpaceId: string }> {
  const viewer = await requireCurrentUser();
  const storage = getServerStorage();
  const existing = await storage.getSpace(spaceId);

  if (!existing) {
    throw new NotFoundError(`Space "${spaceId}" not found.`);
  }

  assertSpaceAccess(viewer, existing.accountId);
  return storage.deleteSpace(viewer.accountId, spaceId);
}
