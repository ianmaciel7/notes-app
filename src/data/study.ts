import "server-only";

import { getFirestore } from "firebase-admin/firestore";
import { getObjectRevision, listObjects } from "@/data/objects";
import { getOwnedSpace } from "@/data/spaces";
import type {
  AnswerOption,
  QuestionFormat,
  QuestionRevisionPayload,
} from "@/domain/questions/question";
import { DomainError } from "@/domain/shared/domain-error";
import {
  createMemoryCard,
  type MemoryRating,
  previewMemoryRatings as previewFsrsRatings,
  type StoredFsrsCard,
  scheduleMemoryReview,
} from "@/domain/study/fsrs-scheduler";
import {
  buildStudyQueue,
  type DueMemory,
  type NewQuestion,
} from "@/domain/study/study-queue";

export interface QuestionMemoryDto {
  questionId: string;
  dueAt: string;
  stateVersion: number;
  lastReviewedAt?: string;
  reviewCount: number;
}

export interface DueStudyQueueItemDto {
  questionId: string;
  isDue: boolean;
  prompt: string;
  options?: AnswerOption[];
  format?: QuestionFormat;
  revisionId?: string;
  dueAt?: string;
  stateVersion: number;
}

export interface StoredQuestionMemory {
  questionId: string;
  schedulerVersion: string;
  parametersVersion: string;
  card: StoredFsrsCard;
  dueAt: string;
  lastReviewedAt?: string;
  reviewCount: number;
  stateVersion: number;
  createdAt: string;
  updatedAt: string;
}

export async function ensureQuestionMemory(
  userId: string,
  spaceId: string,
  questionId: string,
): Promise<void> {
  await getOwnedSpace(userId, spaceId);
  const db = getFirestore();
  const memRef = db
    .collection("users")
    .doc(userId)
    .collection("spaces")
    .doc(spaceId)
    .collection("questionMemory")
    .doc(questionId);

  const snap = await memRef.get();
  if (snap.exists) {
    return;
  }

  const now = new Date();
  const card = createMemoryCard(now);
  const nowIso = now.toISOString();

  const record: StoredQuestionMemory = {
    questionId,
    schedulerVersion: card.schedulerVersion,
    parametersVersion: card.parametersVersion,
    card,
    dueAt: nowIso,
    reviewCount: 0,
    stateVersion: 0,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  await memRef.set(record);
}

export async function rateQuestionMemory(command: {
  userId: string;
  spaceId: string;
  questionId: string;
  rating: MemoryRating;
  stateVersion: number;
  idempotencyKey?: string;
}): Promise<QuestionMemoryDto> {
  const { userId, spaceId, questionId, rating, stateVersion, idempotencyKey } =
    command;
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
      return opSnap.data()?.result as QuestionMemoryDto;
    }
  }

  const memRef = db
    .collection("users")
    .doc(userId)
    .collection("spaces")
    .doc(spaceId)
    .collection("questionMemory")
    .doc(questionId);

  const eventId = `rev_${crypto.randomUUID()}`;
  const eventRef = db
    .collection("users")
    .doc(userId)
    .collection("spaces")
    .doc(spaceId)
    .collection("reviewEvents")
    .doc(eventId);

  const result = await db.runTransaction(async (transaction) => {
    const memSnap = await transaction.get(memRef);
    const memData = memSnap.data() as StoredQuestionMemory | undefined;

    const currentVersion = memData?.stateVersion ?? 0;
    if (currentVersion !== stateVersion) {
      throw new DomainError("stale-state", {
        message: `Stale stateVersion. Current is ${currentVersion}, expected ${stateVersion}.`,
      });
    }

    const now = new Date();
    const transition = scheduleMemoryReview({
      previous: memData?.card ?? null,
      rating,
      now,
      stateVersion: currentVersion,
    });

    const nowIso = now.toISOString();
    const newRecord: StoredQuestionMemory = {
      questionId,
      schedulerVersion: transition.resultingCard.schedulerVersion,
      parametersVersion: transition.resultingCard.parametersVersion,
      card: transition.resultingCard,
      dueAt: transition.resultingCard.due,
      lastReviewedAt: nowIso,
      reviewCount: (memData?.reviewCount ?? 0) + 1,
      stateVersion: transition.stateVersion,
      createdAt: memData?.createdAt ?? nowIso,
      updatedAt: nowIso,
    };

    transaction.set(memRef, newRecord);

    transaction.set(eventRef, {
      id: eventId,
      questionId,
      rating,
      resultingCard: transition.resultingCard,
      stateVersion: transition.stateVersion,
      reviewedAt: nowIso,
    });

    const dto: QuestionMemoryDto = {
      questionId,
      dueAt: transition.resultingCard.due,
      stateVersion: transition.stateVersion,
      lastReviewedAt: nowIso,
      reviewCount: newRecord.reviewCount,
    };

    if (idempotencyKey) {
      const opRef = db
        .collection("users")
        .doc(userId)
        .collection("spaces")
        .doc(spaceId)
        .collection("operations")
        .doc(idempotencyKey);
      transaction.set(opRef, {
        id: idempotencyKey,
        result: dto,
        createdAt: nowIso,
      });
    }

    return dto;
  });

  return result;
}

export async function previewReviewRatings(
  userId: string,
  spaceId: string,
  questionId: string,
): Promise<Record<MemoryRating, { due: string; stateVersion: number }>> {
  await getOwnedSpace(userId, spaceId);
  const db = getFirestore();
  const memRef = db
    .collection("users")
    .doc(userId)
    .collection("spaces")
    .doc(spaceId)
    .collection("questionMemory")
    .doc(questionId);

  const snap = await memRef.get();
  const data = snap.data() as StoredQuestionMemory | undefined;
  const card = data?.card ?? null;

  const preview = previewFsrsRatings(card, new Date());
  return {
    again: {
      due: preview.again.resultingCard.due,
      stateVersion: preview.again.stateVersion,
    },
    hard: {
      due: preview.hard.resultingCard.due,
      stateVersion: preview.hard.stateVersion,
    },
    good: {
      due: preview.good.resultingCard.due,
      stateVersion: preview.good.stateVersion,
    },
    easy: {
      due: preview.easy.resultingCard.due,
      stateVersion: preview.easy.stateVersion,
    },
  };
}

export async function getDueStudyQueue(
  userId: string,
  spaceId: string,
  limit = 20,
): Promise<DueStudyQueueItemDto[]> {
  await getOwnedSpace(userId, spaceId);
  const db = getFirestore();

  const memoriesSnap = await db
    .collection("users")
    .doc(userId)
    .collection("spaces")
    .doc(spaceId)
    .collection("questionMemory")
    .get();

  const dueMemories: DueMemory[] = [];
  const memoryByQuestionId = new Map<string, StoredQuestionMemory>();

  for (const doc of memoriesSnap.docs) {
    const data = doc.data() as StoredQuestionMemory;
    memoryByQuestionId.set(data.questionId, data);
    dueMemories.push({
      questionId: data.questionId,
      dueAt: data.dueAt,
      stateVersion: data.stateVersion,
    });
  }

  // Also query published questions to include new questions
  const objects = await listObjects(userId, spaceId, "question");
  const newQuestions: NewQuestion[] = [];

  for (const obj of objects) {
    if (obj.lifecycle === "published" && !memoryByQuestionId.has(obj.id)) {
      newQuestions.push({
        questionId: obj.id,
        createdAt: obj.createdAt,
      });
    }
  }

  const queue = buildStudyQueue({
    dueMemories,
    newQuestions,
    now: new Date(),
    limit,
  });

  const result: DueStudyQueueItemDto[] = [];
  for (const item of queue) {
    const memory = memoryByQuestionId.get(item.questionId);
    let prompt = "";
    let options: AnswerOption[] | undefined;
    let format: QuestionFormat | undefined;
    let revisionId: string | undefined;
    try {
      const objSnap = await db
        .collection("spaces")
        .doc(spaceId)
        .collection("objects")
        .doc(item.questionId)
        .get();
      const objData = objSnap.data();
      const revId =
        objData?.publishedRevisionId ?? objData?.latestRevisionId ?? "";
      if (revId) {
        const rev = await getObjectRevision<QuestionRevisionPayload>(
          userId,
          spaceId,
          revId,
        );
        prompt = rev.payload.prompt;
        options = rev.payload.options;
        format = rev.payload.format;
        revisionId = revId;
      }
    } catch {
      // fallback empty prompt
    }

    result.push({
      questionId: item.questionId,
      isDue: item.isDue,
      prompt,
      options,
      format,
      revisionId,
      dueAt: memory?.dueAt,
      stateVersion: memory?.stateVersion ?? 0,
    });
  }

  return result;
}
