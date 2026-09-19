"use server";

import { requireActionUser } from "@/data/action-auth";
import {
  createExamDraft,
  publishExam,
  saveExamDraft,
} from "@/data/exam-authoring";
import { replaceExamQuestionRelations } from "@/data/object-relations";
import { archiveObject } from "@/data/objects";
import type {
  ExamQuestionReference,
  ExamRevisionPayload,
} from "@/domain/exams/exam";
import {
  type ExamRepositoryPort,
  ExamService,
} from "@/domain/exams/exam-service";
import type { ObjectRecord, ObjectRevision } from "@/domain/objects/object";
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

const repoPort: ExamRepositoryPort = {
  createDraft: (ownerId, spaceId, title) =>
    createExamDraft(ownerId, spaceId, title),
  saveRevision: (ownerId, spaceId, examId, payload) =>
    saveExamDraft(ownerId, spaceId, examId, payload),
  replaceQuestions: (ownerId, spaceId, examId, questionRefs) =>
    replaceExamQuestionRelations(ownerId, spaceId, examId, questionRefs),
  publish: (ownerId, spaceId, examId) => publishExam(ownerId, spaceId, examId),
  archive: (ownerId, spaceId, examId) =>
    archiveObject(ownerId, spaceId, examId),
};

const service = new ExamService(repoPort);

export async function createExamAction(input: {
  spaceId: string;
  title: string;
}): Promise<ActionResult<ObjectRecord>> {
  try {
    const user = await requireActionUser();
    const record = await service.create({
      ownerId: user.uid,
      spaceId: input.spaceId,
      title: input.title,
    });
    return { ok: true, data: record };
  } catch (err) {
    return toActionResultError(err);
  }
}

export const createExamDraftAction = createExamAction;

export async function saveExamDraftAction(input: {
  spaceId: string;
  examId: string;
  payload: ExamRevisionPayload;
}): Promise<ActionResult<ObjectRevision<ExamRevisionPayload>>> {
  try {
    const user = await requireActionUser();
    const revision = await service.saveDraft({
      ownerId: user.uid,
      spaceId: input.spaceId,
      examId: input.examId,
      payload: input.payload,
    });
    return { ok: true, data: revision };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function replaceExamQuestionsAction(input: {
  spaceId: string;
  examId: string;
  questionRefs: ExamQuestionReference[];
}): Promise<ActionResult<void>> {
  try {
    const user = await requireActionUser();
    await service.replaceQuestions({
      ownerId: user.uid,
      spaceId: input.spaceId,
      examId: input.examId,
      questionRefs: input.questionRefs,
    });
    return { ok: true, data: undefined };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function publishExamAction(input: {
  spaceId: string;
  examId: string;
}): Promise<ActionResult<ObjectRevision<ExamRevisionPayload>>> {
  try {
    const user = await requireActionUser();
    const revision = await service.publish({
      ownerId: user.uid,
      spaceId: input.spaceId,
      examId: input.examId,
    });
    return { ok: true, data: revision };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function archiveExamAction(input: {
  spaceId: string;
  examId: string;
}): Promise<ActionResult<ObjectRecord>> {
  try {
    const user = await requireActionUser();
    const record = await service.archive({
      ownerId: user.uid,
      spaceId: input.spaceId,
      examId: input.examId,
    });
    return { ok: true, data: record };
  } catch (err) {
    return toActionResultError(err);
  }
}
