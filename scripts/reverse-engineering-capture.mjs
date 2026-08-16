import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const runId = `reverse-run-${new Date().toISOString().replace(/[:.]/g, "-")}`;
const baseUrl = process.env.REENGINEERING_BASE_URL ?? "http://localhost:3000";
const manifestPath =
  process.env.REENGINEERING_MANIFEST_PATH ??
  path.join(root, "reverse-engineering", "reference", "manifest.json");
const viewport = {
  width: Number(process.env.REENGINEERING_VIEWPORT_WIDTH ?? "1128"),
  height: Number(process.env.REENGINEERING_VIEWPORT_HEIGHT ?? "912"),
};
const captureDir = path.join(root, "reverse-engineering", "capture", "runs", runId);
const screenshotDir = path.join(root, "reverse-engineering", "screenshots");

const defaultKeyboardKeys = [
  "Tab",
  "Shift+Tab",
  "Enter",
  "Space",
  "Escape",
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
];
const interactionsCaptureLimit = Number(
  process.env.REENGINEERING_INTERACTION_CAPTURE_LIMIT ?? "4",
);

function routeToFile(route) {
  if (!route || route === "/") return "root";
  return route
    .replace(/^\//, "")
    .replace(/\/+/g, "_")
    .replace(/_+/g, "_")
    .replace(/[^a-zA-Z0-9_\-]/g, "")
    .replace(/^_+|_+$/g, "")
    .replace(/_$/, "");
}

function keyboardListFromEnv() {
  const env = process.env.REENGINEERING_KEYBOARD_KEYS?.split(",").map((key) => key.trim()).filter(Boolean);
  return env && env.length > 0 ? env : defaultKeyboardKeys;
}

function getKnownStateForRoute(route) {
  if (route === "/" || route === "") return "DailyPageReady";
  return "ObjectTypePageLoaded";
}

async function loadManifestRoutes() {
  try {
    const raw = await readFile(manifestPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.routes) || parsed.routes.length === 0) return [];
    return [...new Set(
      parsed.routes
        .map((item) => (typeof item === "string" ? item : item?.url))
        .filter((url) => typeof url === "string" && url.trim()),
    )];
  } catch (_error) {
    return [];
  }
}

function normalizeRouteCandidate(route, defaultBase) {
  if (!route) return defaultBase;
  if (!route.startsWith("/")) return `/${route}`;
  return route;
}

function normalizeRequest(request) {
  return {
    url: request.url,
    method: request.method,
    status: request.status,
    resourceType: request.resourceType,
    fromServiceWorker: request.fromServiceWorker || false,
    fromCache: request.fromCache || false,
    timing: {
      startTime: request.timing?.startTime,
      endTime: request.timing?.endTime,
    },
  };
}

function flattenRequest(entry) {
  const start = entry.timing?.startTime ?? Date.now();
  const end = entry.timing?.endTime ?? start;
  return {
    url: entry.url,
    method: entry.method,
    resourceType: entry.resourceType || "unknown",
    status: entry.status ?? null,
    durationMs: Math.max(0, end - start),
    fromServiceWorker: entry.fromServiceWorker || false,
    fromCache: entry.fromCache || false,
  };
}

async function captureAccessibilitySnapshot(page) {
  return page.evaluate(() => {
    const normalizeText = (value) => (value ?? "").replace(/\s+/g, " ").trim();
    const root = document.querySelector("[data-audit-state]");
    const snapshots = [];
    for (const element of document.querySelectorAll("[role], button, a, input, textarea, select")) {
      if (!(element instanceof HTMLElement)) continue;

      const bounds = element.getBoundingClientRect();
      const name =
        element.getAttribute("aria-label") ??
        element.getAttribute("title") ??
        element.textContent?.trim()?.slice(0, 150) ??
        null;

      snapshots.push({
        role: element.getAttribute("role") ?? null,
        name,
        id: element.id || null,
        tag: element.tagName.toLowerCase(),
        selected: element.getAttribute("aria-selected"),
        expanded: element.getAttribute("aria-expanded"),
        checked: element.getAttribute("aria-checked"),
        checkedValue: element.getAttribute("aria-pressed"),
        disabled: element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true",
        placeholder: element.getAttribute("placeholder") || null,
        inView:
          bounds.top >= 0 &&
          bounds.left >= 0 &&
          bounds.bottom <= window.innerHeight &&
          bounds.right <= window.innerWidth,
        focused: document.activeElement === element,
        x: Math.round(bounds.x),
        y: Math.round(bounds.y),
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
      });
    }

    const active = document.activeElement;
    return {
      url: location.href,
      readyState: root?.getAttribute("data-audit-state") ?? "ready",
      readinessConditions:
        root?.getAttribute("data-audit-conditions")?.split(",").filter(Boolean) ?? [],
      pendingRequests: Number(
        root?.getAttribute("data-audit-pending-requests") ?? 0,
      ),
      snapshotCount: snapshots.length,
      focusElement: active instanceof HTMLElement
        ? {
            tag: active.tagName.toLowerCase(),
            id: active.id || null,
            role: active.getAttribute("role") || null,
            name:
              active.getAttribute("aria-label") ||
              normalizeText(active.textContent) ||
              null,
            selected: active.getAttribute("aria-selected"),
            expanded: active.getAttribute("aria-expanded"),
          }
        : null,
      snapshots,
    };
  });
}

async function captureStorage(page) {
  return page.evaluate(() => {
    const snapshot = {
      localStorage: {},
      sessionStorage: {},
    };

    for (const key of Object.keys(localStorage)) {
      snapshot.localStorage[key] = String(localStorage.getItem(key) ?? "").slice(0, 280);
    }
    for (const key of Object.keys(sessionStorage)) {
      snapshot.sessionStorage[key] = String(sessionStorage.getItem(key) ?? "").slice(0, 280);
    }

    return snapshot;
  });
}

async function captureInteractionContext(page, limit) {
  return page.evaluate((maxCandidates) => {
    const normalizeText = (value) => (value ?? "").replace(/\s+/g, " ").trim();
    const isVisible = (element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        !element.hasAttribute("disabled") &&
        rect.width > 2 &&
        rect.height > 2 &&
        rect.bottom > 0 &&
        rect.right > 0
      );
    };

    const cssPath = (element) => {
      if (element.id) return `#${CSS.escape(element.id)}`;
      const parts = [];
      let current = element;
      while (current && current.nodeType === 1 && parts.length < 5) {
        const parent = current.parentElement;
        const tag = current.tagName.toLowerCase();
        if (!parent) {
          parts.unshift(tag);
          break;
        }
        const siblings = Array.from(parent.children).filter(
          (node) => node.tagName === current.tagName,
        );
        if (siblings.length === 1) {
          parts.unshift(tag);
        } else {
          const position = siblings.indexOf(current) + 1;
          parts.unshift(`${tag}:nth-of-type(${position})`);
        }
        current = parent;
      }
      return parts.join(" > ");
    };

    const candidateSignature = (node) => {
      const text = normalizeText((node.textContent || "").slice(0, 80));
      return `${node.tagName}-${(node.getAttribute("role") || "").toLowerCase()}-${text}-${node.id || ""}`.slice(
        0,
        250,
      );
    };

    const make = (element) => {
      const descriptor = normalizeText((element.textContent || "").slice(0, 120));
      const style = window.getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        role: element.getAttribute("role") || null,
        id: element.id || null,
        ariaLabel: element.getAttribute("aria-label") || null,
        title: element.getAttribute("title") || null,
        href: element.getAttribute("href") || null,
        text: descriptor || null,
        disabled: element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true",
        cssPath: cssPath(element),
        visibleRect: element.getBoundingClientRect().toJSON(),
        hasPopup: Boolean(
          element.getAttribute("aria-haspopup") || element.getAttribute("aria-expanded") !== null,
        ),
        cursor: style.cursor,
      };
    };

    const selectors = [
      "button",
      "[role=button]",
      "[role=menuitem]",
      "[role=menu]",
      "[role=tab]",
      "[role=tablist]",
      "[role=dialog]",
      "[aria-haspopup]",
      "[data-state]",
      "a[href]",
      "input:not([type=hidden])",
      "select",
      "textarea",
      "input[type=checkbox]",
      "input[type=radio]",
      "[contenteditable='true']",
      "[role=option]",
      "[role=combobox]",
      "[role=listbox]",
    ];

    const all = [];
    const seen = new Set();
    for (const selector of selectors) {
      for (const node of document.querySelectorAll(selector)) {
        if (!(node instanceof HTMLElement)) continue;
        if (!isVisible(node)) continue;
        const descriptor = make(node);
        const sig = candidateSignature(node);
        if (seen.has(sig)) continue;
        seen.add(sig);
        all.push(descriptor);
      }
    }

    const ranked = all
      .filter((item) => item.cssPath)
      .slice(0, Math.max(1, maxCandidates * 5));

    const byText = (item) =>
        `${item.ariaLabel || ""} ${(item.text || "").toLowerCase()}`
          .toLowerCase()
          .includes("menu") ||
      (item.text || "").toLowerCase().includes("menu");

    const menuCandidate =
      ranked.find((item) => byText(item) || (item.id || "").toLowerCase().includes("menu")) ||
      ranked[0] ||
      null;
    const dialogCandidate =
      ranked.find((item) => {
        const text = `${item.text || ""} ${(item.ariaLabel || "").toLowerCase()}`;
        return (
          text.includes("novo") ||
          text.includes("add") ||
          text.includes("criar") ||
          text.includes("editar") ||
          text.includes("adicionar") ||
          item.hasPopup
        );
      }) || ranked[1] || ranked[0] || null;

    return {
      candidates: ranked.slice(0, Math.max(1, maxCandidates)),
      menuCandidate,
      dialogCandidate,
      focusRole: document.activeElement?.getAttribute("role") || null,
      focusTag: document.activeElement?.tagName?.toLowerCase() || null,
      focusId: document.activeElement?.id || null,
      total: ranked.length,
    };
  }, interactionsCaptureLimit);
}

function describeTransition(before, after, extra) {
  return {
    before: before.focusElement,
    after: after.focusElement,
    changed: Boolean(
      before?.focusElement?.id !== after?.focusElement?.id ||
      before?.focusElement?.tag !== after?.focusElement?.tag ||
      before?.focusElement?.role !== after?.focusElement?.role,
    ),
    ...extra,
  };
}

async function runSafeInteraction(page, candidate, name, fileBase, runDir) {
  if (!candidate?.cssPath) return { name, status: "notRun", reason: "candidate-missing-css-path" };
  const locator = page.locator(`css=${candidate.cssPath}`).first();
  const count = await locator.count().catch(() => 0);
  if (!count) return { name, status: "notRun", reason: "notFoundByCssPath" };
  const visible = await locator.isVisible().catch(() => false);
  if (!visible) return { name, status: "skipped", reason: "notVisible" };

  const before = await captureAccessibilitySnapshot(page);
  const storageBefore = await captureStorage(page);
  const t0 = Date.now();
  await locator.click({ timeout: 5000 });
  await page.waitForTimeout(500);

  const afterOpen = await captureAccessibilitySnapshot(page);
  const openPath = path.join(runDir, `${fileBase}-interaction-${name}-open.png`);
  await page.screenshot({ path: openPath, fullPage: false });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  const afterClose = await captureAccessibilitySnapshot(page);
  const closePath = path.join(runDir, `${fileBase}-interaction-${name}-close.png`);
  await page.screenshot({ path: closePath, fullPage: false });

  const storageAfter = await captureStorage(page);
  return {
    name,
    status: "captured",
    durationMs: Date.now() - t0,
    target: candidate,
    beforeFocus: before.focusElement,
    openFocus: afterOpen.focusElement,
    closeFocus: afterClose.focusElement,
    openDialogs: afterOpen.snapshots.filter((entry) => entry.role === "dialog").length,
    openMenus: afterOpen.snapshots.filter((entry) => entry.role === "menu").length,
    openMenuItems: afterOpen.snapshots.filter((entry) => entry.role === "menuitem").length,
    transition: describeTransition(before, afterClose, { name }),
    storageBefore,
    storageAfter,
    screenshots: [openPath, closePath],
  };
}

function buildRouteRecord({
  runId: currentRunId,
  route,
  stateBefore,
  stateAfter,
  outcomes,
  notObserved,
  errors,
  artifacts,
  confidence = "WEAKLY_INFERRED",
}) {
  return {
    runId: currentRunId,
    timestamp: new Date().toISOString(),
    surface: "object-type-workspace",
    route,
    viewport: `${viewport.width}x${viewport.height}`,
    inputType: "screenshot",
    steps: ["open route", "capture snapshot", "capture interactions", "keyboard probe"],
    result: {
      stateBefore,
      stateAfter,
      outcomes,
      notObserved,
      errors,
    },
    artifacts,
    confidence,
  };
}

async function runForRoute(page, route, keyboardKeys) {
  const routeFile = routeToFile(route);
  const url = `${baseUrl.replace(/\/+$/, "")}${route}`;
  const requests = [];
  const consoleErrors = [];
  const keyboard = [];
  const routeStartAt = Date.now();
  const pageErrors = [];

  const requestListener = (request) => {
    requests.push({
      type: "request",
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      timing: { startTime: Date.now() },
    });
  };
  const responseListener = (response) => {
    const request = response.request();
    requests.push({
      type: "response",
      url: response.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      status: response.status(),
      fromServiceWorker: response.fromServiceWorker(),
      fromCache: response.request().isNavigationRequest() ? false : false,
      timing: {
        startTime: request.timing()?.startTime ?? Date.now(),
        endTime: Date.now(),
      },
    });
  };
  const requestFailedListener = (request) => {
    requests.push({
      type: "requestfailed",
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      timing: { startTime: Date.now() },
      error: "failed",
    });
  };
  const pageErrorListener = (error) => {
    pageErrors.push(`pageerror: ${error.message}`);
  };
  const consoleListener = (message) => {
    if (message.type() === "error") {
      consoleErrors.push(`console.error: ${message.text()}`);
    }
  };

  page.on("request", requestListener);
  page.on("response", responseListener);
  page.on("requestfailed", requestFailedListener);
  page.on("pageerror", pageErrorListener);
  page.on("console", consoleListener);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    await page.mouse.move(viewport.width - 10, 10);
    await page.evaluate(() => {
      for (const element of document.querySelectorAll("[data-scroll-container]")) {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      }
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });

    const beforeSnapshot = await captureAccessibilitySnapshot(page);
    const storageBefore = await captureStorage(page);
    const screenshotPath = path.join(
      screenshotDir,
      `${routeFile}-${viewport.width}x${viewport.height}-loaded.png`,
    );
    await page.screenshot({ path: screenshotPath, fullPage: false });

    const interactionContext = await captureInteractionContext(page, interactionsCaptureLimit);
    const interactionTraces = [];

    if (interactionContext.menuCandidate) {
      interactionTraces.push(
        await runSafeInteraction(
          page,
          interactionContext.menuCandidate,
          "menu",
          routeFile,
          captureDir,
        ),
      );
    }
    if (interactionContext.dialogCandidate) {
      interactionTraces.push(
        await runSafeInteraction(
          page,
          interactionContext.dialogCandidate,
          "dialog",
          routeFile,
          captureDir,
        ),
      );
    }

    for (const key of keyboardKeys) {
      await page.keyboard.press(key);
      await page.waitForTimeout(120);
      const next = await captureAccessibilitySnapshot(page);
      keyboard.push({
        key,
        focusedTag: next.focusElement?.tag ?? null,
        focusedRole: next.focusElement?.role ?? null,
        focusedId: next.focusElement?.id ?? null,
      });
    }

    const afterSnapshot = await captureAccessibilitySnapshot(page);
    const storageAfter = await captureStorage(page);
    const stateBefore = route === "/" ? "DailyPageReady" : "ObjectTypePageLoading";
    const normalizedRequests = requests.map(normalizeRequest).map(flattenRequest);
    const readyState = afterSnapshot.readyState === "ready" ? getKnownStateForRoute(route) : "ObjectTypePageLoaded";
    const record = buildRouteRecord({
      runId,
      route,
      stateBefore,
      stateAfter: readyState,
      outcomes: [
        `Captured screenshot: ${path.basename(screenshotPath)}`,
        `Captured ${afterSnapshot.snapshotCount} accessibility snapshots`,
        `Captured ${interactionTraces.length} interaction traces`,
      ],
      notObserved: [],
      errors: [...consoleErrors, ...pageErrors],
      artifacts: {
        screenshot: screenshotPath,
        networkHar: path.join(captureDir, `${routeFile}-network.jsonl`),
        ariaSnapshot: path.join(captureDir, `${routeFile}-aria.json`),
        trace: path.join(captureDir, `${routeFile}-network.jsonl`),
      },
      confidence: normalizedRequests.length > 0 ? "OBSERVED" : "PARTIAL",
    });

    const runRecord = {
      route,
      url,
      runId,
      capturedAt: new Date().toISOString(),
      viewport,
      durationMs: Date.now() - routeStartAt,
      stateBefore,
      stateAfter: readyState,
      snapshots: { before: beforeSnapshot, after: afterSnapshot },
      keyboardTrace: keyboard,
      readyState,
      pendingRequests: afterSnapshot.pendingRequests,
      readinessConditions: afterSnapshot.readinessConditions,
      routeResult: {
        readyState,
        focusElement: afterSnapshot.focusElement,
      },
      interactionContext,
      interactionTrace: interactionTraces,
      network: normalizedRequests,
      networkMutatingGuessed:
        normalizedRequests.filter((entry) => entry.method && entry.method !== "GET").length,
      requestCount: normalizedRequests.length,
      screenshotPath,
      viewport: `${viewport.width}x${viewport.height}`,
      storageBefore,
      storageAfter,
      storageKeyCount: {
        local: Object.keys(storageAfter.localStorage || {}).length,
        session: Object.keys(storageAfter.sessionStorage || {}).length,
      },
    };

    const runRecordPath = path.join(captureDir, `${routeFile}-capture.json`);
    const networkPath = path.join(captureDir, `${routeFile}-network.jsonl`);
    const ariaPath = path.join(captureDir, `${routeFile}-aria.json`);
    const indexPath = path.join(captureDir, "index.jsonl");
    for (const request of normalizedRequests) {
      await writeFile(networkPath, `${JSON.stringify(request)}\n`, { flag: "a" });
    }
    await writeFile(ariaPath, `${JSON.stringify(afterSnapshot, null, 2)}\n`, "utf8");
    await writeFile(
      runRecordPath,
      `${JSON.stringify(runRecord, null, 2)}\n`,
      "utf8",
    );
    await writeFile(indexPath, `${JSON.stringify({ ...record, artifacts: runRecord })}\n`, {
      flag: "a",
    });
    return runRecord;
  } finally {
    page.off("request", requestListener);
    page.off("response", responseListener);
    page.off("requestfailed", requestFailedListener);
    page.off("pageerror", pageErrorListener);
    page.off("console", consoleListener);
  }
}

async function main() {
  const cliRoutes = process.argv
    .slice(2)
    .filter((arg) => arg && !arg.startsWith("--"));
  const manifestRoutes = await loadManifestRoutes();
  const manifestOrCliRoutes =
    cliRoutes.length > 0 ? cliRoutes : manifestRoutes;
  const routes =
    manifestOrCliRoutes.length > 0
      ? manifestOrCliRoutes.map((route) => normalizeRouteCandidate(route, "/"))
      : ["/"];

  const keyboardKeys = keyboardListFromEnv();

  await mkdir(captureDir, { recursive: true });
  await mkdir(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    colorScheme: "light",
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

  const runMetadata = {
    runId,
    generatedAt: new Date().toISOString(),
    baseUrl,
    viewport,
    routes,
    keyboardKeys,
    captureMode: "local",
  };
  await writeFile(path.join(captureDir, "run.json"), `${JSON.stringify(runMetadata, null, 2)}\n`, "utf8");

  const records = [];
  for (const route of routes) {
    const normalizedRoute = normalizeRouteCandidate(route, "/");
    const record = await runForRoute(page, normalizedRoute, keyboardKeys);
    records.push(record);
  }

  await page.close();
  await context.close();
  await browser.close();
  await writeFile(
    path.join(captureDir, "observations.json"),
    `${JSON.stringify(records, null, 2)}\n`,
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
