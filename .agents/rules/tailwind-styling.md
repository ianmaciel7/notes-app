---
trigger: glob
globs:
  - "src/**/*.tsx"
  - "src/**/*.css"
description: >-
  Tailwind CSS v4 styling rules aligned with shadcn-first and existing semantic theme tokens.
---

# Tailwind CSS v4 Styling Rules

## 1. CSS-First Architecture

- Use the installed Tailwind CSS v4 configuration in `src/app/globals.css`.
- Do not introduce `tailwind.config.js`, `tailwind.config.ts`, component CSS modules, or standalone component stylesheets.
- Do not use `@apply`.

## 2. Component Styling & Semantic Tokens

- Follow `.agents/rules/shadcn-first.md` for component composition and style contracts.
- Use configured semantic theme tokens (`bg-background`, `bg-card`, `bg-sidebar`, `border-border`, `text-foreground`, `text-muted-foreground`, `ring-ring`).
- Do not hardcode raw palette colors (e.g. `bg-blue-500`) or write separate light/dark color overrides when a semantic token is available.
- Always use `cn` from `@/lib/utils` to merge classes.
- Do not use `!important` to force layout or specificity fixes.

## 3. Layout, Typography & Verification

- Keep sidebar visibility, drag-resizing, and mobile presentation distinct.
- Verify affected light/dark themes, overflow, keyboard focus, responsive layout, and reduced-motion behavior.
- Never claim visual parity without browser or test evidence.
