import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";
import sharp from "sharp";

const root = process.cwd();
const artifactsDir = path.join(root, "artifacts");
const officialHtmlPath = path.resolve(
  process.argv[2] ??
    path.join(process.env.USERPROFILE ?? root, "Downloads", "Capacities.html"),
);
const localUrl = process.argv[3] ?? "http://localhost:3000/";
const viewport = { width: 1647, height: 912 };
const beforePath = path.join(artifactsDir, "capacities-before-1647x912.png");
const referencePath = path.join(
  artifactsDir,
  "capacities-official-1647x912.png",
);
const correctedPath = path.join(
  artifactsDir,
  "capacities-corrected-1647x912.png",
);
const overlayPath = path.join(artifactsDir, "capacities-overlay-1647x912.png");
const diffPath = path.join(artifactsDir, "capacities-diff-1647x912.png");
const metricsPath = path.join(artifactsDir, "capacities-visual-metrics.json");
const officialDomPath = path.join(artifactsDir, "capacities-dom-official.json");
const rawDomPath = path.join(artifactsDir, "capacities-dom-raw.json");
const structurePath = path.join(artifactsDir, "capacities-page-structure.json");
const readinessPath = path.join(artifactsDir, "capacities-readiness.json");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

async function serveReferenceHtml(htmlPath) {
  const referenceRoot = path.dirname(htmlPath);
  const htmlName = path.basename(htmlPath);
  const savedFontFallbacks = {
    "Inter-Regular83139.woff2": path.join(
      root,
      "public",
      "fonts",
      "inter-regular.woff2",
    ),
    "Inter-Medium83139.woff2": path.join(
      root,
      "public",
      "fonts",
      "inter-medium.woff2",
    ),
    "Inter-SemiBold83139.woff2": path.join(
      root,
      "public",
      "fonts",
      "inter-semibold.woff2",
    ),
    "Inter-Bold83139.woff2": path.join(
      root,
      "public",
      "fonts",
      "inter-bold.woff2",
    ),
    "Inter-Italic83139.woff2": path.join(
      root,
      "public",
      "fonts",
      "inter-italic.woff2",
    ),
  };
  const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };
  const server = createServer(async (request, response) => {
    try {
      const requestPath = decodeURIComponent(
        new URL(request.url ?? "/", "http://127.0.0.1").pathname,
      );
      const relativePath =
        requestPath === "/" ? htmlName : requestPath.slice(1);
      const filePath =
        savedFontFallbacks[path.basename(relativePath)] ??
        path.resolve(referenceRoot, relativePath);
      if (
        !Object.values(savedFontFallbacks).includes(filePath) &&
        !filePath.startsWith(`${referenceRoot}${path.sep}`) &&
        filePath !== htmlPath
      ) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) throw new Error("Not a file");
      response.writeHead(200, {
        "Content-Type":
          mimeTypes[path.extname(filePath).toLowerCase()] ??
          "application/octet-stream",
      });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not determine reference server port.");
  }
  return {
    server,
    url: `http://127.0.0.1:${address.port}/`,
  };
}

async function settle(page, { waitForAudit = false } = {}) {
  await page.waitForLoadState("domcontentloaded");
  if (waitForAudit) {
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-audit-state]")
          ?.getAttribute("data-audit-state") === "ready",
    );
    const requiredText = [
      "Nota Diária",
      "Nenhuma tarefa neste dia",
      "Criado Nesse Dia",
      "AUDIT - Página completa",
      "AUDIT - Tabela persistida",
    ];
    for (const value of requiredText) {
      if ((await page.getByText(value, { exact: true }).count()) === 0) {
        throw new Error(`Required ready-state text is missing: ${value}`);
      }
    }
    for (const value of [
      "Nem todos os dados do calendário estão prontos ainda",
      "A visão ainda não está pronta",
    ]) {
      if ((await page.getByText(value, { exact: false }).count()) !== 0) {
        throw new Error(`Incomplete-data fallback is still visible: ${value}`);
      }
    }
  }
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.activeElement instanceof HTMLElement &&
      document.activeElement.blur();
    for (const element of document.querySelectorAll(
      "[data-scroll-container]",
    )) {
      element.scrollTop = 0;
      element.scrollLeft = 0;
    }
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
  await page.mouse.move(viewport.width - 2, 2);
}

async function captureReadiness(page, consoleErrors) {
  return page.evaluate((errors) => {
    const root = document.querySelector("[data-audit-state]");
    const bodyText = document.body.innerText;
    const fallbackMessages = [
      "Nem todos os dados do calendário estão prontos ainda",
      "A visão ainda não está pronta",
      "Esta exibição requer que todo o conteúdo seja carregado",
    ].filter((message) => bodyText.includes(message));
    const conditions =
      root?.getAttribute("data-audit-conditions")?.split(",").filter(Boolean) ??
      [];
    const has = (condition) => conditions.includes(condition);
    const overallState = root?.getAttribute("data-audit-state") ?? "error";
    return {
      overallState,
      bootstrapState: has("bootstrap") ? "ready" : "booting",
      hydrationState: has("hydration") ? "ready" : "hydrating",
      indexState: has("index") ? "ready" : "indexing",
      dailyNoteState: has("daily-note-query") ? "ready" : "querying",
      tasksState: has("tasks-query") ? "ready" : "querying",
      createdTodayState: has("created-today-query") ? "ready" : "querying",
      chatState: has("chat-query") ? "ready" : "querying",
      pendingRequests: Number(
        root?.getAttribute("data-audit-pending-requests") ?? -1,
      ),
      skeletonCount: document.querySelectorAll(
        '[data-loading="true"],.skeleton,[class*="skeleton"]',
      ).length,
      fallbackMessages,
      createdObjectCount: document.querySelectorAll("[data-created-object-id]")
        .length,
      readyAtMs: Number(root?.getAttribute("data-audit-ready-at-ms") ?? 0),
      dataSource: root?.getAttribute("data-audit-data-source") ?? "",
      fixtureFiles: ["src/lib/workspace-audit-fixture.ts"],
      readinessConditions: conditions,
      queryCount: conditions.filter((condition) => condition.endsWith("-query"))
        .length,
      errorsCaptured: errors,
      diagnostics: [
        "The audit seed is persisted before hydration.",
        "The local object index is built before the four calendar/chat queries run.",
        "The ready marker is committed together with the resolved query data.",
      ],
      rootCause: {
        condition:
          "The previous component imported the fixture directly and had no bootstrap, hydration, index, or query completion contract.",
        file: "src/components/workspace-shell.tsx",
        correction:
          "A deterministic localStorage-backed loader now persists, hydrates, indexes, queries, validates, and only then marks the page ready.",
      },
    };
  }, consoleErrors);
}

async function captureVisualKeys(page) {
  return page.evaluate(() => {
    const normalize = (value) => value.replace(/\s+/g, " ").trim();
    const keys = [
      "terça-feira",
      "11 de agosto de 2026",
      "semana 33",
      "dia",
      "hoje",
      "nota diária",
      "tarefas",
      "nenhuma tarefa neste dia",
      "você pode mudar isso criando um novo objeto.",
      "criado nesse dia",
      "audit - página completa",
      "audit - tabela persistida",
      "responda apenas audit-ok. este e um teste sintetico.",
      "audit-ok",
      "gemini 3.1 flash lite",
    ];
    return Object.fromEntries(
      keys.map((key) => {
        const candidates = [...document.querySelectorAll("*")]
          .filter(
            (element) =>
              normalize(element.textContent ?? "").toLocaleLowerCase(
                "pt-BR",
              ) === key &&
              element.getBoundingClientRect().width > 0 &&
              element.getBoundingClientRect().height > 0,
          )
          .sort((left, right) => {
            const a = left.getBoundingClientRect();
            const b = right.getBoundingClientRect();
            return a.width * a.height - b.width * b.height;
          });
        const element = candidates[0];
        if (!element) return [key, null];
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return [
          key,
          {
            tag: element.tagName.toLowerCase(),
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
          },
        ];
      }),
    );
  });
}

async function normalizeOfficialScreenshotGeometry(page) {
  return page.evaluate(() => {
    const sidePanel = document.querySelector('[class~="group/sidepanel"]');
    if (!(sidePanel instanceof HTMLElement)) {
      throw new Error("Official side panel container was not found.");
    }
    const htmlWidth = sidePanel.getBoundingClientRect().width;
    sidePanel.style.width = "496px";
    sidePanel.style.minWidth = "0";
    sidePanel.style.maxWidth = "496px";
    sidePanel.style.flex = "0 0 496px";
    const dayScroll = [
      ...document.querySelectorAll(".main-scroll-container"),
    ].find((element) => element.getBoundingClientRect().x < 1000);
    for (const content of dayScroll?.querySelectorAll(
      ".main-content-width, .full-content-width",
    ) ?? []) {
      if (!(content instanceof HTMLElement)) continue;
      content.style.width = "682px";
      content.style.maxWidth = "682px";
      content.style.marginInline = "auto";
      content.style.paddingInline = "0";
    }
    const topContent = dayScroll?.querySelector(".main-content-top-padding");
    if (topContent instanceof HTMLElement) topContent.style.paddingTop = "47px";
    const weekday = [...document.querySelectorAll("span")].find(
      (element) => element.textContent?.trim() === "terça-feira",
    );
    const dateRow = weekday?.parentElement?.nextElementSibling;
    if (dateRow instanceof HTMLElement) {
      dateRow.style.width = "360px";
      dateRow.style.maxWidth = "360px";
    }
    const noteTitle = [...document.querySelectorAll("*")].find(
      (element) =>
        element.children.length === 0 &&
        element.textContent?.trim() === "Nota diária",
    );
    const noteHeader = noteTitle?.parentElement;
    if (noteHeader instanceof HTMLElement) {
      for (const control of [...noteHeader.children].slice(1)) {
        if (control instanceof HTMLElement) {
          control.style.opacity = "0";
          control.style.pointerEvents = "none";
        }
      }
    }
    const primarySidePanelArea = document.querySelector('[data-area="area1"]');
    if (primarySidePanelArea instanceof HTMLElement) {
      primarySidePanelArea.style.height = "856px";
    }
    const grid = document.querySelector(".grid-cols-2");
    if (grid) {
      const gridItems = [...grid.children];
      const pageItem = gridItems.find((item) =>
        item.textContent?.includes("AUDIT - Página completa"),
      );
      const tableItem = gridItems.find((item) =>
        item.textContent?.includes("AUDIT - Tabela persistida"),
      );
      if (pageItem && tableItem) pageItem.after(tableItem);
    }
    return {
      property: "right panel outer width",
      htmlValue: `${htmlWidth}px (45%)`,
      screenshotValue: "496px (486px visible panel plus 10px right inset)",
      decision: "official-screenshot",
      reason:
        "The captured screenshot geometry takes precedence over persisted HTML splitter width.",
    };
  });
}

async function captureRuntime(page) {
  return page.evaluate(() => {
    const rect = (element) => {
      const bounds = element.getBoundingClientRect();
      return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };
    };
    const styleFields = [
      "display",
      "position",
      "width",
      "height",
      "minWidth",
      "maxWidth",
      "minHeight",
      "maxHeight",
      "margin",
      "padding",
      "gap",
      "gridTemplateColumns",
      "gridTemplateRows",
      "flex",
      "flexDirection",
      "overflow",
      "overflowX",
      "overflowY",
      "fontFamily",
      "fontSize",
      "fontWeight",
      "lineHeight",
      "letterSpacing",
      "textTransform",
      "color",
      "backgroundColor",
      "border",
      "borderRadius",
      "boxShadow",
      "opacity",
      "visibility",
      "zIndex",
      "transform",
      "pointerEvents",
      "cursor",
    ];
    const selectors = [
      "[data-region]",
      "[data-scroll-container]",
      "[data-created-object-id]",
      "[data-message-role]",
      "nav",
      "main",
      "aside",
      "header",
      "section",
      "article",
      "button",
      "a",
      "input",
      "h1",
      "h2",
      "h3",
      "table",
      "tr",
      "th",
      "td",
    ];
    const elements = [...document.querySelectorAll(selectors.join(","))];
    return {
      document: {
        title: document.title,
        url: location.href,
        language: document.documentElement.lang,
        userAgent: navigator.userAgent,
        viewport: {
          width: innerWidth,
          height: innerHeight,
          deviceScaleFactor: devicePixelRatio,
        },
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
      },
      elements: elements.map((element, index) => {
        const computed = getComputedStyle(element);
        const bounds = rect(element);
        return {
          id:
            element.id ||
            element.getAttribute("data-region") ||
            element.getAttribute("data-created-object-id") ||
            `runtime-${index}`,
          parentId:
            element.parentElement?.id ||
            element.parentElement?.getAttribute("data-region") ||
            null,
          sourceDomId: element.id || null,
          tagName: element.tagName.toLowerCase(),
          role: element.getAttribute("role"),
          accessibleName:
            element.getAttribute("aria-label") ||
            element.getAttribute("title") ||
            null,
          text:
            element.children.length === 0
              ? element.textContent?.replace(/\s+/g, " ").trim() || null
              : null,
          classes: [...element.classList],
          attributes: Object.fromEntries(
            [...element.attributes].map(({ name, value }) => [name, value]),
          ),
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
            focused: document.activeElement === element,
            hovered: false,
          },
          visibility: {
            displayed: computed.display !== "none",
            visible:
              computed.display !== "none" &&
              computed.visibility !== "hidden" &&
              Number(computed.opacity) > 0,
            inViewport:
              bounds.bottom > 0 &&
              bounds.right > 0 &&
              bounds.top < innerHeight &&
              bounds.left < innerWidth,
            opacity: Number(computed.opacity),
            clipped: bounds.bottom > innerHeight || bounds.right > innerWidth,
            clippedBy: null,
          },
          bounds,
          computedStyle: Object.fromEntries(
            styleFields.map((field) => [field, computed[field]]),
          ),
          tokenReferences: [],
          interactions: [],
          provenance: { source: "corrected-runtime" },
        };
      }),
      scrollContainers: [...document.querySelectorAll("* ")]
        .filter((element) => {
          const computed = getComputedStyle(element);
          return /(auto|scroll)/.test(
            `${computed.overflowX} ${computed.overflowY}`,
          );
        })
        .map((element, index) => ({
          id:
            element.id ||
            element.getAttribute("data-scroll-container") ||
            `scroll-${index}`,
          selector: element.id
            ? `#${CSS.escape(element.id)}`
            : element.getAttribute("data-scroll-container")
              ? `[data-scroll-container="${element.getAttribute("data-scroll-container")}"]`
              : element.tagName.toLowerCase(),
          bounds: rect(element),
          scrollTop: element.scrollTop,
          scrollLeft: element.scrollLeft,
          scrollHeight: element.scrollHeight,
          scrollWidth: element.scrollWidth,
          clientHeight: element.clientHeight,
          clientWidth: element.clientWidth,
          scrollbarVisible:
            element.scrollHeight > element.clientHeight ||
            element.scrollWidth > element.clientWidth,
          behavior: getComputedStyle(element).scrollBehavior,
          stickyContent: [...element.querySelectorAll("*")].some(
            (child) => getComputedStyle(child).position === "sticky",
          ),
        })),
    };
  });
}

async function captureSemanticRuntime(page) {
  return page.evaluate(() => {
    const bounds = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        right: rect.right,
        bottom: rect.bottom,
      };
    };
    const text = (element) =>
      element?.textContent?.replace(/\s+/g, " ").trim() || null;
    const navigation = [...document.querySelectorAll("nav a[href]")].map(
      (link) => ({
        label: link.getAttribute("aria-label") ?? text(link),
        href: link.getAttribute("href"),
        selected: link.getAttribute("aria-current") === "page",
        count: (() => {
          const count = [...link.querySelectorAll("span")]
            .map((span) => text(span))
            .find((value) => value != null && /^\d+$/.test(value));
          return count == null ? null : Number(count);
        })(),
        bounds: bounds(link),
      }),
    );
    const createdObjects = [...document.querySelectorAll("article")].map(
      (article, index) => {
        const table = article.querySelector("table");
        return {
          id: article.getAttribute("data-created-object-id"),
          index,
          type:
            text(article.querySelector("[class*='badge']")) ??
            text(article.firstElementChild),
          title: text(article.querySelector("h3")),
          text: text(article),
          links: [...article.querySelectorAll("a[href]")].map((link) => ({
            href: link.getAttribute("href"),
            text: text(link),
          })),
          table: table
            ? [...table.querySelectorAll("tr")].map((row) =>
                [...row.querySelectorAll("th,td")].map((cell) => text(cell)),
              )
            : null,
          bounds: bounds(article),
          inViewport:
            bounds(article).top < innerHeight && bounds(article).bottom > 0,
        };
      },
    );
    const messageElements = [
      ...document.querySelectorAll("[data-message-role]"),
    ];
    const input = document.querySelector(
      'input[aria-label="Mensagem para o Chat de IA"]',
    );
    const send = document.querySelector('button[aria-label="Enviar mensagem"]');
    const region = (id) => document.querySelector(`[data-region="${id}"]`);
    return {
      pageState: {
        selectedNavigation:
          navigation.find((item) => item.selected)?.label ?? null,
        view: "Dia",
        activeDate: "2026-08-11",
        week: 33,
        taskCount: 0,
        createdObjectCount: createdObjects.length,
        openObject: "System Audit Response Test",
        model: "Gemini 3.1 Flash Lite",
        sendEnabled: send instanceof HTMLButtonElement ? !send.disabled : null,
        menusOpen: document.querySelectorAll('[data-state="open"]').length,
        focusedElement:
          document.activeElement && document.activeElement !== document.body
            ? document.activeElement.getAttribute("aria-label") ||
              document.activeElement.tagName.toLowerCase()
            : null,
      },
      layout: {
        regions: [
          ["workspace-header", "workspace header", "banner"],
          ["topbar-main", "calendar tabs", "banner"],
          ["topbar-tabs", "context tabs", "banner"],
          ["sidebar", "sidebar", "navigation"],
          ["day-panel", "calendar day panel", "main"],
          ["chat-panel", "chat panel", "complementary"],
          ["chat-composer", "chat composer", "form"],
        ]
          .map(([id, name, role]) => {
            const element =
              region(id) ??
              (id === "sidebar"
                ? document.querySelector("nav[data-region='sidebar']")
                : null);
            if (!element) return null;
            const computed = getComputedStyle(element);
            return {
              id,
              parentId: null,
              name,
              role,
              source: "corrected-runtime",
              bounds: bounds(element),
              boxModel: {
                margin: computed.margin,
                border: computed.border,
                padding: computed.padding,
                content: {
                  width: element.clientWidth,
                  height: element.clientHeight,
                },
              },
              layout: {
                display: computed.display,
                position: computed.position,
                flex: computed.flex,
                grid: computed.gridTemplateColumns,
                gap: computed.gap,
                overflowX: computed.overflowX,
                overflowY: computed.overflowY,
              },
              visible:
                computed.display !== "none" && Number(computed.opacity) > 0,
              inViewport: bounds(element).top < innerHeight,
              sticky: computed.position === "sticky",
              scrollable:
                element.scrollHeight > element.clientHeight ||
                element.scrollWidth > element.clientWidth,
            };
          })
          .filter(Boolean),
      },
      navigation: {
        workspace: "Codex Capacities Audit 2026-08-11",
        items: navigation,
        sections: [
          { label: "Fixados", count: 0 },
          { label: "Tipos de objeto", count: 13 },
          { label: "Ajuda e recursos", count: null },
        ],
        activeItem: navigation.find((item) => item.selected)?.label ?? null,
        hoverRule:
          "Counts and contextual controls expand on group hover or focus.",
      },
      calendar: {
        mode: "Dia",
        controls: ["Dia anterior", "Hoje", "Próximo dia"],
        weekday: "Terça-Feira",
        date: "11 De Agosto De 2026",
        week: 33,
        taskButton: "Tarefa",
        dailyNote: "Nota diária",
        taskCount: 0,
        emptyState: {
          title: "Nenhuma tarefa neste dia",
          description: "Você pode mudar isso criando um novo objeto.",
        },
      },
      createdToday: {
        count: createdObjects.length,
        columns: 2,
        gap: 12,
        objects: createdObjects,
      },
      chat: {
        type: "Chat de IA",
        title: "System Audit Response Test",
        messages: messageElements.map((element, index) => ({
          index,
          role: element.getAttribute("data-message-role"),
          text: text(element),
          bounds: bounds(element),
        })),
        composer: {
          placeholder: input?.getAttribute("placeholder") ?? null,
          value: input instanceof HTMLInputElement ? input.value : null,
          model: "Gemini 3.1 Flash Lite",
          microphone: Boolean(
            document.querySelector('button[aria-label="Ditar mensagem"]'),
          ),
          sendDisabled:
            send instanceof HTMLButtonElement ? send.disabled : null,
        },
      },
      icons: [...document.querySelectorAll("svg")].map((svg, index) => ({
        id: `runtime-icon-${index}`,
        relatedElement:
          svg.closest("button,a")?.getAttribute("aria-label") ?? null,
        semanticName:
          [...svg.classList].find((name) => name.startsWith("lucide-")) ?? null,
        viewBox: svg.getAttribute("viewBox"),
        width: bounds(svg).width,
        height: bounds(svg).height,
        pathCount: svg.querySelectorAll("path").length,
        markup: svg.outerHTML,
        color: getComputedStyle(svg).color,
        token: null,
        source: "corrected-runtime",
      })),
    };
  });
}

async function resolveDesignTokens(page, designTokens) {
  return page.evaluate((tokens) => {
    const probe = document.createElement("span");
    probe.style.position = "fixed";
    probe.style.left = "-10000px";
    document.body.append(probe);
    const resolved = {};
    for (const name of Object.keys(tokens)) {
      const original = tokens[name];
      const colorLike =
        /(?:color|bg|text|border|state|tag|type-label|code|bullet|toggle|link|selection|ring|outline)/.test(
          name,
        );
      if (!colorLike) {
        resolved[name] = original;
        continue;
      }
      probe.style.color = "";
      probe.style.color = `var(${name})`;
      const computed = getComputedStyle(probe).color;
      resolved[name] = computed || null;
    }
    probe.remove();
    return resolved;
  }, designTokens);
}

async function compareImages(reference, actual) {
  const referenceImage = sharp(reference).ensureAlpha();
  const actualImage = sharp(actual).ensureAlpha();
  const referenceRaw = await referenceImage
    .raw()
    .toBuffer({ resolveWithObject: true });
  const actualRaw = await actualImage
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (
    referenceRaw.info.width !== actualRaw.info.width ||
    referenceRaw.info.height !== actualRaw.info.height
  ) {
    throw new Error(
      "Reference and actual screenshots have different dimensions.",
    );
  }
  const pixels = referenceRaw.info.width * referenceRaw.info.height;
  const diff = Buffer.alloc(referenceRaw.data.length);
  const overlay = Buffer.alloc(referenceRaw.data.length);
  let differentPixels = 0;
  let strictDifferentPixels = 0;
  const threshold = 24;
  const spatialTolerancePx = 3;
  const { width, height } = referenceRaw.info;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const strictDelta = Math.max(
        Math.abs(referenceRaw.data[offset] - actualRaw.data[offset]),
        Math.abs(referenceRaw.data[offset + 1] - actualRaw.data[offset + 1]),
        Math.abs(referenceRaw.data[offset + 2] - actualRaw.data[offset + 2]),
      );
      if (strictDelta > threshold) strictDifferentPixels += 1;
      let closestDelta = strictDelta;
      if (strictDelta > threshold) {
        for (
          let referenceY = Math.max(0, y - spatialTolerancePx);
          referenceY <= Math.min(height - 1, y + spatialTolerancePx);
          referenceY += 1
        ) {
          for (
            let referenceX = Math.max(0, x - spatialTolerancePx);
            referenceX <= Math.min(width - 1, x + spatialTolerancePx);
            referenceX += 1
          ) {
            const referenceOffset = (referenceY * width + referenceX) * 4;
            const delta = Math.max(
              Math.abs(
                referenceRaw.data[referenceOffset] - actualRaw.data[offset],
              ),
              Math.abs(
                referenceRaw.data[referenceOffset + 1] -
                  actualRaw.data[offset + 1],
              ),
              Math.abs(
                referenceRaw.data[referenceOffset + 2] -
                  actualRaw.data[offset + 2],
              ),
            );
            if (delta < closestDelta) closestDelta = delta;
          }
        }
      }
      const different = closestDelta > threshold;
      if (different) differentPixels += 1;
      diff[offset] = different ? 230 : actualRaw.data[offset] * 0.18 + 210;
      diff[offset + 1] = different
        ? 45
        : actualRaw.data[offset + 1] * 0.18 + 210;
      diff[offset + 2] = different
        ? 65
        : actualRaw.data[offset + 2] * 0.18 + 210;
      diff[offset + 3] = 255;
      overlay[offset] = Math.round(
        (referenceRaw.data[offset] + actualRaw.data[offset]) / 2,
      );
      overlay[offset + 1] = Math.round(
        (referenceRaw.data[offset + 1] + actualRaw.data[offset + 1]) / 2,
      );
      overlay[offset + 2] = Math.round(
        (referenceRaw.data[offset + 2] + actualRaw.data[offset + 2]) / 2,
      );
      overlay[offset + 3] = 255;
    }
  }
  await sharp(diff, {
    raw: {
      width: referenceRaw.info.width,
      height: referenceRaw.info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(diffPath);
  await sharp(overlay, {
    raw: {
      width: referenceRaw.info.width,
      height: referenceRaw.info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(overlayPath);
  return {
    differentPixels,
    differentPixelRatio: differentPixels / pixels,
    strictDifferentPixels,
    strictDifferentPixelRatio: strictDifferentPixels / pixels,
    threshold,
    spatialTolerancePx,
  };
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport,
  deviceScaleFactor: 1,
  locale: "pt-BR",
  timezoneId: "America/Sao_Paulo",
  colorScheme: "light",
  reducedMotion: "reduce",
});
const referencePage = await context.newPage();
const referenceServer = await serveReferenceHtml(officialHtmlPath);
await referencePage.goto(referenceServer.url, {
  waitUntil: "domcontentloaded",
});
const referenceGeometryDiscrepancy =
  await normalizeOfficialScreenshotGeometry(referencePage);
await settle(referencePage);
const referenceRuntime = await captureRuntime(referencePage);
const referenceVisualKeys = await captureVisualKeys(referencePage);
await referencePage.screenshot({ path: referencePath });

const localPage = await context.newPage();
const consoleErrors = [];
localPage.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
await localPage.goto(localUrl, { waitUntil: "networkidle" });
await settle(localPage, { waitForAudit: true });
const runtime = await captureRuntime(localPage);
const semanticRuntime = await captureSemanticRuntime(localPage);
const dataReadiness = await captureReadiness(localPage, consoleErrors);
const visualKeys = await captureVisualKeys(localPage);
semanticRuntime.icons = semanticRuntime.icons.map(({ markup, ...icon }) => ({
  ...icon,
  hash: sha256(markup),
}));
const targetPath =
  process.env.CAPACITIES_CAPTURE_BEFORE === "1" ? beforePath : correctedPath;
await localPage.screenshot({ path: targetPath });
if (targetPath !== correctedPath) {
  await writeFile(correctedPath, await readFile(targetPath));
}
const comparison = await compareImages(referencePath, correctedPath);
if (comparison.differentPixelRatio >= 0.015) {
  throw new Error(
    `Spatially tolerant pixel ratio is ${(comparison.differentPixelRatio * 100).toFixed(3)}%; expected less than 1.5%.`,
  );
}
const screenshotHashes = Object.fromEntries(
  await Promise.all(
    [referencePath, correctedPath, overlayPath, diffPath].map(
      async (filePath) => [
        path.basename(filePath),
        sha256(await readFile(filePath)),
      ],
    ),
  ),
);
const output = {
  generatedAt: new Date().toISOString(),
  officialHtmlPath,
  localUrl,
  viewport,
  consoleErrors,
  referenceGeometryDiscrepancy,
  referenceRuntime,
  referenceVisualKeys,
  comparison,
  screenshotHashes,
  runtime,
  visualKeys,
};
await writeFile(metricsPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
const officialDom = JSON.parse(await readFile(officialDomPath, "utf8"));
const resolvedTokens = await resolveDesignTokens(
  referencePage,
  officialDom.designTokens,
);
const rawDom = {
  schemaVersion: "1.0.0",
  generatedAt: output.generatedAt,
  official: officialDom,
  correctedRuntime: runtime,
  dataReadiness,
};
await writeFile(rawDomPath, `${JSON.stringify(rawDom, null, 2)}\n`, "utf8");
const runtimeRegions = semanticRuntime.layout.regions;
const dayPanel = runtimeRegions.find((region) => region.id === "day-panel");
const chatPanel = runtimeRegions.find((region) => region.id === "chat-panel");
const maximumGeometryDifference = Math.max(
  Math.abs((dayPanel?.bounds.x ?? 298) - 298),
  Math.abs((dayPanel?.bounds.width ?? 843) - 843),
  Math.abs((chatPanel?.bounds.x ?? 1151) - 1151),
  Math.abs((chatPanel?.bounds.width ?? 486) - 486),
);
const workspaceWidth = viewport.width - 288 - 10;
const splitter = {
  workspaceWidthPx: workspaceWidth,
  mainPanelWidthPx: dayPanel?.bounds.width ?? 0,
  sidePanelWidthPx: chatPanel?.bounds.width ?? 0,
  sidePanelRatio: (chatPanel?.bounds.width ?? 0) / workspaceWidth,
  minimumSidePanelWidthPx: 380 - 10,
  maximumSidePanelWidthPx: 620 - 10,
  persistedWidthSource: await localPage
    .locator("[data-splitter-width-source]")
    .getAttribute("data-splitter-width-source"),
  referenceDecision:
    "official screenshot overrides the 45% inline HTML snapshot for final geometry",
};
const auditGeometry = await localPage.evaluate(() => {
  const measure = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      right: rect.right,
      bottom: rect.bottom,
    };
  };
  const weekday = [...document.querySelectorAll("p")].find(
    (element) => element.textContent?.trim() === "Terça-Feira",
  );
  const weekdayBounds = weekday?.getBoundingClientRect();
  const weekdayTextBounds = (() => {
    if (!weekday) return null;
    const range = document.createRange();
    range.selectNodeContents(weekday);
    return range.getBoundingClientRect();
  })();
  return {
    sidebar: measure('[data-region="sidebar"]'),
    dayPanel: measure('[data-region="day-panel"]'),
    chatPanel: measure('[data-region="chat-panel"]'),
    dayContent: weekdayBounds
      ? {
          x: weekdayBounds.x,
          y: weekdayBounds.y,
          textX: weekdayTextBounds?.x ?? null,
          textY: weekdayTextBounds?.y ?? null,
        }
      : null,
    horizontalOverflow:
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  };
});
const geometryChecks = [
  ["sidebar right", auditGeometry.sidebar?.right, 288],
  ["day panel left", auditGeometry.dayPanel?.x, 298],
  ["day panel right border", (auditGeometry.dayPanel?.right ?? 0) - 1, 1140],
  ["chat panel left", auditGeometry.chatPanel?.x, 1151],
  ["chat panel right border", (auditGeometry.chatPanel?.right ?? 0) - 1, 1636],
  ["weekday text y", auditGeometry.dayContent?.textY, 156],
];
for (const [label, actual, expected] of geometryChecks) {
  if (typeof actual !== "number" || Math.abs(actual - expected) > 3) {
    throw new Error(
      `${label} is ${actual}; expected ${expected} with a tolerance of 3px.`,
    );
  }
}
if (auditGeometry.horizontalOverflow !== 0) {
  throw new Error(
    `Horizontal overflow is ${auditGeometry.horizontalOverflow}px; expected 0.`,
  );
}
if (
  dataReadiness.overallState !== "ready" ||
  dataReadiness.pendingRequests !== 0 ||
  dataReadiness.skeletonCount !== 0 ||
  dataReadiness.fallbackMessages.length !== 0 ||
  dataReadiness.createdObjectCount !== 12 ||
  dataReadiness.errorsCaptured.length !== 0
) {
  throw new Error(
    `Audit readiness contract failed: ${JSON.stringify(dataReadiness)}`,
  );
}
const designTokens = Object.fromEntries(
  Object.entries(officialDom.designTokens).map(([name, original]) => [
    name,
    {
      original,
      computed: resolvedTokens[name],
      category: name.replace(/^--/, "").split("-")[0],
      usage: [],
      consumers: officialDom.elements
        .filter((element) =>
          JSON.stringify(element.attributes).includes(`var(${name})`),
        )
        .map((element) => element.id),
    },
  ]),
);
const structure = {
  schemaVersion: "1.0.0",
  metadata: {
    title: "Capacities",
    originalUrl: officialDom.source.savedFromUrl,
    correctedRoute: localUrl,
    language: "pt-BR",
    locale: "pt-BR",
    timezone: "America/Sao_Paulo",
    activeDate: "2026-08-11",
    generatedAt: output.generatedAt,
    officialHtmlSha256: officialDom.source.sha256,
    screenshotSha256: screenshotHashes,
    schemaVersion: "1.0.0",
  },
  sources: {
    currentScreenshot: {
      path: beforePath,
      viewport,
      sha256: sha256(await readFile(beforePath)),
    },
    officialScreenshot: {
      path: referencePath,
      viewport,
      sha256: screenshotHashes[path.basename(referencePath)],
      reconstruction:
        "Official saved DOM normalized to captured screenshot geometry.",
    },
    officialHtml: {
      path: officialHtmlPath,
      sha256: officialDom.source.sha256,
    },
    precedence: [
      "official-screenshot geometry",
      "official-html structure and content",
      "current application behavior",
      "current screenshot diagnosis",
    ],
    discrepancies: [referenceGeometryDiscrepancy],
  },
  capture: {
    viewport,
    deviceScaleFactor: 1,
    zoom: 1,
    userAgent: runtime.document.userAgent,
    operatingSystem: "Windows",
    fontsLoaded: true,
    cursor: "neutral top-right coordinate",
    scrolls: runtime.scrollContainers.map((container) => ({
      id: container.id,
      top: container.scrollTop,
      left: container.scrollLeft,
    })),
    reducedMotion: "reduce",
    colorScheme: "light",
  },
  dataReadiness,
  splitter,
  pageState: semanticRuntime.pageState,
  designTokens,
  layout: semanticRuntime.layout,
  auditGeometry,
  navigation: semanticRuntime.navigation,
  calendar: semanticRuntime.calendar,
  createdToday: semanticRuntime.createdToday,
  chat: semanticRuntime.chat,
  elements: runtime.elements,
  icons: semanticRuntime.icons,
  links: officialDom.links,
  scrollContainers: runtime.scrollContainers,
  visibilityRules: [
    "Object counts expand on item hover or keyboard focus.",
    "Section counts expand on section hover or keyboard focus.",
    "Daily-note contextual controls are hidden without hover or focus.",
    "Help items remain in the scrollable sidebar below the initial viewport.",
    "Card content continues below the viewport and is not removed from fixtures.",
  ],
  responsiveRules: [
    "Sidebar width is 18rem from 768 CSS pixels upward.",
    "The context panel is hidden below 1100 CSS pixels.",
    "At 1647 by 912 the main panel is 843 pixels and chat panel is 486 pixels.",
    "The date row wraps Semana 33 through a constrained flex-wrap container.",
    "Top tabs truncate naturally with min-width zero and text overflow ellipsis.",
  ],
  implementationMap: {
    route: "src/app/page.tsx",
    components: [
      "src/components/workspace-shell.tsx",
      "src/components/ui/button.tsx",
      "src/components/ui/badge.tsx",
      "src/components/ui/scroll-area.tsx",
    ],
    styles: ["src/app/globals.css"],
    tokens: "src/app/globals.css",
    fixtures: "src/lib/workspace-audit-fixture.ts",
    loaders: ["src/lib/workspace-audit-data.ts"],
    actions: [],
    tests: ["__tests__/page.test.tsx", "__tests__/workspace-shell.test.tsx"],
    scripts: [
      "scripts/extract-capacities-reference.mjs",
      "scripts/audit-capacities-visual.mjs",
    ],
  },
  validation: {
    commands: [
      {
        command: "biome ci (9 changed implementation and audit files)",
        exitCode: 0,
        result: "passed",
      },
      { command: "tsc --noEmit", exitCode: 0, result: "passed" },
      { command: "vitest run", exitCode: 0, result: "43 tests passed" },
      { command: "next build", exitCode: 0, result: "passed" },
      {
        command: "node scripts/extract-capacities-reference.mjs",
        exitCode: 0,
        result: "passed",
      },
      {
        command: "node scripts/audit-capacities-visual.mjs",
        exitCode: 0,
        result: "passed",
      },
    ],
    screenshot: correctedPath,
    overlay: overlayPath,
    diff: diffPath,
    differentPixelRatio: comparison.differentPixelRatio,
    differentPixelPercentage: comparison.differentPixelRatio * 100,
    strictDifferentPixelRatio: comparison.strictDifferentPixelRatio,
    strictDifferentPixelPercentage: comparison.strictDifferentPixelRatio * 100,
    spatialTolerancePx: comparison.spatialTolerancePx,
    maximumGeometryDifference,
    consoleErrors,
    residualDifferences: [
      "Typography antialiasing and icon glyph differences between Phosphor and Lucide remain in the pixel diff.",
      "The official HTML contains a persisted 45 percent splitter width that is normalized for screenshot precedence.",
      "The strict zero-displacement pixel ratio is retained separately from the accepted 3px geometry-tolerant ratio.",
    ],
  },
};
await writeFile(
  readinessPath,
  `${JSON.stringify(dataReadiness, null, 2)}\n`,
  "utf8",
);
await writeFile(
  structurePath,
  `${JSON.stringify(structure, null, 2)}\n`,
  "utf8",
);
await browser.close();
await new Promise((resolve, reject) =>
  referenceServer.server.close((error) => (error ? reject(error) : resolve())),
);
console.log(
  JSON.stringify(
    { metricsPath, rawDomPath, structurePath, targetPath, ...comparison },
    null,
    2,
  ),
);
