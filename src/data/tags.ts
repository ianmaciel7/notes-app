import "server-only";

import { getFirestore } from "firebase-admin/firestore";
import { DomainError } from "@/domain/shared/domain-error";

export interface TagRecord {
  id: string;
  spaceId: string;
  displayName: string;
  normalizedName: string;
  schemaVersion: 1;
  createdAt: string;
}

export async function upsertTag(
  spaceId: string,
  displayName: string,
): Promise<TagRecord> {
  const trimmed = displayName.trim();
  if (trimmed.length === 0) {
    throw new DomainError("validation-failed", {
      message: "Tag name must not be empty.",
    });
  }

  const normalizedName = trimmed.normalize("NFC").toLowerCase();
  const tagId = `tag_${Buffer.from(normalizedName).toString("hex")}`;
  const db = getFirestore();
  const tagRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("tags")
    .doc(tagId);

  const snap = await tagRef.get();
  if (snap.exists) {
    return snap.data() as TagRecord;
  }

  const now = new Date().toISOString();
  const record: TagRecord = {
    id: tagId,
    spaceId,
    displayName: trimmed,
    normalizedName,
    schemaVersion: 1,
    createdAt: now,
  };

  await tagRef.set(record);
  return record;
}

export async function setObjectTags(
  spaceId: string,
  objectId: string,
  tagIds: string[],
): Promise<void> {
  const db = getFirestore();
  const objectTagsRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("objectTags");

  const existing = await objectTagsRef.where("objectId", "==", objectId).get();
  const batch = db.batch();
  for (const doc of existing.docs) {
    batch.delete(doc.ref);
  }

  const now = new Date().toISOString();
  for (const tagId of tagIds) {
    const linkId = `${objectId}_${tagId}`;
    const docRef = objectTagsRef.doc(linkId);
    batch.set(docRef, {
      id: linkId,
      spaceId,
      objectId,
      tagId,
      createdAt: now,
    });
  }

  await batch.commit();
}
