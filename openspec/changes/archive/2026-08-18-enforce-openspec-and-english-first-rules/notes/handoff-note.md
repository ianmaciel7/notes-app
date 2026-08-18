# Handoff Note

Change: enforce-openspec-and-english-first-rules

## Summary
Implemented OpenSpec-first and English-first governance through this OpenSpec change.

## Scope
- Added planning artifacts under this change: proposal, specs, design, and tasks.
- Confirmed repository-facing governance requirements for behavior changes and language standards.

## Review / Execution
- Validate: passes with `openspec validate --change "enforce-openspec-and-english-first-rules"`.
- Sync: executed with `openspec sync-specs --change "enforce-openspec-and-english-first-rules" --yes`.

## Usage
- For future contributors: check `openspec-first` and `english-first` rules before coding behavioral work.
- For PRs: reference this change name in PR description when applying governance behavior.
