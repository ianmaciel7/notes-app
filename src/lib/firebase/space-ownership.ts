import "server-only";

import { assertValidSpaceOwnerId, SpaceDeletionError } from "@/domain/space";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { getCurrentIdentity } from "@/lib/firebase/identity";

/** Resolves the current authenticated caller to a safe owner-scoped uid. */
export async function requireVerifiedUid(): Promise<string> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    throw new SpaceDeletionError("unauthenticated");
  }

  assertValidSpaceOwnerId(identity.uid);
  return identity.uid;
}

/** Gets a Space reference only when the verified uid owns the Space. */
export async function getOwnedSpaceForVerifiedUid(
  uid: string,
  spaceId: string,
) {
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
