import "server-only";

import { requireOwnedSpaceRef } from "@/data/current-identity-dal";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

/**
 * Deletes a Space and every nested document. Verifies the current identity,
 * then that this identity owns the Space.
 */
export async function deleteSpaceTree(spaceId: string): Promise<void> {
  const space = await requireOwnedSpaceRef(spaceId);
  await getFirebaseAdminFirestore().recursiveDelete(space);
}
