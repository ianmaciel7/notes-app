import "server-only";

import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export type SpaceDeletionErrorCode =
  | "forbidden"
  | "has-descendants"
  | "invalid-id"
  | "not-found";

export class SpaceDeletionError extends Error {
  readonly code: SpaceDeletionErrorCode;

  constructor(code: SpaceDeletionErrorCode) {
    super(`Space deletion failed: ${code}.`);
    this.name = "SpaceDeletionError";
    this.code = code;
  }
}

function hasValidUid(uid: string): boolean {
  return typeof uid === "string" && uid.trim().length > 0 && !uid.includes("/");
}

function assertValidIds(
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

async function getOwnedSpace(uid: string, spaceId: string) {
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
