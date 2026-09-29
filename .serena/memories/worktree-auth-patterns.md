# Worktree Auth & Multi-Space Tenancy Invariants (Scouted from .worktrees/old-9 & old-5)

1. **Session & Action Auth**:
   - Implemented in `src/data/action-auth.ts` (`requireActionUser`) using HttpOnly Firebase Session cookies (`SESSION_COOKIE`) verified server-side with Firebase Admin SDK.
   - Prevents token replay and provides constant-time authorization error handling (uniform `forbidden` / 404 behavior to defeat resource existence enumeration attacks).

2. **Space-Scoped Data Isolation & Security Rules**:
   - `firestore.rules` enforces defense-in-depth: direct client SDK reads and writes to `/spaces/{spaceId}/**` and `/exams/{examId}/**` are blocked (`allow read, write: if false;`).
   - All mutations, link management, and answers are executed through authenticated Server Actions with transactional ownership verification (`getOwnedSpace(requesterId, spaceId)`).

3. **Optimistic Concurrency Control (OCC)**:
   - Space objects and memory records store a strict `stateVersion: number`.
   - Firestore transactions verify `currentVersion === stateVersion` and increment on write, throwing `stale-state` on concurrent conflicting writes.