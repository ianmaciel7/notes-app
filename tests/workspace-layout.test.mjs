import assert from "node:assert/strict";
import test from "node:test";
import {
  getWorkspacePanelPresentation,
  WORKSPACE_CONTEXT_OVERLAY_BREAKPOINT,
  WORKSPACE_CONTEXT_PANEL_DEFAULT_WIDTH_PX,
  WORKSPACE_CONTEXT_PANEL_MAX_WIDTH_PX,
  WORKSPACE_CONTEXT_PANEL_MIN_WIDTH_PX,
  WORKSPACE_MOBILE_BREAKPOINT,
  WORKSPACE_MOBILE_OVERLAY_MARGIN_PX,
  WORKSPACE_RAIL_HEIGHT_PX,
  WORKSPACE_SIDEBAR_DEFAULT_WIDTH_PX,
  WORKSPACE_SIDEBAR_MAX_WIDTH_PX,
  WORKSPACE_SIDEBAR_MIN_WIDTH_PX,
  WORKSPACE_SURFACE_GUTTER_PX,
  WORKSPACE_SURFACE_RADIUS_PX,
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

test("workspace layout exports the current reference shell geometry", () => {
  assert.equal(WORKSPACE_SIDEBAR_DEFAULT_WIDTH_PX, 288);
  assert.equal(WORKSPACE_SIDEBAR_MIN_WIDTH_PX, 224);
  assert.equal(WORKSPACE_SIDEBAR_MAX_WIDTH_PX, 384);
  assert.equal(WORKSPACE_CONTEXT_PANEL_DEFAULT_WIDTH_PX, 374);
  assert.equal(WORKSPACE_CONTEXT_PANEL_MIN_WIDTH_PX, 320);
  assert.equal(WORKSPACE_CONTEXT_PANEL_MAX_WIDTH_PX, 640);
  assert.equal(WORKSPACE_RAIL_HEIGHT_PX, 46);
  assert.equal(WORKSPACE_SURFACE_GUTTER_PX, 10);
  assert.equal(WORKSPACE_SURFACE_RADIUS_PX, 12);
  assert.equal(WORKSPACE_MOBILE_OVERLAY_MARGIN_PX, 40);
});

test("workspace persistence uses the runtime Structure schema version", () => {
  assert.equal(WORKSPACE_OBJECT_SCHEMA_VERSION, 5);
  assert.equal(WORKSPACE_OBJECT_STORAGE_KEY, "notes-app:workspace-objects:v1");
});
