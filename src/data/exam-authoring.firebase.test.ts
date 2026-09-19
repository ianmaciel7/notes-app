import { getApps, initializeApp } from "firebase-admin/app";
import { beforeAll, describe, expect, it } from "vitest";
import {
  createObjectDraft,
  publishRevision,
  saveDraftRevision,
} from "@/data/objects";
import { createPrivateSpace } from "@/data/spaces";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import {
  createExamDraft,
  getExamAuthoringView,
  getPublishedExamView,
  publishExam,
  saveExamDraft,
} from "./exam-authoring";

beforeAll(() => {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

  if (getApps().length === 0) {
    initializeApp({ projectId: "demo-notes-app" });
  }
});

const OWNER = "user-alice";

describe("exam authoring repository", () => {
  it("publishes an exam with immutable question snapshot", async () => {
    const space = await createPrivateSpace(OWNER, "Exam Space");
    const q1 = await createObjectDraft(OWNER, space.id, "question", "Q1");
    const q1Payload: QuestionRevisionPayload = {
      schemaVersion: 1,
      format: "single-choice",
      prompt: "Q1 Prompt",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
      ],
      correctOptionIds: ["a"],
      explanation: "Expl 1",
    };
    await saveDraftRevision(OWNER, space.id, q1.id, q1Payload);
    const q1Pub = await publishRevision(OWNER, space.id, q1.id);

    const exam = await createExamDraft(OWNER, space.id, "Certification Exam");
    await saveExamDraft(OWNER, space.id, exam.id, {
      schemaVersion: 1,
      instructions: "Take your time.",
      passingPercentage: 70,
      questions: [
        { questionId: q1.id, questionRevisionId: q1Pub.id, points: 5 },
      ],
    });

    const publishedExamRev = await publishExam(OWNER, space.id, exam.id);
    expect(publishedExamRev.publicationState).toBe("published");
    expect(publishedExamRev.payload.questions).toEqual([
      { questionId: q1.id, questionRevisionId: q1Pub.id, points: 5 },
    ]);

    // Update Q1 with a new revision
    await saveDraftRevision(OWNER, space.id, q1.id, {
      ...q1Payload,
      prompt: "Q1 Prompt Modified",
    });
    await publishRevision(OWNER, space.id, q1.id);

    // Verify published exam view still points to the old q1Pub.id
    const publishedView = await getPublishedExamView(OWNER, space.id, exam.id);
    expect(publishedView.payload.questions[0].questionRevisionId).toBe(
      q1Pub.id,
    );
  });

  it("rejects publishing an exam with unpublished question revision", async () => {
    const space = await createPrivateSpace(OWNER, "Exam Space");
    const q1 = await createObjectDraft(OWNER, space.id, "question", "Q1");
    const q1Rev = await saveDraftRevision(OWNER, space.id, q1.id, {
      schemaVersion: 1,
      format: "single-choice",
      prompt: "Draft only",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
      ],
      correctOptionIds: ["a"],
      explanation: "Expl",
    });

    const exam = await createExamDraft(OWNER, space.id, "Invalid Exam");
    await saveExamDraft(OWNER, space.id, exam.id, {
      schemaVersion: 1,
      instructions: "Rules",
      passingPercentage: 70,
      questions: [
        { questionId: q1.id, questionRevisionId: q1Rev.id, points: 1 },
      ],
    });

    await expect(publishExam(OWNER, space.id, exam.id)).rejects.toThrow();
  });

  it("loads exam authoring view with draft payload", async () => {
    const space = await createPrivateSpace(OWNER, "Exam Space");
    const exam = await createExamDraft(OWNER, space.id, "View Exam");
    await saveExamDraft(OWNER, space.id, exam.id, {
      schemaVersion: 1,
      instructions: "Instructions",
      passingPercentage: 80,
      questions: [],
    });

    const authoringView = await getExamAuthoringView(OWNER, space.id, exam.id);
    expect(authoringView.id).toBe(exam.id);
    expect(authoringView.draftPayload?.passingPercentage).toBe(80);
  });
});
