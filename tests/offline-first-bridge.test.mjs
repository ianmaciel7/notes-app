import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("offline bridge does not keep a service worker active during development", async () => {
  const [bridge, rootLayout] = await Promise.all([
    readFile(
      new URL("../src/components/offline-first-bridge.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(bridge, /process\.env\.NODE_ENV !== "production"/);
  assert.match(bridge, /clearDevelopmentServiceWorkerState/);
  assert.match(bridge, /\.getRegistrations\(\)/);
  assert.match(bridge, /\.unregister\(\)/);
  assert.match(bridge, /cacheName\.startsWith\(APP_CACHE_PREFIX\)/);
  assert.match(rootLayout, /strategy="beforeInteractive"/);
  assert.match(rootLayout, /developmentServiceWorkerCleanupScript/);
  assert.match(rootLayout, /notes-app-dev-sw-cleaned/);
  assert.match(rootLayout, /window\.location\.reload\(\)/);
});
