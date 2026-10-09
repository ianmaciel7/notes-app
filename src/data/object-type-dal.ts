import "server-only";

import { requireVerifiedUid } from "@/data/space-dal";
import { SpaceDeletionError } from "@/domain/space";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function assertValidIds(spaceId: string, objectTypeId: string): void {
  if (!UUID_V4_PATTERN.test(spaceId) || !UUID_V4_PATTERN.test(objectTypeId)) {
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
 * Deletes an Object Type after verifying the current identity owns its Space.
 * Objects-in-use validation is deferred because the objects collection does
 * not exist yet.
 */
export async function deleteObjectType(
  spaceId: string,
  objectTypeId: string,
): Promise<void> {
  const uid = await requireVerifiedUid();
  assertValidIds(spaceId, objectTypeId);

  const space = await getOwnedSpaceForVerifiedUid(uid, spaceId);
  const objectTypes = space.collection("objectTypes");
  const descendants = await objectTypes
    .where("parentTypeId", "==", objectTypeId)
    .limit(1)
    .get();

  if (!descendants.empty) {
    throw new SpaceDeletionError("has-descendants");
  }

  await getFirebaseAdminFirestore().recursiveDelete(
    objectTypes.doc(objectTypeId),
  );
}
