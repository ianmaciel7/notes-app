"use server";

import { deleteObjectType } from "@/data/object-type-dal";
import { deleteSpaceTree } from "@/data/space-dal";
import {
  SpaceDeletionError,
  type SpaceDeletionErrorCode,
} from "@/domain/space";
import { getCurrentIdentity } from "@/lib/firebase/identity";

export type SpaceDeletionActionResult =
  | { ok: true }
  | { ok: false; code: SpaceDeletionErrorCode | "unauthenticated" };

function invalidResult(): SpaceDeletionActionResult {
  return { ok: false, code: "invalid-id" };
}

async function withVerifiedIdentity(
  operation: (uid: string) => Promise<void>,
): Promise<SpaceDeletionActionResult> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return { ok: false, code: "unauthenticated" };
  }

  try {
    await operation(identity.uid);
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
): Promise<SpaceDeletionActionResult> {
  if (typeof spaceId !== "string") {
    return invalidResult();
  }

  return withVerifiedIdentity((uid) => deleteSpaceTree(uid, spaceId));
}

export async function deleteObjectTypeAction(
  spaceId: string,
  objectTypeId: string,
): Promise<SpaceDeletionActionResult> {
  if (typeof spaceId !== "string" || typeof objectTypeId !== "string") {
    return invalidResult();
  }

  return withVerifiedIdentity((uid) =>
    deleteObjectType(uid, spaceId, objectTypeId),
  );
}
