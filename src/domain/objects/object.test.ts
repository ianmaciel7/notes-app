import { describe, expect, it } from "vitest";

import { DomainError } from "@/domain/shared/domain-error";
import {
  type ObjectLifecycle,
  type ObjectRecord,
  type ObjectRevision,
  type SpaceObjectType,
  assertLifecycleTransition,
} from "@/domain/objects/object";

// ---------------------------------------------------------------------------
// assertLifecycleTransition
// ---------------------------------------------------------------------------

describe("assertLifecycleTransition", () => {
  it("allows draft → published", () => {
    expect(() => assertLifecycleTransition("draft", "published")).not.toThrow();
  });

  it("allows published → archived", () => {
    expect(() =>
      assertLifecycleTransition("published", "archived"),
    ).not.toThrow();
  });

  it("allows archived → draft", () => {
    expect(() => assertLifecycleTransition("archived", "draft")).not.toThrow();
  });

  it("rejects draft → archived", () => {
    expect(() =>
      assertLifecycleTransition("draft", "archived"),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({ code: "lifecycle-conflict" }),
    );
  });

  it("rejects published → draft", () => {
    expect(() =>
      assertLifecycleTransition("published", "draft"),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({ code: "lifecycle-conflict" }),
    );
  });

  it("rejects archived → published", () => {
    expect(() =>
      assertLifecycleTransition("archived", "published"),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({ code: "lifecycle-conflict" }),
    );
  });

  it("rejects same-state self-transition (draft → draft)", () => {
    expect(() =>
      assertLifecycleTransition("draft", "draft"),
    ).toThrowError(
      expect.objectContaining<Partial<DomainError>>({ code: "lifecycle-conflict" }),
    );
  });
});

// ---------------------------------------------------------------------------
// ObjectRevision — immutability shape (structural)
// ---------------------------------------------------------------------------

describe("ObjectRevision shape", () => {
  it("accepts a well-formed draft revision", () => {
    const revision: ObjectRevision<{ data: string }> = {
      id: "rev-1",
      objectId: "obj-1",
      objectType: "question" satisfies SpaceObjectType,
      version: 1,
      publicationState: "draft",
      payload: { data: "hello" },
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: new Date().toISOString(),
    };

    expect(revision.version).toBe(1);
    expect(revision.publicationState).toBe("draft");
  });

  it("accepts a well-formed published revision", () => {
    const revision: ObjectRevision<{ data: string }> = {
      id: "rev-2",
      objectId: "obj-1",
      objectType: "exam" satisfies SpaceObjectType,
      version: 2,
      publicationState: "published",
      payload: { data: "world" },
      schemaVersion: 1,
      createdBy: "user-1",
      createdAt: new Date().toISOString(),
    };

    expect(revision.publicationState).toBe("published");
  });
});

// ---------------------------------------------------------------------------
// ObjectRecord shape
// ---------------------------------------------------------------------------

describe("ObjectRecord shape", () => {
  it("accepts a well-formed record", () => {
    const record: ObjectRecord = {
      id: "obj-1",
      spaceId: "space-1",
      ownerId: "user-1",
      type: "collection" satisfies SpaceObjectType,
      title: "My collection",
      lifecycle: "draft" satisfies ObjectLifecycle,
      latestRevisionId: "rev-1",
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(record.type).toBe("collection");
    expect(record.lifecycle).toBe("draft");
  });

  it("supports an optional publishedRevisionId", () => {
    const record: ObjectRecord = {
      id: "obj-2",
      spaceId: "space-1",
      ownerId: "user-1",
      type: "exam",
      title: "My exam",
      lifecycle: "published",
      latestRevisionId: "rev-3",
      publishedRevisionId: "rev-3",
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(record.publishedRevisionId).toBe("rev-3");
  });
});
