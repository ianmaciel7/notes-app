# Testing

This document describes the testing strategy for the Notes App.

The goal is focused confidence: tests should protect the local-first data model, security boundaries, document ingestion, grounded AI generation, sync behavior, and the study workflow without turning every UI detail into brittle coverage.

## Test Commands

Use `pnpm` exclusively.

Common commands:

```bash
pnpm test:unit
pnpm lint
pnpm format
pnpm check --write .
pnpm ladle:dev
pnpm ladle:build
pnpm build
```

Do not add ESLint, Prettier, `npm`, or `yarn` workflows.

## Test Stack

The project uses:

- Vitest for unit and integration-style TypeScript tests.
- `fake-indexeddb` for Dexie-backed local database tests.
- Ladle for component stories and isolated UI states.
- Playwright for browser-level flows when interaction, layout, or rendering behavior needs real browser coverage.
- Biome for linting and formatting.

## What to Test

Prioritize tests around behavior that protects data integrity, user trust, or security boundaries.

High-value areas:

- Dexie schema and repository write contracts.
- Entity creation, updates, deletes, relation cleanup, and sync mutation enqueueing.
- Immutable identity fields such as `id`, `spaceId`, `objectTypeId`, and `createdAt`.
- Highlight creation and quote anchor metadata.
- Flashcard creation with valid source highlight provenance.
- Grounded AI card persistence from exact source quotes.
- Rejection of generated cards whose `exactQuote` does not match source text.
- FSRS review transitions and due-date behavior.
- Study goal pacing calculations.
- Document text normalization, file type inference, hashing, and chunking.
- PDF and EPUB parser adapters with malformed or unsupported inputs.
- Authenticated sync route validation.
- Firestore writer path construction and user namespace isolation.
- Storage upload validation, MIME allowlisting, file name sanitization, and path scoping.
- Error responses that avoid leaking secrets or internal details.

## Unit Tests

Use unit tests for pure logic and small boundaries:

- FSRS calculations.
- Study goal burndown math.
- Text chunking.
- Generated-card response parsing.
- Firestore value serialization.
- Sync mutation validation helpers.
- File type inference.
- File name sanitization.
- Base64 validation.

Unit tests should be deterministic and avoid network calls.

## Repository and Dexie Tests

Repository tests should use isolated database names and `fake-indexeddb`.

These tests should verify:

- Writes persist to the expected tables.
- `_syncStatus` is set correctly.
- Sync mutations are created with the expected operation and payload shape.
- Deleting an entity cleans up same-space relations.
- Cross-space relations are not included in local graph or backlinks.
- Flashcards cannot be created as grounded cards without a same-space source highlight.

Each test should start from a clean database instance. Avoid sharing global Dexie state across tests.

## Route Handler Tests

Route-level tests should exercise request parsing, authentication behavior, and dependency injection.

For `/api/ai/generate`, test:

- Unsupported providers are rejected.
- Empty text is rejected.
- Missing provider keys return service-unavailable responses.
- Provider failures map to safe error responses.
- Valid provider JSON is parsed through the structured card validator.

For `/api/documents/parse`, test:

- Text and HTML payloads produce prepared document data.
- Unsupported payloads return `415`.
- Parser adapter failures return safe errors.
- Chunk options are validated and bounded.

For `/api/sync/push`, test:

- Missing or invalid bearer tokens are rejected.
- Malformed mutation payloads are rejected.
- Valid mutations are committed under the verified user id.
- Missing remote sync configuration returns a service-unavailable response.

For `/api/storage/upload`, test:

- Missing or invalid bearer tokens are rejected.
- Unsupported MIME types are rejected.
- Invalid base64 payloads are rejected.
- Uploaded paths use the verified user id and sanitized file names.

## Component Tests and Stories

Use Ladle stories for important UI states:

- Empty workspace.
- Sidebar object type navigation.
- Command palette.
- Reader selection toolbar.
- AI staging drawer states.
- Flashcard review states.
- Study goal pacing states.
- Right inspector states.

Stories should use realistic Dexie-backed or repository-backed fixtures when the component represents production data behavior.

Avoid shipping production components that display mock flashcard queues or fake local-only review state.

## Browser and UI Verification

Use Playwright or the repository's UI verification workflow for flows that require a browser:

- Highlight rendering behavior.
- Keyboard navigation.
- Command palette interaction.
- Reader selection behavior.
- Flashcard review flow.
- Responsive 3-pane layout.
- Authenticated upload or sync smoke tests with mocked network dependencies.

When testing highlights, verify that rendering does not mutate React-managed text nodes. Web and Markdown highlights should use the CSS Custom Highlight API. PDF highlights should render as overlays.

## Security-Focused Tests

Security-sensitive changes should include focused tests for the invariant being touched.

Examples:

- Auth routes reject missing or invalid Firebase ID tokens.
- Sync writes cannot escape `users/{uid}`.
- Storage paths cannot use caller-supplied user ids.
- AI provider keys are read only on the server boundary.
- Generated cards without verbatim quote matches are not persisted.
- HTML extraction does not preserve executable script/style content.
- Parser and upload boundaries reject malformed or unsupported payloads.
- Firestore rules remain deny-by-default for unrelated paths.

See `SECURITY.md` for the authoritative list of invariants and reportable security findings.

## Test Data

Test fixtures should avoid real user data, real documents, production API keys, Firebase credentials, provider responses containing private content, or copied sensitive material.

Use synthetic examples for:

- Notes and pages.
- Extracted document text.
- Generated flashcards.
- Firebase user ids.
- Access tokens.
- Storage bucket names.

Fake credentials should be obvious placeholders such as `test-token` or `example-api-key`.

## Network and External Services

Tests should not depend on live Gemini, Groq, Firebase, Firestore, or Storage services unless they are explicitly marked as manual smoke tests.

Prefer dependency injection and mocked fetchers/uploader/verifier adapters.

Manual smoke tests may be useful before deployment, but they should not be required for the default unit test suite.

## Review Expectations

Before merging security-sensitive or data-model changes, reviewers should look for:

- Tests covering the changed invariant.
- No server credentials in client code.
- No broad Firestore or Storage access.
- No ungrounded AI card persistence.
- No direct DOM text mutation for highlights.
- No mock data replacing production repository-backed flows.
- No new parser, upload, or sync path without validation.

## Maintenance

Update this file when the project changes test frameworks, adds new route handlers, adds new persistence tables, changes sync architecture, introduces new document formats, or adds autonomous AI agent behavior.
