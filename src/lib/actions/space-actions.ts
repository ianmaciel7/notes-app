"use server";

import { requireActionUser } from "@/data/action-auth";
import {
  createPrivateSpace,
  listOwnedSpaces,
  renameOwnedSpace,
} from "@/data/spaces";
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

export async function createSpaceAction(input: {
  name: string;
}): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    const user = await requireActionUser();
    const record = await createPrivateSpace(user.uid, input.name);
    return { ok: true, data: { id: record.id, name: record.name } };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function renameSpaceAction(input: {
  spaceId: string;
  name: string;
}): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    const user = await requireActionUser();
    const record = await renameOwnedSpace(user.uid, input.spaceId, input.name);
    return { ok: true, data: { id: record.id, name: record.name } };
  } catch (err) {
    return toActionResultError(err);
  }
}

export async function listSpacesAction(): Promise<
  ActionResult<Array<{ id: string; name: string }>>
> {
  try {
    const user = await requireActionUser();
    const records = await listOwnedSpaces(user.uid);
    return {
      ok: true,
      data: records.map((r) => ({ id: r.id, name: r.name })),
    };
  } catch (err) {
    return toActionResultError(err);
  }
}
