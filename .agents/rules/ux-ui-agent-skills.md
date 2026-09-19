# UX/UI Agent Skills

This project uses a deliberately small UX, UI, frontend, accessibility, and
performance skill stack. External skills are read-only and must not be edited
locally.

## Project-installed core

The following skills are installed in `.agents/skills/` for this project and
are available to Antigravity, Antigravity CLI, Codex, and Gemini CLI:

- `product-design-and-ux` — information architecture, task flows, states,
  error recovery, cognitive demand, progressive disclosure, and interaction
  patterns.
- `web-accessibility` — WCAG 2.2, WAI-ARIA, keyboard navigation, focus
  management, semantic HTML, reflow, and accessible interaction patterns.
- `impeccable` — visual hierarchy, density, typography, layout, polish,
  responsive refinement, motion, edge cases, and UI consistency.
- `frontend-ui-engineering` — production frontend implementation,
  component architecture, responsive behavior, state handling,
  maintainability, and performance-aware implementation.
- `browser-testing-with-devtools` — rendered DOM, accessibility tree, console,
  network behavior, screenshots, computed styles, runtime interactions, and
  browser performance.
- `performance-optimization` — measure, identify, fix, and verify; including
  Core Web Vitals, LCP, INP, CLS, and perceived performance.
- `web-design-guidelines` — final audit for interaction, forms, typography,
  accessibility, focus, animation, usability, and implementation mistakes.

## Global on-demand skills

These remain globally installed but should be selected only when their
specialization is genuinely needed:

- `frontend-design` for a new visual direction or a non-generic surface.
- `heuristic-evaluation` for a formal Nielsen heuristic review.
- `design-token-audit` for token coverage, drift, and hard-coded values.
- `motion-system` for product-wide motion tokens, easing, choreography, and
  reduced-motion policy.
- `cognitive-load-assessment`, `memory-load-reduction`,
  `wayfinding-navigation`, `error-prevention-recovery`, and
  `plain-language-design` for focused cognitive-accessibility work.

## Routing

Use the smallest applicable set:

- UX or flow problem: `product-design-and-ux`.
- Accessibility implementation: `web-accessibility`.
- Existing UI polish: `impeccable`.
- New visual direction: `frontend-design` plus `impeccable`.
- Frontend implementation: `frontend-ui-engineering`.
- Rendered UI QA: `browser-testing-with-devtools`.
- Performance work: `performance-optimization` plus
  `browser-testing-with-devtools`.
- Token inconsistency: `design-token-audit`.
- Product-wide motion system: `motion-system`.
- Formal usability audit: `heuristic-evaluation`.
- Final UI audit: `web-design-guidelines`.

Do not load the complete stack automatically. Add a specialization only when
it contributes a distinct capability.

## Pending and future work

- Do not install `design-taste-frontend`, `improve-ui`,
  `frontend-ui-ux-skill`, redundant heuristic alternatives, or whole Owl
  collections without a demonstrated capability gap.
- Keep AI/Agent UX skills classified as `ON-DEMAND FOR AI PROJECTS`; do not
  install the AI collection for ordinary product work.
- Keep `ux-standards` as `FUTURE CUSTOM` until a mature public skill covers
  the required ISO, W3C, WCAG, ARIA/APG, COGA, design-token, and foundational
  UX sources without inventing a local implementation.

## Sources

- Global inventory: `~/.agents/skills`.
- Project inventory: `.agents/skills/`.
- Installation and agent mapping: `npx skills ls -g -a antigravity -a
  antigravity-cli -a codex -a gemini-cli`.
