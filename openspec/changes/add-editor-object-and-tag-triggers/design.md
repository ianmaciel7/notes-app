## Context

Capacities exposes `/` and `+` as quick editor functions and uses `@` to reuse existing objects. Tags are selected through `#` in supported capture/editing surfaces. Notes App already has a shared Tiptap suggestion controller and stable object/block marks, so new triggers should be adapters over those foundations.

## Trigger Ownership

`+` opens only at a valid text boundary with an empty selection and outside excluded nodes. Its result catalog contains supported block commands and runtime object-creation commands. Selecting an object type creates one canonical object through the existing creation owner and inserts one stable reference after successful creation.

`#` opens tag search at a valid boundary. Existing tags are ranked by normalized title and aliases. A create option appears only when the query is a valid tag label, no exact tag exists, and the current user/context can create tags.

## Transactions

No canonical object or tag is created while the menu merely opens, filters, highlights, or closes. Selection performs one command transaction:

1. validate current range and context;
2. create or resolve the canonical target;
3. replace the exact trigger/query range;
4. insert the stable reference or tag value;
5. update derived indexes through existing owners;
6. restore caret/focus.

A creation failure leaves the editor document unchanged and presents a recoverable localized error.

## Arbitration

- `# ` at block start remains heading Markdown when followed by the heading delimiter pattern.
- `#query` is a tag trigger only where tag links are supported.
- `+` inside words, URLs, code, math, or unsupported nodes remains text.
- Only one suggestion owns a range.
- IME composition suppresses trigger commits.
- Escape and outside dismissal preserve text unless the explicit accepted command replaces it.

## Security and Performance

Runtime providers expose only Space-local eligible Structures and tags. Filtering is derived and may be deferred, but input and composition remain synchronous. Opening or typing in suggestions performs no persistence write.

## Testing

Tests cover boundaries, conflicts, duplicate labels, exact range replacement, create/cancel/failure, undo/redo, cross-Space rejection, focus, accessibility, viewport edges, reduced motion, IME, and persistence counts.
