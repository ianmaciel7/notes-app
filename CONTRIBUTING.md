# Contributing

- [ ] Use `pnpm install --frozen-lockfile` to install dependencies.
- [ ] Use `pnpm dev` to run the local development server.
- [ ] Run `pnpm verify` before opening a pull request.
- [ ] Follow OpenSpec for behavioral or procedural changes: proposal, specs, design, and tasks.
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

## Branch and worktree safety

Before merging, cherry-picking, pulling, switching, or pushing, run:

```text
git status --short --branch
git branch -vv
git worktree list --porcelain
```

Confirm the exact checkout path, branch, HEAD, upstream, and dirty-tree state. If the target branch is attached to another worktree, use that worktree path; do not force-switch, remove, or reassign it. Preserve unrelated local changes and stop for direction before integrating them.

Compare source and target before integration:

```text
git merge-base --is-ancestor <source> <target>
git rev-list --left-right --count <target>...<source>
```

Feature work is published to the requested feature branch and then promoted by pull request. `dev`, `stag`, and `main` are protected: do not push directly or force-push to them. Before UI validation, confirm the local server is running from the intended checkout and commit; rebuild or restart a stale local process before comparing the browser.

## Required checks

Pull requests targeting long-lived branches are expected to pass:

- `Quality`
- `Security`

Resolve review conversations before merging.

Before reporting a branch integration complete, verify the target branch is clean, the source tip is an ancestor of the target, and the local target matches its intended remote ref.
