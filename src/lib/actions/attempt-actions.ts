"use server";

import { requireActionUser } from "@/data/action-auth";
import {
  type AttemptRecord,
  type AttemptScoreResult,
  type AttemptViewDto,
  completeAttempt,
  getAttemptView,
  startAttempt,
  submitAttemptAnswer,
  toggleAttemptBookmark,
} from "@/data/attempts";

export type {
  AttemptItemViewDto,
  AttemptRecord,
  AttemptScoreResult,
  AttemptViewDto,
} from "@/data/attempts";

import type { QuestionFeedbackDto } from "@/domain/questions/question";
export type { QuestionFeedbackDto };

import {
  DomainError,
  type DomainErrorCode,
} from "@/domain/shared/domain-error";

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

export async function startAttemptAction(input: {
  spaceId: string;
  examId: string;
  idempotencyKey?: string;
}): Promise<ActionResult<AttemptRecord>> {
  try {
    const user = await requireActionUser();
    const attempt = await startAttempt(
      user.uid,
      input.spaceId,
      input.examId,
      input.idempotencyKey,
    );
    return { ok: true, data: attempt };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function submitAttemptAnswerAction(input: {
  spaceId: string;
  attemptId: string;
  questionId: string;
  answer: { optionIds: string[] };
}): Promise<ActionResult<QuestionFeedbackDto>> {
  try {
    const user = await requireActionUser();
    const feedback = await submitAttemptAnswer(
      user.uid,
      input.spaceId,
      input.attemptId,
      input.questionId,
      input.answer,
    );
    return { ok: true, data: feedback };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function toggleAttemptBookmarkAction(input: {
  spaceId: string;
  attemptId: string;
  questionId: string;
}): Promise<ActionResult<{ isBookmarked: boolean }>> {
  try {
    const user = await requireActionUser();
    const result = await toggleAttemptBookmark(
      user.uid,
      input.spaceId,
      input.attemptId,
      input.questionId,
    );
    return { ok: true, data: result };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function bookmarkAttemptQuestionAction(input: {
  spaceId: string;
  attemptId: string;
  questionId: string;
}): Promise<ActionResult<{ isBookmarked: boolean }>> {
  return toggleAttemptBookmarkAction(input);
}

export async function completeAttemptAction(input: {
  spaceId: string;
  attemptId: string;
}): Promise<ActionResult<AttemptScoreResult>> {
  try {
    const user = await requireActionUser();
    const scoreResult = await completeAttempt(
      user.uid,
      input.spaceId,
      input.attemptId,
    );
    return { ok: true, data: scoreResult };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function getAttemptViewAction(input: {
  spaceId: string;
  attemptId: string;
}): Promise<ActionResult<AttemptViewDto>> {
  try {
    const user = await requireActionUser();
    const view = await getAttemptView(user.uid, input.spaceId, input.attemptId);
    return { ok: true, data: view };
  } catch (err) {
    return toActionResultError(err);
  }
}
