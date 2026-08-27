import assert from "node:assert/strict";
import test from "node:test";

import * as workspaceRouting from "../src/lib/workspace-routing.ts";

const {
  parseWorkspaceRoute,
  workspaceRouteId,
  workspaceRoutePath,
} = workspaceRouting;

test("creates stable UUID-shaped public identifiers", () => {
  const id = workspaceRouteId("created-page-1");
  assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(id, workspaceRouteId("created-page-1"));
});

test("builds Capacities-style workspace and object routes", () => {
  assert.equal(
    workspaceRoutePath({
      locale: "pt-BR",
      spaceId: "workspace-uuid",
      targetId: "object-uuid",
    }),
    "/pt-BR/workspace-uuid/object-uuid",
  );

  assert.equal(
    workspaceRoutePath({
      locale: "pt-BR",
      spaceId: "workspace-uuid",
      section: "calendar",
    }),
    "/pt-BR/workspace-uuid?section=calendar",
  );
});

test("parses an object route without mixing section state", () => {
  assert.deepEqual(
    parseWorkspaceRoute(
      "/pt-BR/workspace-uuid/object-uuid",
      "",
      "pt-BR",
      "labs",
    ),
    {
      spaceId: "workspace-uuid",
      targetId: "object-uuid",
      section: null,
    },
  );
});

test("falls back to the local workspace for the locale root", () => {
  assert.deepEqual(
    parseWorkspaceRoute("/pt-BR", "?section=calendar", "pt-BR", "labs"),
    {
      spaceId: "labs",
      targetId: null,
      section: "calendar",
    },
  );
});

test("derives contextual panel visibility and body from workspace route state", () => {
  assert.equal(typeof workspaceRouting.contextualPanelRouteState, "function");
  const { contextualPanelRouteState } = workspaceRouting;
  assert.deepEqual(
    contextualPanelRouteState({
      spaceId: "workspace-uuid",
      targetId: "object-uuid",
      section: null,
    }),
    { entry: "graphView", visible: true },
  );
  assert.deepEqual(
    contextualPanelRouteState({
      spaceId: "workspace-uuid",
      targetId: null,
      section: "search",
    }),
    { entry: "localSpaceQuery", visible: true },
  );
  assert.deepEqual(
    contextualPanelRouteState({
      spaceId: "workspace-uuid",
      targetId: null,
      section: "explore",
    }),
    { entry: "explore", visible: true },
  );
  assert.deepEqual(
    contextualPanelRouteState({
      spaceId: "workspace-uuid",
      targetId: null,
      section: "calendar",
    }),
    { entry: "explore", visible: false },
  );
  assert.deepEqual(
    contextualPanelRouteState({
      spaceId: "workspace-uuid",
      targetId: null,
      section: null,
    }),
    { entry: "explore", visible: false },
  );
});
