# Exam and FSRS Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a secure, localized, private-space application where users author reusable questions, publish exams, complete immutable attempts, and schedule question reviews with FSRS.

**Architecture:** Extend the existing Next.js/Firebase modular monolith with pure domain modules, server-only Firestore repositories, thin authenticated Server Actions, and locale-prefixed App Router pages. Authored objects use immutable revisions; attempts reference exact published revisions; user/question memory is updated through short idempotent Firestore transactions.

**Tech Stack:** Node.js 22.x, Next.js 16.3.5, React 19.2.8, TypeScript, Firebase Auth/Admin/Firestore, `ts-fsrs` 5.4.x, Zod 4.6.x, Base UI/shadcn base-nova, Tailwind CSS 4, Vitest 5, Firebase Emulator Suite, Playwright 1.63.x, and Ladle 5.

**Spec:** `docs/superpowers/specs/2026-09-18-exam-fsrs-foundation-design.md`

## Global Constraints

- Use `pnpm@11.20.0` and only scripts declared in `package.json`.
- Use Node.js 22.x locally and in CI; declare `engines.node` as `>=22 <23`.
- Read relevant Next.js 16 guides under `node_modules/next/dist/docs/` before changing routes, Server Actions, caching, or locale handling.
- Use Biome for linting, formatting, and import organization.
- Never create `index.ts` or `index.tsx`; import every module directly.
- Keep Firebase Admin and all persistence modules server-only.
- Every Server Action authenticates the caller and authorizes the target space; no demo-user or client-supplied user override is permitted.
- Browser DTOs must never contain correct answers, author notes, raw Firestore documents, session tokens, or private scheduler internals.
- All user-facing copy must exist in both `en` and `pt-BR` dictionaries and in `AppMessages`.
- UI work follows `DESIGN.md`, reuses existing Base UI/shadcn primitives, uses semantic tokens, and includes keyboard/focus/error states.
- Published revisions and completed attempts are immutable.
- Firestore mutations that combine idempotency, event creation, and aggregate state use short retry-safe transactions.
- Preserve existing user changes and keep Graphify output out of feature commits unless a task explicitly updates it.

## Review Focus

- A forged object or relation ID from another space must return `forbidden` without revealing whether the target exists; covered in Tasks 3, 4, 5, and 6.
- Replaying the same idempotency key must return the original result and create no duplicate attempt, answer, or review event; covered in Tasks 7 and 9.
- Two tabs rating the same memory state must produce one accepted transition and one `stale-state` response rather than lost updates; covered in Task 9.
- Editing a question after an attempt starts must not change grading or historical rendering for that attempt; covered in Tasks 6 and 7.
- Malformed answers containing unknown, duplicate, or wrong-format option IDs must fail validation without exposing the correct answer; covered in Tasks 1, 7, and 14.

## File Structure

- `src/domain/questions/`: question payload schemas, redacted DTOs, grading, and authoring policy.
- `src/domain/objects/`: shared object identity, lifecycle, and immutable revision contracts.
- `src/domain/exams/`: exam snapshots, scoring configuration, and publication policy.
- `src/domain/attempts/`: attempt state transitions and deterministic scoring.
- `src/domain/study/`: the only `ts-fsrs` adapter and pure study-queue policy.
- `src/data/`: server-only Firestore repositories grouped by aggregate; no UI or route imports.
- `src/lib/actions/`: thin authenticated Server Actions grouped by user workflow.
- `src/components/spaces/`, `questions/`, `exams/`, `attempts/`, and `study/`: feature UI that composes existing shared primitives.
- `src/app/[lang]/spaces/[spaceId]/`: canonical localized server routes; no parallel unprefixed application tree remains after cutover.
- `scripts/`: idempotent migration and verification entry points with pure logic covered by tests.
- `e2e/`: browser-level production journeys; unit and emulator tests remain colocated with source under `src/`.

---

### Task 1: Question contracts, validation, and server grading

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/domain/shared/domain-error.ts`
- Create: `src/domain/questions/question.ts`
- Create: `src/domain/questions/grade-question.ts`
- Create: `src/domain/questions/grade-question.test.ts`
- Modify: `src/types/question.ts`

**Interfaces:**
- Consumes: existing `QuestionOption` and explanation concepts from `src/types/question.ts`.
- Produces: `QuestionRevisionPayload`, `SubmittedAnswer`, `PublicQuestionDto`, `QuestionFeedbackDto`, `parseQuestionRevision()`, `parseSubmittedAnswer()`, `toPublicQuestion()`, and `gradeQuestion()`.

- [ ] **Step 1: Install the domain dependencies**

Run:

```powershell
pnpm add ts-fsrs@^5.4.2 zod@^4.6.5
```

Expected: `package.json` and `pnpm-lock.yaml` contain `ts-fsrs` and `zod`; no other dependency changes.

Add `"engines": { "node": ">=22 <23" }` beside the existing `packageManager` declaration.

- [ ] **Step 2: Write failing grading and redaction tests**

Create `src/domain/questions/grade-question.test.ts` with table-driven cases for single choice, order-independent multiple choice, true/false, duplicate IDs, unknown IDs, empty answers, and public DTO redaction. The core assertions are:

```ts
expect(gradeQuestion(question, { optionIds: ["b", "a"] })).toEqual({
  isCorrect: true,
  correctOptionIds: ["a", "b"],
  explanation: "Because both statements apply.",
});

expect(() =>
  gradeQuestion(question, { optionIds: ["a", "a"] }),
).toThrowError(expect.objectContaining({ code: "validation-failed" }));

expect(toPublicQuestion(question)).not.toHaveProperty("correctOptionIds");
expect(toPublicQuestion(question)).not.toHaveProperty("authorNotes");
```

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```powershell
pnpm exec vitest run src/domain/questions/grade-question.test.ts
```

Expected: FAIL because the domain modules do not exist.

- [ ] **Step 4: Implement the question contracts and schemas**

Define these exact public contracts in `src/domain/questions/question.ts`:

```ts
export type QuestionFormat =
  | "single-choice"
  | "multiple-choice"
  | "true-false";

export interface AnswerOption {
  id: string;
  text: string;
}

export interface QuestionRevisionPayload {
  schemaVersion: 1;
  format: QuestionFormat;
  prompt: string;
  options: AnswerOption[];
  correctOptionIds: string[];
  explanation: string;
  source?: { title: string; url: string };
  authorNotes?: string;
}

export interface SubmittedAnswer {
  optionIds: string[];
}

export type PublicQuestionDto = Omit<
  QuestionRevisionPayload,
  "correctOptionIds" | "explanation" | "authorNotes"
> & { questionId: string; questionRevisionId: string };

export interface QuestionFeedbackDto {
  isCorrect: boolean;
  correctOptionIds: string[];
  explanation: string;
}
```

Use strict Zod schemas with trimmed string limits: prompt 1–20,000 characters, option text 1–2,000, explanation 1–20,000, author notes at most 20,000, source URL as a URL, unique option IDs, and format-specific correct-answer cardinality. Model true/false with stable option IDs `true` and `false`.

- [ ] **Step 5: Implement server grading and redaction**

In `grade-question.ts`, validate the submitted option IDs against the question options, reject duplicates, compare canonical sorted arrays, and return feedback only after grading. Add `DomainError` with codes `unauthenticated`, `forbidden`, `not-found`, `validation-failed`, `lifecycle-conflict`, `stale-state`, `duplicate-operation`, `dependency-unavailable`, and `internal`.

- [ ] **Step 6: Run tests and commit**

Run:

```powershell
pnpm exec vitest run src/domain/questions/grade-question.test.ts
pnpm lint
git add package.json pnpm-lock.yaml src/domain/shared/domain-error.ts src/domain/questions src/types/question.ts
git commit -m "feat: add secure question domain model"
```

Expected: focused tests and Biome pass; the commit contains no UI or Firestore changes.

### Task 2: Object revisions and exam publication policy

**Files:**
- Create: `src/domain/objects/object.ts`
- Create: `src/domain/objects/object.test.ts`
- Create: `src/domain/exams/exam.ts`
- Create: `src/domain/exams/exam.test.ts`
- Modify: `src/types/object.ts`
- Modify: `src/types/exam.ts`

**Interfaces:**
- Consumes: `QuestionRevisionPayload` from Task 1.
- Produces: `SpaceObjectType`, `ObjectLifecycle`, `ObjectRecord`, `ObjectRevision<T>`, `ExamRevisionPayload`, `ExamQuestionReference`, `assertLifecycleTransition()`, and `validateExamForPublication()`.

- [ ] **Step 1: Write failing lifecycle and publication tests**

Cover allowed transitions `draft -> published`, `published -> archived`, and `archived -> draft`; reject mutation of a revision; reject duplicate question IDs, cross-space references, non-published question revisions, non-positive points, and pass thresholds outside 0–100.

```ts
expect(() => assertLifecycleTransition("archived", "published")).toThrowError(
  expect.objectContaining({ code: "lifecycle-conflict" }),
);

expect(
  validateExamForPublication(exam, resolvedQuestions),
).toEqual(expect.objectContaining({ questionCount: 2, maximumScore: 2 }));
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
pnpm exec vitest run src/domain/objects/object.test.ts src/domain/exams/exam.test.ts
```

Expected: FAIL because the object and exam modules do not exist.

- [ ] **Step 3: Implement immutable object and revision contracts**

Use these discriminants:

```ts
export type SpaceObjectType = "question" | "exam" | "collection";
export type ObjectLifecycle = "draft" | "published" | "archived";

export interface ObjectRecord {
  id: string;
  spaceId: string;
  ownerId: string;
  type: SpaceObjectType;
  title: string;
  lifecycle: ObjectLifecycle;
  latestRevisionId: string;
  publishedRevisionId?: string;
  schemaVersion: 1;
  createdAt: string;
  updatedAt: string;
}

export interface ObjectRevision<TPayload> {
  id: string;
  objectId: string;
  objectType: SpaceObjectType;
  version: number;
  publicationState: "draft" | "published";
  payload: TPayload;
  schemaVersion: 1;
  createdBy: string;
  createdAt: string;
}
```

- [ ] **Step 4: Implement exam contracts and publication validation**

```ts
export interface ExamQuestionReference {
  questionId: string;
  questionRevisionId: string;
  points: number;
}

export interface ExamRevisionPayload {
  schemaVersion: 1;
  instructions: string;
  passingPercentage: number;
  questions: ExamQuestionReference[];
}
```

`validateExamForPublication()` must return a normalized snapshot only when every resolved question belongs to the same space and is a published question revision.

- [ ] **Step 5: Run tests and commit**

```powershell
pnpm exec vitest run src/domain/objects/object.test.ts src/domain/exams/exam.test.ts
pnpm lint
git add src/domain/objects src/domain/exams src/types/object.ts src/types/exam.ts
git commit -m "feat: define versioned objects and exams"
```

### Task 3: Authentication boundary and private spaces repository

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `vitest.firebase.config.ts`
- Create: `src/data/action-auth.ts`
- Create: `src/data/spaces.ts`
- Create: `src/data/spaces.firebase.test.ts`
- Create: `src/test/clear-firestore.ts`
- Modify: `src/lib/actions/exam-actions.ts`
- Modify: `src/types/space.ts`

**Interfaces:**
- Consumes: Firebase session constants and `verifyFirebaseSessionCookie()`.
- Produces: `requireActionUser(): Promise<CurrentUser>`, `createPrivateSpace()`, `getOwnedSpace()`, `listOwnedSpaces()`, and `renameOwnedSpace()`.

- [ ] **Step 1: Pin Firebase tooling and add the emulator test command**

Run:

```powershell
pnpm add -D firebase-tools@^15.30.1
```

Add this script:

```json
"test:firebase": "firebase emulators:exec --only auth,firestore --project demo-notes-app \"pnpm exec vitest run --config vitest.firebase.config.ts\""
```

Configure `vitest.firebase.config.ts` with `environment: "node"`, the existing `@` and `server-only` aliases, and `include: ["src/**/*.firebase.test.ts"]`.

- [ ] **Step 2: Write failing authentication and ownership tests**

Tests must prove a missing cookie produces `unauthenticated`, a user cannot read or rename another user's space, visibility values other than `private` are rejected, and listing returns only owned spaces.

```ts
await expect(getOwnedSpace("user-b", created.id)).rejects.toMatchObject({
  code: "forbidden",
});
expect((await listOwnedSpaces("user-a")).map((space) => space.id)).toEqual([
  created.id,
]);
```

- [ ] **Step 3: Verify RED in the emulator**

```powershell
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/spaces.firebase.test.ts"
```

Expected: FAIL because the repository and test configuration are absent.

- [ ] **Step 4: Implement the secure action identity helper**

`requireActionUser()` reads only the HttpOnly session cookie, verifies revocation, and throws `DomainError("unauthenticated")` on any missing or invalid session. Delete `getActionUserId(explicitUserId?)` and the `demo-user` fallback from `exam-actions.ts`; no Server Action accepts `userId` from its input.

- [ ] **Step 5: Implement the private-space repository**

Define `SpaceRecord` with `id`, `ownerId`, `name`, `visibility: "private"`, `schemaVersion: 1`, and ISO timestamps. Every read by ID first loads the space and then performs a constant-shape owner assertion that maps both cross-owner and missing resources to the specified domain error without returning document data.

- [ ] **Step 6: Run emulator tests and commit**

```powershell
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/spaces.firebase.test.ts"
pnpm lint
git add package.json pnpm-lock.yaml vitest.firebase.config.ts src/data/action-auth.ts src/data/spaces.ts src/data/spaces.firebase.test.ts src/test/clear-firestore.ts src/lib/actions/exam-actions.ts src/types/space.ts
git commit -m "feat: enforce private space ownership"
```

### Task 4: Object, revision, relation, collection, and tag repositories

**Files:**
- Create: `src/data/objects.ts`
- Create: `src/data/object-relations.ts`
- Create: `src/data/tags.ts`
- Create: `src/data/objects.firebase.test.ts`
- Replace: `src/data/space-objects.ts`
- Modify: `firestore.indexes.json`

**Interfaces:**
- Consumes: `getOwnedSpace()`, object contracts from Task 2, and Firebase Admin.
- Produces: `createObjectDraft()`, `saveDraftRevision()`, `publishRevision()`, `archiveObject()`, `getObjectRevision()`, `listObjects()`, `replaceExamQuestionRelations()`, `replaceCollectionMembers()`, `upsertTag()`, and `setObjectTags()`.

- [ ] **Step 1: Write failing repository tests**

Test immutable revision creation, monotonically increasing version numbers, published revisions surviving later drafts, archive preservation, normalized tag uniqueness, deterministic relation ordering, and rejection of forged cross-space target IDs.

```ts
const published = await publishRevision(ownerId, spaceId, object.id);
await saveDraftRevision(ownerId, spaceId, object.id, changedPayload);
expect((await getObjectRevision(ownerId, spaceId, published.id)).payload).toEqual(
  originalPayload,
);
```

- [ ] **Step 2: Verify RED**

```powershell
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/objects.firebase.test.ts"
```

- [ ] **Step 3: Implement revision writes as transactions**

`saveDraftRevision()` reads the object, checks ownership, allocates `version + 1`, creates a new revision document, and advances `latestRevisionId` in one transaction. `publishRevision()` reads the latest draft, creates a new published revision with copied validated payload, and advances both `publishedRevisionId` and `latestRevisionId` without modifying the draft revision.

- [ ] **Step 4: Implement relations and tags**

Use deterministic link IDs for collection membership and object tags. Replace exam-question relations in one bounded batch after validating all targets. Normalize tag names with Unicode normalization, trim, and locale-independent lowercase; store both display and normalized forms.

- [ ] **Step 5: Add indexes and run verification**

Add indexes for `objects(type, lifecycle, updatedAt)`, `relations(sourceObjectId, type, position)`, and `questionMemory(dueAt, questionId)`. Disable indexing for revision `payload.authorNotes`, submitted answers, and stored FSRS card maps where queries are not needed.

```powershell
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/objects.firebase.test.ts"
pnpm lint
git add src/data/objects.ts src/data/object-relations.ts src/data/tags.ts src/data/objects.firebase.test.ts src/data/space-objects.ts firestore.indexes.json
git commit -m "feat: add versioned object repositories"
```

### Task 5: Question authoring service and Server Actions

**Files:**
- Create: `src/domain/questions/question-service.ts`
- Create: `src/domain/questions/question-service.test.ts`
- Create: `src/lib/actions/question-actions.ts`
- Create: `src/lib/actions/question-actions.test.ts`
- Create: `src/data/questions-v2.ts`

**Interfaces:**
- Consumes: question schemas, object repository, tag repository, and `requireActionUser()`.
- Produces: `createQuestionAction()`, `saveQuestionDraftAction()`, `publishQuestionAction()`, `archiveQuestionAction()`, `setQuestionTagsAction()`, `listQuestionSummaries()`, and `getQuestionAuthoringView()`.

- [ ] **Step 1: Write failing service and action tests**

Cover valid creation, malformed options, unsupported formats, publish without a valid draft, cross-space IDs, correct-answer redaction, and authenticated ownership. Mock the repository ports in domain service tests and the action identity helper in action tests.

```ts
expect(await service.create(command)).toEqual(
  expect.objectContaining({ type: "question", lifecycle: "draft" }),
);
expect(await action({ spaceId: "other-space", input })).toEqual({
  ok: false,
  error: { code: "forbidden" },
});
```

- [ ] **Step 2: Verify RED**

```powershell
pnpm exec vitest run src/domain/questions/question-service.test.ts src/lib/actions/question-actions.test.ts
```

- [ ] **Step 3: Implement stable action results**

Use this shared result shape in action files:

```ts
export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code: DomainErrorCode;
        fieldErrors?: Record<string, string[]>;
      };
    };
```

Actions parse unknown input, authenticate, authorize through the repository, execute the service, and call `updateTag()` for the affected space/object tags. They never return raw exception messages.

- [ ] **Step 4: Implement question read models**

`listQuestionSummaries()` returns title, format, lifecycle, latest/published revision IDs, tags, and update time. `getQuestionAuthoringView()` may include correct answers only after owner authorization. Add a separate `getPublicQuestion()` that always returns `PublicQuestionDto`.

- [ ] **Step 5: Run tests and commit**

```powershell
pnpm exec vitest run src/domain/questions/question-service.test.ts src/lib/actions/question-actions.test.ts
pnpm lint
git add src/domain/questions/question-service.ts src/domain/questions/question-service.test.ts src/lib/actions/question-actions.ts src/lib/actions/question-actions.test.ts src/data/questions-v2.ts
git commit -m "feat: add question authoring actions"
```

### Task 6: Exam composition and publication

**Files:**
- Create: `src/domain/exams/exam-service.ts`
- Create: `src/domain/exams/exam-service.test.ts`
- Create: `src/data/exam-authoring.ts`
- Create: `src/data/exam-authoring.firebase.test.ts`
- Create: `src/lib/actions/exam-authoring-actions.ts`
- Create: `src/lib/actions/exam-authoring-actions.test.ts`

**Interfaces:**
- Consumes: exam policy, object/relation repositories, published question revisions, and action authentication.
- Produces: `createExamAction()`, `saveExamDraftAction()`, `replaceExamQuestionsAction()`, `publishExamAction()`, `archiveExamAction()`, `getExamAuthoringView()`, and `getPublishedExamView()`.

- [ ] **Step 1: Write failing publication tests**

Cover ordered snapshots, explicit question upgrades, duplicate questions, unpublished questions, cross-space references, revision deleted between validation and commit, and preservation of an older exam revision after a question gets a new revision.

```ts
expect(published.payload.questions).toEqual([
  { questionId: "q-2", questionRevisionId: "q-2-r1", points: 2 },
  { questionId: "q-1", questionRevisionId: "q-1-r3", points: 1 },
]);
```

- [ ] **Step 2: Verify RED**

```powershell
pnpm exec vitest run src/domain/exams/exam-service.test.ts src/lib/actions/exam-authoring-actions.test.ts
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/exam-authoring.firebase.test.ts"
```

- [ ] **Step 3: Implement draft composition**

Store editable `exam-question` relations with zero-based positions and selected question revision IDs. `replaceExamQuestionsAction()` validates the complete ordered list before replacing relations; partial invalid updates write nothing.

- [ ] **Step 4: Implement atomic publication**

In one transaction, reload the exam object, draft revision, relations, and every referenced question revision; validate ownership and publication state; create the immutable exam published revision; update the exam object pointers; and write an idempotency operation record.

- [ ] **Step 5: Run tests and commit**

```powershell
pnpm exec vitest run src/domain/exams/exam-service.test.ts src/lib/actions/exam-authoring-actions.test.ts
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/exam-authoring.firebase.test.ts"
pnpm lint
git add src/domain/exams/exam-service.ts src/domain/exams/exam-service.test.ts src/data/exam-authoring.ts src/data/exam-authoring.firebase.test.ts src/lib/actions/exam-authoring-actions.ts src/lib/actions/exam-authoring-actions.test.ts
git commit -m "feat: add versioned exam publication"
```

### Task 7: Resumable immutable exam attempts

**Files:**
- Create: `src/domain/attempts/attempt.ts`
- Create: `src/domain/attempts/attempt.test.ts`
- Create: `src/data/attempts.ts`
- Create: `src/data/attempts.firebase.test.ts`
- Create: `src/lib/actions/attempt-actions.ts`
- Create: `src/lib/actions/attempt-actions.test.ts`

**Interfaces:**
- Consumes: published exam/question revisions, `gradeQuestion()`, action authentication, and idempotency records.
- Produces: `startAttemptAction()`, `submitAttemptAnswerAction()`, `toggleAttemptBookmarkAction()`, `completeAttemptAction()`, `getAttemptView()`, and `AttemptViewDto`.

- [ ] **Step 1: Write failing attempt-domain tests**

Cover deterministic score calculation, weighted points, pass threshold boundaries, incomplete completion, completed-attempt immutability, malformed answer rejection, and grading from the item revision rather than the question's latest revision.

```ts
expect(scoreAttempt(items, 70)).toEqual({
  score: 7,
  maximumScore: 10,
  percentage: 70,
  passed: true,
});
```

- [ ] **Step 2: Write failing emulator tests for idempotency and snapshots**

Start the same attempt twice with one idempotency key and assert one attempt. Submit the same answer twice and assert one persisted answer result. Revise the source question after attempt creation and assert the attempt still grades against its stored revision.

- [ ] **Step 3: Verify RED**

```powershell
pnpm exec vitest run src/domain/attempts/attempt.test.ts src/lib/actions/attempt-actions.test.ts
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/attempts.firebase.test.ts"
```

- [ ] **Step 4: Implement attempt creation and item subcollections**

`startAttemptAction()` loads one published exam revision and creates an attempt header plus one item document per question reference. Store only IDs, positions, points, status, and timestamps in the attempt aggregate; read prompt content from immutable revision IDs.

- [ ] **Step 5: Implement server-only answer submission and completion**

`submitAttemptAnswerAction()` parses the answer, loads the immutable question revision, grades on the server, transactionally writes the item, and returns `QuestionFeedbackDto`. `completeAttemptAction()` reads all items, rejects incomplete attempts, calculates the score, and marks the attempt complete exactly once.

- [ ] **Step 6: Run tests and commit**

```powershell
pnpm exec vitest run src/domain/attempts/attempt.test.ts src/lib/actions/attempt-actions.test.ts
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/attempts.firebase.test.ts"
pnpm lint
git add src/domain/attempts src/data/attempts.ts src/data/attempts.firebase.test.ts src/lib/actions/attempt-actions.ts src/lib/actions/attempt-actions.test.ts
git commit -m "feat: add resumable exam attempts"
```

### Task 8: Versioned FSRS adapter and due queue

**Files:**
- Create: `src/domain/study/fsrs-scheduler.ts`
- Create: `src/domain/study/fsrs-scheduler.test.ts`
- Create: `src/domain/study/study-queue.ts`
- Create: `src/domain/study/study-queue.test.ts`

**Interfaces:**
- Consumes: `ts-fsrs` only inside `fsrs-scheduler.ts`.
- Produces: `MemoryRating`, `StoredFsrsCard`, `MemoryTransition`, `createMemoryCard()`, `previewMemoryRatings()`, `scheduleMemoryReview()`, and `buildStudyQueue()`.

- [ ] **Step 1: Write deterministic scheduler tests**

Inject a fixed `Date`, set `enable_fuzz: false`, and test all four ratings, serialization round trips, finite due dates, increasing state versions, preview purity, stable due ordering, new-question ordering, and queue limits.

```ts
const now = new Date("2026-09-18T12:00:00.000Z");
const transition = scheduleMemoryReview({
  previous: null,
  rating: "good",
  now,
  stateVersion: 0,
});
expect(new Date(transition.resultingCard.due).getTime()).toBeGreaterThan(
  now.getTime(),
);
expect(transition.stateVersion).toBe(1);
```

- [ ] **Step 2: Verify RED**

```powershell
pnpm exec vitest run src/domain/study/fsrs-scheduler.test.ts src/domain/study/study-queue.test.ts
```

- [ ] **Step 3: Implement the project-owned adapter**

Use `fsrs({ request_retention: 0.9, enable_fuzz: false })`, `createEmptyCard(now)`, and `scheduler.next(card, now, grade)`. Convert library snake-case card fields to an application-owned camel-case `StoredFsrsCard`; stamp `schedulerVersion: "ts-fsrs-5.4"` and `parametersVersion: "default-0.90-v1"`.

- [ ] **Step 4: Implement the queue policy**

Order due memories by `dueAt`, then `questionId`; append eligible unseen questions by `createdAt`, then `questionId`; apply a positive integer limit after combining. Reject invalid dates instead of silently placing them in the queue.

- [ ] **Step 5: Run tests and commit**

```powershell
pnpm exec vitest run src/domain/study/fsrs-scheduler.test.ts src/domain/study/study-queue.test.ts
pnpm lint
git add src/domain/study
git commit -m "feat: add versioned FSRS scheduling"
```

### Task 9: Transactional question memory and review actions

**Files:**
- Create: `src/data/study.ts`
- Create: `src/data/study.firebase.test.ts`
- Create: `src/lib/actions/study-actions.ts`
- Create: `src/lib/actions/study-actions.test.ts`
- Modify: `src/data/attempts.ts`
- Modify: `src/lib/actions/attempt-actions.ts`

**Interfaces:**
- Consumes: FSRS adapter, question grading, immutable revisions, action authentication, and attempt links.
- Produces: `ensureQuestionMemory()`, `enrollQuestionAction()`, `getDueStudyQueue()`, `previewReviewRatingsAction()`, `gradeStudyAnswerAction()`, `rateQuestionMemoryAction()`, and `QuestionMemoryDto`.

- [ ] **Step 1: Write failing transaction tests**

Cover first review, later review, explicit rating requirement, correctness stored separately, one review event per accepted transition, duplicate idempotency replay, stale state version from two tabs, cross-space question IDs, automatic enrollment after an accepted attempt answer, explicit enrollment, and transaction callback replay safety.

```ts
const first = await rateQuestionMemory(command({ stateVersion: 0 }));
const replay = await rateQuestionMemory(command({ stateVersion: 0 }));
expect(replay).toEqual(first);
expect(await countReviewEvents(userId, spaceId)).toBe(1);
```

- [ ] **Step 2: Verify RED**

```powershell
pnpm exec vitest run src/lib/actions/study-actions.test.ts
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/study.firebase.test.ts"
```

- [ ] **Step 3: Implement a short retry-safe review transaction**

Read the operation record, memory document, and referenced question revision before writes. Re-grade the submitted answer server-side, compare `stateVersion`, compute the pure FSRS transition, then write memory, append-only review event, and operation result. Generate IDs outside the transaction callback so automatic retries reuse the same IDs.

Create an empty memory record due immediately when a user explicitly enrolls a published question. Extend accepted attempt-answer persistence to call `ensureQuestionMemory()` in the same server operation so encountered questions enter the due queue without creating a review event.

- [ ] **Step 4: Implement study read models**

Return redacted question prompts, due metadata, and rating interval previews. Do not return raw cards, previous-card snapshots, correct answers, or author notes. A no-due state returns an empty array rather than an error.

- [ ] **Step 5: Run tests and commit**

```powershell
pnpm exec vitest run src/lib/actions/study-actions.test.ts
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/study.firebase.test.ts"
pnpm lint
git add src/data/study.ts src/data/study.firebase.test.ts src/data/attempts.ts src/lib/actions/study-actions.ts src/lib/actions/study-actions.test.ts src/lib/actions/attempt-actions.ts
git commit -m "feat: persist transactional FSRS reviews"
```

### Task 10: Non-destructive migration, rules, and index verification

**Files:**
- Create: `scripts/migrate-exam-fsrs-foundation.ts`
- Create: `scripts/verify-exam-fsrs-migration.ts`
- Create: `scripts/migrate-exam-fsrs-foundation.test.ts`
- Modify: `package.json`
- Modify: `firestore.rules`
- Modify: `firestore.indexes.json`
- Create: `src/data/security-rules.firebase.test.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: current `exams`, nested questions, fixture data, and new repositories.
- Produces: dry-run/apply migration commands, verification report, and default-deny client rules for new paths.

- [ ] **Step 1: Write failing migration tests**

Test deterministic IDs, repeated application, no source deletion, explicit owner requirement, fixture conversion, relation order, revision references, and progress conversion to a `legacy-import` record without fabricated answer history.

- [ ] **Step 2: Implement dry-run-first migration commands**

Add scripts:

```json
"migrate:exam-fsrs": "tsx scripts/migrate-exam-fsrs-foundation.ts",
"verify:exam-fsrs": "tsx scripts/verify-exam-fsrs-migration.ts"
```

Require `MIGRATION_OWNER_UID` and `MIGRATION_SPACE_ID`; print planned document counts by default; write only with `--apply`; reject production project IDs unless `--allow-production` is also present. Never delete legacy documents.

- [ ] **Step 3: Tighten client Firestore rules**

Keep Firebase Auth client access, but set `allow read, write: if false` for `spaces`, object revisions, relations, tags, user attempts, attempt items, question memory, review events, and operations because the application uses Firebase Admin after server authorization. Preserve only explicitly required client preference or note access until those flows migrate.

- [ ] **Step 4: Add rules and migration verification tests**

Use the emulator to assert all new application paths deny client SDK reads and writes for owners and non-owners alike, while server repositories still work. Verify migrated counts, references, owner IDs, and representative grades.

- [ ] **Step 5: Run tests and commit**

```powershell
pnpm exec vitest run scripts/migrate-exam-fsrs-foundation.test.ts
pnpm exec firebase emulators:exec --only auth,firestore --project demo-notes-app "pnpm exec vitest run --config vitest.firebase.config.ts src/data/security-rules.firebase.test.ts"
pnpm lint
git add scripts/migrate-exam-fsrs-foundation.ts scripts/verify-exam-fsrs-migration.ts scripts/migrate-exam-fsrs-foundation.test.ts package.json firestore.rules firestore.indexes.json src/data/security-rules.firebase.test.ts .env.example
git commit -m "feat: add safe object migration and rules"
```

### Task 11: Canonical localized space shell

**Files:**
- Modify: `src/proxy.ts`
- Modify: `src/proxy.test.ts`
- Delete: `src/app/layout.tsx`
- Modify: `src/app/[lang]/layout.tsx`
- Modify: `src/app/[lang]/page.tsx`
- Create: `src/app/[lang]/spaces/[spaceId]/layout.tsx`
- Create: `src/app/[lang]/spaces/[spaceId]/page.tsx`
- Create: `src/components/spaces/space-shell.tsx`
- Create: `src/components/spaces/space-shell.test.tsx`
- Create: `src/components/spaces/space-switcher.tsx`
- Create: `src/components/spaces/space-switcher.test.tsx`
- Create: `src/lib/actions/space-actions.ts`
- Create: `src/lib/actions/space-actions.test.ts`
- Modify: `src/lib/i18n/types.ts`
- Modify: `src/lib/i18n/dictionaries/en.json`
- Modify: `src/lib/i18n/dictionaries/pt-BR.json`

**Interfaces:**
- Consumes: current auth, dictionaries, owned-space repository, UserNav, Sidebar, Card, Empty, and Suspense conventions.
- Produces: `createSpaceAction()`, `renameSpaceAction()`, canonical locale-prefixed navigation, private-space creation, switching, rename, and landing UI.

- [ ] **Step 1: Read the installed Next.js guides and write failing proxy tests**

Read `01-app/02-guides/internationalization.md`, `01-app/01-getting-started/07-mutating-data.md`, and `01-app/01-getting-started/09-revalidating.md`. Change tests so authenticated and unauthenticated requests without a locale redirect to the negotiated locale, supported locale paths remain prefixed, and API/static paths bypass proxying.

- [ ] **Step 2: Verify RED**

```powershell
pnpm exec vitest run src/proxy.test.ts src/components/spaces/space-shell.test.tsx src/components/spaces/space-switcher.test.tsx src/lib/actions/space-actions.test.ts
```

- [ ] **Step 3: Move the root document to the locale layout**

Move fonts, metadata, `<html lang={lang}>`, ThemeProvider, and FirebaseProvider into `src/app/[lang]/layout.tsx`. Keep `generateStaticParams()`, validate `lang` with `hasLocale()`, and delete the obsolete root layout after `pnpm build` proves the localized root is valid.

- [ ] **Step 4: Implement the space shell**

Render navigation for Overview, Questions, Exams, Study, and Collections. Use existing Sidebar, Button, Card, Badge, Empty, Skeleton, and UserNav components. Include skip navigation, responsive sheet behavior supplied by Sidebar, labelled icon-only controls, and no raw color classes. The switcher lists only owned spaces and exposes create and rename forms backed by authenticated actions with inline validation and pending states.

- [ ] **Step 5: Replace starter copy and add translations**

Replace the create-next-app page with owned-space selection or default-space redirect. Add complete `spaces`, `objects`, `authoring`, `attempts`, and `study` dictionary sections in English and Portuguese; update `AppMessages` to enforce parity.

- [ ] **Step 6: Run UI checks and commit**

```powershell
pnpm exec vitest run src/proxy.test.ts src/components/spaces/space-shell.test.tsx src/components/spaces/space-switcher.test.tsx src/lib/actions/space-actions.test.ts src/lib/i18n/dictionaries.test.ts
pnpm lint
pnpm build
git add src/proxy.ts src/proxy.test.ts src/app/layout.tsx src/app/[lang] src/components/spaces src/lib/actions/space-actions.ts src/lib/actions/space-actions.test.ts src/lib/i18n/types.ts src/lib/i18n/dictionaries/en.json src/lib/i18n/dictionaries/pt-BR.json
git commit -m "feat: add localized private space shell"
```

### Task 12: Accessible question, collection, and tag authoring interface

**Files:**
- Create: `src/app/[lang]/spaces/[spaceId]/questions/page.tsx`
- Create: `src/app/[lang]/spaces/[spaceId]/questions/new/page.tsx`
- Create: `src/app/[lang]/spaces/[spaceId]/questions/[questionId]/page.tsx`
- Create: `src/components/questions/question-editor.tsx`
- Create: `src/components/questions/question-editor.test.tsx`
- Create: `src/components/questions/question-list.tsx`
- Create: `src/components/questions/question-list.test.tsx`
- Create: `src/components/questions/question-editor.stories.tsx`
- Create: `src/app/[lang]/spaces/[spaceId]/collections/page.tsx`
- Create: `src/app/[lang]/spaces/[spaceId]/collections/[collectionId]/page.tsx`
- Create: `src/components/objects/collection-editor.tsx`
- Create: `src/components/objects/collection-editor.test.tsx`
- Create: `src/components/objects/tag-selector.tsx`
- Create: `src/components/objects/tag-selector.test.tsx`
- Create: `src/lib/actions/organization-actions.ts`
- Create: `src/lib/actions/organization-actions.test.ts`

**Interfaces:**
- Consumes: question authoring actions, object relation/tag repositories, React Hook Form, Zod resolver, Field, Input, Textarea, RadioGroup, Checkbox, Select, Combobox, Button, Badge, Alert, and Empty.
- Produces: create/edit/publish/archive question workflows for three supported formats plus collection creation/membership and tag assignment.

- [ ] **Step 1: Write failing component tests**

Test format switching, stable option IDs, adding/removing options, single-choice radio behavior, multiple-choice checkbox behavior, true/false fixed options, validation summary focus, pending/disabled states, failed save retention, publish success, collection creation and membership, normalized duplicate-tag rejection, tag assignment/removal, and keyboard operation.

- [ ] **Step 2: Verify RED**

```powershell
pnpm exec vitest run src/components/questions/question-editor.test.tsx src/components/questions/question-list.test.tsx src/components/objects/collection-editor.test.tsx src/components/objects/tag-selector.test.tsx src/lib/actions/organization-actions.test.ts
```

- [ ] **Step 3: Implement the editor from existing primitives**

Use `useActionState` for form submission and map field errors to `Field` with `aria-invalid`. Keep correct-answer controls owner-only. Generate option IDs once when an option is added; editing its text must not change the ID. Present save-draft and publish as distinct labelled actions. Compose collection and tag selectors from the installed Combobox/Command primitives; selectors submit stable IDs rather than display labels.

- [ ] **Step 4: Implement list and routes**

Server pages authenticate and authorize before loading data. The question list supports lifecycle and format filters, paginated results, empty/error states, collection membership, tags, and locale-preserving links. Collection routes create collection objects, list members, and add or remove existing objects without duplicating them. Place data-dependent pages behind Suspense boundaries required by Cache Components.

- [ ] **Step 5: Add stories and run checks**

```powershell
pnpm exec vitest run src/components/questions/question-editor.test.tsx src/components/questions/question-list.test.tsx src/components/objects/collection-editor.test.tsx src/components/objects/tag-selector.test.tsx src/lib/actions/organization-actions.test.ts
pnpm lint
pnpm ladle:build
pnpm build
git add src/app/[lang]/spaces/[spaceId]/questions src/app/[lang]/spaces/[spaceId]/collections src/components/questions src/components/objects src/lib/actions/organization-actions.ts src/lib/actions/organization-actions.test.ts
git commit -m "feat: add question and collection authoring"
```

### Task 13: Accessible exam authoring interface

**Files:**
- Create: `src/app/[lang]/spaces/[spaceId]/exams/page.tsx`
- Create: `src/app/[lang]/spaces/[spaceId]/exams/new/page.tsx`
- Create: `src/app/[lang]/spaces/[spaceId]/exams/[examId]/page.tsx`
- Create: `src/app/[lang]/spaces/[spaceId]/exams/[examId]/edit/page.tsx`
- Create: `src/components/exams/exam-editor.tsx`
- Create: `src/components/exams/exam-editor.test.tsx`
- Create: `src/components/exams/question-picker.tsx`
- Create: `src/components/exams/question-picker.test.tsx`
- Create: `src/components/exams/exam-editor.stories.tsx`

**Interfaces:**
- Consumes: exam authoring actions, question summaries, Combobox/Command, Button, Table, AlertDialog, Badge, and Field primitives.
- Produces: exam create, compose, reorder, explicit revision upgrade, publish, archive, and launch-attempt flows.

- [ ] **Step 1: Write failing editor tests**

Test question search, adding one question once, accessible move-up/move-down ordering, points editing, pass threshold validation, newer-revision warning, explicit upgrade, publish confirmation, and prevention of empty publication.

- [ ] **Step 2: Verify RED**

```powershell
pnpm exec vitest run src/components/exams/exam-editor.test.tsx src/components/exams/question-picker.test.tsx
```

- [ ] **Step 3: Implement composition without a new drag dependency**

Use up/down buttons with accessible names and deterministic focus retention after reordering. The picker returns question IDs and selected published revision IDs. Display lifecycle and revision badges; never auto-upgrade references.

- [ ] **Step 4: Implement routes, stories, and validation**

The published exam detail page shows immutable revision metadata and starts an attempt through `startAttemptAction()`. Draft pages remain owner-only. Use translated copy and semantic tokens.

- [ ] **Step 5: Run checks and commit**

```powershell
pnpm exec vitest run src/components/exams/exam-editor.test.tsx src/components/exams/question-picker.test.tsx
pnpm lint
pnpm ladle:build
pnpm build
git add src/app/[lang]/spaces/[spaceId]/exams src/components/exams
git commit -m "feat: add versioned exam authoring interface"
```

### Task 14: Secure attempt interface and legacy assessment cutover

**Files:**
- Create: `src/app/[lang]/spaces/[spaceId]/attempts/[attemptId]/page.tsx`
- Create: `src/components/attempts/attempt-session.tsx`
- Create: `src/components/attempts/attempt-session.test.tsx`
- Modify: `src/components/object/question/question.tsx`
- Modify: `src/components/object/question/question-renderer.tsx`
- Modify: `src/components/object/question/question.test.tsx`
- Modify: `src/components/object/assessment/assessment.tsx`
- Delete: `src/app/(space)/(object)/exam/[examId]/page.tsx`
- Delete: `src/app/(space)/page.tsx`
- Delete: `src/app/(space)/layout.tsx`

**Interfaces:**
- Consumes: `AttemptViewDto`, `PublicQuestionDto`, answer/bookmark/complete actions, and existing question presentation components.
- Produces: resumable exam attempt UI that grades only on the server.

- [ ] **Step 1: Write failing security and interaction tests**

Assert QuestionRenderer accepts no `correctAnswer`, no correctness is shown before the action response, malformed action responses produce a localized error, accepted feedback reveals the explanation and correct options, resume restores answers/bookmarks, and completed attempts are read-only.

```ts
expect(screen.queryByText(/correct/i)).not.toBeInTheDocument();
await user.click(screen.getByRole("button", { name: /check answer/i }));
expect(await screen.findByText(/because both statements apply/i)).toBeVisible();
```

- [ ] **Step 2: Verify RED**

```powershell
pnpm exec vitest run src/components/attempts/attempt-session.test.tsx src/components/object/question/question.test.tsx
```

- [ ] **Step 3: Refactor question rendering around feedback DTOs**

Replace client-side `evaluateAnswerCorrectness()` with `onSubmitAnswer(answer): Promise<ActionResult<QuestionFeedbackDto>>`. The renderer owns selected answer and revealed feedback, but never receives the grading definition. Keep existing single/multiple choice visual components; add true/false through the single-choice renderer.

- [ ] **Step 4: Implement attempt navigation and cut over routes**

Support focus and continuous views, previous/next navigation, answered count, bookmark, save status, resume, completion confirmation, and summary. After the localized attempt route passes, remove the unprefixed route group so no page serializes legacy `Question.correctAnswer`.

- [ ] **Step 5: Run checks and commit**

```powershell
pnpm exec vitest run src/components/attempts/attempt-session.test.tsx src/components/object/question/question.test.tsx src/lib/assessment/state.test.ts
pnpm lint
pnpm build
git add src/app/[lang]/spaces/[spaceId]/attempts src/components/attempts src/components/object/question src/components/object/assessment src/app/(space)
git commit -m "feat: secure exam attempt grading"
```

### Task 15: FSRS study interface, end-to-end proof, and operations handoff

**Files:**
- Create: `src/app/[lang]/spaces/[spaceId]/study/page.tsx`
- Create: `src/components/study/study-session.tsx`
- Create: `src/components/study/study-session.test.tsx`
- Create: `src/components/study/memory-rating-bar.tsx`
- Create: `src/components/study/memory-rating-bar.test.tsx`
- Create: `src/components/study/study-session.stories.tsx`
- Create: `e2e/exam-fsrs.spec.ts`
- Create: `playwright.config.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `docs/operations/exam-fsrs-runbook.md`
- Modify: `README.md`
- Modify: `ARCHITECTURE.md`

**Interfaces:**
- Consumes: study actions, redacted question renderer, localized dictionaries, and completed authoring/attempt routes.
- Produces: due-review session, rating UI, full browser proof, and production migration/rollback/observability runbook.

- [ ] **Step 1: Add pinned browser-test tooling**

Run:

```powershell
pnpm add -D @playwright/test@^1.63.0
pnpm exec playwright install chromium
```

Add `test:e2e` as `playwright test` and configure a Chromium project against `http://127.0.0.1:3000` with screenshots and traces retained on failure.

- [ ] **Step 2: Write failing study component tests**

Cover empty queue, answer-before-rating order, Again/Hard/Good/Easy keyboard controls, interval labels, pending/disabled states, stale-state refresh prompt, duplicate-click suppression, next question, and session completion.

- [ ] **Step 3: Verify RED**

```powershell
pnpm exec vitest run src/components/study/study-session.test.tsx src/components/study/memory-rating-bar.test.tsx
```

- [ ] **Step 4: Implement the study experience**

Render one redacted question at a time. After server grading, reveal feedback and enable four rating buttons. Each button includes its preview interval, calls `rateQuestionMemoryAction()` once, announces the resulting due time, and advances only after success.

- [ ] **Step 5: Add the production browser scenario**

`e2e/exam-fsrs.spec.ts` signs in against the emulator, creates a private space, creates and publishes three question formats, composes and publishes an exam, completes and resumes an attempt, verifies scoring, studies a question, chooses Good, and verifies it leaves the immediate due queue.

- [ ] **Step 6: Write the operations runbook**

Document environment validation, emulator/staging commands, dry-run and apply migration commands, verification queries, rollback by reverting readers while retaining new documents, Firestore export/restore verification, required indexes, log identifiers, dashboards for mutation failures/contention/stale state, and the rule that production migration never deletes legacy data.

- [ ] **Step 7: Run the complete release gate**

```powershell
pnpm lint
pnpm test
pnpm test:firebase
pnpm ladle:build
pnpm build
pnpm test:e2e
graphify update .
git diff --check
```

Expected: every command passes; Graphify reflects new modules; no correct-answer payload is present in browser-rendered attempt or study data.

- [ ] **Step 8: Commit the final slice**

```powershell
git add src/app/[lang]/spaces/[spaceId]/study src/components/study e2e/exam-fsrs.spec.ts playwright.config.ts package.json pnpm-lock.yaml docs/operations/exam-fsrs-runbook.md README.md ARCHITECTURE.md graphify-out
git commit -m "feat: ship FSRS study workflow"
```

## Implementation order and release checkpoints

- Tasks 1–2 establish pure domain contracts and can be reviewed before Firebase work.
- Tasks 3–4 establish the secure persistence foundation and must pass emulator tests before authoring actions begin.
- Tasks 5–6 produce a deployable authoring API; no UI depends on legacy write paths after Task 6.
- Task 7 produces a complete server-side attempt lifecycle.
- Tasks 8–9 produce a complete server-side study lifecycle.
- Task 10 makes migration and client-deny rules deployable before route cutover.
- Task 11 establishes canonical routing and the private-space shell.
- Tasks 12–13 ship authoring UI.
- Task 14 cuts over attempts and removes correct answers from client props.
- Task 15 ships study UI and the full production verification story.

Do not begin a later checkpoint while tests from its prerequisite checkpoint are red. Deploy to staging after Tasks 4, 7, 10, and 15. Production cutover happens only after Task 15's runbook checks and migration verification pass.
