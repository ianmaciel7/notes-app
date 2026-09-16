#!/usr/bin/env python3
"""Search every local git worktree with ripgrep and prefix matches by worktree."""

from __future__ import annotations

import argparse
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


DEFAULT_EXCLUDES = [
    "!.git",
    "!node_modules",
    "!.next",
    "!dist",
    "!coverage",
    "!graphify-out/graph.json",
]


@dataclass(frozen=True)
class Worktree:
    path: Path
    label: str
    branch: str | None


def run(command: list[str], cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=str(cwd),
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )


def parse_worktrees(output: str) -> list[Worktree]:
    records: list[dict[str, str]] = []
    current: dict[str, str] = {}

    for line in output.splitlines():
        if not line:
            if current:
                records.append(current)
                current = {}
            continue
        key, _, value = line.partition(" ")
        current[key] = value

    if current:
        records.append(current)

    worktrees: list[Worktree] = []
    for record in records:
        path_text = record.get("worktree")
        if not path_text:
            continue
        path = Path(path_text)
        branch_ref = record.get("branch")
        branch = branch_ref.removeprefix("refs/heads/") if branch_ref else None
        label = branch or path.name or record.get("HEAD", "detached")
        worktrees.append(Worktree(path=path, label=label, branch=branch))

    return worktrees


def discover_worktrees(repo: Path) -> list[Worktree]:
    result = run(["git", "worktree", "list", "--porcelain"], repo)
    if result.returncode != 0:
        sys.stderr.write(result.stderr or "Unable to list git worktrees.\n")
        sys.exit(result.returncode)
    return parse_worktrees(result.stdout)


def matches_filter(worktree: Worktree, filters: list[str]) -> bool:
    if not filters:
        return True
    haystack = " ".join(
        value.lower()
        for value in [str(worktree.path), worktree.label, worktree.branch]
        if value
    )
    return any(item.lower() in haystack for item in filters)


def build_rg_command(args: argparse.Namespace) -> list[str]:
    command = [
        "rg",
        "--line-number",
        "--column",
        "--color",
        "never",
        "--hidden",
    ]

    for exclude in DEFAULT_EXCLUDES:
        command.extend(["--glob", exclude])

    for glob in args.glob:
        command.extend(["--glob", glob])

    if args.fixed:
        command.append("--fixed-strings")
    if args.ignore_case:
        command.append("--ignore-case")
    if args.context is not None:
        command.extend(["--context", str(args.context)])
    if args.no_ignore:
        command.append("--no-ignore")

    command.append(args.pattern)
    command.append(".")
    return command


def search_worktree(worktree: Worktree, command: list[str]) -> bool:
    result = run(command, worktree.path)
    if result.returncode not in (0, 1):
        sys.stderr.write(f"[{worktree.label}] {result.stderr}")
        return False
    if not result.stdout:
        return False

    for line in result.stdout.splitlines():
        print(f"[{worktree.label}] {line}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Search local git worktrees with ripgrep."
    )
    parser.add_argument("pattern", nargs="?", help="Ripgrep pattern to search for.")
    parser.add_argument(
        "--glob",
        action="append",
        default=[],
        help="Ripgrep glob filter. Repeat for multiple filters.",
    )
    parser.add_argument(
        "--worktree",
        action="append",
        default=[],
        help="Only search worktrees whose path, label, or branch contains this text.",
    )
    parser.add_argument("--fixed", action="store_true", help="Use literal matching.")
    parser.add_argument(
        "--ignore-case", action="store_true", help="Search case-insensitively."
    )
    parser.add_argument(
        "--context", type=int, help="Print this many lines of surrounding context."
    )
    parser.add_argument(
        "--no-ignore",
        action="store_true",
        help="Search files ignored by gitignore or rg ignore files.",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List matching worktrees without searching file contents.",
    )
    args = parser.parse_args()

    repo = Path.cwd()
    worktrees = [
        worktree
        for worktree in discover_worktrees(repo)
        if matches_filter(worktree, args.worktree)
    ]

    if not worktrees:
        print("No matching worktrees found.")
        return 0

    if args.list:
        for worktree in worktrees:
            branch = f" branch={worktree.branch}" if worktree.branch else ""
            print(f"{worktree.label}\t{worktree.path}{branch}")
        return 0

    if not args.pattern:
        parser.error("pattern is required unless --list is used")

    command = build_rg_command(args)
    matched = False
    for worktree in worktrees:
        matched = search_worktree(worktree, command) or matched

    if not matched:
        print("No matches found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
