import { getApps, initializeApp } from "firebase-admin/app";
import { beforeAll, describe, expect, it } from "vitest";
import {
  createExamDraft,
  publishExam,
  saveExamDraft,
} from "@/data/exam-authoring";
import {
  createObjectDraft,
  publishRevision,
  saveDraftRevision,
} from "@/data/objects";
import { createPrivateSpace } from "@/data/spaces";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import {
  completeAttempt,
  getAttemptView,
  startAttempt,
  submitAttemptAnswer,
  toggleAttemptBookmark,
} from "./attempts";

beforeAll(() => {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

  if (getApps().length === 0) {
    initializeApp({ projectId: "demo-notes-app" });
  }
});

const USER = "user-alice";

describe("attempts repository", () => {
  async function setupExam() {
    const space = await createPrivateSpace(USER, "Attempt Space");
    const q1 = await createObjectDraft(USER, space.id, "question", "Q1");
    const q1Payload: QuestionRevisionPayload = {
      schemaVersion: 1,
      format: "single-choice",
      prompt: "What is 2+2?",
      options: [
        { id: "opt-1", text: "4" },
        { id: "opt-2", text: "5" },
      ],
      correctOptionIds: ["opt-1"],
      explanation: "4 is correct.",
    };
    await saveDraftRevision(USER, space.id, q1.id, q1Payload);
    const q1Pub = await publishRevision(USER, space.id, q1.id);

    const exam = await createExamDraft(USER, space.id, "Math Exam");
    await saveExamDraft(USER, space.id, exam.id, {
      schemaVersion: 1,
      instructions: "Math rules.",
      passingPercentage: 100,
      questions: [
        { questionId: q1.id, questionRevisionId: q1Pub.id, points: 10 },
      ],
    });
    const examPub = await publishExam(USER, space.id, exam.id);

    return { space, q1, q1Pub, q1Payload, exam, examPub };
  }

  it("starts attempt idempotently with a key", async () => {
    const { space, exam } = await setupExam();
    const key = "attempt-key-1";

    const attempt1 = await startAttempt(USER, space.id, exam.id, key);
    const attempt2 = await startAttempt(USER, space.id, exam.id, key);

    expect(attempt1.id).toBe(attempt2.id);
    expect(attempt1.status).toBe("in-progress");
  });

  it("submits an answer, grades against exact question revision, and completes attempt", async () => {
    const { space, q1, q1Payload, exam } = await setupExam();

    const attempt = await startAttempt(USER, space.id, exam.id);

    // Revise question after attempt is started (changing correct option)
    await saveDraftRevision(USER, space.id, q1.id, {
      ...q1Payload,
      correctOptionIds: ["opt-2"], // changed!
    });
    await publishRevision(USER, space.id, q1.id);

    // Answer with opt-1 (correct according to snapshot revision)
    const feedback = await submitAttemptAnswer(
      USER,
      space.id,
      attempt.id,
      q1.id,
      { optionIds: ["opt-1"] },
    );
    expect(feedback.isCorrect).toBe(true);

    // Bookmark question
    const bookmark1 = await toggleAttemptBookmark(
      USER,
      space.id,
      attempt.id,
      q1.id,
    );
    expect(bookmark1.isBookmarked).toBe(true);

    // Complete attempt
    const scoreResult = await completeAttempt(USER, space.id, attempt.id);
    expect(scoreResult.score).toBe(10);
    expect(scoreResult.passed).toBe(true);

    // Viewing attempt returns completed status
    const view = await getAttemptView(USER, space.id, attempt.id);
    expect(view.status).toBe("completed");
    expect(view.score).toBe(10);
  });
});
