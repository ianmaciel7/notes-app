import { describe, expect, it, vi } from "vitest";
import type { ExamRevisionPayload } from "./exam";
import { type ExamRepositoryPort, ExamService } from "./exam-service";

const sampleExamPayload: ExamRevisionPayload = {
  schemaVersion: 1,
  instructions: "Answer all questions.",
  passingPercentage: 75,
  questions: [{ questionId: "q-1", questionRevisionId: "qrev-1", points: 2 }],
};

describe("ExamService", () => {
  const mockRepo: ExamRepositoryPort = {
    createDraft: vi.fn().mockResolvedValue({
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
    }),
    saveRevision: vi.fn().mockResolvedValue({
      id: "erev-1",
      objectId: "exam-1",
      objectType: "exam",
      version: 1,
      publicationState: "draft",
      payload: sampleExamPayload,
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: "2026-09-18T00:00:00.000Z",
    }),
    replaceQuestions: vi.fn().mockResolvedValue(undefined),
    publish: vi.fn().mockResolvedValue({
      id: "erev-pub",
      objectId: "exam-1",
      objectType: "exam",
      version: 2,
      publicationState: "published",
      payload: sampleExamPayload,
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: "2026-09-18T00:00:00.000Z",
    }),
    archive: vi.fn().mockResolvedValue({
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
    }),
  };

  it("creates an exam draft object", async () => {
    const service = new ExamService(mockRepo);
    const result = await service.create({
      ownerId: "user-1",
      spaceId: "space-1",
      title: "AWS Exam",
    });

    expect(result.type).toBe("exam");
    expect(result.lifecycle).toBe("draft");
  });

  it("saves an exam draft revision", async () => {
    const service = new ExamService(mockRepo);
    const result = await service.saveDraft({
      ownerId: "user-1",
      spaceId: "space-1",
      examId: "exam-1",
      payload: sampleExamPayload,
    });

    expect(result.publicationState).toBe("draft");
  });

  it("replaces exam questions", async () => {
    const service = new ExamService(mockRepo);
    await service.replaceQuestions({
      ownerId: "user-1",
      spaceId: "space-1",
      examId: "exam-1",
      questionRefs: sampleExamPayload.questions,
    });

    expect(mockRepo.replaceQuestions).toHaveBeenCalledWith(
      "user-1",
      "space-1",
      "exam-1",
      sampleExamPayload.questions,
    );
  });

  it("publishes an exam", async () => {
    const service = new ExamService(mockRepo);
    const result = await service.publish({
      ownerId: "user-1",
      spaceId: "space-1",
      examId: "exam-1",
    });

    expect(result.publicationState).toBe("published");
  });

  it("archives an exam", async () => {
    const service = new ExamService(mockRepo);
    const result = await service.archive({
      ownerId: "user-1",
      spaceId: "space-1",
      examId: "exam-1",
    });

    expect(result.lifecycle).toBe("archived");
  });
});
