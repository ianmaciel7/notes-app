# Enable React Compiler

We needed fine-grained render optimization without manual memoization overhead across application components. We enabled the React Compiler (`reactCompiler: true`) in Next.js to automate memoization at build time, eliminating manual `useMemo` and `useCallback` boilerplate.
