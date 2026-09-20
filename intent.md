# Intent: Recall — Community Exam Prep Platform

- Working name: **Recall** (decided below, was open)
- Author: Project team
- Created: 2026-09-19
- Updated: 2026-09-19
- Status: draft

## Problem

Learners preparing for certifications and exams suffer from severe tool fragmentation. They use platforms like ExamTopics for practice, Readwise/Reader to save documentation highlights, and Capacities/Notion for personal notes. There is no unified tool that merges object-based workspaces, citation management, and exam simulations, making it impossible to seamlessly link a practice question directly to its source documentation and personal study notes within a single knowledge graph.

## Proposed outcome

Create a graph-based, crowdsourced study platform that merges exam prep, spaced repetition, and Personal Knowledge Management (PKM). The ultimate vision is a system where users can take a `Question` object, link it to a specific `Citation` (e.g., a highlight from official docs), and connect it to a personal `Note`, with seamless graph navigation between them. The UX must be heavily inspired by Capacities' fluid, object-oriented structure. The platform will support multiple question formats, track missed questions, and expose a read-oriented study experience through an MCP interface.

## Affected users and systems

- Self-study learners using the platform as their primary PKM and spaced repetition tool.
- Content creators (users) managing their Spaces, authoring exams, notes, and citations.
- The web application frontend, authentication provider, database, and security rules (enforcing strict isolation per Space).
- Shared domain/application services used by the web UI and MCP server.
- External MCP-compatible clients consuming the study interface.

## Constraints

- **All Spaces are private (decided 2026-09-19, reverses the earlier "free community browsing" constraint).** There is no public/anonymous browsing surface — every object is visible only to members of its owning Space. This removes the entire public-vs-isolation tension spec.md §9 previously flagged, but it now directly conflicts with "crowdsourced" in Proposed outcome above — see Open questions.
- Core study features (spaced repetition, all object types, MCP read access for a Space's own members) must stay free of a paid plan for any Space member — monetization is still deferred (below), not a reason to paywall the core loop.
- **Space-Based Architecture:** The core hierarchy must be built around user-owned "Spaces" with strict tenant-level data isolation. A user may own or belong to multiple Spaces (confirmed 2026-09-19, Capacities-style — not capped to one).
- **Graph-Ready MVP:** Content must be strictly modeled as objects. To support the PKM vision, the MVP object types are: `Questions`, `Exams`, `Tags`, `Collections`, `Notes`, and `Citations`. 
- **Polymorphic Relations:** The database MUST be designed to support a knowledge graph architecture. It must allow bidirectional linking between any objects (e.g., a Question linked to a Citation and a Note) without schema friction.
- The MVP supports `single-choice`, `multiple-choice`, `fill-blank`, and `matching` question formats.
- `ordering`, `hotspot`, and `simulation` question formats are reserved for the schema but not the MVP UI.
- The MVP must include a spaced repetition mechanism for missed questions, allowing flexible review schedules.
- The initial MCP surface is read-oriented; administrative and user-state write tools are deferred.
- Monetization, voting, and question discussion threads are out of scope for v1.
- **Content moderation (v1):** no pre-publish review gate within a Space — an object becomes visible to Space members per its `visibility` field the moment its owner sets it. Any Space member can report an object; a reported object is hidden from other members pending review by the Space's admin or a platform admin. Now scoped to abuse *within* a shared private Space (since nothing is ever public), not community-wide moderation. See spec.md FR-9.
- **Spaced repetition algorithm:** SM-2 (not Leitner) — chosen for its per-card ease factor, which fits a `study_records` schema already tracking `interval`/`easeFactor`/`history` better than Leitner's fixed-box model, and it's the de facto standard for this problem (Anki, SuperMemo).
- **Exams are capped at one per user (confirmed 2026-09-19).** Each user may own/author at most one `Exam` object. Flagged as unusual in spec.md §9 — it blocks a user preparing for two certifications from having two exams — kept as stated rather than second-guessed, since it was explicitly confirmed.
- **Study sessions are configurable, including a simulated-exam mode (added 2026-09-19).** Before studying, a user picks scope (all due, or narrowed to an Exam/Tag/Collection), question count, and mode: `practice` (immediate feedback, today's default flow) or `simulated_exam` (timed, no feedback until the end, formatted like the real certification exam). See spec.md FR-11.

## Success

*(draft — confirm with product owner)*

- A learner can create a `Question`, link it to a `Citation` and a personal `Note`, and navigate between all three via bidirectional links/backlinks within one Space.
- A missed question is automatically re-surfaced by the spaced-repetition queue on its computed schedule, and reviewing it updates that schedule.
- A Space member can browse and read every object in a Space they belong to, at no cost and with no paywall on the core study loop.
- An MCP client can query a user's own `Questions`, `Notes`, and `Citations` for a study session without ever surfacing another user's or Space's private objects.

## Open questions

- How should MCP authentication, hosting, and rate limits be implemented? Now the *only* thing gating MCP access to any object at all, since private-only Spaces removed the "public objects, no auth needed yet" fallback spec.md §7.2 used to allow. See spec.md §7.2/§9 — still genuinely undecided, needs a design pass, not just a pick.
- **New, from the private-only decision:** Proposed outcome above still calls this a "crowdsourced" platform, but private-only Spaces means no content is ever visible outside its Space's membership. Is "crowdsourced" now just "a member of a shared private Space can contribute," or does the product still need some public-facing surface (e.g. a Space owner explicitly publishing to a separate public gallery)? Needs a product decision before Plan Mode — not assumed either way here.

Resolved (were open, decided above/in spec.md — human owner should still sign off, not silently treat as unchangeable):

- ~~Final application name and branding~~ → **Recall**.
- ~~Content moderation/validation before sharing~~ → report-and-hide model, see Constraints and spec.md FR-9.
- ~~Database pattern for object relations~~ → Firestore with a central `object_links` edge collection, see spec.md §6.
- ~~Spaced repetition algorithm~~ → SM-2, see Constraints.

## Related

- [Specification](spec.md)