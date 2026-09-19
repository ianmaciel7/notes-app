import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import sampleData from "@/data/fixtures/sample-exams.json";
import type {
  ExamQuestionReference,
  ExamRevisionPayload,
} from "@/domain/exams/exam";
import type { ObjectRecord, ObjectRevision } from "@/domain/objects/object";
import type {
  AnswerOption,
  QuestionFormat,
  QuestionRevisionPayload,
} from "@/domain/questions/question";

export function convertLegacyQuestion(
  ownerId: string,
  spaceId: string,
  legacyQ: Record<string, unknown>,
): {
  object: ObjectRecord;
  revision: ObjectRevision<QuestionRevisionPayload>;
} {
  const objectId = `q_${String(legacyQ.id)}`;
  const revisionId = `q_${String(legacyQ.id)}_rev_1`;
  const now = "2026-09-18T00:00:00.000Z";

  let format: QuestionFormat = "single-choice";
  if (legacyQ.type === "multiple-choice") {
    format = "multiple-choice";
  } else if (legacyQ.type === "true-false") {
    format = "true-false";
  }

  const rawOptions = (legacyQ.options as Array<Record<string, unknown>>) ?? [];
  const options: AnswerOption[] = rawOptions.map((opt) => ({
    id: String(opt.id),
    text: String(opt.text ?? opt.id),
  }));

  let correctOptionIds: string[] = [];
  if (Array.isArray(legacyQ.correctAnswer)) {
    correctOptionIds = legacyQ.correctAnswer.map(String);
  } else if (legacyQ.correctAnswer !== undefined) {
    correctOptionIds = [String(legacyQ.correctAnswer)];
  } else if (options.length > 0) {
    correctOptionIds = [options[0].id];
  }

  let explanation = "";
  if (typeof legacyQ.explanation === "object" && legacyQ.explanation !== null) {
    explanation = legacyQ.explanation.general ?? "";
  } else if (typeof legacyQ.explanation === "string") {
    explanation = legacyQ.explanation;
  }

  const payload: QuestionRevisionPayload = {
    schemaVersion: 1,
    format,
    prompt: legacyQ.prompt ?? "Untitled Question",
    options: options.length > 0 ? options : [{ id: "opt-1", text: "Option 1" }],
    correctOptionIds,
    explanation: explanation || "Explanation provided.",
  };

  const object: ObjectRecord = {
    id: objectId,
    spaceId,
    ownerId,
    type: "question",
    title: legacyQ.prompt
      ? legacyQ.prompt.slice(0, 100)
      : `Question ${legacyQ.id}`,
    lifecycle: "published",
    latestRevisionId: revisionId,
    publishedRevisionId: revisionId,
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
  };

  const revision: ObjectRevision<QuestionRevisionPayload> = {
    id: revisionId,
    objectId,
    objectType: "question",
    version: 1,
    publicationState: "published",
    payload,
    schemaVersion: 1,
    createdBy: ownerId,
    createdAt: now,
  };

  return { object, revision };
}

export function convertLegacyExam(
  ownerId: string,
  spaceId: string,
  legacyExam: Record<string, unknown>,
  questionRefs: Array<{ questionId: string; revisionId: string }>,
): {
  object: ObjectRecord;
  revision: ObjectRevision<ExamRevisionPayload>;
  relations: Array<{
    id: string;
    spaceId: string;
    type: "exam-question";
    sourceObjectId: string;
    targetObjectId: string;
    targetRevisionId: string;
    position: number;
    points: number;
    schemaVersion: 1;
    createdAt: string;
    updatedAt: string;
  }>;
} {
  const objectId = `e_${String(legacyExam.id)}`;
  const revisionId = `e_${String(legacyExam.id)}_rev_1`;
  const now = "2026-09-18T00:00:00.000Z";

  const questions: ExamQuestionReference[] = questionRefs.map((ref) => ({
    questionId: ref.questionId,
    questionRevisionId: ref.revisionId,
    points: 1,
  }));

  const criteria = legacyExam.passingCriteria as
    | { percentage?: number; maxScore?: number }
    | undefined;
  const passingScore = Number(legacyExam.passingScore ?? 70);
  const maxScore = Number(criteria?.maxScore ?? 100);
  const calculatedPercentage = Math.round((passingScore / maxScore) * 100);

  const payload: ExamRevisionPayload = {
    schemaVersion: 1,
    instructions: (legacyExam.description as string) ?? "Exam instructions.",
    passingPercentage: criteria?.percentage ?? calculatedPercentage,
    questions,
  };

  const object: ObjectRecord = {
    id: objectId,
    spaceId,
    ownerId,
    type: "exam",
    title: (legacyExam.title as string) ?? `Exam ${String(legacyExam.id)}`,
    lifecycle: "published",
    latestRevisionId: revisionId,
    publishedRevisionId: revisionId,
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
  };

  const revision: ObjectRevision<ExamRevisionPayload> = {
    id: revisionId,
    objectId,
    objectType: "exam",
    version: 1,
    publicationState: "published",
    payload,
    schemaVersion: 1,
    createdBy: ownerId,
    createdAt: now,
  };

  const relations = questions.map((q, idx) => ({
    id: `${objectId}_${q.questionId}`,
    spaceId,
    type: "exam-question" as const,
    sourceObjectId: objectId,
    targetObjectId: q.questionId,
    targetRevisionId: q.questionRevisionId,
    position: idx,
    points: q.points,
    schemaVersion: 1 as const,
    createdAt: now,
    updatedAt: now,
  }));

  return { object, revision, relations };
}

export function planMigration(opts: {
  ownerId: string;
  spaceId: string;
  exams: Array<Record<string, unknown>>;
  questions: Array<Record<string, unknown>>;
}) {
  if (!opts.ownerId) {
    throw new Error("MIGRATION_OWNER_UID is required.");
  }
  if (!opts.spaceId) {
    throw new Error("MIGRATION_SPACE_ID is required.");
  }

  const convertedQuestions = opts.questions.map((q) =>
    convertLegacyQuestion(opts.ownerId, opts.spaceId, q),
  );

  const questionMap = new Map<
    string,
    { questionId: string; revisionId: string }
  >();
  for (let i = 0; i < opts.questions.length; i++) {
    const legacyQ = opts.questions[i];
    const converted = convertedQuestions[i];
    questionMap.set(legacyQ.id, {
      questionId: converted.object.id,
      revisionId: converted.revision.id,
    });
  }

  const convertedExams = opts.exams.map((exam) => {
    const matchedRefs: Array<{ questionId: string; revisionId: string }> = [];
    for (const legacyQ of opts.questions) {
      if (legacyQ.examId === exam.id) {
        const ref = questionMap.get(legacyQ.id);
        if (ref) matchedRefs.push(ref);
      }
    }
    return convertLegacyExam(opts.ownerId, opts.spaceId, exam, matchedRefs);
  });

  return {
    questions: convertedQuestions,
    exams: convertedExams,
  };
}

async function runCli() {
  const ownerId = process.env.MIGRATION_OWNER_UID;
  const spaceId = process.env.MIGRATION_SPACE_ID;
  const isApply = process.argv.includes("--apply");
  const allowProduction = process.argv.includes("--allow-production");

  if (!ownerId || !spaceId) {
    console.error(
      "Error: MIGRATION_OWNER_UID and MIGRATION_SPACE_ID are required.",
    );
    process.exit(1);
  }

  const projectId =
    process.env.GCLOUD_PROJECT ||
    process.env.FIREBASE_CONFIG ||
    "demo-notes-app";
  if (!projectId.includes("demo") && !allowProduction) {
    console.error(
      "Error: Target project appears to be production. Pass --allow-production to proceed.",
    );
    process.exit(1);
  }

  const plan = planMigration({
    ownerId,
    spaceId,
    exams: sampleData.exams,
    questions: sampleData.questions,
  });

  console.log(
    `=== Migration Plan for Space "${spaceId}" (Owner "${ownerId}") ===`,
  );
  console.log(`Questions to migrate: ${plan.questions.length}`);
  console.log(`Exams to migrate: ${plan.exams.length}`);
  const totalRelations = plan.exams.reduce((s, e) => s + e.relations.length, 0);
  console.log(`Relations to migrate: ${totalRelations}`);

  if (!isApply) {
    console.log(
      "\n[DRY RUN ONLY] No documents were written. Pass --apply to execute.",
    );
    return;
  }

  if (getApps().length === 0) {
    initializeApp();
  }
  const db = getFirestore();
  const batch = db.batch();

  for (const { object, revision } of plan.questions) {
    const objRef = db
      .collection("spaces")
      .doc(spaceId)
      .collection("objects")
      .doc(object.id);
    batch.set(objRef, object);
    const revRef = objRef.collection("revisions").doc(revision.id);
    batch.set(revRef, revision);
  }

  for (const { object, revision, relations } of plan.exams) {
    const objRef = db
      .collection("spaces")
      .doc(spaceId)
      .collection("objects")
      .doc(object.id);
    batch.set(objRef, object);
    const revRef = objRef.collection("revisions").doc(revision.id);
    batch.set(revRef, revision);
    for (const rel of relations) {
      const relRef = db
        .collection("spaces")
        .doc(spaceId)
        .collection("relations")
        .doc(rel.id);
      batch.set(relRef, rel);
    }
  }

  await batch.commit();
  console.log("\nMigration completed successfully.");
}

if (process.argv[1]?.endsWith("migrate-exam-fsrs-foundation.ts")) {
  runCli().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
