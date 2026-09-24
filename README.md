# Notes App

Pre-MVP foundation for a future notes product. The repository currently provides the
application shell, shared UI primitives, and design-system groundwork; product scope
is still being defined in [`INTENT.md`](./INTENT.md).

## Getting Started

Prerequisites: a current Node.js LTS release and pnpm 11.20.0, pinned by
`packageManager` in `package.json`.

```bash
rtk pnpm install
rtk pnpm dev
```

Open http://localhost:3000.

## Development

The product surface is still a scaffold. Shared UI can be explored with Ladle:

```bash
rtk pnpm ladle
```

For contribution checks and pull-request expectations, use
[`CONTRIBUTING.md`](./CONTRIBUTING.md). AI coding agents should start with
[`AGENTS.md`](./AGENTS.md).

## Documentation

- [`INTENT.md`](./INTENT.md) — product purpose, scope, non-goals, and open questions
- [`CONTEXT.md`](./CONTEXT.md) — domain vocabulary
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system structure and boundaries
- [`CONVENTIONS.md`](./CONVENTIONS.md) — code-writing rules
- [`DESIGN.md`](./DESIGN.md) — design system and UI language
- [`TESTING.md`](./TESTING.md) — test and verification strategy
- [`SECURITY.md`](./SECURITY.md) — security posture and security tooling
- [`CONSTRAINTS.md`](./CONSTRAINTS.md) — non-regression quality floor
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — contribution, Git, and PR workflow
- [`AGENTS.md`](./AGENTS.md) — agent routing and always-on contract
- [`RTK.md`](./RTK.md) — RTK-specific command-wrapper guidance

## License

Unlicensed / private.
