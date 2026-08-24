# Verification Lifecycle

All agents, subagents, and contributors MUST follow a strict verification lifecycle before and after any code, configuration, or documentation modifications.

## Mandatory Policy

Operating rules are active contracts. They must never be bypassed, assumed, or checked only in retrospect.

### 1. Pre-Modification Check (Before Changing Code or Docs)

Before creating or editing any file:

1. **Identify and Re-read Applicable Rules**:
   - Consult `.agents/rules/*` and primary entrypoints (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`).
   - For UI components and styling: check `shadcn-first.md`, `component-deduplication.md`, `workspace-ui-parity.md`, and `input-performance.md`.
   - For architecture, server/client boundaries, and routing: check `nextjs-server-architecture.md`.
   - For language and commit style: check `english-first.md` and `git-workflow-rule.md`.
   - For proposals and specs: check `openspec-first.md`.
2. **Audit Context & Existing Patterns**:
   - Verify existing repository conventions, existing components, and project structure before proposing or authoring new files.
3. **Verify Constraints**:
   - Ensure the planned change does not violate design tokens, accessibility requirements, component contracts (`data-slot`), or server/client isolation.

### 2. During Modification

- Adhere strictly to the verified rules during authoring.
- Use native types, semantic HTML, designated color tokens, and existing project utilities (e.g. `cn()`).
- Do not introduce temporary shortcuts, arbitrary styles, or duplicate components.

### 3. Post-Modification Verification (After Making Changes)

Immediately after editing or creating files, and before concluding any task or handing off work:

1. **Re-read Modified Diffs Against Rules**:
   - Review every changed file against all applicable rules identified in the pre-modification phase.
   - Confirm that no duplicate components, untyped props, missing `data-slot` attributes, or broken contracts were introduced.
2. **Execute Targeted Verification Checks**:
   - Run relevant validation commands (e.g. file-scoped `pnpm exec biome check <file>`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, or `pnpm verify`).
   - Fix any linter, type, or test errors immediately.
3. **Confirm Zero Rule Drift**:
   - Ensure repository documentation is kept synchronized if workflow or rules were altered.

### 4. Subagent & Context Delegation Mandate

When delegating tasks to subagents or receiving results back from subagents:
- The delegating agent and the subagent MUST explicitly review and enforce the verification lifecycle.
- Subagents must verify pre-conditions before acting and validate post-conditions before returning.
