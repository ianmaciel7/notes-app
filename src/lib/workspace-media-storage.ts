type MediaAssetId = string;

type MediaAssetState = "stored" | "missing";

type MediaAssetFamily = "audio" | "file" | "image" | "pdf";

type MediaAsset = {
  readonly id: MediaAssetId;
  readonly byteLength: number;
  readonly createdAt: string;
  readonly fileName: string;
  readonly hash: string;
  readonly mimeType: string;
  readonly state: MediaAssetState;
  readonly storageKey: string;
  readonly updatedAt: string;
};

type MediaAssetReference = {
  readonly assetId: MediaAssetId;
  readonly ownerId: string;
  readonly ownerKind: "block" | "object" | "property";
};

type MediaWriteProgress = {
  readonly loaded: number;
  readonly total: number;
};

type MediaSizeLimitSource = "operational-limit" | "product-policy";

type MediaStorageErrorCode =
  | "aborted"
  | "file-size-limit-exceeded"
  | "invalid-media-type"
  | "missing-blob"
  | "quota-exceeded";

type MediaStorageError = {
  readonly actualBytes?: number;
  readonly code: MediaStorageErrorCode;
  readonly limitBytes?: number;
  readonly limitSource?: MediaSizeLimitSource;
  readonly message: string;
};

type MediaStorageResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly error: MediaStorageError; readonly ok: false };

type MediaStorageAdapter = {
  readonly delete: (storageKey: string) => Promise<void>;
  readonly read: (storageKey: string) => Promise<Blob | null>;
  readonly write: (
    storageKey: string,
    blob: Blob,
    options?: {
      readonly signal?: AbortSignal;
      readonly onProgress?: (progress: MediaWriteProgress) => void;
    },
  ) => Promise<void>;
};

type MediaAssetWriteInput = {
  readonly fileName: string;
  readonly mimeType: string;
  readonly blob: Blob;
};

type MediaAssetWriteOptions = {
  readonly maxBytes?: number;
  readonly now?: () => Date;
  readonly signal?: AbortSignal;
  readonly onProgress?: (progress: MediaWriteProgress) => void;
};

type MediaUrlRegistry = {
  readonly create: (assetId: MediaAssetId, blob: Blob) => string;
  readonly revoke: (assetId: MediaAssetId) => void;
  readonly revokeAll: () => void;
};

const MEDIA_BLOB_DB_NAME = "notes-app-media-assets";
const MEDIA_BLOB_STORE = "blobs";
const MEDIA_STORAGE_KEY_PREFIX = "media:";
const MAX_MEDIA_FILE_BYTES = 100_000_000;
const DEFAULT_MAX_MEDIA_BYTES = MAX_MEDIA_FILE_BYTES;

function ok<T>(value: T): MediaStorageResult<T> {
  return { ok: true, value };
}

function failure(
  code: MediaStorageErrorCode,
  message: string,
  details: Pick<
    MediaStorageError,
    "actualBytes" | "limitBytes" | "limitSource"
  > = {},
): MediaStorageResult<never> {
  return { error: { code, message, ...details }, ok: false };
}

type MediaFileSizeLimit = {
  readonly maxBytes: number;
  readonly source: MediaSizeLimitSource;
};

function resolveMediaFileSizeLimit(
  operationalMaxBytes?: number,
): MediaFileSizeLimit {
  if (
    operationalMaxBytes !== undefined &&
    (!Number.isSafeInteger(operationalMaxBytes) || operationalMaxBytes <= 0)
  ) {
    throw new TypeError(
      "Media maxBytes must be a positive safe integer when provided.",
    );
  }
  if (
    operationalMaxBytes !== undefined &&
    operationalMaxBytes < MAX_MEDIA_FILE_BYTES
  ) {
    return { maxBytes: operationalMaxBytes, source: "operational-limit" };
  }
  return { maxBytes: MAX_MEDIA_FILE_BYTES, source: "product-policy" };
}

function fileSizeLimitFailure(
  policy: MediaFileSizeLimit,
  actualBytes: number,
): MediaStorageResult<never> {
  const message =
    policy.source === "operational-limit"
      ? `File exceeds the configured Notes App media limit of ${policy.maxBytes} bytes.`
      : "File exceeds the 100 MB product limit.";
  return failure("file-size-limit-exceeded", message, {
    actualBytes,
    limitBytes: policy.maxBytes,
    limitSource: policy.source,
  });
}

function classifyMediaFamily(
  objectTypeId: string,
  mimeType: string,
): MediaAssetFamily | null {
  const normalized = mimeType.toLocaleLowerCase();
  if (objectTypeId === "image") return normalized.startsWith("image/") ? "image" : null;
  if (objectTypeId === "audio") return normalized.startsWith("audio/") ? "audio" : null;
  if (objectTypeId === "pdf") return normalized === "application/pdf" ? "pdf" : null;
  return "file";
}

function storageKeyForHash(hash: string): string {
  return `${MEDIA_STORAGE_KEY_PREFIX}${hash}`;
}

async function hashBlob(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  }

  let hash = 0x811c9dc5;
  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

async function writeMediaAsset(
  adapter: MediaStorageAdapter,
  objectTypeId: string,
  input: MediaAssetWriteInput,
  options: MediaAssetWriteOptions = {},
): Promise<MediaStorageResult<MediaAsset>> {
  if (!classifyMediaFamily(objectTypeId, input.mimeType)) {
    return failure("invalid-media-type", "File type is not compatible with this media object.");
  }
  const sizePolicy = resolveMediaFileSizeLimit(options.maxBytes);
  if (input.blob.size > sizePolicy.maxBytes) {
    return fileSizeLimitFailure(sizePolicy, input.blob.size);
  }
  if (options.signal?.aborted) {
    return failure("aborted", "Media write was cancelled.");
  }

  const hash = await hashBlob(input.blob);
  const storageKey = storageKeyForHash(hash);
  try {
    await adapter.write(storageKey, input.blob, {
      onProgress: options.onProgress,
      signal: options.signal,
    });
  } catch (error) {
    if (options.signal?.aborted) {
      return failure("aborted", "Media write was cancelled.");
    }
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      return failure("quota-exceeded", "Browser storage quota rejected the file.");
    }
    return failure("missing-blob", "Media bytes could not be written.");
  }

  const timestamp = (options.now ?? (() => new Date()))().toISOString();
  return ok({
    byteLength: input.blob.size,
    createdAt: timestamp,
    fileName: input.fileName,
    hash,
    id: hash,
    mimeType: input.mimeType,
    state: "stored",
    storageKey,
    updatedAt: timestamp,
  });
}

async function readMediaAssetBlob(
  adapter: MediaStorageAdapter,
  asset: Pick<MediaAsset, "storageKey">,
): Promise<MediaStorageResult<Blob>> {
  const blob = await adapter.read(asset.storageKey);
  return blob ? ok(blob) : failure("missing-blob", "Media bytes are not available.");
}

async function garbageCollectMediaAssets(
  adapter: MediaStorageAdapter,
  assets: readonly Pick<MediaAsset, "id" | "storageKey">[],
  references: readonly MediaAssetReference[],
): Promise<readonly MediaAssetId[]> {
  const liveIds = new Set(references.map((reference) => reference.assetId));
  const deleted: MediaAssetId[] = [];
  for (const asset of assets) {
    if (liveIds.has(asset.id) || deleted.includes(asset.id)) continue;
    await adapter.delete(asset.storageKey);
    deleted.push(asset.id);
  }
  return deleted;
}

function createMediaUrlRegistry(): MediaUrlRegistry {
  const urls = new Map<MediaAssetId, string>();
  return {
    create(assetId, blob) {
      const existing = urls.get(assetId);
      if (existing) URL.revokeObjectURL(existing);
      const next = URL.createObjectURL(blob);
      urls.set(assetId, next);
      return next;
    },
    revoke(assetId) {
      const existing = urls.get(assetId);
      if (!existing) return;
      URL.revokeObjectURL(existing);
      urls.delete(assetId);
    },
    revokeAll() {
      for (const existing of urls.values()) URL.revokeObjectURL(existing);
      urls.clear();
    },
  };
}

function createMemoryMediaStorageAdapter(): MediaStorageAdapter {
  const blobs = new Map<string, Blob>();
  return {
    async delete(storageKey) {
      blobs.delete(storageKey);
    },
    async read(storageKey) {
      return blobs.get(storageKey) ?? null;
    },
    async write(storageKey, blob, options) {
      if (options?.signal?.aborted) throw new DOMException("Aborted", "AbortError");
      options?.onProgress?.({ loaded: 0, total: blob.size });
      blobs.set(storageKey, blob);
      options?.onProgress?.({ loaded: blob.size, total: blob.size });
    },
  };
}

function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(MEDIA_BLOB_DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(MEDIA_BLOB_STORE);
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function createBrowserMediaStorageAdapter(): MediaStorageAdapter {
  let databasePromise: Promise<IDBDatabase> | null = null;
  const database = () => {
    databasePromise ??= openMediaDatabase();
    return databasePromise;
  };
  return {
    async delete(storageKey) {
      const db = await database();
      await new Promise<void>((resolve, reject) => {
        const request = db
          .transaction(MEDIA_BLOB_STORE, "readwrite")
          .objectStore(MEDIA_BLOB_STORE)
          .delete(storageKey);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    },
    async read(storageKey) {
      const db = await database();
      return new Promise<Blob | null>((resolve, reject) => {
        const request = db
          .transaction(MEDIA_BLOB_STORE, "readonly")
          .objectStore(MEDIA_BLOB_STORE)
          .get(storageKey);
        request.onerror = () => reject(request.error);
        request.onsuccess = () =>
          resolve(request.result instanceof Blob ? request.result : null);
      });
    },
    async write(storageKey, blob, options) {
      if (options?.signal?.aborted) throw new DOMException("Aborted", "AbortError");
      options?.onProgress?.({ loaded: 0, total: blob.size });
      const db = await database();
      await new Promise<void>((resolve, reject) => {
        const request = db
          .transaction(MEDIA_BLOB_STORE, "readwrite")
          .objectStore(MEDIA_BLOB_STORE)
          .put(blob, storageKey);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
      options?.onProgress?.({ loaded: blob.size, total: blob.size });
    },
  };
}

export {
  DEFAULT_MAX_MEDIA_BYTES,
  MAX_MEDIA_FILE_BYTES,
  createBrowserMediaStorageAdapter,
  createMediaUrlRegistry,
  createMemoryMediaStorageAdapter,
  garbageCollectMediaAssets,
  hashBlob,
  readMediaAssetBlob,
  resolveMediaFileSizeLimit,
  writeMediaAsset,
};

export type {
  MediaAsset,
  MediaAssetFamily,
  MediaAssetId,
  MediaAssetReference,
  MediaAssetState,
  MediaFileSizeLimit,
  MediaSizeLimitSource,
  MediaStorageAdapter,
  MediaStorageError,
  MediaStorageResult,
  MediaUrlRegistry,
  MediaWriteProgress,
};
