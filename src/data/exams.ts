import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { Exam } from "@/types/exam";

export async function getExams(): Promise<Exam[]> {
  const snapshot = await adminDb.collection("exams").get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title ?? "",
      code: data.code ?? "",
      provider: data.provider ?? "generic",
      description: data.description ?? "",
      passingScore: data.passingScore ?? 700,
      passingCriteria: data.passingCriteria ?? {
        passingScore: data.passingScore ?? 700,
        maxScore: 1000,
        percentage: 70,
      },
      durationMinutes: data.durationMinutes ?? 90,
      totalQuestions: data.totalQuestions ?? 0,
      questionCounts: data.questionCounts ?? {
        total: data.totalQuestions ?? 0,
      },
      domains: data.domains ?? [],
      isActive: data.isActive ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as Exam;
  });
}

export async function getExamById(examId: string): Promise<Exam | null> {
  const docRef = adminDb.collection("exams").doc(examId);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return null;
  }

  const data = docSnap.data();
  if (!data) {
    return null;
  }

  return {
    id: docSnap.id,
    title: data.title ?? "",
    code: data.code ?? "",
    provider: data.provider ?? "generic",
    description: data.description ?? "",
    passingScore: data.passingScore ?? 700,
    passingCriteria: data.passingCriteria ?? {
      passingScore: data.passingScore ?? 700,
      maxScore: 1000,
      percentage: 70,
    },
    durationMinutes: data.durationMinutes ?? 90,
    totalQuestions: data.totalQuestions ?? 0,
    questionCounts: data.questionCounts ?? {
      total: data.totalQuestions ?? 0,
    },
    domains: data.domains ?? [],
    isActive: data.isActive ?? true,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as Exam;
}
