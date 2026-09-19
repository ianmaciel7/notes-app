import { beforeEach, describe, expect, it, vi } from "vitest";
import { DomainError } from "@/domain/shared/domain-error";
import {
  archiveQuestionAction,
  createQuestionAction,
  publishQuestionAction,
  saveQuestionDraftAction,
} from "./question-actions";

vi.mock("@/data/action-auth", () => ({
  requireActionUser: vi.fn(),
}));

vi.mock("@/data/objects", () => ({
  createObjectDraft: vi.fn(),
  saveDraftRevision: vi.fn(),
  publishRevision: vi.fn(),
  archiveObject: vi.fn(),
}));

vi.mock("@/data/tags", () => ({
  setObjectTags: vi.fn(),
}));

import { requireActionUser } from "@/data/action-auth";
import {
  archiveObject,
  createObjectDraft,
  publishRevision,
} from "@/data/objects";

describe("question actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated when user is not logged in", async () => {
    vi.mocked(requireActionUser).mockRejectedValue(
      new DomainError("unauthenticated"),
    );

    const result = await createQuestionAction({
      spaceId: "space-1",
      title: "Test",
    });

    expect(result).toEqual({
      ok: false,
      error: { code: "unauthenticated" },
    });
  });

  it("returns forbidden when user does not own space", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(createObjectDraft).mockRejectedValue(
      new DomainError("forbidden"),
    );

    const result = await createQuestionAction({
      spaceId: "other-space",
      title: "Test",
    });

    expect(result).toEqual({
      ok: false,
      error: { code: "forbidden" },
    });
  });

  it("successfully creates a question and returns ok: true", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(createObjectDraft).mockResolvedValue({
      id: "q-1",
      spaceId: "space-1",
      ownerId: "user-1",
      type: "question",
      title: "Test Question",
      lifecycle: "draft",
      latestRevisionId: "",
      schemaVersion: 1,
      createdAt: "2026-09-18T00:00:00.000Z",
      updatedAt: "2026-09-18T00:00:00.000Z",
    });

    const result = await createQuestionAction({
      spaceId: "space-1",
      title: "Test Question",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.id).toBe("q-1");
    }
  });

  it("validates payload when saving a draft", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });

    const result = await saveQuestionDraftAction({
      spaceId: "space-1",
      questionId: "q-1",
      payload: { invalid: true },
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("validation-failed");
    }
  });

  it("publishes a question revision", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(publishRevision).mockResolvedValue({
      id: "rev-pub",
      objectId: "q-1",
      objectType: "question",
      version: 2,
      publicationState: "published",
      payload: {},
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: "2026-09-18T00:00:00.000Z",
    });

    const result = await publishQuestionAction({
      spaceId: "space-1",
      questionId: "q-1",
    });

    expect(result.ok).toBe(true);
  });

  it("archives a question", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(archiveObject).mockResolvedValue({
      id: "q-1",
      spaceId: "space-1",
      ownerId: "user-1",
      type: "question",
      title: "Test Question",
      lifecycle: "archived",
      latestRevisionId: "rev-1",
      schemaVersion: 1,
      createdAt: "2026-09-18T00:00:00.000Z",
      updatedAt: "2026-09-18T00:00:00.000Z",
    });

    const result = await archiveQuestionAction({
      spaceId: "space-1",
      questionId: "q-1",
    });

    expect(result.ok).toBe(true);
  });
});
