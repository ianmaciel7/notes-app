"use server";

import { requireActionUser } from "@/data/action-auth";
import {
  getAssessmentViewMode,
  saveUserAssessmentViewMode,
} from "@/data/preferences";
import type { AssessmentViewMode } from "@/types/assessment";

export async function saveAssessmentViewModeAction(
  mode: unknown,
): Promise<{ success: boolean; mode?: AssessmentViewMode; error?: string }> {
  try {
    const user = await requireActionUser();

    const validMode = getAssessmentViewMode(mode);
    if (mode !== validMode) {
      return { success: false, error: "Invalid assessment view mode" };
    }

    await saveUserAssessmentViewMode(user.uid, validMode);
    return { success: true, mode: validMode };
  } catch (error) {
    console.error("Failed to save assessment view mode:", error);
    return {
      success: false,
      error: "Unable to save preference",
    };
  }
}
