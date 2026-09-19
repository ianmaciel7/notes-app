---
trigger: always_on
description: Define naming and content conventions for the Markdown files and documentation locations already used by this repository.
---

# Scope

This rule covers only the Markdown files and locations currently established in this repository:

- Root files: `README.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and `intent.md`.
- Agent rules: `.agents/rules/<topic>.md`.
- Project documentation: `/docs`.

Do not add conventions for document types that do not yet exist in the repository. In particular, this rule does not establish `spec.md`, `plan.md`, ADR files, changelogs, or documentation subcategories before they are actually introduced.

# Naming conventions

- Use the existing conventional uppercase names for root entry points: `README.md`, `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md`.
- Keep `intent.md` exactly lowercase because it is the canonical intent filename defined by the AI-native SDLC playbook.
- Name files under `.agents/rules/` with lowercase kebab-case, using the subject of the rule: `.agents/rules/docs.md`.
- Name files added directly under `/docs` with lowercase kebab-case: `/docs/<subject>.md`.
- Do not create duplicate names with different casing, abbreviations, or suffixes.
- Link related Markdown files with repository-relative links.

# Root files

## `README.md`

The project entry point. Keep it concise and practical:

```md
# <Project name>

<What the project does and its current status.>

## Setup

<Prerequisites and installation steps.>

## Development

<Commands to run, format, lint, and test the project.>

## Documentation

- [Intent](intent.md)
- [Project documentation](docs/)
```

## `AGENTS.md`

Shared instructions for coding agents. Keep repository-wide rules here and link to deeper rules instead of duplicating them:

```md
# Repository instructions

## Source of truth

- <Canonical project rule or document.>

## Required workflow

1. <Required step.>

## Validation

- <Required check before handoff.>
```

## `CLAUDE.md` and `GEMINI.md`

Tool-specific entry points. Keep them short and tool-specific. Shared instructions belong in `AGENTS.md`; these files should point there rather than copy the same rules.

## `intent.md`

The repository's product intent and the canonical source for the current initiative. It is a short, human-readable, version-controlled proto-spec that records what is wanted, why it matters, who or what is affected, and under which constraints.

Follow this structure:

```md
# Intent: <initiative name>

- Author: <name and role>
- Created: YYYY-MM-DD
- Updated: YYYY-MM-DD
- Status: draft | approved | rejected | superseded

## Problem

<Describe the current problem in the originator's own words.>

## Proposed outcome

<Describe what should improve and how success will be recognized.>

## Affected users and systems

<List affected users, teams, products, services, and data.>

## Constraints

<List product, technical, security, legal, schedule, and scope constraints.>

## Open questions

- <Unresolved question and decision owner, if known.>
```

Create or update `intent.md` after brainstorming makes the idea concrete. The originator or product owner reviews and corrects it before it is committed. Keep it focused on intent; put implementation details in `/docs` when such documents are created.

# Intent workflow

The current shared home for this repository's intent is the existing root `intent.md`. Keep it version-controlled beside the code it describes and treat it as the authoritative record for the current initiative.

- Prerequisites are an agreed `intent.md` template, access to the repository, and a product owner who reviews the artifact.
- The originator describes the problem in their own words, including what is difficult today, who is affected, what better looks like, and what is out of scope. No formal language is required.
- Brainstorm until the idea is concrete enough to state its scope, users, constraints, and success criteria.
- Write the result using the repository's `intent.md` template. The template may be maintained as agent guidance, but a technical lead or product owner must approve changes to it.
- The originator reviews the generated document and corrects anything misunderstood before it is committed.
- Commit the reviewed `intent.md`; its author, timestamp, and Git history form the audit trail.
- If contributors do not use Git directly, an approved version-control connector may create the commit on their behalf. The repository remains the shared source of truth.
# `.agents/rules/` files

Each rule file should have YAML front matter followed by focused, imperative guidance:

```md
---
trigger: always_on | <matching condition>
description: <One-sentence purpose>
---

# <Rule topic>

<Short, actionable rules and examples.>
```

Use one rule file per coherent topic. Do not copy the same repository-wide instruction into multiple rule files.

# `/docs`

Use `/docs` for project documentation that is not one of the established root files or agent rule files. Until the repository creates specific document types, keep the convention simple: use a descriptive lowercase kebab-case filename and start with a clear title and purpose.

```md
# <Document title>

## Purpose

<Why this document exists and who should read it.>

## Content

<The document's subject matter.>

## Related

- [Intent](../intent.md)
```

Do not add ordinary guides, plans, design notes, or specifications to the repository root. Add them under `/docs` only when the project actually needs them and establish a more specific convention in this rule at that time.


