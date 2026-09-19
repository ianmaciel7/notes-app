import type { CorrectAnswer } from "@/domain/catalog/question";

export interface ExamProgress {
  examId: string;
  userId: string;
  uniqueAnsweredCount: number;
  incorrectCount: number;
  totalAttemptsCount: number;
  targetExamDate: string | null;
  dailyGoal: number;
  lastActivityDate: string | null;
  todayAnsweredCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionProgress {
  questionId: string;
  examId: string;
  isCompleted: boolean;
  isCorrect: boolean;
  bookmarked: boolean;
  attemptCount: number;
  lastAttemptAt: string;
  lastSubmittedAnswer: CorrectAnswer | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionAttemptInput {
  userId: string;
  examId: string;
  questionId: string;
  submittedAnswer: CorrectAnswer;
  isCorrect: boolean;
}

export interface StudyGoalsInput {
  targetExamDate?: string | null;
  dailyGoal?: number;
}
