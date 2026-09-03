# GitHub Copilot Instructions

This project is a local-first, zero-operating-cost web application unifying Capacities, Readwise Reader, and Anki FSRS.

## Guidelines & Architecture:
- **Package Manager**: Use `pnpm` exclusively (`pnpm add`, `pnpm run dev`, `pnpm build`). Never run `npm` or `yarn`.
- **Linting & Formatting**: Biome is the sole standard (`pnpm check --write .`). Do NOT install or configure ESLint or Prettier.
- **Styling**: Tailwind CSS v4 CSS-first (`@theme` in `src/app/globals.css`). Do NOT generate `tailwind.config.js`.
- **Framework**: Next.js 16 App Router + React 19. Check `node_modules/next/dist/docs/` for breaking changes. Keep `'use client'` components minimal.
- **Highlighting**: Zero DOM mutation. Use CSS Custom Highlight API (`CSS.highlights.set()`) for text and SVG overlay for PDFs.
- **Database**: Dexie.js (`KnowledgeOS_DB` at `src/lib/db.ts`) is the primary local-first store. Background sync with Cloud Firestore.
- **SRS**: Modern FSRS algorithm (`Again=1`, `Hard=2`, `Good=3`, `Easy=4`) with goal-driven burndown pacing.
- **Security**: Protect Gemini / Groq credentials in `/api/ai/generate`. Never expose secrets or `firebase-admin` to client components.

Consult `AGENTS.md`, `SPEC.md`, and `DECISIONS.md` for complete architectural rules and schemas.
