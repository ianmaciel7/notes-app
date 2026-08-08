# Design

## Principles

- Prefer the simplest correct solution that fits the current codebase.
- Use existing project patterns, platform APIs, and dependencies before adding new abstractions.
- Keep modules focused and avoid coupling unrelated concerns.
- Keep documentation, rules, and examples system-agnostic unless they describe this repository's actual implementation.

## Frontend

- Follow the A11Y.md Standard profile for WCAG 2.2 AA unless a task explicitly sets another profile.
- Prefer native semantic HTML.
- Do not use clickable `div` or `span` elements.
- Keep every interaction keyboard-operable with visible focus and correct focus management.
- Provide connected labels for form controls and meaningful `alt` text for informative images.
- Meet contrast requirements: 4.5:1 for text and 3:1 for UI components or meaningful graphics.
- Do not convey state by color alone; pair color with text, iconography, or another cue.
- Respect `prefers-reduced-motion` for animations and transitions.
- Record accepted accessibility violations in `EXCEPTIONS.md`.
- Record conformant accessibility pattern decisions in `A11Y-DECISIONS.md`.

## State And Data

The current app has no persistent application data model. When state or data flows are introduced, document accepted architecture in `docs/ARCHITECTURE.md` and design rationale in OpenSpec for significant changes.

## Error Handling

- Prefer explicit, user-appropriate error states over silent failures.
- Keep error handling close to the boundary that can recover or present the failure.
- Avoid leaking secrets or sensitive implementation details in user-facing errors.

## Maintainability

- Keep generated files out of manual edits.
- Avoid duplicating the same rule or workflow across multiple documents.
- Use links to canonical docs instead of copying detailed instructions.
- Before adding semantic indexes, memory systems, or context middleware, record security review and benchmark evidence in `docs/AGENT_CONTEXT_EFFICIENCY_AUDIT.md`.
