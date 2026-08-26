import assert from "node:assert/strict";
import test from "node:test";

import {
  blockEditorDocumentFromPlainText,
  blockEditorDocumentToPlainText,
} from "../src/editor/document.ts";
import {
  commitImportJob,
  createImportJob,
  createNativeWorkspaceExport,
  createWorkspaceExportBundle,
  emptyWorkspaceForImport,
  parseNativeWorkspaceExport,
} from "../src/lib/workspace-import-export.ts";
import {
  createInitialWorkspaceObjectState,
  workspaceObjectReducer,
} from "../src/lib/workspace-objects.ts";

function expectOk(result) {
  assert.equal(result.ok, true, result.ok ? undefined : result.error.message);
  return result.state;
}

test("staged text and markdown imports preview without mutating canonical state", () => {
  const initial = createInitialWorkspaceObjectState();
  const job = createImportJob({
    now: () => new Date("2026-08-25T00:00:00.000Z"),
    sources: [
      {
        externalId: "source-a",
        path: "notes/source-a.md",
        text: "# Source A\n\nSee [[id:source-b]].",
      },
      {
        externalId: "source-b",
        path: "notes/source-b.txt",
        text: "Source B",
      },
    ],
    state: initial,
  });

  assert.equal(job.state, "previewed");
  assert.equal(initial.entities.length, 0);
  assert.equal(job.objects.length, 2);
  assert.equal(job.idMap["source-a"].startsWith("imported-page-1-"), true);

  const committed = commitImportJob(initial, job);
  assert.equal(committed.job.state, "committed");
  assert.equal(committed.state.entities.length, 2);
  assert.equal(committed.state.entities[0].title, "source-a");
  assert.equal(committed.state.activeEntityId, committed.state.entities[1].id);
});

test("CSV imports require explicit mapping when source fields are ambiguous", () => {
  const blocked = createImportJob({
    sources: [
      {
        path: "table.csv",
        text: "name,notes\nAlice,Research",
      },
    ],
  });

  assert.equal(blocked.state, "blocked");
  assert.deepEqual(
    blocked.errors.map((error) => error.code),
    ["ambiguous-mapping"],
  );
  assert.equal(blocked.objects.length, 0);

  const mapped = createImportJob({
    fieldMapping: { title: "name" },
    sources: [
      {
        path: "table.csv",
        text: "name,notes\nAlice,Research",
      },
    ],
  });
  assert.equal(mapped.state, "previewed");
  assert.equal(mapped.objects[0].title, "Alice");
});

test("archive and file security rejects traversal executables and excessive jobs", () => {
  const job = createImportJob({
    limits: { maxFiles: 2 },
    sources: [
      { path: "../escape.md", text: "bad" },
      { path: "tools/run.ps1", text: "bad" },
      { path: "safe.md", text: "ok" },
    ],
  });

  assert.equal(job.state, "blocked");
  assert.deepEqual(job.errors.map((error) => error.code).sort(), [
    "blocked-file-type",
    "invalid-archive-entry",
    "job-limit-exceeded",
  ]);
  assert.deepEqual(job.checkpoint.completedPaths, ["safe.md"]);
  assert.deepEqual(job.checkpoint.failedPaths.sort(), [
    "../escape.md",
    "tools/run.ps1",
  ]);
});

test("checkpoints allow large jobs to resume after partial failures", () => {
  const first = createImportJob({
    sources: [
      { path: "bad.exe", text: "blocked" },
      { path: "one.md", text: "One" },
    ],
  });
  assert.equal(first.state, "blocked");

  const resumed = createImportJob({
    checkpoint: {
      completedPaths: first.checkpoint.completedPaths,
      failedPaths: first.checkpoint.failedPaths,
      nextSourceIndex: 1,
      stage: "preview",
    },
    sources: [
      { path: "bad.exe", text: "blocked" },
      { path: "one.md", text: "One" },
      { path: "two.md", text: "Two" },
    ],
  });

  assert.equal(resumed.state, "previewed");
  assert.deepEqual(resumed.checkpoint.completedPaths, ["one.md", "two.md"]);
});

test("unresolved links are explicit repairable preview errors", () => {
  const job = createImportJob({
    sources: [
      {
        externalId: "source",
        path: "source.txt",
        text: "Missing [[id:missing-target]]",
      },
    ],
  });

  assert.equal(job.state, "resumable");
  assert.equal(job.errors[0].code, "unresolved-link");
  assert.equal(job.errors[0].stage, "map");
  assert.equal(job.objects.length, 1);
});

test("native workspace export restores supported canonical records into an empty workspace", () => {
  let state = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    objectTypeId: "page",
    title: "Round trip",
    type: "createDocument",
  });
  state = workspaceObjectReducer(state, {
    id: state.entities[0].id,
    patch: { body: blockEditorDocumentFromPlainText("Native body") },
    type: "updateEntity",
  });

  const exported = createNativeWorkspaceExport(
    state,
    [],
    () => new Date("2026-08-25T00:00:00.000Z"),
  );
  const restored = expectOk(
    parseNativeWorkspaceExport(
      JSON.parse(JSON.stringify(exported)),
      emptyWorkspaceForImport(),
    ),
  );

  assert.equal(restored.entities.length, 1);
  assert.equal(restored.entities[0].title, "Round trip");
  assert.equal(
    blockEditorDocumentToPlainText(restored.entities[0].body),
    "Native body",
  );
  assert.equal(restored.structures.length, state.structures.length);
});

test("reduced markdown csv and media exports declare non-lossless semantics", () => {
  const state = workspaceObjectReducer(createInitialWorkspaceObjectState(), {
    objectTypeId: "page",
    title: "Readable",
    type: "createDocument",
  });
  const bundle = createWorkspaceExportBundle(state, [
    {
      byteLength: 5,
      createdAt: "2026-08-25T00:00:00.000Z",
      fileName: "image.png",
      hash: "hash",
      id: "asset-1",
      mimeType: "image/png",
      state: "stored",
      storageKey: "media:hash",
      updatedAt: "2026-08-25T00:00:00.000Z",
    },
  ]);

  assert.match(bundle.csv.content, /id,type,title,createdAt,text/);
  assert.match(bundle.markdown[0].content, /# Readable/);
  assert.match(bundle.mediaManifest.content, /asset-1/);
  assert.ok(bundle.csv.lossiness[0].includes("flattens"));
  assert.ok(bundle.markdown[0].lossiness[0].includes("readable"));
});
