import "server-only";

import {
  assertValidSpaceDeletionIds,
  assertValidSpaceOwnerId,
  SpaceDeletionError,
} from "@/domain/space";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { getCurrentIdentity } from "@/lib/firebase/identity";

/**
 * Authenticates the caller and returns the Space reference only when the
 * verified identity owns it. Shared by the Space and Object Type DAL files.
 */
export async function requireOwnedSpaceRef(spaceId: string) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    throw new SpaceDeletionError("unauthenticated");
  }

  const uid = identity.uid;
  assertValidSpaceOwnerId(uid);
  assertValidSpaceDeletionIds(spaceId);

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
