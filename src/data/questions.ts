import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { Question, QuestionType } from "@/types/question";

export interface QuestionFilterOptions {
  domainId?: string;
  type?: QuestionType;
  difficulty?: "easy" | "medium" | "hard";
  limit?: number;
}

export async function getPracticeQuestions(
  examId: string,
  filterOptions?: QuestionFilterOptions,
): Promise<Question[]> {
  let query: FirebaseFirestore.Query = adminDb
    .collection("exams")
    .doc(examId)
    .collection("questions");

  if (filterOptions?.domainId) {
    query = query.where("domainId", "==", filterOptions.domainId);
  }

  if (filterOptions?.type) {
    query = query.where("type", "==", filterOptions.type);
  }

  if (filterOptions?.difficulty) {
    query = query.where("difficulty", "==", filterOptions.difficulty);
  }

  if (filterOptions?.limit && filterOptions.limit > 0) {
    query = query.limit(filterOptions.limit);
  }

  const snapshot = await query.get();

  if (snapshot.empty) {
    return [];
  }

  const questions = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      examId: data.examId ?? examId,
      domainId: data.domainId ?? "",
      type: data.type as QuestionType,
      prompt: data.prompt ?? "",
      options: data.options,
      caseStudy: data.caseStudy,
      hotspotImage: data.hotspotImage,
      hotspotAreas: data.hotspotAreas,
      dragDropItems: data.dragDropItems,
      dragDropSlots: data.dragDropSlots,
      correctAnswer: data.correctAnswer,
      explanation: data.explanation ?? { general: "" },
      order: data.order ?? 0,
      difficulty: data.difficulty,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as Question;
  });

  return questions.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getSimulationQuestions(
  examId: string,
  count?: number,
): Promise<Question[]> {
  const allQuestions = await getPracticeQuestions(examId);

  if (allQuestions.length === 0) {
    return [];
  }

  // Shuffle array using Fisher-Yates algorithm for fair mock exam distribution
  const shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  const targetCount = count && count > 0 ? count : shuffled.length;
  return shuffled.slice(0, targetCount);
}
