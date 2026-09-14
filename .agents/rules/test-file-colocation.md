# Test File Colocation

Test files MUST be colocated with the implementation they exercise at the same directory level.

- Name tests with the implementation name and a supported test suffix, such as `dal.test.ts` beside `dal.ts`.
- Do not create nested `__tests__` directories for project tests.
- When updating an existing test under `__tests__`, move it to the corresponding implementation directory before modifying it, unless a tool or framework requires the directory for a documented reason.
- Keep shared test fixtures near the tests that consume them, or in an explicitly named shared test-support directory.
