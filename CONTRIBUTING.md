# Contributing Guidelines

Shared UI changes must satisfy the shadcn/Base UI checklist in `CONVENTIONS.md` before submission.

Thank you for contributing to `notes-app`. Please follow these guidelines to keep the repo consistent.

## 1. Prerequisites & Environment Setup
- Package manager: **pnpm 11.20.0**, pinned via `packageManager` in `package.json` — use pnpm, not npm/yarn.
- Node.js version is not pinned in the repo (no `.nvmrc`/`engines` field) — use a current LTS Node compatible with Next.js 16.
- Setup:
  ```bash
  git clone <repository-url>
  pnpm install
  pnpm dev
  ```

## 2. Branching Strategy
- Main branch: `main`.
- In practice this repo's branch names have not followed a strict `feat/`/`fix/` pattern (existing branches include `context-engineering`, `dev`, `stag`, tool-specific branches like `anthropic-skill`/`mattpocock-skill`, and numbered `old-*` archive branches). If starting a new pattern, prefer Conventional-Commits-style prefixes (`feat/<short-description>`, `fix/<short-description>`, `docs/<short-description>`) since commit messages already follow that convention (see §3).

## 3. Commit Message Standards
- The existing git history follows **Conventional Commits** (`feat:`, `docs:`, e.g. `feat: add new agent skills and workflows`, `docs: add project context and initial architecture decision records`) — continue that pattern:
  - `feat`: a new feature
  - `fix`: a bug fix
  - `docs`: documentation-only changes
  - `refactor`: a code change that neither fixes a bug nor adds a feature
  - `chore`: build process or tooling changes

## 4. Pre-Flight Checklist Before Submitting PR
There is no CI and no test suite yet (see `TESTING.md`), so these are manual checks:
- [ ] `pnpm lint` (Biome check)
- [ ] `pnpm build` (Next.js build succeeds)
- [ ] Relevant project docs updated if architecture, conventions, design tokens, or intent changed (`ARCHITECTURE.md`, `CONVENTIONS.md`, `DESIGN.md`, `INTENT.md`)
- [ ] New/changed `src/components/ui/` primitives get a Ladle story (`*.stories.tsx`) — most existing primitives don't have one yet, but new additions should

## Component and performance review

- New component APIs should use composition and existing shadcn/Base UI primitives before introducing boolean modes or custom markup; verify semantic tokens and required accessibility subcomponents.
- For performance-sensitive changes, check for request waterfalls, unnecessary client boundaries, barrel imports, and avoidable re-renders; record measured justification for any optimization abstraction.

## 5. Pull Request Submission & Review
- Describe *what* changed and *why*.
- Include before/after screenshots for UI/design token changes.
- Keep PRs focused; this repo has no automated review gate today, so manual review rigor matters more.
