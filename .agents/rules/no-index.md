# No Index Files Rule

- Never create or use `index.ts` or `index.tsx` (barrel files).
- Always import directly from the specific module file (e.g., `@/lib/i18n/provider`, `@/lib/i18n/auth-errors`, `@/lib/auth/client-session`) instead of importing from directory roots or barrel exports.
- Do not create re-exporting barrel files to aggregate a folder's exports.
- This ensures optimal tree-shaking, prevents circular dependencies, maximizes Turbopack compilation speed, and eliminates module resolution ambiguities.
