import "server-only";

import { getFirestore } from "firebase-admin/firestore";
import { getPublishedExamView } from "@/data/exam-authoring";
import { getObjectRevision } from "@/data/objects";
import { getOwnedSpace } from "@/data/spaces";
import { ensureQuestionMemory } from "@/data/study";
import {
  type AttemptItemRecord,
  type AttemptRecord,
  type AttemptScoreResult,
  scoreAttempt,
  validateAttemptCompletion,
} from "@/domain/attempts/attempt";

export type { AttemptRecord, AttemptScoreResult, AttemptItemRecord };

import {
  gradeQuestion,
  toPublicQuestion,
} from "@/domain/questions/grade-question";
import type {
  PublicQuestionDto,
  QuestionFeedbackDto,
  QuestionRevisionPayload,
} from "@/domain/questions/question";
import { DomainError } from "@/domain/shared/domain-error";

export interface AttemptItemViewDto {
  questionId: string;
  questionRevisionId: string;
  position: number;
  points: number;
  question: PublicQuestionDto;
  submittedAnswer?: { optionIds: string[] };
  feedback?: QuestionFeedbackDto;
  isBookmarked: boolean;
}

export interface AttemptViewDto extends AttemptRecord {
  items: AttemptItemViewDto[];
}

export async function startAttempt(
  userId: string,
  spaceId: string,
  examId: string,
  idempotencyKey?: string,
): Promise<AttemptRecord> {
  await getOwnedSpace(userId, spaceId);
  const db = getFirestore();

  if (idempotencyKey) {
    const opRef = db
      .collection("users")
      .doc(userId)
      .collection("spaces")
      .doc(spaceId)
      .collection("operations")
      .doc(idempotencyKey);
    const opSnap = await opRef.get();
    if (opSnap.exists) {
      return opSnap.data()?.result as AttemptRecord;
    }
  }

  const examView = await getPublishedExamView(userId, spaceId, examId);
  const attemptId = `att_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const attemptRef = db
    .collection("users")
    .doc(userId)
    .collection("spaces")
    .doc(spaceId)
    .collection("attempts")
    .doc(attemptId);

  const attemptRecord: AttemptRecord = {
    id: attemptId,
    userId,
    spaceId,
    examId,
    examRevisionId: examView.revisionId,
    status: "in-progress",
    passingPercentage: examView.payload.passingPercentage,
    createdAt: now,
    updatedAt: now,
  };

  const batch = db.batch();
  batch.set(attemptRef, attemptRecord);

  examView.payload.questions.forEach((ref, idx) => {
    const itemRef = attemptRef.collection("items").doc(ref.questionId);
    const itemRecord: AttemptItemRecord = {
      questionId: ref.questionId,
      questionRevisionId: ref.questionRevisionId,
      position: idx,
      points: ref.points,
      isBookmarked: false,
    };
    batch.set(itemRef, itemRecord);
  });

  if (idempotencyKey) {
    const opRef = db
      .collection("users")
      .doc(userId)
      .collection("spaces")
      .doc(spaceId)
      .collection("operations")
      .doc(idempotencyKey);
    batch.set(opRef, {
      id: idempotencyKey,
      result: attemptRecord,
      createdAt: now,
    });
  }

  await batch.commit();
  return attemptRecord;
}

export async function submitAttemptAnswer(
  userId: string,
  spaceId: string,
  attemptId: string,
  questionId: string,
  answer: { optionIds: string[] },
): Promise<QuestionFeedbackDto> {
  await getOwnedSpace(userId, spaceId);
  const db = getFirestore();
  const attemptRef = db
    .collection("users")
    .doc(userId)
    .collection("spaces")
    .doc(spaceId)
    .collection("attempts")
    .doc(attemptId);
  const itemRef = attemptRef.collection("items").doc(questionId);

  const feedback = await db.runTransaction(async (transaction) => {
    const attemptSnap = await transaction.get(attemptRef);
    const attemptData = attemptSnap.data() as AttemptRecord | undefined;
    if (
      !attemptSnap.exists ||
      !attemptData ||
      attemptData.userId !== userId ||
      attemptData.status !== "in-progress"
    ) {
      throw new DomainError("lifecycle-conflict", {
        message: "Attempt is not in progress or unauthorized.",
      });
    }

    const itemSnap = await transaction.get(itemRef);
    const itemData = itemSnap.data() as AttemptItemRecord | undefined;
    if (!itemSnap.exists || !itemData) {
      throw new DomainError("not-found", {
        message: `Attempt item ${questionId} not found.`,
      });
    }

    // Grade against the exact question revision bound to this item
    const revRef = db
      .collection("spaces")
      .doc(spaceId)
      .collection("objects")
      .doc(questionId)
      .collection("revisions")
      .doc(itemData.questionRevisionId);
    const revSnap = await transaction.get(revRef);
    if (!revSnap.exists) {
      throw new DomainError("not-found", {
        message: `Question revision ${itemData.questionRevisionId} not found.`,
      });
    }

    const revPayload = revSnap.data()?.payload as QuestionRevisionPayload;
    const feedback = gradeQuestion(revPayload, answer);
    const now = new Date().toISOString();

    transaction.update(itemRef, {
      submittedAnswer: answer,
      isCorrect: feedback.isCorrect,
      answeredAt: now,
    });
    transaction.update(attemptRef, {
      updatedAt: now,
    });

    return feedback;
  });

  await ensureQuestionMemory(userId, spaceId, questionId);

  return feedback;
}

export async function toggleAttemptBookmark(
  userId: string,
  spaceId: string,
  attemptId: string,
  questionId: string,
): Promise<{ isBookmarked: boolean }> {
  await getOwnedSpace(userId, spaceId);
  const db = getFirestore();
  const itemRef = db
    .collection("users")
    .doc(userId)
    .collection("spaces")
    .doc(spaceId)
    .collection("attempts")
    .doc(attemptId)
    .collection("items")
    .doc(questionId);

  return await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(itemRef);
    const data = snap.data() as AttemptItemRecord | undefined;
    if (!snap.exists || !data) {
      throw new DomainError("not-found");
    }

    const newState = !data.isBookmarked;
    transaction.update(itemRef, { isBookmarked: newState });
    return { isBookmarked: newState };
  });
}

export async function completeAttempt(
  userId: string,
  spaceId: string,
  attemptId: string,
): Promise<AttemptScoreResult> {
  await getOwnedSpace(userId, spaceId);
  const db = getFirestore();
  const attemptRef = db
    .collection("users")
    .doc(userId)
    .collection("spaces")
    .doc(spaceId)
    .collection("attempts")
    .doc(attemptId);
  const itemsRef = attemptRef.collection("items");

  return await db.runTransaction(async (transaction) => {
    const attemptSnap = await transaction.get(attemptRef);
    const attemptData = attemptSnap.data() as AttemptRecord | undefined;
    if (
      !attemptSnap.exists ||
      !attemptData ||
      attemptData.userId !== userId ||
      attemptData.status !== "in-progress"
    ) {
      throw new DomainError("lifecycle-conflict", {
        message: "Attempt is not in progress or unauthorized.",
      });
    }

    const itemsSnap = await transaction.get(itemsRef);
    const items = itemsSnap.docs.map((d) => d.data() as AttemptItemRecord);

    validateAttemptCompletion(items);
    const scoreResult = scoreAttempt(items, attemptData.passingPercentage);
    const now = new Date().toISOString();

    transaction.update(attemptRef, {
      status: "completed",
      score: scoreResult.score,
      maximumScore: scoreResult.maximumScore,
      percentage: scoreResult.percentage,
      passed: scoreResult.passed,
      completedAt: now,
      updatedAt: now,
    });

    return scoreResult;
  });
}

export async function getAttemptView(
  userId: string,
  spaceId: string,
  attemptId: string,
): Promise<AttemptViewDto> {
  await getOwnedSpace(userId, spaceId);
  const db = getFirestore();
  const attemptRef = db
    .collection("users")
    .doc(userId)
    .collection("spaces")
    .doc(spaceId)
    .collection("attempts")
    .doc(attemptId);

  const attemptSnap = await attemptRef.get();
  const attemptData = attemptSnap.data() as AttemptRecord | undefined;
  if (!attemptSnap.exists || !attemptData || attemptData.userId !== userId) {
    throw new DomainError("forbidden");
  }

  const itemsSnap = await attemptRef
    .collection("items")
    .orderBy("position", "asc")
    .get();

  const itemViews: AttemptItemViewDto[] = [];

  for (const doc of itemsSnap.docs) {
    const item = doc.data() as AttemptItemRecord;
    const rev = await getObjectRevision<QuestionRevisionPayload>(
      userId,
      spaceId,
      item.questionRevisionId,
    );

    const publicQ = toPublicQuestion({
      ...rev.payload,
      questionId: item.questionId,
      questionRevisionId: item.questionRevisionId,
    });

    let feedback: QuestionFeedbackDto | undefined;
    if (item.submittedAnswer) {
      feedback = gradeQuestion(rev.payload, item.submittedAnswer);
    }

    itemViews.push({
      questionId: item.questionId,
      questionRevisionId: item.questionRevisionId,
      position: item.position,
      points: item.points,
      question: publicQ,
      submittedAnswer: item.submittedAnswer,
      feedback,
      isBookmarked: Boolean(item.isBookmarked),
    });
  }

  return {
    ...attemptData,
    items: itemViews,
  };
}
