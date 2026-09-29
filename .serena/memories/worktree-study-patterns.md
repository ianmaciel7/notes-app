# Worktree Study & Spaced Repetition Patterns (Scouted from .worktrees/old-5, old-8, old-9, old-prototype)

1. **FSRS v5.4 with Deterministic Settings**:
   - Prefer standard `ts-fsrs` v5.4 over custom math (`old-5`) or basic SM-2 (`old-prototype`).
   - Standard parameters: `request_retention: 0.9`, `enable_fuzz: false`, explicit `schedulerVersion` and `parametersVersion`.
   - Card state versioning (`stateVersion`) for transactional OCC.

2. **Deterministic Priority Queueing**:
   - Overdue reviews sorted by `dueAt ASC`, followed by new cards sorted by `createdAt ASC`.
   - 2-stage UX: Answer presentation/selection -> Dynamic preview interval badges (Forgot, Earlier, Normal, Later / Again, Hard, Good, Easy) -> State transition.

3. **Session Timers & Grace Period**:
   - Server-enforced exam deadline with grace window (`EXAM_GRACE_MS = 15000`) in `old-prototype`.
   - Late submission gracefully trims expired answers rather than wiping complete progress.

4. **Retention & Error Analytics**:
   - `error-analysis.ts` (`old-8`): Computes retention rate, error rate, total lapses, and identifies leeches / trouble cards from immutable review audit logs.