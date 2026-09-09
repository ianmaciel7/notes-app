# Contributing

Thanks for helping improve Notes App. This repository is a local-first study and knowledge-management system, so contributions should protect user data, preserve offline behavior, and keep the product architecture easy to reason about.

Before changing code, read:

- `AGENTS.md` for repository-specific agent and project rules.
- `ARCHITECTURE.md` for system boundaries and data flow.
- `SECURITY.md` for threat model and secure coding rules.
- `TESTING.md` for test expectations.
- `DEPLOYMENT.md` when touching Firebase, runtime configuration, or deployment behavior.
- `SPEC.md` for the product model and deeper implementation contract.

## Development Setup

Use `pnpm` exclusively.

```bash
pnpm install
pnpm dev
```

Do not use `npm` or `yarn`.

## Common Commands

```bash
pnpm dev
pnpm build
pnpm test:unit
pnpm lint
pnpm format
pnpm check --write .
pnpm ladle:dev
pnpm ladle:build
pnpm ladle:preview
```

Biome is the only linting and formatting tool. Do not add ESLint or Prettier.

## Project Conventions

- Use Next.js App Router patterns and read relevant docs from `node_modules/next/dist/docs/` before framework-sensitive changes.
- Keep React client boundaries lean.
- Use Tailwind CSS v4 CSS-first configuration in `src/app/globals.css`.
- Do not create `tailwind.config.js`, `tailwind.config.ts`, CSS modules, or standalone component stylesheets.
- Prefer existing repository APIs and domain patterns over new abstractions.
- Keep object schemas aligned with `SPEC.md`.
- Use Dexie and repository methods as the local-first write path.
- Keep UI that displays flashcards backed by real workspace data.

## Local-First Data Rules

The browser IndexedDB database is the immediate source of truth for user actions.

When changing data behavior:

- Persist writes through repository methods.
- Mark changed entities with the correct sync status.
- Enqueue sync mutations for remote persistence.
- Preserve immutable identity fields.
- Keep same-space relation cleanup and graph behavior intact.
- Avoid direct table writes from UI components when domain behavior is involved.

## Security Rules

Follow `SECURITY.md` for the authoritative policy.

In short:

- Do not expose server credentials to client code.
- Do not import `firebase-admin` in client components.
- Do not weaken Firebase Auth, Firestore rules, Storage scoping, sync validation, or AI grounding.
- Keep remote data paths user-scoped unless a reviewed authorization model exists.
- Treat uploaded files, parsed documents, AI provider output, source URLs, and sync payloads as untrusted input.
- Do not persist generated flashcards as grounded unless their `exactQuote` matches source text verbatim.

Security-sensitive changes should include focused tests or explicit review notes for the invariant being changed.

## Reader and Highlighting Rules

Do not mutate DOM text nodes for highlights.

For Markdown and web text, use the CSS Custom Highlight API with quote-style anchoring.

For PDFs, use canvas, SVG, or positioned overlay geometry over the text layer.

## AI Generation Rules

AI-assisted flashcard generation must preserve source grounding.

Generated cards should flow through:

1. Structured provider response parsing.
2. Verbatim `exactQuote` matching.
3. Highlight synthesis.
4. Linked flashcard persistence.
5. User-facing review before committing when the UI path supports staging.

Do not give the AI model authority to mutate workspace data, access secrets, execute code, or bypass review.

## Testing Expectations

Use the smallest useful test surface for the risk of the change.

Prefer unit tests for pure logic:

- FSRS scheduling.
- Study pacing.
- Text chunking.
- Card response parsing.
- File type inference.
- Firestore serialization.

Use Dexie-backed tests for repository contracts:

- Entity writes.
- Sync mutation enqueueing.
- Relation cleanup.
- Flashcard provenance.
- Backlinks and local graph behavior.

Use route handler tests for auth, validation, sync, upload, parser, and AI gateway behavior.

Use Ladle or browser tests for UI states, interactions, and rendering behavior that cannot be trusted through unit tests alone.

## Pull Request Checklist

Before opening or merging a PR, confirm:

- The change is scoped to the stated problem.
- Relevant docs are updated when architecture, deployment, testing, or security boundaries change.
- New user-facing behavior uses real repository-backed data where required.
- Security-sensitive paths have focused tests or review notes.
- No secrets, tokens, private documents, or production data are committed.
- Firestore rules stay aligned with any remote path changes.
- AI-generated cards remain quote-grounded before persistence.
- Highlight rendering remains non-mutating.
- Formatting follows Biome.

## Commit Guidance

Use clear, focused commit messages.

Good examples:

```text
Add grounded flashcard parser tests
Tighten storage upload validation
Document Firebase deployment flow
```

Avoid mixing unrelated UI, schema, deployment, and security changes in one commit unless they are required for a single coherent feature.

## Documentation Updates

Update:

- `ARCHITECTURE.md` when system boundaries, data flow, persistence, sync, or AI behavior changes.
- `SECURITY.md` when trust boundaries, reportable findings, accepted risks, or secure coding rules change.
- `DEPLOYMENT.md` when Firebase, hosting, runtime secrets, rules, or operational steps change.
- `TESTING.md` when test tools, strategy, or critical coverage expectations change.
- `CAPACITIES_COMPONENT_MAP.md` when changing Capacities-like UI behavior.

## Code Review Focus

Reviewers should prioritize:

- Data integrity.
- User isolation.
- Local-first behavior.
- Auth and authorization boundaries.
- Parser and upload safety.
- AI grounding correctness.
- UI behavior backed by real data.
- Simplicity and consistency with existing patterns.

Small, boring, well-tested changes are welcome. Large changes are easier to review when split around natural architecture boundaries.
