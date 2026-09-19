"use server";

import { cookies } from "next/headers";
import {
  getAssessmentViewMode,
  saveUserAssessmentViewMode,
} from "@/data/preferences";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { verifyFirebaseSessionCookie } from "@/lib/firebase/admin";
import type { AssessmentViewMode } from "@/types/assessment";

async function getAuthenticatedUserId(): Promise<string | null> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    return (await verifyFirebaseSessionCookie(sessionCookie, false)).uid;
  } catch {
    return null;
  }
}

export async function saveAssessmentViewModeAction(
  mode: unknown,
): Promise<{ success: boolean; mode?: AssessmentViewMode; error?: string }> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return { success: false, error: "Unauthorized" };

  const validMode = getAssessmentViewMode(mode);
  if (mode !== validMode) {
    return { success: false, error: "Invalid assessment view mode" };
  }

  try {
    await saveUserAssessmentViewMode(userId, validMode);
    return { success: true, mode: validMode };
  } catch (error) {
    console.error("Failed to save assessment view mode:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unable to save preference",
    };
  }
}
