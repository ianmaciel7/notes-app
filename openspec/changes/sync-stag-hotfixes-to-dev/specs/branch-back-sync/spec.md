## ADDED Requirements

### Requirement: Stag To Dev Back-Sync Detection
The repository SHALL automatically inspect whether `stag` contains non-equivalent patches that are missing from `dev` after `stag` changes.

#### Scenario: Stag receives a push
- **WHEN** a push lands on `stag`
- **THEN** the back-sync workflow SHALL compare `origin/stag` with `origin/dev`
- **AND** it SHALL treat cherry-picked equivalent patches as already synchronized
- **AND** it SHALL not create a PR when no non-equivalent patches are missing from `dev`

#### Scenario: Dev branch is unavailable
- **WHEN** the workflow cannot find `origin/dev`
- **THEN** it SHALL exit without creating a pull request
- **AND** it SHALL emit a notice explaining that `dev` does not exist yet

### Requirement: Stag To Dev Sync Pull Request
The repository SHALL create a normal pull request from `stag` to `dev` when `dev` is missing non-equivalent patches from `stag`.

#### Scenario: Sync is needed
- **WHEN** `stag` contains one or more non-equivalent patches missing from `dev`
- **AND** no open pull request already syncs `stag` into `dev`
- **THEN** the workflow SHALL create a pull request with base `dev` and head `stag`
- **AND** the pull request SHALL require normal CI and manual merge

#### Scenario: Sync pull request already exists
- **WHEN** an open pull request already has base `dev` and head `stag`
- **THEN** the workflow SHALL not create a duplicate pull request
- **AND** it SHALL emit a notice identifying the existing PR

### Requirement: Back-Sync Safety
The back-sync workflow SHALL preserve branch protections and history.

#### Scenario: Back-sync workflow runs
- **WHEN** the workflow evaluates or creates a sync PR
- **THEN** it SHALL use `GITHUB_TOKEN` with only `contents: read` and `pull-requests: write`
- **AND** it SHALL not push to `dev`
- **AND** it SHALL not force-push any branch
- **AND** it SHALL not merge automatically
- **AND** it SHALL use concurrency protection to avoid duplicate PR creation during rapid `stag` updates

#### Scenario: Conflicts are likely
- **WHEN** a merge-tree preview detects conflicts between `stag` and `dev`
- **THEN** the workflow SHALL still leave the PR path available for manual resolution
- **AND** it SHALL clearly warn that manual conflict resolution is likely
