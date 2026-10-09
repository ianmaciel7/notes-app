import { deleteApp, getApps } from "firebase-admin/app";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

const identity = vi.hoisted(() => ({ uid: null as string | null }));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/firebase/identity", () => ({
  getCurrentIdentity: async () =>
    identity.uid === null ? null : { email: null, uid: identity.uid },
}));

const PROJECT_ID = "demo-notes-app-space-deletion";
const SPACE_ID = "0b9d72d1-2ca5-4df2-97f0-30e311eef4cb";
const OTHER_SPACE_ID = "f0bc4335-2fcd-4a71-88e4-ce7c1f7985de";
const PARENT_TYPE_ID = "5b7a3a30-6f5e-4d52-8f62-0c5a8d1d9e11";
const CHILD_TYPE_ID = "9a1f0c52-3b0e-4f3e-9c35-7d2b6a4e8f20";

type SpaceDal = typeof import("@/data/space-dal");
type ObjectTypeDal = typeof import("@/data/object-type-dal");

let spaceDal: SpaceDal;
let objectTypeDal: ObjectTypeDal;
let originalProjectId: string | undefined;

function space(uid = "alice", spaceId = SPACE_ID) {
  return deletionDb()
    .collection("users")
    .doc(uid)
    .collection("spaces")
    .doc(spaceId);
}

function objectType(
  objectTypeId: string,
  _parentTypeId: string | null,
  uid = "alice",
  spaceId = SPACE_ID,
) {
  return space(uid, spaceId).collection("objectTypes").doc(objectTypeId);
}

function deletionDb() {
  return getFirebaseAdminFirestore();
}

async function seedSpace(uid = "alice", spaceId = SPACE_ID, ownerId = uid) {
  await space(uid, spaceId).set({ ownerId });
}

async function seedObjectType(
  objectTypeId: string,
  parentTypeId: string | null,
) {
  await objectType(objectTypeId, parentTypeId).set({ parentTypeId });
}

async function deleteSpaceTreeAs(uid: string, spaceId: string) {
  identity.uid = uid;
  return spaceDal.deleteSpaceTree(spaceId);
}

async function deleteObjectTypeAs(
  uid: string,
  spaceId: string,
  objectTypeId: string,
) {
  identity.uid = uid;
  return objectTypeDal.deleteObjectType(spaceId, objectTypeId);
}

beforeAll(async () => {
  originalProjectId = process.env.FIREBASE_PROJECT_ID;
  vi.stubEnv("NODE_ENV", "production");
  process.env.FIREBASE_PROJECT_ID = PROJECT_ID;
  spaceDal = await import("@/data/space-dal");
  objectTypeDal = await import("@/data/object-type-dal");
});

beforeEach(async () => {
  for (const uid of ["alice", "bob"]) {
    await deletionDb().recursiveDelete(
      deletionDb().collection("users").doc(uid),
    );
  }
});

afterAll(async () => {
  for (const app of getApps()) {
    await deleteApp(app);
  }
  vi.stubEnv("NODE_ENV", "test");
  if (originalProjectId === undefined) {
    delete process.env.FIREBASE_PROJECT_ID;
  } else {
    process.env.FIREBASE_PROJECT_ID = originalProjectId;
  }
});

describe("space deletion", () => {
  it("deletes a Space and every nested Object Type without orphans", async () => {
    await seedSpace();
    await seedObjectType(PARENT_TYPE_ID, null);
    await seedObjectType(CHILD_TYPE_ID, PARENT_TYPE_ID);
    await objectType(CHILD_TYPE_ID, PARENT_TYPE_ID)
      .collection("propertyDefinitions")
      .doc("title")
      .set({ key: "title" });

    await deleteSpaceTreeAs("alice", SPACE_ID);

    await expect(space().get()).resolves.toMatchObject({ exists: false });
    await expect(objectType(PARENT_TYPE_ID, null).get()).resolves.toMatchObject(
      {
        exists: false,
      },
    );
    await expect(
      objectType(CHILD_TYPE_ID, PARENT_TYPE_ID).get(),
    ).resolves.toMatchObject({
      exists: false,
    });
    await expect(
      objectType(CHILD_TYPE_ID, PARENT_TYPE_ID)
        .collection("propertyDefinitions")
        .doc("title")
        .get(),
    ).resolves.toMatchObject({ exists: false });
  });

  it("rejects a foreign uid without deleting its Space", async () => {
    await seedSpace("bob", OTHER_SPACE_ID, "alice");

    await expect(
      deleteSpaceTreeAs("bob", OTHER_SPACE_ID),
    ).rejects.toMatchObject({
      code: "forbidden",
    });
    await expect(space("bob", OTHER_SPACE_ID).get()).resolves.toMatchObject({
      exists: true,
    });
  });

  it("rejects an unauthenticated caller before touching Firestore", async () => {
    await seedSpace();
    identity.uid = null;

    await expect(spaceDal.deleteSpaceTree(SPACE_ID)).rejects.toMatchObject({
      code: "unauthenticated",
    });
    await expect(space().get()).resolves.toMatchObject({ exists: true });
  });

  it("rejects a missing Space", async () => {
    await expect(deleteSpaceTreeAs("alice", SPACE_ID)).rejects.toMatchObject({
      code: "not-found",
    });
  });

  it.each([
    ["an invalid uid", "", SPACE_ID, PARENT_TYPE_ID],
    ["an invalid Space id", "alice", "not-a-uuid", PARENT_TYPE_ID],
  ])("rejects %s", async (_label, uid, spaceId, objectTypeId) => {
    await expect(
      deleteObjectTypeAs(uid, spaceId, objectTypeId),
    ).rejects.toMatchObject({ code: "invalid-id" });
  });

  it("rejects an invalid Object Type id after checking Space ownership", async () => {
    await seedSpace();

    await expect(
      deleteObjectTypeAs("alice", SPACE_ID, "not-a-uuid"),
    ).rejects.toMatchObject({ code: "invalid-id" });
  });

  it("blocks deleting a type that has children", async () => {
    await seedSpace();
    await seedObjectType(PARENT_TYPE_ID, null);
    await seedObjectType(CHILD_TYPE_ID, PARENT_TYPE_ID);

    await expect(
      deleteObjectTypeAs("alice", SPACE_ID, PARENT_TYPE_ID),
    ).rejects.toMatchObject({ code: "has-descendants" });
    await expect(objectType(PARENT_TYPE_ID, null).get()).resolves.toMatchObject(
      {
        exists: true,
      },
    );
  });

  it("deletes a leaf Object Type", async () => {
    await seedSpace();
    await seedObjectType(PARENT_TYPE_ID, null);

    await deleteObjectTypeAs("alice", SPACE_ID, PARENT_TYPE_ID);

    await expect(objectType(PARENT_TYPE_ID, null).get()).resolves.toMatchObject(
      {
        exists: false,
      },
    );
  });

  it("deletes a parent after its child is deleted", async () => {
    await seedSpace();
    await seedObjectType(PARENT_TYPE_ID, null);
    await seedObjectType(CHILD_TYPE_ID, PARENT_TYPE_ID);

    await deleteObjectTypeAs("alice", SPACE_ID, CHILD_TYPE_ID);
    await deleteObjectTypeAs("alice", SPACE_ID, PARENT_TYPE_ID);

    await expect(objectType(PARENT_TYPE_ID, null).get()).resolves.toMatchObject(
      {
        exists: false,
      },
    );
  });
});
