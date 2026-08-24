import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile("src/editor/slash-command.tsx", "utf8");

test("slash menu defers nested React root teardown outside the current render", () => {
  assert.match(source, /function scheduleSlashMenuRootUnmount/);
  assert.match(source, /timerHost\.setTimeout\(\(\) => \{/);
  assert.match(source, /scheduleSlashMenuRootUnmount\(root, element/);
  assert.match(source, /root\.unmount\(\)/);
  assert.doesNotMatch(
    source,
    /destroy:\s*\(\) => \{\s*root\.unmount\(\)/,
  );
});

test("slash menu teardown is idempotent and blocks renders after destroy starts", () => {
  assert.match(
    source,
    /type RendererState = "active" \| "destroy-pending" \| "destroyed"/,
  );
  assert.match(source, /if \(state !== "active"\) return;/);
  assert.match(source, /state = "destroy-pending"/);
  assert.match(source, /state = "destroyed"/);
});

test("slash menu uses the managed Suggestion mount lifecycle", () => {
  assert.match(
    source,
    /unmountFloatingElement = props\.mount\(menu\.element\)/,
  );
  assert.match(source, /currentUnmount\?\.\(\)/);
  assert.match(source, /currentMenu\?\.destroy\(\)/);
  assert.match(source, /onExit: cleanupMenu/);
});
