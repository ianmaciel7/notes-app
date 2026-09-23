# Notes App

A pre-MVP component and design-system foundation for a future notes application — no note-taking feature exists yet; see [`INTENT.md`](./INTENT.md) for what's decided and what's still open.

## Getting Started

Prerequisites: Node.js (current LTS), pnpm 11.20.0 (pinned via `packageManager` in `package.json`)

```bash
rtk pnpm install
rtk pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Usage
There's nothing to show yet — `src/app/page.tsx` is still the unedited Next.js starter page. What exists so far is a library of 61 UI primitives under `src/components/ui/` (see [`DESIGN.md`](./DESIGN.md)), viewable via Ladle:

```bash
rtk pnpm ladle
```

To create an AI-friendly repository snapshot, run Repomix with the checked-in
configuration:

```bash
rtk npx repomix@latest
```

This writes `repomix-output.xml`, which is intentionally ignored by Git. See
[`repomix.config.json`](./repomix.config.json) for the packing and security
settings.

## Quality Checks

Run the repository checks before submitting changes:

```bash
rtk pnpm lint
rtk pnpm build
rtk pnpm deps:check
rtk pnpm knip
```

There is no automated test runner yet; Ladle is the current component and visual
verification tool.

## Project Status
Pre-MVP scaffold. See [`INTENT.md`](./INTENT.md) for the current problem statement, constraints, and open questions (e.g. what a "note" is, whether auth is needed).

## Contributing
See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for setup, branching, and PR expectations.

## Agent configuration

Use the project-configured `@agents-dev/cli` (`agents`) for MCP servers, skills, integrations, profiles, and generated tool configuration. Prefix its shell commands with `rtk`, for example `rtk agents sync` and `rtk agents sync --check`. The committed source of truth is `.agents/agents.json` plus `.agents/skills/`; creating, installing, removing, or updating a skill always requires refreshing the legacy `skills-lock.json` with `rtk npx skills update -p -y` and committing the resulting lock-file change.

The project enables Serena for Codex as a semantic code-retrieval and editing MCP server. Serena discovers this repository from the agent's working directory and uses `.serena/project.yml` for project settings; use `.serena/project.local.yml` for local-only overrides. Run `rtk agents status` to confirm it is selected and `rtk agents sync` after changing the shared MCP configuration.

## Documentation
- [`INTENT.md`](./INTENT.md) — why this exists, for whom, and current open questions
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system structure and tech stack
- [`CONTEXT.md`](./CONTEXT.md) — project vocabulary / ubiquitous language
- [`CONVENTIONS.md`](./CONVENTIONS.md) — coding standards
- [`DESIGN.md`](./DESIGN.md) — design system and UI primitives
- [`TESTING.md`](./TESTING.md) — test strategy and commands
- [`SECURITY.md`](./SECURITY.md) — security policy
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to contribute
- [`AGENTS.md`](./AGENTS.md) — brief for AI coding agents working in this repo
- [`repomix.config.json`](./repomix.config.json) — repository snapshot configuration

## License
Unlicensed / private.
