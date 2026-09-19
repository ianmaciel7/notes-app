import { beforeEach, describe, expect, it, vi } from "vitest";
import { DomainError } from "@/domain/shared/domain-error";
import {
  archiveExamAction,
  createExamAction,
  publishExamAction,
  replaceExamQuestionsAction,
  saveExamDraftAction,
} from "./exam-authoring-actions";

vi.mock("@/data/action-auth", () => ({
  requireActionUser: vi.fn(),
}));

vi.mock("@/data/exam-authoring", () => ({
  createExamDraft: vi.fn(),
  saveExamDraft: vi.fn(),
  publishExam: vi.fn(),
}));

vi.mock("@/data/objects", () => ({
  archiveObject: vi.fn(),
}));

vi.mock("@/data/object-relations", () => ({
  replaceExamQuestionRelations: vi.fn(),
}));

import { requireActionUser } from "@/data/action-auth";
import {
  createExamDraft,
  publishExam,
  saveExamDraft,
} from "@/data/exam-authoring";
import { replaceExamQuestionRelations } from "@/data/object-relations";
import { archiveObject } from "@/data/objects";

describe("exam authoring actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated when user is not logged in", async () => {
    vi.mocked(requireActionUser).mockRejectedValue(
      new DomainError("unauthenticated"),
    );

    const result = await createExamAction({
      spaceId: "space-1",
      title: "AWS Exam",
    });

    expect(result).toEqual({
      ok: false,
      error: { code: "unauthenticated" },
    });
  });

  it("creates an exam successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(createExamDraft).mockResolvedValue({
      id: "exam-1",
      spaceId: "space-1",
      ownerId: "user-1",
      type: "exam",
      title: "AWS Exam",
      lifecycle: "draft",
      latestRevisionId: "",
      schemaVersion: 1,
      createdAt: "2026-09-18T00:00:00.000Z",
      updatedAt: "2026-09-18T00:00:00.000Z",
    });

    const result = await createExamAction({
      spaceId: "space-1",
      title: "AWS Exam",
    });

    expect(result.ok).toBe(true);
  });

  it("saves an exam draft", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(saveExamDraft).mockResolvedValue({
      id: "erev-1",
      objectId: "exam-1",
      objectType: "exam",
      version: 1,
      publicationState: "draft",
      payload: {
        schemaVersion: 1,
        instructions: "Do your best",
        passingPercentage: 70,
        questions: [],
      },
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: "2026-09-18T00:00:00.000Z",
    });

    const result = await saveExamDraftAction({
      spaceId: "space-1",
      examId: "exam-1",
      payload: {
        schemaVersion: 1,
        instructions: "Do your best",
        passingPercentage: 70,
        questions: [],
      },
    });

    expect(result.ok).toBe(true);
  });

  it("replaces exam questions", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(replaceExamQuestionRelations).mockResolvedValue(undefined);

    const result = await replaceExamQuestionsAction({
      spaceId: "space-1",
      examId: "exam-1",
      questionRefs: [
        { questionId: "q-1", questionRevisionId: "qrev-1", points: 1 },
      ],
    });

    expect(result.ok).toBe(true);
  });

  it("publishes an exam", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(publishExam).mockResolvedValue({
      id: "erev-pub",
      objectId: "exam-1",
      objectType: "exam",
      version: 2,
      publicationState: "published",
      payload: {
        schemaVersion: 1,
        instructions: "Do your best",
        passingPercentage: 70,
        questions: [
          { questionId: "q-1", questionRevisionId: "qrev-1", points: 1 },
        ],
      },
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: "2026-09-18T00:00:00.000Z",
    });

    const result = await publishExamAction({
      spaceId: "space-1",
      examId: "exam-1",
    });

    expect(result.ok).toBe(true);
  });

  it("archives an exam", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(archiveObject).mockResolvedValue({
      id: "exam-1",
      spaceId: "space-1",
      ownerId: "user-1",
      type: "exam",
      title: "AWS Exam",
      lifecycle: "archived",
      latestRevisionId: "erev-pub",
      schemaVersion: 1,
      createdAt: "2026-09-18T00:00:00.000Z",
      updatedAt: "2026-09-18T00:00:00.000Z",
    });

    const result = await archiveExamAction({
      spaceId: "space-1",
      examId: "exam-1",
    });

    expect(result.ok).toBe(true);
  });
});
