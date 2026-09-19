# Architecture

This repository is a Next.js application using the App Router, React, and TypeScript. It implements a secure, versioned, space-isolated assessment and spaced-repetition platform powered by Firebase and FSRS.

## Structure

- `src/app/`: application routes, layout, global CSS, and favicon.
- `src/components/ui/`: shared UI components and primitives (shadcn/ui base-nova, Tailwind CSS v4).
- `src/components/object/`: typed object views (question questionnaire, question feedback).
- `src/components/exams/`: exam authoring and questionnaire components (question picker).
- `src/components/spaces/`: space navigation shell and switcher.
- `src/domain/`: pure business logic, invariants, validation schemas, and scheduling algorithms.
  - `src/domain/objects/`: versioned object records, revisions, and lifecycle transitions.
  - `src/domain/questions/`: question schemas, validation, grading, and redaction.
  - `src/domain/exams/`: exam composition, point weighting, and publication snapshot validation.
  - `src/domain/attempts/`: attempt scoring, passing thresholds, and status transitions.
  - `src/domain/study/`: FSRS v5.4 scheduling, review rating transitions, and queue evaluation.
  - `src/domain/shared/`: domain error definitions (`DomainError`).
- `src/data/`: server-only Data Access Layer (DAL) modules mediating Firebase Admin Firestore.
- `src/lib/actions/`: Server Actions exposing authenticated operations to the client.
- `public/`: static assets.
- `.agents/`: agent configurations, subagents, domain skills, and repository rules.

---

## Versioned Domain Model

The platform organizes content into private tenant boundaries called **Spaces**, managing typed content through an immutable revisioning model:

### 1. SpaceRecord (`src/data/spaces.ts`, `src/types/space.ts`)
- **Isolation Boundary**: All content and learner data belong to a specific private space.
- **Fields**:
  - `id`: Unique space identifier.
  - `ownerId`: Firebase UID of the owner.
  - `name`: User-facing name of the space.
  - `visibility`: `"private"` (enforced; cross-tenant leakage is strictly prevented).
  - `schemaVersion`: Version marker (`1`).
  - `createdAt`, `updatedAt`: ISO timestamps.

### 2. ObjectRecord (`src/domain/objects/object.ts`)
- **Metadata Container**: Represents an entity (such as a question or an exam) independent of its specific version content.
- **Fields**:
  - `id`: Unique object ID (e.g., `q_*` for questions, `exam_*` for exams).
  - `spaceId`: Parent space reference.
  - `ownerId`: UID of the creator.
  - `type`: `"question" | "exam"`.
  - `title`: Display title.
  - `lifecycle`: `"draft" | "published" | "archived"`.
  - `schemaVersion`: Object record schema version (`1`).
  - `latestRevisionId`: ID of the most recently saved draft revision.
  - `publishedRevisionId`: ID of the currently published revision.
  - `createdAt`, `updatedAt`: ISO timestamps.

### 3. ObjectRevision<TPayload> (`src/domain/objects/object.ts`)
- **Immutable Payload Snapshot**: Stores the actual payload and data structure of an object version.
- **Fields**:
  - `id`: Unique revision ID (e.g., `<objectId>_rev_<number>`).
  - `objectId`: Reference to parent `ObjectRecord`.
  - `spaceId`: Tenant space ID.
  - `ownerId`: UID of the creator.
  - `revisionNumber`: Sequential version index (starts at 1).
  - `payload`: Generic payload typed by domain entity:
    - **QuestionRevisionPayload** (`src/domain/questions/question.ts`):
      `format` (`single-choice`, `multiple-choice`, `true-false`), `prompt`, `options`, `correctOptionIds`, `explanation`, optional `source` and `authorNotes`.
    - **ExamRevisionPayload** (`src/domain/exams/exam.ts`):
      `instructions`, `passingPercentage`, `questions` (`ExamQuestionReference[]`).
  - `publicationState`: `"draft" | "published" | "archived"`.
  - `schemaVersion`: Schema version marker (`1`).
  - `createdAt`, `updatedAt`: ISO timestamps.

---

## Exam Composition & Resumable Attempt Lifecycle

Exams are composed of explicit, immutable references to published question revisions, guaranteeing that authoring updates never invalidate ongoing learner attempts.

### Exam Composition (`src/domain/exams/`, `src/data/exam-authoring.ts`)
1. **Draft Creation**: `createExamDraftAction` initializes an `ObjectRecord` of type `"exam"` in `"draft"` status.
2. **Question Referencing**: `replaceExamQuestionsAction` attaches an ordered list of `ExamQuestionReference` objects:
   ```ts
   interface ExamQuestionReference {
     questionId: string;
     questionRevisionId: string;
     points: number;
   }
   ```
3. **Publication**: `publishExamAction` verifies:
   - The exam contains at least one question.
   - All referenced questions belong to the same space and their referenced `questionRevisionId` exists and is marked `"published"`.
   - `passingPercentage` is valid (0–100) and points are positive.
   Creates a published `ObjectRevision<ExamRevisionPayload>` with an immutable `ExamPublicationSnapshot`.

### Resumable Attempt Lifecycle (`src/data/attempts.ts`, `src/lib/actions/attempt-actions.ts`)
1. **Starting an Attempt**:
   - `startAttemptAction` creates an `AttemptRecord` in `users/{userId}/spaces/{spaceId}/attempts/{attemptId}` with status `"in-progress"`.
   - Pins `examRevisionId` to the published exam revision.
   - Initializes a subcollection of items (`items/{questionId}`) with `questionRevisionId`, `points`, and `isBookmarked: false`.
   - Supports an optional `idempotencyKey` (cached in `operations/{key}`) to deduplicate client calls.
2. **Interactive Answer Submission**:
   - `submitAttemptAnswerAction` evaluates answers inside a Firestore transaction.
   - Evaluates grading with `gradeQuestion()` against the exact question revision pinned in the item, regardless of subsequent author edits.
   - Updates `submittedAnswer`, `isCorrect`, and `answeredAt`.
   - **Automatic Memory Enrollment**: Submitting an answer automatically calls `ensureQuestionMemory()` to register the question in the learner's spaced-repetition queue.
3. **Resumption and Bookmarking**:
   - `getAttemptViewAction` loads the attempt state, item answers, and bookmark statuses.
   - `toggleAttemptBookmarkAction` allows learners to flag questions for review during the exam.
4. **Completion and Scoring**:
   - `completeAttemptAction` tallies earned points against `maximumScore`.
   - Calculates percentage and determines `passed = percentage >= passingPercentage`.
   - Transitions attempt status to `"completed"` and records `completedAt`.

---

## FSRS Spaced Repetition & Transactional Question Memory

Memory scheduling is powered by **Free Spaced Repetition Scheduler (ts-fsrs v5.4.2)** with deterministic parameters (no fuzzing, request retention 0.9).

### Memory State Representation (`src/domain/study/fsrs-scheduler.ts`, `src/data/study.ts`)
- Stored per user at `users/{userId}/spaces/{spaceId}/questionMemory/{questionId}`:
  - `card`: Serialized `StoredFsrsCard` containing `stability`, `difficulty`, `reps`, `lapses`, `state`, `due`, and `scheduledDays`.
  - `dueAt`: ISO timestamp of next scheduled review.
  - `stateVersion`: Monotonically increasing concurrency token (starts at 0).
  - `reviewCount`: Total completed reviews.
  - `lastReviewedAt`: Timestamp of the last review.

### Review Workflow & Concurrency Protection
1. **Automatic Enrollment**:
   - Triggered either on explicit action or when a question is first answered during an exam (`ensureQuestionMemory`).
   - Card initialized with `state = State.New` and `dueAt = now`.
2. **Queue Retrieval**:
   - `getDueStudyQueueAction` queries cards in the user's space where `dueAt <= now` ordered by due timestamp.
3. **Transactional Rating**:
   - `rateQuestionMemoryAction` accepts `{ spaceId, questionId, rating: 'again' | 'hard' | 'good' | 'easy', stateVersion, idempotencyKey }`.
   - Runs in a Firestore transaction:
     - Fetches current `StoredQuestionMemory`.
     - Validates `current.stateVersion === incoming.stateVersion`. Throws `DomainError('stale-state')` if versions do not match.
     - Computes the new card state using `scheduleMemoryReview()`.
     - Increments `stateVersion += 1` and updates `dueAt` to the new card due date.
     - Appends an immutable audit event to `users/{userId}/spaces/{spaceId}/reviewEvents/{eventId}`.
     - Records operation result in `operations/{idempotencyKey}` when an idempotency key is provided.

---

## Server Actions Authorization Model & Security Architecture

The platform enforces a multi-layered security architecture with a zero-trust, default-deny posture:

```
[ Client Browser ]
        │  Server Action POST
        ▼
[ Next.js Server Action Layer ] ──> requireActionUser()
        │                              │ Validates HttpOnly session cookie
        │                              │ via Firebase Admin Auth SDK
        │                              ▼
        │                      Verified User { uid }
        ▼
[ Domain Services & DAL ] ─────────> getOwnedSpace(uid, spaceId)
        │                              │ Constant-time info hiding
        │                              │ Rejects unauthorized / cross-tenant access
        ▼
[ Firebase Admin Firestore ]
        │  Server-side privileged access bypasses rules
        ▼
[ Firestore Database ]
        ▲
        │  Client SDK Direct Access
        └─── [ firestore.rules: DEFAULT DENY ALL ]
             - /spaces/{spaceId}/**: allow read, write: if false;
             - /users/{userId}/spaces/{spaceId}/**: allow read, write: if false;
```

### 1. `requireActionUser()` (`src/data/action-auth.ts`)
- All Server Actions begin by awaiting `requireActionUser()`.
- Reads the secure `firebase_session` HttpOnly cookie.
- Verifies the session cookie using Firebase Admin token verification.
- Returns `{ uid, email }`. Throws `DomainError("unauthenticated")` if the cookie is missing, expired, or invalid.

### 2. Constant-Time Tenant Isolation (`getOwnedSpace()`)
- DAL routines check space ownership via `getOwnedSpace(requesterId, spaceId)`.
- If the space does not exist or does not belong to the requester, it immediately throws `DomainError("forbidden")`.
- This prevents leaking whether a space ID exists to unauthorized callers.

### 3. Default-Deny Firestore Security Rules (`firestore.rules`)
- Root rule denies all read and write operations: `match /{document=**} { allow read, write: if false; }`.
- Space collections (`/spaces/{spaceId}/**`) and private user-space subcollections (`/users/{userId}/spaces/{spaceId}/**`) explicitly disallow all direct Client SDK operations (`allow read, write: if false;`).
- All reads, writes, transactions, and mutations must execute through the Server Action layer via the Firebase Admin SDK.
- Data sent to Client Components is scrubbed and redacted:
  - Questions served to exam takers omit `correctOptionIds`, `explanation`, and `authorNotes` (`PublicQuestionDto`).
  - Grading feedback is returned only after answer submission.

---

## Subagents and agent automation

- **Firebase (`.agents/agents/firebase/agent.md`)**: Supports Firebase capabilities (Authentication, Firestore modeling, Security Rules, App Hosting, Cloud Functions, and Data Connect), aggregating specialized Firebase skills under `.agents/skills/`.
- **Research (`.agents/agents/research/agent.md`)**: Supports codebase topology navigation, documentation retrieval, and component discovery.
- **Code Reviewer (`.agents/agents/code-reviewer/agent.md`)**: Audits diffs, PRs, and modifications for bugs, regressions, security leaks, Biome linting, and enforces the no-index barrel files rule and repository conventions.
- **Test Engineer (`.agents/agents/test-engineer/agent.md`)**: Designs test strategies, implements unit and component tests with Vitest and React Testing Library, authoring emulator integration tests and verifying test suites pass cleanly.
- **UI Engineer (`.agents/agents/ui-engineer/agent.md`)**: Implements accessible, theme-aware UI primitives and feature components adhering to shadcn/ui base-nova style, `@base-ui/react`, Tailwind CSS v4, and Ladle stories (`*.stories.tsx`).
- **Architect (`.agents/agents/architect/agent.md`)**: Guides system boundaries, React Server Component (RSC) vs Client splits, refactoring strategies, and trade-off analysis before implementation.
- **Security Reviewer (`.agents/agents/security-reviewer/agent.md`)**: Audits authentication flows, default-deny Firestore rules, server-side token validation, and prevents secret exposure.
- **Documentation Maintainer (`.agents/agents/doc-maintainer/agent.md`)**: Manages Architectural Decision Records (ADRs), path portability audits, documentation freshness, and knowledge graph sync.

---

## Configuration

- `package.json`: scripts, dependencies, and package manager declaration.
- `components.json`: shadcn/ui configuration and path aliases.
- `biome.json`: formatter, linter, and import-organization configuration.
- `tsconfig.json`: TypeScript compiler options and `@/*` alias to `src/*`.
- `vitest.config.ts`: Vitest test runner configuration for unit and integration tests.
- `vitest.firebase.config.ts`: Vitest runner configuration for Firebase emulator tests.
- `firestore.rules`: Cloud Firestore security rules enforcing default-deny.
- `next.config.ts`: Next.js configuration, including the React Compiler.
