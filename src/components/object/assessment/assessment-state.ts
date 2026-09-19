import type { CorrectAnswer } from "@/domain/catalog/question";

export interface AssessmentQuestionState {
  answer?: CorrectAnswer;
  checked: boolean;
  correct?: boolean;
  revealed: boolean;
  bookmarked: boolean;
  note: string;
}

export type AssessmentSessionState = Record<string, AssessmentQuestionState>;
