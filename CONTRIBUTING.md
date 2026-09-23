# Contributing Guidelines

Shared UI changes must satisfy the shadcn/Base UI checklist in `CONVENTIONS.md` before submission.

Thank you for contributing to `notes-app`. Please follow these guidelines to keep the repo consistent.

## 1. Prerequisites & Environment Setup
- Package manager: **pnpm 11.20.0**, pinned via `packageManager` in `package.json` — use pnpm, not npm/yarn.
- Node.js version is not pinned in the repo (no `.nvmrc`/`engines` field) — use a current LTS Node compatible with Next.js 16.
- Setup:
  ```bash
  rtk git clone <repository-url>
  rtk pnpm install
  rtk pnpm dev
  ```

When changing MCP servers, skills, integrations, profiles, or generated AI-tool configuration, use the project `agents` CLI through RTK (for example, `rtk agents sync`) and commit only its source files unless the configured synchronization setting says otherwise. Creating, installing, removing, or updating a skill also requires `rtk npx skills update -p -y`, committing the resulting `skills-lock.json` update, and running `rtk agents sync --check` before submitting the change.

To create a repository snapshot for AI-assisted review, run `rtk npx repomix@latest`. The command uses `repomix.config.json`; its generated `repomix-output.xml` is local-only and ignored by Git.

Installing dependencies also initializes Husky through the `prepare` script.
The committed `.husky/pre-commit` hook runs `pnpm run lint-staged` first, then
`pnpm run check:fast` before each commit. This formats and lints staged source
and configuration files before the type, focused lint, dependency-boundary, and
quality-floor checks run locally.

Serena is the project-standard semantic coding MCP server for Codex. Keep its definition in `.agents/agents.json`; do not edit generated `.codex` or `.agents/generated` files directly. Serena should run with `start-mcp-server --context=codex --project-from-cwd` so it resolves the repository from the current working directory.

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
- [ ] `rtk pnpm lint` (Biome check)
- [ ] `rtk pnpm build` (Next.js build succeeds)
- [ ] `rtk pnpm deps:check` (dependency boundary check)
- [ ] `rtk pnpm knip` (unused files, dependencies, and exports check)
- [ ] `rtk pnpm check:fast` (types, focused lint, dependency boundaries, and quality-floor guard)
- [ ] `rtk pnpm check:security` (no high or critical dependency advisories)
- [ ] `rtk pnpm check:osv` (OSV-Scanner finds no known dependency vulnerabilities)
- [ ] `rtk pnpm lighthouse` (production build and Lighthouse CI accessibility audit)
- [ ] Relevant project docs updated if architecture, conventions, design tokens, or intent changed (`ARCHITECTURE.md`, `CONVENTIONS.md`, `DESIGN.md`, `INTENT.md`)
- [ ] `CONSTRAINTS.md` remains satisfied and was not weakened to make checks pass
- [ ] New/changed `src/components/ui/` primitives get a Ladle story (`*.stories.tsx`) — most existing primitives don't have one yet, but new additions should

## Component and performance review

- New component APIs should use composition and existing shadcn/Base UI primitives before introducing boolean modes or custom markup; verify semantic tokens and required accessibility subcomponents.
- For performance-sensitive changes, check for request waterfalls, unnecessary client boundaries, barrel imports, and avoidable re-renders; record measured justification for any optimization abstraction.

## 5. Pull Request Submission & Review
- Describe *what* changed and *why*.
- Include before/after screenshots for UI/design token changes.
- Keep PRs focused; this repo has no automated review gate today, so manual review rigor matters more.
