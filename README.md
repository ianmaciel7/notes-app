# Notes App

A pre-MVP component and design-system foundation for a future notes application — no note-taking feature exists yet; see [`INTENT.md`](./INTENT.md) for what's decided and what's still open.

## Getting Started

Prerequisites: Node.js (current LTS), pnpm 11.20.0 (pinned via `packageManager` in `package.json`)

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Usage
There's nothing to show yet — `src/app/page.tsx` is still the unedited Next.js starter page. What exists so far is a library of ~60 UI primitives under `src/components/ui/` (see [`DESIGN.md`](./DESIGN.md)), viewable via Ladle:

```bash
pnpm ladle
```

## Project Status
Pre-MVP scaffold. See [`INTENT.md`](./INTENT.md) for the current problem statement, constraints, and open questions (e.g. what a "note" is, whether auth is needed).

## Contributing
See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for setup, branching, and PR expectations.

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

## License
Unlicensed / private.
