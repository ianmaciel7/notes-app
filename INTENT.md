# Intent: Notes App

**Author:** Ian Maciel  
**Status:** Draft  
**Last Updated:** 2026-09-23

## Problem

The repository is named `notes-app`, but a note-taking product has not yet been
defined or implemented. The current repository is a product shell and UI foundation,
so implementation decisions must not silently become product requirements.

## Proposed Outcome

Define a notes product whose core behavior, target users, persistence model, and
scope are explicit enough to guide implementation without inventing requirements.
Until those decisions are made, this repository remains a pre-MVP foundation.

## Affected Users

The primary user and target use case are not yet defined.

## Product Boundaries

While this intent remains Draft:

- do not assume notes are plain text, rich text, block-based, or file-based;
- do not assume authentication, synchronization, sharing, collaboration, or AI;
- do not infer product requirements from installed components or dependencies;
- implementation constraints belong to the relevant engineering control document,
  not to product intent.

## Open Questions

- [ ] What is a "note" in this product?
- [ ] Who is the primary user and what problem are they solving?
- [ ] How should notes be organized, searched, and related?
- [ ] Where is note data persisted and synchronized, if at all?
- [ ] Is authentication required, and is the product single-user or multi-user?
- [ ] Are collaboration, sharing, attachments, highlights, or AI assistance in scope?
- [ ] What defines an MVP useful enough to validate?
