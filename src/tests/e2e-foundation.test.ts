import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  ExamQuestionReference,
  ExamRevisionPayload,
} from "@/domain/exams/exam";
import type { ObjectRecord, ObjectRevision } from "@/domain/objects/object";
import type { QuestionRevisionPayload } from "@/domain/questions/question";
import { DomainError } from "@/domain/shared/domain-error";
import {
  createMemoryCard,
  scheduleMemoryReview,
} from "@/domain/study/fsrs-scheduler";

// ── Mock data access boundaries ──────────────────────────────────────────

vi.mock("@/data/action-auth", () => ({
  requireActionUser: vi.fn(),
}));

vi.mock("@/data/spaces", () => ({
  createPrivateSpace: vi.fn(),
  getOwnedSpace: vi.fn(),
  listOwnedSpaces: vi.fn(),
  renameOwnedSpace: vi.fn(),
}));

vi.mock("@/data/objects", () => ({
  createObjectDraft: vi.fn(),
  saveDraftRevision: vi.fn(),
  publishRevision: vi.fn(),
  archiveObject: vi.fn(),
  getObjectRevision: vi.fn(),
}));

vi.mock("@/data/exam-authoring", () => ({
  createExamDraft: vi.fn(),
  saveExamDraft: vi.fn(),
  publishExam: vi.fn(),
}));

vi.mock("@/data/object-relations", () => ({
  replaceExamQuestionRelations: vi.fn(),
}));

vi.mock("@/data/attempts", () => ({
  startAttempt: vi.fn(),
  submitAttemptAnswer: vi.fn(),
  completeAttempt: vi.fn(),
  toggleAttemptBookmark: vi.fn(),
  getAttemptView: vi.fn(),
}));

vi.mock("@/data/study", () => ({
  ensureQuestionMemory: vi.fn(),
  getDueStudyQueue: vi.fn(),
  rateQuestionMemory: vi.fn(),
  previewReviewRatings: vi.fn(),
}));

// ── Module Imports under test ─────────────────────────────────────────────

import { requireActionUser } from "@/data/action-auth";
import {
  completeAttempt,
  startAttempt,
  submitAttemptAnswer,
} from "@/data/attempts";
import {
  createExamDraft,
  publishExam,
  saveExamDraft,
} from "@/data/exam-authoring";
import { replaceExamQuestionRelations } from "@/data/object-relations";
import {
  createObjectDraft,
  publishRevision,
  saveDraftRevision,
} from "@/data/objects";
import { createPrivateSpace, getOwnedSpace } from "@/data/spaces";
import {
  ensureQuestionMemory,
  getDueStudyQueue,
  rateQuestionMemory,
} from "@/data/study";
import {
  completeAttemptAction,
  startAttemptAction,
  submitAttemptAnswerAction,
} from "@/lib/actions/attempt-actions";
import {
  createExamDraftAction,
  publishExamAction,
  replaceExamQuestionsAction,
} from "@/lib/actions/exam-authoring-actions";
import {
  createQuestionDraftAction,
  publishQuestionAction,
  saveQuestionDraftAction,
} from "@/lib/actions/question-actions";
import { createSpaceAction } from "@/lib/actions/space-actions";
import {
  getDueStudyQueueAction,
  rateQuestionMemoryAction,
} from "@/lib/actions/study-actions";

describe("End-to-End Foundation Integration Lifecycle", () => {
  const TEST_USER = { uid: "user-alice-123", email: "alice@example.com" };

  // Stateful In-Memory Store
  let spaceStore: Map<
    string,
    { id: string; ownerId: string; name: string; createdAt: string }
  >;
  let objectStore: Map<string, ObjectRecord>;
  let revisionStore: Map<string, ObjectRevision<unknown>>;
  let examRelationsStore: Map<string, ExamQuestionReference[]>;
  let attemptStore: Map<
    string,
    {
      id: string;
      userId: string;
      spaceId: string;
      examId: string;
      examRevisionId: string;
      status: "in-progress" | "completed";
      passingPercentage: number;
      items: Map<
        string,
        {
          questionId: string;
          questionRevisionId: string;
          points: number;
          submittedAnswer?: { optionIds: string[] };
          isCorrect?: boolean;
        }
      >;
      createdAt: string;
      updatedAt: string;
    }
  >;
  let questionMemoryStore: Map<
    string,
    {
      questionId: string;
      dueAt: string;
      stateVersion: number;
      reviewCount: number;
      lastReviewedAt?: string;
      card: ReturnType<typeof createMemoryCard>;
    }
  >;

  let idCounter = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    idCounter = 1;

    spaceStore = new Map();
    objectStore = new Map();
    revisionStore = new Map();
    examRelationsStore = new Map();
    attemptStore = new Map();
    questionMemoryStore = new Map();

    // Default authenticated user
    vi.mocked(requireActionUser).mockResolvedValue(TEST_USER);

    // Spaces mock
    vi.mocked(createPrivateSpace).mockImplementation(async (ownerId, name) => {
      const id = `space-${idCounter++}`;
      const record = {
        id,
        ownerId,
        name,
        visibility: "private" as const,
        schemaVersion: 1 as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      spaceStore.set(id, record);
      return record;
    });

    vi.mocked(getOwnedSpace).mockImplementation(
      async (requesterId, spaceId) => {
        const space = spaceStore.get(spaceId);
        if (!space || space.ownerId !== requesterId) {
          throw new DomainError("forbidden");
        }
        return {
          ...space,
          visibility: "private" as const,
          schemaVersion: 1 as const,
          updatedAt: space.createdAt,
        };
      },
    );

    // Objects mock
    vi.mocked(createObjectDraft).mockImplementation(
      async (ownerId, spaceId, type, title) => {
        const id = `obj-${idCounter++}`;
        const now = new Date().toISOString();
        const record: ObjectRecord = {
          id,
          spaceId,
          ownerId,
          type,
          title,
          lifecycle: "draft",
          latestRevisionId: "",
          schemaVersion: 1,
          createdAt: now,
          updatedAt: now,
        };
        objectStore.set(id, record);
        return record;
      },
    );

    vi.mocked(saveDraftRevision).mockImplementation(
      async (ownerId, spaceId, objectId, payload) => {
        const obj = objectStore.get(objectId);
        if (!obj || obj.ownerId !== ownerId || obj.spaceId !== spaceId) {
          throw new DomainError("forbidden");
        }
        const revId = `rev-${idCounter++}`;
        const now = new Date().toISOString();
        const revision: ObjectRevision<unknown> = {
          id: revId,
          objectId,
          objectType: obj.type,
          version: 1,
          payload,
          publicationState: "draft",
          schemaVersion: 1,
          createdBy: ownerId,
          createdAt: now,
        };
        revisionStore.set(revId, revision);
        obj.latestRevisionId = revId;
        return revision;
      },
    );

    vi.mocked(publishRevision).mockImplementation(
      async (ownerId, spaceId, objectId) => {
        const obj = objectStore.get(objectId);
        if (!obj || obj.ownerId !== ownerId || obj.spaceId !== spaceId) {
          throw new DomainError("forbidden");
        }
        if (!obj.latestRevisionId) {
          throw new DomainError("lifecycle-conflict");
        }
        const rev = revisionStore.get(obj.latestRevisionId);
        if (!rev) {
          throw new DomainError("not-found");
        }
        const publishedRev = {
          ...rev,
          publicationState: "published" as const,
          updatedAt: new Date().toISOString(),
        };
        revisionStore.set(publishedRev.id, publishedRev);
        obj.publishedRevisionId = publishedRev.id;
        obj.lifecycle = "published";
        return publishedRev;
      },
    );

    // Exam Authoring mock
    vi.mocked(createExamDraft).mockImplementation(
      async (ownerId, spaceId, title) => {
        const id = `exam-${idCounter++}`;
        const now = new Date().toISOString();
        const record: ObjectRecord = {
          id,
          spaceId,
          ownerId,
          type: "exam",
          title,
          lifecycle: "draft",
          latestRevisionId: "",
          schemaVersion: 1,
          createdAt: now,
          updatedAt: now,
        };
        objectStore.set(id, record);
        return record;
      },
    );

    vi.mocked(saveExamDraft).mockImplementation(
      async (ownerId, spaceId, examId, payload) => {
        const obj = objectStore.get(examId);
        if (!obj || obj.ownerId !== ownerId || obj.spaceId !== spaceId) {
          throw new DomainError("forbidden");
        }
        const revId = `exam-rev-${idCounter++}`;
        const now = new Date().toISOString();
        const revision: ObjectRevision<ExamRevisionPayload> = {
          id: revId,
          objectId: examId,
          objectType: "exam",
          version: 1,
          payload,
          publicationState: "draft",
          schemaVersion: 1,
          createdBy: ownerId,
          createdAt: now,
        };
        revisionStore.set(revId, revision as ObjectRevision<unknown>);
        obj.latestRevisionId = revId;
        return revision;
      },
    );

    vi.mocked(replaceExamQuestionRelations).mockImplementation(
      async (_ownerId, _spaceId, examId, questionRefs) => {
        examRelationsStore.set(examId, questionRefs);
      },
    );

    vi.mocked(publishExam).mockImplementation(
      async (ownerId, spaceId, examId) => {
        const obj = objectStore.get(examId);
        if (!obj || obj.ownerId !== ownerId || obj.spaceId !== spaceId) {
          throw new DomainError("forbidden");
        }
        const questions = examRelationsStore.get(examId) ?? [];
        if (questions.length === 0) {
          throw new DomainError("validation-failed", {
            message: "Exam must have at least one question.",
          });
        }
        const revId = `exam-pub-${idCounter++}`;
        const now = new Date().toISOString();
        const publishedRev: ObjectRevision<ExamRevisionPayload> = {
          id: revId,
          objectId: examId,
          objectType: "exam",
          version: 1,
          payload: {
            schemaVersion: 1,
            instructions: "Standard assessment",
            passingPercentage: 70,
            questions,
          },
          publicationState: "published",
          schemaVersion: 1,
          createdBy: ownerId,
          createdAt: now,
        };
        revisionStore.set(revId, publishedRev as ObjectRevision<unknown>);
        obj.publishedRevisionId = revId;
        obj.lifecycle = "published";
        return publishedRev;
      },
    );

    // Study memory mock
    vi.mocked(ensureQuestionMemory).mockImplementation(
      async (_userId, _spaceId, questionId) => {
        if (!questionMemoryStore.has(questionId)) {
          const now = new Date();
          const card = createMemoryCard(now);
          questionMemoryStore.set(questionId, {
            questionId,
            dueAt: now.toISOString(),
            stateVersion: 0,
            reviewCount: 0,
            card,
          });
        }
      },
    );

    vi.mocked(getDueStudyQueue).mockImplementation(
      async (_userId, _spaceId, _limit) => {
        return Array.from(questionMemoryStore.values()).map((mem) => ({
          questionId: mem.questionId,
          dueAt: mem.dueAt,
          stateVersion: mem.stateVersion,
          isDue: true,
          prompt: "Prompt",
        }));
      },
    );

    vi.mocked(rateQuestionMemory).mockImplementation(async (cmd) => {
      const mem = questionMemoryStore.get(cmd.questionId);
      if (!mem) {
        throw new DomainError("not-found");
      }
      if (mem.stateVersion !== cmd.stateVersion) {
        throw new DomainError("stale-state", {
          message: `Stale stateVersion ${cmd.stateVersion}, expected ${mem.stateVersion}`,
        });
      }
      const now = new Date();
      const transition = scheduleMemoryReview({
        previous: mem.card,
        rating: cmd.rating,
        now,
        stateVersion: mem.stateVersion,
      });
      const nowIso = now.toISOString();
      mem.card = transition.resultingCard;
      mem.stateVersion = transition.stateVersion;
      mem.reviewCount += 1;
      mem.lastReviewedAt = nowIso;
      mem.dueAt = transition.resultingCard.due;

      return {
        questionId: cmd.questionId,
        dueAt: mem.dueAt,
        stateVersion: mem.stateVersion,
        reviewCount: mem.reviewCount,
        lastReviewedAt: mem.lastReviewedAt,
        card: mem.card,
      };
    });

    // Attempts mock
    vi.mocked(startAttempt).mockImplementation(
      async (userId, spaceId, examId) => {
        const exam = objectStore.get(examId);
        if (
          !exam ||
          exam.lifecycle !== "published" ||
          !exam.publishedRevisionId
        ) {
          throw new DomainError("lifecycle-conflict");
        }
        const examRev = revisionStore.get(
          exam.publishedRevisionId,
        ) as ObjectRevision<ExamRevisionPayload>;
        const attId = `att-${idCounter++}`;
        const now = new Date().toISOString();
        const items = new Map<
          string,
          {
            questionId: string;
            questionRevisionId: string;
            points: number;
            submittedAnswer?: { optionIds: string[] };
            isCorrect?: boolean;
          }
        >();
        for (const ref of examRev.payload.questions) {
          items.set(ref.questionId, {
            questionId: ref.questionId,
            questionRevisionId: ref.questionRevisionId,
            points: ref.points,
          });
        }
        const record = {
          id: attId,
          userId,
          spaceId,
          examId,
          examRevisionId: exam.publishedRevisionId,
          status: "in-progress" as const,
          passingPercentage: examRev.payload.passingPercentage,
          items,
          createdAt: now,
          updatedAt: now,
        };
        attemptStore.set(attId, record);
        return {
          id: attId,
          userId,
          spaceId,
          examId,
          examRevisionId: exam.publishedRevisionId,
          status: "in-progress",
          passingPercentage: examRev.payload.passingPercentage,
          createdAt: now,
          updatedAt: now,
        };
      },
    );

    vi.mocked(submitAttemptAnswer).mockImplementation(
      async (userId, spaceId, attemptId, questionId, answer) => {
        const att = attemptStore.get(attemptId);
        if (!att || att.userId !== userId || att.status !== "in-progress") {
          throw new DomainError("lifecycle-conflict");
        }
        const item = att.items.get(questionId);
        if (!item) {
          throw new DomainError("not-found");
        }
        const rev = revisionStore.get(
          item.questionRevisionId,
        ) as ObjectRevision<QuestionRevisionPayload>;
        const isCorrect =
          JSON.stringify(answer.optionIds.slice().sort()) ===
          JSON.stringify(rev.payload.correctOptionIds.slice().sort());
        item.submittedAnswer = answer;
        item.isCorrect = isCorrect;

        // Auto enroll memory upon answer submission
        await ensureQuestionMemory(userId, spaceId, questionId);

        return {
          questionId,
          isCorrect,
          correctOptionIds: rev.payload.correctOptionIds,
          explanation: rev.payload.explanation,
        };
      },
    );

    vi.mocked(completeAttempt).mockImplementation(
      async (userId, _spaceId, attemptId) => {
        const att = attemptStore.get(attemptId);
        if (!att || att.userId !== userId || att.status !== "in-progress") {
          throw new DomainError("lifecycle-conflict");
        }
        let score = 0;
        let maximumScore = 0;
        for (const item of att.items.values()) {
          maximumScore += item.points;
          if (item.isCorrect) {
            score += item.points;
          }
        }
        const percentage =
          maximumScore > 0 ? Math.round((score / maximumScore) * 100) : 0;
        const passed = percentage >= att.passingPercentage;
        att.status = "completed";

        return {
          attemptId,
          score,
          maximumScore,
          percentage,
          passed,
          completedAt: new Date().toISOString(),
        };
      },
    );
  });

  it("executes the full exam and study lifecycle end-to-end", async () => {
    // -----------------------------------------------------------------------
    // a. Space creation via createSpaceAction
    // -----------------------------------------------------------------------
    const spaceRes = await createSpaceAction({ name: "Medical Prep Space" });
    expect(spaceRes.ok).toBe(true);
    if (!spaceRes.ok) throw new Error("Expected space creation to succeed");

    const spaceId = spaceRes.data.id;
    expect(spaceRes.data.name).toBe("Medical Prep Space");

    // -----------------------------------------------------------------------
    // b. Question creation, save draft, and publish
    // -----------------------------------------------------------------------
    const createQRes = await createQuestionDraftAction({
      spaceId,
      title: "Cell Organelles",
    });
    expect(createQRes.ok).toBe(true);
    if (!createQRes.ok) throw new Error("Question draft creation failed");

    const questionId = createQRes.data.id;
    expect(createQRes.data.lifecycle).toBe("draft");

    const questionPayload: QuestionRevisionPayload = {
      schemaVersion: 1,
      format: "single-choice",
      prompt: "Which organelle is considered the powerhouse of the cell?",
      options: [
        { id: "opt-mito", text: "Mitochondria" },
        { id: "opt-ribo", text: "Ribosome" },
        { id: "opt-golgi", text: "Golgi Apparatus" },
      ],
      correctOptionIds: ["opt-mito"],
      explanation: "Mitochondria generate most of the cell's ATP.",
    };

    const saveQRes = await saveQuestionDraftAction({
      spaceId,
      questionId,
      payload: questionPayload,
    });
    expect(saveQRes.ok).toBe(true);
    if (!saveQRes.ok) throw new Error("Saving question draft failed");

    const questionRevId = saveQRes.data.id;
    expect(saveQRes.data.publicationState).toBe("draft");

    const pubQRes = await publishQuestionAction({
      spaceId,
      questionId,
    });
    expect(pubQRes.ok).toBe(true);
    if (!pubQRes.ok) throw new Error("Publishing question failed");
    expect(pubQRes.data.publicationState).toBe("published");

    // -----------------------------------------------------------------------
    // c. Exam creation, question composition, and publication
    // -----------------------------------------------------------------------
    const createExamRes = await createExamDraftAction({
      spaceId,
      title: "Biology 101 Midterm",
    });
    expect(createExamRes.ok).toBe(true);
    if (!createExamRes.ok) throw new Error("Exam draft creation failed");

    const examId = createExamRes.data.id;
    expect(createExamRes.data.type).toBe("exam");

    const questionRefs: ExamQuestionReference[] = [
      {
        questionId,
        questionRevisionId: questionRevId,
        points: 10,
      },
    ];

    const composeRes = await replaceExamQuestionsAction({
      spaceId,
      examId,
      questionRefs,
    });
    expect(composeRes.ok).toBe(true);

    const pubExamRes = await publishExamAction({
      spaceId,
      examId,
    });
    expect(pubExamRes.ok).toBe(true);
    if (!pubExamRes.ok) throw new Error("Publishing exam failed");
    expect(pubExamRes.data.publicationState).toBe("published");
    expect(pubExamRes.data.payload.questions).toHaveLength(1);

    // -----------------------------------------------------------------------
    // d. Attempt start, answer submission, and completion
    // -----------------------------------------------------------------------
    const startRes = await startAttemptAction({
      spaceId,
      examId,
      idempotencyKey: "attempt-req-1",
    });
    expect(startRes.ok).toBe(true);
    if (!startRes.ok) throw new Error("Starting attempt failed");

    const attemptId = startRes.data.id;
    expect(startRes.data.status).toBe("in-progress");

    // Submit correct answer
    const submitRes = await submitAttemptAnswerAction({
      spaceId,
      attemptId,
      questionId,
      answer: { optionIds: ["opt-mito"] },
    });
    expect(submitRes.ok).toBe(true);
    if (!submitRes.ok) throw new Error("Submitting attempt answer failed");
    expect(submitRes.data.isCorrect).toBe(true);
    expect(submitRes.data.correctOptionIds).toEqual(["opt-mito"]);

    // Complete the attempt
    const completeRes = await completeAttemptAction({
      spaceId,
      attemptId,
    });
    expect(completeRes.ok).toBe(true);
    if (!completeRes.ok) throw new Error("Completing attempt failed");
    expect(completeRes.data.score).toBe(10);
    expect(completeRes.data.maximumScore).toBe(10);
    expect(completeRes.data.percentage).toBe(100);
    expect(completeRes.data.passed).toBe(true);

    // -----------------------------------------------------------------------
    // e. Automatic memory enrollment & FSRS queue review
    // -----------------------------------------------------------------------
    // Verify question was automatically enrolled in study memory by submitAttemptAnswerAction
    const queueRes = await getDueStudyQueueAction({ spaceId });
    expect(queueRes.ok).toBe(true);
    if (!queueRes.ok) throw new Error("Fetching study queue failed");

    expect(queueRes.data.length).toBeGreaterThanOrEqual(1);
    const queuedQuestion = queueRes.data.find(
      (q) => q.questionId === questionId,
    );
    expect(queuedQuestion).toBeDefined();
    if (!queuedQuestion) {
      throw new Error("Expected queued question to be defined");
    }
    expect(queuedQuestion.stateVersion).toBe(0);

    // Rate the question memory with FSRS ('good')
    const rateRes = await rateQuestionMemoryAction({
      spaceId,
      questionId,
      rating: "good",
      stateVersion: queuedQuestion.stateVersion,
    });
    expect(rateRes.ok).toBe(true);
    if (!rateRes.ok) throw new Error("Rating question memory failed");

    expect(rateRes.data.stateVersion).toBe(1);
    expect(rateRes.data.reviewCount).toBe(1);
    expect(new Date(rateRes.data.dueAt).getTime()).toBeGreaterThan(0);

    // Concurrency verification: duplicate rating with stale stateVersion (0) must fail
    const staleRateRes = await rateQuestionMemoryAction({
      spaceId,
      questionId,
      rating: "good",
      stateVersion: 0,
    });
    expect(staleRateRes.ok).toBe(false);
    if (!staleRateRes.ok) {
      expect(staleRateRes.error.code).toBe("stale-state");
    }
  });

  it("enforces authentication on all action entry points", async () => {
    vi.mocked(requireActionUser).mockRejectedValue(
      new DomainError("unauthenticated"),
    );

    const spaceResult = await createSpaceAction({ name: "Unauthorized Space" });
    expect(spaceResult).toEqual({
      ok: false,
      error: { code: "unauthenticated" },
    });

    const questionResult = await createQuestionDraftAction({
      spaceId: "space-1",
      title: "No Auth Q",
    });
    expect(questionResult).toEqual({
      ok: false,
      error: { code: "unauthenticated" },
    });

    const examResult = await createExamDraftAction({
      spaceId: "space-1",
      title: "No Auth Exam",
    });
    expect(examResult).toEqual({
      ok: false,
      error: { code: "unauthenticated" },
    });

    const attemptResult = await startAttemptAction({
      spaceId: "space-1",
      examId: "exam-1",
    });
    expect(attemptResult).toEqual({
      ok: false,
      error: { code: "unauthenticated" },
    });

    const queueResult = await getDueStudyQueueAction({ spaceId: "space-1" });
    expect(queueResult).toEqual({
      ok: false,
      error: { code: "unauthenticated" },
    });
  });
});
