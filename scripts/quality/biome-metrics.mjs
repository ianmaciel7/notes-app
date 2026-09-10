import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const SELECTED_RULES = [
  "complexity/noExcessiveCognitiveComplexity",
  "complexity/useMaxParams",
  "complexity/noExcessiveLinesPerFunction",
  "style/noExcessiveLinesPerFile",
];

const MAINTAINABILITY_RULES = new Set([
  "lint/complexity/noExcessiveCognitiveComplexity",
  "lint/complexity/useMaxParams",
  "lint/complexity/noExcessiveLinesPerFunction",
  "lint/style/noExcessiveLinesPerFile",
]);

const SUPPORT_MATRIX = [
  {
    metric: "Complexidade cognitiva",
    unit: "Funcao",
    support: "Nativo do Biome",
    evidence: "lint/complexity/noExcessiveCognitiveComplexity",
    result: "Medida por diagnosticos emitidos quando o limite e excedido.",
  },
  {
    metric: "Quantidade de parametros",
    unit: "Funcao/metodo",
    support: "Nativo do Biome",
    evidence: "lint/complexity/useMaxParams",
    result: "Medida por diagnosticos emitidos quando o limite e excedido.",
  },
  {
    metric: "Linhas por funcao",
    unit: "Funcao",
    support: "Nativo do Biome",
    evidence: "lint/complexity/noExcessiveLinesPerFunction",
    result: "Medida por diagnosticos emitidos quando o limite e excedido.",
  },
  {
    metric: "Linhas por arquivo",
    unit: "Arquivo",
    support: "Nativo do Biome",
    evidence: "lint/style/noExcessiveLinesPerFile",
    result: "Medida por diagnosticos emitidos quando o limite e excedido.",
  },
  {
    metric: "Ocorrencias das regras de manutenibilidade selecionadas no Biome",
    unit: "Repositorio",
    support: "Agregado local de diagnosticos do Biome",
    evidence: "Este script conta apenas categorias emitidas pelo Biome.",
    result: "Contado em metrics:report a partir de diagnostics[].category.",
  },
];

const isReport = process.argv.includes("--report");
const biomeBin = resolve(
  process.platform === "win32" ? "node_modules/.bin/biome.cmd" : "node_modules/.bin/biome",
);

if (!existsSync(biomeBin)) {
  console.error(`Biome executable not found at ${biomeBin}. Run pnpm install first.`);
  process.exit(2);
}

const args = [
  "lint",
  ...SELECTED_RULES.flatMap((rule) => [`--only=${rule}`]),
  "--error-on-warnings",
  "--max-diagnostics=none",
  ...(isReport ? ["--reporter=json-pretty"] : []),
  ".",
];

const result = spawnSync(biomeBin, args, {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: process.platform === "win32",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(2);
}

if (!isReport) {
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  process.exit(result.status ?? 1);
}

const rawOutput = `${result.stdout ?? ""}${result.stderr ?? ""}`;
const parsed = parseBiomeJson(rawOutput);
const diagnostics = Array.isArray(parsed.diagnostics) ? parsed.diagnostics : null;

if (!parsed.summary || !diagnostics) {
  console.error("Biome JSON reporter output did not include the expected summary and diagnostics.");
  process.exit(2);
}

const maintainabilityDiagnostics = diagnostics.filter((diagnostic) =>
  MAINTAINABILITY_RULES.has(diagnostic.category),
);

const diagnosticsByRule = maintainabilityDiagnostics.reduce((counts, diagnostic) => {
  counts[diagnostic.category] = (counts[diagnostic.category] ?? 0) + 1;
  return counts;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  command: [biomeBin, ...args].join(" "),
  selectedRules: SELECTED_RULES,
  exitCode: result.status ?? 1,
  biomeSummary: parsed.summary,
  maintainabilityConvention: {
    name: "Ocorrencias das regras de manutenibilidade selecionadas no Biome",
    diagnosticCount: maintainabilityDiagnostics.length,
    diagnosticsByRule,
  },
  supportMatrix: SUPPORT_MATRIX,
  diagnostics,
  limitations: [
    "O script nao analisa codigo-fonte diretamente.",
    "Metricas sem diagnostico do Biome permanecem NAO MEDIDAS.",
    "O reporter JSON do Biome e experimental e a estrutura e validada antes do resumo.",
  ],
};

const reportDir = join(process.cwd(), "reports", "code-quality-metrics");
mkdirSync(reportDir, { recursive: true });
writeFileSync(join(reportDir, "latest.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(reportDir, "biome-latest.json"), `${JSON.stringify(parsed, null, 2)}\n`);

console.log(
  `Saved Biome metrics report to ${join("reports", "code-quality-metrics", "latest.json")}`,
);
console.log(`Selected-rule diagnostics: ${maintainabilityDiagnostics.length}`);
console.log(`Biome errors: ${parsed.summary.errors}; warnings: ${parsed.summary.warnings}`);

process.exit(result.status ?? 1);

function parseBiomeJson(output) {
  const start = output.indexOf("{");
  const end = output.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    console.error("Biome JSON reporter did not emit a parseable JSON object.");
    process.exit(2);
  }

  try {
    return JSON.parse(output.slice(start, end + 1));
  } catch (error) {
    console.error(`Failed to parse Biome JSON reporter output: ${error.message}`);
    process.exit(2);
  }
}
