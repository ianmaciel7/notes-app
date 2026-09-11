# Bugfix Spec: Real local-first workspace interactions

## Current Behavior

Audit base: `dev` at `94b7b5e313fd84cc14bdbd6ca269bff9866a4cb9`.
The main renderer only matches exact tab IDs, so collection tabs and duplicate tab
instances fall through to implementation placeholders. All ordinary detail screens
are read-only. Flashcard details do not expose the existing persisted FSRS review
operation. The restore-trash callback aliases permanent removal of trash metadata.
Search ignores content. Sidebar inspectors display placeholders despite existing
scoped entity and relation data. Clipboard handlers can report success after failure.

## Why This Is a Defect

Visible actions must perform their named operation against the active Space's
IndexedDB data, persist after reload, and never report simulated success.

## Expected Behavior

- Entity editing preserves identity, metadata, and Space boundaries; saves and
  review updates are atomic with pending sync mutations.
- Flashcards show their stored question/answer and persist real four-rating reviews.
- Tasks persist completion; study goals use their own scoped flashcard data.
- Collection and duplicate tabs resolve their actual content.
- Trash keeps recoverable snapshots and restores them transactionally; legacy
  metadata without recoverable content produces an explicit error, not data loss.
- Search includes stored body text, tags, and readable property values.
- Existing backlinks and related-object data become navigable from the inspector.
- Errors remain visible and controls prevent concurrent submissions.

## Preserved Behavior

Per-type ObjectList/ObjectDetail composition, existing data IDs, blank new Spaces,
Dexie as source of truth, `_syncStatus = pending`, server-only credentials, source
quote grounding, and user-scoped remote paths remain unchanged. No production
fixtures, fake AI answers, or mock review queues are introduced. Cloud sharing,
provider provisioning, advanced document parsing, and AI chat are not represented
as implemented when their integration has not been exercised.

## Regression Test

Focused tests use the real repository with fake-indexeddb only as the test runtime.
They cover persistence, rollback on queue failure, cross-Space isolation, restoration,
searchable content, selected goal scoping, and real tab-target resolution. Browser
checks must exercise edit/save/reload and flashcard review when the environment permits.

## Root Cause

UI refactoring retained the visual wrappers but omitted domain actions. Several
callbacks still route to generic pending views rather than the existing repository.
Entity update and review writes are not transactionally coupled to their sync queue.

## Verification

Baseline CI before edits: 338 tests passed, 5 failed (legacy complexity dependency,
component color tokens, and missing Ladle story metadata). Results after changes
are recorded in the implementation plan; baseline failures are not concealed.
