import assert from "node:assert/strict";
import test from "node:test";
import {
  getWorkspacePanelPresentation,
  WORKSPACE_CONTEXT_OVERLAY_BREAKPOINT,
  WORKSPACE_MOBILE_BREAKPOINT,
} from "../src/lib/workspace-layout.ts";
import { WORKSPACE_OBJECT_STORAGE_KEY } from "../src/lib/workspace-object-storage.ts";
import { WORKSPACE_OBJECT_SCHEMA_VERSION } from "../src/lib/workspace-objects.ts";

test("workspace panel presentation preserves the desktop sidebar breakpoint", () => {
  assert.equal(WORKSPACE_MOBILE_BREAKPOINT, 768);
  assert.equal(WORKSPACE_CONTEXT_OVERLAY_BREAKPOINT, 1024);
  assert.equal(getWorkspacePanelPresentation(390), "mobile");
  assert.equal(getWorkspacePanelPresentation(480), "mobile");
  assert.equal(getWorkspacePanelPresentation(767), "mobile");
  assert.equal(getWorkspacePanelPresentation(768), "overlay");
  assert.equal(getWorkspacePanelPresentation(1023), "overlay");
  assert.equal(getWorkspacePanelPresentation(1024), "inline");
  assert.equal(getWorkspacePanelPresentation(1536), "inline");
});

test("workspace persistence uses the runtime Structure schema version", () => {
  assert.equal(WORKSPACE_OBJECT_SCHEMA_VERSION, 5);
  assert.equal(WORKSPACE_OBJECT_STORAGE_KEY, "notes-app:workspace-objects:v1");
});
