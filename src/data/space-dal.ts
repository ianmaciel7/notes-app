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

  if (!hasValidUid(identity.uid)) {
    throw new SpaceDeletionError("invalid-id");
  }

  return identity.uid;
}

function assertValidSpaceId(spaceId: string): void {
  if (!UUID_V4_PATTERN.test(spaceId)) {
    throw new SpaceDeletionError("invalid-id");
  }
}

async function getOwnedSpaceForVerifiedUid(uid: string, spaceId: string) {
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
 * Gets a Space only when the authenticated caller owns it.
 */
export async function getOwnedSpace(spaceId: string) {
  const uid = await requireVerifiedUid();
  assertValidSpaceId(spaceId);

  return getOwnedSpaceForVerifiedUid(uid, spaceId);
}

/**
 * Deletes a Space and every nested document. Verifies the current identity,
 * then that this identity owns the Space.
 */
export async function deleteSpaceTree(spaceId: string): Promise<void> {
  const space = await getOwnedSpace(spaceId);
  await getFirebaseAdminFirestore().recursiveDelete(space);
}
