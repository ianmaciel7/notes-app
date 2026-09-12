# Mandatory Documentation Visibility Rule (Ladle Stories Invariant)

## Strict Rule Definition
Any markdown documentation file created or updated under the `docs/` directory hierarchy (e.g. `docs/architecture/`, `docs/decisions/`, `docs/design/`, `docs/guides/`, `docs/reference/`) **MUST ALWAYS** have a corresponding story exported in the appropriate `.stories.tsx` file (e.g., `docs/architecture/architecture.stories.tsx`, `docs/decisions/decisions.stories.tsx`).

## Core Invariants:
1. **Never Orphan Documentation**: It is strictly forbidden to add or modify a `.md` document under `docs/` without importing it into its domain's `.stories.tsx` suite.
2. **Immediate Synchronization**: Whenever a new specification, ADR, guide, design doc, or entity reference is authored, the story file must be updated in the same commit / turn.
3. **Ladle Workbench Verification**: Verify that the story exports properly using `pnpm build` or Ladle preview to guarantee renderability in the interactive DocViewer component.
