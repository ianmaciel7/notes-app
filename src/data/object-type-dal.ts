import "server-only";

import {
  assertValidSpaceDeletionIds,
  SpaceDeletionError,
} from "@/domain/space";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import {
  getOwnedSpaceForVerifiedUid,
  requireVerifiedUid,
} from "@/lib/firebase/space-ownership";

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
  assertValidSpaceDeletionIds(spaceId, objectTypeId);

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
