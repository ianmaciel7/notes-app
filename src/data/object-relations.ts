import "server-only";

import { getFirestore } from "firebase-admin/firestore";

import { getOwnedSpace } from "@/data/spaces";
import { DomainError } from "@/domain/shared/domain-error";

export interface ExamQuestionRelationRef {
  questionId: string;
  questionRevisionId: string;
  points: number;
}

export interface CollectionObjectRelationRecord {
  id: string;
  sourceObjectId: string;
  targetObjectId: string;
  position: number;
}

export async function getCollectionObjectRelations(
  spaceId: string,
): Promise<CollectionObjectRelationRecord[]> {
  const db = getFirestore();
  const relationsSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("relations")
    .where("type", "==", "collection-object")
    .get();

  return relationsSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      sourceObjectId: String(data.sourceObjectId ?? ""),
      targetObjectId: String(data.targetObjectId ?? ""),
      position: Number(data.position ?? 0),
    };
  });
}

export async function replaceExamQuestionRelations(
  ownerId: string,
  spaceId: string,
  examObjectId: string,
  questionRefs: ExamQuestionRelationRef[],
): Promise<void> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  const objectsRef = db.collection("spaces").doc(spaceId).collection("objects");
  const examSnap = await objectsRef.doc(examObjectId).get();

  if (!examSnap.exists || examSnap.data()?.ownerId !== ownerId) {
    throw new DomainError("forbidden");
  }

  for (const reference of questionRefs) {
    const questionSnap = await objectsRef.doc(reference.questionId).get();

    if (!questionSnap.exists || questionSnap.data()?.ownerId !== ownerId) {
      throw new DomainError("validation-failed", {
        message: `Target question ${reference.questionId} does not belong to this space.`,
      });
    }
  }

  const relationsRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("relations");
  const existing = await relationsRef
    .where("sourceObjectId", "==", examObjectId)
    .where("type", "==", "exam-question")
    .get();
  const batch = db.batch();

  for (const document of existing.docs) {
    batch.delete(document.ref);
  }

  const now = new Date().toISOString();
  questionRefs.forEach((reference, position) => {
    const relationId = `${examObjectId}_${reference.questionId}`;
    batch.set(relationsRef.doc(relationId), {
      id: relationId,
      spaceId,
      type: "exam-question",
      sourceObjectId: examObjectId,
      targetObjectId: reference.questionId,
      targetRevisionId: reference.questionRevisionId,
      position,
      points: reference.points,
      schemaVersion: 1,
      createdAt: now,
      updatedAt: now,
    });
  });

  await batch.commit();
}

export async function replaceCollectionMembers(
  ownerId: string,
  spaceId: string,
  collectionObjectId: string,
  memberObjectIds: string[],
): Promise<void> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  const objectsRef = db.collection("spaces").doc(spaceId).collection("objects");
  const collectionSnap = await objectsRef.doc(collectionObjectId).get();

  if (!collectionSnap.exists || collectionSnap.data()?.ownerId !== ownerId) {
    throw new DomainError("forbidden");
  }

  for (const memberId of memberObjectIds) {
    const memberSnap = await objectsRef.doc(memberId).get();

    if (!memberSnap.exists || memberSnap.data()?.ownerId !== ownerId) {
      throw new DomainError("validation-failed", {
        message: `Collection member ${memberId} does not belong to this space.`,
      });
    }
  }

  const relationsRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("relations");
  const existing = await relationsRef
    .where("sourceObjectId", "==", collectionObjectId)
    .where("type", "==", "collection-object")
    .get();
  const batch = db.batch();

  for (const document of existing.docs) {
    batch.delete(document.ref);
  }

  const now = new Date().toISOString();
  memberObjectIds.forEach((memberId, position) => {
    const relationId = `${collectionObjectId}_${memberId}`;
    batch.set(relationsRef.doc(relationId), {
      id: relationId,
      spaceId,
      type: "collection-object",
      sourceObjectId: collectionObjectId,
      targetObjectId: memberId,
      position,
      schemaVersion: 1,
      createdAt: now,
      updatedAt: now,
    });
  });

  await batch.commit();
}

export async function getCollectionMemberIds(
  ownerId: string,
  spaceId: string,
  collectionObjectId: string,
): Promise<string[]> {
  await getOwnedSpace(ownerId, spaceId);
  const snapshot = await getFirestore()
    .collection("spaces")
    .doc(spaceId)
    .collection("relations")
    .where("sourceObjectId", "==", collectionObjectId)
    .where("type", "==", "collection-object")
    .get();

  return snapshot.docs
    .map((document) => {
      const data = document.data();
      return {
        targetObjectId: String(data.targetObjectId ?? ""),
        position: Number(data.position ?? 0),
      };
    })
    .sort((left, right) => left.position - right.position)
    .map((relation) => relation.targetObjectId);
}
