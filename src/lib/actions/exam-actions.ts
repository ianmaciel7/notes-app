"use server";

import { revalidatePath } from "next/cache";
import { requireActionUser } from "@/data/action-auth";
import sampleData from "@/data/fixtures/sample-exams.json";
import { saveQuestionNote } from "@/data/notes";
import {
  recordQuestionAttempt,
  toggleQuestionBookmark,
  updateStudyGoals,
} from "@/data/progress";
import { adminDb } from "@/lib/firebase/admin";
import type { QuestionNote } from "@/types/note";
import type {
  ExamProgress,
  QuestionProgress,
  StudyGoalsInput,
} from "@/types/progress";
import type { CorrectAnswer } from "@/types/question";
import { DEFAULT_SPACE_ID } from "@/types/space";

function objectProperties(value: object) {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([key]) => key !== "id" && key !== "title" && key !== "examId",
    ),
  );
}

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
  isCorrect: boolean;
}): Promise<RecordAttemptResult> {
  try {
    const { uid: userId } = await requireActionUser();
    const result = await recordQuestionAttempt({
      userId,
      examId: input.examId,
      questionId: input.questionId,
      submittedAnswer: input.submittedAnswer,
      isCorrect: input.isCorrect,
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

export interface SeedSampleDataResult {
  success: boolean;
  examsCount: number;
  questionsCount: number;
  error?: string;
}

export async function seedSampleDataAction(): Promise<SeedSampleDataResult> {
  try {
    const batch = adminDb.batch();
    const nowIso = new Date().toISOString();
    const spaceRef = adminDb.collection("spaces").doc(DEFAULT_SPACE_ID);
    batch.set(
      spaceRef,
      {
        name: "Exam Prep",
        kind: "shared-catalog",
        updatedAt: nowIso,
        createdAt: nowIso,
      },
      { merge: true },
    );
    for (const objectType of [
      { id: "exam", singularName: "Exam", pluralName: "Exams" },
      { id: "question", singularName: "Question", pluralName: "Questions" },
      {
        id: "study-plan",
        singularName: "Study plan",
        pluralName: "Study plans",
      },
    ]) {
      batch.set(
        spaceRef.collection("objectTypes").doc(objectType.id),
        { ...objectType, updatedAt: nowIso, createdAt: nowIso },
        { merge: true },
      );
    }

    for (const exam of sampleData.exams) {
      const examRef = adminDb.collection("exams").doc(exam.id);
      batch.set(
        examRef,
        {
          ...exam,
          updatedAt: nowIso,
          createdAt: nowIso,
        },
        { merge: true },
      );

      const objectRef = adminDb
        .collection("spaces")
        .doc(DEFAULT_SPACE_ID)
        .collection("objects")
        .doc(exam.id);
      batch.set(
        objectRef,
        {
          objectTypeId: "exam",
          title: exam.title,
          properties: objectProperties(exam),
          updatedAt: nowIso,
          createdAt: nowIso,
        },
        { merge: true },
      );
    }

    for (const question of sampleData.questions) {
      const questionRef = adminDb
        .collection("exams")
        .doc(question.examId)
        .collection("questions")
        .doc(question.id);

      batch.set(
        questionRef,
        {
          ...question,
          updatedAt: nowIso,
          createdAt: nowIso,
        },
        { merge: true },
      );

      const objectRef = adminDb
        .collection("spaces")
        .doc(DEFAULT_SPACE_ID)
        .collection("objects")
        .doc(question.id);
      const relationRef = adminDb
        .collection("spaces")
        .doc(DEFAULT_SPACE_ID)
        .collection("relations")
        .doc(`${question.examId}-${question.id}`);
      batch.set(
        objectRef,
        {
          objectTypeId: "question",
          title: question.prompt,
          properties: objectProperties(question),
          updatedAt: nowIso,
          createdAt: nowIso,
        },
        { merge: true },
      );
      batch.set(
        relationRef,
        {
          relationType: "contains-question",
          sourceId: question.examId,
          targetId: question.id,
          properties: {
            order: question.order ?? 0,
            domainId: question.domainId,
          },
          updatedAt: nowIso,
          createdAt: nowIso,
        },
        { merge: true },
      );
    }

    await batch.commit();

    revalidatePath("/");
    return {
      success: true,
      examsCount: sampleData.exams.length,
      questionsCount: sampleData.questions.length,
    };
  } catch (error) {
    console.error("Failed to seed sample exam data:", error);
    return {
      success: false,
      examsCount: 0,
      questionsCount: 0,
      error:
        error instanceof Error ? error.message : "Failed to seed sample data",
    };
  }
}
