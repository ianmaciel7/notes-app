import "server-only";

import { getFirestore } from "firebase-admin/firestore";
import { getOwnedSpace } from "@/data/spaces";
import { DomainError } from "@/domain/shared/domain-error";

export interface ExamQuestionRelationRef {
  questionId: string;
  questionRevisionId: string;
  points: number;
}

export async function replaceExamQuestionRelations(
  ownerId: string,
  spaceId: string,
  examObjectId: string,
  questionRefs: ExamQuestionRelationRef[],
): Promise<void> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();

  const examSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(examObjectId)
    .get();

  if (!examSnap.exists || examSnap.data()?.ownerId !== ownerId) {
    throw new DomainError("forbidden");
  }

  // Validate all referenced questions exist and belong to the same space and owner
  for (const ref of questionRefs) {
    const qSnap = await db
      .collection("spaces")
      .doc(spaceId)
      .collection("objects")
      .doc(ref.questionId)
      .get();

    if (!qSnap.exists || qSnap.data()?.ownerId !== ownerId) {
      throw new DomainError("validation-failed", {
        message: `Target question ${ref.questionId} does not belong to this space.`,
      });
    }
  }

  const relationsRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("relations");

  // Fetch existing relations to delete
  const existing = await relationsRef
    .where("sourceObjectId", "==", examObjectId)
    .where("type", "==", "exam-question")
    .get();

  const batch = db.batch();
  for (const doc of existing.docs) {
    batch.delete(doc.ref);
  }

  const now = new Date().toISOString();
  questionRefs.forEach((ref, index) => {
    const relationId = `${examObjectId}_${ref.questionId}`;
    const docRef = relationsRef.doc(relationId);
    batch.set(docRef, {
      id: relationId,
      spaceId,
      type: "exam-question",
      sourceObjectId: examObjectId,
      targetObjectId: ref.questionId,
      targetRevisionId: ref.questionRevisionId,
      position: index,
      points: ref.points,
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

  const colSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(collectionObjectId)
    .get();

  if (!colSnap.exists || colSnap.data()?.ownerId !== ownerId) {
    throw new DomainError("forbidden");
  }

  for (const memberId of memberObjectIds) {
    const mSnap = await db
      .collection("spaces")
      .doc(spaceId)
      .collection("objects")
      .doc(memberId)
      .get();

    if (!mSnap.exists || mSnap.data()?.ownerId !== ownerId) {
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
  for (const doc of existing.docs) {
    batch.delete(doc.ref);
  }

  const now = new Date().toISOString();
  memberObjectIds.forEach((memberId, index) => {
    const relationId = `${collectionObjectId}_${memberId}`;
    const docRef = relationsRef.doc(relationId);
    batch.set(docRef, {
      id: relationId,
      spaceId,
      type: "collection-object",
      sourceObjectId: collectionObjectId,
      targetObjectId: memberId,
      position: index,
      schemaVersion: 1,
      createdAt: now,
      updatedAt: now,
    });
  });

  await batch.commit();
}
