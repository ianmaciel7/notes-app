# Worktree Code Quality Control Patterns

### Key Testing & Quality Control Strategies Derived from .worktrees/old*

1. **Pure Domain Testing (old-9)**:
   - Separate pure domain logic (grading, exam validation, FSRS math) from frameworks and DBs.
   - Use table-driven it.each in Vitest without mocks. Tests run in microseconds and are immune to UI/DB churn.

2. **Source-Scanning Micro-Contracts (old-4, old-5)**:
   - Enforce architectural rules directly in test suites by reading source files from disk (e.g. forbidding dangerouslySetInnerHTML, native title= tooltips, or requiring useDeferredValue on high-frequency inputs).

3. **AST Complexity Gates (old-3, old-4, old-5)**:
   - Biome cognitive complexity limit of 15 (noExcessiveCognitiveComplexity: error).
   - AST-based cyclomatic complexity script using TypeScript Compiler API (max 10-12 branch points).

4. **Multi-Tenant Composite Keys (old-5)**:
   - Enforce compound primary keys [spaceId, id] on all tenant tables to prevent cross-space data leakage.

5. **Default-Deny Security Emulator Testing (old-9)**:
   - Run serial Vitest emulator suite (vitest.firebase.config.ts, maxWorkers: 1) with afterEach REST document deletion.
   - Assert unauthenticated direct client REST access to Firestore fails with HTTP 403 while Admin SDK operations succeed.

6. **Interaction & Layout Parity Specs (old-4, old-5)**:
   - Playwright suites testing 6 responsive breakpoints (1536px down to 390px) verifying zero horizontal overflow (scrollWidth <= innerWidth), focus traps, and drawer dismissal with Escape.
