import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  checkPaths,
  EXIT,
  parseArgs,
  selectRuns,
  waitForCi,
} from "./wait-for-ci-lib.mjs";

function exec(command, args) {
  return execFileSync(command, args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function lines(text) {
  return text.split("\n").filter(Boolean);
}

function readText(file) {
  const content = readFileSync(file);
  return content.includes(0) ? "" : content.toString("utf8");
}

function gh(args) {
  return exec("gh", args);
}

const deps = {
  log: (message) => console.log(message),
  error: (message) => console.error(message),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  now: () => Date.now(),
  headSha: () => exec("git", ["rev-parse", "HEAD"]).trim(),
  isPushed: (sha) =>
    lines(exec("git", ["branch", "-r", "--contains", sha])).length > 0,
  headMessage: (sha) => exec("git", ["log", "-1", "--format=%B", sha]),
  listRuns: (sha, workflow) =>
    selectRuns(
      JSON.parse(
        gh([
          "run",
          "list",
          "--commit",
          sha,
          "--json",
          "databaseId,workflowName,status,conclusion,url,event",
          "--limit",
          "20",
        ]),
      ),
      workflow,
    ),
  jobs: (runId) =>
    JSON.parse(gh(["run", "view", String(runId), "--json", "jobs"])).jobs,
  failedLog: (runId) => gh(["run", "view", String(runId), "--log-failed"]),
  changes: () => {
    const untracked = lines(
      exec("git", ["ls-files", "--others", "--exclude-standard"]),
    );
    return {
      changed: [
        ...lines(exec("git", ["diff", "--name-only", "HEAD"])),
        ...untracked,
      ],
      deleted: lines(
        exec("git", ["diff", "--name-only", "--diff-filter=D", "HEAD"]),
      ),
      diff: exec("git", ["diff", "-U0", "HEAD"]),
      untrackedTexts: untracked.map(readText),
    };
  },
};

try {
  const options = parseArgs(process.argv.slice(2));
  process.exitCode =
    options.mode === "check-paths"
      ? checkPaths(deps)
      : await waitForCi(options, deps);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = EXIT.usage;
}
