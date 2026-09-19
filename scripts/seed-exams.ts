import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { DEFAULT_CATALOG_SPACE_ID } from "../src/domain/catalog/constants";
import type { Exam } from "../src/domain/catalog/exam";
import type { Question } from "../src/domain/catalog/question";

interface FixtureData {
  exams: Exam[];
  questions: Question[];
}

function objectProperties(value: object) {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([key]) => key !== "id" && key !== "title" && key !== "examId",
    ),
  );
}

const projectId = process.env.FIREBASE_PROJECT_ID ?? "demo-notes-app";

if (
  process.env.FIRESTORE_EMULATOR_HOST === undefined &&
  !process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
}

const app = getApps()[0] ?? initializeApp({ projectId });
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true });

async function seedExams(): Promise<void> {
  console.log(`[seed-exams] Target Project: ${projectId}`);
  console.log(
    `[seed-exams] Firestore Host: ${process.env.FIRESTORE_EMULATOR_HOST ?? "Google Cloud Production"}`,
  );

  const fixturePath = resolve(
    process.cwd(),
    "src/data/fixtures/sample-exams.json",
  );
  const rawData = readFileSync(fixturePath, "utf-8");
  const data: FixtureData = JSON.parse(rawData);

  console.log(
    `[seed-exams] Loaded ${data.exams.length} exams and ${data.questions.length} questions from fixtures.`,
  );

  const batch = db.batch();
  const nowIso = new Date().toISOString();
  const spaceRef = db.collection("spaces").doc(DEFAULT_CATALOG_SPACE_ID);
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
    { id: "study-plan", singularName: "Study plan", pluralName: "Study plans" },
  ]) {
    batch.set(
      spaceRef.collection("objectTypes").doc(objectType.id),
      { ...objectType, updatedAt: nowIso, createdAt: nowIso },
      { merge: true },
    );
  }

  // 1. Seed Exam documents
  for (const exam of data.exams) {
    const examRef = db.collection("exams").doc(exam.id);
    const examData = {
      ...exam,
      createdAt: exam.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    batch.set(examRef, examData, { merge: true });
    batch.set(
      db
        .collection("spaces")
        .doc(DEFAULT_CATALOG_SPACE_ID)
        .collection("objects")
        .doc(exam.id),
      {
        objectTypeId: "exam",
        properties: objectProperties(exam),
        ...examData,
      },
      { merge: true },
    );
    console.log(`  + Queued Exam: [${exam.code}] ${exam.title} (${exam.id})`);
  }

  // 2. Seed Question documents into /exams/{examId}/questions subcollection
  for (const question of data.questions) {
    const questionRef = db
      .collection("exams")
      .doc(question.examId)
      .collection("questions")
      .doc(question.id);

    const questionData = {
      ...question,
      createdAt: question.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    batch.set(questionRef, questionData, { merge: true });
    batch.set(
      db
        .collection("spaces")
        .doc(DEFAULT_CATALOG_SPACE_ID)
        .collection("objects")
        .doc(question.id),
      {
        objectTypeId: "question",
        title: question.prompt,
        properties: objectProperties(question),
        ...questionData,
      },
      { merge: true },
    );
    batch.set(
      db
        .collection("spaces")
        .doc(DEFAULT_CATALOG_SPACE_ID)
        .collection("relations")
        .doc(`${question.examId}-${question.id}`),
      {
        relationType: "contains-question",
        sourceId: question.examId,
        targetId: question.id,
        properties: { order: question.order ?? 0, domainId: question.domainId },
        createdAt: questionData.createdAt,
        updatedAt: questionData.updatedAt,
      },
      { merge: true },
    );
    console.log(
      `  + Queued Question: ${question.id} [${question.type}] for ${question.examId}`,
    );
  }

  await batch.commit();
  console.log(
    `[seed-exams] Successfully seeded ${data.exams.length} exams and ${data.questions.length} questions!`,
  );
}

seedExams().catch((error) => {
  console.error("[seed-exams] Error seeding exams database:", error);
  process.exit(1);
});
