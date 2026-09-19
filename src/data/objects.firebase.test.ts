import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { beforeAll, describe, expect, it } from "vitest";
import { createPrivateSpace } from "@/data/spaces";
import {
  replaceCollectionMembers,
  replaceExamQuestionRelations,
} from "./object-relations";
import {
  archiveObject,
  createObjectDraft,
  getObjectRevision,
  listObjects,
  publishRevision,
  saveDraftRevision,
} from "./objects";
import { setObjectTags, upsertTag } from "./tags";

beforeAll(() => {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

  if (getApps().length === 0) {
    initializeApp({ projectId: "demo-notes-app" });
  }
});

const OWNER = "user-alice";
const OTHER = "user-bob";

describe("objects repository", () => {
  it("creates an object draft with lifecycle draft", async () => {
    const space = await createPrivateSpace(OWNER, "Space 1");
    const object = await createObjectDraft(
      OWNER,
      space.id,
      "question",
      "Sample Question",
    );

    expect(object.id).toBeTruthy();
    expect(object.spaceId).toBe(space.id);
    expect(object.ownerId).toBe(OWNER);
    expect(object.type).toBe("question");
    expect(object.title).toBe("Sample Question");
    expect(object.lifecycle).toBe("draft");
    expect(object.schemaVersion).toBe(1);
  });

  it("saves draft revision and increments version monotonically", async () => {
    const space = await createPrivateSpace(OWNER, "Space 1");
    const object = await createObjectDraft(
      OWNER,
      space.id,
      "question",
      "Sample Question",
    );

    const payload1 = { prompt: "What is 1+1?" };
    const rev1 = await saveDraftRevision(OWNER, space.id, object.id, payload1);
    expect(rev1.version).toBe(1);
    expect(rev1.publicationState).toBe("draft");
    expect(rev1.payload).toEqual(payload1);

    const payload2 = { prompt: "What is 1+2?" };
    const rev2 = await saveDraftRevision(OWNER, space.id, object.id, payload2);
    expect(rev2.version).toBe(2);
    expect(rev2.publicationState).toBe("draft");
    expect(rev2.payload).toEqual(payload2);
  });

  it("ensures published revision is immutable even after new drafts", async () => {
    const space = await createPrivateSpace(OWNER, "Space 1");
    const object = await createObjectDraft(
      OWNER,
      space.id,
      "question",
      "Sample Question",
    );

    const originalPayload = { prompt: "Original prompt" };
    await saveDraftRevision(OWNER, space.id, object.id, originalPayload);

    const published = await publishRevision(OWNER, space.id, object.id);
    expect(published.publicationState).toBe("published");
    expect(published.payload).toEqual(originalPayload);

    const changedPayload = { prompt: "Changed prompt" };
    await saveDraftRevision(OWNER, space.id, object.id, changedPayload);

    const retrievedPublished = await getObjectRevision(
      OWNER,
      space.id,
      published.id,
    );
    expect(retrievedPublished.payload).toEqual(originalPayload);
    expect(retrievedPublished.publicationState).toBe("published");
  });

  it("archives an object and preserves its revisions", async () => {
    const space = await createPrivateSpace(OWNER, "Space 1");
    const object = await createObjectDraft(
      OWNER,
      space.id,
      "question",
      "Sample Question",
    );
    await saveDraftRevision(OWNER, space.id, object.id, { prompt: "P1" });
    const published = await publishRevision(OWNER, space.id, object.id);

    const archived = await archiveObject(OWNER, space.id, object.id);
    expect(archived.lifecycle).toBe("archived");

    const rev = await getObjectRevision(OWNER, space.id, published.id);
    expect(rev.id).toBe(published.id);
  });

  it("forbids non-owners from reading revisions or listing objects", async () => {
    const space = await createPrivateSpace(OWNER, "Space 1");
    const object = await createObjectDraft(
      OWNER,
      space.id,
      "question",
      "Sample Question",
    );
    const rev = await saveDraftRevision(OWNER, space.id, object.id, {
      prompt: "Secret",
    });

    await expect(
      getObjectRevision(OTHER, space.id, rev.id),
    ).rejects.toMatchObject({
      code: "forbidden",
    });

    await expect(listObjects(OTHER, space.id)).rejects.toMatchObject({
      code: "forbidden",
    });
  });

  it("lists objects in space by type", async () => {
    const space = await createPrivateSpace(OWNER, "Space 1");
    await createObjectDraft(OWNER, space.id, "question", "Q1");
    await createObjectDraft(OWNER, space.id, "question", "Q2");
    await createObjectDraft(OWNER, space.id, "exam", "E1");

    const questions = await listObjects(OWNER, space.id, "question");
    expect(questions).toHaveLength(2);
    expect(questions.every((q) => q.type === "question")).toBe(true);

    const all = await listObjects(OWNER, space.id);
    expect(all).toHaveLength(3);
  });
});

describe("object relations repository", () => {
  it("replaces exam question relations with deterministic ordering", async () => {
    const space = await createPrivateSpace(OWNER, "Space 1");
    const exam = await createObjectDraft(OWNER, space.id, "exam", "Exam 1");
    const q1 = await createObjectDraft(OWNER, space.id, "question", "Q1");
    const q2 = await createObjectDraft(OWNER, space.id, "question", "Q2");

    const qrev1 = await saveDraftRevision(OWNER, space.id, q1.id, {
      prompt: "Q1",
    });
    const qrev2 = await saveDraftRevision(OWNER, space.id, q2.id, {
      prompt: "Q2",
    });

    await replaceExamQuestionRelations(OWNER, space.id, exam.id, [
      { questionId: q1.id, questionRevisionId: qrev1.id, points: 2 },
      { questionId: q2.id, questionRevisionId: qrev2.id, points: 3 },
    ]);

    const snap = await getFirestore()
      .collection("spaces")
      .doc(space.id)
      .collection("relations")
      .where("sourceObjectId", "==", exam.id)
      .orderBy("position", "asc")
      .get();

    expect(snap.docs).toHaveLength(2);
    expect(snap.docs[0].data().targetObjectId).toBe(q1.id);
    expect(snap.docs[0].data().position).toBe(0);
    expect(snap.docs[0].data().points).toBe(2);
    expect(snap.docs[1].data().targetObjectId).toBe(q2.id);
    expect(snap.docs[1].data().position).toBe(1);
  });

  it("rejects relations with cross-space targets", async () => {
    const space1 = await createPrivateSpace(OWNER, "Space 1");
    const space2 = await createPrivateSpace(OWNER, "Space 2");
    const exam = await createObjectDraft(OWNER, space1.id, "exam", "Exam 1");
    const foreignQuestion = await createObjectDraft(
      OWNER,
      space2.id,
      "question",
      "Foreign Q",
    );

    await expect(
      replaceExamQuestionRelations(OWNER, space1.id, exam.id, [
        {
          questionId: foreignQuestion.id,
          questionRevisionId: "dummy-rev",
          points: 1,
        },
      ]),
    ).rejects.toThrow();
  });

  it("replaces collection members deterministically", async () => {
    const space = await createPrivateSpace(OWNER, "Space 1");
    const collection = await createObjectDraft(
      OWNER,
      space.id,
      "collection",
      "Col 1",
    );
    const q1 = await createObjectDraft(OWNER, space.id, "question", "Q1");

    await replaceCollectionMembers(OWNER, space.id, collection.id, [q1.id]);

    const snap = await getFirestore()
      .collection("spaces")
      .doc(space.id)
      .collection("relations")
      .where("sourceObjectId", "==", collection.id)
      .get();

    expect(snap.docs).toHaveLength(1);
    expect(snap.docs[0].data().targetObjectId).toBe(q1.id);
  });
});

describe("tags repository", () => {
  it("normalizes tag names and maintains uniqueness per space", async () => {
    const space = await createPrivateSpace(OWNER, "Space 1");
    const tag1 = await upsertTag(space.id, "  JavaScript  ");
    const tag2 = await upsertTag(space.id, "javascript");

    expect(tag1.id).toBe(tag2.id);
    expect(tag1.normalizedName).toBe("javascript");
  });

  it("sets object tags", async () => {
    const space = await createPrivateSpace(OWNER, "Space 1");
    const object = await createObjectDraft(OWNER, space.id, "question", "Q1");
    const tag = await upsertTag(space.id, "Math");

    await setObjectTags(OWNER, space.id, object.id, [tag.id]);

    const snap = await getFirestore()
      .collection("spaces")
      .doc(space.id)
      .collection("objectTags")
      .where("objectId", "==", object.id)
      .get();

    expect(snap.docs).toHaveLength(1);
    expect(snap.docs[0].data().tagId).toBe(tag.id);
  });

  it("rejects an object that does not belong to the target space", async () => {
    const targetSpace = await createPrivateSpace(OWNER, "Target Space");
    const foreignSpace = await createPrivateSpace(OWNER, "Foreign Space");
    const foreignObject = await createObjectDraft(
      OWNER,
      foreignSpace.id,
      "question",
      "Foreign Question",
    );
    const tag = await upsertTag(targetSpace.id, "Math");

    await expect(
      setObjectTags(OWNER, targetSpace.id, foreignObject.id, [tag.id]),
    ).rejects.toMatchObject({ code: "forbidden" });
  });

  it("rejects tags that do not belong to the target space", async () => {
    const targetSpace = await createPrivateSpace(OWNER, "Target Space");
    const foreignSpace = await createPrivateSpace(OWNER, "Foreign Space");
    const object = await createObjectDraft(
      OWNER,
      targetSpace.id,
      "question",
      "Question",
    );
    const foreignTag = await upsertTag(foreignSpace.id, "Foreign");

    await expect(
      setObjectTags(OWNER, targetSpace.id, object.id, [foreignTag.id]),
    ).rejects.toMatchObject({ code: "validation-failed" });
  });
});
