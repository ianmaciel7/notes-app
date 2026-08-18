## Why

The repository already uses OpenSpec in many places, but the process and language expectations were not captured consistently in a change-specific way. This caused repeated questions about when to use OpenSpec and whether commit/workflow docs should remain in Portuguese, leading to inconsistent execution and review friction. Creating this change provides a single source of truth for behavior.

## What Changes

- Add a defined OpenSpec-driven capability for workflow enforcement, including mandatory use of OpenSpec steps for behavior changes.
- Add explicit rules that all repository-facing documentation, commit-facing text, and implementation-facing artifacts must be written in English.
- Define when each OpenSpec skill should be used and require traceability between planning and implementation.
- Enable team and automation consistency across branches and sessions by making this process explicit before development.

## Capabilities

### New Capabilities
- `developer-workflows/openspec-enforcement`: Agents and contributors SHALL follow a formal OpenSpec-first process for behavioral changes and SHALL keep repository-facing artifacts in English by default.

### Modified Capabilities
- none

## Impact

- Affects repository governance and documentation standards used by agents and contributors.
- No production runtime behavior, APIs, external dependencies, or data model changes.
- Applies to future engineering workflow and PR preparation across `notes-app`.