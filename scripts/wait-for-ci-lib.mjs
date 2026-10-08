export const EXIT = {
  ok: 0,
  failed: 1,
  usage: 2,
  needsHuman: 3,
  forbiddenChange: 4,
};

export const DEFAULTS = {
  workflow: "CI",
  maxAttempts: 2,
  timeoutMinutes: 30,
  logLines: 150,
};

const ATTEMPT_TRAILER = /^CI-Fix-Attempt:\s*(\d+)\s*$/m;

const FORBIDDEN_PREFIXES = [
  ".github/workflows/",
  ".husky/",
  ".agents/",
  "grit/",
  "src/components/firebase/",
  "scripts/wait-for-ci",
];

const FORBIDDEN_FILES = new Set([
  ".dependency-cruiser.cjs",
  ".fallowrc.json",
  ".gitleaks.toml",
  ".jscpd.json",
  ".pre-commit-config.yaml",
  ".size-limit.json",
  "biome.json",
  "commitlint.config.js",
  "knip.json",
  "package.json",
  "playwright.config.ts",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "tsconfig.check.json",
  "tsconfig.json",
  "vitest.config.ts",
]);

const TEST_FILE = /(^tests\/|\.(test|spec)\.[cm]?[jt]sx?$)/;

const SUPPRESSION =
  /(\.skip\(|\.only\(|\bxit\(|\bxdescribe\(|biome-ignore|@ts-ignore|@ts-expect-error|knip-ignore|jscpd:ignore|cspell:disable|fallow-ignore)/;

export function parseArgs(argv) {
  const options = { ...DEFAULTS, mode: "wait", sha: undefined };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--check-paths") {
      options.mode = "check-paths";
      continue;
    }
    const value = argv[index + 1];
    if (flag === "--sha") {
      options.sha = value;
    } else if (flag === "--workflow") {
      options.workflow = value;
    } else if (flag === "--max-attempts") {
      options.maxAttempts = Number(value);
    } else if (flag === "--timeout-minutes") {
      options.timeoutMinutes = Number(value);
    } else if (flag === "--log-lines") {
      options.logLines = Number(value);
    } else {
      throw new Error(`Unknown argument: ${flag}`);
    }
    index += 1;
  }
  for (const key of ["maxAttempts", "timeoutMinutes", "logLines"]) {
    if (!Number.isInteger(options[key]) || options[key] < 1) {
      throw new Error(`${key} must be a positive integer.`);
    }
  }
  return options;
}

export function currentAttempt(headCommitMessage) {
  const match = ATTEMPT_TRAILER.exec(headCommitMessage);
  return match ? Number(match[1]) : 0;
}

export function selectRuns(runs, workflow) {
  return runs.filter((run) => run.workflowName === workflow);
}

export function classifyRun(run) {
  if (run.status !== "completed") {
    return "pending";
  }
  return run.conclusion === "success" ? "success" : run.conclusion;
}

export function failedSteps(jobs) {
  const failed = [];
  for (const job of jobs) {
    if (job.conclusion !== "failure") {
      continue;
    }
    for (const step of job.steps ?? []) {
      if (step.conclusion === "failure") {
        failed.push(`${job.name} > ${step.name}`);
      }
    }
  }
  return failed;
}

export function tailLines(text, count) {
  const lines = text.split("\n");
  if (lines.length <= count) {
    return text;
  }
  const omitted = lines.length - count;
  return [
    `... (${omitted} earlier lines omitted)`,
    ...lines.slice(-count),
  ].join("\n");
}

export function isForbiddenPath(file) {
  return (
    FORBIDDEN_FILES.has(file) ||
    FORBIDDEN_PREFIXES.some((prefix) => file.startsWith(prefix))
  );
}

export function checkChanges({ changed, deleted, addedLines }) {
  const violations = [];
  for (const file of changed) {
    if (isForbiddenPath(file)) {
      violations.push(`protected path changed: ${file}`);
    }
  }
  for (const file of deleted) {
    if (TEST_FILE.test(file)) {
      violations.push(`test file deleted: ${file}`);
    }
  }
  for (const line of addedLines) {
    if (SUPPRESSION.test(line)) {
      violations.push(`check suppression added: ${line.trim()}`);
    }
  }
  return violations;
}

export function addedLinesFromDiff(diffText) {
  return diffText
    .split("\n")
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .map((line) => line.slice(1));
}

const DISCOVERY_TIMEOUT_MS = 120_000;
const DISCOVERY_INTERVAL_MS = 5_000;
const POLL_INTERVAL_MS = 15_000;

const ignore = () => undefined;

export async function pollUntil({
  fetch,
  isDone,
  sleep,
  now,
  intervalMs,
  deadline,
  onTick = ignore,
}) {
  let value = await fetch();
  onTick(value);
  while (!isDone(value) && now() < deadline) {
    await sleep(intervalMs);
    value = await fetch();
    onTick(value);
  }
  return value;
}

function statusLine(runs) {
  return runs
    .map((run) => `${run.event}#${run.databaseId}:${classifyRun(run)}`)
    .join(" ");
}

export function overallOutcome(runs) {
  const outcomes = runs.map(classifyRun);
  if (outcomes.every((outcome) => outcome === "success")) {
    return "success";
  }
  return outcomes.includes("failure") ? "failure" : "human";
}

function collectRuns(sha, options, deps) {
  const list = () => deps.listRuns(sha, options.workflow);
  const timing = { sleep: deps.sleep, now: deps.now };
  let lastStatus = "";
  const logChange = (runs) => {
    const status = statusLine(runs);
    if (status !== lastStatus) {
      deps.log(`[wait-for-ci] ${status}`);
      lastStatus = status;
    }
  };
  return pollUntil({
    ...timing,
    fetch: list,
    isDone: (runs) => runs.length > 0,
    intervalMs: DISCOVERY_INTERVAL_MS,
    deadline: deps.now() + DISCOVERY_TIMEOUT_MS,
  }).then((discovered) =>
    discovered.length === 0
      ? discovered
      : pollUntil({
          ...timing,
          fetch: list,
          isDone: (runs) => runs.every((run) => classifyRun(run) !== "pending"),
          intervalMs: POLL_INTERVAL_MS,
          deadline: deps.now() + options.timeoutMinutes * 60_000,
          onTick: logChange,
        }),
  );
}

function printFailures(runs, logLines, deps) {
  for (const run of runs.filter((r) => classifyRun(r) === "failure")) {
    deps.log(`\n--- Failed run ${run.databaseId} (${run.url}) ---`);
    for (const step of failedSteps(deps.jobs(run.databaseId))) {
      deps.log(`Failed step: ${step}`);
    }
    deps.log(tailLines(deps.failedLog(run.databaseId), logLines));
  }
}

function reportFailure(sha, maxAttempts, deps) {
  const attempt = currentAttempt(deps.headMessage(sha));
  if (attempt >= maxAttempts) {
    deps.error(
      `\nCI failed after ${attempt} automatic fix attempt(s). Stop and ask a human.`,
    );
    return EXIT.needsHuman;
  }
  deps.error(
    `\nCI failed. Run "pnpm run ci:check-paths" before committing a fix, and add the trailer "CI-Fix-Attempt: ${attempt + 1}" to the commit message.`,
  );
  return EXIT.failed;
}

function reportOutcome(runs, sha, options, deps) {
  const outcome = overallOutcome(runs);
  if (outcome === "success") {
    deps.log("CI passed.");
    return EXIT.ok;
  }
  if (outcome === "failure") {
    printFailures(runs, options.logLines, deps);
    return reportFailure(sha, options.maxAttempts, deps);
  }
  deps.error(
    `CI did not pass or finish (${runs.map(classifyRun).join(", ")}). Human decision needed.`,
  );
  return EXIT.needsHuman;
}

export async function waitForCi(options, deps) {
  const sha = options.sha ?? deps.headSha();
  if (!deps.isPushed(sha)) {
    deps.error(`Commit ${sha} is not on the remote. Push it first.`);
    return EXIT.usage;
  }
  const runs = await collectRuns(sha, options, deps);
  if (runs.length === 0) {
    deps.error(`No "${options.workflow}" run found for ${sha}.`);
    return EXIT.usage;
  }
  return reportOutcome(runs, sha, options, deps);
}

export function checkPaths(deps) {
  const { changed, deleted, diff, untrackedTexts } = deps.changes();
  const untrackedLines = untrackedTexts.flatMap((text) => text.split("\n"));
  const violations = checkChanges({
    changed,
    deleted,
    addedLines: [...addedLinesFromDiff(diff), ...untrackedLines],
  });
  if (violations.length === 0) {
    deps.log("No protected paths, deleted tests or suppressions found.");
    return EXIT.ok;
  }
  for (const violation of violations) {
    deps.error(`- ${violation}`);
  }
  deps.error("Revert these changes or ask a human before committing.");
  return EXIT.forbiddenChange;
}
