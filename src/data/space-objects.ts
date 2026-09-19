import "server-only";

import type {
  SpaceObjectRecord,
  SpaceObjectRelationRecord,
  SpaceObjectTypeId,
} from "@/domain/catalog/space-object";
import { adminDb } from "@/lib/firebase/admin";

function readObject(
  spaceId: string,
  id: string,
  data: FirebaseFirestore.DocumentData,
): SpaceObjectRecord {
  return {
    spaceId,
    id,
    objectTypeId: String(data.objectTypeId ?? "page"),
    title: String(data.title ?? "Untitled"),
    properties:
      data.properties && typeof data.properties === "object"
        ? (data.properties as Record<string, unknown>)
        : {},
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function readRelation(
  spaceId: string,
  id: string,
  data: FirebaseFirestore.DocumentData,
): SpaceObjectRelationRecord {
  return {
    spaceId,
    id,
    relationType: String(data.relationType ?? "includes-object"),
    sourceId: String(data.sourceId ?? ""),
    targetId: String(data.targetId ?? ""),
    properties:
      data.properties && typeof data.properties === "object"
        ? (data.properties as Record<string, unknown>)
        : {},
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function getSpaceObjects(
  spaceId: string,
  objectTypeId?: SpaceObjectTypeId,
): Promise<SpaceObjectRecord[]> {
  let query: FirebaseFirestore.Query = adminDb
    .collection("spaces")
    .doc(spaceId)
    .collection("objects");

  if (objectTypeId) {
    query = query.where("objectTypeId", "==", objectTypeId);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => readObject(spaceId, doc.id, doc.data()));
}

export async function getSpaceObject(
  spaceId: string,
  objectId: string,
): Promise<SpaceObjectRecord | null> {
  const snapshot = await adminDb
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(objectId)
    .get();

  return snapshot.exists && snapshot.data()
    ? readObject(
        spaceId,
        snapshot.id,
        snapshot.data() as FirebaseFirestore.DocumentData,
      )
    : null;
}

export async function getSpaceRelations(
  spaceId: string,
  sourceId: string,
  relationType?: string,
): Promise<SpaceObjectRelationRecord[]> {
  let query: FirebaseFirestore.Query = adminDb
    .collection("spaces")
    .doc(spaceId)
    .collection("relations")
    .where("sourceId", "==", sourceId);

  if (relationType) {
    query = query.where("relationType", "==", relationType);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => readRelation(spaceId, doc.id, doc.data()));
}
