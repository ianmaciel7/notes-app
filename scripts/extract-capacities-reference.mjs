import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { JSDOM } from "jsdom";

const sourcePath = path.resolve(
  process.argv[2] ??
    path.join(
      process.env.USERPROFILE ?? process.cwd(),
      "Downloads",
      "Capacities.html",
    ),
);
const outputPath = path.resolve(
  process.argv[3] ??
    path.join(process.cwd(), "artifacts", "capacities-dom-official.json"),
);

const html = await readFile(sourcePath, "utf8");
const dom = new JSDOM(html);
const { document } = dom.window;

const normalizeText = (value) => value.replace(/\s+/g, " ").trim();
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function attributesFor(element) {
  return Object.fromEntries(
    [...element.attributes].map(({ name, value }) => [name, value]),
  );
}

function selectedAttributes(element, prefix) {
  return Object.fromEntries(
    [...element.attributes]
      .filter(({ name }) => name.startsWith(prefix))
      .map(({ name, value }) => [name, value]),
  );
}

function stableElementId(element, index) {
  if (element.id) return `official-${element.id}`;
  const fingerprint = [
    element.tagName.toLowerCase(),
    element.getAttribute("role") ?? "",
    element.getAttribute("aria-label") ?? "",
    normalizeText(element.textContent ?? "").slice(0, 120),
    index,
  ].join("|");
  return `official-${sha256(fingerprint).slice(0, 16)}`;
}

const allElements = [...document.querySelectorAll("*")];
const indexByElement = new Map(
  allElements.map((element, index) => [element, index]),
);
const elementIdByElement = new Map(
  allElements.map((element, index) => [
    element,
    stableElementId(element, index),
  ]),
);

const relevantPattern =
  /sidebar|calendar|daily|created|card|preview|chat|message|composer|scroll|overflow|tab|navigation|workspace|task|object/i;
const semanticTags = new Set([
  "A",
  "ARTICLE",
  "ASIDE",
  "BUTTON",
  "FOOTER",
  "H1",
  "H2",
  "H3",
  "HEADER",
  "INPUT",
  "MAIN",
  "NAV",
  "SECTION",
  "SELECT",
  "SVG",
  "TABLE",
  "TBODY",
  "TD",
  "TEXTAREA",
  "TH",
  "THEAD",
  "TR",
]);

function isRelevant(element) {
  const text = normalizeText(element.textContent ?? "");
  const attributes = attributesFor(element);
  return (
    (element.children.length === 0 && text.length > 0) ||
    semanticTags.has(element.tagName) ||
    element.hasAttribute("id") ||
    element.hasAttribute("role") ||
    element.hasAttribute("tabindex") ||
    element.hasAttribute("contenteditable") ||
    Object.keys(attributes).some((name) =>
      /^(aria-|data-|href$|style$)/.test(name),
    ) ||
    relevantPattern.test(`${element.className} ${text.slice(0, 160)}`)
  );
}

const rootStyle = document.documentElement.getAttribute("style") ?? "";
const designTokens = Object.fromEntries(
  rootStyle
    .split(";")
    .map((entry) => entry.trim())
    .filter((entry) => entry.startsWith("--"))
    .map((entry) => {
      const separator = entry.indexOf(":");
      return [
        entry.slice(0, separator).trim(),
        entry.slice(separator + 1).trim(),
      ];
    }),
);

const elements = allElements.map((element) => {
  const parent = element.parentElement;
  return {
    id: elementIdByElement.get(element),
    parentId: parent ? (elementIdByElement.get(parent) ?? null) : null,
    sourceIndex: indexByElement.get(element),
    sourceDomId: element.id || null,
    tagName: element.tagName.toLowerCase(),
    role: element.getAttribute("role"),
    accessibleName:
      element.getAttribute("aria-label") ||
      element.getAttribute("title") ||
      (semanticTags.has(element.tagName)
        ? normalizeText(element.textContent ?? "").slice(0, 240) || null
        : null),
    text:
      element.children.length === 0
        ? normalizeText(element.textContent ?? "").slice(0, 2000) || null
        : null,
    classes: String(element.className ?? "")
      .split(/\s+/)
      .filter(Boolean),
    attributes: attributesFor(element),
    dataAttributes: selectedAttributes(element, "data-"),
    ariaAttributes: selectedAttributes(element, "aria-"),
    inlineStyle: element.getAttribute("style"),
    relevant: isRelevant(element),
    state: {
      selected:
        element.getAttribute("aria-selected") === "true" ||
        element.getAttribute("aria-current") != null,
      expanded:
        element.getAttribute("aria-expanded") == null
          ? null
          : element.getAttribute("aria-expanded") === "true",
      disabled:
        element.hasAttribute("disabled") ||
        element.getAttribute("aria-disabled") === "true",
    },
  };
});

const svgs = [...document.querySelectorAll("svg")].map((svg, index) => ({
  id: elementIdByElement.get(svg),
  index,
  viewBox: svg.getAttribute("viewBox"),
  width: svg.getAttribute("width"),
  height: svg.getAttribute("height"),
  pathCount: svg.querySelectorAll("path").length,
  hash: sha256(svg.outerHTML),
  paths: [...svg.querySelectorAll("path")].map((node) =>
    node.getAttribute("d"),
  ),
  attributes: attributesFor(svg),
}));

const links = [...document.querySelectorAll("a[href]")].map((link) => ({
  id: elementIdByElement.get(link),
  href: link.getAttribute("href"),
  text: normalizeText(link.textContent ?? "") || null,
  ariaLabel: link.getAttribute("aria-label"),
}));

const previewCards = [...document.querySelectorAll(".card-width")].map(
  (card, index) => ({
    id: elementIdByElement.get(card),
    index,
    text: normalizeText(card.textContent ?? ""),
    attributes: attributesFor(card),
    links: [...card.querySelectorAll("a[href]")].map((link) => ({
      href: link.getAttribute("href"),
      text: normalizeText(link.textContent ?? "") || null,
    })),
    sourceDomIds: [...card.querySelectorAll("[id]")].map((node) => node.id),
  }),
);

const raw = {
  schemaVersion: "1.0.0",
  source: {
    path: sourcePath,
    sha256: sha256(html),
    savedFromUrl:
      html.match(/<!-- saved from url=\(\d+\)(.*?) -->/)?.[1] ?? null,
    title: document.title,
    language: document.documentElement.lang || null,
    htmlClasses: [...document.documentElement.classList],
    bodyClasses: [...document.body.classList],
  },
  designTokens,
  counts: {
    allElements: allElements.length,
    relevantElements: elements.filter((element) => element.relevant).length,
    links: links.length,
    previewCards: previewCards.length,
    svgs: svgs.length,
  },
  elements,
  links,
  previewCards,
  svgs,
};

await writeFile(outputPath, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
console.log(
  JSON.stringify(
    {
      sourcePath,
      outputPath,
      htmlSha256: raw.source.sha256,
      ...raw.counts,
      designTokens: Object.keys(designTokens).length,
    },
    null,
    2,
  ),
);
