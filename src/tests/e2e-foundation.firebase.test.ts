import { getApps, initializeApp } from "firebase-admin/app";
import { beforeAll, describe, expect, it } from "vitest";
import {
  completeAttempt,
  getAttemptView,
  startAttempt,
  submitAttemptAnswer,
} from "@/data/attempts";
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
import {
  ensureQuestionMemory,
  getDueStudyQueue,
  rateQuestionMemory,
} from "@/data/study";
import type { QuestionRevisionPayload } from "@/domain/questions/question";

beforeAll(() => {
  if (getApps().length === 0) {
    initializeApp({ projectId: "demo-notes-app" });
  }
});

describe("real Firestore foundation lifecycle", () => {
  it("persists and reads the complete learning lifecycle", async () => {
    const userId = "integration-user";
    const space = await createPrivateSpace(userId, "Integration Space");
    const question = await createObjectDraft(
      userId,
      space.id,
      "question",
      "Two plus two",
    );
    const questionPayload: QuestionRevisionPayload = {
      schemaVersion: 1,
      format: "single-choice",
      prompt: "What is 2 + 2?",
      options: [
        { id: "four", text: "4" },
        { id: "five", text: "5" },
      ],
      correctOptionIds: ["four"],
      explanation: "Basic arithmetic.",
    };

    await saveDraftRevision(userId, space.id, question.id, questionPayload);
    const publishedQuestion = await publishRevision(
      userId,
      space.id,
      question.id,
    );

    const exam = await createExamDraft(userId, space.id, "Math Check");
    await saveExamDraft(userId, space.id, exam.id, {
      schemaVersion: 1,
      instructions: "Answer the question.",
      passingPercentage: 100,
      questions: [
        {
          questionId: question.id,
          questionRevisionId: publishedQuestion.id,
          points: 10,
        },
      ],
    });
    const publishedExam = await publishExam(userId, space.id, exam.id);
    expect(publishedExam.publicationState).toBe("published");

    const attempt = await startAttempt(userId, space.id, exam.id);
    const feedback = await submitAttemptAnswer(
      userId,
      space.id,
      attempt.id,
      question.id,
      { optionIds: ["four"] },
    );
    expect(feedback.isCorrect).toBe(true);

    const result = await completeAttempt(userId, space.id, attempt.id);
    expect(result).toMatchObject({ score: 10, maximumScore: 10, passed: true });

    await ensureQuestionMemory(userId, space.id, question.id);
    const queue = await getDueStudyQueue(userId, space.id);
    const dueQuestion = queue.find((item) => item.questionId === question.id);
    expect(dueQuestion).toBeDefined();

    const review = await rateQuestionMemory({
      userId,
      spaceId: space.id,
      questionId: question.id,
      rating: "good",
      stateVersion: dueQuestion?.stateVersion ?? -1,
    });
    expect(review.stateVersion).toBe(1);

    const persistedAttempt = await getAttemptView(userId, space.id, attempt.id);
    expect(persistedAttempt.status).toBe("completed");
  });
});
