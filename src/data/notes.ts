import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { QuestionNote } from "@/types/note";

export async function getQuestionNote(
  userId: string,
  questionId: string,
): Promise<QuestionNote | null> {
  const notesRef = adminDb.collection("users").doc(userId).collection("notes");

  // 1. Direct document lookup using standard deterministic question-note id
  const directSnap = await notesRef.doc(`qn_${questionId}`).get();
  if (directSnap.exists) {
    const data = directSnap.data();
    if (data) {
      return {
        noteId: directSnap.id,
        userId,
        questionId: data.questionId ?? questionId,
        examId: data.examId ?? "",
        content: data.content ?? "",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt ?? new Date().toISOString(),
      };
    }
  }

  // 2. Fallback lookup by questionId query
  const querySnap = await notesRef
    .where("questionId", "==", questionId)
    .limit(1)
    .get();

  if (querySnap.empty) {
    return null;
  }

  const doc = querySnap.docs[0];
  const data = doc.data();

  return {
    noteId: doc.id,
    userId,
    questionId: data.questionId ?? questionId,
    examId: data.examId ?? "",
    content: data.content ?? "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  };
}

export async function saveQuestionNote(
  userId: string,
  questionId: string,
  examId: string,
  content: string,
): Promise<QuestionNote> {
  const notesRef = adminDb.collection("users").doc(userId).collection("notes");

  let noteDocRef = notesRef.doc(`qn_${questionId}`);
  const existingDoc = await noteDocRef.get();

  let createdAt = new Date().toISOString();
  if (existingDoc.exists) {
    createdAt = existingDoc.data()?.createdAt ?? createdAt;
  } else {
    const querySnap = await notesRef
      .where("questionId", "==", questionId)
      .limit(1)
      .get();
    if (!querySnap.empty) {
      noteDocRef = querySnap.docs[0].ref;
      createdAt = querySnap.docs[0].data().createdAt ?? createdAt;
    }
  }

  const nowIso = new Date().toISOString();
  const notePayload: QuestionNote = {
    noteId: noteDocRef.id,
    userId,
    questionId,
    examId,
    content,
    createdAt,
    updatedAt: nowIso,
  };

  await noteDocRef.set(notePayload, { merge: true });

  return notePayload;
}
