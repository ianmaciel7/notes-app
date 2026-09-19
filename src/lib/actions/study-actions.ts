"use server";

import { requireActionUser } from "@/data/action-auth";
import { getObjectRevision } from "@/data/objects";
import { getOwnedSpace } from "@/data/spaces";
import {
  type DueStudyQueueItemDto,
  ensureQuestionMemory,
  getDueStudyQueue,
  previewReviewRatings,
  type QuestionMemoryDto,
  rateQuestionMemory,
} from "@/data/study";
import { gradeQuestion } from "@/domain/questions/grade-question";
import type {
  QuestionFeedbackDto,
  QuestionRevisionPayload,
} from "@/domain/questions/question";
import {
  DomainError,
  type DomainErrorCode,
} from "@/domain/shared/domain-error";
import type { MemoryRating } from "@/domain/study/fsrs-scheduler";

export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code: DomainErrorCode;
        fieldErrors?: Record<string, string[]>;
      };
    };

function toActionResultError(err: unknown): {
  ok: false;
  error: { code: DomainErrorCode; fieldErrors?: Record<string, string[]> };
} {
  if (err instanceof DomainError) {
    return {
      ok: false,
      error: {
        code: err.code,
        fieldErrors: err.fieldErrors,
      },
    };
  }
  return {
    ok: false,
    error: {
      code: "internal",
    },
  };
}

export async function enrollQuestionAction(input: {
  spaceId: string;
  questionId: string;
}): Promise<ActionResult<void>> {
  try {
    const user = await requireActionUser();
    await ensureQuestionMemory(user.uid, input.spaceId, input.questionId);
    return { ok: true, data: undefined };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function previewReviewRatingsAction(input: {
  spaceId: string;
  questionId: string;
}): Promise<
  ActionResult<Record<MemoryRating, { due: string; stateVersion: number }>>
> {
  try {
    const user = await requireActionUser();
    const result = await previewReviewRatings(
      user.uid,
      input.spaceId,
      input.questionId,
    );
    return { ok: true, data: result };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function gradeStudyAnswerAction(input: {
  spaceId: string;
  questionId: string;
  revisionId: string;
  answer: { optionIds: string[] };
}): Promise<ActionResult<QuestionFeedbackDto>> {
  try {
    const user = await requireActionUser();
    await getOwnedSpace(user.uid, input.spaceId);
    const rev = await getObjectRevision<QuestionRevisionPayload>(
      user.uid,
      input.spaceId,
      input.revisionId,
    );
    const feedback = gradeQuestion(rev.payload, input.answer);
    return { ok: true, data: feedback };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function rateQuestionMemoryAction(input: {
  spaceId: string;
  questionId: string;
  rating: MemoryRating;
  stateVersion: number;
  idempotencyKey?: string;
}): Promise<ActionResult<QuestionMemoryDto>> {
  try {
    const user = await requireActionUser();
    const result = await rateQuestionMemory({
      userId: user.uid,
      spaceId: input.spaceId,
      questionId: input.questionId,
      rating: input.rating,
      stateVersion: input.stateVersion,
      idempotencyKey: input.idempotencyKey,
    });
    return { ok: true, data: result };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function getDueStudyQueueAction(input: {
  spaceId: string;
  limit?: number;
}): Promise<ActionResult<DueStudyQueueItemDto[]>> {
  try {
    const user = await requireActionUser();
    const queue = await getDueStudyQueue(user.uid, input.spaceId, input.limit);
    return { ok: true, data: queue };
  } catch (err) {
    return toActionResultError(err);
  }
}
