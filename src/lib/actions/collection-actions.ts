"use server";

import { requireActionUser } from "@/data/action-auth";
import { replaceCollectionMembers } from "@/data/object-relations";
import { archiveObject, createObjectDraft } from "@/data/objects";
import type { ObjectRecord } from "@/domain/objects/object";
import {
  DomainError,
  type DomainErrorCode,
} from "@/domain/shared/domain-error";
import type { ActionResult } from "@/lib/actions/question-actions";

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

export async function createCollectionAction(input: {
  spaceId: string;
  title: string;
}): Promise<ActionResult<ObjectRecord>> {
  try {
    const user = await requireActionUser();
    const record = await createObjectDraft(
      user.uid,
      input.spaceId,
      "collection",
      input.title,
    );
    return { ok: true, data: record };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function updateCollectionMembersAction(input: {
  spaceId: string;
  collectionId: string;
  memberObjectIds: string[];
}): Promise<ActionResult<void>> {
  try {
    const user = await requireActionUser();
    await replaceCollectionMembers(
      user.uid,
      input.spaceId,
      input.collectionId,
      input.memberObjectIds,
    );
    return { ok: true, data: undefined };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function archiveCollectionAction(input: {
  spaceId: string;
  collectionId: string;
}): Promise<ActionResult<ObjectRecord>> {
  try {
    const user = await requireActionUser();
    const record = await archiveObject(
      user.uid,
      input.spaceId,
      input.collectionId,
    );
    return { ok: true, data: record };
  } catch (err) {
    return toActionResultError(err);
  }
}
