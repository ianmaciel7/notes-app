# Biome Rule Reference

## Rule Naming Convention

- `use*` — enforce/suggest something (e.g. `useConst`, `useSemanticElements`)
- `no*` — deny something (e.g. `noDebugger`, `noArrayIndexKey`)

## Rule Groups

| Group | Purpose |
|---|---|
| `a11y` | Accessibility — ARIA, keyboard nav, semantic HTML |
| `complexity` | Cognitive complexity, unnecessary nesting |
| `correctness` | Bugs, wrong patterns (hooks deps, unused vars) |
| `nursery` | Experimental rules under development |
| `performance` | Performance anti-patterns |
| `security` | Dangerous patterns (e.g. `dangerouslySetInnerHTML`) |
| `style` | Code style (prefer `const`, template literals, etc.) |
| `suspicious` | Likely bugs or confusing patterns |

---

## Rules Commonly Hit in This Project

### `a11y/useSemanticElements`
Use `<nav>`, `<ul>`, `<fieldset>`, `<hr>` instead of `role="navigation"`, `role="list"`, `role="group"`, `role="separator"`.
- **In shadcn/ui**: generated components use `role=` explicitly for compatibility — suppress or override.
- **Fix**: replace the `<div role="...">` with the appropriate semantic element, or add to `overrides`.

### `a11y/noRedundantRoles` ✅ SAFE FIX
Remove `role="navigation"` from `<nav>`, `role="button"` from `<button>`, etc.
- Safe fix removes the redundant attribute.

### `a11y/useAriaPropsForRole`
Elements with interactive ARIA roles (e.g. `role="separator"`) must include required ARIA props (e.g. `aria-valuenow`).
- Applies to shadcn `InputOTPSeparator` — use `overrides` to suppress.

### `a11y/useFocusableInteractive`
Elements with interactive roles must be focusable (have `tabIndex`).
- Common on `<div role="separator">` — use semantic `<hr>` or add `tabIndex`.

### `a11y/noLabelWithoutControl`
`<label>` must reference a control via `htmlFor` or wrap an input.
- `Label` in shadcn/ui is a wrapper component — Biome can't trace the association. Use `overrides`.

### `a11y/useKeyWithClickEvents`
`onClick` handlers need a corresponding keyboard event (`onKeyDown`/`onKeyUp`/`onKeyPress`).
- For purely decorative/addon divs, this is often a false positive on shadcn components.

### `correctness/useExhaustiveDependencies`
Hook dependency arrays should include all referenced values. May flag `setState` setters — these are stable references from React and can be safely removed from deps.
- Fix: `biome-ignore lint/correctness/useExhaustiveDependencies: setState is stable`

### `correctness/noUnusedVariables`
Variables, functions, or parameters declared but never used.
- Unsafe fix: prepends `_` to the name.
- Alternative: delete the variable, or configure `"fix": "none"` if you want errors without auto-rename.

### `suspicious/noArrayIndexKey`
Using array `index` as React key. Keys should be stable identifiers.
- Only safe to use index when the list is static and never reordered.
- Fix: use `item.id` or a stable property as the key.

### `suspicious/noAssignInExpressions`
Assignment inside a condition: `while ((match = re.exec(text)) !== null)`.
- Fix: refactor to `for...of` with `matchAll`, or pre-assign outside the condition.

### `suspicious/noRedundantUseStrict` ✅ SAFE FIX
`"use strict"` at the top of an ES module is redundant (modules are strict by default).
- Safe fix removes the directive.

### `suspicious/noRedundantUseStrict` in CJS files
CJS files (`require()`, `module.exports`) that happen to be treated as modules — Biome may panic on them. Add to `overrides` or exclude them.

### `complexity/noExcessiveCognitiveComplexity`
Function exceeds the configured max complexity (this project: 15).
- Fix: extract sub-functions, reduce nesting, simplify branching.

---

## Configuring Rules

```jsonc
// biome.json
{
  "linter": {
    "rules": {
      "correctness": {
        "noUnusedVariables": {
          "level": "warn",     // "off" | "info" | "warn" | "error"
          "fix": "none"        // "none" | "safe" | "unsafe"
        }
      }
    }
  }
}
```

## Suppressing Inline

```ts
// Suppress a rule on the next line:
// biome-ignore lint/suspicious/noArrayIndexKey: keys are stable here
<li key={index}>{item}</li>

// Suppress across a block:
/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: legacy function */
function myComplexLegacyFn() { ... }
```
