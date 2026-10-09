"use server";

import { deleteObjectType } from "@/data/object-type-dal";
import { deleteSpaceTree } from "@/data/space-dal";
import { SpaceDeletionError, type SpaceDeletionResult } from "@/domain/space";

// Thin entry points: they validate argument types and delegate. The Data
// Access Layer authenticates and authorizes (Next.js data security guide).

function invalidResult(): SpaceDeletionResult {
  return { ok: false, code: "invalid-id" };
}

async function toResult(
  operation: () => Promise<void>,
): Promise<SpaceDeletionResult> {
  try {
    await operation();
    return { ok: true };
  } catch (error) {
    if (error instanceof SpaceDeletionError) {
      return { ok: false, code: error.code };
    }
    throw error;
  }
}

export async function deleteSpaceAction(
  spaceId: string,
): Promise<SpaceDeletionResult> {
  if (typeof spaceId !== "string") {
    return invalidResult();
  }

  return toResult(() => deleteSpaceTree(spaceId));
}

export async function deleteObjectTypeAction(
  spaceId: string,
  objectTypeId: string,
): Promise<SpaceDeletionResult> {
  if (typeof spaceId !== "string" || typeof objectTypeId !== "string") {
    return invalidResult();
  }

  return toResult(() => deleteObjectType(spaceId, objectTypeId));
}
