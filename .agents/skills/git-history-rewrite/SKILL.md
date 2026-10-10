---
name: git-history-rewrite
description: Rewrite or regroup pushed history safely - fold a fix into an earlier commit, move commits between stacked branches (dev, design-md, firebase/space, firebase/object-type), purge or restore paths across all commits, re-point release tags, and republish with leases. Also use for read-only questions about which commits are exclusive to a branch and which branch each change belongs to. Use when the user wants a change moved into a previous commit ("move this to that commit", "fixup", "squash into"), commits moved to another branch, files removed from or put back into history, a tag moved, or a tag orphaned by a rewrite.
---

# Git history rewrite

Rewriting pushed history and moving published tags are destructive and
outward-facing. Never do either without the user's explicit yes for that
specific action. Never touch `main`, never use `--no-verify` (or `HUSKY=0`), and
never use plain `--force`.

The lessons below come from real sessions that rewrote `dev`, three release
tags and several feature branches, and later regrouped a four-branch stack.
Follow the order; each rule exists because skipping it cost a retry.

Work in three phases and stop at the end of each one:

1. **Read-only**: pre-flight, classify, simulate (sections 0, 0b, 0c). Safe to do
   without asking.
2. **Local build**: backups plus `work/*` branches, nothing existing moved
   (sections 2 to 7). Needs a "yes, build locally".
3. **Publish**: pushes and tag moves (sections 8 to 10). Needs a separate, explicit
   yes that names every action.

## 0. Pre-flight (read-only)

Do all of this before proposing anything.

```sh
git status --short | grep -v '^??'          # must be clean
git fetch origin --tags
git ls-remote origin refs/heads/dev
git ls-remote --tags origin                 # tag OBJECT shas, needed for leases
git log --graph --oneline --decorate <branches> --tags
gh api repos/<owner>/<repo>/branches/dev/protection   # 404 = unprotected
gh pr list --state open --json number,headRefName,baseRefName
gh release list                             # releases are tied to the tag names
git grep -nE 'workflow|tags:|release' -- .github/workflows
git branch -a                               # remote-only branches are listed separately
```

- Another session or tool of the same user may push to `dev` while you work.
  The remote moved twice mid-task. Never lease on a sha from memory: use the
  value you just read from `git ls-remote`, and re-read it right before each push.
- Releases follow the tag name. Moving a tag changes what its release shows and
  breaks commit links in release notes. Say so in the question.
- Do not assume where a file was born. `git log --diff-filter=A --format='%h %s'
  -- <file>` found the real origin; the guessed commit was wrong twice.
- Rewriting a commit orphans every tag on it and after it. Pick targets after the
  oldest tag the user accepts moving; a later target leaves earlier tags
  untouched (`v0.1.0` and `v0.2.0` kept their hashes when the target was after
  them).
- Place a change where it belongs semantically (a skill that documents
  `ci:wait` goes into the commit that added `ci:wait`).
- **Local tags can be stale, not orphaned.** `git fetch origin --tags` printing
  `! [rejected] v0.x -> v0.x (would clobber existing tag)` means the local tag
  points somewhere else than the remote one. Compare
  `git ls-remote --tags origin` (the `^{}` line is the commit) with
  `git rev-parse <tag>^{commit}` before telling the user a tag is orphaned. The
  remote tags were correct; only the local refs were old. Fix the local refs with
  `git fetch --tags --force`, after backing them up (step 2).
- **The default branch may not exist locally.** Here `main` is only
  `origin/main` (`git branch -a` lists it under `remote-only`), and `main..HEAD`
  fails with `unknown revision`. Use `origin/main`, and say which base you used.
- Learn the stack before talking about it:
  `git rev-list --left-right --count <a>...<b>` for each pair and
  `git merge-base`. In this repo it was `dev` -> `design-md` (+7) ->
  `firebase/space` (+2) -> `firebase/object-type` (+14), and branches that sit
  on the same tip show `0` on one side.

## 0b. Read-only question: what is exclusive, what belongs where

The user may ask "which commits are exclusive to this branch" or "what should be
in `dev` / `design-md` / `firebase/space`". The first answer was wrong twice
because "exclusive" has three meanings. State the one you use and give the
count, then switch to the strictest if the user pushes back:

| Meaning | Command |
|---|---|
| Not in the base branch | `git log <base>..HEAD` |
| Not in the base and not in `origin/main` | run both, report both counts |
| **Reachable from no other ref** (strictest) | see below |

```sh
git for-each-ref --format='%(refname)' refs/heads refs/remotes \
  | grep -v -e '^refs/heads/<self>$' -e '^refs/remotes/origin/<self>$' -e '/HEAD$' > others.txt
git --no-pager log HEAD --not $(cat others.txt) --format='%h|%ad|%s' --date=short | cat
git branch -a --contains <commit>          # who else already has this commit
```

- Always `--no-pager ... | cat` and an explicit `--format`: the default view
  truncated subjects with `...` and hid which ones were inherited.
- Deliver a **per-commit table**, not only counts: hash, subject, branches that
  already contain it, target branch, and a status (`clean`, `conflict`, `mixed`,
  `entangled`). The user had to ask four times before getting this.
- Separate **inherited** commits (already in another branch, only need to be
  ancestors) from **exclusive** ones, and do not call inherited ones "changes of
  this branch".
- Classify paths by owner before proposing a move: path patterns first
  (`*space*`, `*object-type*`, ADR number), then the content of the added lines
  (`git diff -U0 <base> HEAD -- <path>` and grep). Files that mention several
  owners are **mixed** and must be listed by name.
- **Check entanglement, not only file names.** A commit can be "Space only" by
  path and still import the other domain (`space-actions.ts` imported
  `object-type-dal`, and `firestore.rules` dropped the client `delete` for both).
  `git show <c>:<file> | grep -oE 'from "[^"]+"'` for the code files and
  `git diff -U1` for rules/config. Moving commits is mechanical; splitting
  entangled code is a rewrite of behavior. Tell the user which one it is.
- If the user's rule changes mid-task ("design-md stays and can also receive
  things"), restate the full mapping table before building anything.

## 0c. Simulate every move (read-only)

`git merge-tree --write-tree` performs the merge without touching the working
tree, the index or any ref. It only writes objects, which are unreferenced
afterwards. Exit status is `0` when clean and non-zero (`1`) on conflicts; the
first output line is always the resulting tree. With `--name-only` the conflicted
paths follow it.

```sh
try() {  # TARGET=<branch> SRC=<commit> try : would "git cherry-pick $SRC" apply on $TARGET?
  out=$(git merge-tree --write-tree --name-only --merge-base="$SRC^" "$TARGET" "$SRC"); rc=$?
  [ $rc -eq 0 ] && echo "OK       $SRC -> $TARGET" \
                || echo "CONFLICT $SRC -> $TARGET: $(printf '%s\n' "$out" | sed -n '2,6p' | tr '\n' ' ')"
}
```

- Snippets in this skill pass values through named variables on purpose. Do not
  write `$1`, `$2` or `$ARGUMENTS` in them: the skill loader substitutes those
  with the arguments the skill was invoked with, and the commands then silently
  run with words like "para" and "algum" in place of refs.
- `--merge-base="$SRC^"` makes it a cherry-pick (base = the commit's own parent).
  Without it the merge uses the real merge-base and answers a different question.
- `--quiet` gives the status only and exits at the first conflict.
- Each simulation is **independent**. A conflict can disappear once a
  prerequisite is applied underneath (`474c2aeb` conflicted on `design-md` until
  the 13-file hooks slice of `0104532d` was below it). Test the chain: build a
  throwaway commit with `commit-tree` (no ref, no worktree) and simulate on it.
- A clean textual result is not a semantic result: `721e1f3e` (a mock path)
  applies anywhere but only makes sense with `474c2aeb`. Record such
  dependencies in the table.
- Do not use `git diff` of two branches to decide what "belongs"; it shows state,
  not intent. Use per-commit file lists: `git diff-tree --no-commit-id
  --name-status -r <c>`.

## 1. Ask explicitly, once, with the consequences

Use `AskUserQuestion` and name every action: which commits get new hashes, force
push of which branch, which tags move, which releases are affected, which
branches stay on the old history. Short replies like "mova" do not count as the
explicit yes: the permission classifier blocked the rebase until a question
named the action and the user chose it. Ask again when the facts change (new
remote commit, releases discovered, the user changes the target mapping).

Never publish a branch the user did not name (a feature branch pushed earlier
keeps its old history until they say so).

- **Read the answers, they can redefine the task.** `AskUserQuestion` also
  returns free text: "design-md continues, and it can also receive things" was
  an answer to the question and a new requirement. Treat it as input, not as a
  pick among the options, and restate the mapping.
- Split the question: "may I build locally on `work/*`, no push" is cheap and
  gets a yes; "may I force-push these three branches" is a different question
  asked later with fresh remote shas.
- State the interpretation when a message is ambiguous ("I read it as: ...")
  instead of building on a guess; one short line is enough.

## 2. Back up everything first

```sh
git branch --no-track backup-pre-<step>-dev dev
git branch --no-track backup-pre-<step>-<feature> <feature>
git branch --no-track backup-pre-<step>-<remote-only> origin/<remote-only>
for t in <tags>; do git update-ref refs/backup/<step>-tag-$t "$(git rev-parse refs/tags/$t)"; done
```

Number the steps (`fold`, `fold2`, `regroup`, ...); every pass needs its own
backup. The old blobs stay reachable through them, which is what makes
restoring files possible later. Back up the **local** tag refs even when you
believe they are stale: they are the only copy. A remote-only branch has no local
branch; use `origin/<name>` and `--no-track`, otherwise the backup tracks the
remote and prints `set up to track`. `git stash push -m <label>` also protects
uncommitted work (confirm untracked files with
`git ls-tree -r --name-only stash@{0}^3`). Move, do not delete, an untracked file
that blocks a cherry-pick (it was a tracked file in the target commit).

## 3. Choose the method

| Goal | Method |
|---|---|
| Fold a few commits into an older one | reset + cherry-pick (3a) |
| Same, with the commit hook failing | build the commit with `commit-tree` (3b) |
| Move commits between stacked branches, or split a mixed commit | plumbing replay with `merge-tree` (3c) |
| Remove paths from all history | `filter-branch --index-filter` (4) |
| Edit text inside docs in every commit | `filter-branch --tree-filter` with a tested script (5) |
| Put files back into history | `filter-branch --index-filter` with a commit map (6) |

`git filter-repo` is not installed. `git rebase -i` cannot be interactive; a
scripted `GIT_SEQUENCE_EDITOR` rebase was blocked by the classifier in this
environment, while the cherry-pick flow below was allowed after an explicit
yes.

### 3a. Reset and cherry-pick

```sh
git reset --hard <parent-of-target>        # on a work branch, not on dev
git cherry-pick <target7>
git cherry-pick -n <fix1> <fix2>           # stage, do not commit
# resolve conflicts, git add
git commit --amend --no-edit               # see 3b if the hook fails
git cherry-pick <later1> <later2> ...      # one by one, stop at the first conflict
```

- Use **7-character** hashes in todo lists; a longer match silently finds nothing.
- Do not use `set -e` with `| tail`: the pipe hides the failure and the loop keeps
  going. Check the exit code of each pick without a pipe.
- Conflicts are expected where the intermediate commit differs from the tip
  (scripts in `package.json` that a later commit adds, trailing lines of
  `.gitignore`). Resolve to what is correct for that intermediate commit; the
  later commit's own conflict then resolves to the final text.

### 3b. When pre-commit fails

`git commit --amend` and `git cherry-pick --continue` run the pre-commit hook.
Here it ran `pnpm install` and failed with `Access is denied` on a locked
`node_modules`, and it also mutated `node_modules` against an intermediate
`package.json`. Plain cherry-picks without conflicts do not run it.

Do not skip the hook. Build the commit with plumbing, which is what a rebase
`fixup` does, keeping author, date and message:

```sh
git log -1 --format=%B <orig> > msg.txt
export GIT_AUTHOR_NAME="$(git log -1 --format=%an <orig>)" \
       GIT_AUTHOR_EMAIL="$(git log -1 --format=%ae <orig>)" \
       GIT_AUTHOR_DATE="$(git log -1 --format=%aI <orig>)"
new=$(git commit-tree "$(git write-tree)" -p <parent> -F msg.txt)
git cherry-pick --quit; git reset --soft "$new"
```

Compensate by verifying the final tree and running `pnpm run verify:fast` before
pushing. Afterwards run `pnpm install --frozen-lockfile` to repair `node_modules`.

### 3c. Regroup commits across stacked branches (plumbing replay)

Use this when commits must live on different branches of a stack, or when one
commit mixes concerns. It needs no working tree and no hooks, so nothing in the
checkout is disturbed.

**Design the target first.** Write the stack (`dev` <- `design-md` <-
`firebase/space` <- `firebase/object-type`), the commit-to-branch table from
section 0b, and the invariant: **the tip of the last branch must have a tree
identical to the old tip**. That invariant is what proves nothing was lost.

**Build with throwaway `work/*` branches**, never on the real ones:

```sh
SCRATCH=<session scratchpad>
pick() {  # PARENT=<new-parent> SRC=<commit> pick; stdout = new commit; return 2 on conflict
  local out rc tree mf="$SCRATCH/msg.txt"
  out=$(git merge-tree --write-tree --name-only --merge-base="$SRC^" "$PARENT" "$SRC"); rc=$?
  tree=$(printf '%s\n' "$out" | head -1)
  if [ $rc -ne 0 ]; then
    echo "CONFLICT $SRC tree=$tree" >&2; printf '%s\n' "$out" | sed -n '2,$p' >&2; return 2
  fi
  git log -1 --format=%B "$SRC" > "$mf"
  GIT_AUTHOR_NAME="$(git log -1 --format=%an "$SRC")" GIT_AUTHOR_EMAIL="$(git log -1 --format=%ae "$SRC")" \
  GIT_AUTHOR_DATE="$(git log -1 --format=%aI "$SRC")" git commit-tree "$tree" -p "$PARENT" -F "$mf"
}
cur=$(git rev-parse <base>)
for c in <7-char hashes, oldest first>; do
  n=$(PARENT="$cur" SRC="$c" pick); rc=$?
  [ $rc -ne 0 ] && { echo "STOP at $c"; break; }
  cur=$n; echo "$c -> ${n:0:8}"
done
git branch -f work/<name> "$cur"
```

- Use `n=$(...); rc=$?` and never a pipe on `pick`.
- `git commit-tree -F` needs a **file**. Process substitution (`-F <(...)`) fails
  on Git Bash for Windows with `could not open '/proc/NNN/fd/63'`.
- Author, date and subject are kept; the committer is the current user. A commit
  you create yourself (a slice) gets the repo's attribution trailer.
- A commit whose parent is already the target tip is a fast-forward: reuse its
  hash instead of picking it (`a4cb6ed5` stayed `a4cb6ed5` on `dev`, so the
  commits above it in `design-md` could keep their parent).

**Extract a slice of a mixed commit** (the files of one concern) onto a base:

```sh
export GIT_INDEX_FILE="$SCRATCH/idx"; rm -f "$GIT_INDEX_FILE"
git read-tree <base>
git diff-tree --no-commit-id --name-status -r <src> -- <paths> | while read st p; do
  if [ "$st" = D ]; then git update-index --force-remove -- "$p"
  else git update-index --add --cacheinfo "$(git ls-tree <src> -- "$p" | cut -d' ' -f1),$(git rev-parse "<src>:$p"),$p"; fi
done
tree=$(git write-tree); unset GIT_INDEX_FILE
git commit-tree "$tree" -p <base> -F msg.txt
```

Before committing the slice, check it is what you think: `git diff --stat
<base> <slice>` must list only the slice paths, `git diff -U0` of the code files
should be import-line changes, and `git grep -n <old-symbol> <base>` must show no
user outside the slice. When the slice goes first, the original commit is later
replayed on top and its overlapping hunks apply as already-applied; its remaining
hunks stay with it.

**Resolve conflicts from `merge-tree` without a worktree.** The tree it returns
holds the conflicted files with markers. For each file:
`git show <tree>:<path>`, replace each `<<<<<<< ours ... ======= ... >>>>>>>
theirs` block, `git hash-object -w <file>`, `git update-index --cacheinfo`, then
`git write-tree` and `commit-tree` as above. Here "ours" is the branch being built
and "theirs" is the replayed commit.

- Resolve towards the **final** wording whenever the target text already exists
  at the tip of the last branch; otherwise a later commit conflicts on the same
  paragraph again (it happened three times, all in `CODING_STANDARDS.md` and
  `TESTING.md`).
- For a hook or code file whose only change was already applied by a slice, take
  "ours".
- When a guard sentence and a later paragraph are interleaved, keep both: the
  earlier branch gets the guard bullets, the later one the layer docs.
- Preserve the file's EOL (`.gitignore` was CRLF). Check
  `git grep -n '^<<<<<<<\|^>>>>>>>' <branch>` is empty afterwards.
- Never "fix" the end state with a catch-all commit. If the final tree differs,
  find which conflict resolution lost text.

**Do not pretend to split what is entangled.** If a commit mixes two domains in
behavior (not just in files), leave it in the later branch and say so. In this
repo `space-actions.ts` cascades to Object Types and the rules drop the client
`delete`, so the Space layering stayed with Object Type. The honest result was
"`dev` +2, `design-md` +3, `space` unchanged, `object-type` rebased", not a
fabricated split.

## 4. Purge paths from every commit

```sh
export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch --force --prune-empty \
  --index-filter 'git rm -r -q --cached --ignore-unmatch -- <path> <path>' \
  --tag-name-filter cat -- dev <feature> --tags
```

- Pass every branch and `--tags` in **one** invocation so the hash mapping is
  consistent and annotated tags keep tagger, date and message.
- `--prune-empty` drops commits that only touched purged paths; a trailing commit
  that becomes empty disappears.
- Then clean text that still points at the purged paths (step 5), and check
  `git grep -nE '<paths>' <commit>` over every commit, not only the tip.

## 5. Edit docs inside every commit

Write one script per file, for example a perl filter run from
`--tree-filter`. Before using it:

1. Run it against the commit before the manual cleanup and `cmp` the output with
   the cleaned file: the six files must be byte-identical.
2. Run it against the tip: it must be idempotent (no change).
3. Old versions of a document have different wording. Loop over all commits and
   list the reference lines that survive (`git show <c>:<file> | grep`), then
   extend the script for each variant. Delete only lines that name the removed
   thing; renumber lists; do not invent new text.

After the pass the manual cleanup commit becomes empty and `--prune-empty` removes
it.

## 6. Put files back into history

Blobs survive in the backups. Map each current commit to its original (match by
subject; subjects were unique) and re-add the files exactly as that commit had
them:

```sh
# restore.sh, used as: git filter-branch --index-filter 'sh restore.sh' ...
orig=$(grep "^$GIT_COMMIT " map.txt | cut -d' ' -f2); [ -n "$orig" ] || exit 0
git ls-tree -r "$orig" -- <path> | while read mode type sha path; do
  git update-index --add --cacheinfo "$mode,$sha,$path" || exit 1
done
```

For a file that never existed in `dev` history, add one blob from a commit
ancestor check (`git merge-base --is-ancestor <first-commit> $GIT_COMMIT`) and
skip commits that already have it (`git ls-files -s -- <path>`).

## 7. Verify before any push

```sh
git diff --quiet <old-tip> HEAD && echo "TREE IDENTICAL"     # regrouping only
git diff --name-status <old-tip> <new-tip>                   # purge: only D under purged paths
git rev-parse <commit>:<file>                                # compare blobs per commit pair
git rev-list --count <parent>..<child>                       # stack shape
git merge-base --is-ancestor <tag-commit> <branch>           # tags still reachable
```

- When the intent is only to regroup, the tree must be identical. One
  whole-file mismatch here was **line endings**: `.gitignore` is CRLF, and
  `printf`, `sed -i` and `git checkout --ours` produced LF and changed all 82
  lines. Build such files from `git show <commit>:<file>` and append bytes in the
  same EOL, then compare blob hashes.
- Branch positions: the tag convention (here `v0.3.0` = tip of `dev`), the
  feature branch on top of the new `dev` (`git rev-list --count dev..<feature>`,
  `git merge-base`), and no commit left that only exists to clean up.
- Check **every** branch you will publish, not only the last: an intermediate
  branch can pass tree identity trivially and still not build.
- `pnpm run verify:fast` on each branch you will publish. A failure that also
  existed before the rewrite (same tree) is not caused by it: report it, do not
  silence it.
- Install state: `pnpm install --frozen-lockfile` after failed installs.

### Checking a branch without switching to it

Use a throwaway worktree in the **session scratchpad**, never `.worktrees/`
(reference-only here). `pnpm` refuses to run there with a junctioned
`node_modules` (`workspace hoist directory is not a real directory`, it tries to
reinstall), so call the tools directly:

```sh
git worktree add --detach "$SCRATCH/wt" <branch>
# PowerShell: New-Item -ItemType Junction -Path "$SCRATCH\wt\node_modules" -Target <repo>\node_modules
cd "$SCRATCH/wt"; export SWC_NATIVE_BINDING_CACHE='C:\swc-native-cache'
node node_modules/@biomejs/biome/bin/biome check
node node_modules/next/dist/bin/next typegen && node node_modules/typescript/bin/tsc --noEmit -p tsconfig.check.json
node node_modules/vitest/vitest.mjs run
node node_modules/dependency-cruiser/bin/dependency-cruiser.mjs --config .dependency-cruiser.cjs src
git checkout -q --detach <next-branch>      # reuse the worktree for the next branch
```

- `ls node_modules/<pkg>/bin` before guessing the entry file (`depcruise` is
  `dependency-cruiser.mjs`, not `dependency-cruise.mjs`).
- **Remove the junction first**, then the worktree: `cmd /c rmdir
  "$SCRATCH\wt\node_modules"`, then `git worktree remove --force "$SCRATCH/wt"`.
  Doing it the other way can walk into the real `node_modules`. Confirm
  `node_modules/.bin` still exists afterwards.
- This covers `biome`, `tsc`, `vitest` and `dependency-cruiser`. It does not
  cover `lint:spelling`, `test:rules` (needs the emulator) or the pre-push hook;
  say which gates you did not run.

## 8. Publish with leases

```sh
git push --force-with-lease=dev:<remote-sha-just-read> origin dev
git push --force-with-lease=<branch>:<remote-sha> origin <branch>:<branch>
# tags, one by one, lease on the remote tag OBJECT sha
git push --force-with-lease=refs/tags/<tag>:<remote-tag-object-sha> origin refs/tags/<tag>:refs/tags/<tag>
git ls-remote --tags origin
```

Git documents `--force-with-lease=<ref>:<expect>` as the only form that does not
depend on your remote-tracking refs; the bare `--force-with-lease` and
`--force-with-lease=<ref>` forms are protected only by what a background
`git fetch` last wrote, and `--force-if-includes` only complements the bare
form. So always give `<ref>:<expect>` with a value read from `git ls-remote`
seconds before. Do not enable `--force-if-includes` as a substitute.

Order for a stack: parent first (a fast-forward of `dev` needs no force at all),
then each child on top of its new parent. Pushing a child before its parent
publishes commits whose ancestors do not exist on the remote branch.

A fast-forward of `dev` leaves the tags where they are: `v0.3.0` stays on the
old tip and the releases are untouched. Do not count it as a rewrite.

Set `SWC_NATIVE_BINDING_CACHE=C:\swc-native-cache` on this machine if a hook needs
the SWC binding. The pre-push hook must pass; never bypass it.

Then run `pnpm run ci:wait` in the background **on the branch you pushed** and
do not switch branches while it runs (it reads `HEAD`). Read its output; a
background-task "exit code 0" can be the exit of `tail` or `echo` after it, not of
`ci:wait`. Cross-check `gh run list --branch dev --limit 2`. Exit `4` is the
protected-paths guard (`.agents/` counts); the GitHub run can still be green, so
report both facts. Do not call the task done until CI is green, and do not
"fix" CI by editing configs or adding spell suppressions without approval.

## 9. Re-point tags

Recreate each annotated tag on the new commit, with its original message and
tagger. `filter-branch --tag-name-filter cat` already does this for tags it
rewrites; otherwise:

```sh
git tag -l --format='%(contents)' <tag> > tagmsg.txt
GIT_COMMITTER_NAME="$(git for-each-ref refs/tags/<tag> --format='%(taggername)')" \
GIT_COMMITTER_EMAIL="$(git for-each-ref refs/tags/<tag> --format='%(taggeremail)' | tr -d '<>')" \
GIT_COMMITTER_DATE="$(git for-each-ref refs/tags/<tag> --format='%(taggerdate:iso8601)')" \
  git tag -f -a <tag> <new-sha> -F tagmsg.txt
```

If the user does not want a published tag moved, create a new patch tag instead.
Before re-pointing, confirm the tag is really wrong on the **remote**
(section 0, stale local tags).

## 10. After publishing

Tell the user, and list what you did not do:

- Collaborators and the user's other sessions run `git fetch --tags --force` and
  `git reset --hard origin/dev`. A session that pushes the old commits again
  restores them.
- Releases now show the new commits; other remote branches keep the old history.
- Local leftovers: `backup-*` branches, `refs/backup/*`, `refs/original/*`,
  `work/*` branches, unreferenced `commit-tree` objects (garbage collected
  later). Delete only when the user says so.
- What you deliberately did not move (entangled commits, docs left whole) and
  why.

## Documentation lookups

Prefer the repo's `ctx7` CLI to model memory for git behavior:
`npx ctx7@latest library Git "<topic>"` resolves `/git/htmldocs`, then
`npx ctx7@latest docs /git/htmldocs "<one concept>"`. The Context7 MCP server can
time out (`CONNECT_TIMEOUT`); the CLI still works. Keep to three commands per
question. Facts above about `merge-tree --write-tree` and `--force-with-lease`
were checked this way; the GitHub-side statements (branch protection 404, release
list) were observed on this repo and not verified against GitHub docs.

## Mistakes to avoid (all happened)

| Mistake | Rule |
|---|---|
| Treated "mova" as consent to rewrite and push | Ask with `AskUserQuestion`, naming each action |
| Assumed the file's birth commit | `git log --diff-filter=A` first |
| Leased on a remote sha that had changed | Re-read `git ls-remote` immediately before pushing |
| Missed releases tied to the tags | `gh release list` in pre-flight |
| `set -e` plus `| tail` hid failed picks | No pipes on commands whose status matters |
| `commit --amend` ran pre-commit and broke `node_modules` | `commit-tree` for regrouping, then verify |
| Whole-file diff from LF vs CRLF | Compare blob hashes; keep the file's EOL |
| Read a CI "exit 0" that was `tail`'s | Read the output and `gh run list` |
| `git checkout` added to a `ci:wait` command | Never switch branches while waiting |
| Delegated `.agents/` edits to Codex | Its sandbox is read-only there and it uses PowerShell, where `pnpm.ps1` is blocked; edit those files directly, use Git Bash for pnpm. `.claude/skills` is a symlink to `.agents/skills`: edit under `.agents/skills` once |
| Left a trailing cleanup commit after a tag | Fold it into the old commits when asked; `--prune-empty` removes it |
| Said the tags were orphaned from local refs | Compare `git ls-remote --tags origin`; `would clobber existing tag` means stale local tags |
| Ran `git log main..HEAD` and got `unknown revision` | `main` is only `origin/main`; check `git branch -a` |
| Answered "exclusive" with `dev..HEAD` (23 commits) when the user meant reachable from no other ref (14) | State the definition, show the strictest count, add the inherited ones separately |
| Gave counts and category names instead of a per-commit table | Table: commit, already in, target, clean/conflict/mixed/entangled |
| Promised to move a commit that imports the other domain | Check imports and rules before the mapping; say "entangled" |
| `commit-tree -F <(...)` on Git Bash for Windows | Write the message to a file and pass its path |
| `pnpm exec` in a worktree with a junctioned `node_modules` | Call `node node_modules/<pkg>/bin/<entry>` directly; check the entry file name |
| Removed a worktree with the `node_modules` junction still in it | `cmd /c rmdir` the junction first |
| Backed up a remote-only branch without `--no-track` | `git branch --no-track backup-... origin/<name>` |
| Read an `AskUserQuestion` free-text answer as one of the options | Re-read it; restate the new mapping before building |
| Verified only the last branch of a stack | Run the checks on every branch you will publish |
| Wrote `$1`/`$2` in skill snippets and they were replaced by the invocation arguments | Pass values through named variables (`SRC=... pick`); never use positional parameters or `$ARGUMENTS` in `SKILL.md` |
