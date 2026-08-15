## Overview

The MVP should ship as a single-user personal object studio inside the existing Next.js App Router application. It should prioritize configurable objects, clear visual hierarchy, and relationships over folder/file note-taking. Study is the first packaged workflow, not the product boundary.

For the first local deployment, structured application data should be persisted in SQLite behind a server-only DAL and uploaded binaries should be persisted through a filesystem-backed blob-storage adapter. Runtime data defaults to ignored paths under `var/`; the versioned validation corpus is never used as runtime storage. "Local" means a single-user application and local persistence, not an offline browser application or a promise of durable hosted persistence. These providers can be replaced later without changing feature code.

The implementation should avoid unnecessary service layers until persistence, authentication, or external boundaries require them. Server Components, Server Actions, and route handlers should be used only where they match the runtime boundary.

## Architecture Boundary

The MVP should follow current Next.js App Router guidance:

- prefer Server Components for server data reads;
- use Client Components only for interactivity, browser APIs, effects, or local UI state;
- avoid calling internal Route Handlers from Server Components;
- use Server Actions as mutation boundaries;
- reserve Route Handlers for real HTTP boundaries;
- mark sensitive server-only modules with `import "server-only"`.

Application data should pass through a server-side DAL. The DAL should hide SQLite and provider details, return minimal data, and keep validation server-side.

Infrastructure must remain replaceable. Provider-specific imports such as Firebase Admin, AWS SDK, Cloudflare SDK, or `node:fs` should stay inside adapters, not UI or feature modules.

Files and blobs use a `BlobStorage` contract that stores, opens, and removes content by opaque storage key. The MVP selects a local-filesystem adapter in one composition root. Only the adapter may import filesystem APIs; features and UI must not depend on physical paths.

## Domain Shape

Starter object types for the first workflow:

- Study Goal
- Study Topic
- Question
- Flashcard
- Study Session

The UI should expose these as configurable typed objects with properties and relationships rather than folders and files. The same foundation should support a user-created non-study object type without an application-code change.

Question attempts and flashcard reviews should be immutable activity records rather than arrays embedded in Question or Flashcard properties. Study Session may aggregate and relate those records for navigation and analytics.

## Customization Foundation

The MVP should treat the starter study objects as configured object types. The user should be able to extend them with custom properties and add future object types without changing application code for every new workflow.

Object types, property definitions, and objects need immutable identifiers. Property definitions also need stable semantic keys that are independent from editable display names. Workflow-required properties may be renamed visually but cannot be deleted or changed to an incompatible type while the workflow is enabled.

Initial property types should cover the study use case:

- text
- number
- date
- boolean
- single select
- multi select
- object link

The first object-type view should be property-driven and support filtering and sorting. Saved layouts, advanced grouping, and manual collections are deferred from the two-week slice. Tags should connect themes across object types and object-link properties should preserve structured relations.

## AI Generation Flow

Gemini-assisted flows should follow this pattern:

```text
register source
  -> calculate SHA-256 and classify document role
  -> persist the validated binary through BlobStorage
  -> extract page-aware text on the server
  -> create stable source chunks
  -> run role-specific Gemini structured output
  -> validate drafts against application schemas
  -> user review/edit/approve
  -> save approved objects and source relations
```

Generated objects should include enough source context for the user to understand why they were suggested. Missing or uncertain fields should be visible during review.

Gemini responses should use structured output validated against application-owned schemas. Invalid items should remain unsaved and appear as actionable review errors. Approved items should preserve source excerpts and generation metadata, and repeated approval must not create duplicate objects.

The browser upload boundary accepts PDFs and UTF-8 text. It validates the configured size limit and content signature/encoding, computes SHA-256 before processing, and deduplicates before retaining another binary. The first implementation should extract text locally with a server-only PDF parser instead of sending complete PDFs directly to Gemini. This keeps page provenance, chunk retries, deduplication, and processing status deterministic. PDFs without a usable text layer should be marked for OCR or manual text input; OCR is not required for the first slice.

`POST /api/sources` is the multipart upload boundary and `GET /api/sources/[id]/content` streams registered content. Server Components otherwise read through the DAL directly, and ordinary UI mutations use Server Actions.

Prompt and schema behavior should depend on document role:

- edital, guide, or objective list -> hierarchical scope and topic drafts;
- proof -> question drafts with source number, prompt, alternatives, and unconfirmed answer state;
- answer key -> separate answer-entry drafts;
- question plus approved explanation -> optional flashcard drafts.

Question and answer-key drafts should be matched only through compatible assessment metadata and question number. Preliminary, ambiguous, unmatched, or conflicting keys should remain unresolved for review.

Gemini must be isolated behind a server-only provider adapter. `GEMINI_API_KEY` must never reach a Client Component, browser bundle, prompt, source record, log, analytics event, or persisted generation result. The model identifier should be configuration, not a stale model name embedded throughout feature code.

## Scheduling

Scheduling should be deterministic in the MVP. Gemini can assist with explanations or generation, but daily planning and spaced repetition should be computed from stored data:

- target date;
- remaining questions;
- configured daily targets;
- answer history;
- weak topics;
- due and overdue flashcards.

Flashcard scheduling should use an established FSRS implementation with Again, Hard, Good, and Easy ratings. Daily question targets should use the configured target volume, completed unique questions, target date, and configured study days; the user can override the calculated target. A topic is initially weak when it has at least three attempts and its error rate is among the highest for the active goal.

Acceptance uses DATAPREV 2026, Perfil 3 - Desenvolvimento de Software, with a 2026-10-11 target date, 70-question target volume, and Monday-through-Friday study days. The target edital and separate 60-question related PPSA proof are selected from the checked-in reference corpus and uploaded through the browser; their binaries are not read directly from `data/` at runtime.

## Verification Strategy

Use unit tests for semantic-property protection, scheduling inputs, filters, attempt analytics, and AI-output validation. Use the FSRS library's behavior rather than reimplementing its algorithm. Use component or browser-level checks for the complete capture-to-review and study-session workflows once the UI exists.

Use contract tests for storage adapters if file/blob support ships in the MVP. Add import-boundary enforcement only when the project contains provider-specific infrastructure worth protecting.

OpenSpec validation should run for this change before implementation is considered ready.
