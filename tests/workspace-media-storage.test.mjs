import assert from "node:assert/strict";
import test from "node:test";

import {
  createMediaUrlRegistry,
  createMemoryMediaStorageAdapter,
  garbageCollectMediaAssets,
  readMediaAssetBlob,
  writeMediaAsset,
} from "../src/lib/workspace-media-storage.ts";

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

test("media writes fail before committing canonical assets on quota or type errors", async () => {
  const adapter = createMemoryMediaStorageAdapter();

  const quota = await writeMediaAsset(
    adapter,
    "file",
    {
      blob: new Blob(["too large"]),
      fileName: "large.bin",
      mimeType: "application/octet-stream",
    },
    { maxBytes: 4 },
  );
  assert.equal(quota.ok, false);
  assert.equal(quota.error.code, "quota-exceeded");

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
