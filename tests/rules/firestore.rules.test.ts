import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

let environment: RulesTestEnvironment;

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-notes-app-rules",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
});

beforeEach(async () => {
  await environment.clearFirestore();
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "users/alice"), { locale: "pt-BR" });
    await setDoc(doc(db, "users/bob"), { locale: "es" });
    await setDoc(doc(db, "notes/n1"), { title: "private" });
  });
});

afterAll(async () => {
  await environment.cleanup();
});

describe("firestore.rules", () => {
  it("lets a signed-in user read only their own profile", async () => {
    const alice = environment.authenticatedContext("alice").firestore();

    await assertSucceeds(getDoc(doc(alice, "users/alice")));
    await assertFails(getDoc(doc(alice, "users/bob")));
  });

  it("denies profile reads to unauthenticated clients", async () => {
    const guest = environment.unauthenticatedContext().firestore();

    await assertFails(getDoc(doc(guest, "users/alice")));
  });

  it("denies every client write, including to the own profile", async () => {
    const alice = environment.authenticatedContext("alice").firestore();

    await assertFails(setDoc(doc(alice, "users/alice"), { locale: "en" }));
    await assertFails(setDoc(doc(alice, "users/bob"), { locale: "en" }));
  });

  it("denies access to any other collection by default", async () => {
    const alice = environment.authenticatedContext("alice").firestore();

    await assertFails(getDoc(doc(alice, "notes/n1")));
    await assertFails(setDoc(doc(alice, "notes/n2"), { title: "x" }));
  });
});
