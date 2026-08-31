import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DEFAULT_MAX_MEDIA_BYTES,
  MAX_MEDIA_FILE_BYTES,
  createMediaUrlRegistry,
  createMemoryMediaStorageAdapter,
  garbageCollectMediaAssets,
  readMediaAssetBlob,
  resolveMediaFileSizeLimit,
  writeMediaAsset,
} from "../src/lib/workspace-media-storage.ts";

function reportedSizeBlob(size, bytes = "x") {
  const payload = new TextEncoder().encode(bytes);
  return {
    size,
    async arrayBuffer() {
      return payload.buffer.slice(
        payload.byteOffset,
        payload.byteOffset + payload.byteLength,
      );
    },
  };
}

test("media writes validate type compatibility, hash bytes, and report progress", async () => {
  const adapter = createMemoryMediaStorageAdapter();
  const progress = [];
  const result = await writeMediaAsset(
    adapter,
    "image",
    {
      blob: new Blob(["hello"], { type: "image/png" }),
      fileName: "hello.png",
      mimeType: "image/png",
    },
    {
      now: () => new Date("2026-08-25T00:00:00.000Z"),
      onProgress: (entry) => progress.push(entry),
    },
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.byteLength, 5);
  assert.equal(result.value.id, result.value.hash);
  assert.equal(result.value.state, "stored");
  assert.equal(result.value.storageKey, `media:${result.value.hash}`);
  assert.deepEqual(progress, [
    { loaded: 0, total: 5 },
    { loaded: 5, total: 5 },
  ]);

  const stored = await readMediaAssetBlob(adapter, result.value);
  assert.equal(stored.ok, true);
  assert.equal(await stored.value.text(), "hello");
});

test("default media policy accepts exactly 100,000,000 bytes", async () => {
  const writes = [];
  const adapter = {
    async delete() {},
    async read() {
      return null;
    },
    async write(storageKey, blob) {
      writes.push({ storageKey, size: blob.size });
    },
  };

  const result = await writeMediaAsset(adapter, "file", {
    blob: reportedSizeBlob(100_000_000),
    fileName: "limit.bin",
    mimeType: "application/octet-stream",
  });

  assert.equal(MAX_MEDIA_FILE_BYTES, 100_000_000);
  assert.equal(DEFAULT_MAX_MEDIA_BYTES, MAX_MEDIA_FILE_BYTES);
  assert.equal(result.ok, true);
  assert.equal(result.value.byteLength, 100_000_000);
  assert.equal(writes.length, 1);
});

test("default media policy rejects 100,000,001 bytes before hashing or writing", async () => {
  let arrayBufferCalls = 0;
  let writeCalls = 0;
  const adapter = {
    async delete() {},
    async read() {
      return null;
    },
    async write() {
      writeCalls += 1;
    },
  };
  const blob = {
    size: 100_000_001,
    async arrayBuffer() {
      arrayBufferCalls += 1;
      throw new Error("oversized files must not be hashed");
    },
  };

  const result = await writeMediaAsset(adapter, "file", {
    blob,
    fileName: "too-large.bin",
    mimeType: "application/octet-stream",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "file-size-limit-exceeded");
  assert.equal(result.error.actualBytes, 100_000_001);
  assert.equal(result.error.limitBytes, 100_000_000);
  assert.equal(result.error.limitSource, "product-policy");
  assert.equal(arrayBufferCalls, 0);
  assert.equal(writeCalls, 0);
});

test("operational configuration cannot raise the product limit", async () => {
  let arrayBufferCalls = 0;
  const blob = {
    size: 100_000_001,
    async arrayBuffer() {
      arrayBufferCalls += 1;
      throw new Error("oversized files must not be hashed");
    },
  };

  const result = await writeMediaAsset(
    createMemoryMediaStorageAdapter(),
    "file",
    {
      blob,
      fileName: "too-large.bin",
      mimeType: "application/octet-stream",
    },
    { maxBytes: 200_000_000 },
  );

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "file-size-limit-exceeded");
  assert.equal(result.error.actualBytes, 100_000_001);
  assert.equal(result.error.limitBytes, 100_000_000);
  assert.equal(result.error.limitSource, "product-policy");
  assert.equal(arrayBufferCalls, 0);
});

test("lower operational limits are distinct from browser storage quota errors", async () => {
  const adapter = createMemoryMediaStorageAdapter();
  const operational = await writeMediaAsset(
    adapter,
    "file",
    {
      blob: new Blob(["too large"]),
      fileName: "large.bin",
      mimeType: "application/octet-stream",
    },
    { maxBytes: 4 },
  );
  assert.equal(operational.ok, false);
  assert.equal(operational.error.code, "file-size-limit-exceeded");
  assert.equal(operational.error.limitBytes, 4);
  assert.equal(operational.error.actualBytes, 9);
  assert.equal(operational.error.limitSource, "operational-limit");
  assert.match(operational.error.message, /Notes App/);

  const quotaAdapter = {
    async delete() {},
    async read() {
      return null;
    },
    async write() {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    },
  };
  const quota = await writeMediaAsset(quotaAdapter, "file", {
    blob: new Blob(["small"]),
    fileName: "small.bin",
    mimeType: "application/octet-stream",
  });
  assert.equal(quota.ok, false);
  assert.equal(quota.error.code, "quota-exceeded");
});

test("media reads do not reapply the ingestion limit", async () => {
  const stored = new Blob(["existing"]);
  const adapter = {
    async delete() {},
    async read(storageKey) {
      assert.equal(storageKey, "media:existing-large-asset");
      return stored;
    },
    async write() {
      throw new Error("read must not write");
    },
  };

  const result = await readMediaAssetBlob(adapter, {
    byteLength: 60_000_000,
    storageKey: "media:existing-large-asset",
  });

  assert.equal(result.ok, true);
  assert.equal(await result.value.text(), "existing");
});

test("effective media limit rejects invalid operational configuration", () => {
  for (const invalid of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(
      () => resolveMediaFileSizeLimit(invalid),
      /positive safe integer/,
    );
  }
  assert.deepEqual(resolveMediaFileSizeLimit(200_000_000), {
    maxBytes: 100_000_000,
    source: "product-policy",
  });
});

test("current workspace media ingestion paths share writeMediaAsset", () => {
  const controller = readFileSync(
    new URL("../src/components/workspace-controller.tsx", import.meta.url),
    "utf8",
  );
  const mediaStorage = readFileSync(
    new URL("../src/lib/workspace-media-storage.ts", import.meta.url),
    "utf8",
  );
  const importExport = readFileSync(
    new URL("../src/lib/workspace-import-export.ts", import.meta.url),
    "utf8",
  );

  assert.match(controller, /const commitWorkspaceFile[\s\S]*?writeMediaAsset\(/);
  assert.match(controller, /const importWorkspaceFiles[\s\S]*?writeMediaAsset\(/);
  assert.match(controller, /const updateWorkspaceEntity[\s\S]*?writeMediaAsset\(/);
  assert.equal((controller.match(/writeMediaAsset\(/g) ?? []).length, 3);
  assert.match(importExport, /maxFileBytes: DEFAULT_MAX_MEDIA_BYTES/);
  assert.doesNotMatch(importExport, /maxFileBytes:\s*50\s*\*\s*1024\s*\*\s*1024/);
  assert.equal((mediaStorage.match(/const MAX_MEDIA_FILE_BYTES/g) ?? []).length, 1);
  assert.doesNotMatch(controller, /50\s*\*\s*1024\s*\*\s*1024/);
});

test("media writes fail before committing canonical assets on type errors", async () => {
  const adapter = createMemoryMediaStorageAdapter();
  const incompatible = await writeMediaAsset(adapter, "audio", {
    blob: new Blob(["pdf"], { type: "application/pdf" }),
    fileName: "doc.pdf",
    mimeType: "application/pdf",
  });
  assert.equal(incompatible.ok, false);
  assert.equal(incompatible.error.code, "invalid-media-type");
});

test("media writes honor cancellation and keep storage untouched", async () => {
  const adapter = createMemoryMediaStorageAdapter();
  const controller = new AbortController();
  controller.abort();

  const result = await writeMediaAsset(
    adapter,
    "file",
    {
      blob: new Blob(["cancelled"]),
      fileName: "cancelled.txt",
      mimeType: "text/plain",
    },
    { signal: controller.signal },
  );

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "aborted");
});

test("garbage collection deletes only unreferenced media assets once", async () => {
  const adapter = createMemoryMediaStorageAdapter();
  const first = await writeMediaAsset(adapter, "file", {
    blob: new Blob(["one"]),
    fileName: "one.txt",
    mimeType: "text/plain",
  });
  const second = await writeMediaAsset(adapter, "file", {
    blob: new Blob(["two"]),
    fileName: "two.txt",
    mimeType: "text/plain",
  });
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);

  const deleted = await garbageCollectMediaAssets(
    adapter,
    [first.value, second.value, second.value],
    [{ assetId: first.value.id, ownerId: "created-file-1", ownerKind: "object" }],
  );

  assert.deepEqual(deleted, [second.value.id]);
  assert.equal((await readMediaAssetBlob(adapter, first.value)).ok, true);
  assert.equal((await readMediaAssetBlob(adapter, second.value)).ok, false);
});

test("temporary URL registry revokes replaced and removed object URLs", () => {
  const revoked = [];
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  let nextId = 1;
  URL.createObjectURL = () => `blob:test-${nextId++}`;
  URL.revokeObjectURL = (url) => revoked.push(url);

  try {
    const registry = createMediaUrlRegistry();
    assert.equal(registry.create("asset-1", new Blob(["one"])), "blob:test-1");
    assert.equal(registry.create("asset-1", new Blob(["two"])), "blob:test-2");
    registry.revoke("asset-1");
    registry.revoke("asset-1");
    assert.deepEqual(revoked, ["blob:test-1", "blob:test-2"]);
  } finally {
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});
