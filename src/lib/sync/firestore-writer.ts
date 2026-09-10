import type { SyncMutationRecord } from "@/lib/spaces/space-types";
import type { SyncBatchWriter } from "@/lib/sync/sync-engine";
import { coalesceSyncMutations } from "@/lib/sync/sync-mutations";

type FirestoreValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { doubleValue: number }
  | { stringValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

type Fetcher = typeof fetch;
type FirestoreDocumentConfig = { projectId: string; databaseId: string; ownerUid?: string };
const MAX_WRITES_PER_BATCH = 500;
const FIRESTORE_REQUEST_TIMEOUT_MS = 30_000;

export function toFirestoreValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return { doubleValue: value };
  if (typeof value === "string") return { stringValue: value };
  if (Array.isArray(value)) {
    const values = value.map(toFirestoreValue);
    return values.length > 0 ? { arrayValue: { values } } : { arrayValue: {} };
  }
  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value as Record<string, unknown>).map(([key, item]) => [
            key,
            toFirestoreValue(item),
          ]),
        ),
      },
    };
  }
  return { stringValue: String(value) };
}

function documentName(config: FirestoreDocumentConfig, mutation: SyncMutationRecord) {
  const documentRoot = [`projects/${config.projectId}/databases/${config.databaseId}/documents`];
  if (config.ownerUid) {
    documentRoot.push("users", encodeURIComponent(config.ownerUid));
  }

  return [
    documentRoot.join("/"),
    "spaces",
    encodeURIComponent(mutation.spaceId),
    "entities",
    encodeURIComponent(mutation.entityId),
  ].join("/");
}

function mutationToWrite(config: FirestoreDocumentConfig, mutation: SyncMutationRecord) {
  const name = documentName(config, mutation);
  if (mutation.operation === "delete") return { delete: name };
  const payloadValue = toFirestoreValue(mutation.payload);
  if (!("mapValue" in payloadValue)) {
    throw new Error("Firestore set mutation payload must be an object.");
  }
  const fields = payloadValue.mapValue.fields;
  return { update: { name, fields } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function assertBatchAcknowledged(response: Response, expectedWrites: number) {
  if (!response.ok) {
    throw new Error(`Firestore batchWrite failed with status ${response.status}.`);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error("Firestore batchWrite returned invalid JSON.");
  }
  if (
    !isRecord(body) ||
    !Array.isArray(body.status) ||
    !Array.isArray(body.writeResults) ||
    body.status.length !== expectedWrites ||
    body.writeResults.length !== expectedWrites ||
    !body.writeResults.every(isRecord)
  ) {
    throw new Error("Firestore batchWrite returned an incomplete acknowledgement.");
  }

  // Protobuf JSON may omit the default success code (0), leaving an empty object.
  const accepted = body.status.every(
    (status) => isRecord(status) && (status.code === undefined || status.code === 0),
  );
  if (!accepted) throw new Error("Firestore batchWrite rejected one or more writes.");
}

export function createFirestoreRestSyncWriter(input: {
  projectId: string;
  accessToken: string;
  ownerUid?: string;
  databaseId?: string;
  fetcher?: Fetcher;
}): SyncBatchWriter {
  const databaseId = input.databaseId ?? "(default)";
  const fetcher = input.fetcher ?? fetch;
  const config = { projectId: input.projectId, databaseId, ownerUid: input.ownerUid };

  return {
    async commit(mutations: SyncMutationRecord[]) {
      const writes = coalesceSyncMutations(mutations).map((mutation) =>
        mutationToWrite(config, mutation),
      );
      for (let offset = 0; offset < writes.length; offset += MAX_WRITES_PER_BATCH) {
        const batch = writes.slice(offset, offset + MAX_WRITES_PER_BATCH);
        const response = await fetcher(
          `https://firestore.googleapis.com/v1/projects/${input.projectId}/databases/${databaseId}/documents:batchWrite`,
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${input.accessToken}`,
              "content-type": "application/json",
            },
            signal: AbortSignal.timeout(FIRESTORE_REQUEST_TIMEOUT_MS),
            body: JSON.stringify({ writes: batch }),
          },
        );
        await assertBatchAcknowledged(response, batch.length);
      }
    },
  };
}
