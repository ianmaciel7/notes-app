import { describe, expect, it, vi } from "vitest";
import { DomainError } from "@/domain/shared/domain-error";
import type { QuestionRevisionPayload } from "./question";
import {
  type QuestionRepositoryPort,
  QuestionService,
} from "./question-service";

const samplePayload: QuestionRevisionPayload = {
  schemaVersion: 1,
  format: "single-choice",
  prompt: "What is 2 + 2?",
  options: [
    { id: "opt-1", text: "3" },
    { id: "opt-2", text: "4" },
  ],
  correctOptionIds: ["opt-2"],
  explanation: "2 + 2 = 4",
};

describe("QuestionService", () => {
  const mockRepo: QuestionRepositoryPort = {
    createDraft: vi.fn().mockResolvedValue({
      id: "q-1",
      spaceId: "space-1",
      ownerId: "user-1",
      type: "question",
      title: "Math Question",
      lifecycle: "draft",
      latestRevisionId: "",
      schemaVersion: 1,
      createdAt: "2026-09-18T00:00:00.000Z",
      updatedAt: "2026-09-18T00:00:00.000Z",
    }),
    saveRevision: vi.fn().mockResolvedValue({
      id: "rev-1",
      objectId: "q-1",
      objectType: "question",
      version: 1,
      publicationState: "draft",
      payload: samplePayload,
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: "2026-09-18T00:00:00.000Z",
    }),
    publish: vi.fn().mockResolvedValue({
      id: "rev-2",
      objectId: "q-1",
      objectType: "question",
      version: 2,
      publicationState: "published",
      payload: samplePayload,
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: "2026-09-18T00:00:00.000Z",
    }),
    archive: vi.fn().mockResolvedValue({
      id: "q-1",
      spaceId: "space-1",
      ownerId: "user-1",
      type: "question",
      title: "Math Question",
      lifecycle: "archived",
      latestRevisionId: "rev-2",
      schemaVersion: 1,
      createdAt: "2026-09-18T00:00:00.000Z",
      updatedAt: "2026-09-18T00:00:00.000Z",
    }),
  };

  it("creates a question draft object", async () => {
    const service = new QuestionService(mockRepo);
    const result = await service.create({
      ownerId: "user-1",
      spaceId: "space-1",
      title: "Math Question",
    });

    expect(result).toEqual(
      expect.objectContaining({ type: "question", lifecycle: "draft" }),
    );
    expect(mockRepo.createDraft).toHaveBeenCalledWith(
      "user-1",
      "space-1",
      "question",
      "Math Question",
    );
  });

  it("saves a validated draft revision", async () => {
    const service = new QuestionService(mockRepo);
    const result = await service.saveDraft({
      ownerId: "user-1",
      spaceId: "space-1",
      questionId: "q-1",
      payload: samplePayload,
    });

    expect(result.publicationState).toBe("draft");
    expect(mockRepo.saveRevision).toHaveBeenCalled();
  });

  it("rejects invalid payload on save draft", async () => {
    const service = new QuestionService(mockRepo);
    await expect(
      service.saveDraft({
        ownerId: "user-1",
        spaceId: "space-1",
        questionId: "q-1",
        payload: { format: "invalid-format" },
      }),
    ).rejects.toThrow(DomainError);
  });

  it("publishes a question", async () => {
    const service = new QuestionService(mockRepo);
    const result = await service.publish({
      ownerId: "user-1",
      spaceId: "space-1",
      questionId: "q-1",
    });

    expect(result.publicationState).toBe("published");
    expect(mockRepo.publish).toHaveBeenCalledWith("user-1", "space-1", "q-1");
  });

  it("archives a question", async () => {
    const service = new QuestionService(mockRepo);
    const result = await service.archive({
      ownerId: "user-1",
      spaceId: "space-1",
      questionId: "q-1",
    });

    expect(result.lifecycle).toBe("archived");
    expect(mockRepo.archive).toHaveBeenCalledWith("user-1", "space-1", "q-1");
  });
});
