# Exam and FSRS Foundation Design

**Status:** Ready for review

**Date:** 2026-09-18

**Scope:** First production slice of the private, Capacities-inspired knowledge and study application

## Intent

Build a production-ready, cloud-first application in which a user owns private spaces, creates reusable knowledge objects, assembles questions into exams, completes exam attempts, and studies questions with FSRS. The first slice must establish boundaries that can later support collaborative or public spaces, additional object types, richer editing, AI assistance, and synchronization without implementing those capabilities now.

Success means one authenticated user can create a private space, author and publish reusable questions, compose and publish an exam, complete and resume an attempt, review encountered questions with FSRS, and trust that historical attempts and scheduling records remain reproducible after later edits.

## Confirmed product decisions

- Spaces are private and single-owner in the first release.
- The data model reserves an explicit visibility concept, but collaborative membership and public access are deferred.
- Firestore remains the source of truth. Offline-first storage, Dexie, and synchronization are not part of this slice.
- Questions are reusable standalone objects and may belong to multiple exams and collections.
- FSRS memory belongs to a user and question, not to an exam. Reviewing the same question from different exams updates one memory state.
- The first question formats are single choice, multiple choice, and true/false, all automatically graded.
- Correctness and FSRS rating are separate signals. After seeing the result, the user selects Again, Hard, Good, or Easy.
- Exams use draft, published, and archived lifecycle states.
- Exam attempts started from published exams reference immutable exam and question revisions.
- The application uses a typed modular-monolith architecture rather than a fully dynamic object engine.

## Scope decomposition

This specification covers one implementation program with four ordered increments:

1. Space and object foundation: private spaces, object identity, immutable revisions, collections, and tags.
2. Authoring and publishing: reusable questions and versioned exams.
3. Attempts: resumable exam sessions, deterministic grading, and historical results.
4. FSRS: due queue, explicit ratings, transactional memory updates, and review history.

Each increment must leave the application deployable and must preserve the current Firebase authentication and internationalization behavior.

Deferred programs include collaboration, public publishing, AI generation, rich block editing, local-first storage, cloud synchronization, analytics beyond the first study summaries, and other Capacities-style object types.

## Architectural shape

The application remains a Next.js 16 and React 19 modular monolith backed by Firebase Auth, Firebase Admin, and Cloud Firestore.

```text
Localized App Router pages
        |
        v
Authenticated Server Actions / Route Handlers
        |
        v
Application services and pure domain policies
        |
        v
Server-only repositories and DTO mapping
        |
        v
Firebase Admin / Cloud Firestore
```

Responsibilities are separated as follows:

- `src/domain/`: domain entities, value objects, validation schemas, grading, lifecycle rules, scoring, queue selection, and the FSRS adapter. Domain code does not import React, Next.js, Firebase, or Firestore.
- `src/data/`: server-only repositories, ownership checks, Firestore serialization, transactions, pagination, and narrow DTO mapping.
- `src/lib/actions/`: authenticated application commands. Actions validate input, invoke domain and repository operations, invalidate affected routes or cache tags, and return stable result codes.
- `src/components/`: authoring, exam-attempt, study, and shared object UI composed from existing shadcn/Base UI primitives.
- `src/app/[lang]/`: canonical localized routes and server-rendered entry points.
- `src/types/`: shared transport contracts only when they do not contain domain behavior.

Feature modules must expose direct module files; the repository's no-index-file rule remains in force.

## Domain model

```text
User
└── owns Space
    ├── contains Object
    │   ├── Question
    │   ├── Exam
    │   └── Collection
    ├── defines Tag
    └── contains Object relationships

User + Space + Question
└── Question Memory
    └── Review Events

User + Space + Exam Revision
└── Exam Attempt
    └── Attempt Items
```

### Core invariants

- Every object belongs to exactly one space and has one owner in this release.
- Object IDs remain stable across revisions.
- Revisions are immutable after creation.
- An object may have a latest draft revision and a published revision at the same time.
- Publishing never mutates an existing revision; it creates a new published revision from the validated draft content.
- A published exam revision contains an ordered snapshot of question IDs and question revision IDs.
- Draft exam-question relationships are editable and are not historical evidence.
- Collection membership and tags organize objects but do not own or duplicate them.
- An archived object remains resolvable by historical attempts.
- Exam correctness is derived from the referenced question revision, never from the question's latest content.
- One question has at most one current memory state per user and space.
- Every accepted FSRS rating creates one append-only review event and one corresponding memory-state transition.
- Duplicate mutation requests with the same user-scoped idempotency key return the original result.

## Firestore model

### Authored content

```text
spaces/{spaceId}
  ownerId
  name
  visibility: "private"
  schemaVersion
  createdAt
  updatedAt

spaces/{spaceId}/objects/{objectId}
  ownerId
  type: "question" | "exam" | "collection"
  title
  lifecycle: "draft" | "published" | "archived"
  latestRevisionId
  publishedRevisionId?
  schemaVersion
  createdAt
  updatedAt

spaces/{spaceId}/objects/{objectId}/revisions/{revisionId}
  objectId
  objectType
  version
  publicationState: "draft" | "published"
  payload
  schemaVersion
  createdBy
  createdAt

spaces/{spaceId}/relations/{relationId}
  type: "exam-question" | "collection-object"
  sourceObjectId
  targetObjectId
  targetRevisionId?
  position?
  createdAt
  updatedAt

spaces/{spaceId}/tags/{tagId}
  name
  normalizedName
  color?
  createdAt
  updatedAt

spaces/{spaceId}/objectTags/{objectId_tagId}
  objectId
  tagId
  createdAt
```

Draft saves create immutable revisions and advance `latestRevisionId`. Publishing copies the validated draft content into a new immutable revision with `publicationState: "published"`, then advances both `publishedRevisionId` and `latestRevisionId`. Superseded, unreferenced draft revisions may be pruned later by an explicit retention job; published or referenced revisions are never pruned.

`relations` is canonical for editable draft composition and collection membership. On publication, an exam revision copies its ordered question and revision references into its immutable payload. This removes ambiguity between a changing draft and historical attempt evidence.

Tags have a unique `normalizedName` within a space. Tag deletion removes organization links but does not delete tagged objects.

### Question revision payload

All question revisions include:

- `format`: `single-choice`, `multiple-choice`, or `true-false`
- `prompt`
- ordered answer options with stable option IDs
- a format-specific correct-answer definition
- explanation
- optional source title and URL
- optional author notes that are never exposed during an attempt
- payload schema version

Validation rules require at least two options for choice formats, exactly one correct option for single choice, one or more correct options for multiple choice, and exactly the canonical true/false options for true/false questions. Correct-answer data is excluded from DTOs sent before an answer is submitted.

### Exam revision payload

An exam revision includes instructions, scoring configuration, passing threshold, presentation settings, and an ordered list of `{ questionId, questionRevisionId, points }` entries. Publication fails if any referenced revision is missing, belongs to another space, is not a question, or lacks a published state.

### User learning data

```text
users/{userId}/spaces/{spaceId}/questionMemory/{questionId}
  questionId
  schedulerVersion
  parametersVersion
  card
  dueAt
  lastReviewedAt?
  reviewCount
  lapseCount
  stateVersion
  updatedAt

users/{userId}/spaces/{spaceId}/reviewEvents/{reviewEventId}
  questionId
  questionRevisionId
  examId?
  examAttemptId?
  attemptItemId?
  submittedAnswer
  isCorrect
  rating: "again" | "hard" | "good" | "easy"
  previousCard
  resultingCard
  schedulerVersion
  parametersVersion
  reviewedAt

users/{userId}/spaces/{spaceId}/examAttempts/{attemptId}
  examId
  examRevisionId
  status: "in-progress" | "completed" | "abandoned"
  score?
  maximumScore
  passed?
  startedAt
  completedAt?
  updatedAt

users/{userId}/spaces/{spaceId}/examAttempts/{attemptId}/items/{itemId}
  position
  questionId
  questionRevisionId
  submittedAnswer?
  isCorrect?
  pointsAwarded?
  answeredAt?
  bookmarked
  updatedAt

users/{userId}/spaces/{spaceId}/operations/{idempotencyKey}
  operationType
  resultReference
  createdAt
  expiresAt?
```

Attempt items use a subcollection rather than a growing array on the attempt document. This avoids document growth limits and permits bounded reads, pagination, and focused updates. Firestore recommends subcollections for lists that grow over time.

## FSRS policy

The application will depend on `ts-fsrs` behind a project-owned adapter. Domain and persistence code must not expose library-specific enums or serialized types outside the adapter boundary.

The adapter owns:

- conversion between application ratings and scheduler ratings;
- creation of an empty memory card;
- preview and application of scheduling outcomes;
- serialization and schema validation of stored cards;
- scheduler and parameter version stamps;
- deterministic clock injection for tests;
- migration of stored card formats when a future library upgrade requires it.

The first release uses library defaults with a documented desired-retention configuration selected during implementation. Parameter optimization is deferred until sufficient review history exists.

Submitting a rating runs a short server-side Firestore transaction that reads the current memory state and idempotency record, calculates the transition without side effects, then writes the memory state, append-only review event, and operation result. Transaction callbacks must remain retry-safe because Firestore may execute them more than once under contention.

Correctness never silently selects an FSRS rating. The UI may recommend a rating, but only the user's explicit Again, Hard, Good, or Easy choice commits the scheduling transition.

## Application routes and flows

Canonical routes are locale-prefixed:

```text
/{lang}/spaces/{spaceId}
/{lang}/spaces/{spaceId}/questions
/{lang}/spaces/{spaceId}/questions/{questionId}
/{lang}/spaces/{spaceId}/exams
/{lang}/spaces/{spaceId}/exams/{examId}
/{lang}/spaces/{spaceId}/exams/{examId}/edit
/{lang}/spaces/{spaceId}/attempts/{attemptId}
/{lang}/spaces/{spaceId}/study
/{lang}/spaces/{spaceId}/collections/{collectionId}
```

Requests without a supported locale are redirected by the existing locale proxy. Unsupported locale parameters call `notFound()`. The transitional split between `/` and the starter content at `/{lang}` is removed as the new space home becomes canonical.

### Question authoring

The owner creates a question, selects a supported format, defines answers and explanation, assigns collections or tags, saves a draft revision, and publishes when valid. Author notes and correct answers are never included in pre-submission attempt payloads.

### Exam authoring

The owner creates an exam, searches existing questions, adds them to the draft, reorders them, configures scoring, and publishes. The editor identifies questions whose newer revision is available and requires an explicit upgrade; it never changes a published exam automatically.

### Exam attempt

Starting an attempt snapshots the published exam revision into attempt items. The user can answer, navigate, bookmark, leave, and resume. Answer submission is idempotent and server-graded. Completion calculates score and pass/fail from persisted items and then marks the attempt complete. A completed attempt cannot accept changed answers.

### Study session

The due queue selects memory records with `dueAt <= now`, ordered by due date with a stable tie-breaker. New questions may enter study after the user encounters them in an exam or explicitly adds them. A study interaction presents the question without its answer, grades the response, reveals the explanation, collects an explicit FSRS rating, and then displays the next due date.

Exam rendering and grading are shared with study mode. Attempt lifecycle and study scheduling remain separate application services.

## Authentication and authorization

The existing Firebase client sign-in and HttpOnly `firebase_session` flow remain the authentication foundation. Server entry points verify the session through Firebase Admin.

Authorization rules for this release are simple and explicit:

- Every command resolves the current user from the verified session.
- Every space repository operation verifies `space.ownerId === user.uid`.
- Object, relation, tag, attempt, and learning paths are always scoped by an already-authorized space.
- IDs supplied by the client are treated as untrusted locators, not authorization evidence.
- Browser code cannot write application data directly to Firestore.
- Firestore client rules default-deny application collections; privileged writes occur through Firebase Admin after application-level authorization.
- Visibility values other than `private` are rejected until a later sharing specification defines their semantics.

Server Actions and Route Handlers validate origin expectations, input schemas, size limits, object ownership, and lifecycle preconditions. They return stable application error codes rather than raw Firebase errors.

## Failure handling

Application errors use a small stable taxonomy: unauthenticated, forbidden, not found, validation failed, lifecycle conflict, stale state, duplicate operation, transient dependency failure, and internal failure.

- Validation and lifecycle errors are returned inline with actionable localized messages.
- Stale revisions or memory-state versions prompt a safe refresh and retry.
- Firestore contention and transient availability failures use bounded retry behavior appropriate to the SDK; they are never retried indefinitely.
- Missing historical revisions produce an operational alert and a recoverable content-unavailable state rather than falling back to newer content.
- Attempt progress is persisted after each accepted answer.
- Empty, loading, unauthorized, unavailable, and no-due-review states are first-class UI states.
- Logs include request, operation, user, space, object, and attempt identifiers, but avoid session tokens, complete answer payloads, and private authored content.

## Internationalization and accessibility

All application-owned copy uses the existing per-locale dictionaries. Server Components load dictionaries on the server; Client Components consume the existing i18n provider. Routes validate locale parameters and set the active document language through the established locale mechanism.

Authoring forms expose associated labels, descriptions, validation summaries, and deterministic focus movement. Question options use semantic grouped controls. Exam navigation, bookmarks, dialogs, rating controls, and sortable question lists are keyboard operable. Correctness, saved state, and scheduling updates are announced without relying on color alone. Reduced-motion preferences are respected.

## Testing strategy

### Domain tests

- question validation for every format and malformed edge case;
- grading behavior, including unordered multiple-choice answers;
- exam scoring and passing thresholds;
- lifecycle and revision invariants;
- deterministic queue ordering;
- FSRS transition mapping, date ordering, state-version increments, and scheduler serialization;
- property-oriented checks that accepted reviews never produce invalid or non-finite dates.

### Repository and authorization tests

- Firebase Emulator integration tests for repositories and transactions;
- owner access and cross-user denial for every aggregate;
- immutable revision enforcement;
- publication preconditions and cross-space reference rejection;
- idempotent attempt and review mutations;
- transaction retry safety and stale state rejection;
- required composite indexes.

### Component and browser tests

- accessible question authoring for all three formats;
- exam composition, ordering, publication, and explicit question upgrades;
- attempt start, answer, resume, complete, and historical rendering;
- study answer, reveal, rate, and next-due behavior;
- keyboard, focus, error, and dynamic announcement behavior;
- end-to-end path: create question -> publish exam -> complete attempt -> perform FSRS review.

The delivery gate runs `pnpm lint`, `pnpm test`, `pnpm build`, Firebase emulator tests, and `pnpm ladle:build` when shared component stories change.

## Operations and observability

- Validate required Firebase and application environment variables at server startup.
- Keep Firestore indexes, rules, emulator configuration, and migration scripts in version control.
- Emit structured operation outcomes and latency without logging private content.
- Add health checks for server availability and configuration, not for authenticated user data.
- Document backup/export and restore verification before production cutover.
- Track counts and failure rates for attempt creation, answer submission, completion, review scheduling, transaction contention, and stale-state conflicts.
- Use explicit schema, scheduler, and parameters versions so migrations are observable and reversible.

## Migration from the current application

The current branch already provides Firebase session verification, server-only data access, exam/question fixtures, progress storage, notes, and localized authentication. Migration must preserve these working boundaries.

1. Introduce domain types and repositories alongside current readers.
2. Create an idempotent migration command for current `exams`, `questions`, and sample fixtures into a default private space with object revisions.
3. Map existing user exam progress into attempts or legacy-import records without inventing unavailable answer history.
4. Validate document counts, ownership, references, and representative grading results in the emulator and staging project.
5. Switch reads to the new repositories after validation.
6. Keep a documented rollback path until production verification completes.
7. Remove legacy readers only in a later cleanup after the new path is stable.

No migration deletes source data during this implementation program.

## Historical worktree reuse

Historical branches are references, not merge targets:

- `old-8` at `d930d7a7` supplies FSRS study-domain and card-viewer ideas, especially `src/domain/scheduler.ts` and `src/domain/study-queue.ts`.
- `old-5` at `0857a997` supplies prior FSRS, review, AI, and sync experiments; only exam/FSRS concepts relevant to this slice should be adapted.
- `old-6` at `f336db18` supplies repository-boundary and object-model decisions, but its Dexie/offline architecture is intentionally excluded.
- `old-4` at `2839f410` supplies workspace, collection, query, and editor research for later programs.

Code is ported only after checking compatibility with current authentication, i18n, Base UI/shadcn conventions, TypeScript contracts, and tests. No historical branch is merged wholesale.

## Acceptance criteria

- An authenticated user can create and rename a private space.
- The owner can create, revise, publish, archive, tag, and collect reusable questions.
- Supported question formats validate and grade correctly on the server.
- The owner can compose, reorder, publish, and archive exams.
- Published exams retain exact question revisions after later edits.
- A user can start, resume, and complete an exam attempt with deterministic scoring.
- A completed attempt renders from historical revisions and cannot be mutated.
- A user can study due questions and explicitly rate Again, Hard, Good, or Easy.
- One accepted rating atomically creates a review event and updates one memory state.
- Replaying an idempotent command does not duplicate attempts, answers, or reviews.
- Cross-user and cross-space access is denied and covered by emulator tests.
- All user-facing states are localized and keyboard accessible.
- The production validation commands pass, and migration/rollback procedures are documented and exercised in staging.

## Sources

Repository sources:

- `ARCHITECTURE.md`
- `src/data/auth.ts`
- `src/app/api/session/route.ts`
- `src/data/exams.ts`
- `src/data/progress.ts`
- `src/data/notes.ts`
- `docs/research/worktrees-audit.md`
- Active baseline commit `416f5712`
- Historical reference commits `2839f410`, `0857a997`, `f336db18`, and `d930d7a7`

Primary external references:

- Next.js documentation installed at `node_modules/next/dist/docs/`
- [Cloud Firestore transactions and batched writes](https://firebase.google.com/docs/firestore/manage-data/transactions)
- [Cloud Firestore transaction contention and isolation](https://firebase.google.com/docs/firestore/transaction-data-contention)
- [Cloud Firestore data structure guidance](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [ts-fsrs official repository documentation](https://github.com/open-spaced-repetition/ts-fsrs/blob/main/packages/fsrs/README.md)
