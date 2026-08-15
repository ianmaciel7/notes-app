# Release Process

## Branch Flow

Use focused branches for implementation work.

```text
feature branch -> pull request -> stag -> staging validation -> promotion pull request -> main -> production validation
```

Do not push directly to protected branches. Normal development targets `stag`. Production promotion should happen through a pull request from `stag` to `main`.

## OpenSpec Flow

Use OpenSpec for behavior changes that need agreement before implementation.

Recommended loop:

1. Create or update one change under `openspec/changes/<change-name>/`.
2. Review `proposal.md` before implementation.
3. Review delta specs under `specs/` to confirm "done" is observable.
4. Implement the change and update tasks as evidence is produced.
5. Run local verification.
6. Open a pull request containing code and the relevant OpenSpec artifacts.
7. Archive the OpenSpec change after the change ships.

OpenSpec does not replace product docs, engineering docs, Git, pull requests, or release notes.

## Release Readiness

A release candidate should have:

- completed implementation tasks;
- passing local verification or a documented narrower verification path;
- passing pull request CI;
- reviewed OpenSpec acceptance criteria for spec-driven changes;
- updated product or engineering docs when behavior or process changed;
- staging smoke checks when a staging deployment exists.

## Versioning

Before the first public release, use simple internal milestones:

- `0.1.0`: personal study foundation
- `0.2.0`: improved ingestion and study analytics
- `0.3.0`: richer object relationships and graph behavior

Patch versions should fix defects without changing the product promise.

## Changelog

Create `CHANGELOG.md` when the first release candidate is assembled. Keep entries user-facing and concise:

```text
## 0.1.0 - YYYY-MM-DD

- Added study goal setup and daily study planning.
- Added question practice and flashcard review.
- Added Gemini-assisted study object generation.
```

## Rollback

Use Git and hosting provider release history to identify the last known-good version. Do not delete tags, rewrite protected branch history, or hide failed releases as a rollback shortcut.
