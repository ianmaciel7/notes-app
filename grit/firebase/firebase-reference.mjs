import { execFileSync } from "node:child_process";

const protectedPath = "src/components/firebase/";

// Check staged changes against HEAD
const stagedDiff = execFileSync(
  "git",
  ["diff", "--cached", "--name-status", "HEAD", "--", protectedPath],
  { encoding: "utf8" },
);

// Check unstaged changes against index
const unstagedDiff = execFileSync(
  "git",
  ["diff", "--name-status", "--", protectedPath],
  { encoding: "utf8" },
);

// Only flag modifications (M), deletions (D), renames (R)
// Allow additions (A) for files not in HEAD yet
const violations = [
  ...stagedDiff
    .trim()
    .split("\n")
    .filter(Boolean)
    .filter((entry) => /^[MDR]/.test(entry)),
  ...unstagedDiff
    .trim()
    .split("\n")
    .filter(Boolean)
    .filter((entry) => /^[MDR]/.test(entry)),
];

if (violations.length > 0) {
  console.error(
    `Immutable Firebase reference files cannot be modified or deleted:\n${violations.join("\n")}`,
  );
  process.exit(1);
}

console.log("Firebase reference files are immutable.");
