const RULE_DEFINITIONS = [
  {
    rule: "complexity/noExcessiveCognitiveComplexity",
    metric: "Cognitive complexity",
    unit: "Function",
  },
  { rule: "complexity/useMaxParams", metric: "Parameter count", unit: "Function/method" },
  {
    rule: "complexity/noExcessiveLinesPerFunction",
    metric: "Lines per function",
    unit: "Function",
  },
  { rule: "style/noExcessiveLinesPerFile", metric: "Lines per file", unit: "File" },
];

export const SELECTED_RULES = RULE_DEFINITIONS.map(({ rule }) => rule);
const MAINTAINABILITY_RULES = new Set(SELECTED_RULES.map((rule) => `lint/${rule}`));

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCounter(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function isBiomeReport(value) {
  return (
    isRecord(value) &&
    isRecord(value.summary) &&
    isCounter(value.summary.errors) &&
    isCounter(value.summary.warnings) &&
    Array.isArray(value.diagnostics) &&
    value.diagnostics.every(isRecord)
  );
}

export function parseBiomeJson(stdout, stderr) {
  // The experimental reporter and human diagnostics must never be concatenated.
  for (const stream of [stdout, stderr]) {
    try {
      const value = JSON.parse(stream.trim());
      if (isBiomeReport(value)) return value;
    } catch {
      // Some Biome versions emit reporter JSON on the other stream.
    }
  }
  throw new Error("Biome did not emit a valid JSON report with summary counters and diagnostics.");
}

export function createMetricsReport(parsed, { command, exitCode }) {
  const selected = parsed.diagnostics.filter((diagnostic) =>
    MAINTAINABILITY_RULES.has(diagnostic.category),
  );
  const counts = new Map();
  for (const diagnostic of selected) {
    counts.set(diagnostic.category, (counts.get(diagnostic.category) ?? 0) + 1);
  }
  const hasFailures =
    parsed.summary.errors > 0 ||
    parsed.summary.warnings > 0 ||
    selected.length > 0 ||
    parsed.diagnostics.some(({ severity }) => ["fatal", "error", "warning"].includes(severity));

  return {
    generatedAt: new Date().toISOString(),
    command,
    selectedRules: SELECTED_RULES,
    exitCode: exitCode === 0 && hasFailures ? 1 : exitCode,
    biomeSummary: parsed.summary,
    maintainabilityConvention: {
      name: "Occurrences of the selected Biome maintainability rules",
      diagnosticCount: selected.length,
      diagnosticsByRule: Object.fromEntries(counts),
    },
    supportMatrix: RULE_DEFINITIONS.map(({ rule, metric, unit }) => ({
      metric,
      unit,
      support: "Native Biome diagnostic",
      evidence: `lint/${rule}`,
      result: "A diagnostic is reported when the configured limit is exceeded.",
    })),
    diagnostics: parsed.diagnostics,
    limitations: [
      "This script does not analyze source code itself.",
      "Unsupported metrics remain NOT MEASURED; missing diagnostics are not metric values.",
      "The experimental Biome JSON reporter is validated before producing this summary.",
    ],
  };
}
