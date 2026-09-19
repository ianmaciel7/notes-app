import type { CorrectAnswer } from "@/types/question";

export interface AssessmentQuestionState {
  answer?: CorrectAnswer;
  checked: boolean;
  correct?: boolean;
  revealed: boolean;
  bookmarked: boolean;
  note: string;
}

export type AssessmentSessionState = Record<string, AssessmentQuestionState>;
