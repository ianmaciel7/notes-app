import type { SyncMutationRecord } from "@/lib/spaces/space-types";
import type { SyncBatchWriter } from "@/lib/sync/sync-engine";

type FirestoreValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { doubleValue: number }
  | { stringValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

type Fetcher = typeof fetch;

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

function documentName(
  config: { projectId: string; databaseId: string; ownerUid?: string },
  mutation: SyncMutationRecord,
) {
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

function mutationToWrite(
  config: { projectId: string; databaseId: string; ownerUid?: string },
  mutation: SyncMutationRecord,
) {
  const name = documentName(config, mutation);
  if (mutation.operation === "delete") return { delete: name };
  const payloadValue = toFirestoreValue(mutation.payload);
  if (!("mapValue" in payloadValue)) {
    throw new Error("Firestore set mutation payload must be an object.");
  }
  const fields = payloadValue.mapValue.fields;
  return { update: { name, fields } };
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

  return {
    async commit(mutations: SyncMutationRecord[]) {
      if (mutations.length === 0) return;
      const response = await fetcher(
        `https://firestore.googleapis.com/v1/projects/${input.projectId}/databases/${databaseId}/documents:batchWrite`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${input.accessToken}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            writes: mutations.map((mutation) =>
              mutationToWrite(
                { projectId: input.projectId, databaseId, ownerUid: input.ownerUid },
                mutation,
              ),
            ),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Firestore batchWrite failed with status ${response.status}.`);
      }
    },
  };
}
