---
name: verify-code
description: Verify code against CONVENTIONS.md and CONSTRAINTS.md. Runs every gate those two documents declare (types, Biome, conventions, naming, props, UI pattern, RSC, i18n, emojis, dependency-cruiser, floor guard, duplication, and with a wider scope coverage and docs), maps failures back to the convention rules behind them, then walks the review-only rules that no tool decides. Use whenever the user asks to verify, validate, audit, or check code, conventions, or constraints, asks "is this ready", "does this follow our standards", or "run the quality gates", and before handoff, commit, or PR. Use it even when they do not name the two documents. For whole-repo health including harness and token metrics use verify-health; for markdown docs use verify-docs.
---

# Verify Code

Checks the code against the two documents that define "correct" in this repository:

- `CONSTRAINTS.md`: the non-regression floor and the gates with numbers.
- `CONVENTIONS.md`: how code is written, with an Enforcement Index naming the one gate that enforces each rule, or `review-only` when no tool can decide it.

Code is only verified once both halves are done: the gates pass **and** the review-only rules were checked by reading the diff. Passing gates alone leaves those rules unchecked, because no tool looks at them.

## 1. Run the gates

```bash
rtk pnpm run verify:code
```

The script reads the gates from the documents, so a gate added to `CONSTRAINTS.md` or a rule added to the Enforcement Index is picked up without editing the script.

| Scope | Runs | Use when |
| --- | --- | --- |
| `--scope task` (default) | Gates with "task end" in `CONSTRAINTS.md`, plus every Enforcement Index enforcer | Finishing a task, before handoff |
| `--scope ci` | `task` plus CI-only gates (coverage, docs, harness, guard tests) | Before opening a PR |
| `--scope all` | `ci` plus on-demand gates (Lighthouse, dependency audit) | Release or security review |

Other flags: `--only check:ui-pattern,check:props` reruns specific gates while fixing, `--fail-fast` stops at the first failure, `--list` prints the plan without running, `--json` gives machine-readable output.

Exit code 0 means every gate passed, 1 means a gate failed, 2 means the documents and `package.json` disagree (a gate names a script that does not exist, or a review-only rule has no checklist entry). Exit 2 is a documentation bug to fix first; nothing was run.

`pnpm run test` (Vitest) is part of `check:fast` but is not a `CONSTRAINTS.md` gate by itself; coverage runs it under `--scope ci`. After large changes, run `rtk pnpm run test` as well.

## 2. Fix failures at the source

A failed gate names the convention rules it enforces, so read those rule texts in `CONVENTIONS.md` before changing code. Fix the code, then rerun with `--only <gate>` until it passes, then rerun the full scope once, since a fix for one gate can break another.

Do not make a gate pass by weakening it: no `@ts-ignore`, `biome-ignore`, skipped tests, deleted assertions, lowered thresholds, or `--no-verify`. `CONSTRAINTS.md` forbids all of these, and `check:floor` reports them. An exception is allowed only with an owner, a reason, and an expiry, and only when the user asks for it.

## 3. Review the review-only rules

The report ends with the rule ids no tool checks. Open `references/review-checklist.md` and, for each rule that applies to a changed file, read the diff against it:

```bash
rtk git diff origin/main --name-only
```

Report each rule as pass, fail with `file:line`, or not applicable. The checklist also covers the Floor items without a full mechanical check: secrets in source and the browser baseline.

For every application component file under `src/components/` **outside**
`src/components/ui/` and `src/components/firebase/`, apply one uniform
component-file rule: the file declares exactly one React component, and exports
exactly one canonical application component whose name matches the file's
product role. Export its props type when useful, but do not define or export
helper components, aliases, screen-name variants, or alternate component names
in the same file. This rule applies equally to cards, forms, descriptions,
shells, and auth screens; do not make an exception because one file happens to
contain more JSX or more behavior.

Scope is defined by exclusion, so a new folder under `src/components/` (for
example `src/components/notes-app/` today, or any future domain folder) is
covered without editing this skill. `ui/` (shadcn/Base UI registry primitives,
which keep their upstream multi-part anatomy) and `firebase/` (unmodified
Firebase UI registry components, never edited) are the only exempt folders.
Test files (`*.test.tsx`) and story files are not component files.

Compound components are not used in this repository, and `check:props`
(`single-component-per-file`) now fails on them. A file that declares a
root component plus sibling parts (`ConnectionAlert`, `ConnectionAlertTitle`,
`ConnectionAlertAction`) is a failure even when each part is small, even when
the parts share a `createContext`, and even when TypeScript, Biome, and every
gate pass. The gate covers the whole folder, but it only sees top-level PascalCase
function/arrow declarations, `createContext`, and `Object.assign`. As a
cross-check, and when the gate cannot run, run the detection below on the whole
folder, not only on changed files, because a file that was never touched still
violates the rule.

```bash
# Scope: application component folders only; skips ui/, firebase/, tests, stories.
G="--glob !**/ui/** --glob !**/firebase/** --glob !*.test.tsx --glob !*.stories.tsx"

# 1. More than one component declared in a file (function or arrow/memo/forwardRef).
rtk rg -c "^(export )?(default )?function [A-Z]\w*|^(export )?const [A-Z]\w*\s*(:[^=]+)?=\s*(memo\(|forwardRef\(|\(|async \()" src/components $G | awk -F: '$NF>1'

# 2. More than one PascalCase value in the trailing export block (parts or aliases).
for f in $(rtk rg -l "^export \{" src/components $G); do
  n=$(awk '/^export \{/{p=1;next} p&&/^\}/{p=0} p' "$f" | grep -vE "^\s*type " | grep -cE "^\s*[A-Z]")
  [ "$n" -gt 1 ] && echo "$f:$n"
done

# 3. Compound-API machinery: a context shared by sibling parts, or static parts.
rtk rg -n "createContext|Object\.assign\(" src/components $G
```

Every line printed by (1) or (2) is a failing file; list each as
`file:count` in the report. A hit from (3) is a failure unless the file is a
real provider whose only purpose is to publish app state (for example an auth or
theme provider), which exposes exactly one component. Do not clear a hit by
judging that the parts "belong together": split each part into its own file with
the same single-component shape, or fold it into the owning component.
Provider and wrapper files still obey the one-component rule.

If a helper component is needed, extract it to its own appropriately named file
and give that file the same single-component shape. Do not create
an artificial compound API with `Object.assign(Component, { Part })`, static
component properties, or a second exported wrapper merely to expose an internal
layout part. Compose installed UI primitives directly in the owning component or
consumer instead. Treat any deviation from this rule as a review failure, even
when TypeScript and the automated gates pass.

## 4. Report

State plainly what was verified and what was not:

- Gates: which scope ran, how many passed, and for each failure the gate and the rule ids behind it.
- Review-only rules: which were checked, with findings.
- Anything skipped (a gate with no package script, such as the OSV workflow) and why.

Do not say "verified" or "ready" while a gate is failing or the review-only pass has not been done.

## Maintenance

The implementation is `scripts/verify/verify-code.mjs` with logic in `verify-code-lib.mjs` and tests in `verify-code.test.mjs` (run by `test:guards`). When `CONVENTIONS.md` gains a `review-only` rule, add its id to `references/review-checklist.md` in the same change; the script enforces this.
