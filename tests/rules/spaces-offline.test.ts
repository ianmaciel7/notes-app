import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  disableNetwork,
  doc,
  enableNetwork,
  type Firestore,
  getDocFromServer,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
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

vi.mock("@/lib/firebase/firestore", () => ({ getDb: () => holder.db }));

import {
  createSpace,
  getSpace,
  SpaceConflictError,
  subscribeToSpaces,
  updateSpace,
} from "@/lib/firebase/spaces";

let environment: RulesTestEnvironment;
let deviceA: Firestore;
let deviceB: Firestore;

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: "demo-notes-app-spaces-offline",
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

// Two devices of the same user: the module under test runs on device A.
beforeEach(async () => {
  await environment.clearFirestore();
  deviceA = environment
    .authenticatedContext("alice")
    .firestore() as unknown as Firestore;
  deviceB = environment
    .authenticatedContext("alice")
    .firestore() as unknown as Firestore;
  holder.db = deviceA;
});

describe("spaces offline behavior", () => {
  it("shows an offline create locally, then syncs it after reconnecting", async () => {
    const seen: string[][] = [];
    const unsubscribe = subscribeToSpaces(
      "alice",
      (spaces) => seen.push(spaces.map((s) => s.name)),
      (e) => {
        throw e;
      },
    );
    await vi.waitFor(() => expect(seen.at(-1)).toEqual([]), { timeout: 5000 });
    await disableNetwork(deviceA);

    const { id, saved } = createSpace("alice", {
      name: "Offline",
      icon: "star",
    });

    await vi.waitFor(() => expect(seen.at(-1)).toEqual(["Offline"]));
    await enableNetwork(deviceA);
    await saved;
    const onServer = await getDocFromServer(
      doc(deviceB, `users/alice/spaces/${id}`),
    );
    expect(onServer.data()).toMatchObject({ name: "Offline", stateVersion: 1 });
    unsubscribe();
  });

  it("rejects a stale offline update as a conflict and reverts the listener to server state", async () => {
    const { id, saved } = createSpace("alice", {
      name: "Original",
      icon: "star",
    });
    await saved;
    const stale = await getSpace("alice", id);
    if (!stale) {
      throw new Error("Space was not created");
    }
    const seen: string[] = [];
    const unsubscribe = subscribeToSpaces(
      "alice",
      (spaces) => seen.push(spaces[0]?.name ?? ""),
      (e) => {
        throw e;
      },
    );
    await vi.waitFor(() => expect(seen.at(-1)).toBe("Original"));
    await disableNetwork(deviceA);
    await updateDoc(doc(deviceB, `users/alice/spaces/${id}`), {
      name: "Other device",
      stateVersion: 2,
      updatedAt: serverTimestamp(),
    });

    const outcome = updateSpace("alice", stale, { name: "Mine" }).then(
      () => null,
      (error: unknown) => error,
    );
    await vi.waitFor(() => expect(seen.at(-1)).toBe("Mine"));
    await enableNetwork(deviceA);

    const error = await outcome;
    expect(error).toBeInstanceOf(SpaceConflictError);
    expect(error).toMatchObject({
      attempted: { name: "Mine" },
      current: { name: "Other device", stateVersion: 2 },
    });
    await vi.waitFor(() => expect(seen.at(-1)).toBe("Other device"));
    unsubscribe();
  });
});
