import {
  parseWorkspaceObjectSnapshot,
  serializeWorkspaceObjectState,
  type WorkspaceObjectSnapshot,
} from "./workspace-object-storage.ts";
import type { WorkspaceStructure } from "./workspace-object-types.ts";
import type {
  WorkspaceEntity,
  WorkspaceObjectState,
} from "./workspace-objects.ts";
import { WORKSPACE_OBJECT_SCHEMA_VERSION } from "./workspace-objects.ts";

type WorkspaceDatabaseRecordKind =
  | "block-document"
  | "identity"
  | "media"
  | "object"
  | "operation"
  | "query-view"
  | "setting"
  | "structure";

type WorkspaceDatabaseRecord = {
  readonly aggregateId: string;
  readonly id: string;
  readonly kind: WorkspaceDatabaseRecordKind;
  readonly revision: number;
  readonly updatedAt: string;
  readonly value: unknown;
};

type WorkspaceDatabaseMetadata = {
  readonly authoritative: boolean;
  readonly revision: number;
  readonly snapshotVersion: WorkspaceObjectSnapshot["version"];
  readonly updatedAt: string;
};

type WorkspaceDatabaseIntegrityIssue = {
  readonly code:
    | "active-object-missing"
    | "index-mismatch"
    | "invalid-record"
    | "missing-structure";
  readonly id: string;
};

type WorkspaceDatabaseTransaction = {
  readonly delete: (key: WorkspaceDatabaseRecordKey) => void;
  readonly put: (record: WorkspaceDatabaseRecord) => void;
  readonly setMetadata: (key: string, value: unknown) => void;
};

type WorkspaceDatabaseAdapter = {
  readonly list: (
    kind?: WorkspaceDatabaseRecordKind,
  ) => Promise<readonly WorkspaceDatabaseRecord[]>;
  readonly readMetadata: (key: string) => Promise<unknown>;
  readonly transact: (
    writer: (transaction: WorkspaceDatabaseTransaction) => void,
  ) => Promise<void>;
};

type WorkspaceRepositoryCommitResult = {
  readonly metadata: WorkspaceDatabaseMetadata;
  readonly writtenKeys: readonly WorkspaceDatabaseRecordKey[];
};

type WorkspaceDatabaseMigrationResult =
  | {
      readonly ok: false;
      readonly reason: "invalid-snapshot" | "interrupted";
    }
  | {
      readonly ok: true;
      readonly state: WorkspaceObjectState;
      readonly metadata: WorkspaceDatabaseMetadata;
    };

type WorkspaceRepositorySnapshot = {
  readonly activeEntityId: string | null;
  readonly entities: readonly WorkspaceEntity[];
  readonly nextId: number;
  readonly structures: readonly WorkspaceStructure[];
};

type WorkspaceDatabaseRecordKey =
  `${WorkspaceDatabaseRecordKind}:${string}`;

const WORKSPACE_DATABASE_NAME = "notes-app-workspace-records";
const WORKSPACE_DATABASE_RECORD_STORE = "records";
const WORKSPACE_DATABASE_METADATA_STORE = "metadata";
const WORKSPACE_DATABASE_VERSION = 1;
const METADATA_KEY = "workspace";
const MIGRATION_AUTHORITATIVE_KEY = "migration:authoritative";
const MIGRATION_CHECKSUM_KEY = "migration:checksum";

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function simpleWorkspaceChecksum(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function recordKey(
  kind: WorkspaceDatabaseRecordKind,
  id: string,
): WorkspaceDatabaseRecordKey {
  return `${kind}:${id}`;
}

function createRecord(
  kind: WorkspaceDatabaseRecordKind,
  id: string,
  value: unknown,
  previous: WorkspaceDatabaseRecord | undefined,
  updatedAt: string,
): WorkspaceDatabaseRecord {
  return {
    aggregateId: id,
    id,
    kind,
    revision: (previous?.revision ?? 0) + 1,
    updatedAt,
    value: cloneValue(value),
  };
}

function createWorkspaceRecords(
  state: WorkspaceRepositorySnapshot,
  previous: readonly WorkspaceDatabaseRecord[],
  updatedAt: string,
): readonly WorkspaceDatabaseRecord[] {
  const previousByKey = new Map(previous.map((record) => [recordKey(record.kind, record.id), record]));
  return [
    ...state.structures.map((structure) =>
      createRecord(
        "structure",
        structure.id,
        structure,
        previousByKey.get(recordKey("structure", structure.id)),
        updatedAt,
      ),
    ),
    ...state.entities.map((entity) =>
      createRecord(
        "object",
        entity.id,
        entity,
        previousByKey.get(recordKey("object", entity.id)),
        updatedAt,
      ),
    ),
    createRecord("setting", "workspace", {
      activeEntityId: state.activeEntityId,
      nextId: state.nextId,
    }, previousByKey.get(recordKey("setting", "workspace")), updatedAt),
  ];
}

function toRepositorySnapshot(state: WorkspaceObjectState): WorkspaceRepositorySnapshot {
  return {
    activeEntityId: state.activeEntityId,
    entities: state.entities,
    nextId: state.nextId,
    structures: state.structures,
  };
}

function recordValue<T>(record: WorkspaceDatabaseRecord | undefined): T | null {
  return record ? (cloneValue(record.value) as T) : null;
}

function snapshotFromRecords(
  records: readonly WorkspaceDatabaseRecord[],
): WorkspaceRepositorySnapshot | null {
  const settings = records.find((record) => record.kind === "setting" && record.id === "workspace");
  const value = recordValue<{ activeEntityId: string | null; nextId: number }>(settings);
  if (!value || typeof value.nextId !== "number") return null;
  return {
    activeEntityId: value.activeEntityId,
    entities: records
      .filter((record) => record.kind === "object")
      .map((record) => cloneValue(record.value) as WorkspaceEntity),
    nextId: value.nextId,
    structures: records
      .filter((record) => record.kind === "structure")
      .map((record) => cloneValue(record.value) as WorkspaceStructure),
  };
}

function serializeRepositorySnapshot(snapshot: WorkspaceRepositorySnapshot): string {
  return JSON.stringify({
    activeEntityId: snapshot.activeEntityId,
    entities: snapshot.entities,
    nextId: snapshot.nextId,
    structures: snapshot.structures,
    version: WORKSPACE_OBJECT_SCHEMA_VERSION,
  });
}

function changedRecordKeys(
  previous: readonly WorkspaceDatabaseRecord[],
  next: readonly WorkspaceDatabaseRecord[],
): readonly WorkspaceDatabaseRecordKey[] {
  const previousValues = new Map(
    previous.map((record) => [
      recordKey(record.kind, record.id),
      JSON.stringify(record.value),
    ]),
  );
  return next
    .filter((record) => previousValues.get(recordKey(record.kind, record.id)) !== JSON.stringify(record.value))
    .map((record) => recordKey(record.kind, record.id));
}

function deletedRecordKeys(
  previous: readonly WorkspaceDatabaseRecord[],
  next: readonly WorkspaceDatabaseRecord[],
): readonly WorkspaceDatabaseRecordKey[] {
  const nextKeys = new Set(next.map((record) => recordKey(record.kind, record.id)));
  return previous
    .filter((record) => !nextKeys.has(recordKey(record.kind, record.id)))
    .map((record) => recordKey(record.kind, record.id));
}

function createMetadata(
  revision: number,
  updatedAt: string,
): WorkspaceDatabaseMetadata {
  return {
    authoritative: true,
    revision,
    snapshotVersion: WORKSPACE_OBJECT_SCHEMA_VERSION,
    updatedAt,
  };
}

function auditWorkspaceRecords(
  snapshot: WorkspaceRepositorySnapshot,
): readonly WorkspaceDatabaseIntegrityIssue[] {
  const structureIds = new Set(snapshot.structures.map((structure) => structure.id));
  const entityIds = new Set(snapshot.entities.map((entity) => entity.id));
  const issues: WorkspaceDatabaseIntegrityIssue[] = [];
  if (snapshot.activeEntityId && !entityIds.has(snapshot.activeEntityId)) {
    issues.push({ code: "active-object-missing", id: snapshot.activeEntityId });
  }
  for (const entity of snapshot.entities) {
    if (!structureIds.has(entity.objectTypeId)) {
      issues.push({ code: "missing-structure", id: entity.id });
    }
  }
  return issues;
}

function createMemoryWorkspaceDatabaseAdapter(options: {
  readonly failOnCommitNumber?: number;
  readonly failNextCommit?: boolean;
} = {}): WorkspaceDatabaseAdapter {
  const records = new Map<WorkspaceDatabaseRecordKey, WorkspaceDatabaseRecord>();
  const metadata = new Map<string, unknown>();
  let failNextCommit = options.failNextCommit ?? false;
  let commitCount = 0;
  return {
    async list(kind) {
      return Array.from(records.values()).filter(
        (record) => !kind || record.kind === kind,
      );
    },
    async readMetadata(key) {
      return cloneValue(metadata.get(key));
    },
    async transact(writer) {
      const nextRecords = new Map(records);
      const nextMetadata = new Map(metadata);
      writer({
        delete(key) {
          nextRecords.delete(key);
        },
        put(record) {
          nextRecords.set(recordKey(record.kind, record.id), cloneValue(record));
        },
        setMetadata(key, value) {
          nextMetadata.set(key, cloneValue(value));
        },
      });
      commitCount += 1;
      if (failNextCommit) {
        failNextCommit = false;
        throw new Error("Simulated transaction failure.");
      }
      if (options.failOnCommitNumber === commitCount) {
        throw new Error("Simulated transaction failure.");
      }
      records.clear();
      for (const [key, value] of nextRecords) records.set(key, value);
      metadata.clear();
      for (const [key, value] of nextMetadata) metadata.set(key, value);
    },
  };
}

function createWorkspaceDatabaseRepository(adapter: WorkspaceDatabaseAdapter) {
  async function loadSnapshot() {
    const snapshot = snapshotFromRecords(await adapter.list());
    if (!snapshot) return null;
    const parsed = parseWorkspaceObjectSnapshot(
      serializeRepositorySnapshot(snapshot),
    );
    return parsed.ok ? parsed.state : null;
  }

  async function commitSnapshot(
    state: WorkspaceObjectState,
    options: { readonly changedOnly: boolean; readonly now?: () => Date } = {
      changedOnly: false,
    },
  ): Promise<WorkspaceRepositoryCommitResult> {
    const previous = await adapter.list();
    const updatedAt = (options.now ?? (() => new Date()))().toISOString();
    const next = createWorkspaceRecords(toRepositorySnapshot(state), previous, updatedAt);
    const changed = options.changedOnly ? changedRecordKeys(previous, next) : next.map((record) => recordKey(record.kind, record.id));
    const deleted = deletedRecordKeys(previous, next);
    const nextMetadata = createMetadata(previous.length + changed.length + deleted.length + 1, updatedAt);
    await adapter.transact((transaction) => {
      for (const record of next) {
        if (!changed.includes(recordKey(record.kind, record.id))) continue;
        transaction.put(record);
      }
      for (const key of deleted) transaction.delete(key);
      transaction.setMetadata(METADATA_KEY, nextMetadata);
    });
    return { metadata: nextMetadata, writtenKeys: changed };
  }

  return {
    async auditIntegrity() {
      const snapshot = snapshotFromRecords(await adapter.list());
      return snapshot ? auditWorkspaceRecords(snapshot) : [];
    },
    loadSnapshot,
    async migrateLegacySnapshot(raw: string): Promise<WorkspaceDatabaseMigrationResult> {
      const parsed = parseWorkspaceObjectSnapshot(raw);
      if (!parsed.ok) return { ok: false, reason: "invalid-snapshot" };
      const checksum = simpleWorkspaceChecksum(raw);
      try {
        const result = await commitSnapshot(parsed.state);
        const reloaded = await loadSnapshot();
        if (!reloaded || serializeWorkspaceObjectState(reloaded) !== serializeWorkspaceObjectState(parsed.state)) {
          return { ok: false, reason: "interrupted" };
        }
        await adapter.transact((transaction) => {
          transaction.setMetadata(MIGRATION_CHECKSUM_KEY, checksum);
          transaction.setMetadata(MIGRATION_AUTHORITATIVE_KEY, true);
        });
        return { ok: true, state: parsed.state, metadata: result.metadata };
      } catch {
        return { ok: false, reason: "interrupted" };
      }
    },
    persistChangedSnapshot(state: WorkspaceObjectState, now?: () => Date) {
      return commitSnapshot(state, { changedOnly: true, now });
    },
    replaceSnapshot(state: WorkspaceObjectState, now?: () => Date) {
      return commitSnapshot(state, { changedOnly: false, now });
    },
    async rebuildIndexes() {
      const snapshot = snapshotFromRecords(await adapter.list());
      if (!snapshot) return [];
      return auditWorkspaceRecords(snapshot);
    },
  };
}

function requestResult<T = unknown>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function openWorkspaceDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(WORKSPACE_DATABASE_NAME, WORKSPACE_DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(WORKSPACE_DATABASE_RECORD_STORE)) {
        const store = db.createObjectStore(WORKSPACE_DATABASE_RECORD_STORE, {
          keyPath: "key",
        });
        store.createIndex("kind", "kind");
        store.createIndex("aggregateId", "aggregateId");
      }
      if (!db.objectStoreNames.contains(WORKSPACE_DATABASE_METADATA_STORE)) {
        db.createObjectStore(WORKSPACE_DATABASE_METADATA_STORE);
      }
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function createBrowserWorkspaceDatabaseAdapter(): WorkspaceDatabaseAdapter {
  let databasePromise: Promise<IDBDatabase> | null = null;
  const database = () => {
    databasePromise ??= openWorkspaceDatabase();
    return databasePromise;
  };
  return {
    async list(kind) {
      const db = await database();
      const store = db.transaction(WORKSPACE_DATABASE_RECORD_STORE, "readonly").objectStore(WORKSPACE_DATABASE_RECORD_STORE);
      const request = kind ? store.index("kind").getAll(kind) : store.getAll();
      return (await requestResult(request)).map((record) => {
        const { key: _key, ...value } = record as WorkspaceDatabaseRecord & { key: string };
        return value;
      });
    },
    async readMetadata(key) {
      const db = await database();
      const request = db
        .transaction(WORKSPACE_DATABASE_METADATA_STORE, "readonly")
        .objectStore(WORKSPACE_DATABASE_METADATA_STORE)
        .get(key);
      return requestResult(request);
    },
    async transact(writer) {
      const db = await database();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(
          [WORKSPACE_DATABASE_RECORD_STORE, WORKSPACE_DATABASE_METADATA_STORE],
          "readwrite",
        );
        const records = tx.objectStore(WORKSPACE_DATABASE_RECORD_STORE);
        const metadata = tx.objectStore(WORKSPACE_DATABASE_METADATA_STORE);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
        tx.oncomplete = () => resolve();
        writer({
          delete(key) {
            records.delete(key);
          },
          put(record) {
            records.put({ ...record, key: recordKey(record.kind, record.id) });
          },
          setMetadata(key, value) {
            metadata.put(cloneValue(value), key);
          },
        });
      });
    },
  };
}

function createBrowserWorkspaceDatabaseRepository() {
  return createWorkspaceDatabaseRepository(createBrowserWorkspaceDatabaseAdapter());
}

export {
  createBrowserWorkspaceDatabaseAdapter,
  createBrowserWorkspaceDatabaseRepository,
  createMemoryWorkspaceDatabaseAdapter,
  createWorkspaceDatabaseRepository,
  recordKey,
};

export type {
  WorkspaceDatabaseAdapter,
  WorkspaceDatabaseIntegrityIssue,
  WorkspaceDatabaseMetadata,
  WorkspaceDatabaseMigrationResult,
  WorkspaceDatabaseRecord,
  WorkspaceDatabaseRecordKey,
  WorkspaceDatabaseRecordKind,
  WorkspaceDatabaseTransaction,
  WorkspaceRepositoryCommitResult,
};
