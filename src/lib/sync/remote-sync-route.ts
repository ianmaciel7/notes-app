import {
  type createFirebaseAuthVerifier,
  requireAuthenticatedUser,
} from "@/lib/auth/firebase-auth";
import type { SyncMutationRecord } from "@/lib/spaces/space-types";
import { createFirestoreRestSyncWriter } from "@/lib/sync/firestore-writer";

type Fetcher = typeof fetch;

type SyncPushBody = {
  mutations: SyncMutationRecord[];
};

type SyncPushResult = {
  status: number;
  body: Record<string, unknown>;
};

type AuthVerifier = ReturnType<typeof createFirebaseAuthVerifier>;
type AccessTokenProvider = () => Promise<string | null>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSyncOperation(value: unknown): value is SyncMutationRecord["operation"] {
  return value === "set" || value === "delete";
}

function isSyncStatus(value: unknown): value is SyncMutationRecord["status"] {
  return value === "pending" || value === "syncing" || value === "synced" || value === "failed";
}

function isValidMutation(value: unknown): value is SyncMutationRecord {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string" || value.id.trim().length === 0) return false;
  if (typeof value.spaceId !== "string" || value.spaceId.trim().length === 0) return false;
  if (typeof value.entityId !== "string" || value.entityId.trim().length === 0) return false;
  if (typeof value.entityType !== "string" || value.entityType.trim().length === 0) return false;
  if (!isSyncOperation(value.operation)) return false;
  if (!isSyncStatus(value.status)) return false;
  if (typeof value.createdAt !== "string" || Number.isNaN(Date.parse(value.createdAt)))
    return false;
  if (typeof value.updatedAt !== "string" || Number.isNaN(Date.parse(value.updatedAt)))
    return false;
  if (value.operation === "set" && value.payload === undefined) return false;
  return true;
}

function parseSyncPushBody(body: unknown): SyncPushBody | null {
  if (!isRecord(body) || !Array.isArray(body.mutations)) return null;
  if (body.mutations.length === 0) return { mutations: [] };
  if (!body.mutations.every(isValidMutation)) return null;
  return { mutations: body.mutations };
}

export async function handleAuthenticatedSyncPushRequest(
  body: unknown,
  dependencies: {
    headers: Headers;
    verifier: AuthVerifier;
    projectId?: string | null;
    accessToken?: string | null;
    getAccessToken?: AccessTokenProvider;
    databaseId?: string;
    fetcher?: Fetcher;
  },
): Promise<SyncPushResult> {
  let user;
  try {
    user = await requireAuthenticatedUser(dependencies.headers, dependencies.verifier);
  } catch (error) {
    return {
      status: 401,
      body: { error: error instanceof Error ? error.message : "Authentication failed." },
    };
  }

  const parsed = parseSyncPushBody(body);
  if (!parsed) {
    return { status: 400, body: { error: "Sync mutations payload is invalid." } };
  }

  const projectId = dependencies.projectId?.trim();
  const accessToken =
    dependencies.accessToken?.trim() ?? (await dependencies.getAccessToken?.())?.trim();
  if (!projectId || !accessToken) {
    return { status: 503, body: { error: "Remote sync is not configured." } };
  }

  try {
    await createFirestoreRestSyncWriter({
      projectId,
      accessToken,
      ownerUid: user.uid,
      databaseId: dependencies.databaseId,
      fetcher: dependencies.fetcher,
    }).commit(parsed.mutations);
  } catch {
    return { status: 502, body: { error: "Remote sync failed." } };
  }

  return {
    status: 200,
    body: { attempted: parsed.mutations.length, synced: parsed.mutations.length, userId: user.uid },
  };
}
