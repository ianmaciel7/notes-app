# Intent: Community Exam Prep Platform

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

- Browsing and community content consumption must remain free and available.
- **Space-Based Architecture:** The core hierarchy must be built around user-owned "Spaces" with strict tenant-level data isolation.
- **Graph-Ready MVP:** Content must be strictly modeled as objects. To support the PKM vision, the MVP object types are: `Questions`, `Exams`, `Tags`, `Collections`, `Notes`, and `Citations`. 
- **Polymorphic Relations:** The database MUST be designed to support a knowledge graph architecture. It must allow bidirectional linking between any objects (e.g., a Question linked to a Citation and a Note) without schema friction.
- The MVP supports `single-choice`, `multiple-choice`, `fill-blank`, and `matching` question formats.
- `ordering`, `hotspot`, and `simulation` question formats are reserved for the schema but not the MVP UI.
- The MVP must include a spaced repetition mechanism for missed questions, allowing flexible review schedules.
- The initial MCP surface is read-oriented; administrative and user-state write tools are deferred.
- Monetization, voting, and question discussion threads are out of scope for v1.

## Open questions

- What is the final application name and branding (aiming for concise, modern names like Vercel, Scalar, or Linear)?
- How will user-generated content be moderated or validated for accuracy before being shared with the broader community?
- Which database pattern is best suited to build these Capacities-like object relations efficiently?
- Which specific spaced repetition algorithm (e.g., Leitner system, SM-2) should be used?
- How should MCP authentication, hosting, and rate limits be implemented?

## Related

- [Specification](spec.md)