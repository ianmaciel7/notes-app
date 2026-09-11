# Bugfix Spec: Organize the Ladle Catalog

## Current Behavior

The `dev` snapshot at `d479176e3aaf0c217960051d86ad5580f8f7b293`
contains 47 stories. Button is nested under Components / UI; object primitive
stories have no explicit title and create a separate root. Labels repeat
component names. Both workspace header stories render the same composition.
Two stories duplicate global translations, and the architecture file gives a
language control to a document that has no translated variant.

## Expected Behavior

Keep Components, UI, and Docs as the three roots, in that order. Group related
parts, use short scenario names, preserve distinct examples, and keep the
Button default route valid. Show consistent capitalization without changing
application styling or Ladle dependencies. Keep authoring instructions in Docs
and add a small regression check using Ladle's public metadata API.

## Preserved Behavior

Do not change production component APIs, application CSS, dependencies, theme
providers, workspace data contracts, or existing fixtures. Keep both object
anatomies, both architecture documents, the main document's language variants,
and the required integration providers. Deduplicate only identical header
scenarios and redundant copies of the shared translation provider.

## Root Cause

Story metadata was being added file-by-file without a catalog policy. Ladle
normalizes story IDs and reconstructs display labels in sentence case, so
changing title capitalization alone does not fix the visible navigation.

## Regression and Verification

Six catalog assertions were added first and all six failed on the original
snapshot for the expected missing/incorrect groups, default route, ordering,
primitive placement, and guide. A seventh assertion caught an empty group in
the new MDX guide before its title separator was corrected. See the delivered
verification report for the
post-change checks and any pre-existing or environment failures. Do not infer
application-wide correctness from catalog validation.

## Scope

Story files, Ladle configuration, authoring documentation and skill, and focused
regression tests only. No remote write, commit, push, deployment, or policy
change is part of this cleanup.
