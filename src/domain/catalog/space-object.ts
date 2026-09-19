import type { Exam } from "@/domain/catalog/exam";
import type { Question } from "@/domain/catalog/question";

export type SpaceObjectTypeId = "exam" | "question" | "study-plan" | string;

export interface SpaceObjectRecord {
  spaceId: string;
  id: string;
  objectTypeId: SpaceObjectTypeId;
  title: string;
  properties: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export type ExamObjectProperties = Omit<
  Exam,
  "id" | "title" | "createdAt" | "updatedAt"
>;

export type QuestionObjectProperties = Omit<
  Question,
  "id" | "examId" | "createdAt" | "updatedAt"
> & {
  examId?: string;
};

export interface SpaceObjectRelationRecord {
  spaceId: string;
  id: string;
  relationType: "contains-question" | "includes-object" | string;
  sourceId: string;
  targetId: string;
  properties?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}
