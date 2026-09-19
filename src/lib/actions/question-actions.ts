"use server";

import { requireActionUser } from "@/data/action-auth";
import {
  archiveObject,
  createObjectDraft,
  publishRevision,
  saveDraftRevision,
} from "@/data/objects";
import { getOwnedSpace } from "@/data/spaces";
import { setObjectTags } from "@/data/tags";
import type { ObjectRecord, ObjectRevision } from "@/domain/objects/object";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import {
  type QuestionRepositoryPort,
  QuestionService,
} from "@/domain/questions/question-service";
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

const repoPort: QuestionRepositoryPort = {
  createDraft: (ownerId, spaceId, type, title) =>
    createObjectDraft(ownerId, spaceId, type, title),
  saveRevision: (ownerId, spaceId, objectId, payload) =>
    saveDraftRevision(ownerId, spaceId, objectId, payload),
  publish: (ownerId, spaceId, objectId) =>
    publishRevision(ownerId, spaceId, objectId),
  archive: (ownerId, spaceId, objectId) =>
    archiveObject(ownerId, spaceId, objectId),
};

const service = new QuestionService(repoPort);

export async function createQuestionAction(input: {
  spaceId: string;
  title: string;
  payload?: unknown;
  tagIds?: string[];
}): Promise<ActionResult<ObjectRecord>> {
  try {
    const user = await requireActionUser();
    const record = await service.create({
      ownerId: user.uid,
      spaceId: input.spaceId,
      title: input.title,
      payload: input.payload,
    });

    if (input.tagIds && input.tagIds.length > 0) {
      await setObjectTags(user.uid, input.spaceId, record.id, input.tagIds);
    }

    return { ok: true, data: record };
  } catch (err) {
    return toActionResultError(err);
  }
}

export const createQuestionDraftAction = createQuestionAction;

export async function saveQuestionDraftAction(input: {
  spaceId: string;
  questionId: string;
  payload: unknown;
}): Promise<ActionResult<ObjectRevision<QuestionRevisionPayload>>> {
  try {
    const user = await requireActionUser();
    const revision = await service.saveDraft({
      ownerId: user.uid,
      spaceId: input.spaceId,
      questionId: input.questionId,
      payload: input.payload,
    });

    return { ok: true, data: revision };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function publishQuestionAction(input: {
  spaceId: string;
  questionId: string;
}): Promise<ActionResult<ObjectRevision<unknown>>> {
  try {
    const user = await requireActionUser();
    const revision = await service.publish({
      ownerId: user.uid,
      spaceId: input.spaceId,
      questionId: input.questionId,
    });

    return { ok: true, data: revision };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function archiveQuestionAction(input: {
  spaceId: string;
  questionId: string;
}): Promise<ActionResult<ObjectRecord>> {
  try {
    const user = await requireActionUser();
    const record = await service.archive({
      ownerId: user.uid,
      spaceId: input.spaceId,
      questionId: input.questionId,
    });

    return { ok: true, data: record };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function setQuestionTagsAction(input: {
  spaceId: string;
  questionId: string;
  tagIds: string[];
}): Promise<ActionResult<void>> {
  try {
    const user = await requireActionUser();
    await getOwnedSpace(user.uid, input.spaceId);
    await setObjectTags(
      user.uid,
      input.spaceId,
      input.questionId,
      input.tagIds,
    );
    return { ok: true, data: undefined };
  } catch (err) {
    return toActionResultError(err);
  }
}
