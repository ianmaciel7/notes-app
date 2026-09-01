# Contributing

- [ ] Use `pnpm install --frozen-lockfile` to install dependencies.
- [ ] Use `pnpm dev` to run the local development server.
- [ ] Run `pnpm verify` before opening a pull request.
- [ ] Follow OpenSpec for behavioral or procedural changes: proposal, specs, design, and tasks.
- [ ] Reuse matching external-reference evidence before recapture; store sanitized image, HTML/DOM, CSS, and JavaScript evidence according to `docs/references/reference-evidence-workflow.md`.
- [ ] For UI parity, compare semantic controls separately from visible form chrome, measure scrollbar-reserved content geometry, preserve differing semantic data, and retain existing regression-test contracts.
- [ ] Keep repository-facing docs and code in English.
- [ ] Keep pull requests focused and describe the change clearly.

## Branching

Use dedicated working branches with conventional prefixes such as:

- `feat/`
- `fix/`
- `chore/`
- `docs/`
- `refactor/`

Long-lived branch flow:

```text
working branch -> dev -> stag -> main
```

Do not push directly to `dev`, `stag`, or `main` after branch protections are enabled. Promote changes through pull requests and use squash merge.

## Required checks

Pull requests targeting long-lived branches are expected to pass:

- `Quality`
- `Security`

Resolve review conversations before merging.
