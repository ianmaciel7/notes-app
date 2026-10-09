import "server-only";

import { SpaceDeletionError } from "@/domain/space";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function hasValidUid(uid: string): boolean {
  return typeof uid === "string" && uid.trim().length > 0 && !uid.includes("/");
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
 * Deletes a Space and every nested document. The caller must first verify the
 * uid's identity; this trusted-server boundary authorizes its Space ownership.
 */
export async function deleteSpaceTree(
  uid: string,
  spaceId: string,
): Promise<void> {
  assertValidIds(uid, spaceId);

  const space = await getOwnedSpace(uid, spaceId);
  await getFirebaseAdminFirestore().recursiveDelete(space);
}
