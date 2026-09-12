# Component Development & Ladle Guide

This project uses **Ladle** (`@ladle/react`) for fast component development, story isolation, and architectural documentation rendering.

---

## Commands

- `pnpm ladle:dev` / `npm run ladle:dev`: Starts the Ladle development server at `http://localhost:61000`.
- `pnpm ladle:build` / `npm run ladle:build`: Builds a static Ladle catalog.
- `pnpm ladle:preview` / `npm run ladle:preview`: Previews the built Ladle site locally.

---

## Features & Conventions

1. **Markdown & Mermaid Support**:
   - Component stories under `docs/**/*.stories.tsx` can render Markdown files (with raw imports `?raw`) using `<ArchitectureDocViewer />`.
   - Mermaid diagrams (` ```mermaid `) inside Markdown are rendered interactively with automatic light/dark theme adaptation.

2. **Global Language Switcher (`pt-BR` / `en`)**:
   - Ladle stories include a radio control to toggle the active `locale` between Brazilian Portuguese (`pt-BR`) and English (`en`).
   - Sourced via `next-intl` configuration and `src/lib/i18n-locale.ts`.

3. **Story Directory Structure**:
   - Place architectural stories alongside their respective feature docs in `docs/architecture/<feature>/`.
