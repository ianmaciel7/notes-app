# Intent: Notes App

**Author:** Ian Maciel
**Status:** Draft
**Last Updated:** 2026-09-23

## Problem
The repository is named `notes-app`, but no note-taking feature exists yet — `src/app/page.tsx` is still the unedited `create-next-app` starter page. What exists so far is a component and design-system foundation (shadcn `base-nova` primitives on Base UI, OKLCH tokens, Ladle stories) intended to be built on top of.

## Proposed Outcome
Not yet defined. The functional scope of "notes" (creating/editing/organizing notes, storage, sync, sharing, etc.) has no spec in the repo. This document should be revised once that scope is decided — until then it records the current (pre-feature) state honestly rather than inventing a product spec.

## Affected Users and Systems
- **Target Personas / Users:** TBD — no persona definitions exist in the repo.
- **Systems & Components:** Currently limited to the Next.js App Router shell (`src/app/`), the shared UI primitive library (`src/components/ui/`), and the theme provider (`src/components/theme-provider.tsx`). There is no data layer, API, or auth system yet (see `ARCHITECTURE.md` and `SECURITY.md`).

## Constraints
- **Security & Privacy:** No PII or auth model exists yet; none should be introduced without a corresponding `SECURITY.md` update.
- **Architecture & Tech Stack:** New work must build on the existing stack — Next.js App Router, `@base-ui/react` + shadcn `base-nova`, Tailwind CSS v4, Biome. See `ARCHITECTURE.md` §3.
- **Performance & Budgets:** Not yet measured or budgeted.
- **Scope / Non-Goals:** Not yet defined.

## Open Questions
- [ ] What is a "note" in this product (plain text, rich text, attachments)?
- [ ] Where is note data persisted (local-only, a backend, a third-party store)?
- [ ] Is authentication required, and if so, single-user or multi-user?
- [ ] Do the conversational/chat UI primitives already in `src/components/ui/` (`bubble.tsx`, `message.tsx`, `attachment.tsx`, `questionnaire.tsx`) imply an AI-assisted notes feature, or are they unused scaffolding from the shadcn install?
