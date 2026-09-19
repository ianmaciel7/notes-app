import { describe, expect, it } from "vitest";
import { validateNoteInput } from "@/domain/notes/note";
import { auth, db, firebaseApp, functions, rtdb, storage } from "./client";

describe("Firebase Client SDK Services", () => {
  it("initializes all core Firebase client services", () => {
    expect(firebaseApp).toBeDefined();
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
    expect(storage).toBeDefined();
    expect(rtdb).toBeDefined();
    expect(functions).toBeDefined();
  });
});

describe("Note Schema Validation", () => {
  it("validates a well-formed note payload", () => {
    const result = validateNoteInput({
      title: "My First Note",
      content: "This is a note content",
      tags: ["firebase", "notes"],
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejects an empty title", () => {
    const result = validateNoteInput({
      title: "   ",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.title).toBeDefined();
  });

  it("rejects more than 10 tags", () => {
    const result = validateNoteInput({
      title: "Valid Title",
      tags: Array.from({ length: 11 }, (_, i) => `tag-${i}`),
    });

    expect(result.valid).toBe(false);
    expect(result.errors.tags).toContain("Maximum 10 tags");
  });
});
