import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { AssessmentViewMode } from "@/types/assessment";

const DEFAULT_ASSESSMENT_VIEW_MODE: AssessmentViewMode = "continuous";

export function getAssessmentViewMode(value: unknown): AssessmentViewMode {
  return value === "focus" || value === "continuous"
    ? value
    : DEFAULT_ASSESSMENT_VIEW_MODE;
}

export async function getUserAssessmentViewMode(
  userId: string,
): Promise<AssessmentViewMode> {
  const snapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("settings")
    .doc("preferences")
    .get();

  return getAssessmentViewMode(snapshot.data()?.assessmentViewMode);
}

export async function saveUserAssessmentViewMode(
  userId: string,
  mode: AssessmentViewMode,
): Promise<void> {
  await adminDb
    .collection("users")
    .doc(userId)
    .collection("settings")
    .doc("preferences")
    .set({ assessmentViewMode: mode }, { merge: true });
}
