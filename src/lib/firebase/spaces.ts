import {
  collection,
  type DocumentSnapshot,
  deleteField,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import { deleteSpaceAction } from "@/lib/firebase/space-deletion-actions";

// Owner-scoped Spaces at /users/{uid}/spaces/{spaceId} (ADR 0010). The
// Security Rules are the authorization boundary; this module only shapes data.

export type Space = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  icon: string;
  stateVersion: number;
  createdAt: Date;
  updatedAt: Date;
};

export type NewSpace = {
  name: string;
  description?: string;
  icon: string;
};

/** Fields the owner may change. `null` removes the description. */
export type SpaceChanges = {
  name?: string;
  description?: string | null;
  icon?: string;
};

/**
 * The write was based on a stale `stateVersion`. Carries what the user tried
 * to save and the current server state so the caller can resolve it.
 */
export class SpaceConflictError extends Error {
  readonly spaceId: string;
  readonly attempted: SpaceChanges;
  readonly current: Space;

  constructor(spaceId: string, attempted: SpaceChanges, current: Space) {
    super(`Space ${spaceId} changed since it was loaded.`);
    this.name = "SpaceConflictError";
    this.spaceId = spaceId;
    this.attempted = attempted;
    this.current = current;
  }
}

const spacesPath = (uid: string) => `users/${uid}/spaces`;

function toDate(value: unknown): Date | undefined {
  const candidate = value as { toDate?: () => Date } | undefined;
  return typeof candidate?.toDate === "function"
    ? candidate.toDate()
    : undefined;
}

const REQUIRED_STRINGS = ["ownerId", "name", "icon"] as const;

export function parseSpace(snapshot: DocumentSnapshot): Space | null {
  // "estimate" gives pending serverTimestamp() fields a local value.
  const data = snapshot.data({ serverTimestamps: "estimate" });
  const createdAt = toDate(data?.createdAt);
  const updatedAt = toDate(data?.updatedAt);

  if (
    !(data && createdAt && updatedAt) ||
    typeof data.stateVersion !== "number" ||
    !REQUIRED_STRINGS.every((key) => typeof data[key] === "string")
  ) {
    return null;
  }

  return {
    id: snapshot.id,
    ownerId: data.ownerId,
    name: data.name,
    ...(typeof data.description === "string" && {
      description: data.description,
    }),
    icon: data.icon,
    stateVersion: data.stateVersion,
    createdAt,
    updatedAt,
  };
}

function parseSpaces(snapshots: DocumentSnapshot[]): Space[] {
  return snapshots.flatMap((snapshot) => parseSpace(snapshot) ?? []);
}

/**
 * Creates a Space. The id is available immediately (works offline); `saved`
 * settles once the server accepts or rejects the write.
 */
export function createSpace(
  uid: string,
  input: NewSpace,
): { id: string; saved: Promise<void> } {
  const id = crypto.randomUUID();
  const ref = doc(collection(getDb(), spacesPath(uid)), id);
  const saved = setDoc(ref, {
    id,
    ownerId: uid,
    name: input.name,
    ...(input.description !== undefined && { description: input.description }),
    icon: input.icon,
    stateVersion: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id, saved };
}

export async function getSpace(
  uid: string,
  spaceId: string,
): Promise<Space | null> {
  return parseSpace(await getDoc(doc(getDb(), spacesPath(uid), spaceId)));
}

export async function listSpaces(uid: string): Promise<Space[]> {
  const snapshot = await getDocs(spacesQuery(uid));
  return parseSpaces(snapshot.docs);
}

function spacesQuery(uid: string) {
  return query(collection(getDb(), spacesPath(uid)), orderBy("createdAt"));
}

/** Realtime list of the user's Spaces. Returns the unsubscribe function. */
export function subscribeToSpaces(
  uid: string,
  onChange: (spaces: Space[]) => void,
  onError: (error: unknown) => void,
): () => void {
  return onSnapshot(
    spacesQuery(uid),
    (snapshot) => onChange(parseSpaces(snapshot.docs)),
    onError,
  );
}

async function findConflict(
  uid: string,
  space: Space,
  attempted: SpaceChanges,
): Promise<SpaceConflictError | null> {
  try {
    const current = parseSpace(
      await getDocFromServer(doc(getDb(), spacesPath(uid), space.id)),
    );
    return current && current.stateVersion !== space.stateVersion
      ? new SpaceConflictError(space.id, attempted, current)
      : null;
  } catch {
    // Offline or unreadable: the original error is the honest answer.
    return null;
  }
}

/**
 * Updates the allowed fields, based on the `stateVersion` the caller loaded.
 * A write rejected because that version is stale rejects with
 * `SpaceConflictError`; nothing is overwritten silently.
 */
export async function updateSpace(
  uid: string,
  space: Space,
  changes: SpaceChanges,
): Promise<void> {
  const { description, ...rest } = changes;

  try {
    await updateDoc(doc(getDb(), spacesPath(uid), space.id), {
      ...rest,
      ...(description !== undefined && {
        description: description === null ? deleteField() : description,
      }),
      stateVersion: space.stateVersion + 1,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if ((error as { code?: string }).code === "permission-denied") {
      const conflict = await findConflict(uid, space, changes);
      if (conflict) {
        throw conflict;
      }
    }
    throw error;
  }
}

export async function deleteSpace(spaceId: string): Promise<void> {
  const result = await deleteSpaceAction(spaceId);
  if (!result.ok) {
    throw new Error(`Space deletion failed: ${result.code}.`);
  }
}
