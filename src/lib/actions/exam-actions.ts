"use server";

import { revalidatePath } from "next/cache";
import { requireActionUser } from "@/data/action-auth";
import { saveQuestionNote } from "@/data/notes";
import {
  recordQuestionAttempt,
  toggleQuestionBookmark,
  updateStudyGoals,
} from "@/data/progress";
import type { CorrectAnswer } from "@/domain/catalog/question";
import type {
  ExamProgress,
  QuestionProgress,
  StudyGoalsInput,
} from "@/domain/learning/progress";
import type { QuestionNote } from "@/domain/learning/question-note";
import { adminDb } from "@/lib/firebase/admin";

export interface RecordAttemptResult {
  success: boolean;
  examProgress?: ExamProgress;
  questionProgress?: QuestionProgress;
  error?: string;
}

export async function recordAttemptAction(input: {
  examId: string;
  questionId: string;
  submittedAnswer: CorrectAnswer;
}): Promise<RecordAttemptResult> {
  try {
    const { uid: userId } = await requireActionUser();

    const questionDoc = await adminDb
      .collection("exams")
      .doc(input.examId)
      .collection("questions")
      .doc(input.questionId)
      .get();

    const correctAnswer = questionDoc.data()?.correctAnswer;
    if (!questionDoc.exists || correctAnswer === undefined) {
      return { success: false, error: "verification-failed" };
    }

    const serverEvaluatedCorrectness =
      JSON.stringify(input.submittedAnswer) === JSON.stringify(correctAnswer);

    const result = await recordQuestionAttempt({
      userId,
      examId: input.examId,
      questionId: input.questionId,
      submittedAnswer: input.submittedAnswer,
      isCorrect: serverEvaluatedCorrectness,
    });

    revalidatePath(`/exam/${input.examId}`);
    return {
      success: true,
      examProgress: result.examProgress,
      questionProgress: result.questionProgress,
    };
  } catch (error) {
    console.error("Failed to record question attempt:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to record attempt",
    };
  }
}

export interface ToggleBookmarkResult {
  success: boolean;
  bookmarked?: boolean;
  error?: string;
}

export async function toggleBookmarkAction(params: {
  examId: string;
  questionId: string;
  bookmarked?: boolean;
}): Promise<ToggleBookmarkResult> {
  try {
    const { uid: userId } = await requireActionUser();
    const newStatus = await toggleQuestionBookmark({
      userId,
      examId: params.examId,
      questionId: params.questionId,
      bookmarked: params.bookmarked,
    });

    revalidatePath(`/exam/${params.examId}`);
    return {
      success: true,
      bookmarked: newStatus,
    };
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to toggle bookmark",
    };
  }
}

export interface SaveStudyGoalsResult {
  success: boolean;
  examProgress?: ExamProgress;
  error?: string;
}

export async function saveStudyGoalsAction(params: {
  examId: string;
  goals: StudyGoalsInput;
}): Promise<SaveStudyGoalsResult> {
  try {
    const { uid: userId } = await requireActionUser();
    const examProgress = await updateStudyGoals({
      userId,
      examId: params.examId,
      goals: params.goals,
    });

    revalidatePath(`/exam/${params.examId}`);
    return {
      success: true,
      examProgress,
    };
  } catch (error) {
    console.error("Failed to save study goals:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to save study goals",
    };
  }
}

export interface SaveNoteResult {
  success: boolean;
  note?: QuestionNote;
  error?: string;
}

export async function saveNoteAction(params: {
  examId: string;
  questionId: string;
  content: string;
}): Promise<SaveNoteResult> {
  try {
    const { uid: userId } = await requireActionUser();
    const note = await saveQuestionNote(
      userId,
      params.questionId,
      params.examId,
      params.content,
    );

    return {
      success: true,
      note,
    };
  } catch (error) {
    console.error("Failed to save personal note:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save note",
    };
  }
}
