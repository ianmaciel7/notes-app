# 0017. Lean ExamTopics Domain Model and TypeDashboard Navigation

- **Status:** Accepted
- **Date:** 2026-10-03
- **Canonical Owner:** `ARCHITECTURE.md`

## Context and Problem Statement

The platform requires an active recall and certification exam simulation engine inspired by lean assessment platforms (Exam, Question, Correct Answer, Grounded Explanation). The domain model must operate within the strict architectural and persistence constraints of `notes-app`:

1. **Firestore Document Budget (1MB limit) and Shallow Reads**: Storing entire exams with hundreds of rich questions, option lists, and explanations inside a single document would breach Firestore document limits, cause excessive bandwidth consumption, and prevent fast shallow listing. Conversely, reading questions must be fast and granular.
2. **Polymorphic Entity Model (`DER.md` schemaVersion 4)**: The repository models all domain entities as polymorphic `Object` documents (`/users/{uid}/spaces/{spaceId}/objects/{objectId}`). Introducing disconnected root collections (as explored in early drafts such as ADR 0014) breaks graph interoperability and tenant security invariants.
3. **Separation of Assessment Structure vs. User Annotations**: Learners require the ability to author personal notes, reflections, and links on questions. Storing user notes in the same structure as authoritative question metadata risks schema corruption and conflates imported content with private learner commentary.
4. **Single-Record Graph Relations (`INV-10`)**: Associations between exams, questions, and knowledge concepts must follow the single-record relation model (`/users/{uid}/spaces/{spaceId}/relations/{relationId}`) rather than bespoke join tables.
5. **Immutable Practice Logs (`INV-11`)**: Question attempts, whether during self-paced study or timed mock exams, must be recorded as append-only immutable records (`/users/{uid}/spaces/{spaceId}/attempts/{attemptId}`).
6. **Workspace Ergonomics**: Navigating between object types, type catalogs, views, and specific exam items requires an ergonomic study feed for immediate active recall, with a clear path toward scalable Capacities-style Object Dashboards in future phases.

## Decision Outcome

We standardize the domain architecture for exams, questions, and assessment navigation:

### 1. Polymorphic Object Representation for Exam and Question

`Exam` and `Question` are first-class polymorphic `Object` documents under `/users/{uid}/spaces/{spaceId}/objects/{objectId}` conforming to `DER.md` `schemaVersion: 4`:

- **Exam (`objectTypeId: "exam"`)**:
  - `title`: Exam or certification title (e.g., "Google Cloud Certified Professional Cloud Architect").
  - `properties`:
    - `provider`: Certification authority or source organization (e.g., "Google Cloud", "AWS").
    - `code`: Official exam code (e.g., "GCP-PCA").
    - `totalQuestionsCount`: Total number of questions in the catalog.
    - `passingScorePercentage`: Target passing threshold (e.g., 70).
    - `timeLimitMinutes`: Optional allocated duration for simulation mode.
    - `questionIds`: Ordered array of question `objectId`s for deterministic sequence resolution.

- **Question (`objectTypeId: "question"`)**:
  - `title`: Short question summary or identifier (e.g., "PCA Question 042").
  - `properties`:
    - `statement`: Question prompt and scenario (Markdown with code formatting).
    - `options`: Array of selectable choices:
      ```typescript
      interface QuestionOption {
        id: string;
        text: string;
      }
      ```
    - `correctOptionIds`: Array of correct option IDs (`string[]`).
    - `groundedExplanation`: Authoritative rationale linking correct choices directly to official documentation URLs and architectural insights:
      ```typescript
      interface GroundedExplanation {
        text: string;
        referenceUrls: string[];
      }
      ```
    - `examId`: Parent `Exam` object ID for fast indexed queries.
    - `orderIndex`: Canonical sequence index within the parent exam.
    - `format`: `'single_choice' | 'multiple_choice'`.
  - `content`: User personal notes serialized as `BlockEditorDocumentV4` AST (depth $\le 8$). The question's prompt, choices, and explanation stay strictly in `properties`, leaving `content` completely free for private annotations.

### 2. Graph Relations and Sequencing (`INV-10`)

The hierarchy between an `Exam` and its `Question` objects is tracked using the unified `relations` subcollection (`/users/{uid}/spaces/{spaceId}/relations/{relationId}`):
- `sourceObjectId`: Exam ID.
- `targetObjectId`: Question ID.
- `relationType`: `"contains"`.
- `sortOrder`: Matches `orderIndex` for manual or canonical ordering.

In addition, the Exam's `properties.questionIds` provides an in-document index of question IDs to allow instant sequential navigation without issuing a separate graph query during study sessions.

### 3. Immutable Append-Only Attempts (`INV-11`)

Submissions in study or simulation modes are recorded directly into the space's `attempts` collection (`/users/{uid}/spaces/{spaceId}/attempts/{attemptId}`):
- `schemaVersion`: `4`
- `spaceId`: Tenant space ID.
- `questionId`: References the `Question` object.
- `cardId`: Optional reference to a spaced-repetition card if scheduled via FSRS.
- `rating`: Binary/numeric score (e.g., `1` for incorrect, `3` or `4` for correct).
- `reviewMode`: `"review" | "mockExam"`.
- `elapsedMilliseconds`: Time spent on the question.
- `reviewedAt`: `serverTimestamp()` (immutable submission time).

This adheres strictly to `firestore.rules`, which permits create and delete-on-cascade operations while rejecting update mutations on attempts.

### 4. Presentation and Navigation Roadmap (Phased Approach)

Following explicit user direction to defer complex multi-column management for a future phase ("not for now, leave this for the future"), the navigation and interface architecture follows a phased rollout:

#### Phase 1 (Immediate / Active): ExamTopics Question Feed

The active implementation priority focuses entirely on a high-velocity, clean, and distraction-free study experience modeled directly on ExamTopics:
- **Single-Column Continuous Feed**: Questions are rendered inside the space workspace canvas as a continuous vertical stream of Question Cards (`Question #1`, `Question #2`, etc.) for seamless sequential reading and practice.
- **ExamTopics Card Visual Anatomy**:
  - **Prominent Blue Header Banner**: Displays `Question #N (Topic: <Exam Name>)` on the left and a topic badge on the right.
  - **Scenario Statement**: Formatted in Markdown with high-contrast typography and syntax-highlighted technical snippets.
  - **Clean Multiple-Choice Options**: Selectable choices (`A.`, `B.`, `C.`, `D.`) supporting single-choice or multiple-choice formats.
  - **`Reveal Solution` Action Button**: Reveals the correct answer key and the authoritative Grounded Explanation (with deep links to official vendor documentation and architectural rationale), deliberately omitting forum, discussion, or voting buttons.
  - **Floating Scroll-to-Top Button**: Unobtrusive floating action button providing immediate return to the top of long question feeds.

#### Phase 2 (Future / Deferred): Complex Multi-Column TypeDashboard

Deferred to a later milestone when multi-type catalog curation and cross-collection organization are required:
- **Primary Space Sidebar**: Permanent left column containing user profile, space switcher, global search, inbox, and ObjectType navigation links.
- **Secondary Collapsible TypeDashboard**: Lateral secondary column adjacent to the primary sidebar, invoked when an ObjectType (such as Exams) is active:
  - Displays type-specific catalogs, predefined views (All Exams, In Progress, Completed), collections, and recently accessed items.
  - Allows selecting an item to open it directly in the main canvas.
  - Collapsible or expandable to maximize reading canvas width, rendering as a slide-over sheet on compact/mobile viewports.

### 5. URL Routing Architecture vs. Firestore Storage Topology

To reconcile human-readable navigation with polymorphic persistence, the system separates the frontend URL hierarchy from the backend persistence topology:

- **Frontend Routing (Next.js App Router)**: Exposes semantic, user-friendly, type-qualified slugs that map naturally to user mental models and browser history:
  - **Type Catalog / TypeDashboard**: `/[spaceId]/[objectTypeSlug]` (e.g., `/[spaceId]/exams`, `/[spaceId]/questions`).
  - **Specific Item View / Editor**: `/[spaceId]/[objectTypeSlug]/[objectId]` (e.g., `/[spaceId]/exams/[examId]`, `/[spaceId]/questions/[questionId]`).
  - This structure enables deep-linking directly into a specific type's catalog or a concrete entity while retaining contextual breadcrumbs and layout hierarchy in the URL bar.

- **Backend / Database Topology (Firestore)**: Strictly preserves the single polymorphic collection path under `/users/{uid}/spaces/{spaceId}/objects/{objectId}`:
  - **Polymorphic Queries**: Preserves cross-type queries such as Omnisearch, recent activity, and global space-wide filters across all types in a space without multi-collection fans.
  - **Zero-Migration Renaming & Type Conversions**: Converting an object from one `objectTypeId` to another or updating `objectTypeSlug` definitions does not require physically moving or migrating documents across collections.
  - **Unified Graph Relations**: Keeps graph edges under `/users/{uid}/spaces/{spaceId}/relations/{relationId}` unified and simple, where `sourceObjectId` and `targetObjectId` reference identifiers in the single `objects` collection regardless of domain type.
  - **Centralized Security Enforcement**: Strictly adheres to the centralized tenant security rules in `firestore.rules`, avoiding fragmented security policies across arbitrary domain-specific root or subcollections.


## Consequences

### Positive Consequences

- **Optimized Shallow Reads**: Listing exams reads only lightweight exam documents. Individual questions are fetched on demand or streamed sequentially during study sessions, avoiding large single-document payloads.
- **100% Architectural Compliance**: Seamlessly integrates with `DER.md` `schemaVersion: 4` and existing `firestore.rules` without creating ad-hoc collections or security exceptions.
- **Decoupled Learner Notes**: Separating assessment data in `properties` from user notes in `content` allows learners to write rich notes, insert highlights, and link concepts without risking corruption of the question prompt or correct answer key.
- **Auditability and Progress Tracking**: Immutable attempt logs provide an unforgeable history for accuracy analytics, streak tracking, and FSRS spaced repetition.
- **Distraction-Free Study Ergonomics (Phase 1)**: The single-column continuous feed eliminates complex multi-pane clutter, keeping learners focused on question practice, instant verification, and official documentation grounding.
- **Future-Proof Extensibility (Phase 2)**: Preserves the architectural blueprint for Capacities-style TypeDashboards without slowing down the immediate delivery of the core certification engine.

### Trade-offs and Mitigations

- **Client Memory Visibility**: In client-driven study mode, `correctOptionIds` is delivered in the Question document properties.
  - *Mitigation*: For study and self-assessment modes, immediate local access to the answer key and grounded explanation is desirable for zero-latency feedback. If high-stakes proctored test modes are required in the future, answer checking can be delegated to a serverless function that strips answers before delivering questions.
- **Sequence Updates**: Reordering questions within an exam requires updating the Exam's `questionIds` array and corresponding relation records.
  - *Mitigation*: Performed atomically via Firestore `writeBatch` (up to 500 operations per batch).
- **Deferred Multi-Type Organization**: TypeDashboard views, collections, and custom type-level triage are deferred to Phase 2.
  - *Mitigation*: The single-column continuous feed satisfies the immediate user priority for certification study, while URL routes (`/[spaceId]/exams/[examId]`) remain fully compatible with the future TypeDashboard layout.
