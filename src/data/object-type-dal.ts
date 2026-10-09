import "server-only";

import { assertValidIds, getOwnedSpace } from "@/data/space-dal";
import { SpaceDeletionError } from "@/domain/space";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

/**
 * Deletes an Object Type after checking the verified uid owns its Space.
 * Objects-in-use validation is deferred because the objects collection does
 * not exist yet.
 */
export async function deleteObjectType(
  uid: string,
  spaceId: string,
  objectTypeId: string,
): Promise<void> {
  assertValidIds(uid, spaceId, objectTypeId);

  const space = await getOwnedSpace(uid, spaceId);
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
