# Agent Instructions

## Graphify

- Use `graphify query "<question>"` first for codebase questions when `graphify-out/graph.json` exists.
- Use `graphify path "<A>" "<B>"` for relationships between files, symbols, or concepts.
- Use `graphify explain "<concept>"` for focused concept context.
- Use `graphify-out/wiki/index.md` for broad navigation when it exists.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain is insufficient.
- Dirty `graphify-out/` files are expected after hooks or incremental updates.
- After modifying code or agent files, run `graphify update .`.
- When the user types `/graphify`, use the installed graphify skill or instructions before anything else.

## Context7

- Use `npx ctx7@latest` for current docs when the user asks about a library, framework, SDK, API, CLI tool, or cloud service.
- Do not use Context7 for refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.
- Resolve first with `npx ctx7@latest library <name> "<what to look up>"` unless the user provides a `/org/project` ID.
- Fetch docs with `npx ctx7@latest docs <libraryId> "<what to look up>"`.
- Keep each docs query to one concept unless the question is specifically about how concepts interact.
- Do not run more than 3 Context7 commands per question.
- Do not include API keys, passwords, credentials, personal data, or proprietary code in Context7 queries.
- Run Context7 outside Codex's default sandbox; if DNS/network errors occur, rerun outside the sandbox.
- If quota fails, tell the user and suggest `npx ctx7@latest login` or `CONTEXT7_API_KEY`.

## Custom Agents

- Reusable role files live in `.agents/agents/*.md`.
- Follow `.agents/skills/custom-agent/SKILL.md` when creating, reviewing, renaming, or improving role files.
- Keep role files short, explicit about edit permissions, and clear about verification or handoff.
- Follow `.agents/skills/skill-creator/SKILL.md` when editing skills under `.agents/skills/`.

## Instruction Scope

- Update `AGENTS.md` for durable repo-wide instructions that every coding agent should see.
- Create or update a narrower rule file when the instruction is tool-specific, experimental, generated, or only applies to one workflow.
- Prefer a nested `AGENTS.md` only when a subtree needs different commands or conventions from the repo root.
- Keep temporary task notes out of `AGENTS.md`; put repeatable workflow guidance in a skill under `.agents/skills/`.
- Do not duplicate the same instruction in `AGENTS.md` and a rule file; link to the narrower source when possible.

## Commands

| Task | Command |
|------|---------|
| Update graph | `graphify update .` |
| Graph query | `graphify query "<question>"` |
| Graph path | `graphify path "<A>" "<B>"` |
| Graph explain | `graphify explain "<concept>"` |
| Resolve docs | `npx ctx7@latest library <name> "<what to look up>"` |
| Fetch docs | `npx ctx7@latest docs <libraryId> "<what to look up>"` |

## External References

| Need | File |
|------|------|
| Custom agent roles | `.agents/agents/*.md` |
| Custom agent workflow | `.agents/skills/custom-agent/SKILL.md` |
| Skill authoring | `.agents/skills/skill-creator/SKILL.md` |
| Knowledge graph | `graphify-out/graph.json` |
