# Change 01: add-block-editor report

## Status

DONE_WITH_CONCERNS

The scoped implementation and acceptance evidence are complete and suitable to commit. OpenSpec task 7.2 remains unchecked because archive/publish was not requested or performed in this worker task.

## Implementation

- Corrected block-editor handle positioning after workspace scrolling by recomputing the floating position against the current block node.
- Synchronized the top-level handle target directly from pointer movement so hover geometry remains tied to the block under the pointer.
- Kept the handle above editor content and made its tooltips non-hoverable so tooltip content cannot intercept pointer interactions.
- Preserved Shift-click insertion by preventing Tiptap's modifier-only keydown handling from hiding the active drag handle before the click.
- Added browser coverage for slash-menu positioning after scrolling and near the viewport bottom, including viewport gutters, vertical flipping, and rejection of viewport-origin fallback.
- Fixed a persistence regression where Tiptap's `size: null` paragraph default caused otherwise valid documents with stable IDs to fail normalization.
- Added focused unit coverage proving null paragraph defaults are stripped without dropping stable IDs.

## OpenSpec delta repair

Strict validation initially found six ADDED block-editor requirements without scenarios and three MODIFIED object-lifecycle requirements that omitted canonical scenarios. The repairs were limited to the existing `add-block-editor` delta files:

- Added one acceptance scenario to each previously scenario-less block-editor requirement.
- Copied the existing canonical lifecycle scenarios into the affected MODIFIED requirements so the delta preserves the complete requirement bodies.
- Did not alter implementation scope or canonical specs.

## Verification evidence

### OpenSpec

```powershell
openspec validate add-block-editor --strict
```

Result: passed, `Change 'add-block-editor' is valid`.

### Focused browser acceptance

The app server was started separately on port 3107 so Playwright could return a clean process status on Windows.

```powershell
$env:PLAYWRIGHT_PORT='3107'
.\node_modules\.bin\playwright.CMD test tests/e2e/block-editor-interactions.spec.ts tests/e2e/slash-menu-reference.spec.ts tests/e2e/workspace-parity.spec.ts --workers=1
```

Result: 22 passed in 1.6 minutes, exit code 0.

Coverage included selection preservation, independent plus/grip controls, handle geometry and reordering, menu and tooltip behavior, slash activation/order/ordinary/scrolled/viewport-edge placement, persistence buffering, desktop geometry, mobile overflow, reduced motion, object persistence/reopen behavior, and clean browser execution.

An earlier combined Playwright/web-server invocation also reached 22 passing assertions but hung during Windows child-process teardown and was interrupted. It is not counted as the acceptance gate; the separately managed rerun above is the authoritative clean result.

After a concurrent pointer-target synchronization addition surfaced in the authorized handle file, the handle-focused browser spec was rerun on isolated port 3108:

```powershell
$env:PLAYWRIGHT_PORT='3108'
.\node_modules\.bin\playwright.CMD test tests/e2e/block-editor-interactions.spec.ts --workers=1
```

Result: 2 passed in 19.2 seconds, exit code 0. Scoped Biome on `src/components/block-editor-handle.tsx` also passed.

### Focused source and document tests

```powershell
node --test tests/block-editor-contract.test.mjs tests/editor-document.test.mjs
```

Result: 24 passed, 0 failed, exit code 0. This includes semantic read-only rendering, localized copy, drag/tooltip/dropcursor contracts, performance boundaries, neutral document behavior, and the null paragraph-size regression.

### Scoped formatting and lint

```powershell
.\node_modules\.bin\biome.CMD ci src/components/block-editor-handle.tsx src/editor/document.ts tests/e2e/slash-menu-reference.spec.ts tests/editor-document.test.mjs openspec/changes/add-block-editor/specs/ui/block-editor/spec.md openspec/changes/add-block-editor/specs/ui/object-lifecycle/spec.md
```

Result: passed, 4 supported files checked, no fixes applied. Biome ignored the two Markdown delta files.

### Repository verification

```powershell
pnpm verify
```

Result: passed, exit code 0.

- `format:check`: passed.
- `lint`: 118 files checked, no fixes applied.
- complexity: passed with maximum allowed cyclomatic complexity 12.
- Next.js type generation: passed.
- TypeScript: passed.
- coverage tests: 161 passed, 0 failed; aggregate 92.60% lines, 78.13% branches, 91.32% functions.
- production build: passed; static and dynamic routes generated successfully.

### Graphify

```powershell
pnpm graphify:update:code
```

Result: passed. Graphify extracted 195 code files, wrote a 4,436-node/7,529-edge graph, and reclustered it into 356 communities. Generated cache artifacts were restored afterward so they would not broaden the commit.

### Whitespace

```powershell
git diff --check
```

Result: passed after generated Graphify cache files and Playwright `debug.log` were removed from the scoped diff.

## OpenSpec checklist decisions

Checked with direct evidence:

- 4.4 slash positioning at ordinary, scrolled, and viewport-edge caret positions.
- 4.13 handle geometry, insertion, menu, tooltip, reorder, and mobile behavior.
- 5.3 focus, reduced motion, mobile overflow, read-only semantics, and clean console behavior.
- 6.2 focused Playwright acceptance coverage.

Task 7.1 is marked after the final staged-file review passed. Task 7.2 remains unchecked because this task does not archive or publish the change.

## Residual concerns

- Controller-confirmed `pnpm biome:ci` remains red on unrelated baseline files such as `next.config.ts` and `public/*.svg`. The scoped Biome command and the repository's actual `pnpm verify` pipeline both pass; unrelated baseline files were not modified.
- Node's focused test run emits existing `MODULE_TYPELESS_PACKAGE_JSON` performance warnings for TypeScript modules. Tests still pass.
- OpenSpec archive/publish remains intentionally pending for controller review.

## Changed files

- `src/components/block-editor-handle.tsx`
- `src/editor/document.ts`
- `tests/e2e/slash-menu-reference.spec.ts`
- `tests/editor-document.test.mjs`
- `openspec/changes/add-block-editor/specs/ui/block-editor/spec.md`
- `openspec/changes/add-block-editor/specs/ui/object-lifecycle/spec.md`
- `openspec/changes/add-block-editor/tasks.md`
- `.superpowers/sdd/2026-08-25-prototyping-priorities/change-01-add-block-editor-report.md`
