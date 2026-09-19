import "server-only";

import { getFirestore } from "firebase-admin/firestore";
import {
  createObjectDraft,
  getObjectRevision,
  saveDraftRevision,
} from "@/data/objects";
import { getOwnedSpace } from "@/data/spaces";
import {
  type ExamRevisionPayload,
  validateExamForPublication,
} from "@/domain/exams/exam";
import type {
  ObjectLifecycle,
  ObjectRecord,
  ObjectRevision,
} from "@/domain/objects/object";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import { DomainError } from "@/domain/shared/domain-error";

export interface ExamAuthoringViewDto {
  id: string;
  spaceId: string;
  ownerId: string;
  title: string;
  lifecycle: ObjectLifecycle;
  latestRevisionId: string;
  publishedRevisionId?: string;
  draftPayload?: ExamRevisionPayload;
  publishedPayload?: ExamRevisionPayload;
  updatedAt: string;
}

export interface PublishedExamViewDto {
  id: string;
  spaceId: string;
  title: string;
  revisionId: string;
  payload: ExamRevisionPayload;
  updatedAt: string;
}

export async function createExamDraft(
  ownerId: string,
  spaceId: string,
  title: string,
): Promise<ObjectRecord> {
  return await createObjectDraft(ownerId, spaceId, "exam", title);
}

export async function saveExamDraft(
  ownerId: string,
  spaceId: string,
  examId: string,
  payload: ExamRevisionPayload,
): Promise<ObjectRevision<ExamRevisionPayload>> {
  return await saveDraftRevision(ownerId, spaceId, examId, payload);
}

export async function publishExam(
  ownerId: string,
  spaceId: string,
  examId: string,
): Promise<ObjectRevision<ExamRevisionPayload>> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  const examRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(examId);

  return await db.runTransaction(async (transaction) => {
    const examSnap = await transaction.get(examRef);
    const examData = examSnap.data() as ObjectRecord | undefined;
    if (!examSnap.exists || !examData || examData.ownerId !== ownerId) {
      throw new DomainError("forbidden");
    }

    if (!examData.latestRevisionId) {
      throw new DomainError("validation-failed", {
        message: "Cannot publish an exam without revisions.",
      });
    }

    const draftRevRef = examRef
      .collection("revisions")
      .doc(examData.latestRevisionId);
    const draftRevSnap = await transaction.get(draftRevRef);
    if (!draftRevSnap.exists) {
      throw new DomainError("not-found", {
        message: "Latest draft revision not found.",
      });
    }

    const draftRevision =
      draftRevSnap.data() as ObjectRevision<ExamRevisionPayload>;
    const payload = draftRevision.payload;

    // Resolve each question revision
    const resolvedQuestions: Array<
      ObjectRevision<QuestionRevisionPayload> & { spaceId: string }
    > = [];

    for (const ref of payload.questions) {
      const qRef = db
        .collection("spaces")
        .doc(spaceId)
        .collection("objects")
        .doc(ref.questionId);
      const qSnap = await transaction.get(qRef);
      const qData = qSnap.data();

      if (!qSnap.exists || !qData || qData.ownerId !== ownerId) {
        throw new DomainError("validation-failed", {
          message: `Question ${ref.questionId} not found in this space.`,
        });
      }

      const revRef = qRef.collection("revisions").doc(ref.questionRevisionId);
      const revSnap = await transaction.get(revRef);
      if (!revSnap.exists) {
        throw new DomainError("validation-failed", {
          message: `Question revision ${ref.questionRevisionId} not found.`,
        });
      }

      const revData = revSnap.data() as ObjectRevision<QuestionRevisionPayload>;
      resolvedQuestions.push({
        ...revData,
        spaceId,
      });
    }

    // Validate using domain policy
    validateExamForPublication(payload, spaceId, resolvedQuestions);

    // Allocate version + 1
    const revsRef = examRef.collection("revisions");
    const latestRevs = await transaction.get(
      revsRef.orderBy("version", "desc").limit(1),
    );
    const lastVersion = latestRevs.empty
      ? 0
      : (latestRevs.docs[0].data().version as number);
    const newVersion = lastVersion + 1;

    const pubRevId = `${examId}_rev_${crypto.randomUUID()}`;
    const pubRevRef = revsRef.doc(pubRevId);
    const now = new Date().toISOString();

    const publishedRevision: ObjectRevision<ExamRevisionPayload> = {
      id: pubRevId,
      objectId: examId,
      objectType: "exam",
      version: newVersion,
      publicationState: "published",
      payload,
      schemaVersion: 1,
      createdBy: ownerId,
      createdAt: now,
    };

    transaction.set(pubRevRef, publishedRevision);
    transaction.update(examRef, {
      lifecycle: "published",
      publishedRevisionId: pubRevId,
      latestRevisionId: pubRevId,
      updatedAt: now,
    });

    return publishedRevision;
  });
}

export async function getExamAuthoringView(
  ownerId: string,
  spaceId: string,
  examId: string,
): Promise<ExamAuthoringViewDto> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  const examRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(examId);

  const snap = await examRef.get();
  const data = snap.data() as ObjectRecord | undefined;
  if (!snap.exists || !data || data.ownerId !== ownerId) {
    throw new DomainError("forbidden");
  }

  let draftPayload: ExamRevisionPayload | undefined;
  let publishedPayload: ExamRevisionPayload | undefined;

  if (data.latestRevisionId) {
    const rev = await getObjectRevision<ExamRevisionPayload>(
      ownerId,
      spaceId,
      data.latestRevisionId,
    );
    if (rev.publicationState === "draft") {
      draftPayload = rev.payload;
    } else {
      publishedPayload = rev.payload;
    }
  }

  if (
    data.publishedRevisionId &&
    data.publishedRevisionId !== data.latestRevisionId
  ) {
    const pubRev = await getObjectRevision<ExamRevisionPayload>(
      ownerId,
      spaceId,
      data.publishedRevisionId,
    );
    publishedPayload = pubRev.payload;
  }

  return {
    id: data.id,
    spaceId,
    ownerId,
    title: data.title,
    lifecycle: data.lifecycle,
    latestRevisionId: data.latestRevisionId,
    publishedRevisionId: data.publishedRevisionId,
    draftPayload,
    publishedPayload,
    updatedAt: data.updatedAt,
  };
}

export async function getPublishedExamView(
  ownerId: string,
  spaceId: string,
  examId: string,
): Promise<PublishedExamViewDto> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  const examRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(examId);

  const snap = await examRef.get();
  const data = snap.data() as ObjectRecord | undefined;
  if (!snap.exists || !data || data.ownerId !== ownerId) {
    throw new DomainError("forbidden");
  }

  if (!data.publishedRevisionId) {
    throw new DomainError("not-found", {
      message: "No published revision for this exam.",
    });
  }

  const pubRev = await getObjectRevision<ExamRevisionPayload>(
    ownerId,
    spaceId,
    data.publishedRevisionId,
  );

  return {
    id: data.id,
    spaceId,
    title: data.title,
    revisionId: data.publishedRevisionId,
    payload: pubRev.payload,
    updatedAt: data.updatedAt,
  };
}
