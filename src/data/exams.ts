import "server-only";

import { getSpaceObject, getSpaceObjects } from "@/data/space-objects";
import { DEFAULT_CATALOG_SPACE_ID } from "@/domain/catalog/constants";
import type { Exam } from "@/domain/catalog/exam";
import { adminDb } from "@/lib/firebase/admin";

function toExam(
  id: string,
  object: {
    title: string;
    properties: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
  },
): Exam {
  const data = object.properties;
  return {
    id,
    title: object.title,
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
    questionCounts: data.questionCounts ?? { total: data.totalQuestions ?? 0 },
    domains: data.domains ?? [],
    isActive: data.isActive ?? true,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt,
  } as Exam;
}

export async function getExams(
  spaceId = DEFAULT_CATALOG_SPACE_ID,
): Promise<Exam[]> {
  const objects = await getSpaceObjects(spaceId, "exam");
  if (objects.length > 0) {
    return objects.map((object) => toExam(object.id, object));
  }

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

export async function getExamById(
  examId: string,
  spaceId = DEFAULT_CATALOG_SPACE_ID,
): Promise<Exam | null> {
  const object = await getSpaceObject(spaceId, examId);
  if (object?.objectTypeId === "exam") {
    return toExam(object.id, object);
  }

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
