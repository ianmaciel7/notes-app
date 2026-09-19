import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { beforeAll, describe, expect, it } from "vitest";
import {
  createObjectDraft,
  publishRevision,
  saveDraftRevision,
} from "@/data/objects";
import { createPrivateSpace } from "@/data/spaces";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import {
  ensureQuestionMemory,
  getDueStudyQueue,
  rateQuestionMemory,
} from "./study";

beforeAll(() => {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

  if (getApps().length === 0) {
    initializeApp({ projectId: "demo-notes-app" });
  }
});

const USER = "user-alice";

describe("study repository", () => {
  async function setupQuestion() {
    const space = await createPrivateSpace(USER, "Study Space");
    const q = await createObjectDraft(USER, space.id, "question", "Q1");
    const qPayload: QuestionRevisionPayload = {
      schemaVersion: 1,
      format: "single-choice",
      prompt: "Prompt",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
      ],
      correctOptionIds: ["a"],
      explanation: "Expl",
    };
    await saveDraftRevision(USER, space.id, q.id, qPayload);
    await publishRevision(USER, space.id, q.id);
    return { space, q };
  }

  it("enrolls a question and places it in the due queue", async () => {
    const { space, q } = await setupQuestion();
    await ensureQuestionMemory(USER, space.id, q.id);

    const queue = await getDueStudyQueue(USER, space.id);
    expect(queue.some((item) => item.questionId === q.id)).toBe(true);
  });

  it("records a review transactionally and replays with idempotency key", async () => {
    const { space, q } = await setupQuestion();
    await ensureQuestionMemory(USER, space.id, q.id);

    const key = "review-key-1";
    const first = await rateQuestionMemory({
      userId: USER,
      spaceId: space.id,
      questionId: q.id,
      rating: "good",
      stateVersion: 0,
      idempotencyKey: key,
    });

    const replay = await rateQuestionMemory({
      userId: USER,
      spaceId: space.id,
      questionId: q.id,
      rating: "good",
      stateVersion: 0,
      idempotencyKey: key,
    });

    expect(replay).toEqual(first);

    // Verify only 1 review event was recorded
    const db = getFirestore();
    const eventsSnap = await db
      .collection("users")
      .doc(USER)
      .collection("spaces")
      .doc(space.id)
      .collection("reviewEvents")
      .where("questionId", "==", q.id)
      .get();
    expect(eventsSnap.docs).toHaveLength(1);
  });

  it("rejects review with stale stateVersion", async () => {
    const { space, q } = await setupQuestion();
    await ensureQuestionMemory(USER, space.id, q.id);

    // First rating updates stateVersion to 1
    await rateQuestionMemory({
      userId: USER,
      spaceId: space.id,
      questionId: q.id,
      rating: "good",
      stateVersion: 0,
    });

    // Another tab trying to rate with stateVersion 0 should fail
    await expect(
      rateQuestionMemory({
        userId: USER,
        spaceId: space.id,
        questionId: q.id,
        rating: "again",
        stateVersion: 0,
      }),
    ).rejects.toMatchObject({ code: "stale-state" });
  });
});
