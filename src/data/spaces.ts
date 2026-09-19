import "server-only";
import { getFirestore } from "firebase-admin/firestore";
import { DomainError } from "@/domain/shared/domain-error";

export interface SpaceRecord {
  id: string;
  ownerId: string;
  name: string;
  visibility: "private";
  schemaVersion: 1;
  createdAt: string;
  updatedAt: string;
}

function validateOwnerId(ownerId: string): void {
  if (!ownerId || ownerId.trim().length === 0) {
    throw new DomainError("validation-failed", {
      message: "ownerId must not be empty.",
    });
  }
}

function validateName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new DomainError("validation-failed", {
      message: "Space name must not be empty.",
    });
  }
}

function docToRecord(
  id: string,
  data: FirebaseFirestore.DocumentData,
): SpaceRecord {
  return {
    id,
    ownerId: data.ownerId,
    name: data.name,
    visibility: "private",
    schemaVersion: 1,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function createPrivateSpace(
  ownerId: string,
  name: string,
): Promise<SpaceRecord> {
  validateOwnerId(ownerId);
  validateName(name);

  const db = getFirestore();
  const now = new Date().toISOString();

  const ref = db.collection("spaces").doc();
  const record: Omit<SpaceRecord, "id"> = {
    ownerId,
    name: name.trim(),
    visibility: "private",
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
  };

  await ref.set(record);

  return { id: ref.id, ...record };
}

export async function getOwnedSpace(
  requesterId: string,
  spaceId: string,
): Promise<SpaceRecord> {
  const db = getFirestore();
  const snap = await db.collection("spaces").doc(spaceId).get();

  // Constant-time info hiding: treat missing and forbidden the same way
  const data = snap.data();
  if (!snap.exists || !data || data.ownerId !== requesterId) {
    throw new DomainError("forbidden");
  }

  return docToRecord(snap.id, data);
}

export async function listOwnedSpaces(ownerId: string): Promise<SpaceRecord[]> {
  const db = getFirestore();
  const snap = await db
    .collection("spaces")
    .where("ownerId", "==", ownerId)
    .get();

  return snap.docs.map((d) => docToRecord(d.id, d.data()));
}

export async function renameOwnedSpace(
  requesterId: string,
  spaceId: string,
  name: string,
): Promise<SpaceRecord> {
  validateName(name);

  const db = getFirestore();
  const ref = db.collection("spaces").doc(spaceId);
  const snap = await ref.get();

  // Constant-time info hiding: treat missing and forbidden the same way
  const data = snap.data();
  if (!snap.exists || !data || data.ownerId !== requesterId) {
    throw new DomainError("forbidden");
  }

  const now = new Date().toISOString();
  await ref.update({ name: name.trim(), updatedAt: now });

  return docToRecord(ref.id, {
    ...data,
    name: name.trim(),
    updatedAt: now,
  });
}
