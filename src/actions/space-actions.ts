"use server";

import { revalidatePath } from "next/cache";
import { ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "@/dal/errors";
import { createSpace, deleteSpace } from "@/dal/spaces";
import { validateCreateSpaceInput } from "@/lib/validations/space";
import type { SpaceDTO } from "@/types/dtos";
import type { CreateSpaceInput } from "@/types/space";

export type ActionResult<T = void> =
  | { readonly success: true; readonly data: T }
  | {
      readonly success: false;
      readonly error: string;
      readonly code:
        | "UNAUTHORIZED"
        | "FORBIDDEN"
        | "NOT_FOUND"
        | "VALIDATION_ERROR"
        | "INTERNAL_ERROR";
    };

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Graceful fallback in environments without static generation store (e.g. unit tests)
  }
}

function handleActionError(error: unknown): ActionResult<never> {
  if (error instanceof UnauthorizedError) {
    return { success: false, error: error.message, code: "UNAUTHORIZED" };
  }
  if (error instanceof ForbiddenError) {
    return { success: false, error: error.message, code: "FORBIDDEN" };
  }
  if (error instanceof NotFoundError) {
    return { success: false, error: error.message, code: "NOT_FOUND" };
  }
  if (error instanceof ValidationError) {
    return { success: false, error: error.message, code: "VALIDATION_ERROR" };
  }
  return {
    success: false,
    error: error instanceof Error ? error.message : "An unexpected server error occurred.",
    code: "INTERNAL_ERROR",
  };
}

/**
 * Server Action to create a space.
 * Validates input, delegates to DAL, and triggers path revalidation.
 */
export async function createSpaceAction(input: CreateSpaceInput): Promise<ActionResult<SpaceDTO>> {
  try {
    const validation = validateCreateSpaceInput(input);
    if (!validation.success || !validation.data) {
      return {
        success: false,
        error: validation.error ?? "Invalid space payload.",
        code: "VALIDATION_ERROR",
      };
    }
    const space = await createSpace(input);
    safeRevalidatePath("/");
    return { success: true, data: space };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action to delete a space.
 * Delegates authorization and cascading delete to the DAL.
 */
export async function deleteSpaceAction(
  spaceId: string,
): Promise<ActionResult<{ fallbackSpaceId: string }>> {
  try {
    if (!spaceId || typeof spaceId !== "string") {
      return { success: false, error: "Invalid space ID provided.", code: "VALIDATION_ERROR" };
    }
    const result = await deleteSpace(spaceId);
    safeRevalidatePath("/");
    return { success: true, data: result };
  } catch (error) {
    return handleActionError(error);
  }
}
