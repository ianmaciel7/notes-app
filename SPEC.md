# Product specification

## MVP

KnowledgeOS is a private, read-first study space with preinstalled static
decks. Each card has a stable GUID at `/study/{cardGuid}`; the catch-all space
route preserves future paths without locale in the URL.

| Capability | Visitor | Google-authenticated user |
| --- | --- | --- |
| Browse, reveal, and review cards | No | Yes |
| Persist FSRS review state | No | Yes |
| Edit content | No | Future milestone |

Every private read and mutation independently verifies Firebase
authentication. Client state, hidden controls, URLs, and flags never authorize
access. Development, preview, and production use separate Firebase projects.

## Current UI

The shared sidebar provides real links, one semantic active route, and the
same navigation model on desktop and mobile. The space switcher is
presentational until a Space domain exists. Object controls use typed icons and
matching split-button variants; `question` is supported.

## Deferred workspace capabilities

Historical worktrees are reference material, not shipped behavior or a visual
parity target. Future work is staged: typed navigation; saved sections and
preferences; Spaces; then contextual panels.

- Navigation stays accessible and responsive: drawers close with Escape and
  return focus, motion respects `prefers-reduced-motion`, and no state creates
  page overflow.
- Preferences are validated, versioned, migration-tested, and scoped to the
  verified user and future `spaceId`.
- Spaces scope all relevant data by `spaceId`. A future three-pane shell,
  tabs, graph, search, AI, or focus mode requires real content and mobile
  behavior first.
- Typed objects and views, study goals, reader/highlights, grounded AI cards,
  local-first sync, recovery/import/export, and knowledge search each require
  a separate product, data, authorization, and migration design.

### Extracted future contract

| Area | Required contract when enabled |
| --- | --- |
| Objects | Stable IDs, typed properties, collections, tags, relations and backlinks; `spaceId` scope. |
| Views | Declarative saved queries; table/list/gallery presentations; never executable query code. |
| Study goals | Real FSRS scheduling, separate due/new quotas, and explicit zero-card, overdue and timezone handling. |
| Reader | Non-mutating PDF/Markdown/EPUB/web highlighting with quote plus durable location anchors and failure states. |
| Grounded AI | Server-only providers, validated candidates, and verified source-quote provenance. |
| Sync | Only after specifying outbox, idempotency, retry, pull cursors, conflicts, tombstones and media states. |
| Recovery | Restorable snapshots, attachments, retention/purge and honest import/export; metadata deletion is not restoration. |
| UX quality | Real operations, loading/error states, keyboard parity, responsive behavior and evidence-based tests. |

Every visible control must perform its named operation and report failures
honestly. Historical fixtures, archived revisions, external branding, and
unverified parity measurements are not product requirements.
