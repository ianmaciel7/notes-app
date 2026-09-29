# Repository Scripts

This directory contains deterministic repository automation. The canonical tool inventory and command surface live in [`TOOLING.md`](../TOOLING.md) and `package.json`.

- `guards/`: blocking repository policy and architecture checks.
- `hooks/`: agent/editor hook adapters and hook-specific shared logic.
- `verify/`: cross-cutting verification and health orchestration.
- `tooling/`: adapters around external CLIs.

Keep tests and helper modules beside the entry point they support. Prefer stable `pnpm` commands over direct script paths in contributor-facing documentation. Scripts must use repository-relative paths, avoid secrets, remain non-interactive in CI, and avoid product-domain behavior.
