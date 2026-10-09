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
  deleteField,
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

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-notes-app-spaces-rules",
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

function newSpace(uid: string, spaceId: string, overrides = {}) {
  return {
    id: spaceId,
    ownerId: uid,
    name: "Studies",
    icon: "book-open",
    stateVersion: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  };
}

async function seedSpace(uid: string, spaceId: string) {
  await environment.withSecurityRulesDisabled(async (context) => {
    const now = Timestamp.now();
    await setDoc(
      doc(context.firestore(), `users/${uid}/spaces/${spaceId}`),
      newSpace(uid, spaceId, { createdAt: now, updatedAt: now }),
    );
  });
}

function aliceDb() {
  return environment.authenticatedContext("alice").firestore();
}

beforeEach(async () => {
  await environment.clearFirestore();
});

describe("spaces rules: access", () => {
  it("lets the owner create, get, list and delete their own Space", async () => {
    const db = aliceDb();
    const ref = doc(db, `users/alice/spaces/${SPACE_ID}`);

    await assertSucceeds(setDoc(ref, newSpace("alice", SPACE_ID)));
    await assertSucceeds(getDoc(ref));
    await assertSucceeds(getDocs(collection(db, "users/alice/spaces")));
    await assertSucceeds(deleteDoc(ref));
  });

  it("denies unauthenticated clients everything", async () => {
    await seedSpace("alice", SPACE_ID);
    const guest = environment.unauthenticatedContext().firestore();
    const ref = doc(guest, `users/alice/spaces/${SPACE_ID}`);

    await assertFails(getDoc(ref));
    await assertFails(getDocs(collection(guest, "users/alice/spaces")));
    await assertFails(setDoc(ref, newSpace("alice", SPACE_ID)));
    await assertFails(deleteDoc(ref));
  });

  it("denies another user every operation on the owner's Spaces", async () => {
    await seedSpace("alice", SPACE_ID);
    const bob = environment.authenticatedContext("bob").firestore();
    const ref = doc(bob, `users/alice/spaces/${SPACE_ID}`);

    await assertFails(getDoc(ref));
    await assertFails(getDocs(collection(bob, "users/alice/spaces")));
    await assertFails(
      setDoc(
        doc(bob, `users/alice/spaces/${OTHER_SPACE_ID}`),
        newSpace("bob", OTHER_SPACE_ID),
      ),
    );
    await assertFails(
      updateDoc(ref, {
        name: "x",
        stateVersion: 2,
        updatedAt: serverTimestamp(),
      }),
    );
    await assertFails(deleteDoc(ref));
  });

  it("denies creating a Space for another owner or with a forged id", async () => {
    const db = aliceDb();

    await assertFails(
      setDoc(
        doc(db, `users/alice/spaces/${SPACE_ID}`),
        newSpace("bob", SPACE_ID),
      ),
    );
    await assertFails(
      setDoc(
        doc(db, `users/alice/spaces/${SPACE_ID}`),
        newSpace("alice", OTHER_SPACE_ID),
      ),
    );
    await assertFails(
      setDoc(
        doc(db, `users/bob/spaces/${SPACE_ID}`),
        newSpace("bob", SPACE_ID),
      ),
    );
  });
});

describe("spaces rules: create validation", () => {
  const invalid: Array<[string, Record<string, unknown>]> = [
    ["an unknown field", { extra: true }],
    ["an empty name", { name: "" }],
    ["a name over 80 characters", { name: "a".repeat(81) }],
    ["a non-string name", { name: 1 }],
    ["a description over 500 characters", { description: "a".repeat(501) }],
    ["an invalid icon", { icon: "Book Open" }],
    ["an icon over 40 characters", { icon: "a".repeat(41) }],
    ["a stateVersion other than 1", { stateVersion: 2 }],
    ["a client-chosen createdAt", { createdAt: Timestamp.fromMillis(1) }],
    ["a client-chosen updatedAt", { updatedAt: Timestamp.fromMillis(1) }],
  ];

  it.each(invalid)("rejects %s", async (_label, overrides) => {
    await assertFails(
      setDoc(
        doc(aliceDb(), `users/alice/spaces/${SPACE_ID}`),
        newSpace("alice", SPACE_ID, overrides),
      ),
    );
  });

  it.each([
    ["a non-UUID id", "not-a-uuid"],
    ["an uppercase UUID", SPACE_ID.toUpperCase()],
    ["a non-v4 UUID", "0b9d72d1-2ca5-1df2-97f0-30e311eef4cb"],
  ])("rejects %s", async (_label, spaceId) => {
    await assertFails(
      setDoc(
        doc(aliceDb(), `users/alice/spaces/${spaceId}`),
        newSpace("alice", spaceId),
      ),
    );
  });

  it("accepts an optional description", async () => {
    await assertSucceeds(
      setDoc(
        doc(aliceDb(), `users/alice/spaces/${SPACE_ID}`),
        newSpace("alice", SPACE_ID, { description: "Notes for exams" }),
      ),
    );
  });
});

describe("spaces rules: update", () => {
  const edit = (overrides = {}) => ({
    name: "Renamed",
    stateVersion: 2,
    updatedAt: serverTimestamp(),
    ...overrides,
  });

  beforeEach(async () => {
    await seedSpace("alice", SPACE_ID);
  });

  it("accepts an allowed-field update with stateVersion + 1", async () => {
    const ref = doc(aliceDb(), `users/alice/spaces/${SPACE_ID}`);

    await assertSucceeds(
      updateDoc(ref, edit({ description: "d", icon: "star" })),
    );
  });

  it("lets the owner clear the description by removing the field", async () => {
    const ref = doc(aliceDb(), `users/alice/spaces/${SPACE_ID}`);

    await assertSucceeds(updateDoc(ref, edit({ description: deleteField() })));
  });

  it("rejects a stale or skipped stateVersion", async () => {
    const ref = doc(aliceDb(), `users/alice/spaces/${SPACE_ID}`);

    await assertFails(updateDoc(ref, edit({ stateVersion: 1 })));
    await assertFails(updateDoc(ref, edit({ stateVersion: 3 })));
  });

  it("rejects changes to immutable fields", async () => {
    const ref = doc(aliceDb(), `users/alice/spaces/${SPACE_ID}`);

    await assertFails(updateDoc(ref, edit({ id: OTHER_SPACE_ID })));
    await assertFails(updateDoc(ref, edit({ ownerId: "bob" })));
    await assertFails(updateDoc(ref, edit({ createdAt: serverTimestamp() })));
  });

  it("rejects unknown fields, invalid values and a client updatedAt", async () => {
    const ref = doc(aliceDb(), `users/alice/spaces/${SPACE_ID}`);

    await assertFails(updateDoc(ref, edit({ extra: 1 })));
    await assertFails(updateDoc(ref, edit({ name: "" })));
    await assertFails(
      updateDoc(ref, edit({ updatedAt: Timestamp.fromMillis(1) })),
    );
  });
});

describe("spaces rules: isolation", () => {
  it("keeps the users/{uid} profile server-write only", async () => {
    const db = aliceDb();

    await assertFails(setDoc(doc(db, "users/alice"), { locale: "en" }));
  });

  it("denies sibling and nested paths that are not Spaces", async () => {
    const db = aliceDb();

    await assertFails(setDoc(doc(db, "users/alice/notes/n1"), { title: "x" }));
    await assertFails(
      setDoc(doc(db, `users/alice/spaces/${SPACE_ID}/items/i1`), {
        title: "x",
      }),
    );
  });
});
