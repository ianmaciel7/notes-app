---
name: verify-docs
description: Verifies that every markdown document in the repository is consistent, in sync with the code, and compliant with the documentation rules (control docs, docs/ ADRs, execution plans and product specs, .agents rules and skills). Runs the control-doc verifiers plus repository-wide checks for broken links, missing paths and pnpm scripts, absolute machine paths, non-English text, AGENTS.md size and skill routing, and skill frontmatter, then does a judgment pass for duplicated ownership and contradictions. Use this skill whenever the user asks to verify, audit, validate, check, or sync docs or markdown files, asks whether docs are up to date or consistent with the code, wants a docs health check before a PR, or has just changed docs, scripts, skills, or package.json scripts, even if they never say "verify-docs".
---

# Verify Docs

Docs in this repo are load-bearing: agents route through `AGENTS.md`, humans start at `README.md`, and every rule has exactly one canonical owner (see the ownership table in `.agents/skills/context-manager/SKILL.md`). Docs rot silently when links break, scripts get renamed, or a rule gets copied into a second file and then edited in only one place. This skill finds that rot with a deterministic script first, then covers what a script cannot judge.

## Step 1: Run the script

```bash
rtk pnpm run verify:docs
```

Useful flags: `--json` (machine-readable findings), `--strict` (warnings fail too), `--skip-control-docs` (skip the slower `check:docs` wrapper while iterating).

Exit code `0` means no errors (warnings may remain), `1` means at least one error, `2` means the script could not run (for example, git is unavailable). Never treat exit `2` as a pass.

## Step 2: Triage each finding

Errors are inconsistencies that should be fixed. Warnings are signals that need a human or agent decision. Before editing anything, decide whether the finding is real drift or a doc that is deliberately illustrative.

| Rule | Severity | What it means | Fix at |
| --- | --- | --- | --- |
| `control-docs` | error | One of the 11 context-manager verifiers failed | The named control doc; see `context-manager` |
| `broken-link`, `broken-anchor` | error | A relative markdown link or `#anchor` does not resolve | The linking file; links resolve relative to that file's folder |
| `missing-path` | error | A backticked repo path does not exist | Update the path, or create the file if the doc is right |
| `missing-script` | error | A `pnpm` command names a script that is not in `package.json` | Fix the doc, or add the script if the doc is right |
| `absolute-path` | error | Hardcoded machine path such as a home directory | Replace with a repo-relative path (`.agents/rules/path-portability.md`) |
| `agents-size` | error / warn | `AGENTS.md` over 16,000 bytes (error) or 12,000 chars (warn) | Move detail to its owner doc or skill; keep AGENTS.md a router |
| `missing-skill` | error | AGENTS.md routes to a skill that does not exist | Fix the row or create the skill |
| `skill-frontmatter` | error | Skill has no frontmatter, empty description, or `name` differs from its folder | The skill's `SKILL.md` |
| `adr-naming`, `adr-title`, `adr-sequence` | error | ADR filename, title, or numbering is off | `docs/adr/` |
| `plan-sections`, `plan-status` | error | Plan lacks a template section, or its Status disagrees with active/completed | `docs/exec-plans/` (`README.md` lifecycle) |
| `spec-index` | error | Product-spec index and folder disagree | `docs/product-specs/index.md` |
| `unrouted-skill` | warn | A project skill is missing from the AGENTS.md skill routing table | Add a routing row, or confirm it is intentionally internal |
| `orphan-doc` | warn | No other doc links to or mentions this file | Link it from its index or README, or delete it if obsolete |
| `duplicate-rule` | warn | Same long line appears in more than one doc | Keep the canonical owner's copy; replace others with a pointer |
| `undocumented-script` | warn | An entry script in `scripts/` is mentioned in no doc | Document it in its owning doc |
| `non-english` | warn | Non-ASCII letters found (docs must be English unless the user asked otherwise) | Translate, or confirm these are intentional product terms |
| `plan-placeholder`, `plan-open-items` | warn | Template text or unchecked items left in a plan | The plan file |

Two exemptions are built in so the report stays trustworthy: paths on lines that say "e.g.", "for example", "such as", or "never/do not" are treated as illustrations, and generated or machine-local locations (`graphify-out/`, `.agents/local.json`, and similar) may be mentioned freely.

## Step 3: Fix at the canonical owner

When a fact is wrong, correct it in the document that owns it and turn any copies into pointers. Do not "fix" a finding by weakening the check, adding an exemption, or deleting the doc text that exposed the problem: the report is only worth something if a clean run means the docs are actually consistent.

Never edit content inside a tool-generated block (for example the Next.js block at the top of `AGENTS.md`); add project text outside it.

## Step 4: Judgment pass

The script checks structure. These need reading, so do them yourself, scoped to the docs touched by the current change (use `git diff --name-only` against the merge base) and to anything the script flagged:

1. **Ownership**: does any non-owner doc restate a rule, threshold, or procedure rather than point to its owner? Use the ownership table in the context-manager skill.
2. **Contradictions**: do two docs disagree on a fact, such as tool versions, commands, thresholds, or names? Check the source of truth (`package.json`, `.node-version`, config files) rather than picking one doc.
3. **Counts and lists**: claims like "13 checks", "11 verifiers", or a list of tools or scripts still match what the code does.
4. **Status claims**: statements like "no test runner configured yet" or "planned" still match the repo.
5. **Code-to-doc sync**: if code, scripts, skills, or configuration changed, the canonical doc for that area was updated in the same change (`CONTRIBUTING.md` pre-PR checklist).

## Step 5: Report

Lead with the verdict, then the evidence:

```
Verdict: PASS | PASS with warnings | FAIL
Script: <errors> error(s), <warnings> warning(s), exit <code>
Fixed: <finding -> what changed, at which owner>
Open: <finding -> why it needs a human decision>
Judgment pass: <inconsistencies found, or "none found in <scope>">
```

State what you did not verify. If you fixed things, re-run the script and report the final result, not the first one.
