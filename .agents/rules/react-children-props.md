---
trigger: glob
globs:
  - "src/**/*.tsx"
description: >-
  Keep React component children props explicit and consistently typed as
  React.ReactNode.
---

# React Children Props

When a React component accepts children, declare the prop explicitly as
`children: React.ReactNode`.

Prefer an inline prop object for small components:

```tsx
function Panel({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
```

For exported or reusable prop contracts, use a named type or interface while
retaining the same `React.ReactNode` type. Use `children?: React.ReactNode`
only when the component genuinely supports rendering without children.

Do not use `any`, `JSX.Element`, or an untyped children prop. Do not import
`ReactNode` solely to shorten this contract; use the namespaced
`React.ReactNode` form for consistency across the application.
