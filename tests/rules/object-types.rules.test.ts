import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

let environment: RulesTestEnvironment;
const SPACE_ID = "0b9d72d1-2ca5-4df2-97f0-30e311eef4cb";
const OTHER_SPACE_ID = "f0bc4335-2fcd-4a71-88e4-ce7c1f7985de";
const TYPE_ID = "5b7a3a30-6f5e-4d52-8f62-0c5a8d1d9e11";
const CHILD_TYPE_ID = "9a1f0c52-3b0e-4f3e-9c35-7d2b6a4e8f20";

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-notes-app-object-types-rules",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

afterAll(async () => {
  await environment.cleanup();
});

function objectTypePath(uid: string, spaceId: string, typeId: string) {
  return `users/${uid}/spaces/${spaceId}/objectTypes/${typeId}`;
}

function newObjectType(overrides = {}) {
  return {
    name: "Book",
    pluralName: "Books",
    parentTypeId: null,
    schemaVersion: 1,
    stateVersion: 1,
    propertyDefinitions: {
      "c2f5d6a0-1c9e-4b6a-8a53-4e0f7d7b2a10": {
        key: "title",
        name: "Title",
        valueType: "text",
        required: true,
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  };
}

async function seed() {
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const now = Timestamp.now();
    for (const [uid, spaceId] of [
      ["alice", SPACE_ID],
      ["alice", OTHER_SPACE_ID],
      ["bob", OTHER_SPACE_ID],
    ]) {
      await setDoc(doc(db, `users/${uid}/spaces/${spaceId}`), {
        id: spaceId,
        ownerId: uid,
        name: "Studies",
        icon: "book-open",
        stateVersion: 1,
        createdAt: now,
        updatedAt: now,
      });
    }
    await setDoc(
      doc(db, objectTypePath("alice", SPACE_ID, TYPE_ID)),
      newObjectType({ createdAt: now, updatedAt: now }),
    );
    await setDoc(
      doc(db, objectTypePath("bob", OTHER_SPACE_ID, TYPE_ID)),
      newObjectType({ createdAt: now, updatedAt: now }),
    );
  });
}

beforeEach(async () => {
  await environment.clearFirestore();
  await seed();
});

describe("object types rules: access", () => {
  const typeCollection = (uid: string, spaceId: string) =>
    `users/${uid}/spaces/${spaceId}/objectTypes`;

  it("denies unauthenticated clients every operation", async () => {
    const guest = environment.unauthenticatedContext().firestore();
    const ref = doc(guest, objectTypePath("alice", SPACE_ID, TYPE_ID));

    await assertFails(getDoc(ref));
    await assertFails(
      getDocs(collection(guest, typeCollection("alice", SPACE_ID))),
    );
    await assertFails(setDoc(ref, newObjectType()));
  });

  it("lets the owner get, list and create Object Types", async () => {
    const db = environment.authenticatedContext("alice").firestore();
    const ref = doc(db, objectTypePath("alice", SPACE_ID, TYPE_ID));
    const newRef = doc(db, objectTypePath("alice", SPACE_ID, CHILD_TYPE_ID));

    await assertSucceeds(getDoc(ref));
    await assertSucceeds(
      getDocs(collection(db, typeCollection("alice", SPACE_ID))),
    );
    await assertSucceeds(setDoc(newRef, newObjectType()));
  });

  it("denies another authenticated user every operation", async () => {
    const bob = environment.authenticatedContext("bob").firestore();
    const ref = doc(bob, objectTypePath("alice", SPACE_ID, TYPE_ID));

    await assertFails(getDoc(ref));
    await assertFails(
      getDocs(collection(bob, typeCollection("alice", SPACE_ID))),
    );
    await assertFails(
      setDoc(
        doc(bob, objectTypePath("alice", SPACE_ID, CHILD_TYPE_ID)),
        newObjectType(),
      ),
    );
    await assertFails(deleteDoc(ref));
  });

  it("denies cross-user access, including a different Space", async () => {
    const db = environment.authenticatedContext("alice").firestore();

    await assertFails(
      getDoc(doc(db, objectTypePath("bob", OTHER_SPACE_ID, TYPE_ID))),
    );
    await assertFails(
      getDocs(collection(db, typeCollection("bob", OTHER_SPACE_ID))),
    );
  });

  it("denies the top-level paths the original brief proposed", async () => {
    const db = environment.authenticatedContext("alice").firestore();

    await assertFails(
      setDoc(doc(db, `spaces/${SPACE_ID}`), { name: "Studies" }),
    );
    await assertFails(
      setDoc(
        doc(db, `spaces/${SPACE_ID}/objectTypes/${TYPE_ID}`),
        newObjectType(),
      ),
    );
    await assertFails(getDoc(doc(db, `objectTypes/${TYPE_ID}`)));
  });
});

describe("object types rules: create validation", () => {
  const invalid: Array<[string, Record<string, unknown>]> = [
    ["an unknown field", { extra: true }],
    ["an empty name", { name: "" }],
    ["a name over 80 characters", { name: "a".repeat(81) }],
    ["a non-null parentTypeId", { parentTypeId: TYPE_ID }],
    ["a wrong schemaVersion", { schemaVersion: 2 }],
    ["a wrong stateVersion", { stateVersion: 2 }],
    ["a client-chosen createdAt", { createdAt: Timestamp.fromMillis(1) }],
    [
      "more than 100 property definitions",
      {
        propertyDefinitions: Object.fromEntries(
          Array.from({ length: 101 }, (_, index) => [`property-${index}`, {}]),
        ),
      },
    ],
  ];

  it.each(invalid)("rejects %s", async (_label, overrides) => {
    await assertFails(
      setDoc(
        doc(
          environment.authenticatedContext("alice").firestore(),
          objectTypePath("alice", SPACE_ID, CHILD_TYPE_ID),
        ),
        newObjectType(overrides),
      ),
    );
  });

  it("rejects a missing required field", async () => {
    const { pluralName: _omitted, ...objectType } = newObjectType();

    await assertFails(
      setDoc(
        doc(
          environment.authenticatedContext("alice").firestore(),
          objectTypePath("alice", SPACE_ID, CHILD_TYPE_ID),
        ),
        objectType,
      ),
    );
  });

  it.each([
    ["a non-UUID id", "not-a-uuid"],
    ["an uppercase UUID", TYPE_ID.toUpperCase()],
  ])("rejects %s", async (_label, objectTypeId) => {
    await assertFails(
      setDoc(
        doc(
          environment.authenticatedContext("alice").firestore(),
          objectTypePath("alice", SPACE_ID, objectTypeId),
        ),
        newObjectType(),
      ),
    );
  });
});

describe("object types rules: update", () => {
  const edit = (overrides = {}) => ({
    name: "Novel",
    pluralName: "Novels",
    propertyDefinitions: {},
    stateVersion: 2,
    updatedAt: serverTimestamp(),
    ...overrides,
  });

  function ownerTypeRef() {
    return doc(
      environment.authenticatedContext("alice").firestore(),
      objectTypePath("alice", SPACE_ID, TYPE_ID),
    );
  }

  it("accepts allowed-field updates with stateVersion + 1", async () => {
    await assertSucceeds(
      updateDoc(ownerTypeRef(), edit({ description: "Published works" })),
    );
  });

  it("rejects a wrong stateVersion", async () => {
    await assertFails(updateDoc(ownerTypeRef(), edit({ stateVersion: 1 })));
    await assertFails(updateDoc(ownerTypeRef(), edit({ stateVersion: 3 })));
  });

  it("rejects immutable fields and an extra field", async () => {
    await assertFails(
      updateDoc(ownerTypeRef(), edit({ parentTypeId: CHILD_TYPE_ID })),
    );
    await assertFails(updateDoc(ownerTypeRef(), edit({ schemaVersion: 2 })));
    await assertFails(
      updateDoc(ownerTypeRef(), edit({ createdAt: serverTimestamp() })),
    );
    await assertFails(updateDoc(ownerTypeRef(), edit({ extra: true })));
  });

  it("denies client deletes", async () => {
    await assertFails(deleteDoc(ownerTypeRef()));
  });
});

describe("object types rules: existing rules are unchanged", () => {
  it("still lets the owner read their Space and denies another user", async () => {
    const alice = environment.authenticatedContext("alice").firestore();
    const bob = environment.authenticatedContext("bob").firestore();

    await assertSucceeds(getDoc(doc(alice, `users/alice/spaces/${SPACE_ID}`)));
    await assertFails(getDoc(doc(bob, `users/alice/spaces/${SPACE_ID}`)));
  });
});
