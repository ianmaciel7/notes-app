import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const manifestPath =
  "artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-31-corrective-acceptance/manifest.json";
const referenceIndexPath = "docs/references/capacities-keyboard-command-system.md";
const acceptanceMatrixPath =
  "artifacts/reference-evidence/capacities-keyboard-command-system/2026-08-31-corrective-acceptance/acceptance-matrix.md";

const [manifestSource, referenceIndexSource, acceptanceMatrixSource] =
  await Promise.all([
    readFile(manifestPath, "utf8"),
    readFile(referenceIndexPath, "utf8"),
    readFile(acceptanceMatrixPath, "utf8"),
  ]);

const manifest = JSON.parse(manifestSource);

test("keyboard command evidence records independent local and reference status", () => {
  const evidenceItems = [
    ...manifest.commands,
    ...manifest.editorTriggerStates,
  ];

  assert.ok(evidenceItems.length > 0);

  for (const item of evidenceItems) {
    assert.match(item.local_status, /^(implemented|passed|failed|blocked|not tested)$/);
    assert.match(
      item.reference_status,
      /^(confirmed|contradicted|unknown|mutation-prohibited|not applicable)$/,
    );
  }
});

test("keyboard command evidence rejects parity claims without confirmed reference status", () => {
  const evidenceItems = [
    ...manifest.commands,
    ...manifest.editorTriggerStates,
  ];

  for (const item of evidenceItems) {
    if (item.reference_status !== "confirmed") {
      assert.doesNotMatch(JSON.stringify(item), /confirmed Capacities parity/i);
      assert.doesNotMatch(JSON.stringify(item), /matched Capacities parity confirmed/i);
    }
  }

  assert.match(referenceIndexSource, /2026-08-28-initial-matrix/);
  assert.match(referenceIndexSource, /2026-08-31-corrective-acceptance/);
  assert.match(acceptanceMatrixSource, /local_status/);
  assert.match(acceptanceMatrixSource, /reference_status/);
  assert.doesNotMatch(acceptanceMatrixSource, /confirmed Capacities parity/i);
});
