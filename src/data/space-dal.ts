import "server-only";

import { assertValidSpaceDeletionIds } from "@/domain/space";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import {
  getOwnedSpaceForVerifiedUid,
  requireVerifiedUid,
} from "@/lib/firebase/space-ownership";

/**
 * Deletes a Space and every nested document. Verifies the current identity,
 * then that this identity owns the Space.
 */
export async function deleteSpaceTree(spaceId: string): Promise<void> {
  const uid = await requireVerifiedUid();
  assertValidSpaceDeletionIds(spaceId);

  const space = await getOwnedSpaceForVerifiedUid(uid, spaceId);
  await getFirebaseAdminFirestore().recursiveDelete(space);
}
