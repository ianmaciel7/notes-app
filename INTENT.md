# Intent: Notes App — Personal Knowledge & Learning Workspace

**Author:** Ian Maciel  
**Status:** Draft  
**Last Updated:** 2026-09-25  
**Version:** 0.9  

> **Intent** document: defines the problem, desired outcome, invariants, scope, and product decisions.  
> It is not a technical specification or implementation plan. It is read by humans and AI agents **before** any planning or code.

| Field | Value |
|---|---|
| Author | Ian Maciel |
| Status | Draft |
| Version | 0.9 |
| Last Updated | 2026-09-25 |
| Related | `grill-with-docs` workflow (`/grill-with-docs`, `/to-spec`, `/to-tickets`) |

### History

| Version | Change |
|---|---|
| 0.1 | Initial draft. |
| 0.2 | Restructuring: glossary, invariants, acceptance criteria, phases, traceable questions. |
| 0.9 | Comparison with documentation across all references: Exam plan, Daily limits, Leech question, Progress dashboard, Mock exam modes, navigation (Command palette, Pins, Side panel), Version history, Calendar, EPUB, backlog §9.1 (Q-74…Q-86). |
| 0.8 | Collection confirmed identical to Capacities (Q-73). |
| 0.7 | Single document: Glossary and Decisions (D-1…D-6) incorporated; no auxiliary files. |
| 0.6 | Ready-made types aligned with Capacities Basic Object Types (Q-71) and Type Dashboard (Q-72). |
| 0.5 | Gap review: consolidated glossary (PT-BR UI, EN code), D-6 (Accounts), Q-61…Q-70 and all questions closed. |
| 0.4 | Grill session: decisions Q-10…Q-60 recorded in Glossary and D-1…D-5 (Isolated spaces, Highlight as Object, Concept replaces Tag, Concepts in SKOS, Unified Question). |
| 0.3 | Review against reference documentation: Question vs Card, review log, selectors-based locators, contextual queries, computed properties, inbox/triage, AI generation provenance, exam questions compliance, open standards. |

---

## 0. How to Use This Document

This is the **single document** of the project: it gathers intent, vocabulary (§4), invariants, requirements, phases, and decisions (§11 and §13).

<agent_instructions>
You are an agent working on `notes-app`. This file is the source of truth regarding **what** and **why**, not **how**.

1. Read this entire document before planning.
2. Before writing code, present a brief plan citing the fulfilled IDs (`G-*`, `INV-*`, `R-*`, `Q-*`, `D-*`) and the phase (§9).
3. Invariants (`INV-*`) and recorded Decisions (`D-*`, §13) are non-negotiable. If a solution violates any, stop and flag it.
4. Do not implement anything listed under Non-Goals (`NG-*`) or outside the current phase.
5. Use the Glossary (§4) as ubiquitous language: UI in PT-BR; code, database, API, and commits in English using the code names from the Glossary.
6. Every read and write MUST be filtered by Account and Space (D-1, D-6).
7. If something is not in this document, ask rather than deciding. A newly approved term enters §4; a decision hard to revert enters §13.
8. Consider a task complete only when related acceptance criteria (§7) are verifiable by automated tests.
</agent_instructions>

The words **MUST**, **MUST NOT**, **SHOULD**, and **MAY** follow RFC 2119 semantics.

---

## 1. Summary (Proposed Outcome)

A **personal knowledge and learning workspace based on typed objects**, organized into isolated **Spaces**, which preserves the **provenance** of each piece of information and allows capturing, relating, retrieving, reviewing, and practicing the same knowledge — including with AI restricted to authorized context.

```text
Source → Exact excerpt → Highlight → Concept → Note → Question → Attempt → Review
         (each step preserves the link to the preceding one)
```

---

## 2. Problem

People learn from documentation, books, articles, PDFs, videos, courses, and question banks. Each step usually happens in a different tool: reading and highlights (Readwise Reader), notes and databases (Obsidian, Notion, Capacities), visual organization (Heptabase), retention (Anki, RemNote), AI over sources (NotebookLM, StudyFetch), and question practice (ExamTopics).

These capabilities already exist in isolation. **What gets lost is the context, provenance, and relationships between them.** Integrations between these tools are usually one-way exports: the exported copy ceases to track the source.

**Typical scenario:** A student misses a certification question, searches official documentation, finds the concept, highlights a passage in another tool, writes a note, and later creates a flashcard. Everything belongs to the exact same learning process, but no system records this chain.

**Questions the user cannot answer today** (mapped to success criteria in §8):

| ID | Question |
|---|---|
| P1 | Where did I learn this? |
| P2 | What is the original source of this information and which exact excerpt supports it? |
| P3 | Which notes, highlights, and concepts are related to this subject? |
| P4 | What have I already learned about this subject and what do I not yet understand? |
| P5 | What do I need to review right now? |
| P6 | Which questions do I keep missing and why? |
| P7 | What documentation or evidence justifies this answer? |
| P8 | What have I captured that I have not yet read or processed? |

**Core problem:** Fragmentation of knowledge, provenance, and learning context.

### Affected Users
- **Individual learners & self-taught students:** Mastering technical literature, programming, and complex domains requiring synthesis across multiple sources.
- **Certification candidates:** Studying for high-stakes professional exams (e.g. cloud certifications, engineering exams) needing evidence-backed question practice directly tied to official documentation.
- **Researchers and knowledge workers:** Managing heterogeneous source materials (PDFs, papers, web pages, videos) needing bidirectional traceability between notes and primary sources.

---

## 3. Goals and Non-Goals (Product Boundaries)

### Goals

| ID | Goal |
|---|---|
| G-1 | Model all relevant knowledge as **typed Objects** with properties, free-form content, and relationships. |
| G-2 | Isolate knowledge contexts into **Spaces**. |
| G-3 | Preserve **granular provenance** (source + exact location) across the entire flow. |
| G-4 | Enable multiple **representations** (views, whiteboards) of the same Objects without duplicating them. |
| G-5 | Support **retention** (flashcards and spaced repetition) linked to the knowledge of origin. |
| G-6 | Support **practice and assessment** (questions and attempts) connected to concepts and evidence. |
| G-7 | Enable **traceable AI** over the graph, restricted to authorized context and always citing sources. |
| G-8 | Ensure **portability**: user knowledge MUST be exportable and importable in open formats. |
| G-9 | Provide **low-friction capture** and a triage workflow for captured material. |

### Non-Goals

| ID | Non-Goal | Rationale |
|---|---|---|
| NG-1 | Fully replicate Capacities, Heptabase, Obsidian, Readwise, Notion, RemNote, Anki, NotebookLM, StudyFetch, or ExamTopics. | The differentiator is the connection across stages, not feature parity. |
| NG-2 | Real-time collaboration in the initial scope. | Personal product first; collaboration changes the permissions model. |
| NG-3 | Host, distribute, or facilitate sharing third-party question banks, especially content that could be from real exams. | Copyright and certification non-disclosure agreements (`INV-8`, `INV-13`). |
| NG-4 | Generic chatbot disconnected from the graph. | AI only adds value when grounded and traceable (`G-7`). |
| NG-5 | Third-party plugin ecosystem in the MVP. | First stabilize the core; maintain only internal extension points (`R-EXT`). |
| NG-6 | Use Markdown files as mandatory canonical storage. | Markdown is an export requirement, not a persistence requirement (see `Q-15`). |
| NG-7 | AI media generation (podcasts, videos, slides) in the initial scope. | Outside the core of traceable knowledge. |

---

## 4. Glossary (Ubiquitous Language)

Single source of truth for project vocabulary. Format: **UI display name (PT-BR)** · `code_name (EN)`. The UI is in Portuguese (PT-BR); code, database, and API use the English name. Use these terms in code, schema, API, and UI; do not create synonyms. When a new term is approved, add it here.

### Account and Spaces

**Conta** · `Account`:  
Person who uses the app, identified by login. Each Account has its own Spaces; nothing is shared across Accounts.  
_Avoid_: user (in code), profile, workspace, team

**Space** · `Space`:  
A completely isolated knowledge context within an Account. Each Space has its own Types, Concepts, Collections, and Views. Objects from one Space never link to Objects in another.  
_Avoid_: Vault, Workspace, folder, project

**Mover** · `move`:  
Transfers an Object and its Dependents to another Space. Cross-space links are removed. Each Concept tagged on the Object is linked to the Concept of the same name or Synonym in the target Space or, if non-existent, created there without parents. All changes are previewed for confirmation.  
_Avoid_: copy, migrate, export/import

### Objects and Structure

**Objeto** · `Object`:  
Anything with its own identity in the app: Note, Concept, Highlight, Question, Source, or user-defined Object. Has title, Properties, content, and Links.  
_Avoid_: item, record, page, card

**Tipo** · `ObjectType`:  
Defines the structure of a set of Objects: their Properties, Templates, and default visualization. Includes built-in app Types (Note, Concept, Highlight, Question, PDF, Weblink, Video, Audio, Image, File, Table, Daily Note, Chat, Saved query) and user-defined Types (e.g., Book, Exam), matching Capacities. The user can convert an Object from one Type to another by mapping Properties.  
_Avoid_: category, class, database, template

**Campo** · `Property`:  
Structured data field defined on an ObjectType and populated on each Object (text, number, date, select, multi-select, checkbox, URL, relation to another Object). Built-in Types have fixed Properties and accept additional user-defined Properties.  
_Avoid_: property (in PT-BR UI), attribute, column, field

**Painel do Tipo** · `TypeDashboard`:  
Dedicated page for each ObjectType, identical to Capacities' Object Dashboard, with configurable sections: recent, without Concept, outside Collection, without Backlinks, Collections, and pinned Saved queries. Allows filtering, sorting, and grouping all Objects of that Type.  
_Avoid_: dashboard, type home, listing

**Template** · `Template`:  
Initial content and Properties applied when instantiating an Object of a given Type.  
_Avoid_: model, skeleton

**Dependente** · `Dependent`:  
An entity that lives inside an Object and cannot exist without it (e.g., Highlights belonging to a Source). Accompanies the parent Object on Move, Archive, and Trash. Objects merely linked via Relations are not Dependents.  
_Avoid_: child, subitem, related

**Arquivar** · `archive`:  
Removes an Object from active circulation without deleting it: leaves Review, Mock Exams, Inbox, and default Views, while retaining content, Links, and history. The recommended path for Questions no longer actively studied.  
_Avoid_: hide, deactivate, conceal

**Lixeira** · `Trash`:  
Destination for deleted entities along with their Dependents. Retained for 30 days before permanent purging. Deleting a Question also deletes its Attempts.  
_Avoid_: archive, archived

### Links

**Link** · `Link`:  
Connection from one Object to another, created via `@` or `[[ ]]` in content or via a relation Property, identical to Capacities. Represents a single underlying relation regardless of where it was created.  
_Avoid_: relation (in UI), connection, reference

**Backlink** · `Backlink`:  
List on an Object's page showing everything that points to it, displaying the text excerpt where the Link appears.  
_Avoid_: reverse link, references

**Referência de bloco** · `BlockReference`:  
Link or embed pointing to a specific block within another Object's content, created with `(( ))`, matching Capacities.  
_Avoid_: citation, transclusion

**Menção não linkada** · `UnlinkedMention`:  
Occurrence of an Object's title or Synonym in unlinked text, suggested for conversion into an active Link.  
_Avoid_: link suggestion

### Sources and Highlights

**Fonte** · `Source`:  
Group of built-in Types representing a raw content origin supporting Highlights: PDF, Weblink, Video, Audio, and Image. Not a single Type itself: each format has its own viewer and specific Properties.  
_Avoid_: document, material, reference

**Weblink** · `Weblink`:  
Source representing a web page, identified by URL, stored with a saved local snapshot.  
_Avoid_: link, URL, bookmark, article

**PDF** · `Pdf`:  
Source representing an uploaded PDF document, with a dedicated page reader; Highlights capture text or page regions.  
_Avoid_: document, file

**Imagem** · `Image`:  
Source representing an uploaded image, reusable across any Object, matching Capacities; Highlights mark image bounding regions.  
_Avoid_: photo, picture, attachment

**Áudio** · `Audio`:  
Source representing audio media (e.g., podcast, recording) accompanied by transcription; Highlights mark transcript excerpts and timestamps.  
_Avoid_: podcast (as type), recording

**Vídeo** · `Video`:  
Source representing video media (e.g., YouTube) accompanied by transcription; Highlights mark transcript excerpts and timestamps.  
_Avoid_: lecture, media

**Highlight** · `Highlight`:  
First-class Object, Dependent on a Source, marking an excerpt (text span, PDF region, or video timestamp range). Created by selecting content and clicking to highlight; visible overlaid on the Source and opens as an Object on double-click. User commentary resides directly in the Highlight's content. Always allows jumping back to the source location.  
_Avoid_: excerpt, annotation, marker

**Extensão** · `BrowserExtension`:  
Browser extension, identical in function to Readwise Reader: saves pages as Weblinks to the Inbox and allows highlighting text and images directly on external sites, with Highlights appearing in the app.  
_Avoid_: clipper, web clipper, plugin

### Knowledge

**Conceito** · `Concept`:  
Subject matter the user wants to understand (e.g., OAuth 2.0). Functions as a tag with a dedicated page: can tag any Object, and its page gathers notes written on the topic, custom Properties (by default, Status: Not Started, Learning, Mastered; the user may add others), and everything tagged with it or its descendants. The sole tagging mechanism: separate tags do not exist.  
_Avoid_: Tag, topic, subject, category, MOC

**Conceito pai / Conceito filho** · `broader` / `narrower`:  
Hierarchical relationship between Concepts (SKOS model): broader is parent, narrower is child. A Concept MAY have multiple parents; cycles MUST NOT occur.  
_Avoid_: category, folder, subtag

**Conceito relacionado** · `related`:  
Non-hierarchical associative relationship between two Concepts. MUST NOT be used between Concepts already connected hierarchically.  
_Avoid_: link, connection, associated

**Sinônimo** · `altLabel`:  
Alternative label for a Concept, used in search and autocompletion when tagging (e.g., "OAuth2" for "OAuth 2.0").  
_Avoid_: alias, nickname

**Nota** · `Note`:  
Free-form writing Object, identical to Capacities' Page: title, content, and Concepts, without fixed Properties. To gain custom Properties, it is converted into a user-defined ObjectType.  
_Avoid_: page, document, annotation

**Arquivo** · `File`:  
Object storing generic uploaded files (e.g., .zip, .docx), matching Capacities' Files, linkable and taggable with Concepts. Does not accept Highlights.  
_Avoid_: attachment, upload, document

**Tabela** · `Table`:  
Structured data arranged in rows and columns, used inline as a content block or as a standalone Object, matching Capacities.  
_Avoid_: spreadsheet, grid, database

**Diário** · `DailyNote`:  
Object automatically provisioned for each calendar day within a Space, matching Capacities, intended for rapid ephemeral logging.  
_Avoid_: journal, day note

### Study and Practice

**Questão** · `Question`:  
Single unified Object for active recall and practice. Formats: Q&A, cloze (fill-in-the-blank), and multiple choice. Used in two modes: Review and Mock Exam. Created standalone, extracted from selected excerpts, via `/questão` inline inside any Object, imported in bulk via file, or generated by agents via MCP; retains origin links when derived.  
_Avoid_: Flashcard, card, item, exercise

**Explicação** · `Explanation`:  
Component of a Question providing rationale for the correct answer. Freely blends user explanation, Highlights linked as "proven by", and Answers with explicit origin.  
_Avoid_: Evidence, rationale, commentary

**Resposta com origem** · `Answer`:  
An answer option or response to a Question tagged with its provenance: official, suggested, community, user, or AI. Community answers can include votes and discussion threads inserted manually or via file; the app does not scrape external sites.  
_Avoid_: answer key, solution

**Revisão** · `Review`:  
Spaced memorization mode: the app schedules Questions nearing forgetting (FSRS algorithm). After revealing the answer, the user selects Forgot, Earlier, Normal, or Later, with each button showing the scheduled interval; "Forgot" logs a failure.  
_Avoid_: study, daily review, flashcards

**Simulado** · `MockExam`:  
Exam simulation mode: Questions filtered by criteria, answered sequentially, optionally timed, with a final score. Configurable formats (default: multiple choice only); open formats without automatic grading are self-assessed.  
_Avoid_: test, exam, quiz, Simulation

**Tentativa** · `Attempt`:  
Append-only immutable record of each answer submitted to a Question in Review or Mock Exam. Forms a single unified history; failing a Question during a Mock Exam accelerates its next Review appearance.  
_Avoid_: review log, response, history

**Plano de prova** · `ExamPlan`:  
Target exam date configured on an Exam Object or Saved query, matching RemNote's Exam Scheduler. Review mode prioritizes these Questions, paces new items to complete before the deadline, triggers a full review wave in the final days, and alerts if falling behind schedule.  
_Avoid_: cram, study schedule, syllabus

**Limite diário** · `DailyLimit`:  
Upper threshold on new Questions and daily reviews, along with target retention rate (e.g., 90%), matching Anki deck options and FSRS parameters.  
_Avoid_: goal, quota

**Questão difícil** · `Leech`:  
Question automatically flagged after repeated failures (default: 8 "Forgot" ratings), matching Anki leeches. Highlighted on dashboards for reformulation, splitting, or archiving.  
_Avoid_: leech (in PT-BR UI), problem card

**Painel de progresso** · `ProgressDashboard`:  
Analytics view for the Space: accuracy per Concept (and ancestors), review forecast, Exam Plan pacing, and study streaks.  
_Avoid_: report, analytics, metrics

### Organization and Views

**Filtro salvo** · `Query`:  
Declarative rules selecting Objects within a Space (by Type, Properties, Concepts, full-text). A first-class Object: can be linked, embedded, and contextualized (e.g., "Questions testing `this`" inside a Concept template).  
_Avoid_: saved search, smart folder, query (in PT-BR UI)

**Collection** · `Collection`:  
Manually curated grouping of Objects sharing the same Type, identical to Capacities: the user hand-picks each member (e.g., "Questions to review before the exam"). An Object MAY belong to multiple Collections. Viewable in any layout and embeddable within other Objects. Displays on the Type Dashboard. Use Saved queries for rule-based membership; use Collections for curated sets.  
_Avoid_: folder, list, collection (in code)

**View** · `View`:  
Visual presentation format for a collection of Objects, matching Capacities: Table, Gallery, Wall, List, Kanban, and Embed. Never stores internal state or separate data.  
_Avoid_: layout, base

**Quadro** · `Whiteboard`:  
Infinite canvas where users position and visually link existing Objects (Heptabase, Obsidian Canvas). Canvas nodes reference real Objects, never detached duplicates.  
_Avoid_: canvas, board, mural

**Mapa mental** · `MindMap`:  
Visualization mapping an Object's heading outline into a tree structure, toggleable with document text (Brainio).  
_Avoid_: mind map, diagram, tree

**Grafo local** · `LocalGraph`:  
Visual graph of connections centered on the currently opened Object, matching Capacities. A whole-space global graph is intentionally omitted.  
_Avoid_: Graph View, full graph, map

**Busca** · `Search`:  
Full-text search across titles, body content, Highlights, indexed PDFs, and web snapshots within the active Space, recognizing Concept Synonyms and filtering by Type and Concept.  
_Avoid_: find, search (in PT-BR UI)

**Calendário** · `CalendarView`:  
View mapping Objects onto dates (Daily Notes, Exam dates, scheduled reviews), matching Notion and Capacities.  
_Avoid_: schedule, timeline

**Histórico de versões** · `VersionHistory`:  
Previous revisions of Object content, enabling comparison and restoration, matching Capacities and Obsidian File Recovery.  
_Avoid_: backup, snapshot, undo

**Favoritos** · `Pin`:  
Objects, Saved queries, and Views pinned to the sidebar for instant access, matching Obsidian Bookmarks.  
_Avoid_: star, shortcut, bookmark

**Paleta de comandos** · `CommandPalette`:  
Keyboard-invoked modal (Ctrl/Cmd+K) to navigate to any Object and trigger actions, matching Obsidian, Capacities, and Reader.  
_Avoid_: quick open, command menu

**Painel lateral** · `SidePanel`:  
Splits the screen to view an Object alongside the active document, with hover previews on Links, matching Capacities, Notion side peek, and Obsidian page preview.  
_Avoid_: split, popup, modal

### Triage and AI

**Inbox** · `Inbox`:  
Central triage hub for a Space, containing tabs **To read** (saved, unprocessed Sources) and **Pending approval** (agent-generated Objects awaiting review).  
_Avoid_: incoming, queue, notifications

**Para aprovar** · `pendingApproval`:  
Lifecycle state for an Object created by an agent (MCP or AI) that has not yet been accepted by the user. Excluded from Review, Mock Exams, and graph Links until approved, edited, or rejected. Enabled by default for agents; can be toggled off.  
_Avoid_: draft, suggestion, pending

**Chat** · `Chat`:  
AI conversation grounded in the current Space or an explicit selection of its Objects. Every response cites specific Objects and source excerpts. Can be saved as a permanent Object, matching Capacities AI Chat.  
_Avoid_: assistant, bot, copilot

**Ação de IA** · `AiAction`:  
Contextual AI invocation executed over selected text or an Object (explain, summarize, generate Questions), matching Readwise Ghostreader. Always cites origin; created Objects enter Pending approval.  
_Avoid_: prompt, command, AI tool

---

## 5. Conceptual Model

```text
Space
 ├── Object Type ──< Property Definition (stored | computed)
 │        ├──< Template
 │        └──< Object ──< Property Value
 │                 ├── Content ──< Block
 │                 └──< Relation (type, from → to [, block]) >── Object
 ├── Query (filters, formulas, summaries, this?) ──< View (layout)
 ├── Whiteboard ──< Placement (object_ref, x, y, size)
 │             ──< Section
 │             ──< Edge (visual | relation_ref)
 └── Scheduler

Source ──< Source Snapshot
       ──< Locator ──< Selector
                  ──< Highlight

Question ──< Card ──< Attempt (append-only, Review and Mock Exam)
Question ──< Answer
```

**Principles:**
- ObjectType defines the structure; Object holds values and content.
- Views and Whiteboards only reference Objects.
- A relation-type Property and its corresponding Relation are the **same single record** (`INV-10`).
- Question holds content; Card holds scheduling state; Attempt holds history (Review and Mock Exam combined).

### Criterion for a Native Type

A type **MUST** be native only if it requires at least one of these behaviors:

1. Anchoring to a media location (Locator).
2. Dedicated scheduling or algorithm (spaced repetition).
3. Transactional lifecycle (answering, grading, scoring).
4. External capture or import integration.
5. System-guaranteed uniqueness or temporal semantics (e.g., one Daily Note per day).

Otherwise, it **SHOULD** be a Custom Object Type.

### Candidate Native Object Types

| Type | Behavior justifying native implementation | Proposed Phase |
|---|---|---|
| Note | Default free-form writing type, identical to Capacities' Page; does not receive custom properties. | 0 |
| Daily Note | One per day; rapid capture, matching Capacities. | 1 |
| Weblink (Source) | Capture, snapshot, reading progress/status, text span Locators. | 1 |
| Image (Source) | Upload, reuse, region Highlights. | 1 |
| Audio (Source) | Player, transcription, timestamp Locators. | 2 |
| File | Generic file upload, linkable and taggable. | 1 |
| Table | Tabular data in rows and columns, as block or standalone Object. | 2 |
| Saved Chat | AI conversation stored as an Object. | 5 |
| Saved Query | Query as an Object, linkable and embeddable. | 2 |
| PDF (Source) | Page reader, page and region Locators. | 1 |
| Video (Source) | Player, transcription, timestamp Locators. | 6 |
| Highlight | Anchoring to Locator; navigation back to source. | 1 |
| Concept | Automatic aggregation of learning relationships. | 1 |
| Card / Attempt | Scheduling and single answer history (internal entities, not necessarily user-facing Objects). | 3 |
| Question / Answer | Formats, spaced repetition, mock exams, answer provenance and votes. | 3 |
| Attempt | Results and error analysis. | 4 |
| Simulation | Stopwatch, scoring, question composition. | 4 |

Examples of Custom Object Types: Book, Course, Technology, Research Paper, Person, Project, Podcast, Exam.

---

## 6. Invariants

Rules that **no** implementation may violate. Changing an invariant requires a new decision in §13.

| ID | Invariant | Rationale |
|---|---|---|
| INV-1 | Every Object MUST belong to exactly one Space. Objects, Relations, search, and AI context **MUST NOT** cross Spaces. | Personal and professional contexts must never leak between each other (D-1). |
| INV-2 | An Object **MUST NOT** be duplicated to appear in Views, Whiteboards, Embeds, or search results. | Prevents diverging, parallel sources of truth. |
| INV-3 | Views and Whiteboards **MUST NOT** be data sources; editing an Object through any representation modifies the same Object. | Strict separation between data and presentation. |
| INV-4 | Every Highlight **MUST** reference a Source and a Locator. Every derived Object **MUST** maintain a `derivedFrom` relation with its origin. | Provenance is the product core (`G-3`). |
| INV-5 | Custom Object Types and Property Definitions **MUST** be creatable and editable without deployment or manual database migrations. Changing an Object's type **MUST NOT** lose data without explicit confirmation. | The user models their own domain. |
| INV-6 | AI-generated content **MUST** be explicitly labeled and record its **generation provenance** (model, prompt instruction, context Objects, timestamp). | Trust and auditability (`G-7`). |
| INV-7 | All user-created knowledge **MUST** be exportable in an open, documented format. | Portability (`G-8`). |
| INV-8 | Third-party content **MUST NOT** be presumed redistributable; storing excerpts for personal use is permitted, publishing or sharing is not. | Copyright protection. |
| INV-9 | Every Answer **MUST** record its provenance (`official`, `suggested`, `community`, `user`, `ai`). | Distinguishes reliability. |
| INV-10 | Relations **MUST** maintain a single underlying record, whether edited via Property, inline Link in Content, or Whiteboard edge. | Prevents divergence across representations. |
| INV-11 | Attempts and Review logs **MUST** be append-only; corrections produce new records. | Allows recomputing schedules, optimizing parameters, and switching algorithms without losing history. |
| INV-12 | AI suggestions (relations, Concepts, flashcards) **MUST NOT** be applied to the graph without user acceptance, unless explicitly configured otherwise. | The knowledge graph reflects user understanding, not AI hallucinations. |
| INV-13 | The system **MUST NOT** offer sharing or publishing capabilities for third-party imported Questions. | Compliance with exam non-disclosure agreements and copyright. |

---

## 7. Requirements and Acceptance Criteria

Format: *Given / When / Then*. Every criterion **MUST** be verifiable via automated testing.

### R-SPACE — Spaces
- **Given** two Spaces A and B, **when** searching for a term in A, **then** no results from B appear.
- **Given** an Object in A, **when** attempting to create a Relation, Link, or Embed pointing to an Object in B, **then** the operation is rejected.
- **Given** an Object in A with Relations to other Objects in A, **when** moving it to B, **then** it and its Dependents move to B, and the system lists upfront which Relations will be removed, requiring user confirmation.
- **Given** a Note tagged with Concept "OAuth 2.0" in Space A, **when** moving it to B, **then** it links to a Concept of the same name or Synonym in B or, if non-existent, the Concept is created in B without parents; the preview displays this before confirmation.
- **Given** a Question, **when** archiving it, **then** it leaves Review, Mock Exams, and default Views, while retaining content, Links, and Attempts.
- **Given** two Accounts, **when** one executes any query, **then** it never sees data belonging to the other.
- **Given** Objects of the same Type, **when** adding them to a Collection, **then** the Collection appears on the Type Dashboard and can be rendered in any View or embedded in another Object.
- **Given** an Object of a different Type, **when** attempting to add it to that Collection, **then** the operation is rejected.
- **Given** an Object with Dependents, **when** deleting it, **then** it and its Dependents move to the Trash, restorable for 30 days; merely related Objects remain intact and lose the Relation.
- **Given** an ObjectType with existing Objects, **when** deleting the ObjectType, **then** the user is presented with a summary of everything that will be deleted.

### R-TYPE — Object Types, Properties, and Templates
- **Given** a Space, **when** creating Custom Object Type `Book` with Properties `Author`, `Status`, and `Rating`, **then** the user can instantiate `Book` Objects immediately without deployment.
- **Given** an ObjectType with existing Objects, **when** adding a Property Definition, **then** existing Objects display it as empty without data loss.
- **Given** an Object of type `Note`, **when** converting it to `Concept`, **then** a source→target property mapping interface is presented and no values are discarded without confirmation.
- **Given** a relation Property `Author → Person` marked bidirectional, **when** populating it on a Book, **then** Person displays the Book in its inverse property, backed by a single Relation record.
- **Given** a Computed Property `accuracy` on Concept, **when** a related Attempt is completed, **then** the value is recomputed.
- **Given** an ObjectType with a default Template, **when** creating an Object of that type, **then** initial Content and Properties from the Template are applied.

### R-NAV — Navigation and Content Safety
- **Given** any screen, **when** pressing Ctrl/Cmd+K, **then** the Command Palette opens, allowing navigation to any Object or action execution.
- **Given** a Link, **when** hovering over it, **then** a preview appears; **and** it can be opened in the Side Panel.
- **Given** an edited Object, **when** opening Version History, **then** previous versions can be compared and restored.
- **Given** an Object, Saved query, or View, **when** pinning it, **then** it appears in sidebar Pins.
- **Given** selected text in a Note, **when** selecting "extract", **then** it converts into a new Object and is replaced by a Link pointing to it.

### R-SEARCH — Search
- **Given** a saved PDF containing "PKCE", **when** searching for "PKCE", **then** the PDF appears with the matching text excerpt highlighted.
- **Given** the Synonym "OAuth2", **when** searching for "OAuth2", **then** Concept "OAuth 2.0" and all items tagged with it appear.
- **Given** two Spaces, **when** searching, **then** only results from the current active Space appear.

### R-CONCEPT — Concepts
- **Given** any Object, **when** tagging it with Concept "OAuth 2.0", **then** it appears on the Concept page.
- **Given** Concept "PKCE" with broader parent "OAuth 2.0", **when** opening "OAuth 2.0", **then** items tagged with "PKCE" appear, marked as originating from the child Concept.
- **Given** a Concept without parents, **when** using it, **then** no hierarchy is enforced.
- **Given** "PKCE", **when** setting "OAuth 2.0" and "Mobile Security" as parents, **then** PKCE appears on both pages without duplication.
- **Given** Concept A as parent of B, **when** attempting to make B parent of A, **then** the operation is rejected (cycle prevention).
- **Given** Concept A as parent of B, **when** attempting to mark A and B as related, **then** the system warns that they are already linked hierarchically.
- **Given** Synonym "OAuth2" on "OAuth 2.0", **when** typing "OAuth2" while tagging an Object, **then** Concept "OAuth 2.0" is suggested.

### R-LINK — Relations, Backlinks, and Blocks
- **Given** `Question —tests→ Concept`, **when** opening the Concept, **then** the Question appears in backlinks with Relation Type `tests` and the source block context.
- **Given** a link pointing to a Block in another Note, **when** the target Block is moved or edited, **then** the link continues to resolve (stable block ID).
- **Given** an Embed of an Object, **when** editing the source Object, **then** the Embed reflects the change immediately.
- **Given** an unlinked textual mention of an Object's title or alias, **when** opening that Object, **then** the mention appears under *Unlinked Mentions* with an option to convert to an active Link.

### R-CAPTURE — Capture and Triage
- **Given** a web page, **when** capturing it, **then** a Source is created in the Inbox with URL, title, author, date, snapshot, and Properties populated by the matching Capture Template.
- **Given** an open browser page with the Browser Extension active, **when** highlighting text on the page, **then** the page is saved as a Weblink (if not already captured) and the Highlight appears in the app.
- **Given** a previously captured URL, **when** capturing it again, **then** the system reuses the existing Source instead of creating duplicates.
- **Given** Sources in the Inbox, **when** triaging them, **then** they can be categorized into `later`, `reading`, `archived`, displaying reading progress.
- **Given** a video with captions or a podcast, **when** importing it, **then** the timestamped transcript is stored as a snapshot.

### R-PROV — Provenance
- **Given** a Highlight in a PDF (text or rectangular region), **when** clicking "go to source", **then** the PDF opens at the exact page and coordinate position.
- **Given** a Highlight on a web page whose HTML mutated, **when** opening the Highlight, **then** it re-anchors via text quote selectors (prefix/suffix) or is flagged as "orphaned", never silently lost.
- **Given** a Highlight on a video, **when** clicking it, **then** video playback starts at the starting timestamp.
- **Given** an open Source, **when** selecting text and clicking highlight, **then** a Highlight Object is created and rendered overlaid on the content; **and** user commentary is saved in the Highlight's Content.
- **Given** an open Source, **when** double-clicking a Highlight overlaid on the content, **then** the Highlight Object opens; **and** navigation back to the exact passage is available.
- **Given** a Question created from a Highlight, **when** opening the Question, **then** the original Source is reachable in at most 2 navigations.

### R-VIEW — Queries and Views
- **Given** an Object displayed across two Views, **when** modifying a Property in one View, **then** the second View reflects the update without manual refresh.
- **Given** a contextual Query embedded inside a Concept template ("Questions testing `this`"), **when** viewing any Concept, **then** the query list displays only Questions related to that specific Concept.
- **Given** a Query configured with global filters and view-specific filters, **when** switching Views, **then** only view-specific filters change.
- **Given** a Query, **when** exporting the Space, **then** its definition serializes into a declarative, human-readable format.

### R-SRS — Retention
- **Given** a bidirectional Question, **when** creating it, **then** two sibling Cards are generated and do not appear in the same study session by default.
- **Given** any Object, **when** typing `/questão` in content, **then** a Question is created, embedded inline, and linked to the source Object.
- **Given** selected text in a Highlight, Note, or Source, **when** choosing "create flashcard", **then** a Question is instantiated with the excerpt as origin.
- **Given** the Question list, **when** creating a standalone Question, **then** it exists without an origin reference.
- **Given** a cloze deletion within a Note Block, **when** marking it as flashcard, **then** the Question maintains a `derivedFrom` relation to the Block.
- **Given** due Cards, **when** opening the review queue, **then** only due Cards within the selected scope (Space, Concept, or Query) appear, prioritized by the Scheduler.
- **Given** a Question during Review, **when** revealing the answer, **then** the user selects Forgot, Earlier, Normal, or Later, each displaying the next interval; "Forgot" logs a failure, while the others log success.
- **Given** Attempt history, **when** modifying the Scheduler algorithm or parameters, **then** Card states are recomputed from the log without data loss.

### R-STUDY-PLAN — Exam Plan, Limits, and Difficulty
- **Given** an Exam Object with target date and associated Concepts, **when** activating the Exam Plan, **then** Review mode prioritizes these Questions, paces new items to finish before the date, and schedules a final review wave in the closing days.
- **Given** an Exam Plan behind schedule, **when** opening Review, **then** an alert is displayed with adjusted daily targets to catch up.
- **Given** configured Daily Limits, **when** opening Review, **then** the session never delivers more new Questions or reviews than the configured caps.
- **Given** a Question with 8 "Forgot" ratings, **when** failing it again, **then** it is flagged as a Leech and highlighted on the Progress Dashboard.
- **Given** a cloze Question with multiple deletions, **when** reviewing it, **then** each deletion reviews independently, and deletions from the same Question do not appear on the same day.

### R-PROGRESS — Progress Dashboard
- **Given** logged Attempts, **when** opening the Progress Dashboard, **then** accuracy per Concept and ancestors is displayed (color scale green to red), along with forecasted reviews and study streaks.

### R-RESURFACE — Highlight Resurfacing
- **Given** past Highlights, **when** opening daily review, **then** a configurable sample is presented with options to convert into Question, Note, or Concept.

### R-ASSESS — Assessment
- **Given** an incorrect Attempt, **when** opening its analysis, **then** the Question, tested Concepts, Explanation, and exact Source excerpt are shown.
- **Given** a Question with a `suggested` Answer diverging from the most upvoted `community` Answer, **when** rendered, **then** the discrepancy is flagged.
- **Given** a Question marked as outdated (e.g., certification blueprint revision), **when** generating a Mock Exam, **then** it is excluded by default.
- **Given** any filter of Questions (e.g., Concepts under Exam AZ-204, or missed in the last month), **when** creating a Mock Exam from it, **then** the Mock Exam uses the resulting Questions.
- **Given** a new Mock Exam, **when** configuring it, **then** the user selects eligible Question formats (default: multiple choice only); open formats are self-assessed.
- **Given** a Mock Exam, **when** configuring it, **then** the user toggles between Exam mode (score revealed only at the end) and Practice mode (answer revealed after each Question).
- **Given** an active Mock Exam, **when** flagging a Question for review, **then** the user can revisit it before submitting.
- **Given** an Attempt, **when** answering, **then** the user can record subjective confidence (e.g., guessed / uncertain / confident), used in mistake analysis.

### R-AI — AI Grounding and Actions
- **Given** a prompt submitted to AI, **when** it answers, **then** every factual claim cites at least one Object or Locator from context, or explicitly states that evidence is lacking.
- **Given** a Space, **when** selecting a subset of Sources/Objects, **then** AI uses only that specified subset as context.
- **Given** an Object created by AI, **when** displayed, **then** it carries an `ai` provenance tag and displays the prompt instruction, model identifier, and context Objects.
- **Given** an incorrect Attempt, **when** requesting "explain", **then** the AI explanation cites Highlights and Sources from the active Space.
- **Given** selected text, **when** triggering an AI Action (explain, summarize, generate Questions), **then** results cite the text, and generated Objects enter Pending approval.
- **Given** a Chat response, **when** selecting "save as Note", **then** a Note is created with citations preserved.
- **Given** a PDF, **when** running the AI Action "extract Properties", **then** fields such as author and publication year are suggested and placed in Pending approval.
- **Given** AI-suggested relations or Concepts, **when** generated, **then** they remain pending until user approval (`INV-12`).

### R-EXPORT — Portability
- **Given** a Space, **when** exporting, **then** the user receives Markdown with YAML frontmatter (Content + Properties), JSON files for ObjectTypes, Relations, Queries, and Views, Whiteboards in JSON Canvas, and annotations in W3C Web Annotation, such that re-importing produces an equivalent Space.
- **Given** Questions, **when** exporting to Anki, **then** an importable package is generated, preserving fields and review logs where feasible.

### R-IMPORT — Import (Deferred to Phase 6)
- **Given** an Obsidian vault, **when** importing, **then** Notes, Properties, links, and backlinks are preserved.
- **Given** a Readwise account, **when** syncing, **then** Sources and Highlights are imported idempotently without duplicate records on repeated syncs, and local edits are not overwritten without warning.
- **Given** an Anki CSV/APKG package, **when** importing, **then** Questions and Cards are instantiated, preserving review history when available.

### R-QUESTAO-ENTRADA — Question Ingestion
- **Given** a file containing Questions (e.g., CSV), **when** importing it, **then** Questions are created in the current Space with provenance `import`.
- **Given** an external agent connected via MCP, **when** it creates Questions, **then** they enter the authorized Space with provenance recorded and remain in **Pending approval**, excluded from Review and Mock Exams until approved.
- **Given** that the user toggled off agent approval, **when** an agent creates Questions, **then** they enter directly.
- **Given** a user-imported file, **when** import completes, **then** Questions enter directly without requiring approval.

### R-EXT — Internal Extensibility and Agent Access
- The core engine **SHOULD** emit domain events (`object.created`, `relation.created`, `highlight.created`, `attempt.logged`…) allowing new capabilities to attach without modifying the core.
- The system **SHOULD** expose an API (and eventually an MCP server) with reads and writes scoped by Space and subject to the same invariants as the UI.

---

## 8. Success Criteria

| Question (§2) | Verifiable Criterion |
|---|---|
| P1, P2 | From any Note, Concept, or Question, the original Source and Locator are reachable in ≤ 2 navigations. |
| P3 | A Concept page automatically lists, via contextual Queries, related Sources, Highlights, Notes, and Questions. |
| P4 | Concepts maintain learning status and Computed Properties (accuracy, retention) queryable via Query. |
| P5 | A due review queue exists per scope (Space, Concept, Query). |
| P6 | An aggregated error view exists per Concept and ancestors (e.g., topic → domain → Exam), incorporating recorded confidence. |
| P7 | Every answered Question can display its Explanation and the provenance of each Answer (`INV-9`). |
| P8 | The Inbox displays unprocessed Sources and overall reading progress. |

Initial non-functional targets (to validate via prototype):
- Full-text search p95 latency < 300 ms across a Space containing 50,000 Objects and 200,000 Relations.
- Opening an Object with 500 backlinks p95 latency < 500 ms.
- Web Highlight re-anchoring resilience after page mutations: ≥ 95% success rate in benchmark test suite.

---

## 9. Phased Plan

A phase begins only when the exit criteria of the preceding phase are fulfilled. Every phase **MUST** have its own dedicated `SPEC.md` before implementation starts.

| Phase | Scope | Exit Criteria |
|---|---|---|
| **0 — Foundation** | Account and login, Space, Type Dashboard, Command Palette, Pins, ObjectType (native and custom), System Properties, Property Definition/Value, Templates, type conversion, Object, block Content, typed Relation, Backlinks, full-text search, export. | R-SPACE, R-TYPE (except Computed), R-LINK (except Unlinked Mentions), R-EXPORT (Markdown + JSON). |
| **1 — Capture & Provenance** | Inbox, Daily Note, Source + Snapshot, Capture Templates, Locator (web and PDF, text and region), Highlight, Concept, Note; web capture; Unlinked Mentions; Browser Extension; Image and File; Side Panel and Link previews; Object outline. | R-CAPTURE, R-PROV (web, PDF, image). |
| **2 — Queries & Views** | Query with filters/formulas/summaries, contextual Queries, Computed Properties, Views Table, Gallery, Wall, List, Kanban, and Embed; Video (YouTube with transcript), Audio with transcript, Table, EPUB; Calendar View; Version History; extract excerpt to new Object. | R-VIEW, full R-TYPE, R-PROV (video). |
| **3 — Retention** | Question, Card, Card Kinds, Attempt history, Scheduler (FSRS), queues by scope, Resurfacing, Daily Limits, Leeches, multiple clozes, Progress Dashboard. | R-SRS, R-RESURFACE, R-PROGRESS, R-STUDY-PLAN (limits and difficulty). |
| **4 — Assessment** | Mock Exam created from any filter, Answer, Explanation, Mistake Graph; custom ObjectType "Exam" with domains and topics as Concepts; Exam Plan, exam/practice modes, flag for review. | R-ASSESS, R-STUDY-PLAN (Exam Plan). |
| **5 — AI & Agents** | Full-text and semantic retrieval over authorized context, cited responses, pending suggestions, Question generation marked `ai`, save Chat response as Note, AI extracting Properties, API and MCP server for agents, Pending approval workflow. | R-AI, R-EXT, R-QUESTAO-ENTRADA. |
| **6 — Expansions** | Whiteboard (Sections, JSON Canvas), Mind Map, Local Graph, import from other apps (Obsidian, Anki, Readwise, Capacities), external extensions API. | Defined via decision in §13. |

**MVP:** Phases 0 through 2.

---

### 9.1 Backlog (Post-Phase 6, No Immediate Commitment)

Ideas observed across product references, captured to avoid loss. Added to active planning only via new explicit decisions.

| Idea | Reference |
|---|---|
| RSS feeds and email newsletters inside Inbox | Readwise Reader |
| Text-to-speech audio reading | Readwise Reader |
| In-browser lecture recording with real-time transcription | StudyFetch, Obsidian Audio Recorder |
| Handwritten notes photo capture with OCR | StudyFetch |
| Image occlusion in Questions | Anki, RemNote |
| Optional tasks (opt-in), linked with Daily Notes and Calendar | Capacities, Heptabase |
| Presentation mode generated from a Note | Capacities, Obsidian Slides |
| Random note rediscovery | Obsidian Random Note |
| Chart and Timeline views | Notion |
| Mobile messenger capture (WhatsApp / Telegram) | Capacities |
| Canvas inspector showing which Whiteboards reference an Object | Heptabase |

---

## 10. General Constraints

| Area | Constraint |
|---|---|
| Privacy | Personal knowledge may contain sensitive data; data **MUST NOT** be forwarded to external AI providers without explicit per-Space opt-in consent. |
| Performance | The data model MUST sustain large volumes of Objects and Relations (targets in §8). |
| Platform | Browser only (web application), online. Native desktop, mobile apps, and offline mode are out of current scope. |
| Collaboration | Out of initial scope (`NG-2`), but the schema MUST NOT preclude future multi-user support (e.g., stable global UUIDs). |
| Extensibility | Avoid tight coupling preventing new Views, integrations, or native types. |
| Integrations | External sync mechanisms **MUST** be idempotent and **MUST NOT** overwrite local user edits without warning. |

---

## 11. Decisions & Open Questions

Status: all **Decided**. Questions not addressed via direct user interviews were resolved by baseline recommendations (revisable). Names in the Question column may reflect historical terms; canonical vocabulary is established in §4.

| ID | Question | Proposal | Status | Blocking |
|---|---|---|---|---|
| Q-1 | Which Native Object Types enter the MVP? | Note, Daily Note, Source, Highlight, Concept (§5). | Decided | — |
| Q-2 | Which types should be custom? | All types not meeting criteria in §5. | Decided | — |
| Q-3 | Do Native Object Types accept Custom Properties? | Yes; native properties are fixed, custom properties are additive. | Decided | — |
| Q-4 | What initial Property Types? | Text, number, date, select, multi-select, checkbox, URL, relation; computed in phase 2. | Decided | — |
| Q-5 | Are Relations typed and bidirectional? | Typed and directed with inverse label; computed backlinks; single record (`INV-10`). | Decided | — |
| Q-6 | Can Objects appear in multiple Views/Whiteboards? | Yes, by reference (`INV-2`). | Decided | — |
| Q-7 | Whiteboard and Mind Map in MVP? | No. Structured Views first (phase 2); Whiteboard and Mind Map later (phase 6) over same Objects. | Decided | — |
| Q-8 | Structured Views in MVP? | Yes; phase 2. | Decided | — |
| Q-9 | Formal distinction between Object Type, Concept, Collection, View, Base, and Whiteboard? | See Glossary; "Base" = Query with multiple Views; Collection is manual-only. | Decided | — |
| Q-10 | Does every Object belong to exactly one Space? | Yes. | Decided (D-1) | — |
| Q-11 | Are Object Types local to each Space? | Yes, as are Concepts and Collections. | Decided (D-1) | — |
| Q-12 | Cross-space relations? | Prohibited. | Decided (D-1) | — |
| Q-13 | Cross-space search? | Prohibited; search operates strictly within one Space. | Decided (D-1) | — |
| Q-14 | Storage: files, database, or hybrid? | Server-side database as source of truth + export to files. | Decided | — |
| Q-15 | Role of Markdown? | Export and interoperability format, not canonical storage. | Decided | — |
| Q-16 | Properties stored separately from Content? | Yes, to facilitate performant Queries. | Decided | — |
| Q-17 | How to anchor locations across PDF, web, and video? | Locators using multiple Selectors under W3C Web Annotation model: text quote + position; PDF page + rect; media timestamp range over transcript. | Decided | — |
| Q-18 | Do Highlights generate Notes, Concepts, or Questions? | Yes, always retaining `derivedFrom` (`INV-4`). | Decided | — |
| Q-19 | Backlinks and Unlinked Mentions in MVP? | Backlinks in phase 0; Unlinked Mentions in phase 1. | Decided | — |
| Q-20 | Graph View in MVP? | Local Graph only (around active Object), matching Capacities; no whole-space global graph. Phase 6. | Decided | — |
| Q-21 | Semantic search in MVP? | No; phase 5. | Decided | — |
| Q-22 | Future plugin architecture? | Domain events now (`R-EXT`); public API later via §13 decision. | Decided | — |
| Q-23 | How to represent certification preparation? | No specialized feature; matching Capacities: Exam is user ObjectType (date, pass mark, syllabus version), domains and topics are Concepts, queried via Views. Mock Exams generated from any filter. | Decided | — |
| Q-24 | How to distinguish official, community, and AI answers? | Answer with mandatory provenance (`INV-9`) and optional vote distributions. | Decided | — |
| Q-25 | Are Questions native or derived? | Native, instantiating Cards; can originate inline in Note Block (cloze) or as standalone Object. | Decided | — |
| Q-26 | Are Questions, Attempts, and Simulations native? | Yes (§5). | Decided | — |
| Q-27 | Mistake Graph in MVP? | No; phase 4. | Decided | — |
| Q-28 | Which integrations to prioritize? | Browser Extension (phase 1) and MCP (phase 5). Third-party imports (Obsidian, Anki, Readwise, Capacities) deferred; export guaranteed. | Decided | — |
| Q-29 | Offline / local-first support? | No. Web app, online. | Decided | — |
| Q-30 | Complete export specification? | See R-EXPORT and Appendix C. | Decided | — |
| Q-31 | Are Queries and Views first-class Objects (linkable, embeddable)? | Yes: allows Queries in Templates and Content. | Decided | — |
| Q-32 | Can Whiteboards have non-Object nodes (free text, groups)? | Sections and labels only; any substantive text becomes a Note. | Decided | — |
| Q-33 | Default Scheduler and granularity? | FSRS via open-source library; one default per Space with per-Query overrides. | Decided | — |
| Q-34 | Does Source Snapshot store full third-party content? | Yes for personal use, never redistributable (`INV-8`); user can delete snapshot while retaining Highlights. | Decided | — |
| Q-35 | Highlight Resurfacing in MVP? | No; phase 3, with retention. | Decided | — |
| Q-36 | How do Questions enter the app? | Manually (standalone, from excerpt, or `/questão`), bulk file import, and agents via MCP. No web scraping; provenance mandatory (`INV-13`). | Decided | — |
| Q-37 | How to move content across Spaces? | Native "Move" operation with Dependents; cross-space Relations stripped with warning. | Decided | — |
| Q-38 | What constitutes an Object Dependent? | Matching Capacities: only entities living inside the Object; deletions move to Trash (30 days). | Decided | — |
| Q-39 | Is Highlight a standalone Object or part of Source? | Standalone Object, Dependent on Source, overlaid visually, double-click opens Object. | Decided (D-2) | — |
| Q-40 | Is Annotation a distinct type? | No. User notes live in Highlight Content, as with any Object. | Decided | — |
| Q-41 | Is Source a single type or multiple types? | Multiple native types (Weblink, PDF, Video…), matching Capacities; "Source" is the group of types accepting Highlights. | Decided | — |
| Q-42 | Are Tag and Concept distinct? | No: Concept only, acting as a tag with a dedicated page. | Decided (D-3) | — |
| Q-43 | Do Concepts support hierarchy? | Yes, optional: a Concept may have parents; parents aggregate descendant content. | Decided | — |
| Q-44 | Can a Concept have multiple parents? | Yes, poly-hierarchy following SKOS model: broader/narrower, related, synonyms. | Decided (D-4) | — |
| Q-45 | What is a Note? | Matching Capacities' Page: built-in free-form writing type, no custom properties; convertible to custom type. | Decided | — |
| Q-46 | How to instantiate Questions? | Standalone, from selected text, or via `/questão` in any Object; linked to origin. | Decided | — |
| Q-47 | Question formats? | Q&A, cloze (fill-in-the-blank, like Readwise Mastery), multiple choice (like ExamTopics). | Decided | — |
| Q-48 | Multiple choice as Flashcard or Question? | Unified into single type: Question. | Decided (D-5) | — |
| Q-49 | Which formats in each mode? | Configurable per Mock Exam. Default: Review includes all formats; Mock Exam includes multiple choice only. Open formats are self-assessed. | Decided | — |
| Q-50 | Do Review and Mock Exam have separate logs? | No: unified Attempt history; failing in Mock Exam accelerates next Review. | Decided | — |
| Q-51 | How does the user grade in Review? | Readwise style (select when to review: Forgot, Earlier, Normal, Later, with interval shown), logging pass/fail; 4 buttons map to FSRS grades. | Decided | — |
| Q-52 | Is Evidence a separate type? | No. Question contains Explanation combining free-form text (Anki), "proven by" Highlights, and Answers with provenance, votes, and discussion (ExamTopics). | Decided | — |
| Q-53 | Does agent-generated content enter directly? | Not by default: enters Pending approval; user can disable approval requirement. User file imports enter directly. | Decided | — |
| Q-54 | Are pending items merged or separated? | Single Inbox per Space, with To read and Pending approval tabs. | Decided | — |
| Q-55 | Which View layouts? | Matching Capacities: Table, Gallery, Wall, List, Kanban, and Embed. | Decided | — |
| Q-56 | How does AI integrate? | Three surfaces: Chat over Space content, AI Actions over selected text, and external agent access via MCP. Always restricted to Space, citing sources, creations entering Pending approval. | Decided | — |
| Q-57 | Where does the app run? | Browser only (web app). | Decided | — |
| Q-58 | How to capture from the web? | Extension matching Readwise Reader: saves pages and enables highlighting on external sites. | Decided | — |
| Q-59 | Include Daily Note? | Yes, matching Capacities daily notes. | Decided | — |
| Q-60 | Import from other apps initially? | Not in MVP; deferred to phase 6. | Decided | — |
| Q-61 | Who uses the app? | Personal use with login and isolated Accounts; no cross-account sharing. | Decided (D-6) | — |
| Q-62 | Moving an Object tagged with Concepts to another Space? | Links to Concept of same name/Synonym in target Space or creates it without parents; previewed before confirmation. | Decided | — |
| Q-63 | Community votes and discussion without scraping sites? | Kept optional, entered manually or via file import. | Decided | — |
| Q-64 | Does deleting a Question erase history? | Yes (moves to Trash with Attempts); to retain history, use Archive. | Decided | — |
| Q-65 | Does Concept accept user Properties? | Yes; default Status (Not Started, Learning, Mastered). Applies across all built-in types. | Decided | — |
| Q-66 | How do Links work? | Matching Capacities: `@`/`[[ ]]`, contextual Backlinks, Block References `(( ))`, Unlinked Mentions. | Decided | — |
| Q-67 | What does Search cover? | Titles, content, Highlights, PDF text, and web page snapshots within active Space; recognizes Synonyms; filters by Type and Concept. Semantic search in phase 5. | Decided | — |
| Q-68 | Can users create Custom Types? | Yes, matching Capacities (Properties, Templates, Type conversion). | Decided | — |
| Q-69 | When does Video enter? | Phase 2 (YouTube with transcript; Highlights by text span and timestamp). | Decided | — |
| Q-70 | Language for UI and code? | UI in PT-BR; code, database, and API in English, using Glossary names (§4). | Decided | — |
| Q-71 | Which built-in Types exist? | All Capacities Basic Object Types, adapted: Note (Page), Image, Weblink, Audio, PDF, File, Saved Chat (AI Chat), Saved Query, Table, and Daily Note. Tag replaced by Concept (D-3); Tweet becomes Weblink. Plus native: Concept, Highlight, Question, and Video. | Decided | — |
| Q-72 | Does each Type have a dashboard? | Yes, Type Dashboard matching Capacities Object Dashboard: recent, without Concept, outside Collection, without Backlinks, Collections, and pinned Saved queries; filter, sort, group. | Decided | — |
| Q-73 | Include Collection? | Yes, matching Capacities: manual grouping within a Type, embeddable and displayed on Type Dashboard. | Decided | — |
| Q-74 | Plan study toward exam date? | Yes: Exam Plan matching RemNote Exam Scheduler (priority, new item pacing, final review, delay warnings). Phase 4. | Decided | — |
| Q-75 | Daily limits and target retention? | Yes, matching Anki/FSRS: new per day, max reviews, target retention (default 90%). Phase 3. | Decided | — |
| Q-76 | Handling repeatedly failed Questions? | Yes: Leech question after 8 "Forgot" ratings, matching Anki leeches. Phase 3. | Decided | — |
| Q-77 | Cloze with multiple deletions? | Each deletion reviews independently; deletions from same Question do not appear on same day. Phase 3. | Decided | — |
| Q-78 | Study analytics? | Yes: Progress Dashboard (accuracy by Concept, forecast, Exam Plans, study streaks). Phase 3. | Decided | — |
| Q-79 | Mock Exam modes? | Exam mode and Practice mode; flag for review. Phase 4. | Decided | — |
| Q-80 | Basic navigation? | Command Palette and Pins (phase 0); Side Panel, Link previews, and outline (phase 1). | Decided | — |
| Q-81 | Version History? | Yes, compare and restore revisions per Object. Phase 2. | Decided | — |
| Q-82 | Calendar View? | Yes (Daily Notes, Exam dates, forecasted reviews). Phase 2. Charts and Timeline in backlog. | Decided | — |
| Q-83 | EPUB as Source? | Yes, phase 2. RSS and newsletters in backlog. | Decided | — |
| Q-84 | Extract excerpt to new Object? | Yes, matching Obsidian Note Composer. Phase 2. | Decided | — |
| Q-85 | Save Chat response and AI extracting Properties? | Yes (NotebookLM; Capacities media analysis), with Pending approval. Phase 5. | Decided | — |
| Q-86 | Tasks, presentation mode, TTS, RSS, lecture recording, OCR, occlusion? | Backlog (§9.1). | Decided | — |

---

## 12. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Scope bloat (attempting to replicate multiple mature products simultaneously). | High | Phased plan with hard exit criteria; `NG-1`. |
| Dynamic typing model degrading query performance. | High | Prototype Property schema and benchmark against targets in §8 during Phase 0. |
| Fragile locators (mutating web DOM, re-rasterized PDFs). | Medium | Multiple Selectors (W3C Web Annotation), DOM snapshots, explicit "orphaned" state. |
| AI without grounding contaminating user knowledge base. | High | `INV-6`, `INV-12`, mandatory citation provenance. |
| Ingestion of live certification exam dumps violating vendor policies. | High | `NG-3`, `INV-13`, `Q-36`; focus on Explanations and authoritative documentation. |
| Incorrect community answers treated as authoritative. | Medium | Mandatory provenance on Answers, visible discrepancy warnings, required Explanation for "verified" status. |
| Scheduler optimization requiring historical telemetry that was discarded. | Medium | `INV-11` enforced from the very first retention release. |
| External sync workflows overwriting user modifications. | Medium | Idempotent sync logic and explicit conflict resolution policy (§10). |

---

## 13. Decision Log

Decisions difficult to reverse, non-obvious without context, or resulting from explicit architectural trade-offs. To alter one, record a new replacing decision `D-*`.

### D-1 — Completely Isolated Spaces

**Context**  
A Space represents an independent knowledge realm (e.g., Personal, Work, AZ-204). Two models were evaluated:
- **Hard boundary:** Every Object belongs to exactly one Space; ObjectTypes, Concepts, and Collections are local to the Space.
- **Lens / Filter:** Global Objects and Types; the Space merely filters display, allowing an Object in multiple Spaces.

**Decision**  
Spaces follow Capacities' architecture: they are **completely separated**.
- Every Object belongs to exactly one Space.
- ObjectTypes, Concepts, and Collections are strictly scoped to the Space.
- No Relations, links, or embeds cross Space boundaries.
- Search and AI grounding operate strictly within a single Space.

**Alternatives Considered**  
- **Space as filter:** More flexible, but turns isolation into a query convention; any query flaw creates cross-domain data leakage.
- **Opt-in cross-space relations later:** Rejected. If knowledge needs interconnection, it belongs in the same Space.

**Consequences**  
- Isolation in search, AI, and exports is guaranteed by schema, not query filters.
- Common custom types (e.g., Book, Person) must be defined in each Space using them.
- Users wishing to link Work and Personal knowledge MUST maintain them within a single unified Space.
- Content created in the wrong Space is corrected via native **Move**, which migrates the Object and its Dependents while stripping cross-space Relations after user confirmation. Export/import is not the migration mechanism.

### D-2 — Highlight as a First-Class Object

**Context**  
The product follows Capacities for Spaces, Dependents, and Trash. In Capacities, however, highlights reside inside the PDF/weblink object as block elements; they are not distinct objects and cannot be queried.

**Decision**  
Diverge from Capacities: **Highlight is a first-class Object**, following Readwise Reader.
- Remains a Dependent of its parent Source (moves and moves to Trash with it).
- Overlaid visually on Source content (PDF, web, etc.).
- Double-clicking a Highlight in the Source viewer opens the Highlight Object; navigating back to the source excerpt is always available.
- Participates in Views, Queries, Concepts, and Relations like any Object.

**Alternatives Considered**  
- **Capacities approach (highlight as embedded block):** Simpler, but prevents queries like "highlights without Concept or Flashcard" and breaks the provenance chain.

**Consequences**  
- Highlights can proliferate; Views and indexing must accommodate high volumes.
- Two entry points exist for each Highlight: the parent Source (contextual view) and the Highlight Object (detail view).

### D-3 — Concept Replaces Tag

**Context**  
In Capacities, tags are deliberately property-free identifiers. Users want to tag topics, but also write synthesis notes, track learning progress properties, and view aggregated relations.  
Other reference systems:
- Logseq (legacy): `#tag` and `[[page]]` were identical; tags had pages.
- Logseq (DB): Separated tags and pages, but overlapping roles caused user confusion.
- Obsidian: Users construct MOCs (Maps of Content) precisely because tags lack body context.

**Decision**  
A **single unified construct** handles categorization: the **Concept**, a tag with a dedicated page.
- Applicable to any Object.
- Contains rich Content and Properties.
- Automatically aggregates all Objects tagged with it or its descendants.
- Naked, property-less Tags do not exist in the product.

**Alternatives Considered**  
- **Capacities tags + separate Concept:** Creates two overlapping categorization mechanisms (the Logseq DB pitfall).
- **Tags without pages only:** Fails the primary goal of tracking personal understanding over time.

**Consequences**  
- Deliberate divergence from Capacities.
- Operational flags without topic meaning (e.g., "urgent", "needs-review") MUST be modeled as Object Properties, not Concepts.
- Exports to tag-centric tools (Obsidian, Anki) convert Concepts into tags.

### D-4 — Concepts Follow SKOS Poly-Hierarchy

**Context**  
Concepts require hierarchical structuring (e.g., certification exam domains), but knowledge rarely fits a single strict tree: PKCE belongs to both OAuth 2.0 and Mobile Security. Rather than inventing ad-hoc mechanics, the system adopts formal knowledge organization standards.

**Decision**  
Concepts adhere to the **W3C SKOS** model (Simple Knowledge Organization System):
- **Broader / Narrower:** Optional hierarchical links with **poly-hierarchy** (zero, one, or multiple parents).
- **Related:** Symmetric, non-hierarchical association.
- **Labels & Synonyms:** Canonical title (`prefLabel`) and alternative labels (`altLabel`).
- Quality constraints:
  - A Concept cannot be its own parent or form cycles.
  - Broader/narrower and related cannot connect the same pair.
  - Redundant hierarchy is flagged (A broader than C when A → B → C already exists).

**Alternatives Considered**  
- **Strict single-parent tree:** Simple, but forces artificial taxonomy choices and data duplication.
- **Flat concepts without hierarchy (like Capacities):** Insufficient for certification blueprints and curricula.

**Consequences**  
- A Concept page aggregates items tagged with any of its descendants without duplication.
- Export can generate valid SKOS RDF, ensuring interoperability with standard vocabularies.
- Specialized semantic relations (e.g., "part-of") can be added as sub-properties in the future.

### D-5 — Unified Question Type for Flashcards and Questions

**Context**  
Earlier drafts specified two distinct types: **Flashcard** (spaced repetition memorization, like Anki/RemNote/Readwise) and **Question** (multiple-choice practice and exam simulations, like ExamTopics). Multiple-choice questions were needed in both, creating duplicate constructs.

**Decision**  
A **single unified type: Question**.
- Formats: Q&A, cloze (fill-in-the-blank), multiple choice.
- Modes: Spaced repetition (Review) and Exam simulation (Mock Exam); the same Question can participate in both.
- Creation: Standalone, from selected text, or via `/questão` inside any Object.
- Preserves origin links (provenance).

**Alternatives Considered**  
- **Separate Flashcard and Question:** Duplicates content when the same knowledge is used for recall and mock exams.
- **Multiple choice restricted to Question:** Avoids duplication, but fragments active recall into two separate paradigms.
- **Candidate names considered:** Flashcard, Card, Item (SuperMemo/psychometrics term), Question, Recall. User selected "Questão" (UI) / "Question" (Code).

**Consequences**  
- Review and Mock Exam log **Attempts** in a single consolidated history; missing a Question in a Mock Exam triggers earlier scheduling in Review.
- Formats allowed in a Mock Exam are configurable (default: multiple choice only); open formats are self-assessed.
- Anki export converts Q&A and cloze Questions; multiple-choice export uses specialized note types.

### D-6 — Personal Use with Isolated Accounts

**Context**  
The application runs in the browser, online (Q-57). We needed to establish whether it serves a single self-hosted user or multiple users, and whether cross-user sharing exists.

**Decision**  
- The system features authentication with **login** and multiple **Accounts**.
- Each Account owns its own Spaces; **nothing is shared** across Accounts.
- No collaboration, shared Spaces, or public publishing in current scope (NG-2).
- Agent access via MCP utilizes Account-level credentials scoped to explicitly authorized Spaces.

**Alternatives Considered**  
- **Single-user unauthenticated instance:** Simpler, but insecure online and prevents multi-tenant SaaS deployment.
- **Cross-account collaboration:** Drastically alters the security and data model; deferred.

**Consequences**  
- All data belongs to an Account and a Space; tenancy isolation is enforced on every query.
- Future multi-user collaboration will require a dedicated decision in §13.

---

## Appendix A — Product References

Inspirations, not parity mandates (`NG-1`).

| Product | Adopted Patterns | Omitted Features |
|---|---|---|
| **Capacities** | ObjectTypes with fixed native types; system properties; bidirectional object relations with single/multi select; Queries as embeddable contextual Objects; type conversion with property mapping; manual collections vs queries; templates per type; type dashboard. | Proprietary styling and layout constraints. |
| **Heptabase** | Cards placed across multiple whiteboards indicating locations; Sections; text and PDF region highlights with jump-to-source; video caption / audio transcript import; daily journal; Markdown export; CLI/MCP agent access. | Whiteboard as the mandatory root entity. |
| **Obsidian** | Frontmatter properties; links, block references, and embeds; Backlinks and Unlinked Mentions; aliases; Local Graph; Canvas in JSON Canvas; declarative Bases (queries with layout filters) that do not store data; Web Clipper with templates; core/plugin modularity; Vault as boundary reference. | Markdown file as canonical storage; Vault as physical filesystem directory. |
| **Notion** | Databases, bidirectional relations, rollups and formulas (Computed Properties), database templates. | Page as the universal atomic unit. |
| **Readwise Reader** | Inbox and document triage; reading progress; text and image highlights; daily highlight resurfacing; templated export; non-destructive sync; AI prompt actions with document variables; CLI/MCP. | — |
| **RemNote** | Questions created inline in notes; Concept/Descriptor; card kinds (cloze, image occlusion, multiple choice, bidirectional); FSRS optimization from review logs; per-document queues; exam scheduler. | — |
| **Anki** | Note (content) → Cards (scheduling) separation; note types with fields and card templates; sibling cards; daily limits; leeches; import/export formats. | Legacy UI paradigms. |
| **NotebookLM** | Source-grounded AI with citations; source selection for context window; viewing prompt instructions used to create artifacts; "explain" missed questions citing sources; source auto-tagging; snapshot exports. | Generative audio/podcast media (`NG-7`). |
| **StudyFetch** | Generating study materials from user uploads; progress tracking by topic; exam date study planning. | Generic tutor ungrounded in graph. |
| **Brainio** | Seamless toggle between text outline and mind map; MCP integration. | Real-time multi-user editing. |
| **ExamTopics** | Hierarchy: Vendor → Exam → Topic → Question → Discussion; suggested answer vs community vote distributions. | Public question bank hosting (`NG-3`). |

---

## Appendix B — Reference Flows

### B.1 Learning from a Primary Source
```text
Capture → Inbox → Source + Snapshot
→ Locator (Selectors) → Highlight
→ Concept → Note
→ Question → Cards → Attempts
```

### B.2 Error Remediation Loop in Assessment
```text
Question ─tests→ Concept
Attempt (incorrect, confidence) → Question
→ Concept → Explanation → Source + Locator
→ Note → Question → Attempt
→ subsequent Attempt
```

### B.3 Certification Structure (User ObjectType + Concepts + Queries)
```text
Exam (Custom ObjectType) ── Concepts (domains) ── Concepts (topics)
```

### B.4 Mistake Graph Traversal
```text
Attempt → Question → Concept → Parent Concept (domain) → Exam
Attempt → Question → Concept → Explanation → Source
```

### B.5 Traceable AI Querying
- "Where did I learn about React Server Components?" → Concept → Source (video) → timestamp → Highlight.
- "Why do I keep missing questions on Cloud Run?" → Attempts + Questions + Concepts + Explanations + Sources + Notes within authorized context.

---

## Appendix C — Open Standards References

| Purpose | Standard |
|---|---|
| Note Export | Markdown (CommonMark / GFM) with YAML frontmatter |
| Annotations & Locators | W3C Web Annotation Data Model (TextQuoteSelector, TextPositionSelector, FragmentSelector, SvgSelector) |
| Media Anchoring | W3C Media Fragments (`#t=start,end`) |
| Concept Poly-Hierarchy | W3C SKOS (broader, narrower, related, prefLabel, altLabel) |
| Whiteboards | JSON Canvas specification |
| Spaced Repetition | FSRS (open-source implementations, e.g. ts-fsrs, py-fsrs) |
| Captions / Transcripts | WebVTT |
| Flashcard Interoperability | Anki import formats (CSV / APKG) |
| Agent Integration | Model Context Protocol (MCP) |

---

## Product Principle

> Everything with meaningful identity can be an Object. Objects possess properties, content, and relations. Spaces preserve independent contexts. Views and Whiteboards reorganize the same Objects without mutating their identity. Knowledge retains its provenance, remains retrievable, and resurfaces when it needs to be remembered.
