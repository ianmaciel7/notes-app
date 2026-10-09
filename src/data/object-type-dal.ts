import "server-only";

import { requireOwnedSpaceRef } from "@/data/current-identity-dal";
import {
  assertValidSpaceDeletionIds,
  SpaceDeletionError,
} from "@/domain/space";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

/**
 * Deletes an Object Type after verifying the current identity owns its Space.
 * Objects-in-use validation is deferred because the objects collection does
 * not exist yet.
 */
export async function deleteObjectType(
  spaceId: string,
  objectTypeId: string,
): Promise<void> {
  const space = await requireOwnedSpaceRef(spaceId);
  assertValidSpaceDeletionIds(objectTypeId);
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
