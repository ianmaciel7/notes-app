import type { FirestoreTime } from "@/types/card";

export type LifecycleState =
  | "active"
  | "archived"
  | "trash"
  | "pendingApproval";

export interface BaseObjectDocument {
  id: string;
  spaceId: string;
  schemaVersion: number;
  objectTypeId: string;
  title: string;
  lifecycleState: LifecycleState;
  stateVersion: number;
  createdAt: FirestoreTime | null;
  updatedAt: FirestoreTime | null;
  conceptIds?: string[];
  outgoingLinkIds?: string[];
  deletedAt?: FirestoreTime | null;
}

export interface ExamProperties {
  provider: string;
  code: string;
  totalQuestionsCount: number;
  passingScorePercentage: number;
  timeLimitMinutes?: number;
  questionIds: string[];
}

export interface ExamObject extends BaseObjectDocument {
  objectTypeId: "exam";
  properties: ExamProperties;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export type AnswerProvenance =
  | "official"
  | "suggested"
  | "community"
  | "user"
  | "ai";

export interface GroundedExplanation {
  text: string;
  referenceUrls: string[];
  answerProvenance: AnswerProvenance;
}

export type QuestionFormat = "single_choice" | "multiple_choice";

export interface QuestionProperties {
  statement: string;
  options: QuestionOption[];
  correctOptionIds: string[];
  groundedExplanation?: GroundedExplanation;
  examId: string;
  orderIndex: number;
  format: QuestionFormat;
}

export interface QuestionObject extends BaseObjectDocument {
  objectTypeId: "question";
  properties: QuestionProperties;
  content?: Record<string, unknown> | null;
}
