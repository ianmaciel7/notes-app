import "server-only";

import { getFirestore } from "firebase-admin/firestore";
import { getObjectRevision, listObjects } from "@/data/objects";
import { getOwnedSpace } from "@/data/spaces";
import type { ObjectLifecycle } from "@/domain/objects/object";
import { toPublicQuestion } from "@/domain/questions/grade-question";
import type {
  PublicQuestionDto,
  QuestionFormat,
  QuestionRevisionPayload,
} from "@/domain/questions/question";
import { DomainError } from "@/domain/shared/domain-error";

export interface QuestionSummaryDto {
  id: string;
  spaceId: string;
  title: string;
  format: QuestionFormat;
  lifecycle: ObjectLifecycle;
  latestRevisionId: string;
  publishedRevisionId?: string;
  tags: string[];
  updatedAt: string;
}

export interface QuestionAuthoringViewDto {
  id: string;
  spaceId: string;
  ownerId: string;
  title: string;
  lifecycle: ObjectLifecycle;
  latestRevisionId: string;
  publishedRevisionId?: string;
  draftPayload?: QuestionRevisionPayload;
  publishedPayload?: QuestionRevisionPayload;
  tags: string[];
  updatedAt: string;
}

export async function listQuestionSummaries(
  ownerId: string,
  spaceId: string,
): Promise<QuestionSummaryDto[]> {
  await getOwnedSpace(ownerId, spaceId);
  const objects = await listObjects(ownerId, spaceId, "question");
  const db = getFirestore();

  const tagsSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("objectTags")
    .get();

  const tagsByObject = new Map<string, string[]>();
  for (const doc of tagsSnap.docs) {
    const data = doc.data();
    const list = tagsByObject.get(data.objectId) ?? [];
    list.push(data.tagId);
    tagsByObject.set(data.objectId, list);
  }

  const summaries: QuestionSummaryDto[] = [];

  for (const obj of objects) {
    let format: QuestionFormat = "single-choice";
    if (obj.latestRevisionId) {
      try {
        const rev = await getObjectRevision<QuestionRevisionPayload>(
          ownerId,
          spaceId,
          obj.latestRevisionId,
        );
        if (rev.payload?.format) {
          format = rev.payload.format;
        }
      } catch {
        // use default fallback
      }
    }

    summaries.push({
      id: obj.id,
      spaceId,
      title: obj.title,
      format,
      lifecycle: obj.lifecycle,
      latestRevisionId: obj.latestRevisionId,
      publishedRevisionId: obj.publishedRevisionId,
      tags: tagsByObject.get(obj.id) ?? [],
      updatedAt: obj.updatedAt,
    });
  }

  return summaries;
}

export async function getQuestionAuthoringView(
  ownerId: string,
  spaceId: string,
  questionId: string,
): Promise<QuestionAuthoringViewDto> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  const objSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(questionId)
    .get();

  const objData = objSnap.data();
  if (!objSnap.exists || !objData || objData.ownerId !== ownerId) {
    throw new DomainError("forbidden");
  }

  let draftPayload: QuestionRevisionPayload | undefined;
  let publishedPayload: QuestionRevisionPayload | undefined;

  if (objData.latestRevisionId) {
    const rev = await getObjectRevision<QuestionRevisionPayload>(
      ownerId,
      spaceId,
      objData.latestRevisionId,
    );
    if (rev.publicationState === "draft") {
      draftPayload = rev.payload;
    } else {
      publishedPayload = rev.payload;
    }
  }

  if (
    objData.publishedRevisionId &&
    objData.publishedRevisionId !== objData.latestRevisionId
  ) {
    const pubRev = await getObjectRevision<QuestionRevisionPayload>(
      ownerId,
      spaceId,
      objData.publishedRevisionId,
    );
    publishedPayload = pubRev.payload;
  }

  const tagsSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("objectTags")
    .where("objectId", "==", questionId)
    .get();

  return {
    id: objData.id,
    spaceId,
    ownerId,
    title: objData.title,
    lifecycle: objData.lifecycle,
    latestRevisionId: objData.latestRevisionId,
    publishedRevisionId: objData.publishedRevisionId,
    draftPayload,
    publishedPayload,
    tags: tagsSnap.docs.map((d) => d.data().tagId as string),
    updatedAt: objData.updatedAt,
  };
}

export async function getPublicQuestion(
  ownerId: string,
  spaceId: string,
  questionId: string,
  revisionId?: string,
): Promise<PublicQuestionDto> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  const objSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(questionId)
    .get();

  const objData = objSnap.data();
  if (!objSnap.exists || !objData || objData.ownerId !== ownerId) {
    throw new DomainError("forbidden");
  }

  const targetRevisionId =
    revisionId ?? objData.publishedRevisionId ?? objData.latestRevisionId;
  if (!targetRevisionId) {
    throw new DomainError("not-found", {
      message: "No question revision available.",
    });
  }

  const rev = await getObjectRevision<QuestionRevisionPayload>(
    ownerId,
    spaceId,
    targetRevisionId,
  );

  return toPublicQuestion({
    ...rev.payload,
    questionId,
    questionRevisionId: targetRevisionId,
  });
}
