## Why

The repository currently carries equivalent agent instructions and OpenSpec workflows in canonical and vendor-specific locations, which creates drift and makes the intended source of truth ambiguous. Standardizing on `AGENTS.md` and `.agents/` keeps project knowledge portable across compatible coding agents.

## What Changes

- **BREAKING** Remove repository-level vendor-specific agent configuration trees: `.agent/`, `.codex/`, and `.gemini/`.
- Remove redundant vendor entrypoint files when they only duplicate or point at `AGENTS.md`.
- Keep reusable skills, rules, agents, workflows, and MCP recommendations only under `.agents/`.
- Update `.gitignore` so vendor-specific agent directories cannot be reintroduced as tracked project configuration.
- Update references that describe Gemini/Codex/Antigravity project config as canonical.

## Capabilities

### New Capabilities

### Modified Capabilities
- `repository-governance`: Require vendor-neutral agent configuration through `AGENTS.md` and `.agents/`, while preserving OpenSpec as the requirements/change lifecycle owner.

## Impact

- Affected repository configuration: `AGENTS.md`, `.agents/`, `.gitignore`, `GEMINI.md`, `.geminiignore`, `.agent/`, `.codex/`, `.gemini/`.
- Affected documentation/specs: `docs/AGENT_CONTEXT_EFFICIENCY_AUDIT.md`, `openspec/specs/repository-governance/spec.md`.
- No runtime application code, dependencies, or deployment behavior changes.
