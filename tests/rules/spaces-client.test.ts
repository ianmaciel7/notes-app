import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import type { Firestore } from "firebase/firestore";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const holder = vi.hoisted(() => ({ db: undefined as Firestore | undefined }));

vi.mock("@/lib/firebase/firestore", () => ({
  getDb: () => holder.db,
}));

import {
  createSpace,
  deleteSpace,
  getSpace,
  listSpaces,
  type Space,
  SpaceConflictError,
  subscribeToSpaces,
  updateSpace,
} from "@/lib/firebase/spaces";

let environment: RulesTestEnvironment;

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-notes-app-spaces-client",
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

beforeEach(async () => {
  await environment.clearFirestore();
  holder.db = environment
    .authenticatedContext("alice")
    .firestore() as unknown as Firestore;
});

async function created(name = "Studies") {
  const { id, saved } = createSpace("alice", { name, icon: "book-open" });
  await saved;
  const space = await getSpace("alice", id);
  if (!space) {
    throw new Error("Space was not created");
  }
  return space;
}

describe("spaces client", () => {
  it("creates, reads and lists Spaces owned by the user", async () => {
    const space = await created();

    expect(space).toMatchObject({
      ownerId: "alice",
      name: "Studies",
      icon: "book-open",
      stateVersion: 1,
    });
    expect(space.createdAt).toBeInstanceOf(Date);
    expect((await listSpaces("alice")).map((s) => s.id)).toEqual([space.id]);
  });

  it("returns null for a missing Space", async () => {
    expect(await getSpace("alice", "missing")).toBeNull();
  });

  it("updates allowed fields and bumps stateVersion", async () => {
    const space = await created();

    await updateSpace("alice", space, { name: "Work", description: "Job" });

    expect(await getSpace("alice", space.id)).toMatchObject({
      name: "Work",
      description: "Job",
      stateVersion: 2,
    });
  });

  it("removes the description when it is cleared", async () => {
    const space = await created();
    await updateSpace("alice", space, { description: "x" });
    const withDescription = (await getSpace("alice", space.id)) as Space;

    await updateSpace("alice", withDescription, { description: null });

    expect((await getSpace("alice", space.id))?.description).toBeUndefined();
  });

  it("reports a stale update as a conflict carrying the attempted changes", async () => {
    const stale = await created();
    await updateSpace("alice", stale, { name: "Other device" });

    const attempt = updateSpace("alice", stale, { name: "Mine" });

    await expect(attempt).rejects.toBeInstanceOf(SpaceConflictError);
    await expect(attempt).rejects.toMatchObject({
      spaceId: stale.id,
      attempted: { name: "Mine" },
      current: { name: "Other device", stateVersion: 2 },
    });
  });

  it("deletes a Space", async () => {
    const space = await created();

    await deleteSpace("alice", space.id);

    expect(await getSpace("alice", space.id)).toBeNull();
  });

  it("streams Space changes and unsubscribes", async () => {
    const seen: string[][] = [];
    const unsubscribe = subscribeToSpaces(
      "alice",
      (spaces) => seen.push(spaces.map((s) => s.name)),
      (error) => {
        throw error;
      },
    );

    await created("First");
    await vi.waitFor(() => expect(seen.at(-1)).toEqual(["First"]));
    unsubscribe();
    await created("Second");

    expect(seen.at(-1)).toEqual(["First"]);
  });

  it("surfaces permission errors to the subscriber", async () => {
    const error = await new Promise<unknown>((resolve) => {
      subscribeToSpaces("bob", () => undefined, resolve);
    });

    expect(error).toMatchObject({ code: "permission-denied" });
  });
});
