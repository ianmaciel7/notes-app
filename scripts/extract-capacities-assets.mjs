import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const cwd = process.cwd();
const htmlPath = process.env.CAPACITY_HTML_PATH ??
  path.join(process.env.USERPROFILE ?? cwd, "Downloads", "Capacities.html");
const indexPath = process.env.CAPACITY_INDEX_JS ??
  "C:/Users/ianma/Downloads/Capacities_files/index83139.js.download";
const outputDir = path.join(cwd, "reverse-engineering", "reference", "assets");
const scriptsDir = path.join(outputDir, "scripts");
const stylesDir = path.join(outputDir, "styles");
const manifestPath = path.join(outputDir, "asset-manifest.json");
const localFallbackDirectories = [scriptsDir, stylesDir];
const shouldDownload = process.argv.includes("--download");
const strict = process.argv.includes("--strict");

const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function toAbs(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("./") || value.startsWith("../") || value.startsWith("/")) {
    return new URL(value, "https://app.capacities.io/").href;
  }
  return `https://app.capacities.io/${value}`;
}

function inferType(urlOrName) {
  const lower = urlOrName.toLowerCase();
  if (lower.endsWith(".css")) return "style";
  return "script";
}

function safeName(value) {
  return value.replace(/[\\/:*?"<>|]/g, "_");
}

function parseHtmlRefs(html) {
  const scripts = [];
  const styles = [];
  const scriptRe = /<script[^>]*\bsrc\s*=\s*"([^"]+)"[^>]*>/gi;
  const styleRe = /<link[^>]*\brel\s*=\s*["']stylesheet["'][^>]*\bhref\s*=\s*"([^"]+)"[^>]*>/gi;
  for (const m of html.matchAll(scriptRe)) {
    const src = m[1];
    const type = inferType(src);
    if (type === "script") scripts.push(src);
    else styles.push(src);
  }
  for (const m of html.matchAll(styleRe)) {
    const href = m[1];
    styles.push(href);
  }
  return { scripts, styles };
}

function parseMapDeps(jsText) {
  const marker = "const __vite__mapDeps=";
  const markerIndex = jsText.indexOf(marker);
  if (markerIndex < 0) return [];

  const startIndex = jsText.indexOf("[", markerIndex);
  if (startIndex < 0) return [];

  let depth = 0;
  let insideString = null;
  let escape = false;
  let endIndex = -1;
  for (let i = startIndex; i < jsText.length; i += 1) {
    const char = jsText[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === "\\") {
      escape = true;
      continue;
    }
    if (insideString) {
      if (char === insideString) {
        insideString = null;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      insideString = char;
      continue;
    }
    if (char === "[") {
      depth += 1;
      continue;
    }
    if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }
  if (endIndex < 0) return [];

  try {
    const arrayText = jsText.slice(startIndex + 1, endIndex);
    return JSON.parse(`[${arrayText}]`);
  } catch {
    return [];
  }
}

function unique(strings) {
  return [...new Set(strings.filter(Boolean))];
}

async function tryFetch(url, destinationPath) {
  try {
    const resp = await fetch(url, {
      headers: {
        "user-agent": userAgent,
        referer: "https://app.capacities.io/",
      },
    });
    if (!resp.ok) {
      return { ok: false, status: resp.status, reason: `HTTP ${resp.status}` };
    }
    const bytes = Buffer.from(await resp.arrayBuffer());
    if (bytes.length === 0) {
      return { ok: false, status: resp.status, reason: "empty payload" };
    }
    await writeFile(destinationPath, bytes);
    return { ok: true, status: resp.status, bytes: bytes.length };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      reason: err?.message || "fetch failed",
    };
  }
}

async function hydrateAsset(sourceReference) {
  const filename = safeName(sourceReference.split("/").at(-1) || sourceReference);
  const kind = inferType(sourceReference);
  const destinationPath = path.join(
    kind === "style" ? stylesDir : scriptsDir,
    filename,
  );
  const cachedRaw = existsSync(destinationPath)
    ? await readFile(destinationPath).catch(() => null)
    : null;
  if (cachedRaw) {
    return {
      sourceReference,
      type: kind,
      sourceAvailable: true,
      destinationPath,
      bytes: cachedRaw.length,
      sha256: sha256(cachedRaw),
      status: "cached",
    };
  }

  const isRemote = /^https?:\/\//i.test(sourceReference);
  const absolute = isRemote
    ? sourceReference
    : toAbs(sourceReference);
  const localSource = isRemote
    ? null
    : path.resolve(path.dirname(htmlPath), sourceReference);
  const entry = {
    sourceReference,
    type: kind,
    sourceAvailable: false,
    destinationPath,
    bytes: 0,
    sha256: null,
  };

  if (!isRemote && existsSync(localSource)) {
    await mkdir(path.dirname(destinationPath), { recursive: true });
    await copyFile(localSource, destinationPath).catch(() => {});
    try {
      const raw = await readFile(localSource);
      entry.sourceAvailable = true;
      entry.bytes = raw.length;
      entry.sha256 = sha256(raw);
      entry.status = "copied";
      await writeFile(destinationPath, raw);
      return entry;
    } catch {
      entry.sourceAvailable = false;
    }
  }
  if (!isRemote) {
    const fallbackSource = localFallbackDirectories
      .map((directory) => path.join(directory, filename))
      .find((candidate) => existsSync(candidate));
    if (fallbackSource) {
      await mkdir(path.dirname(destinationPath), { recursive: true });
      await copyFile(fallbackSource, destinationPath).catch(() => {});
      try {
        const raw = await readFile(fallbackSource);
        entry.sourceAvailable = true;
        entry.bytes = raw.length;
        entry.sha256 = sha256(raw);
        entry.status = "copied";
        return entry;
      } catch {
        entry.sourceAvailable = false;
      }
    }
  }

  if (shouldDownload && absolute) {
    await mkdir(path.dirname(destinationPath), { recursive: true });
    const result = await tryFetch(absolute, destinationPath);
    if (result.ok) {
      entry.sourceAvailable = true;
      entry.bytes = result.bytes;
      try {
        const downloaded = await readFile(destinationPath);
        entry.sha256 = sha256(downloaded);
      } catch {
        entry.sha256 = null;
      }
      entry.status = "copied";
      entry.sourceAvailable = true;
      return entry;
    }
    entry.error = result.reason;
  }

  entry.error = "fetch failed";
  return entry;
}

function manifestFromEntries(entries) {
  const scriptCount = entries.filter((entry) => entry.type === "script").length;
  const styleCount = entries.filter((entry) => entry.type === "style").length;
  const copied = entries.filter((entry) => entry.sourceAvailable);
  const local = entries.filter((entry) => entry.sourceReference.startsWith("."));
  const remoteMissing = entries
    .filter((entry) => !entry.sourceAvailable && !entry.sourceReference.startsWith("."))
    .map((entry) => safeName(entry.sourceReference.split("/").at(-1) || entry.sourceReference));

  const localCopyNames = entries
    .filter((entry) => entry.sourceReference.startsWith("."))
    .map((entry) => safeName(entry.sourceReference.split("/").at(-1) || entry.sourceReference));
  const localMissingNames = localCopyNames.filter((name) =>
    !copied.some((item) => item.sourceReference === `./Capacities_files/${name}`),
  );

  return {
    source: {
      pageSnapshot: htmlPath,
      harvestedAt: new Date().toISOString(),
      totalDiscovered: entries.length,
      source: "scripts/extract-capacities-assets.mjs",
    },
    localFiles: entries.map((entry) => ({
      sourceReference: entry.sourceReference,
      type: entry.type,
      sourceAvailable: entry.sourceAvailable,
      destinationPath: entry.destinationPath,
      bytes: entry.bytes,
      sha256: entry.sha256,
      status: entry.status,
      error: entry.error,
    })),
    remoteMissing,
    copied: copied.map((entry) => safeName(entry.sourceReference.split("/").at(-1) || entry.sourceReference)),
    counts: {
      css: styleCount,
      scripts: scriptCount,
      total: entries.length,
    },
    localCopies: local.map((entry) => safeName(entry.sourceReference.split("/").at(-1) || entry.sourceReference)),
    localMissing: localMissingNames,
    sourcePath: htmlPath,
    indexSource: indexPath,
  };
}

async function main() {
  const htmlRaw = await readFile(htmlPath);
  const rawHtml = htmlRaw.toString("utf8");
  const parsed = parseHtmlRefs(rawHtml);

  const mapDeps = await (async () => {
    try {
      const indexRaw = await readFile(indexPath);
      return parseMapDeps(indexRaw.toString("utf8"));
    } catch {
      return [];
    }
  })();

  const references = unique([
    ...parsed.styles,
    ...parsed.scripts,
    ...mapDeps,
  ]).filter((value) => !!value);

  const assets = [];
  for (const ref of references) {
    assets.push(await hydrateAsset(ref));
  }

  const normalized = manifestFromEntries(assets);
  await mkdir(outputDir, { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(normalized, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        totalDiscovered: normalized.source.totalDiscovered,
        copied: normalized.copied.length,
        sourceAvailable: normalized.localFiles.filter((entry) => entry.sourceAvailable).length,
        scriptCount: normalized.counts.scripts,
        cssCount: normalized.counts.css,
      },
      null,
      2,
    ),
  );

  const missing = normalized.localFiles.filter(
    (entry) => !entry.sourceAvailable,
  );
  if (strict && missing.length) {
    console.error(
      `Ainda faltaram ${missing.length} arquivos (ver ${path.relative(cwd, manifestPath)})`,
    );
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Falha no pipeline de extração:", error);
  process.exitCode = 1;
});
