import "server-only";

import { getSpaceObject, getSpaceRelations } from "@/data/space-objects";
import { DEFAULT_CATALOG_SPACE_ID } from "@/domain/catalog/constants";
import type { Question, QuestionType } from "@/domain/catalog/question";
import { adminDb } from "@/lib/firebase/admin";

export interface QuestionFilterOptions {
  domainId?: string;
  type?: QuestionType;
  difficulty?: "easy" | "medium" | "hard";
  limit?: number;
}

export async function getPracticeQuestions(
  examId: string,
  filterOptions?: QuestionFilterOptions,
  spaceId = DEFAULT_CATALOG_SPACE_ID,
): Promise<Question[]> {
  const relations = await getSpaceRelations(
    spaceId,
    examId,
    "contains-question",
  );
  if (relations.length > 0) {
    const objects = await Promise.all(
      relations.map((relation) => getSpaceObject(spaceId, relation.targetId)),
    );
    const questions = objects
      .map((object, index) => {
        if (!object || object.objectTypeId !== "question") return null;
        const data = object.properties;
        const relation = relations[index];
        return {
          id: object.id,
          examId,
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
          order: relation.properties?.order ?? data.order ?? index,
          difficulty: data.difficulty,
          createdAt: object.createdAt,
          updatedAt: object.updatedAt,
        } as Question;
      })
      .filter((question): question is Question => question !== null)
      .filter((question) =>
        filterOptions?.domainId
          ? question.domainId === filterOptions.domainId
          : true,
      )
      .filter((question) =>
        filterOptions?.type ? question.type === filterOptions.type : true,
      )
      .filter((question) =>
        filterOptions?.difficulty
          ? question.difficulty === filterOptions.difficulty
          : true,
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return filterOptions?.limit && filterOptions.limit > 0
      ? questions.slice(0, filterOptions.limit)
      : questions;
  }

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
