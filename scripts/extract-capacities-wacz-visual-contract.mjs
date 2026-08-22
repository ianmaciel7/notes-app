import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { createInterface } from "node:readline";

const [sourcePath, auditPath, outputPath, ...archivePaths] =
  process.argv.slice(2);

if (!sourcePath || !auditPath || !outputPath || archivePaths.length === 0) {
  throw new Error(
    "Usage: node extract-capacities-wacz-visual-contract.mjs <source.jsonl> <audit.json> <output.json> <archive.wacz...>",
  );
}

const visualProperties = new Set([
  "background",
  "background-color",
  "backdrop-filter",
  "border",
  "border-color",
  "border-radius",
  "box-shadow",
  "color",
  "filter",
  "opacity",
  "outline",
  "outline-color",
  "transition",
  "transition-duration",
  "transition-property",
]);

const selectorSignals = [
  "preview-card-core",
  "preview-card-base",
  "command-palette",
  "popper",
  "modal",
  "bg-back",
  "bg-back-hover",
  "bg-base",
  "bg-front",
  "bg-front-hover",
  "text-primary",
  "text-secondary",
  "text-subtle",
  "rounded-base",
  "brightness",
];

function digest(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function safeUrl(rawUrl) {
  const url = new URL(rawUrl);
  return `${url.origin}${url.pathname}`;
}

function declarationsFrom(body) {
  const declarations = [];
  for (const part of body.split(";")) {
    const colon = part.indexOf(":");
    if (colon < 1) continue;
    const property = part.slice(0, colon).trim();
    const value = part.slice(colon + 1).trim();
    if (!property || !value || /url\(|data:/i.test(value)) continue;
    declarations.push({ property, value });
  }
  return declarations;
}

function addCount(map, property, value) {
  const propertyValues = map.get(property) ?? new Map();
  propertyValues.set(value, (propertyValues.get(value) ?? 0) + 1);
  map.set(property, propertyValues);
}

const audit = JSON.parse(await readFile(auditPath, "utf8"));
const cssResources = [];
const customPropertyEvidence = new Map();
const visualValueCounts = new Map();
const targetedRules = [];
const themePalette = {};
const lightTheme = {};
const themeSources = [];

const lines = createInterface({
  input: createReadStream(sourcePath, { encoding: "utf8" }),
  crlfDelay: Infinity,
});

for await (const line of lines) {
  const resource = JSON.parse(line);
  if (
    resource.kind === "response_resource" &&
    safeUrl(String(resource.url)) ===
      "https://app.capacities.io/storing59846.js" &&
    typeof resource.text === "string"
  ) {
    themeSources.push({
      url: safeUrl(resource.url),
      sha256: resource.sha256,
      bytes: resource.size,
    });

    for (const match of resource.text.matchAll(
      /(gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose):\{([^}]*)\}/g,
    )) {
      const scale = {};
      for (const entry of match[2].matchAll(/([\w]+):`([^`]*)`/g)) {
        scale[entry[1]] = entry[2];
      }
      themePalette[match[1]] = scale;
    }

    const lightMatch = resource.text.match(
      /light:\{key:`light`,ui:\{([^}]*)\}/,
    );
    if (lightMatch) {
      for (const entry of lightMatch[1].matchAll(
        /"([^"]+)":\$\.(gray|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)\[([\w]+)\]/g,
      )) {
        lightTheme[entry[1]] =
          themePalette[entry[2]]?.[entry[3]] ?? `${entry[2]}[${entry[3]}]`;
      }
    }
  }

  if (
    resource.kind !== "response_resource" ||
    !String(resource.content_type).toLowerCase().includes("css") ||
    !String(resource.url).startsWith("https://app.capacities.io/") ||
    typeof resource.text !== "string"
  ) {
    continue;
  }

  const source = {
    url: safeUrl(resource.url),
    sha256: resource.sha256,
    bytes: resource.size,
  };
  cssResources.push(source);

  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  for (const match of resource.text.matchAll(rulePattern)) {
    const selector = match[1].trim().replace(/\s+/g, " ").slice(-240);
    const declarations = declarationsFrom(match[2]);
    if (declarations.length === 0) continue;

    const visual = [];
    for (const declaration of declarations) {
      if (declaration.property.startsWith("--")) {
        const evidence = customPropertyEvidence.get(declaration.property) ?? [];
        if (
          !evidence.some(
            (item) =>
              item.value === declaration.value && item.selector === selector,
          )
        ) {
          evidence.push({
            value: declaration.value,
            selector,
            source: source.url,
          });
        }
        customPropertyEvidence.set(declaration.property, evidence.slice(0, 12));
      }

      if (visualProperties.has(declaration.property)) {
        addCount(visualValueCounts, declaration.property, declaration.value);
        visual.push(declaration);
      }
    }

    if (
      visual.length > 0 &&
      selectorSignals.some((signal) => selector.toLowerCase().includes(signal))
    ) {
      targetedRules.push({
        selector,
        declarations: visual,
        source: source.url,
      });
    }
  }
}

const archiveEvidence = [];
for (const archivePath of archivePaths) {
  const bytes = await readFile(archivePath);
  archiveEvidence.push({
    file: basename(archivePath),
    bytes: bytes.length,
    sha256: digest(bytes),
  });
}

const customProperties = Object.fromEntries(
  [...customPropertyEvidence.entries()]
    .filter(([name]) =>
      /(?:bg|text|border|shadow|radius|color|ring|opacity|duration)/i.test(
        name,
      ),
    )
    .sort(([a], [b]) => a.localeCompare(b)),
);

const visualValues = Object.fromEntries(
  [...visualValueCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([property, values]) => [
      property,
      [...values.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 80)
        .map(([value, count]) => ({ value, count })),
    ]),
);

const contract = {
  schema: "capacities-wacz-visual-contract/v1",
  generatedAt: new Date().toISOString(),
  purpose:
    "Sanitized, derived visual evidence for Capacities parity. No cookies, authorization headers, request bodies, private query strings, or proprietary JavaScript bodies are included.",
  completeness: {
    status: audit.status,
    responsePayloadsMissingBySha256:
      audit.jsonl_counts?.response_bodies_missing_by_sha256,
    confirmedPresent: audit.confirmed_present,
    relevantLimitation:
      "WACZ image resource payloads and exact archival byte structure are not reproduced here; UI HTML/JS/CSS/JSON response bodies were complete in the supplied source corpus.",
  },
  sources: {
    sourceJsonl: {
      file: basename(sourcePath),
      bytes: (await readFile(sourcePath)).length,
    },
    archives: archiveEvidence,
    cssResources,
    themeSources,
  },
  theme: {
    radii: {
      small: "0.3rem",
      base: "0.5rem",
      card: "0.75rem",
    },
    colorToneMapping: {
      tokenText: "500",
      tokenBg: "100",
      blockText: "500",
      blockBg: "50",
      tagText: "800",
      tagBg: "100",
      typeLabelText: "650",
      typeLabelBg: "75",
      typeLabelBorder: "300",
    },
    palette: themePalette,
    light: lightTheme,
  },
  customProperties,
  visualValues,
  targetedRules: targetedRules.slice(0, 500),
};

await writeFile(outputPath, `${JSON.stringify(contract, null, 2)}\n`, "utf8");
