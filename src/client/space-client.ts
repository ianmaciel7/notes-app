import {
  collection,
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
import { deleteSpaceAction } from "@/actions/space-actions";
import {
  type NewSpace,
  type Space,
  type SpaceChanges,
  SpaceConflictError,
} from "@/domain/space";
import { getDb } from "@/lib/firebase/firestore";
import { parseSpace, parseSpaces } from "@/parsers/space-parser";

// Owner-scoped Spaces at /users/{uid}/spaces/{spaceId} (ADR 0010). The
// Security Rules are the authorization boundary; this module only shapes data.

const spacesPath = (uid: string) => `users/${uid}/spaces`;

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
