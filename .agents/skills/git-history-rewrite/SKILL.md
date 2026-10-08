---
name: git-history-rewrite
description: Move a change into an earlier commit of `dev` and repair release tags afterwards. Use when the user wants a fix folded into a previous commit ("move this to that commit", "fixup", "squash into"), or a tag points to a commit that a rewrite orphaned. Covers the non-interactive rebase, force-with-lease push, and re-pointing an annotated tag.
---

# Git history rewrite

Rewriting pushed history and moving published tags are destructive and
outward-facing. Never do either without the user's explicit yes for that
specific action. Never touch `main`, never use `--no-verify`, and never use
plain `--force`.

## 1. Find the target commit

`git log --oneline -S"<symbol or test name>" -- <file>` finds the commit that
introduced the feature the fix belongs to. Say which commit and which later
commits will get new hashes, then ask before rewriting.

## 2. Protect the working tree

`git stash push -m "<label>"` before the rebase and `git stash pop` after. In
this repo the stash also captured untracked files, so confirm with
`git stash show --stat stash@{0}` and `git ls-tree -r --name-only stash@{0}^3`
before assuming anything was lost.

## 3. Reorder with a scripted todo

The fix must already be a commit above the target. Write the todo yourself;
`git rebase -i` is not usable interactively.

```sh
cat > /tmp/seqed.sh <<'SH'
#!/bin/sh
printf 'pick <target7>\nfixup <fix7>\npick <later7>\n' > "$1"
SH
chmod +x /tmp/seqed.sh
GIT_SEQUENCE_EDITOR=/tmp/seqed.sh git rebase -i <parent-of-target>
```

- Use **7-character** hashes. The todo list abbreviates to 7, so an
  8-character `grep` or match finds nothing and silently drops commits.
- `fixup` keeps the target's message; use `squash` to edit it.
- If a step drops a commit, recover it from `git reflog` or `origin/dev`
  (`git cherry-pick <hash>`) and redo the rebase.

## 4. Verify, then push

```sh
git diff --quiet <old-tip> HEAD && echo "TREE IDENTICAL"
SWC_NATIVE_BINDING_CACHE="C:/Users/BobBytes/swc-cache" \
  git push --force-with-lease=dev:<old-tip-full-sha> origin dev
```

The tree must be identical to the old tip when only the grouping changed.
`--force-with-lease` with the old sha refuses to overwrite anything you have not
seen. Then run `pnpm run ci:wait` until it exits `0`.

## 5. Re-point a tag the rewrite orphaned

Find tags on rewritten commits: `git tag --contains <old-sha>` and
`git ls-remote --tags origin`. Map the old commit to its new hash by subject.
Recreate the annotated tag with its original message and tagger, then push it
with a lease on the old tag object:

```sh
git tag -l --format='%(contents)' <tag> > /tmp/tagmsg.txt
GIT_COMMITTER_NAME="$(git for-each-ref refs/tags/<tag> --format='%(taggername)')" \
GIT_COMMITTER_EMAIL="$(git for-each-ref refs/tags/<tag> --format='%(taggeremail)' | tr -d '<>')" \
GIT_COMMITTER_DATE="$(git for-each-ref refs/tags/<tag> --format='%(taggerdate:iso8601)')" \
  git tag -f -a <tag> <new-sha> -F /tmp/tagmsg.txt
git push --force-with-lease=refs/tags/<tag>:<old-tag-object-sha> origin <tag>
git ls-remote --tags origin '<tag>^{}'
```

Tell collaborators to run `git fetch --tags --force` and `git pull --rebase`.
If the user does not want a published tag moved, create a new patch tag instead.
