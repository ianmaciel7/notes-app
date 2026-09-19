export type ExamProvider =
  | "aws"
  | "gcp"
  | "azure"
  | "kubernetes"
  | "hashicorp"
  | "comptia"
  | "generic";

export interface ExamDomain {
  id: string;
  name: string;
  description?: string;
  weightPercentage: number;
}

export interface ExamPassingCriteria {
  passingScore: number;
  maxScore: number;
  percentage?: number;
}

export interface ExamQuestionCounts {
  total: number;
  byDomain?: Record<string, number>;
}

export interface Exam {
  id: string;
  title: string;
  code: string;
  provider: ExamProvider;
  description: string;
  passingScore: number;
  passingCriteria: ExamPassingCriteria;
  durationMinutes: number;
  totalQuestions: number;
  questionCounts: ExamQuestionCounts;
  domains: ExamDomain[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

