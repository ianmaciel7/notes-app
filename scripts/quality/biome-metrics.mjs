import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createMetricsReport, parseBiomeJson, SELECTED_RULES } from "./biome-metrics-core.mjs";

function main() {
  const isReport = process.argv.includes("--report");
  const biomeBin = resolve("node_modules/@biomejs/biome/bin/biome");
  if (!existsSync(biomeBin)) {
    throw new Error(`Biome executable not found at ${biomeBin}. Run pnpm install first.`);
  }
  const args = [
    "lint",
    ...SELECTED_RULES.map((rule) => `--only=${rule}`),
    "--error-on-warnings",
    "--max-diagnostics=none",
    ...(isReport ? ["--reporter=json-pretty"] : []),
    ".",
  ];
  // Run the installed JS launcher directly; .cmd shims need shell quoting on Windows.
  const result = spawnSync(process.execPath, [biomeBin, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    windowsHide: true,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (!isReport) {
    process.stdout.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    process.exitCode = result.status ?? 1;
    return;
  }
  const parsed = parseBiomeJson(result.stdout ?? "", result.stderr ?? "");
  const report = createMetricsReport(parsed, {
    command: [process.execPath, biomeBin, ...args].join(" "),
    exitCode: result.status ?? 1,
  });
  const reportDir = join(process.cwd(), "reports", "code-quality-metrics");
  mkdirSync(reportDir, { recursive: true });
  writeFileSync(join(reportDir, "biome-latest.json"), `${JSON.stringify(parsed, null, 2)}\n`);
  writeFileSync(join(reportDir, "latest.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Saved Biome metrics report to ${join(reportDir, "latest.json")}`);
  console.log(`Selected-rule diagnostics: ${report.maintainabilityConvention.diagnosticCount}`);
  console.log(`Biome errors: ${parsed.summary.errors}; warnings: ${parsed.summary.warnings}`);
  process.exitCode = report.exitCode;
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : "Biome metrics failed.");
  process.exitCode = 2;
}
