## Context

The AI panel can help users reason over authorized workspace content, but provider calls, credentials, retrieval, and persistent mutations need explicit boundaries.

## Decisions

### Keep provider credentials server-side

Client UI should not expose provider credentials or bypass permission-filtered retrieval.

### Require confirmation for persistent changes

AI may propose mutations, but the system must show the exact change and require explicit confirmation before committing.

## Risks / Trade-offs

- Retrieval can leak content if authorization is not enforced at query time.
- AI actions can feel magical unless citations, sources, and confirmations are clear.
