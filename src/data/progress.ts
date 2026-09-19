import "server-only";

import type {
  ExamProgress,
  QuestionAttemptInput,
  QuestionProgress,
  StudyGoalsInput,
} from "@/domain/learning/progress";
import { adminDb } from "@/lib/firebase/admin";

export async function getUserExamProgress(
  userId: string,
  examId: string,
): Promise<{
  examProgress: ExamProgress | null;
  questionProgress: Record<string, QuestionProgress>;
}> {
  const examRef = adminDb
    .collection("users")
    .doc(userId)
    .collection("examProgress")
    .doc(examId);

  const [examSnap, questionsSnap] = await Promise.all([
    examRef.get(),
    examRef.collection("questionProgress").get(),
  ]);

  let examProgress: ExamProgress | null = null;
  if (examSnap.exists) {
    const data = examSnap.data();
    if (data) {
      examProgress = {
        examId,
        userId,
        uniqueAnsweredCount: data.uniqueAnsweredCount ?? 0,
        incorrectCount: data.incorrectCount ?? 0,
        totalAttemptsCount: data.totalAttemptsCount ?? 0,
        targetExamDate: data.targetExamDate ?? null,
        dailyGoal: data.dailyGoal ?? 20,
        lastActivityDate: data.lastActivityDate ?? null,
        todayAnsweredCount: data.todayAnsweredCount ?? 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }
  }

  const questionProgress: Record<string, QuestionProgress> = {};
  for (const doc of questionsSnap.docs) {
    const qData = doc.data();
    questionProgress[doc.id] = {
      questionId: doc.id,
      examId,
      isCompleted: Boolean(qData.isCompleted),
      isCorrect: Boolean(qData.isCorrect),
      bookmarked: Boolean(qData.bookmarked),
      attemptCount: Number(qData.attemptCount ?? 0),
      lastAttemptAt: qData.lastAttemptAt ?? "",
      lastSubmittedAnswer: qData.lastSubmittedAnswer ?? null,
      createdAt: qData.createdAt,
      updatedAt: qData.updatedAt,
    };
  }

  return { examProgress, questionProgress };
}

export async function recordQuestionAttempt(
  input: QuestionAttemptInput,
): Promise<{
  examProgress: ExamProgress;
  questionProgress: QuestionProgress;
}> {
  const { userId, examId, questionId, submittedAnswer, isCorrect } = input;

  const examProgressRef = adminDb
    .collection("users")
    .doc(userId)
    .collection("examProgress")
    .doc(examId);

  const questionProgressRef = examProgressRef
    .collection("questionProgress")
    .doc(questionId);

  return await adminDb.runTransaction(async (transaction) => {
    const [examProgressDoc, questionProgressDoc] = await Promise.all([
      transaction.get(examProgressRef),
      transaction.get(questionProgressRef),
    ]);

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const nowIso = now.toISOString();

    const prevQuestion = questionProgressDoc.exists
      ? questionProgressDoc.data()
      : null;
    const wasPreviouslyCompleted = Boolean(prevQuestion?.isCompleted);
    const wasPreviouslyCorrect = Boolean(prevQuestion?.isCorrect);
    const prevAttemptCount = Number(prevQuestion?.attemptCount ?? 0);

    const prevExam = examProgressDoc.exists ? examProgressDoc.data() : null;
    let uniqueAnsweredCount = Number(prevExam?.uniqueAnsweredCount ?? 0);
    let incorrectCount = Number(prevExam?.incorrectCount ?? 0);
    const totalAttemptsCount = Number(prevExam?.totalAttemptsCount ?? 0) + 1;
    const dailyGoal = Number(prevExam?.dailyGoal ?? 20);
    const targetExamDate = prevExam?.targetExamDate ?? null;
    const lastActivityDate = prevExam?.lastActivityDate ?? null;
    let todayAnsweredCount = Number(prevExam?.todayAnsweredCount ?? 0);

    if (lastActivityDate !== todayStr) {
      todayAnsweredCount = 1;
    } else {
      todayAnsweredCount += 1;
    }

    if (!wasPreviouslyCompleted) {
      uniqueAnsweredCount += 1;
    }

    if (wasPreviouslyCompleted) {
      if (wasPreviouslyCorrect && !isCorrect) {
        incorrectCount += 1;
      } else if (!wasPreviouslyCorrect && isCorrect) {
        incorrectCount = Math.max(0, incorrectCount - 1);
      }
    } else {
      if (!isCorrect) {
        incorrectCount += 1;
      }
    }

    const updatedQuestionProgress: QuestionProgress = {
      questionId,
      examId,
      isCompleted: true,
      isCorrect,
      bookmarked: Boolean(prevQuestion?.bookmarked),
      attemptCount: prevAttemptCount + 1,
      lastAttemptAt: nowIso,
      lastSubmittedAnswer: submittedAnswer,
      createdAt: prevQuestion?.createdAt ?? nowIso,
      updatedAt: nowIso,
    };

    const updatedExamProgress: ExamProgress = {
      examId,
      userId,
      uniqueAnsweredCount,
      incorrectCount,
      totalAttemptsCount,
      targetExamDate,
      dailyGoal,
      lastActivityDate: todayStr,
      todayAnsweredCount,
      createdAt: prevExam?.createdAt ?? nowIso,
      updatedAt: nowIso,
    };

    transaction.set(questionProgressRef, updatedQuestionProgress, {
      merge: true,
    });
    transaction.set(examProgressRef, updatedExamProgress, { merge: true });

    return {
      examProgress: updatedExamProgress,
      questionProgress: updatedQuestionProgress,
    };
  });
}

export async function toggleQuestionBookmark(params: {
  userId: string;
  examId: string;
  questionId: string;
  bookmarked?: boolean;
}): Promise<boolean> {
  const { userId, examId, questionId } = params;
  const qRef = adminDb
    .collection("users")
    .doc(userId)
    .collection("examProgress")
    .doc(examId)
    .collection("questionProgress")
    .doc(questionId);

  const docSnap = await qRef.get();
  const currentStatus = docSnap.exists
    ? Boolean(docSnap.data()?.bookmarked)
    : false;
  const newStatus =
    params.bookmarked !== undefined ? params.bookmarked : !currentStatus;

  const nowIso = new Date().toISOString();
  await qRef.set(
    {
      questionId,
      examId,
      bookmarked: newStatus,
      updatedAt: nowIso,
      createdAt: docSnap.exists
        ? (docSnap.data()?.createdAt ?? nowIso)
        : nowIso,
    },
    { merge: true },
  );

  return newStatus;
}

export async function updateStudyGoals(params: {
  userId: string;
  examId: string;
  goals: StudyGoalsInput;
}): Promise<ExamProgress> {
  const { userId, examId, goals } = params;
  const examRef = adminDb
    .collection("users")
    .doc(userId)
    .collection("examProgress")
    .doc(examId);

  const nowIso = new Date().toISOString();
  const updateData: Record<string, unknown> = {
    updatedAt: nowIso,
  };

  if (goals.dailyGoal !== undefined) {
    updateData.dailyGoal = goals.dailyGoal;
  }
  if (goals.targetExamDate !== undefined) {
    updateData.targetExamDate = goals.targetExamDate;
  }

  await examRef.set(updateData, { merge: true });

  const updatedDoc = await examRef.get();
  const data = updatedDoc.data() ?? {};

  return {
    examId,
    userId,
    uniqueAnsweredCount: data.uniqueAnsweredCount ?? 0,
    incorrectCount: data.incorrectCount ?? 0,
    totalAttemptsCount: data.totalAttemptsCount ?? 0,
    targetExamDate: data.targetExamDate ?? null,
    dailyGoal: data.dailyGoal ?? 20,
    lastActivityDate: data.lastActivityDate ?? null,
    todayAnsweredCount: data.todayAnsweredCount ?? 0,
    createdAt: data.createdAt ?? nowIso,
    updatedAt: data.updatedAt ?? nowIso,
  };
}
