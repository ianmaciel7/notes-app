## Why

The delivery flow uses `feature/* -> dev -> stag -> main`, but an urgent fix may occasionally land in `stag` before `dev`. Without automation, `dev` can remain unaware of that fix and diverge from the stabilization branch.

The repository should detect this condition automatically and open a normal pull request back from `stag` to `dev`, preserving protected branches and CI review instead of pushing directly into `dev`.

## What Changes

- Add a GitHub Actions workflow that runs after pushes to `stag`.
- Compare `origin/stag` against `origin/dev` with `git cherry` so cherry-picked equivalent patches do not create unnecessary PRs.
- Create a single idempotent PR from `stag` into `dev` when non-equivalent patches are missing from `dev`.
- Detect an existing open `stag -> dev` sync PR before creating a new one.
- Add workflow-level concurrency to avoid races during rapid `stag` updates.
- Add a versioned `dev` ruleset source file matching the existing protected branch model.
- Extend CI to run for pull requests and protected pushes involving `dev`.
- Document the sync path and branch expectations.

## Capabilities

### New Capabilities

- `branch-back-sync`: Defines the automated `stag -> dev` synchronization PR behavior.

### Modified Capabilities

- `ci-cd-pipeline`: Extends quality gates and branch protection expectations to `dev`.

## Non-Goals

- Automatically merge into `dev`.
- Push or force-push to `dev`.
- Rewrite branch history.
- Add long-lived tokens or repository secrets.
- Create the `dev` branch when it does not exist.
