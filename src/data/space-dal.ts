import "server-only";

import { SpaceDeletionError } from "@/domain/space";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { getCurrentIdentity } from "@/lib/firebase/identity";

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function hasValidUid(uid: string): boolean {
  return typeof uid === "string" && uid.trim().length > 0 && !uid.includes("/");
}

/**
 * The Data Access Layer authenticates its own caller: no function here takes a
 * uid from its caller, so an unverified uid cannot reach the Admin SDK.
 */
export async function requireVerifiedUid(): Promise<string> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    throw new SpaceDeletionError("unauthenticated");
  }

  return identity.uid;
}

export function assertValidIds(
  uid: string,
  spaceId: string,
  objectTypeId?: string,
): void {
  if (
    !hasValidUid(uid) ||
    !UUID_V4_PATTERN.test(spaceId) ||
    (objectTypeId !== undefined && !UUID_V4_PATTERN.test(objectTypeId))
  ) {
    throw new SpaceDeletionError("invalid-id");
  }
}

export async function getOwnedSpace(uid: string, spaceId: string) {
  const space = getFirebaseAdminFirestore()
    .collection("users")
    .doc(uid)
    .collection("spaces")
    .doc(spaceId);
  const snapshot = await space.get();

  if (!snapshot.exists) {
    throw new SpaceDeletionError("not-found");
  }

  if (snapshot.data()?.ownerId !== uid) {
    throw new SpaceDeletionError("forbidden");
  }

  return space;
}

/**
 * Deletes a Space and every nested document. Verifies the current identity,
 * then that this identity owns the Space.
 */
export async function deleteSpaceTree(spaceId: string): Promise<void> {
  const uid = await requireVerifiedUid();
  assertValidIds(uid, spaceId);

  const space = await getOwnedSpace(uid, spaceId);
  await getFirebaseAdminFirestore().recursiveDelete(space);
}
